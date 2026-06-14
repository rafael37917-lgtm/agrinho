/**
 * Agro Forte — sketch.js | p5.js | Agrinho 2026 — Subcategoria 3
 *
 * Mini-jogo no hero: plantar → chuva → colheita → caminhão → reinício.
 *
 * Funções p5 usadas: setup(), draw(), mousePressed(), touchStarted(),
 * windowResized(), map(), dist(), lerp(), lerpColor(), sin(), cos().
 */

// ── Estado global ───────────────────────────────────────────────────────────

let plants = [];
let rainDrops = [];
let harvestSparks = [];
let grainFlights = [];
let stars = [];
let reduceMotion = false;
let sketchObserver = null;
let introDismissed = false;
let introStartMs = 0;
let gamePhase = 'planting'; // planting | raining | truck_in | harvest | truck_out
let phaseStartMs = 0;
let truckX = 0;
let harvestedCount = 0;
let lastCanvasW = 0;
let lastCanvasH = 0;
let touchStartY = 0;
let touchStartX = 0;

const MAX_PLANTS = 10;
const SOIL_RATIO = 0.36;
const STAR_COUNT = 52;
const INTRO_MS = 4500;

// ── Canvas e inicialização ──────────────────────────────────────────────────

/** Lê o tamanho real do container HTML para o canvas responsivo. */
function canvasSize() {
  const container = document.getElementById('agroSketch');
  if (!container) return { w: 400, h: 300 };

  const rect = container.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height)) || Math.round(w * 0.75);
  return { w, h };
}

function setup() {
  const container = document.getElementById('agroSketch');
  if (!container) return;

  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  initStars();
  const { w, h } = canvasSize();
  const canvas = createCanvas(w, h);
  canvas.parent('agroSketch');
  canvas.elt.style.touchAction = 'manipulation';
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  resetGame(true);
  bindSketchResize(container);
  bindSketchVisibility(container);
  queueResize();
}

function initStars() {
  stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: (i * 73 + 17) % 97 / 97,
      y: (i * 41 + 11) % 53 / 53,
      size: 1.4 + (i % 4) * 0.55,
      phase: i * 0.9,
      speed: 0.05 + (i % 5) * 0.025
    });
  }
}

/** Zera partículas e volta à fase de plantio. */
function resetGame(restartIntro) {
  plants = [];
  rainDrops = [];
  harvestSparks = [];
  grainFlights = [];
  harvestedCount = 0;
  harvestHintDismissed = false;
  gamePhase = 'planting';
  phaseStartMs = millis();
  truckX = width + 90;
  if (restartIntro) {
    introStartMs = millis();
    introDismissed = false;
  }
}

function bindSketchResize(container) {
  if (typeof ResizeObserver === 'undefined') return;
  sketchObserver = new ResizeObserver(() => queueResize());
  sketchObserver.observe(container);
}

function bindSketchVisibility(container) {
  if (typeof IntersectionObserver === 'undefined') return;
  const visObs = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (visible) loop();
      else noLoop();
    },
    { threshold: 0.08 }
  );
  visObs.observe(container);
}

function queueResize() {
  requestAnimationFrame(() => {
    const container = document.getElementById('agroSketch');
    if (!container) return;
    const { w, h } = canvasSize();
    if (w <= 0 || h <= 0) return;
    if (w === lastCanvasW && h === lastCanvasH) return;
    lastCanvasW = w;
    lastCanvasH = h;
    resizeCanvas(w, h);
  });
}

function setPhase(next) {
  if (next === 'harvest') harvestHintDismissed = false;
  gamePhase = next;
  phaseStartMs = millis();
}

function phaseElapsed() {
  return millis() - phaseStartMs;
}

// ── Caminhão ────────────────────────────────────────────────────────────────

function truckParkX() {
  return width * 0.1;
}

function truckY() {
  return soilTopY() + 18;
}

function truckScale() {
  return hudScale();
}

/** Retângulo usado para esconder plantas atrás do caminhão. */
function truckBounds() {
  const s = truckScale();
  const x = truckX;
  const y = truckY();
  const w = 96 * s;
  const bodyH = 20 * s;
  return {
    left: x - 4 * s,
    right: x + w + 4 * s,
    top: y - 16 * s,
    bottom: y + bodyH + 14 * s
  };
}

/** Área reservada onde o jogador não pode plantar sementes. */
function truckReserveZone() {
  const s = truckScale();
  return {
    left: truckParkX() - 8 * s,
    right: truckParkX() + 100 * s
  };
}

function plantHiddenByTruck(plant) {
  if (gamePhase === 'planting' || gamePhase === 'raining') return false;
  const zone = truckBounds();
  return plant.x >= zone.left && plant.x <= zone.right;
}

// ── Loop principal ──────────────────────────────────────────────────────────

function draw() {
  if (!document.getElementById('agroSketch')) return;

  updateGame();
  drawSky();
  drawStars();
  drawSunOrMoon();
  drawClouds();
  if (gamePhase === 'raining') drawRainClouds();
  drawHills();
  drawSoil();
  drawPlants();
  updateRain();
  drawTruck();
  if (gamePhase === 'harvest') drawHarvestHint();
  drawGrainFlights();
  drawHarvestSparks();
  if (gamePhase === 'planting') drawIntroCard();
}

/**
 * Avança as fases do mini-jogo conforme o tempo e o progresso do jogador.
 * planting → raining → truck_in → harvest → truck_out → planting
 */
function updateGame() {
  if (gamePhase === 'planting' && plants.length >= MAX_PLANTS) {
    dismissIntro();
    setPhase('raining');
  }

  if (gamePhase === 'raining') {
    if (!reduceMotion) spawnRainDrop(random(width), random(-40, soilTopY() * 0.35), random(3, 5.5));
    growPlants(0.022);
    if (phaseElapsed() > 3200) setPhase('truck_in');
  }

  if (gamePhase === 'truck_in') {
    const t = constrain(phaseElapsed() / 1800, 0, 1);
    truckX = lerp(width + 90, truckParkX(), t);
    if (phaseElapsed() > 2000) setPhase('harvest');
  }

  if (gamePhase === 'harvest' && plants.length === 0 && harvestedCount >= MAX_PLANTS) {
    setPhase('truck_out');
  }

  if (gamePhase === 'truck_out') {
    const t = constrain(phaseElapsed() / 2200, 0, 1);
    truckX = lerp(truckParkX(), -130, t);
    if (phaseElapsed() > 2400) resetGame(true);
  }

  // Broto inicial: cresce um pouco, mas só floresce na chuva (growPlants).
  if (gamePhase === 'planting' && !reduceMotion) {
    for (const plant of plants) {
      plant.age = min(plant.age + 0.005, 0.34);
    }
  }
}

// ── Eventos (mouse e toque) ─────────────────────────────────────────────────

function mousePressed() {
  if (!mouseInsideCanvas()) return;
  dismissIntro();
  handleSketchTap(mouseX, mouseY);
}

function touchStarted() {
  if (!mouseInsideCanvas()) return;
  touchStartX = touchX();
  touchStartY = touchY();
  dismissIntro();
}

function touchEnded() {
  if (!mouseInsideCanvas()) return;
  if (abs(touchX() - touchStartX) > 12 || abs(touchY() - touchStartY) > 12) return;
  handleSketchTap(touchX(), touchY());
}

function handleSketchTap(x, y) {
  if (gamePhase === 'planting') tryPlantSeed(x, y);
  else if (gamePhase === 'harvest') tryHarvestClick(x, y);
}

function touchX() {
  return touches.length > 0 ? touches[0].x : mouseX;
}

function touchY() {
  return touches.length > 0 ? touches[0].y : mouseY;
}

function windowResized() {
  const container = document.getElementById('agroSketch');
  if (container) {
    const { w, h } = canvasSize();
    resizeCanvas(w, h);
  }
}

function mouseInsideCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

// ── Utilitários ─────────────────────────────────────────────────────────────

function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

function soilTopY() {
  return height * (1 - SOIL_RATIO);
}

function dismissIntro() {
  introDismissed = true;
}

/** Controla o fade do card de instruções no início. */
function introAlpha() {
  if (introDismissed || gamePhase !== 'planting') return 0;
  const elapsed = millis() - introStartMs;
  if (elapsed >= INTRO_MS) {
    introDismissed = true;
    return 0;
  }
  if (elapsed > INTRO_MS - 600) return map(elapsed, INTRO_MS - 600, INTRO_MS, 1, 0);
  return 1;
}

function hudScale() {
  return constrain(min(width / 560, height / 420), 0.72, 1.05);
}

/** Celular e tablet: canvas estreito ou baixo. */
function isCompactCanvas() {
  return width <= 820;
}

function hudFont(sizePx, weight) {
  const size = Math.max(11, Math.round(sizePx * hudScale()));
  return `${weight} ${size}px Segoe UI, system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
}

function hudText(str, x, y, sizePx, weight, align, baseline, alpha) {
  const ctx = drawingContext;
  ctx.save();
  ctx.font = hudFont(sizePx, weight);
  ctx.fillStyle = `rgba(255,255,255,${alpha})`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  ctx.fillText(str, x, y);
  ctx.restore();
}

function hudMeasure(str, sizePx, weight) {
  const ctx = drawingContext;
  ctx.font = hudFont(sizePx, weight);
  return ctx.measureText(str).width;
}

/** Aumenta idade das plantas; espiga só aparece após a chuva. */
function growPlants(speed) {
  for (const plant of plants) {
    plant.age = min(plant.age + speed, 1);
    if (gamePhase === 'raining' && plant.age >= 0.55) plant.bloomed = true;
  }
}

// ── Cenário (céu, colinas, solo) ───────────────────────────────────────────

/** Gradiente do céu com lerpColor; posição do mouse altera levemente o tom. */
function drawSky() {
  const horizon = soilTopY();
  const rainy = gamePhase === 'raining';
  const top = isDarkMode() ? color(225, 45, rainy ? 8 : 10) : color(205, 38, rainy ? 72 : 98);
  const mid = isDarkMode() ? color(215, 40, rainy ? 14 : 16) : color(200, 42, rainy ? 68 : 92);
  const low = isDarkMode() ? color(200, 32, rainy ? 20 : 22) : color(185, 35, rainy ? 62 : 85);
  const blend = map(constrain(mouseX, 0, width), 0, width, 0, 1);

  for (let y = 0; y < horizon; y++) {
    const t = y / max(horizon, 1);
    let c;
    if (t < 0.55) c = lerpColor(top, mid, t / 0.55);
    else c = lerpColor(mid, low, (t - 0.55) / 0.45);
    c = lerpColor(c, low, blend * 0.15);
    stroke(c);
    strokeWeight(1);
    line(0, y, width + 1, y);
  }
  noStroke();
}

function drawStars() {
  if (!isDarkMode()) return;
  const horizon = soilTopY() - 28;
  for (const star of stars) {
    const sx = star.x * width;
    const sy = star.y * max(horizon, 40);
    const twinkle = reduceMotion ? 0.8 : 0.35 + 0.65 * (0.5 + 0.5 * sin(frameCount * star.speed + star.phase));
    const sz = star.size * hudScale() * (0.85 + twinkle * 0.35);
    fill(48, 20, 100, 100 * twinkle);
    circle(sx, sy, sz);
  }
}

function drawSunOrMoon() {
  if (gamePhase === 'raining') return;
  const bodyX = width * 0.76;
  const bodyY = height * 0.18;

  if (isDarkMode()) {
    const moonSize = 36 * hudScale();
    fill(48, 12, 96);
    circle(bodyX, bodyY, moonSize);
    fill(225, 45, 10, 92);
    circle(bodyX + moonSize * 0.28, bodyY - moonSize * 0.08, moonSize * 0.92);
    return;
  }

  const sunSize = map(plants.length, 0, MAX_PLANTS, 30, 44) * hudScale();
  fill(44, 78, 100);
  circle(bodyX, bodyY, sunSize);
}

function drawClouds() {
  if (isDarkMode() || gamePhase === 'raining') return;
  const drift = reduceMotion ? 0 : frameCount;
  for (let i = 0; i < 3; i++) {
    const x = ((drift * (0.2 + i * 0.04) + i * 130) % (width + 140)) - 70;
    fill(0, 0, 100, 35);
    cloudBlob(x, 26 + i * 12, 28 + i * 6);
  }
}

function drawRainClouds() {
  fill(0, 0, 55, 45);
  cloudBlob(width * 0.25, 28, 54);
  cloudBlob(width * 0.55, 22, 62);
  cloudBlob(width * 0.78, 34, 48);
}

function cloudBlob(x, y, size) {
  circle(x, y, size);
  circle(x + size * 0.42, y + 3, size * 0.72);
  circle(x - size * 0.38, y + 5, size * 0.62);
}

function drawHills() {
  const base = soilTopY();
  const back = isDarkMode() ? color(125, 30, 26) : color(118, 38, 40);
  const front = isDarkMode() ? color(108, 42, 32) : color(102, 48, 38);

  fill(back);
  rect(-2, base - 24, width + 4, 30);
  hillShape(base - 6, 0.009, 10, 0);

  fill(front);
  rect(-2, base - 8, width + 4, 22);
  hillShape(base + 2, 0.014, 14, 1.2);
}

/** Colinas desenhadas com sin/cos para evitar faixa vazia no horizonte. */
function hillShape(baseY, freq, amp, phase) {
  beginShape();
  vertex(-2, baseY + 10);
  for (let x = 0; x <= width + 2; x += 5) {
    const h = sin(x * freq + phase) * amp + cos(x * freq * 1.4) * (amp * 0.45);
    vertex(x, baseY - 8 + h);
  }
  vertex(width + 2, baseY + 10);
  endShape(CLOSE);
}

function drawSoil() {
  const top = soilTopY();
  const dark = isDarkMode();
  fill(dark ? color(28, 32, 20) : color(30, 52, 30));
  rect(0, top + 10, width, height - top - 10, 0, 0, 16, 16);
  fill(dark ? color(95, 38, 38) : color(92, 58, 44));
  rect(0, top, width, 16);
}

// ── Interface (balões de texto) ─────────────────────────────────────────────

function drawIntroCard() {
  const alpha = introAlpha();
  if (alpha <= 0) return;

  const top = soilTopY() + 14;
  const cx = width * 0.5;
  const cy = top + (height - top) * 0.38;
  const label = width < 340 ? `Plante ${MAX_PLANTS} sementes` : `Toque no solo — plante ${MAX_PLANTS} sementes`;
  drawSpeechCard(cx, cy, label, 11, alpha);
}

function drawHarvestHint() {
  if (harvestHintDismissed) return;

  const compact = isCompactCanvas();
  const msg = compact ? 'Toque nas plantas' : 'Clique nas plantas para colher';
  const sizePx = compact ? 9 : 10;
  const labelH = Math.round(28 * hudScale());

  let cx;
  let cy;
  if (compact) {
    cx = width * 0.5;
    cy = max(labelH * 0.6, soilTopY() - labelH * 0.9);
  } else {
    const bounds = truckBounds();
    cx = (bounds.left + bounds.right) * 0.5;
    cy = bounds.top - 10 * truckScale();
  }

  drawSpeechCard(cx, cy, msg, sizePx, 1);
}

function drawSpeechCard(cx, cy, text, sizePx, alpha) {
  const labelW = hudMeasure(text, sizePx, '700') + 24;
  const labelH = Math.round(28 * hudScale());
  const margin = 10;
  const safeCx = constrain(cx, margin + labelW / 2, max(margin + labelW / 2, width - margin - labelW / 2));
  const lx = safeCx - labelW / 2;
  const ly = cy - labelH / 2;

  fill(0, 0, 6, 84 * alpha);
  rect(lx, ly, labelW, labelH, 10);
  stroke(isDarkMode() ? color(130, 45, 55, 65 * alpha) : color(115, 55, 50, 70 * alpha));
  strokeWeight(1.5);
  noFill();
  rect(lx, ly, labelW, labelH, 10);
  noStroke();
  hudText(text, safeCx, cy, sizePx, '700', 'center', 'middle', 0.96 * alpha);
}

// ── Caminhão (desenho) ──────────────────────────────────────────────────────

function drawTruckWheel(wx, wy, s) {
  fill(0, 0, 22);
  circle(wx, wy, 18 * s);
  fill(0, 0, 78);
  circle(wx, wy, 8 * s);
}

/** Pickup lateral; caçamba enche conforme harvestedCount. */
function drawTruck() {
  if (gamePhase === 'planting' || gamePhase === 'raining') return;

  const x = truckX;
  const y = truckY();
  const s = truckScale();
  const fillLevel = harvestedCount / MAX_PLANTS;
  const w = 96 * s;
  const bodyH = 20 * s;
  const cabW = 34 * s;
  const bedW = w - cabW;
  const cabTop = y - 14 * s;

  fill(3, 82, 52);
  rect(x + cabW, y, bedW, bodyH, 0, 3, 3, 0);
  rect(x, y + 4 * s, cabW, bodyH - 4 * s, 3, 0, 0, 3);

  beginShape();
  vertex(x + 2 * s, y + 4 * s);
  vertex(x + cabW - 6 * s, y + 4 * s);
  vertex(x + cabW - 2 * s, cabTop + 8 * s);
  vertex(x + 8 * s, cabTop);
  endShape(CLOSE);

  fill(0, 0, 28);
  beginShape();
  vertex(x + 10 * s, y + 6 * s);
  vertex(x + cabW - 10 * s, y + 6 * s);
  vertex(x + cabW - 14 * s, cabTop + 10 * s);
  vertex(x + 14 * s, cabTop + 4 * s);
  endShape(CLOSE);

  fill(3, 70, 38);
  rect(x + cabW - 2 * s, y, 3 * s, bodyH);

  fill(3, 68, 42);
  rect(x + cabW - 14 * s, y + 10 * s, 8 * s, 3 * s, 2);

  fill(0, 0, 72);
  rect(x - 2 * s, y + bodyH - 2 * s, 8 * s, 4 * s, 2);
  rect(x + w - 6 * s, y + bodyH - 2 * s, 8 * s, 4 * s, 2);

  fill(48, 85, 92);
  rect(x + 1 * s, y + 8 * s, 5 * s, 4 * s, 1);
  rect(x + w - 6 * s, y + 8 * s, 5 * s, 4 * s, 1);

  if (fillLevel > 0) {
    fill(48, 72, 58);
    rect(x + cabW + 4 * s, y + bodyH - 4 * s - 14 * s * fillLevel, bedW - 8 * s, 14 * s * fillLevel, 2);
    fill(48, 78, 68);
    for (let i = 0; i < floor(fillLevel * 5); i++) {
      circle(x + cabW + 10 * s + i * 7 * s, y + bodyH - 8 * s, 4 * s);
    }
  }

  drawTruckWheel(x + 22 * s, y + bodyH + 2 * s, s);
  drawTruckWheel(x + 72 * s, y + bodyH + 2 * s, s);
}

// ── Plantas e colheita ──────────────────────────────────────────────────────

function plantSize(plant) {
  return map(plant.age, 0, 1, 8, 34);
}

function plantTopY(plant) {
  return plant.y - plantSize(plant) * 0.55;
}

function plantHitRadius(plant) {
  const base = plantSize(plant) * 0.62;
  return isCompactCanvas() ? max(base, 32 * hudScale()) : base;
}

/** Valida solo, distância entre sementes e zona do caminhão antes de plantar. */
function tryPlantSeed(x, y) {
  if (gamePhase !== 'planting') return;
  const top = soilTopY();
  if (y < top + 14 || plants.length >= MAX_PLANTS) return;

  const reserve = truckReserveZone();
  if (x >= reserve.left && x <= reserve.right) return;

  for (const plant of plants) {
    if (dist(x, y, plant.x, plant.y) < 18) return;
  }

  plants.push({
    x,
    y,
    age: 0.12,
    hue: map(plants.length, 0, MAX_PLANTS - 1, 92, 138),
    bloomed: false
  });
}

/** Usa dist() para detectar clique em planta madura e enviar grãos ao caminhão. */
function tryHarvestClick(x, y) {
  if (gamePhase !== 'harvest') return false;

  for (let i = plants.length - 1; i >= 0; i--) {
    const plant = plants[i];
    if (!plant.bloomed || plant.age < 0.95) continue;

    const py = plantTopY(plant);
    if (dist(x, y, plant.x, py) > plantHitRadius(plant)) continue;

    spawnHarvestSpark(plant.x, py);
    spawnGrainFlight(plant.x, py);
    plants.splice(i, 1);
    harvestedCount++;
    harvestHintDismissed = true;
    return true;
  }
  return false;
}

function spawnGrainFlight(x, y) {
  grainFlights.push({
    x,
    y,
    t: 0,
    tx: truckX + 58 * truckScale(),
    ty: truckY() + 8 * truckScale()
  });
}

/** Anima grãos voando em arco (lerp + sin) até a caçamba. */
function drawGrainFlights() {
  for (let i = grainFlights.length - 1; i >= 0; i--) {
    const g = grainFlights[i];
    g.t += reduceMotion ? 0.25 : 0.08;
    g.tx = truckX + 58 * truckScale();
    g.ty = truckY() + 8 * truckScale();
    const px = lerp(g.x, g.tx, g.t);
    const py = lerp(g.y, g.ty, g.t) - sin(g.t * PI) * 18;
    fill(48, 78, 72);
    circle(px, py, 5 * (1 - g.t * 0.4));
    if (g.t >= 1) grainFlights.splice(i, 1);
  }
}

function spawnHarvestSpark(x, y) {
  for (let i = 0; i < 5; i++) {
    harvestSparks.push({
      x,
      y,
      vx: random(-1.8, 1.8),
      vy: random(-2.6, -0.4),
      life: 1
    });
  }
}

function drawHarvestSparks() {
  for (let i = harvestSparks.length - 1; i >= 0; i--) {
    const s = harvestSparks[i];
    s.x += s.vx;
    s.y += s.vy;
    s.life -= reduceMotion ? 0.2 : 0.06;
    fill(95, 55, 65, s.life * 100);
    circle(s.x, s.y, 4 * s.life);
    if (s.life <= 0) harvestSparks.splice(i, 1);
  }
}

// ── Chuva ───────────────────────────────────────────────────────────────────

function spawnRainDrop(x, y, speed) {
  if (rainDrops.length > 120) return;
  rainDrops.push({ x, y, speed });
}

function updateRain() {
  if (gamePhase !== 'raining' && rainDrops.length === 0) return;

  for (let i = rainDrops.length - 1; i >= 0; i--) {
    if (!reduceMotion) rainDrops[i].y += rainDrops[i].speed;
    fill(200, 40, 100, 70);
    ellipse(rainDrops[i].x, rainDrops[i].y, 2.5, 5);
    if (rainDrops[i].y > height - 4) rainDrops.splice(i, 1);
  }
}

function drawPlants() {
  for (const plant of plants) {
    if (plantHiddenByTruck(plant)) continue;

    const size = plantSize(plant);
    const py = plantTopY(plant);
    const ready = plant.bloomed && plant.age >= 0.95;
    const canHarvest = gamePhase === 'harvest' && ready;

    if (canHarvest) {
      const pulse = 0.5 + 0.5 * sin(frameCount * 0.12 + plant.x * 0.05);
      noFill();
      stroke(48, 75, 60, 40 + pulse * 35);
      strokeWeight(2);
      circle(plant.x, py, size * 1.2);
      noStroke();
    }

    drawPlantSprite(plant.x, plant.y, size, plant.hue, plant.bloomed);
  }
}

/** Broto (folhas) ou espiga completa, conforme plant.bloomed. */
function drawPlantSprite(x, y, size, hue, bloomed) {
  fill(hue, 50, 28);
  rect(x - 2.5, y - size * 0.58, 5, size * 0.58, 2);

  if (bloomed) {
    fill(48, 72, 68);
    ellipse(x, y - size * 0.72, size * 0.28, size * 0.55);
    fill(48, 82, 78);
    circle(x, y - size * 0.88, size * 0.18);
    fill(hue, 68, 48);
    ellipse(x - size * 0.32, y - size * 0.58, size * 0.4, size * 0.22);
    ellipse(x + size * 0.32, y - size * 0.58, size * 0.4, size * 0.22);
  } else {
    fill(hue, 68, 42);
    ellipse(x - size * 0.28, y - size * 0.42, size * 0.38, size * 0.2);
    ellipse(x + size * 0.28, y - size * 0.42, size * 0.38, size * 0.2);
  }
}
