let currentWordIndex = 0;
let previousWordIndex = null;

function getRandomWordIndex(vocabLength) {
  if (vocabLength === 1) return 0;

  let newIndex;

  do {
    newIndex = Math.floor(Math.random() * vocabLength);
  } while (newIndex === previousWordIndex);

  return newIndex;
}

function loadStudyWord() {
  const state = getState();

  const studyWord = document.getElementById("study-word");
  const pronunciation = document.getElementById("study-pronunciation");
  const meaning = document.getElementById("study-meaning");
  const example = document.getElementById("study-example");

  const showAnswerBtn = document.getElementById("show-answer-btn");
  const forgotBtn = document.getElementById("forgot-btn");
  const hardBtn = document.getElementById("hard-btn");
  const easyBtn = document.getElementById("easy-btn");

  if (state.vocab.length === 0) {
    studyWord.textContent = "No vocabulary yet";
    pronunciation.textContent = "";
    meaning.textContent = "Go add words first.";
    meaning.classList.remove("hidden");

    showAnswerBtn.classList.add("hidden");
    forgotBtn.classList.add("hidden");
    hardBtn.classList.add("hidden");
    easyBtn.classList.add("hidden");

    return;
  }

  currentWordIndex = getRandomWordIndex(state.vocab.length);
  previousWordIndex = currentWordIndex;

  const currentWord = state.vocab[currentWordIndex];

  studyWord.textContent = currentWord.word;
  pronunciation.textContent = currentWord.pronunciation || "";
  meaning.textContent = currentWord.meaning || "";

  example.innerHTML = `
    <strong>Example:</strong><br>
    ${currentWord.example || "No example sentence yet."}<br>
    <em>${currentWord.examplePronunciation || ""}</em><br>
    ${currentWord.exampleMeaning || ""}
  `;

  meaning.classList.add("hidden");
  example.classList.add("hidden");

  showAnswerBtn.classList.remove("hidden");
  forgotBtn.classList.add("hidden");
  hardBtn.classList.add("hidden");
  easyBtn.classList.add("hidden");
}

function showAnswer() {
  document.getElementById("study-meaning").classList.remove("hidden");
  document.getElementById("study-example").classList.remove("hidden");

  document.getElementById("show-answer-btn").classList.add("hidden");
  document.getElementById("forgot-btn").classList.remove("hidden");
  document.getElementById("hard-btn").classList.remove("hidden");
  document.getElementById("easy-btn").classList.remove("hidden");
}

function completeReview(difficulty) {
  const state = getState();
  const word = state.vocab[currentWordIndex];

  word.timesStudied += 1;
  state.progress.studiedToday += 1;
  state.progress.reviewsCompleted += 1;

  if (difficulty === "forgot") {
    // No rewards for forgotten words
  }

  if (difficulty === "hard") {
    state.player.xp += 0;
    state.resources.knowledge += 1;
    state.resources.coins += 1;
  }

  if (difficulty === "easy") {
    state.player.xp += 2;
    state.resources.knowledge += 1;
    state.resources.coins += 1;
    if (!state.progress.easyWordCounter) {
      state.progress.easyWordCounter = 0;
    }

    state.progress.easyWordCounter += 1;

    if (state.progress.easyWordCounter >= 2) {
      state.resources.wood += 1;
      state.progress.easyWordCounter = 0;
    }

    if (word.correctCount === 0) {
      state.progress.wordsLearned += 1;
      handleNewLearnedWord(state);
    }

    word.correctCount += 1;
  }

  while (state.player.xp >= state.player.xpToNextLevel) {
    state.player.xp -= state.player.xpToNextLevel;
    state.player.level += 1;
    state.player.xpToNextLevel += 50;
  }

  saveState(state);
  loadStudyWord();
}

document.addEventListener("DOMContentLoaded", () => {
  loadStudyWord();

  document
    .getElementById("show-answer-btn")
    .addEventListener("click", showAnswer);
  document
    .getElementById("forgot-btn")
    .addEventListener("click", () => completeReview("forgot"));
  document
    .getElementById("hard-btn")
    .addEventListener("click", () => completeReview("hard"));
  document
    .getElementById("easy-btn")
    .addEventListener("click", () => completeReview("easy"));
});
function handleNewLearnedWord(state) {
  if (!state.village.population) {
    state.village.population = {
      current: 0,
      learnedWordsSinceLastCitizen: 0,
      nextCitizenRequirement: 25,
    };
  }

  const populationCap = calculateStudyPopulationCap(state);

  if (state.village.population.current >= populationCap) {
    state.village.population.learnedWordsSinceLastCitizen = 0;
    return;
  }

  state.village.population.learnedWordsSinceLastCitizen += 1;

  if (
    state.village.population.learnedWordsSinceLastCitizen >=
    state.village.population.nextCitizenRequirement
  ) {
    state.village.population.current += 1;
    state.village.population.learnedWordsSinceLastCitizen = 0;
    state.village.population.nextCitizenRequirement =
      getStudyNextCitizenRequirement(state.village.population.current);
  }
}

function calculateStudyPopulationCap(state) {
  return state.village.placedItems
    .filter((item) => item.type === "house")
    .reduce((total, house) => {
      return total + (house.level || 1);
    }, 0);
}

function getStudyNextCitizenRequirement(currentPopulation) {
  if (currentPopulation === 0) return 25;
  if (currentPopulation === 1) return 50;
  return 100;
}
