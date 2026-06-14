// ── Saudação personalizada + preferências de acessibilidade ───────────────────
const htmlEl        = document.documentElement;
const heroGreeting  = document.getElementById("heroGreeting");
const welcomeModal  = document.getElementById("welcomeModal");
const nameInput     = document.getElementById("nameInput");
const nameSubmit    = document.getElementById("nameSubmit");
const darkToggle    = document.getElementById("darkToggle");
const fontNormal    = document.getElementById("fontNormal");
const fontMedium    = document.getElementById("fontMedium");
const fontLarge     = document.getElementById("fontLarge");

const fontScales = [1, 1.2, 1.4];
const fontBtns   = [fontNormal, fontMedium, fontLarge];

// Exibe "Olá, [nome]!" no hero
function showGreeting(name) {
  if (!heroGreeting) return;
  if (name) {
    heroGreeting.textContent = `Olá, ${name}! 👋`;
    heroGreeting.hidden = false;
  } else {
    heroGreeting.textContent = "";
    heroGreeting.hidden = true;
  }
}

function openWelcome() {
  if (!welcomeModal) return;
  welcomeModal.classList.add("is-open");
  welcomeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  nameInput?.focus({ preventScroll: true });
}

function closeWelcome() {
  if (!welcomeModal) return;
  welcomeModal.classList.remove("is-open");
  welcomeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function handleNameSubmit() {
  const name = nameInput?.value.trim();
  if (!name) {
    nameInput?.focus();
    return;
  }
  localStorage.setItem("agrinho-user-name", name);
  showGreeting(name);
  closeWelcome();
}

function applyFontScale(idx) {
  htmlEl.style.setProperty("--font-scale", fontScales[idx]);
  fontBtns.forEach((btn, i) => {
    if (!btn) return;
    const active = i === idx;
    btn.classList.toggle("font-btn-active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  localStorage.setItem("agrinho-font-scale", idx);
}

function setDarkMode(on) {
  htmlEl.classList.toggle("dark", on);
  if (darkToggle) {
    darkToggle.classList.toggle("dark-active", on);
    darkToggle.setAttribute("aria-pressed", String(on));
    darkToggle.setAttribute("aria-label", on ? "Desativar modo escuro" : "Ativar modo escuro");
  }
  localStorage.setItem("agrinho-dark-mode", on ? "1" : "0");
}

nameSubmit?.addEventListener("click", handleNameSubmit);
nameInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleNameSubmit();
});
welcomeModal?.addEventListener("click", (e) => {
  if (e.target instanceof Element && e.target.hasAttribute("data-close-welcome")) closeWelcome();
});

fontNormal?.addEventListener("click", () => applyFontScale(0));
fontMedium?.addEventListener("click", () => applyFontScale(1));
fontLarge?.addEventListener("click", () => applyFontScale(2));
darkToggle?.addEventListener("click", () => setDarkMode(!htmlEl.classList.contains("dark")));

const savedName = localStorage.getItem("agrinho-user-name");
if (savedName) {
  showGreeting(savedName);
} else {
  openWelcome();
}

const savedFont = parseInt(localStorage.getItem("agrinho-font-scale"), 10);
applyFontScale(Number.isFinite(savedFont) ? savedFont : 0);

if (localStorage.getItem("agrinho-dark-mode") === "1") setDarkMode(true);

// ── Animação de contadores ─────────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || "";
  const dur    = 1800;
  const startT = performance.now();

  function fmt(n) {
    return n.toLocaleString("pt-BR");
  }

  function step(now) {
    const t    = Math.min((now - startT) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val  = Math.round(target * ease);
    el.textContent = fmt(val) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

if ("IntersectionObserver" in window) {
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );
  document.querySelectorAll(".counter-num").forEach((el) => counterObs.observe(el));
} else {
  document.querySelectorAll(".counter-num").forEach((el) => {
    el.textContent = parseInt(el.dataset.target, 10).toLocaleString("pt-BR") + (el.dataset.suffix || "");
  });
}

// ── Menu ──────────────────────────────────────────────────────────────────────
const menuToggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const header = document.querySelector(".header");
const menuOverlay = document.getElementById("menuOverlay");

// Abre ou fecha a gaveta lateral mobile
function setMenuState(isOpen) {
  if (!menu || !menuToggle) return;
  menu.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  if (menuOverlay) menuOverlay.classList.toggle("active", isOpen);
}

// Clique no overlay escuro fecha a gaveta
menuOverlay?.addEventListener("click", () => setMenuState(false));

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    setMenuState(!menu.classList.contains("open"));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) setMenuState(false);
  });
}

// ── Navegação suave ────────────────────────────────────────────────────────────
document.querySelectorAll("[data-to]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.getAttribute("data-to"));
    if (!target) return;
    const offset = header ? header.offsetHeight + 12 : 0;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: "smooth" });
    setMenuState(false);
  });
});

// ── Animações de entrada ───────────────────────────────────────────────────────
const revealEls = document.querySelectorAll(".reveal-up,.reveal-left,.reveal-right,.reveal-scale");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        entry.target.querySelectorAll(".progress").forEach((b) => b.classList.add("animate"));
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => {
    el.classList.add("show");
    el.querySelectorAll(".progress").forEach((b) => b.classList.add("animate"));
  });
}

// ── Modal unificado ────────────────────────────────────────────────────────────
const topicModal      = document.getElementById("topicModal");
const topicModalKicker = document.getElementById("topicModalKicker");
const topicModalTitle = document.getElementById("topicModalTitle");
const topicModalText  = document.getElementById("topicModalText");
const topicModalClose = document.getElementById("topicModalClose");

let modalClosing = false;
let lastFocused  = null;
let closeTimer   = null;

function getFocusable() {
  if (!topicModal) return [];
  return Array.from(
    topicModal.querySelectorAll("button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])")
  ).filter((el) => !el.disabled);
}

function openModal({ kicker, title, text }, trigger) {
  if (!topicModal) return;
  if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }

  modalClosing = false;
  lastFocused  = trigger || null;
  topicModal.classList.remove("is-closing");
  topicModal.classList.add("is-open");
  topicModal.setAttribute("aria-hidden", "false");
  if (topicModalKicker) topicModalKicker.textContent = kicker || "";
  topicModalTitle.textContent = title;
  topicModalText.textContent  = text;
  document.body.classList.add("modal-open");
  topicModalClose?.focus({ preventScroll: true });
}

function closeModal() {
  if (!topicModal || modalClosing || !topicModal.classList.contains("is-open")) return;
  modalClosing = true;
  topicModal.classList.add("is-closing");
  topicModal.classList.remove("is-open");
  closeTimer = setTimeout(() => {
    topicModal.classList.remove("is-closing");
    topicModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastFocused?.focus({ preventScroll: true });
    modalClosing = false;
    closeTimer = null;
  }, 260);
}

topicModal?.addEventListener("click", (e) => {
  if (e.target instanceof Element && e.target.hasAttribute("data-close-modal")) closeModal();
});
topicModalClose?.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (!topicModal?.classList.contains("is-open")) return;
  if (e.key === "Escape") { closeModal(); return; }
  if (e.key === "Tab") {
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }
});

// ── Conteúdo dos cards de Juventude ───────────────────────────────────────────
const topicContent = {
  conhecimento: {
    kicker: "Juventude no campo",
    title: "Conhecimento 📚",
    text: "Os jovens ajudam o campo por meio do conhecimento, aprendendo novas técnicas e levando informações para melhorar a produção agrícola. Com estudos e pesquisas, eles ajudam a tornar o trabalho no campo mais eficiente e sustentável.",
  },
  inovacao: {
    kicker: "Juventude no campo",
    title: "Inovação 💻",
    text: "A juventude contribui com a inovação usando a tecnologia para melhorar a agricultura. O uso de computadores, aplicativos, drones e máquinas modernas ajuda a aumentar a produção e reduzir desperdícios no campo.",
  },
  trabalho: {
    kicker: "Juventude no campo",
    title: "Trabalho no campo 🌱",
    text: "Os jovens também ajudam participando do trabalho no campo, apoiando suas famílias e aprendendo sobre agricultura e pecuária. Eles trazem novas ideias e ajudam a manter viva a produção rural.",
  },
  consciencia: {
    kicker: "Juventude no campo",
    title: "Consciência ambiental 🌍",
    text: "Os jovens ajudam o meio ambiente ao incentivar práticas sustentáveis, como evitar desperdícios, cuidar da água e preservar a natureza. Assim, contribuem para um campo mais saudável para as próximas gerações.",
  },
};

document.querySelectorAll(".topic-card").forEach((card) => {
  card.addEventListener("click", () => {
    const content = topicContent[card.getAttribute("data-topic")];
    if (content) openModal(content, card);
  });
});

// ── Conteúdo dos pins do mapa ──────────────────────────────────────────────────
const farmSpots = {
  lavoura: {
    kicker: "Mapa da Propriedade",
    title: "🌱 Lavoura Sustentável",
    text: "A lavoura sustentável usa técnicas como plantio direto, rotação de culturas e cobertura do solo. Essas práticas reduzem a erosão, preservam os nutrientes e aumentam a produtividade sem agredir o meio ambiente.",
  },
  nascente: {
    kicker: "Mapa da Propriedade",
    title: "💧 Nascente Preservada",
    text: "As nascentes são os pontos onde a água brota do solo e alimenta rios e córregos. Preservar a vegetação ao redor é fundamental para garantir água limpa, regular o clima local e manter a produção rural.",
  },
  mataCiliar: {
    kicker: "Mapa da Propriedade",
    title: "🌳 Mata Ciliar",
    text: "A mata ciliar é a vegetação que protege as margens de rios, lagos e nascentes. Ela evita a erosão das margens, filtra a água da chuva, serve de abrigo para animais e é obrigatória por lei nas propriedades rurais.",
  },
  solar: {
    kicker: "Mapa da Propriedade",
    title: "☀️ Energia Solar",
    text: "Placas solares geram energia elétrica a partir do sol, reduzindo os custos da propriedade e diminuindo emissões de gases poluentes. No campo, são usadas para bombas d'água, irrigação, iluminação e armazenagem.",
  },
  tecnologia: {
    kicker: "Mapa da Propriedade",
    title: "🚁 Tecnologia no Campo",
    text: "Drones sobrevoam a lavoura e identificam áreas com doenças, pragas ou falta de nutrientes antes que se tornem grandes problemas. Isso permite tratar somente o necessário, economizando insumos e protegendo o meio ambiente.",
  },
  biodigestor: {
    kicker: "Mapa da Propriedade",
    title: "♻️ Biodigestor",
    text: "O biodigestor transforma resíduos orgânicos (esterco animal e restos da lavoura) em biogás — usado como combustível — e biofertilizante — usado na plantação. Isso reduz o desperdício, gera energia e enriquece o solo.",
  },
  jovem: {
    kicker: "Mapa da Propriedade",
    title: "👨‍🌾 Jovem Produtor",
    text: "O jovem do campo une o conhecimento tradicional da família com as novas tecnologias aprendidas na escola. Com smartphones, aplicativos e dados, ele toma melhores decisões, reduz desperdícios e torna a propriedade mais produtiva e sustentável.",
  },
};

document.querySelectorAll(".farm-pin").forEach((pin) => {
  pin.addEventListener("click", () => {
    const content = farmSpots[pin.getAttribute("data-spot")];
    if (content) openModal(content, pin);
  });
});

// ── Simulador de sustentabilidade ─────────────────────────────────────────────
const simGauge   = document.getElementById("simGauge");
const simPercent = document.getElementById("simPercent");
const simMsg     = document.getElementById("simMsg");
const simCbs     = document.querySelectorAll(".sim-cb");
const simTotal   = simCbs.length;

let simCurrentPct = 0;
let simRafId = null;

const simMessages = [
  { min: 0,  max: 0,   text: "Selecione práticas ao lado para calcular seu índice.", color: "#94a3b8" },
  { min: 1,  max: 37,  text: "🌱 Você está começando! Cada prática sustentável faz diferença.", color: "#f87171" },
  { min: 38, max: 62,  text: "👍 Bom caminho! Sua propriedade já tem práticas importantes.", color: "#fbbf24" },
  { min: 63, max: 87,  text: "🌿 Muito bem! Você está no caminho certo para um agro sustentável.", color: "#84cc16" },
  { min: 88, max: 100, text: "🏆 Excelente! Sua propriedade é um modelo de sustentabilidade!", color: "#10b981" },
];

function getSimMsgData(pct) {
  return simMessages.find((m) => pct >= m.min && pct <= m.max) || simMessages[0];
}

function animateGauge(target) {
  if (simRafId) cancelAnimationFrame(simRafId);
  const start  = simCurrentPct;
  const startT = performance.now();
  const dur    = 550;

  function step(now) {
    const t = Math.min((now - startT) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val  = Math.round(start + (target - start) * ease);

    if (simGauge)   simGauge.style.setProperty("--sim-pct", val + "%");
    if (simPercent) simPercent.textContent = val + "%";

    if (t < 1) {
      simRafId = requestAnimationFrame(step);
    } else {
      simCurrentPct = target;
      simRafId = null;
      const data = getSimMsgData(target);
      if (simMsg) {
        simMsg.textContent = data.text;
        simMsg.style.color = data.color;
      }
      if (simGauge) simGauge.style.setProperty("--sim-color", data.color);
    }
  }

  simRafId = requestAnimationFrame(step);
}

function updateSimulator() {
  const checked = Array.from(simCbs).filter((cb) => cb.checked).length;
  const pct = simTotal > 0 ? Math.round((checked / simTotal) * 100) : 0;
  animateGauge(pct);
}

simCbs.forEach((cb) => cb.addEventListener("change", updateSimulator));

// ── Quiz ──────────────────────────────────────────────────────────────────────
const quizList      = document.getElementById("quizList");
const scoreBox      = document.getElementById("scoreBox");
const quizFinishMsg = document.getElementById("quizFinishMsg");
const quizRestartWrap = document.getElementById("quizRestartWrap");
const quizRestart   = document.getElementById("quizRestart");
const totalQuestions = quizList ? quizList.querySelectorAll(".answers[data-q]").length : 0;

let score    = 0;
const answered = {};

function updateScore() {
  if (scoreBox) scoreBox.textContent = `Sua pontuação: ${score}/${totalQuestions}`;
}

function checkQuizComplete() {
  if (Object.keys(answered).length < totalQuestions) return;

  const ratio = score / totalQuestions;
  let msg = "";
  if (ratio === 1)        msg = "🏆 Parabéns! Você acertou tudo! Você é um verdadeiro agente do agro sustentável!";
  else if (ratio >= 0.75) msg = "🌿 Muito bem! Você entende profundamente o agro sustentável!";
  else if (ratio >= 0.5)  msg = "👍 Bom resultado! Você já conhece boas práticas do agro. Continue aprendendo!";
  else                    msg = "🌱 Você está começando sua jornada sustentável. Releia o conteúdo e tente de novo!";

  if (quizFinishMsg) { quizFinishMsg.textContent = msg; quizFinishMsg.classList.add("show"); }
  if (quizRestartWrap) quizRestartWrap.classList.remove("is-hidden");
}

document.querySelectorAll(".answers").forEach((group) => {
  const qId     = group.getAttribute("data-q");
  const feedback = document.getElementById(`fb-${qId}`);

  group.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!qId || answered[qId]) return;
      answered[qId] = true;

      const isCorrect = btn.getAttribute("data-correct") === "1";
      if (isCorrect) score++;

      group.querySelectorAll("button").forEach((b) => {
        if (b.getAttribute("data-correct") === "1") b.classList.add("correct");
        if (b === btn && !isCorrect) b.classList.add("wrong");
        b.disabled = true;
      });

      if (feedback) {
        feedback.classList.add("show", isCorrect ? "ok" : "bad");
        feedback.textContent = isCorrect
          ? "✅ Correto! Essa escolha ajuda o agro a ser mais sustentável."
          : "❌ Quase! A melhor resposta é a alternativa sustentável.";
      }

      updateScore();
      checkQuizComplete();
    });
  });
});

if (quizRestart) {
  quizRestart.addEventListener("click", () => {
    score = 0;
    for (const k in answered) delete answered[k];
    updateScore();

    document.querySelectorAll(".answers button").forEach((b) => {
      b.classList.remove("correct", "wrong");
      b.disabled = false;
    });
    document.querySelectorAll(".feedback").forEach((fb) => {
      fb.classList.remove("show", "ok", "bad");
      fb.textContent = "";
    });

    if (quizFinishMsg)   { quizFinishMsg.classList.remove("show"); quizFinishMsg.textContent = ""; }
    if (quizRestartWrap) quizRestartWrap.classList.add("is-hidden");

    const quizSection = document.getElementById("quiz");
    if (quizSection && header) {
      const off = header.offsetHeight + 12;
      window.scrollTo({ top: quizSection.getBoundingClientRect().top + window.scrollY - off, behavior: "smooth" });
    }
  });
}
