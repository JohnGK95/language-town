let toneWords = [];
let currentToneIndex = 0;
let correctToneAnswers = 0;
let toneKnowledgeEarned = 0;
let toneCitizenProgressEarned = 0;

function populateToneFilters() {
  const state = getState();

  fillToneDropdown(
    "tone-language",
    state.vocab.map((word) => word.language),
  );

  fillToneDropdown(
    "tone-level",
    state.vocab.map((word) => word.level),
  );

  fillToneDropdown(
    "tone-pack",
    state.vocab.map((word) => word.pack),
  );

  fillToneDropdown(
    "tone-group",
    state.vocab.map((word) => word.group),
  );

  fillToneDropdown(
    "tone-tag",
    state.vocab.map((word) => word.tag),
  );
}

function fillToneDropdown(id, values) {
  const dropdown = document.getElementById(id);

  if (!dropdown) return;

  const defaultOption = dropdown.querySelector("option");
  dropdown.innerHTML = "";

  if (defaultOption) {
    dropdown.appendChild(defaultOption);
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

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getToneMasteryStatus(word) {
  const correct = word.toneCorrectCount || 0;

  if (correct >= 5) return "mastered";
  if (correct >= 3) return "learned";
  if (correct >= 1) return "familiar";

  return "new";
}

function getToneMasteryLabel(word) {
  const status = getToneMasteryStatus(word);

  if (status === "mastered") return "Tone Mastered 🎵🎵🎵🎵";
  if (status === "learned") return "Tone Learned 🎵🎵🎵";
  if (status === "familiar") return "Tone Familiar 🎵🎵";

  return "New Tone Practice 🎵";
}

function getFilteredToneWords() {
  const state = getState();

  const selectedLanguage = document.getElementById("tone-language").value;
  const selectedLevel = document.getElementById("tone-level").value;
  const selectedPack = document.getElementById("tone-pack").value;
  const selectedGroup = document.getElementById("tone-group").value;
  const selectedTag = document.getElementById("tone-tag").value;
  const selectedMastery = document.getElementById("tone-mastery-filter").value;

  let availableWords = state.vocab.filter((word) => {
    return (
      word.tonePractice &&
      word.pronunciation &&
      word.toneDistractor1 &&
      word.toneDistractor2 &&
      word.toneDistractor3
    );
  });

  if (selectedLanguage !== "all") {
    availableWords = availableWords.filter(
      (word) => word.language === selectedLanguage,
    );
  }

  if (selectedLevel !== "all") {
    availableWords = availableWords.filter(
      (word) => word.level === selectedLevel,
    );
  }

  if (selectedPack !== "all") {
    availableWords = availableWords.filter(
      (word) => word.pack === selectedPack,
    );
  }

  if (selectedGroup !== "all") {
    availableWords = availableWords.filter(
      (word) => word.group === selectedGroup,
    );
  }

  if (selectedTag !== "all") {
    availableWords = availableWords.filter((word) => word.tag === selectedTag);
  }

  if (selectedMastery !== "all") {
    availableWords = availableWords.filter((word) => {
      return getToneMasteryStatus(word) === selectedMastery;
    });
  }

  return availableWords;
}

function startTonePractice() {
  const state = getState();
  const schoolLevel = state.village.buildings.school?.level || 1;

  if (schoolLevel < 2) {
    document.getElementById("tone-setup-message").textContent =
      "Tone Practice unlocks when School reaches Level 2.";
    return;
  }

  const questionCount = Number(
    document.getElementById("tone-question-count").value,
  );

  const availableWords = getFilteredToneWords();

  if (availableWords.length < 1) {
    document.getElementById("tone-setup-message").textContent =
      "No tone practice words match these filters.";
    return;
  }

  toneWords = shuffleArray(availableWords).slice(0, questionCount);

  currentToneIndex = 0;
  correctToneAnswers = 0;
  toneKnowledgeEarned = 0;
  toneCitizenProgressEarned = 0;

  document.getElementById("tone-setup").classList.add("hidden");
  document.getElementById("tone-results").classList.add("hidden");
  document.getElementById("tone-card").classList.remove("hidden");

  document.getElementById("total-tone-number").textContent = toneWords.length;
  document.getElementById("tone-setup-message").textContent = "";

  showToneQuestion();
}

function showToneQuestion() {
  const currentWord = toneWords[currentToneIndex];

  document.getElementById("current-tone-number").textContent =
    currentToneIndex + 1;

  document.getElementById("tone-word").textContent = currentWord.word;
  document.getElementById("tone-practice-prompt").textContent =
    currentWord.tonePractice;

  document.getElementById("tone-feedback").textContent = "";
  document.getElementById("tone-answer-details").classList.add("hidden");
  document.getElementById("next-tone-btn").classList.add("hidden");

  const toneOptions = document.getElementById("tone-options");
  toneOptions.innerHTML = "";

  const options = shuffleArray([
    currentWord.pronunciation,
    currentWord.toneDistractor1,
    currentWord.toneDistractor2,
    currentWord.toneDistractor3,
  ]);

  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", () =>
      checkToneAnswer(option, currentWord, button),
    );

    toneOptions.appendChild(button);
  });
}

function checkToneAnswer(selectedPronunciation, correctWord, selectedButton) {
  const toneButtons = document.querySelectorAll("#tone-options button");
  const isCorrect = selectedPronunciation === correctWord.pronunciation;

  toneButtons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === correctWord.pronunciation) {
      button.classList.add("correct-answer");
    }
  });

  if (isCorrect) {
    selectedButton.classList.add("correct-answer");

    correctToneAnswers += 1;
    toneKnowledgeEarned += 1;
    toneCitizenProgressEarned += 1;

    document.getElementById("tone-feedback").textContent =
      "Correct! +1 knowledge and +1 citizen progress.";
  } else {
    selectedButton.classList.add("wrong-answer");

    document.getElementById("tone-feedback").textContent =
      "Not quite. The correct tones are shown.";
  }

  updateToneProgress(correctWord, isCorrect);

  showToneAnswerDetails(correctWord);

  document.getElementById("next-tone-btn").classList.remove("hidden");
}

function updateToneProgress(correctWord, isCorrect) {
  const state = getState();

  const savedWord = state.vocab.find((word) => {
    return (
      word.word === correctWord.word &&
      word.meaning === correctWord.meaning &&
      word.language === correctWord.language
    );
  });

  if (!savedWord) return;

  if (!savedWord.toneCorrectCount) {
    savedWord.toneCorrectCount = 0;
  }

  if (!savedWord.toneWrongCount) {
    savedWord.toneWrongCount = 0;
  }

  if (isCorrect) {
    savedWord.toneCorrectCount += 1;
    state.resources.knowledge += 1;
    handleToneCitizenProgress(state);
  } else {
    savedWord.toneWrongCount += 1;
  }

  saveState(state);
}

function handleToneCitizenProgress(state) {
  if (!state.village.population) {
    state.village.population = {
      current: 0,
      learnedWordsSinceLastCitizen: 0,
      nextCitizenRequirement: 25,
    };
  }

  const populationCap = calculateTonePopulationCap(state);

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
      getToneNextCitizenRequirement(state.village.population.current);
  }
}

function calculateTonePopulationCap(state) {
  const basePopulationCap = 5;

  const housePopulationCap = state.village.placedItems
    .filter((item) => item.type === "house")
    .reduce((total, house) => {
      return total + (house.level || 1);
    }, 0);

  return basePopulationCap + housePopulationCap;
}

function getToneNextCitizenRequirement(currentPopulation) {
  if (currentPopulation === 0) return 25;
  if (currentPopulation === 1) return 50;
  return 100;
}

function showToneAnswerDetails(word) {
  const state = getState();

  const savedWord = state.vocab.find((entry) => {
    return (
      entry.word === word.word &&
      entry.meaning === word.meaning &&
      entry.language === word.language
    );
  });

  document.getElementById("tone-detail-word").textContent = word.word;
  document.getElementById("tone-detail-pronunciation").textContent =
    word.pronunciation || "";
  document.getElementById("tone-detail-meaning").textContent =
    word.meaning || "";

  document.getElementById("tone-detail-progress").textContent = savedWord
    ? getToneMasteryLabel(savedWord)
    : "";

  document.getElementById("tone-answer-details").classList.remove("hidden");
}

function goToNextToneQuestion() {
  currentToneIndex += 1;

  if (currentToneIndex >= toneWords.length) {
    finishTonePractice();
  } else {
    showToneQuestion();
  }
}

function finishTonePractice() {
  document.getElementById("tone-card").classList.add("hidden");
  document.getElementById("tone-results").classList.remove("hidden");

  document.getElementById("tone-score").textContent =
    `${correctToneAnswers} / ${toneWords.length}`;

  document.getElementById("tone-knowledge-earned").textContent =
    toneKnowledgeEarned;

  document.getElementById("tone-citizen-earned").textContent =
    toneCitizenProgressEarned;
}

function restartTonePractice() {
  document.getElementById("tone-results").classList.add("hidden");
  document.getElementById("tone-setup").classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  populateToneFilters();

  document
    .getElementById("start-tone-btn")
    .addEventListener("click", startTonePractice);

  document
    .getElementById("next-tone-btn")
    .addEventListener("click", goToNextToneQuestion);

  document
    .getElementById("restart-tone-btn")
    .addEventListener("click", restartTonePractice);
});
