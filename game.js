/**
 * Salve a Fazendinha do Agrinho — game.js
 * Jogo educativo standalone (jogo.html) | Agrinho 2026
 *
 * Fluxo: loading → home → tutorial → historinha (4 cenas) → comparação de fazendas
 *        → quiz (6 perguntas, mínimo 200 pts) → missão (6 problemas) → resultado
 *
 * Módulos principais:
 *   showScreen / showStoryScene — navegação entre telas
 *   quizData + startQuiz        — perguntas com timer e pontuação
 *   problems + openProblem      — diálogos interativos na fazenda
 *   localStorage (BEST_KEY)     — recorde de pontuação persistido
 */
const PASS_SCORE = 200;
const QUIZ_TIME = 18;
const BEST_KEY = 'agrinho_best_score_v5';
const USER_NAME_KEY = 'agrinho-user-name';
const SITE_URL = 'https://rafael37917-lgtm.github.io/agrinho/';
const GAME_URL = 'https://rafael37917-lgtm.github.io/agrinho/jogo.html';

const screens = [...document.querySelectorAll('.screen')];
const storyScenes = [...document.querySelectorAll('.story-scene')];
const problemButtons = [...document.querySelectorAll('.problem')];
const farmStage = document.getElementById('farmStage');
const dialog = document.getElementById('problemDialog');

const els = {
  score: document.getElementById('score'),
  fixedCount: document.getElementById('fixedCount'),
  bestScore: document.getElementById('bestScore'),
  bestScoreResult: document.getElementById('bestScoreResult'),
  soundBtn: document.getElementById('soundBtn'),
  storyCount: document.getElementById('storyCount'),
  storyPrev: document.getElementById('storyPrev'),
  storyNext: document.getElementById('storyNext'),
  quizCounter: document.getElementById('quizCounter'),
  timerValue: document.getElementById('timerValue'),
  quizScore: document.getElementById('quizScore'),
  quizBar: document.getElementById('quizBar'),
  questionText: document.getElementById('questionText'),
  answerList: document.getElementById('answerList'),
  quizFeedback: document.getElementById('quizFeedback'),
  failScore: document.getElementById('failScore'),
  gameScore: document.getElementById('gameScore'),
  gameFixedBig: document.getElementById('gameFixedBig'),
  gameBar: document.getElementById('gameBar'),
  helperBubble: document.getElementById('helperBubble'),
  dialogImage: document.getElementById('dialogImage'),
  dialogTitle: document.getElementById('dialogTitle'),
  dialogText: document.getElementById('dialogText'),
  dialogChoices: document.getElementById('dialogChoices'),
  dialogFeedback: document.getElementById('dialogFeedback'),
  finalScore: document.getElementById('finalScore'),
  resultEyebrow: document.getElementById('resultEyebrow'),
  resultTitle: document.getElementById('resultTitle'),
  resultMessage: document.getElementById('resultMessage'),
  resultRankLabel: document.getElementById('resultRankLabel'),
  resultTrophy: document.getElementById('resultTrophy')
};

const state = {
  score: 0,
  fixed: 0,
  best: Number(localStorage.getItem(BEST_KEY) || 0),
  sound: true,
  storyIndex: 0,
  quizIndex: 0,
  quizScoreValue: 0,
  quizTimer: null,
  timeLeft: QUIZ_TIME,
  fixedProblems: new Set(),
  currentProblem: null
};

const quizData = [
  { q: 'O que é melhor fazer com o lixo produzido na fazenda?', a: ['Separar por tipo e descartar ou reciclar corretamente', 'Enterrar tudo no quintal para sumir da vista', 'Juntar tudo em um só lugar e deixar acumular'], c: 0, tip: 'Separar e descartar corretamente evita poluição.' },
  { q: 'Qual atitude ajuda a proteger o solo contra erosão?', a: ['Arar a terra com frequência, mesmo sem plantio', 'Remover plantas que não produzem alimento', 'Plantar árvores e manter a cobertura vegetal'], c: 2, tip: 'As raízes ajudam a segurar o solo e evitar erosão.' },
  { q: 'Como podemos economizar água na fazenda?', a: ['Regar as plantas várias vezes ao dia, só por garantia', 'Consertar vazamentos e usar a água com cuidado', 'Lavar equipamentos diariamente, mesmo limpos'], c: 1, tip: 'Consertar vazamentos e evitar desperdício faz toda a diferença.' },
  { q: 'Qual fonte de energia é mais sustentável para a fazenda?', a: ['Queima de restos de madeira e lixo', 'Gerador a diesel, por ser mais potente', 'Energia solar, aproveitando o sol da região'], c: 2, tip: 'A energia solar é limpa, renovável e não gera poluição.' },
  { q: 'Como cuidar bem dos animais da fazenda?', a: ['Garantir água limpa, alimento e abrigo todos os dias', 'Oferecer comida apenas quando der tempo', 'Deixar os animais soltos sem nenhum cuidado'], c: 0, tip: 'Bem-estar animal também faz parte da sustentabilidade.' },
  { q: 'O que a reciclagem realmente ajuda a fazer?', a: ['Substituir totalmente a necessidade de reduzir o consumo', 'Reaproveitar materiais e reduzir o lixo gerado', 'Resolver todos os problemas ambientais por si só'], c: 1, tip: 'Reciclar reaproveita materiais e reduz resíduos, mas reduzir o consumo continua importante.' }
];

const helperMessages = [
  'Encontre o primeiro problema brilhando.',
  'Boa! Você já começou a melhorar a fazenda.',
  'Muito bem! A natureza já está agradecendo.',
  'Metade da missão concluída! Continue assim.',
  'Quase lá! A fazenda está ficando linda.',
  'Só falta um problema para tudo ficar bonito.',
  'Missão completa! A fazenda ficou 100% sustentável.'
];

const problems = {
  pneu: {
    title: 'Pneu jogado no local errado',
    img: './img/game/pneu.png',
    text: 'Um pneu abandonado pode acumular água e causar poluição. O que fazer?',
    choices: ['Jogar no rio', 'Levar para descarte correto ou reciclagem', 'Deixar no chão'],
    correct: 1, points: 100, success: 'Muito bem! O pneu foi encaminhado corretamente.'
  },
  tambor: {
    title: 'Tambor abandonado',
    img: './img/game/tambor.png',
    text: 'Esse tambor pode contaminar o ambiente. Qual é a melhor solução?',
    choices: ['Guardar com segurança e descartar corretamente', 'Deixar no meio da plantação', 'Quebrar e largar no chão'],
    correct: 0, points: 100, success: 'Ótimo! Agora o ambiente está mais seguro.'
  },
  toco: {
    title: 'Toco no lugar de uma árvore',
    img: './img/game/toco.png',
    text: 'Uma árvore foi retirada. Como melhorar essa situação?',
    choices: ['Plantar uma nova árvore', 'Cimentar o local', 'Ignorar o problema'],
    correct: 0, points: 100, success: 'Excelente! Replantar ajuda a natureza.'
  },
  cano: {
    title: 'Cano vazando água suja',
    img: './img/game/cano.png',
    text: 'Água vazando e poluída prejudica o ambiente. O que fazer?',
    choices: ['Consertar o cano e evitar desperdício', 'Aumentar o vazamento', 'Desviar para o rio'],
    correct: 0, points: 100, success: 'Perfeito! A água agora está mais protegida.'
  },
  lixo: {
    title: 'Lixo no rio',
    img: './img/game/lixo_rio.png',
    text: 'O rio está sujo com lixo e materiais. Qual é a atitude certa?',
    choices: ['Limpar o rio e descartar corretamente', 'Jogar mais lixo', 'Esconder o lixo nas margens'],
    correct: 0, points: 100, success: 'Isso aí! O rio agradece a limpeza.'
  },
  arvore: {
    title: 'Árvore morta e área sem vida',
    img: './img/game/arvore_morta.png',
    text: 'A paisagem está triste e sem vegetação saudável. Como resolver?',
    choices: ['Plantar árvores e preservar a vegetação', 'Cortar as outras árvores', 'Deixar tudo assim'],
    correct: 0, points: 100, success: 'Muito bem! Preservar a vegetação é essencial.'
  }
};

function shuffleArray(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function updateHud(){
  els.score.textContent = state.score;
  els.fixedCount.textContent = state.fixed;
  els.bestScore.textContent = state.best;
  els.bestScoreResult.textContent = state.best;
  els.gameScore.textContent = state.score;
  els.gameFixedBig.textContent = state.fixed;
  els.gameBar.style.width = `${(state.fixed / 6) * 100}%`;
  farmStage?.style.setProperty('--reveal', `${state.fixed / 6}`);
  els.helperBubble.textContent = helperMessages[state.fixed];
}

function pulseStat(el){
  if(!el) return;
  el.classList.remove('stat-pop');
  void el.offsetWidth;
  el.classList.add('stat-pop');
  setTimeout(() => el.classList.remove('stat-pop'), 650);
}

function go(screenId){
  screens.forEach(screen => screen.classList.toggle('active', screen.id === screenId));
  if(screenId === 'quiz') renderQuizQuestion();
  if(screenId === 'game') updateHud();
}

document.querySelectorAll('[data-go]').forEach(btn => {
  btn.addEventListener('click', () => go(btn.dataset.go));
});

document.getElementById('startQuizBtn').addEventListener('click', () => {
  resetQuiz();
  go('quiz');
});
document.getElementById('retryQuizBtn').addEventListener('click', () => {
  resetQuiz();
  go('quiz');
});

function playTone(freq=440, duration=.1, type='sine', volume=.04){
  if(!state.sound) return;
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }catch(e){}
}

function successSound(){
  playTone(640,.1,'triangle',.07);
  setTimeout(() => playTone(840,.15,'triangle',.05), 80);
}
function failSound(){
  playTone(220,.12,'sawtooth',.04);
  setTimeout(() => playTone(180,.18,'sawtooth',.03), 60);
}

els.soundBtn.addEventListener('click', () => {
  state.sound = !state.sound;
  els.soundBtn.textContent = state.sound ? '🔊' : '🔇';
});

// story
function renderStory(){
  storyScenes.forEach((scene, idx) => scene.classList.toggle('active', idx === state.storyIndex));
  els.storyCount.textContent = state.storyIndex + 1;
  els.storyPrev.disabled = false;
  els.storyNext.textContent = state.storyIndex === storyScenes.length - 1 ? 'Ver fazendas' : 'Próximo';
}
els.storyPrev.addEventListener('click', () => {
  if(state.storyIndex > 0){ state.storyIndex--; renderStory(); playTone(340,.08); }
  else { go('how'); playTone(340,.08); }
});
els.storyNext.addEventListener('click', () => {
  if(state.storyIndex < storyScenes.length - 1){ state.storyIndex++; renderStory(); playTone(520,.08); }
  else go('compare');
});
renderStory();

// quiz
function resetQuiz(){
  clearInterval(state.quizTimer);
  state.quizIndex = 0;
  state.quizScoreValue = 0;
  state.timeLeft = QUIZ_TIME;
  els.quizScore.textContent = '0';
  els.quizFeedback.className = 'feedback hidden';
}

function startQuizTimer(){
  clearInterval(state.quizTimer);
  state.timeLeft = QUIZ_TIME;
  els.timerValue.textContent = state.timeLeft;
  state.quizTimer = setInterval(() => {
    state.timeLeft--;
    els.timerValue.textContent = state.timeLeft;
    if(state.timeLeft <= 0){
      clearInterval(state.quizTimer);
      answerQuiz(-1, true);
    }
  }, 1000);
}

function renderQuizQuestion(){
  const q = quizData[state.quizIndex];
  if(!q) return;
  els.quizCounter.textContent = `Pergunta ${state.quizIndex + 1} de ${quizData.length}`;
  els.quizBar.style.width = `${(state.quizIndex / quizData.length) * 100}%`;
  els.questionText.textContent = q.q;
  els.answerList.innerHTML = '';
  els.quizFeedback.className = 'feedback hidden';
  shuffleArray(q.a.map((option, idx) => ({ option, idx }))).forEach(({ option, idx }) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = option;
    btn.dataset.choiceIdx = String(idx);
    btn.addEventListener('click', () => answerQuiz(idx, false, btn));
    els.answerList.appendChild(btn);
  });
  startQuizTimer();
}

function answerQuiz(choiceIndex, isTimeout=false, clickedButton=null){
  clearInterval(state.quizTimer);
  const q = quizData[state.quizIndex];
  [...els.answerList.children].forEach(btn => btn.disabled = true);
  const correctBtn = [...els.answerList.children].find(
    el => Number(el.dataset.choiceIdx) === q.c
  );
  if(correctBtn) correctBtn.classList.add('correct');

  let correct = choiceIndex === q.c;
  if(clickedButton && !correct) clickedButton.classList.add('wrong');

  if(correct){
    state.quizScoreValue += 50;
    state.score += 50;
    els.quizScore.textContent = state.quizScoreValue;
    els.quizFeedback.textContent = '✅ Resposta certa! ' + q.tip;
    els.quizFeedback.className = 'feedback';
    successSound();
  } else {
    els.quizFeedback.textContent = isTimeout ? `⏰ Tempo esgotado! ${q.tip}` : `❌ Resposta incorreta. ${q.tip}`;
    els.quizFeedback.className = 'feedback error';
    failSound();
  }
  updateHud();

  setTimeout(() => {
    state.quizIndex++;
    if(state.quizIndex < quizData.length){
      renderQuizQuestion();
    } else {
      finishQuiz();
    }
  }, 1200);
}

function finishQuiz(){
  els.quizBar.style.width = '100%';
  if(state.quizScoreValue >= PASS_SCORE){
    successSound();
    go('unlock');
  } else {
    els.failScore.textContent = state.quizScoreValue;
    go('quizFail');
  }
}

// game
const BURST_COLORS = ['#ffd24a', '#74d65e', '#5fc6ff', '#ff8f6b', '#c98bff'];

function spawnBurst(target){
  if(!target) return;
  const wrap = document.createElement('div');
  wrap.className = 'solve-burst';
  for(let i = 0; i < 10; i++){
    const span = document.createElement('span');
    const angle = (Math.PI * 2 * i) / 10;
    const dist = 36 + Math.random() * 24;
    span.style.setProperty('--bx', `${Math.cos(angle) * dist}px`);
    span.style.setProperty('--by', `${Math.sin(angle) * dist}px`);
    span.style.setProperty('--p-color', BURST_COLORS[i % BURST_COLORS.length]);
    span.style.animationDelay = `${Math.random() * 0.12}s`;
    wrap.appendChild(span);
  }
  target.appendChild(wrap);
  setTimeout(() => wrap.remove(), 900);
}

function openProblem(key){
  const p = problems[key];
  if(!p || state.fixedProblems.has(key)) return;
  state.currentProblem = key;
  els.dialogImage.src = p.img;
  els.dialogTitle.textContent = p.title;
  els.dialogText.textContent = p.text;
  els.dialogChoices.innerHTML = '';
  els.dialogFeedback.className = 'feedback hidden';
  shuffleArray(p.choices.map((choice, idx) => ({ choice, idx }))).forEach(({ choice, idx }) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = choice;
    btn.dataset.choiceIdx = String(idx);
    btn.addEventListener('click', () => solveProblem(key, idx, btn));
    els.dialogChoices.appendChild(btn);
  });
  dialog.showModal();
}

function solveProblem(key, choiceIdx, btn){
  const p = problems[key];
  [...els.dialogChoices.children].forEach(item => item.disabled = true);
  const correctBtn = [...els.dialogChoices.children].find(
    el => Number(el.dataset.choiceIdx) === p.correct
  );
  correctBtn?.classList.add('correct');
  const correct = choiceIdx === p.correct;

  if(correct){
    state.fixedProblems.add(key);
    state.fixed += 1;
    state.score += p.points;
    els.dialogFeedback.textContent = '✅ ' + p.success;
    els.dialogFeedback.className = 'feedback';
    const problemBtn = document.querySelector(`.problem[data-problem="${key}"]`);
    problemBtn?.classList.add('fixed');
    spawnBurst(problemBtn);
    updateHud();
    pulseStat(els.gameFixedBig?.parentElement);
    successSound();

    setTimeout(() => {
      dialog.close();
      if(state.fixed === 6){
        state.score += 50; // bônus final para chegar a 950 no máximo
        updateHud();
        finishGame();
      }
    }, 900);
  } else {
    btn.classList.add('wrong');
    els.dialogFeedback.textContent = '❌ Tente outra solução.';
    els.dialogFeedback.className = 'feedback error';
    failSound();
    setTimeout(() => {
      [...els.dialogChoices.children].forEach(item => item.disabled = false);
      correctBtn?.classList.remove('correct');
      els.dialogFeedback.className = 'feedback hidden';
    }, 900);
  }
}

problemButtons.forEach(btn => btn.addEventListener('click', () => openProblem(btn.dataset.problem)));
document.getElementById('closeProblemDialog').addEventListener('click', () => dialog.close());

function getPlayerName() {
  return localStorage.getItem(USER_NAME_KEY)?.trim() || '';
}

function getFirstName(name) {
  return name.split(/\s+/)[0];
}

function showPlayerGreeting() {
  const el = document.getElementById('gameGreeting');
  const name = getPlayerName();
  if (!el || !name || name === 'visitante') return;
  el.textContent = `Olá, ${getFirstName(name)}! 👋`;
  el.hidden = false;
}

function finishGame(){
  burstConfetti(38);
  successSound();
  const previousBest = state.best;
  const isNewRecord = state.score > previousBest;

  if(isNewRecord){
    state.best = state.score;
    localStorage.setItem(BEST_KEY, String(state.best));
  }
  els.finalScore.textContent = state.score;
  els.bestScoreResult.textContent = state.best;
  els.bestScore.textContent = state.best;

  els.resultEyebrow.textContent = 'PARABÉNS';
  els.resultTitle.textContent = 'Fazendinha salva!';
  els.resultRankLabel.textContent = isNewRecord
    ? 'Novo recorde pessoal:'
    : 'Melhor pontuação salva:';

  if(state.score >= 900){
    els.resultMessage.textContent = 'Você deixou a fazenda linda, sustentável e fez uma pontuação excelente!';
    els.resultTrophy.src = './img/game/trofeu_max.png';
  } else if(state.score >= 700){
    els.resultMessage.textContent = 'Muito bem! A fazenda ficou bonita e bem cuidada.';
    els.resultTrophy.src = './img/game/trofeu_fazenda.png';
  } else {
    els.resultMessage.textContent = 'Você conseguiu salvar a fazenda. Tente novamente para fazer ainda mais pontos!';
    els.resultTrophy.src = './img/game/trofeu_quiz.png';
  }
  setTimeout(() => go('result'), 800);
}

function resetGame(){
  clearInterval(state.quizTimer);
  state.score = 0;
  state.fixed = 0;
  state.storyIndex = 0;
  state.quizIndex = 0;
  state.quizScoreValue = 0;
  state.timeLeft = QUIZ_TIME;
  state.fixedProblems.clear();
  problemButtons.forEach(btn => btn.classList.remove('fixed'));
  renderStory();
  updateHud();
  resetQuiz();
  go('home');
}

document.getElementById('restartBtn').addEventListener('click', resetGame);
function buildShareText() {
  const title = document.getElementById('resultTitle')?.textContent?.trim() || 'Fazendinha salva!';
  const message = document.getElementById('resultMessage')?.textContent?.trim() || '';
  return [
    '🏆 Salve a Fazendinha do Agrinho',
    '',
    'PARABÉNS!',
    title,
    `⭐ ${state.score} pontos`,
    '',
    message,
    '',
    '🎮 Jogue você também:',
    GAME_URL,
    '',
    '🌱 Conheça o projeto:',
    SITE_URL
  ].join('\n');
}

document.getElementById('shareBtn').addEventListener('click', async () => {
  const text = buildShareText();
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Salve a Fazendinha do Agrinho',
        text
      });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Resultado copiado! Cole no WhatsApp ou onde quiser compartilhar.');
    }
  } catch (e) {
    if (e?.name !== 'AbortError') {
      try {
        await navigator.clipboard.writeText(text);
        alert('Resultado copiado! Cole no WhatsApp ou onde quiser compartilhar.');
      } catch (_) {}
    }
  }
});

function burstConfetti(count=30){
  const layer = document.getElementById('confetti-layer');
  for(let i=0;i<count;i++){
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${Math.random()*100}%`;
    piece.style.background = `hsl(${Math.random()*360}, 90%, 55%)`;
    piece.style.animationDelay = `${Math.random() * .2}s`;
    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}

function simulateLoading(){
  const loadingTexts = [
    'Carregando a turma do Agrinho',
    'Montando a fazenda feia e a fazenda bonita',
    'Preparando quiz e desafios',
    'Quase pronto!'
  ];
  const bar = document.getElementById('loadingBar');
  const text = document.getElementById('loadingText');
  let step = 0;
  const timer = setInterval(() => {
    step++;
    bar.style.width = `${step * 25}%`;
    text.textContent = loadingTexts[Math.min(step-1, loadingTexts.length-1)];
    if(step >= 4){
      clearInterval(timer);
      setTimeout(() => document.getElementById('loadingScreen').style.display = 'none', 250);
    }
  }, 280);
}

updateHud();
showPlayerGreeting();
simulateLoading();

