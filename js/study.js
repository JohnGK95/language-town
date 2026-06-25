let currentWordIndex = 0;
let previousWordIndex = null;
let currentStudyWords = [];
let studiedWordIdsThisSession = [];

function populateStudyFilters() {
  const state = getState();

  fillDropdown(
    "study-language",
    state.vocab.map((word) => word.language),
  );

  fillDropdown(
    "study-level",
    state.vocab.map((word) => word.level),
  );

  fillDropdown(
    "study-pack",
    state.vocab.map((word) => word.pack),
  );

  fillDropdown(
    "study-group",
    state.vocab.map((word) => word.group),
  );

  fillDropdown(
    "study-tag",
    state.vocab.map((word) => word.tag),
  );
}

function fillDropdown(id, values) {
  const dropdown = document.getElementById(id);

  if (!dropdown) return;

  const existingDefault = dropdown.querySelector("option");
  dropdown.innerHTML = "";

  if (existingDefault) {
    dropdown.appendChild(existingDefault);
  }

  const uniqueValues = [
    ...new Set(values.filter((value) => value && value.trim() !== "")),
  ];

  uniqueValues.sort();

  uniqueValues.forEach((value) => {
    const option = document.createElement("option");

    option.value = value;
    option.textContent = value;

    dropdown.appendChild(option);
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

  const selectedLanguage = document.getElementById("study-language").value;
  const selectedLevel = document.getElementById("study-level").value;
  const selectedPack = document.getElementById("study-pack").value;
  const selectedGroup = document.getElementById("study-group").value;
  const selectedTag = document.getElementById("study-tag").value;
  const selectedMastery = document.getElementById("study-mastery-filter").value;
  const studyCount = Number(document.getElementById("study-count").value);
  const message = document.getElementById("study-settings-message");

  let words = state.vocab;

  if (selectedLanguage !== "all") {
    words = words.filter((word) => word.language === selectedLanguage);
  }

  if (selectedLevel !== "all") {
    words = words.filter((word) => word.level === selectedLevel);
  }

  if (selectedPack !== "all") {
    words = words.filter((word) => word.pack === selectedPack);
  }

  if (selectedGroup !== "all") {
    words = words.filter((word) => word.group === selectedGroup);
  }

  if (selectedTag !== "all") {
    words = words.filter((word) => word.tag === selectedTag);
  }
  if (selectedMastery !== "all") {
    words = words.filter((word) => {
      const correct = word.quizCorrectCount || 0;

      if (selectedMastery === "new") {
        return correct === 0;
      }

      if (selectedMastery === "familiar") {
        return correct >= 1 && correct < 3;
      }

      if (selectedMastery === "learned") {
        return correct >= 3 && correct < 5;
      }

      if (selectedMastery === "mastered") {
        return correct >= 5;
      }

      return true;
    });
  }
  if (words.length === 0) {
    message.textContent = "No words found for those filters.";
    return;
  }

  currentStudyWords = shuffleArray(words).slice(0, studyCount);
  studiedWordIdsThisSession = [];

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

  const remainingWords = currentStudyWords.filter((word, index) => {
    return !studiedWordIdsThisSession.includes(index);
  });

  if (remainingWords.length === 0) {
    endStudySession();
    return;
  }

  const remainingIndexes = currentStudyWords
    .map((word, index) => index)
    .filter((index) => !studiedWordIdsThisSession.includes(index));

  currentWordIndex =
    remainingIndexes[Math.floor(Math.random() * remainingIndexes.length)];

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
      word.word === currentWord.word &&
      word.meaning === currentWord.meaning &&
      word.language === currentWord.language
    );
  });

  if (!savedWord) return;

  savedWord.timesStudied += 1;
  state.progress.studiedToday += 1;
  state.progress.reviewsCompleted += 1;

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
  studiedWordIdsThisSession.push(currentWordIndex);

  loadStudyWord();
}
function endStudySession() {
  document.getElementById("study-word").textContent = "Study session complete!";
  document.getElementById("study-pronunciation").textContent = "";
  document.getElementById("study-meaning").textContent =
    "You reviewed all selected words.";
  document.getElementById("study-meaning").classList.remove("hidden");

  document.getElementById("study-mastery").classList.add("hidden");
  document.getElementById("study-example").classList.add("hidden");

  document.getElementById("show-answer-btn").classList.add("hidden");
  document.getElementById("forgot-btn").classList.add("hidden");
  document.getElementById("hard-btn").classList.add("hidden");
  document.getElementById("easy-btn").classList.add("hidden");

  document.getElementById("study-settings-message").textContent =
    "Session finished. Start a new session to study more words.";
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

function getStudyNextCitizenRequirement(currentPopulation) {
  if (currentPopulation === 0) return 25;
  if (currentPopulation === 1) return 50;
  return 100;
}

document.addEventListener("DOMContentLoaded", () => {
  populateStudyFilters();

  const startStudyBtn = document.getElementById("start-study-btn");

  if (startStudyBtn) {
    startStudyBtn.addEventListener("click", startStudySession);
  }

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
