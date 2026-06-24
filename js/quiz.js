let quizWords = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalCoinsEarned = 0;
let totalKnowledgeEarned = 0;
let quizDirection = "meaning-to-word";

function populateGroupDropdown() {
  const state = getState();
  const groupSelect = document.getElementById("quiz-group");

  const groups = [
    ...new Set(
      state.vocab
        .map((word) => word.group)
        .filter((group) => group && group.trim() !== ""),
    ),
  ];

  groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group;
    option.textContent = group;
    groupSelect.appendChild(option);
  });
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function startQuiz() {
  const state = getState();

  const questionCount = Number(document.getElementById("question-count").value);

  const selectedGroup = document.getElementById("quiz-group").value;
  const selectedTag = document.getElementById("quiz-tag").value;

  quizDirection = document.getElementById("quiz-direction").value;

  let availableWords = state.vocab;

  // Filter by group first
  if (selectedGroup !== "all") {
    availableWords = availableWords.filter(
      (word) => word.group === selectedGroup,
    );
  }

  // Then filter by tag
  if (selectedTag !== "all") {
    availableWords = availableWords.filter((word) => word.tag === selectedTag);
  }

  if (availableWords.length < 4) {
    document.getElementById("quiz-setup-message").textContent =
      "You need at least 4 words in this group to make a multiple-choice quiz.";
    return;
  }

  const finalQuestionCount = Math.min(questionCount, availableWords.length);

  quizWords = shuffleArray(availableWords).slice(0, finalQuestionCount);

  currentQuestionIndex = 0;
  correctAnswers = 0;
  totalCoinsEarned = 0;
  totalKnowledgeEarned = 0;

  document.getElementById("quiz-setup").classList.add("hidden");
  document.getElementById("quiz-results").classList.add("hidden");
  document.getElementById("quiz-card").classList.remove("hidden");

  document.getElementById("total-question-number").textContent =
    quizWords.length;

  showQuestion();
}
function showAnswerDetails(word) {
  const state = getState();

  const savedWord = state.vocab.find((entry) => {
    return entry.word === word.word && entry.meaning === word.meaning;
  });

  document.getElementById("detail-word").textContent = word.word;

  document.getElementById("detail-pronunciation").textContent =
    word.pronunciation || "";

  document.getElementById("detail-meaning").textContent = word.meaning || "";

  const masteryElement = document.getElementById("detail-mastery");

  if (masteryElement && savedWord) {
    masteryElement.textContent = getMasteryLabel(savedWord);
  }

  document.getElementById("answer-details").classList.remove("hidden");
}
function showQuestion() {
  const currentWord = quizWords[currentQuestionIndex];

  document.getElementById("current-question-number").textContent =
    currentQuestionIndex + 1;

  const questionElement = document.getElementById("quiz-question");
  const answerOptions = document.getElementById("answer-options");
  const feedback = document.getElementById("quiz-feedback");

  feedback.textContent = "";
  answerOptions.innerHTML = "";
  document.getElementById("answer-details").classList.add("hidden");
  document.getElementById("next-question-btn").classList.add("hidden");
  const distractors = shuffleArray(
    quizWords.filter((word) => word.word !== currentWord.word),
  ).slice(0, 3);

  const options = shuffleArray([currentWord, ...distractors]);

  if (quizDirection === "meaning-to-word") {
    questionElement.textContent = currentWord.meaning;

    options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option.word;
      button.addEventListener("click", () =>
        checkAnswer(option, currentWord, button),
      );
      answerOptions.appendChild(button);
    });
  }

  if (quizDirection === "word-to-meaning") {
    questionElement.textContent = currentWord.word;

    options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option.meaning;
      button.addEventListener("click", () =>
        checkAnswer(option, currentWord, button),
      );
      answerOptions.appendChild(button);
    });
  }
}
function updateWordMastery(correctWord, isCorrect) {
  const state = getState();

  const word = state.vocab.find((entry) => {
    return (
      entry.word === correctWord.word && entry.meaning === correctWord.meaning
    );
  });

  if (!word) return;

  if (!word.quizCorrectCount) {
    word.quizCorrectCount = 0;
  }

  if (!word.quizWrongCount) {
    word.quizWrongCount = 0;
  }

  if (isCorrect) {
    word.quizCorrectCount += 1;
  } else {
    word.quizWrongCount += 1;
  }

  saveState(state);
}
function checkAnswer(selectedOption, correctWord, selectedButton) {
  const answerButtons = document.querySelectorAll("#answer-options button");

  showAnswerDetails(correctWord);

  answerButtons.forEach((button) => {
    button.disabled = true;
  });

  const isCorrect = selectedOption.word === correctWord.word;
  updateWordMastery(correctWord, isCorrect);
  if (isCorrect) {
    selectedButton.classList.add("correct-answer");
    correctAnswers += 1;
    totalKnowledgeEarned += 1;
    totalCoinsEarned += 5;

    document.getElementById("quiz-feedback").textContent =
      "Correct! +1 knowledge, +5 coins.";
  } else {
    selectedButton.classList.add("wrong-answer");

    answerButtons.forEach((button) => {
      if (
        button.textContent ===
        (quizDirection === "meaning-to-word"
          ? correctWord.word
          : correctWord.meaning)
      ) {
        button.classList.add("correct-answer");
      }
    });

    document.getElementById("quiz-feedback").textContent =
      "Not quite. No reward for this question.";
  }

  document.getElementById("next-question-btn").classList.remove("hidden");
}
function goToNextQuestion() {
  currentQuestionIndex += 1;

  if (currentQuestionIndex >= quizWords.length) {
    finishQuiz();
  } else {
    showQuestion();
  }
}
function populateQuizTagDropdown() {
  const state = getState();
  const group = document.getElementById("quiz-group").value;
  const tagSelect = document.getElementById("quiz-tag");

  tagSelect.innerHTML = `<option value="all">All Tags</option>`;

  let words = state.vocab;

  if (group !== "all") {
    words = words.filter((word) => word.group === group);
  }

  const tags = [
    ...new Set(
      words.map((word) => word.tag).filter((tag) => tag && tag.trim() !== ""),
    ),
  ];

  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagSelect.appendChild(option);
  });
}
function addQuizXP(state, amount) {
  state.player.xp += amount;
}
function finishQuiz() {
  const state = getState();

  let bonusKnowledge = 0;

  if (correctAnswers === quizWords.length) {
    bonusKnowledge = 5;
  }

  totalKnowledgeEarned += bonusKnowledge;

  state.resources.coins += totalCoinsEarned;
  state.resources.knowledge += totalKnowledgeEarned;
  const xpEarned = correctAnswers * 3;

  addQuizXP(state, xpEarned);
  if (!state.quizStats) {
    state.quizStats = {
      quizzesTaken: 0,
      totalQuestionsAnswered: 0,
      totalCorrectAnswers: 0,
      perfectQuizzes: 0,
    };
  }

  state.quizStats.quizzesTaken += 1;
  state.quizStats.totalQuestionsAnswered += quizWords.length;
  state.quizStats.totalCorrectAnswers += correctAnswers;

  if (bonusKnowledge > 0) {
    state.quizStats.perfectQuizzes += 1;
  }

  saveState(state);

  document.getElementById("quiz-card").classList.add("hidden");
  document.getElementById("quiz-results").classList.remove("hidden");

  document.getElementById("quiz-score").textContent =
    `${correctAnswers} / ${quizWords.length}`;

  document.getElementById("coins-earned").textContent = totalCoinsEarned;
  document.getElementById("knowledge-earned").textContent =
    totalKnowledgeEarned;
}
function getMasteryLabel(word) {
  const correct = word.quizCorrectCount || 0;

  if (correct >= 5) return "Mastered ⭐⭐⭐⭐";
  if (correct >= 3) return "Learned ⭐⭐⭐";
  if (correct >= 1) return "Familiar ⭐⭐";

  return "New ⭐";
}
function restartQuiz() {
  document.getElementById("quiz-results").classList.add("hidden");
  document.getElementById("quiz-setup").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  populateGroupDropdown();
  document
    .getElementById("quiz-group")
    .addEventListener("change", populateQuizTagDropdown);

  populateQuizTagDropdown();
  document
    .getElementById("start-quiz-btn")
    .addEventListener("click", startQuiz);

  document
    .getElementById("restart-quiz-btn")
    .addEventListener("click", restartQuiz);

  document
    .getElementById("next-question-btn")
    .addEventListener("click", goToNextQuestion);
});
