/**
 * Agro Forte — sketch.js | p5.js | Agrinho 2026 — Subcategoria 3
 *
 * Cena interativa no hero: clique no solo para plantar sementes;
 * movimento do mouse altera o céu; tecla R reinicia o campo.
 *
 * Recursos p5 usados: setup(), draw(), mousePressed(), keyReleased(),
 * variáveis, for, if, funções auxiliares, dist(), map() e lerpColor().
 */

let plants = [];
let rainDrops = [];
let plantedCount = 0;
let reduceMotion = false;

const MAX_PLANTS = 14;
const SOIL_RATIO = 0.38;

function setup() {
  const container = document.getElementById('agroSketch');
  if (!container) return;

  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = createCanvas(container.offsetWidth, 220);
  canvas.parent('agroSketch');
  noStroke();
}

function draw() {
  if (!document.getElementById('agroSketch')) return;

  drawSky();
  drawSun();
  drawClouds();
  drawSoil();
  updateRain();
  drawPlants();
  drawHud();
}

function mousePressed() {
  if (!mouseInsideCanvas()) return;
  tryPlantSeed(mouseX, mouseY);
}

function keyReleased() {
  if (key === 'r' || key === 'R') resetField();
}

function windowResized() {
  const container = document.getElementById('agroSketch');
  if (container) resizeCanvas(container.offsetWidth, 220);
}

function mouseInsideCanvas() {
  return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
}

function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

function drawSky() {
  const top = isDarkMode() ? color(210, 55, 18) : color(200, 35, 96);
  const bottom = isDarkMode() ? color(200, 40, 28) : color(145, 45, 92);
  const blend = map(constrain(mouseX, 0, width), 0, width, 0, 1);
  background(lerpColor(top, bottom, blend));
}

function drawSun() {
  const sunX = map(sin(frameCount * 0.008), -1, 1, width * 0.12, width * 0.88);
  const sunY = height * 0.18;
  const sunSize = map(plantedCount, 0, MAX_PLANTS, 28, 42);
  fill(48, 90, 100, 90);
  circle(sunX, sunY, sunSize);
  fill(48, 55, 100, 35);
  circle(sunX, sunY, sunSize + 18);
}

function drawClouds() {
  if (isDarkMode()) return;
  fill(0, 0, 100, 35);
  for (let i = 0; i < 3; i++) {
    const x = ((frameCount * (0.25 + i * 0.05) + i * 120) % (width + 120)) - 60;
    const y = 28 + i * 16;
    cloudBlob(x, y, 34 + i * 8);
  }
}

function cloudBlob(x, y, size) {
  circle(x, y, size);
  circle(x + size * 0.45, y + 4, size * 0.75);
  circle(x - size * 0.4, y + 6, size * 0.65);
}

function drawSoil() {
  const soilTop = height * (1 - SOIL_RATIO);
  fill(isDarkMode() ? color(28, 35, 22) : color(32, 55, 35));
  rect(0, soilTop, width, height - soilTop, 0, 0, 18, 18);
  fill(isDarkMode() ? color(38, 30, 28) : color(28, 40, 30));
  rect(0, soilTop + 8, width, height - soilTop - 8);
}

function tryPlantSeed(x, y) {
  const soilTop = height * (1 - SOIL_RATIO);
  if (y < soilTop + 8 || plants.length >= MAX_PLANTS) return;

  for (const plant of plants) {
    if (dist(x, y, plant.x, plant.y) < 18) return;
  }

  plants.push({ x, y, age: 0, hue: map(plantedCount, 0, MAX_PLANTS, 95, 135) });
  plantedCount++;
  spawnRainBurst(x);
}

function spawnRainBurst(x) {
  for (let i = 0; i < 6; i++) {
    rainDrops.push({
      x: x + random(-16, 16),
      y: height * (1 - SOIL_RATIO) - 4,
      speed: random(2.2, 4.5)
    });
  }
}

function updateRain() {
  if (reduceMotion) return;
  for (let i = rainDrops.length - 1; i >= 0; i--) {
    rainDrops[i].y += rainDrops[i].speed;
    fill(200, 35, 100, 70);
    circle(rainDrops[i].x, rainDrops[i].y, 4);
    if (rainDrops[i].y > height - 6) rainDrops.splice(i, 1);
  }
}

function drawPlants() {
  for (const plant of plants) {
    if (!reduceMotion) plant.age = min(plant.age + 0.035, 1);
    const size = map(plant.age, 0, 1, 8, 28);
    drawPlant(plant.x, plant.y, size, plant.hue);
  }
}

function drawPlant(x, y, size, hue) {
  fill(hue, 55, 35);
  rect(x - 2, y - size * 0.55, 4, size * 0.55, 2);
  fill(hue, 70, 45);
  ellipse(x - size * 0.35, y - size * 0.55, size * 0.55, size * 0.35);
  ellipse(x + size * 0.35, y - size * 0.55, size * 0.55, size * 0.35);
  fill(hue, 75, 55);
  circle(x, y - size * 0.72, size * 0.28);
}

function drawHud() {
  fill(0, 0, 100, 82);
  rect(10, 10, 132, 28, 10);
  fill(isDarkMode() ? 145 : 125, 55, 98);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(`Plantas: ${plants.length}/${MAX_PLANTS}`, 18, 24);
}

function resetField() {
  plants = [];
  rainDrops = [];
  plantedCount = 0;
}
