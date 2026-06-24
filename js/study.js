let currentWordIndex = 0;
let previousWordIndex = null;
let currentStudyWords = [];

function populateStudyGroupDropdown() {
  const state = getState();
  const groupSelect = document.getElementById("study-group");

  if (!groupSelect) return;

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

function getMasteryLabel(word) {
  const correct = word.quizCorrectCount || 0;

  if (correct >= 5) return "Mastered ⭐⭐⭐⭐";
  if (correct >= 3) return "Learned ⭐⭐⭐";
  if (correct >= 1) return "Familiar ⭐⭐";

  return "New ⭐";
}

function startStudySession() {
  const state = getState();
  const selectedGroup = document.getElementById("study-group").value;
  const selectedTag = document.getElementById("study-tag").value;
  const studyCount = Number(document.getElementById("study-count").value);
  const message = document.getElementById("study-settings-message");

  let words = state.vocab;

  if (selectedGroup !== "all") {
    words = words.filter((word) => word.group === selectedGroup);
  }

  if (selectedTag !== "all") {
    words = words.filter((word) => word.tag === selectedTag);
  }

  if (words.length === 0) {
    message.textContent = "No words found for those filters.";
    return;
  }

  currentStudyWords = shuffleArray(words).slice(0, studyCount);

  message.textContent = `Studying ${currentStudyWords.length} word(s).`;

  previousWordIndex = null;
  loadStudyWord();
}
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
function getRandomWordIndex(vocabLength) {
  if (vocabLength === 1) return 0;

  let newIndex;

  do {
    newIndex = Math.floor(Math.random() * vocabLength);
  } while (newIndex === previousWordIndex);

  return newIndex;
}

function loadStudyWord() {
  const studyWord = document.getElementById("study-word");
  const pronunciation = document.getElementById("study-pronunciation");
  const meaning = document.getElementById("study-meaning");
  const mastery = document.getElementById("study-mastery");
  const example = document.getElementById("study-example");

  const showAnswerBtn = document.getElementById("show-answer-btn");
  const forgotBtn = document.getElementById("forgot-btn");
  const hardBtn = document.getElementById("hard-btn");
  const easyBtn = document.getElementById("easy-btn");

  if (currentStudyWords.length === 0) {
    const state = getState();
    currentStudyWords = state.vocab;
  }

  if (currentStudyWords.length === 0) {
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

  currentWordIndex = getRandomWordIndex(currentStudyWords.length);
  previousWordIndex = currentWordIndex;

  const currentWord = currentStudyWords[currentWordIndex];

  studyWord.textContent = currentWord.word;
  pronunciation.textContent = currentWord.pronunciation || "";
  meaning.textContent = currentWord.meaning || "";
  mastery.textContent = getMasteryLabel(currentWord);

  example.innerHTML = `
    <strong>Example Sentence:</strong><br>
    ${currentWord.example || "No example sentence yet."}<br><br>

    <strong>Sentence Pronunciation:</strong><br>
    ${currentWord.examplePronunciation || "No sentence pronunciation yet."}<br><br>

    <strong>Sentence Meaning:</strong><br>
    ${currentWord.exampleMeaning || "No sentence meaning yet."}
  `;

  meaning.classList.add("hidden");
  mastery.classList.add("hidden");
  example.classList.add("hidden");

  showAnswerBtn.classList.remove("hidden");
  forgotBtn.classList.add("hidden");
  hardBtn.classList.add("hidden");
  easyBtn.classList.add("hidden");
}

function showAnswer() {
  document.getElementById("study-meaning").classList.remove("hidden");
  document.getElementById("study-mastery").classList.remove("hidden");
  document.getElementById("study-example").classList.remove("hidden");

  document.getElementById("show-answer-btn").classList.add("hidden");
  document.getElementById("forgot-btn").classList.remove("hidden");
  document.getElementById("hard-btn").classList.remove("hidden");
  document.getElementById("easy-btn").classList.remove("hidden");
}

function completeReview(difficulty) {
  const state = getState();
  const currentWord = currentStudyWords[currentWordIndex];

  const savedWord = state.vocab.find((word) => {
    return (
      word.word === currentWord.word && word.meaning === currentWord.meaning
    );
  });

  if (!savedWord) return;

  savedWord.timesStudied += 1;
  state.progress.studiedToday += 1;
  state.progress.reviewsCompleted += 1;

  if (difficulty === "forgot") {
    // No rewards for forgotten words
  }

  if (difficulty === "hard") {
    state.resources.knowledge += 2;
    state.resources.coins += 1;
  }

  if (difficulty === "easy") {
    state.resources.knowledge += 3;
    state.resources.coins += 2;

    if (!state.progress.easyWordCounter) {
      state.progress.easyWordCounter = 0;
    }

    state.progress.easyWordCounter += 1;

    if (state.progress.easyWordCounter >= 2) {
      state.resources.wood += 1;
      state.progress.easyWordCounter = 0;
    }

    if (savedWord.correctCount === 0) {
      state.progress.wordsLearned += 1;
      handleNewLearnedWord(state);
    }

    savedWord.correctCount += 1;
  }

  saveState(state);

  currentStudyWords[currentWordIndex] = savedWord;

  loadStudyWord();
}

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
  const basePopulationCap = 5;

  const housePopulationCap = state.village.placedItems
    .filter((item) => item.type === "house")
    .reduce((total, house) => {
      return total + (house.level || 1);
    }, 0);

  return basePopulationCap + housePopulationCap;
}
function populateStudyTagDropdown() {
  const state = getState();
  const group = document.getElementById("study-group").value;
  const tagSelect = document.getElementById("study-tag");

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
function getStudyNextCitizenRequirement(currentPopulation) {
  if (currentPopulation === 0) return 25;
  if (currentPopulation === 1) return 50;
  return 100;
}

document.addEventListener("DOMContentLoaded", () => {
  populateStudyGroupDropdown();

  const startStudyBtn = document.getElementById("start-study-btn");

  if (startStudyBtn) {
    startStudyBtn.addEventListener("click", startStudySession);
  }

  loadStudyWord();
  document
    .getElementById("study-group")
    .addEventListener("change", populateStudyTagDropdown);

  populateStudyTagDropdown();
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
