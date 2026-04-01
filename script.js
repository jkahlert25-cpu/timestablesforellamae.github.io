const homeScreen     = document.getElementById('home-screen');
const practiceScreen = document.getElementById('practice-screen');
const tableGrid      = document.getElementById('table-grid');
const selectAllBtn   = document.getElementById('select-all-btn');
const clearAllBtn    = document.getElementById('clear-all-btn');
const startBtn       = document.getElementById('start-btn');
const warningMsg     = document.getElementById('warning-msg');

const questionText   = document.getElementById('question-text');
const questionCard   = document.getElementById('question-card');
const answerInput    = document.getElementById('answer-input');
const submitBtn      = document.getElementById('submit-btn');
const feedbackMsg    = document.getElementById('feedback-msg');
const quitBtn        = document.getElementById('quit-btn');
const chipsRow       = document.getElementById('chips-row');

const scoreCorrectEl = document.getElementById('score-correct');
const scoreTotalEl   = document.getElementById('score-total');
const streakCountEl  = document.getElementById('streak-count');
const streakBox      = document.getElementById('streak-box');

const state = {
  selectedTables:   new Set(),
  currentA:         0,
  currentB:         0,
  correctAnswer:    0,
  scoreCorrect:     0,
  scoreTotal:       0,
  streak:           0,
  questionCounted:  false,
  hadWrongAttempt:  false,
  awaitingNext:     false,
};

function init() {
  buildTableCards();
  attachEventListeners();
}

function buildTableCards() {
  tableGrid.innerHTML = '';
  for (let n = 1; n <= 12; n++) {
    const card = document.createElement('button');
    card.className = 'table-card';
    card.setAttribute('role', 'checkbox');
    card.setAttribute('aria-checked', 'false');
    card.setAttribute('data-table', n);
    card.setAttribute('aria-label', `${n} times table`);
    card.innerHTML = `
      <span class="card-number">${n}</span>
      <span class="card-label">\u00d7 table</span>
    `;
    card.addEventListener('click', () => toggleCard(card, n));
    tableGrid.appendChild(card);
  }
}

function toggleCard(card, n) {
  if (state.selectedTables.has(n)) {
    state.selectedTables.delete(n);
    card.classList.remove('selected');
    card.setAttribute('aria-checked', 'false');
  } else {
    state.selectedTables.add(n);
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
  }
  if (state.selectedTables.size > 0) {
    warningMsg.hidden = true;
  }
}

function selectAll() {
  tableGrid.querySelectorAll('.table-card').forEach((card) => {
    const n = parseInt(card.dataset.table);
    state.selectedTables.add(n);
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
  });
  warningMsg.hidden = true;
}

function clearAll() {
  state.selectedTables.clear();
  tableGrid.querySelectorAll('.table-card').forEach((card) => {
    card.classList.remove('selected');
    card.setAttribute('aria-checked', 'false');
  });
}

function startSession() {
  if (state.selectedTables.size === 0) {
    warningMsg.hidden = false;
    tableGrid.style.animation = 'none';
    tableGrid.offsetHeight;
    tableGrid.style.animation = 'shake 0.4s ease';
    return;
  }

  state.scoreCorrect    = 0;
  state.scoreTotal      = 0;
  state.streak          = 0;
  state.questionCounted = false;
  state.hadWrongAttempt = false;
  state.awaitingNext    = false;

  updateScoreDisplay();
  updateStreakDisplay();
  buildChips();
  showScreen(practiceScreen, homeScreen);
  newQuestion();
  answerInput.focus();
}

function newQuestion() {
  const tables = Array.from(state.selectedTables);
  const a = tables[Math.floor(Math.random() * tables.length)];
  const b = Math.floor(Math.random() * 12) + 1;

  state.currentA        = a;
  state.currentB        = b;
  state.correctAnswer   = a * b;
  state.questionCounted = false;
  state.hadWrongAttempt = false;
  state.awaitingNext    = false;

  questionText.textContent = `${b} \u00d7 ${a} = ?`;
  triggerBounce(questionCard);

  answerInput.value    = '';
  answerInput.disabled = false;
  submitBtn.disabled   = false;
  clearFeedback();
  answerInput.focus();
}

function checkAnswer() {
  if (state.awaitingNext) return;

  const raw = answerInput.value.trim();

  if (raw === '') {
    showFeedback('wrong', 'Please type a number first.');
    answerInput.focus();
    return;
  }

  const userAnswer = parseInt(raw, 10);

  if (isNaN(userAnswer)) {
    showFeedback('wrong', 'That does not look like a number. Try again.');
    answerInput.value = '';
    answerInput.focus();
    return;
  }

  if (!state.questionCounted) {
    state.scoreTotal++;
    state.questionCounted = true;
  }

  if (userAnswer === state.correctAnswer) {
    state.scoreCorrect++;

    if (!state.hadWrongAttempt) {
      state.streak++;
    } else {
      state.streak = 0;
    }

    showFeedback('correct', `Correct! ${state.currentA} \u00d7 ${state.currentB} = ${state.correctAnswer}`);

    state.awaitingNext   = true;
    answerInput.disabled = true;
    submitBtn.disabled   = true;

    updateScoreDisplay();
    updateStreakDisplay();

    setTimeout(() => {
      newQuestion();
    }, 1400);

  } else {
    state.hadWrongAttempt = true;
    state.streak = 0;

    showFeedback('wrong', 'Incorrect — try again.');
    triggerShake(questionCard);

    answerInput.value    = '';
    answerInput.disabled = false;
    submitBtn.disabled   = false;
    answerInput.focus();

    updateScoreDisplay();
    updateStreakDisplay();
  }
}

function showFeedback(type, message) {
  feedbackMsg.textContent = message;
  feedbackMsg.className = `feedback-msg ${type}`;
}

function clearFeedback() {
  feedbackMsg.textContent = '';
  feedbackMsg.className = 'feedback-msg';
}

function updateScoreDisplay() {
  scoreCorrectEl.textContent = state.scoreCorrect;
  scoreTotalEl.textContent   = state.scoreTotal;
}

function updateStreakDisplay() {
  streakCountEl.textContent = state.streak;
  if (state.streak >= 3) {
    streakBox.classList.add('on-fire');
  } else {
    streakBox.classList.remove('on-fire');
  }
}

function quitSession() {
  showScreen(homeScreen, practiceScreen);
  clearFeedback();

  tableGrid.querySelectorAll('.table-card').forEach((card) => {
    const n = parseInt(card.dataset.table);
    if (state.selectedTables.has(n)) {
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
    }
  });
}

function handleKeydown(e) {
  if (!practiceScreen.classList.contains('active')) return;
  if (e.key === 'Enter') {
    e.preventDefault();
    if (!submitBtn.disabled) {
      checkAnswer();
    }
  }
}

function showScreen(show, hide) {
  hide.classList.remove('active');
  show.classList.add('active');
}

function triggerBounce(el) {
  el.classList.remove('bounce-in');
  el.offsetHeight;
  el.classList.add('bounce-in');
}

function triggerShake(el) {
  el.classList.remove('shake');
  el.offsetHeight;
  el.classList.add('shake');
}

function buildChips() {
  chipsRow.innerHTML = '';
  const label = document.createElement('span');
  label.style.cssText = 'font-size:0.72rem;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:0.06em;';
  label.textContent = 'Practising: ';
  chipsRow.appendChild(label);

  Array.from(state.selectedTables).sort((a, b) => a - b).forEach((n) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = `${n}\u00d7`;
    chipsRow.appendChild(chip);
  });
}

function attachEventListeners() {
  selectAllBtn.addEventListener('click', selectAll);
  clearAllBtn.addEventListener('click', clearAll);
  startBtn.addEventListener('click', startSession);
  submitBtn.addEventListener('click', checkAnswer);
  quitBtn.addEventListener('click', quitSession);
  document.addEventListener('keydown', handleKeydown);
}

init();
