/* ================================================================
   TIMES TABLES LEARNER — script.js
   ================================================================
   All the app logic lives here. No external libraries needed.

   Sections:
   1.  DOM References
   2.  App State
   3.  Initialisation
   4.  Home Screen: Build Table Cards
   5.  Home Screen: Select / Clear All
   6.  Home Screen: Start Session
   7.  Practice Screen: Question Generation
   8.  Practice Screen: Answer Checking
   9.  Practice Screen: Feedback & Flow
   10. Practice Screen: Score & Streak
   11. Practice Screen: Confetti
   12. Practice Screen: Quit
   13. Keyboard Support
   14. Helpers
   ================================================================ */


/* ================================================================
   1. DOM REFERENCES
   ================================================================ */
const homeScreen      = document.getElementById('home-screen');
const practiceScreen  = document.getElementById('practice-screen');
const tableGrid       = document.getElementById('table-grid');
const selectAllBtn    = document.getElementById('select-all-btn');
const clearAllBtn     = document.getElementById('clear-all-btn');
const startBtn        = document.getElementById('start-btn');
const warningMsg      = document.getElementById('warning-msg');

const questionText    = document.getElementById('question-text');
const questionCard    = document.getElementById('question-card');
const answerInput     = document.getElementById('answer-input');
const submitBtn       = document.getElementById('submit-btn');
const feedbackMsg     = document.getElementById('feedback-msg');
const nextBtn         = document.getElementById('next-btn');
const quitBtn         = document.getElementById('quit-btn');
const chipsRow        = document.getElementById('chips-row');
const confettiWrap    = document.getElementById('confetti-wrap');

const scoreCorrectEl  = document.getElementById('score-correct');
const scoreTotalEl    = document.getElementById('score-total');
const streakCountEl   = document.getElementById('streak-count');
const streakBox       = document.getElementById('streak-box');


/* ================================================================
   2. APP STATE
   Everything the app needs to remember lives here.
   ================================================================ */
const state = {
  // Which table numbers (1–12) the user has selected
  selectedTables: new Set(),

  // Current question
  currentA: 0,        // first number (the "times table")
  currentB: 0,        // second number (1–12)
  correctAnswer: 0,

  // Session stats
  scoreCorrect: 0,
  scoreTotal: 0,
  streak: 0,

  // Retry-until-correct tracking
  // answered: true while locked during auto-advance (prevents double-fire)
  answered: false,
  // questionCounted: true once this question has been counted in scoreTotal
  questionCounted: false,
  // hadWrongAttempt: true if the student got this question wrong at least once
  hadWrongAttempt: false,
};


/* ================================================================
   3. INITIALISATION
   ================================================================ */
function init() {
  buildTableCards();     // Create the 12 selectable cards
  attachEventListeners();
}


/* ================================================================
   4. HOME SCREEN: BUILD TABLE CARDS
   Creates one toggle card per times table (1 through 12).
   ================================================================ */
function buildTableCards() {
  // Remove any existing cards first (safety)
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
      <span class="card-label">× table</span>
    `;

    // Toggle selected state when clicked
    card.addEventListener('click', () => toggleCard(card, n));

    tableGrid.appendChild(card);
  }
}


/* ================================================================
   5. HOME SCREEN: TOGGLE / SELECT / CLEAR
   ================================================================ */

/**
 * Toggles a single table card on or off.
 * @param {HTMLElement} card - The card button element
 * @param {number} n - The times table number
 */
function toggleCard(card, n) {
  if (state.selectedTables.has(n)) {
    // Deselect
    state.selectedTables.delete(n);
    card.classList.remove('selected');
    card.setAttribute('aria-checked', 'false');
  } else {
    // Select
    state.selectedTables.add(n);
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
  }

  // Hide the warning if user has now selected something
  if (state.selectedTables.size > 0) {
    warningMsg.hidden = true;
  }
}

/** Selects all 12 table cards */
function selectAll() {
  const cards = tableGrid.querySelectorAll('.table-card');
  cards.forEach((card) => {
    const n = parseInt(card.dataset.table);
    state.selectedTables.add(n);
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
  });
  warningMsg.hidden = true;
}

/** Deselects all 12 table cards */
function clearAll() {
  state.selectedTables.clear();
  const cards = tableGrid.querySelectorAll('.table-card');
  cards.forEach((card) => {
    card.classList.remove('selected');
    card.setAttribute('aria-checked', 'false');
  });
}


/* ================================================================
   6. HOME SCREEN: START SESSION
   Validates selection, then transitions to the practice screen.
   ================================================================ */
function startSession() {
  // Validation: must have at least one table selected
  if (state.selectedTables.size === 0) {
    warningMsg.hidden = false;
    // Shake the grid to draw attention
    tableGrid.style.animation = 'none';
    tableGrid.offsetHeight; // trigger reflow
    tableGrid.style.animation = 'shake 0.4s ease';
    return;
  }

  // Reset session stats
  state.scoreCorrect    = 0;
  state.scoreTotal      = 0;
  state.streak          = 0;
  state.answered        = false;
  state.questionCounted = false;
  state.hadWrongAttempt = false;

  updateScoreDisplay();
  updateStreakDisplay();

  // Build the "chips" showing which tables are active
  buildChips();

  // Switch screens
  showScreen(practiceScreen, homeScreen);

  // Generate first question
  newQuestion();

  // Focus the input for immediate typing
  answerInput.focus();
}


/* ================================================================
   7. PRACTICE SCREEN: QUESTION GENERATION
   ================================================================ */

/**
 * Generates a random question using only the selected tables.
 *
 * Rules:
 * - First number (A) = randomly chosen from selectedTables
 * - Second number (B) = random integer from 1 to 12
 *
 * Example: if user selected [3, 7, 12]:
 *   A could be 3, 7, or 12
 *   B could be 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, or 12
 */
function newQuestion() {
  // Convert Set to array to pick randomly
  const tables = Array.from(state.selectedTables);

  // Pick a random table from selected
  const a = tables[Math.floor(Math.random() * tables.length)];

  // Pick a random multiplier 1–12
  const b = Math.floor(Math.random() * 12) + 1;

  state.currentA = a;
  state.currentB = b;
  state.correctAnswer = a * b;
  state.answered = false;
  state.questionCounted = false;
  state.hadWrongAttempt = false;

  // Display the question: "7 × 8 = ?"
  questionText.textContent = `${a} × ${b} = ?`;

  // Animate the card
  triggerBounce(questionCard);

  // Clear previous answer and feedback
  answerInput.value = '';
  clearFeedback();
  nextBtn.hidden = true;
  submitBtn.disabled = false;
  answerInput.disabled = false;
  answerInput.focus();
}


/* ================================================================
   8. PRACTICE SCREEN: ANSWER CHECKING

   RETRY-UNTIL-CORRECT LOGIC:
   - If the answer is wrong, feedback is shown but the input is
     cleared and re-enabled so the student can try again immediately.
   - state.answered stays FALSE on a wrong attempt, so the student
     is never blocked from submitting again.
   - state.scoreTotal only increments once per question (on the
     first attempt, right or wrong), tracked via state.questionCounted.
   - state.scoreCorrect increments only when the correct answer is
     finally given.
   - The streak increments only on a correct answer, and resets to 0
     if the first attempt on a question was wrong.
   ================================================================ */
function checkAnswer() {
  const raw = answerInput.value.trim();

  // Handle empty input — don't count this as an attempt
  if (raw === '') {
    showFeedback('wrong', 'Please type a number first.');
    answerInput.focus();
    return;
  }

  // Parse the answer
  const userAnswer = parseInt(raw, 10);

  // Handle non-numeric input — don't count this as an attempt
  if (isNaN(userAnswer)) {
    showFeedback('wrong', 'That does not look like a number. Try again.');
    answerInput.value = '';
    answerInput.focus();
    return;
  }

  // Count this question in the total only the FIRST time it is attempted
  if (!state.questionCounted) {
    state.scoreTotal++;
    state.questionCounted = true;
  }

  if (userAnswer === state.correctAnswer) {
    // ✅ CORRECT
    state.scoreCorrect++;

    // Only grow the streak if the question was answered correctly
    // on the very first try. If they already got it wrong once,
    // their streak resets to 0 for this question.
    if (!state.hadWrongAttempt) {
      state.streak++;
    } else {
      state.streak = 0;
    }

    showFeedback('correct', `Correct! ${state.currentA} \u00d7 ${state.currentB} = ${state.correctAnswer}`);
    launchConfetti();

    // Lock input while we auto-advance
    state.answered = true;
    answerInput.disabled = true;
    submitBtn.disabled = true;
    nextBtn.hidden = true;

    updateScoreDisplay();
    updateStreakDisplay();

    // Auto-advance to next question after a short pause
    setTimeout(() => {
      newQuestion();
    }, 1400);

  } else {
    // ❌ WRONG — let the student try again on the same question
    state.hadWrongAttempt = true;
    state.streak = 0;

    showFeedback('wrong', 'Incorrect — try again.');

    // Shake the card for visual feedback
    triggerShake(questionCard);

    // Clear the input and re-focus so student can type immediately
    answerInput.value = '';
    answerInput.disabled = false;
    answerInput.focus();

    // Keep submit enabled — student must retry
    submitBtn.disabled = false;

    updateScoreDisplay();
    updateStreakDisplay();
  }
}


/* ================================================================
   9. PRACTICE SCREEN: FEEDBACK & FLOW
   ================================================================ */

/**
 * Shows a feedback message with a style class.
 * @param {'correct'|'wrong'} type
 * @param {string} message
 */
function showFeedback(type, message) {
  feedbackMsg.textContent = message;
  feedbackMsg.className = `feedback-msg ${type}`;
}

/** Removes feedback text and styling */
function clearFeedback() {
  feedbackMsg.textContent = '';
  feedbackMsg.className = 'feedback-msg';
}



/* ================================================================
   10. PRACTICE SCREEN: SCORE & STREAK DISPLAY
   ================================================================ */
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


/* ================================================================
   11. PRACTICE SCREEN: CONFETTI
   Creates 40 coloured squares that fall from the top of the screen.
   ================================================================ */
function launchConfetti() {
  // Remove any existing confetti first
  confettiWrap.innerHTML = '';

  const colours = [
    '#FF6B6B', '#4ECDC4', '#FFE66D',
    '#A8E6CF', '#FF8B94', '#6C5CE7',
    '#FD79A8', '#00CEC9', '#FDCB6E',
  ];

  const count = 45;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    // Random position across the top
    const left = Math.random() * 100;
    // Stagger the fall start so they don't all drop at once
    const delay = Math.random() * 0.6;
    const duration = 1.0 + Math.random() * 0.8;
    const colour = colours[Math.floor(Math.random() * colours.length)];

    // Randomly make some circles, some rectangles
    const isCircle = Math.random() > 0.5;
    const size = 6 + Math.random() * 8;

    piece.style.cssText = `
      left: ${left}%;
      top: -20px;
      width: ${size}px;
      height: ${size}px;
      background: ${colour};
      border-radius: ${isCircle ? '50%' : '2px'};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;

    confettiWrap.appendChild(piece);
  }

  // Clean up after animation is done
  setTimeout(() => {
    confettiWrap.innerHTML = '';
  }, 2500);
}


/* ================================================================
   12. PRACTICE SCREEN: QUIT
   Returns to home screen. Keeps table selections intact.
   ================================================================ */
function quitSession() {
  showScreen(homeScreen, practiceScreen);

  // Clear practice-screen state
  clearFeedback();
  nextBtn.hidden = true;
  confettiWrap.innerHTML = '';

  // Restore previously selected cards visually
  // (They're still in state.selectedTables, so just re-apply classes)
  const cards = tableGrid.querySelectorAll('.table-card');
  cards.forEach((card) => {
    const n = parseInt(card.dataset.table);
    if (state.selectedTables.has(n)) {
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
    }
  });
}


/* ================================================================
   13. KEYBOARD SUPPORT
   Enter key submits the answer (or advances to next question).
   ================================================================ */
function handleKeydown(e) {
  // Only when practice screen is visible
  if (!practiceScreen.classList.contains('active')) return;

  if (e.key === 'Enter') {
    e.preventDefault();

    if (!nextBtn.hidden) {
      // Next question button is visible — advance
      newQuestion();
    } else if (!submitBtn.disabled) {
      // Submit the current answer
      checkAnswer();
    }
  }
}


/* ================================================================
   14. HELPERS
   ================================================================ */

/**
 * Shows one screen and hides another.
 * @param {HTMLElement} show - The screen to show
 * @param {HTMLElement} hide - The screen to hide
 */
function showScreen(show, hide) {
  hide.classList.remove('active');
  show.classList.add('active');
}

/** Triggers the bounce-in animation on an element */
function triggerBounce(el) {
  el.classList.remove('bounce-in');
  el.offsetHeight; // force reflow to restart animation
  el.classList.add('bounce-in');
}

/** Triggers the shake animation on an element */
function triggerShake(el) {
  el.classList.remove('shake');
  el.offsetHeight;
  el.classList.add('shake');
}

/** Builds the coloured "chip" tags showing active tables during practice */
function buildChips() {
  chipsRow.innerHTML = '';

  const label = document.createElement('span');
  label.style.cssText = 'font-size:0.72rem;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:0.06em;';
  label.textContent = 'Practising: ';
  chipsRow.appendChild(label);

  const sorted = Array.from(state.selectedTables).sort((a, b) => a - b);
  sorted.forEach((n) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.textContent = `${n}×`;
    chipsRow.appendChild(chip);
  });
}

/** Attaches all event listeners (called once on init) */
function attachEventListeners() {
  selectAllBtn.addEventListener('click', selectAll);
  clearAllBtn.addEventListener('click', clearAll);
  startBtn.addEventListener('click', startSession);
  submitBtn.addEventListener('click', checkAnswer);
  nextBtn.addEventListener('click', newQuestion);
  quitBtn.addEventListener('click', quitSession);
  document.addEventListener('keydown', handleKeydown);
}


/* ================================================================
   START THE APP
   ================================================================ */
init();
