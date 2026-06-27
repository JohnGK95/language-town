let toneWords = [];
let currentToneIndex = 0;
let correctToneAnswers = 0;
let toneKnowledgeEarned = 0;
let toneCitizenProgressEarned = 0;
let toneCitizensAdded = 0;

const MARKED_TONE_MAP = {
  ā: 1,
  á: 2,
  ǎ: 3,
  à: 4,
  ē: 1,
  é: 2,
  ě: 3,
  è: 4,
  ī: 1,
  í: 2,
  ǐ: 3,
  ì: 4,
  ō: 1,
  ó: 2,
  ǒ: 3,
  ò: 4,
  ū: 1,
  ú: 2,
  ǔ: 3,
  ù: 4,
  ǖ: 1,
  ǘ: 2,
  ǚ: 3,
  ǜ: 4,
  Ā: 1,
  Á: 2,
  Ǎ: 3,
  À: 4,
  Ē: 1,
  É: 2,
  Ě: 3,
  È: 4,
  Ī: 1,
  Í: 2,
  Ǐ: 3,
  Ì: 4,
  Ō: 1,
  Ó: 2,
  Ǒ: 3,
  Ò: 4,
  Ū: 1,
  Ú: 2,
  Ǔ: 3,
  Ù: 4,
  Ǖ: 1,
  Ǘ: 2,
  Ǚ: 3,
  Ǜ: 4,
};

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

function extractTonePattern(pronunciation) {
  if (!pronunciation) return "";

  const syllables = pronunciation
    .replace(/[，。！？,.!?;:()]/g, " ")
    .split(/\s+/)
    .map((syllable) => syllable.trim())
    .filter(Boolean);

  return syllables
    .map(getSyllableTone)
    .filter((tone) => tone !== null)
    .join("-");
}

function getSyllableTone(syllable) {
  const numberedTone = syllable.match(/[1-5]$/);

  if (numberedTone) {
    return numberedTone[0];
  }

  for (const character of syllable) {
    if (MARKED_TONE_MAP[character]) {
      return String(MARKED_TONE_MAP[character]);
    }
  }

  if (/^[a-züv:]+$/i.test(syllable)) {
    return "5";
  }

  return null;
}

function formatTonePattern(pattern) {
  return "Tone pattern " + pattern;
}

function createToneDistractors(correctPattern) {
  const tones = correctPattern.split("-");
  const distractors = new Set();

  for (let i = 0; i < tones.length; i++) {
    for (let tone = 1; tone <= 5; tone++) {
      const replacement = String(tone);

      if (replacement === tones[i]) continue;

      const variant = [...tones];
      variant[i] = replacement;
      distractors.add(variant.join("-"));
    }
  }

  if (tones.length > 1) {
    distractors.add([...tones].reverse().join("-"));
  }

  return shuffleArray([...distractors]).slice(0, 3);
}

function getToneOptions(word) {
  const correctPattern = extractTonePattern(word.pronunciation);
  const customDistractors = [
    word.toneDistractor1,
    word.toneDistractor2,
    word.toneDistractor3,
  ]
    .map(extractTonePattern)
    .filter((pattern) => pattern && pattern !== correctPattern);

  const generatedDistractors = createToneDistractors(correctPattern);
  const options = [correctPattern, ...customDistractors, ...generatedDistractors];

  return shuffleArray([...new Set(options)].slice(0, 4));
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

  if (status === "mastered") return "Tone Mastered";
  if (status === "learned") return "Tone Learned";
  if (status === "familiar") return "Tone Familiar";

  return "New Tone Practice";
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
    return word.pronunciation && extractTonePattern(word.pronunciation);
  });

  if (selectedLanguage !== "all") {
    availableWords = availableWords.filter(
      (word) => word.language === selectedLanguage,
    );
  }

  if (selectedLevel !== "all") {
    availableWords = availableWords.filter((word) => word.level === selectedLevel);
  }

  if (selectedPack !== "all") {
    availableWords = availableWords.filter((word) => word.pack === selectedPack);
  }

  if (selectedGroup !== "all") {
    availableWords = availableWords.filter((word) => word.group === selectedGroup);
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
  if (!canUseTonePractice()) {
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
      "No words with readable pinyin tones match these filters.";
    return;
  }

  toneWords = shuffleArray(availableWords).slice(0, questionCount);

  currentToneIndex = 0;
  correctToneAnswers = 0;
  toneKnowledgeEarned = 0;
  toneCitizenProgressEarned = 0;
  toneCitizensAdded = 0;

  document.getElementById("tone-setup").classList.add("hidden");
  document.getElementById("tone-results").classList.add("hidden");
  document.getElementById("tone-card").classList.remove("hidden");

  document.getElementById("total-tone-number").textContent = toneWords.length;
  document.getElementById("tone-setup-message").textContent = "";

  showToneQuestion();
}

function showToneQuestion() {
  const currentWord = toneWords[currentToneIndex];
  const prompt =
    currentWord.tonePractice || "Choose the correct tone pattern for this word.";

  document.getElementById("current-tone-number").textContent =
    currentToneIndex + 1;

  document.getElementById("tone-word").textContent = currentWord.word;
  document.getElementById("tone-practice-prompt").textContent = prompt;

  document.getElementById("tone-feedback").textContent = "";
  document.getElementById("tone-answer-details").classList.add("hidden");
  document.getElementById("next-tone-btn").classList.add("hidden");

  const toneOptions = document.getElementById("tone-options");
  toneOptions.innerHTML = "";

  getToneOptions(currentWord).forEach((option) => {
    const button = document.createElement("button");
    button.textContent = formatTonePattern(option);
    button.dataset.tonePattern = option;
    button.addEventListener("click", () =>
      checkToneAnswer(option, currentWord, button),
    );

    toneOptions.appendChild(button);
  });
}

function checkToneAnswer(selectedPattern, correctWord, selectedButton) {
  const toneButtons = document.querySelectorAll("#tone-options button");
  const correctPattern = extractTonePattern(correctWord.pronunciation);
  const isCorrect = selectedPattern === correctPattern;

  toneButtons.forEach((button) => {
    button.disabled = true;

    if (button.dataset.tonePattern === correctPattern) {
      button.classList.add("correct-answer");
    }
  });

  if (isCorrect) {
    selectedButton.classList.add("correct-answer");

    correctToneAnswers += 1;
    toneKnowledgeEarned += 1;
    toneCitizenProgressEarned += 1;

    const rewardResult = addKnowledgeAndCitizenProgress(1, 1);
    toneCitizensAdded += rewardResult.citizensAdded;

    document.getElementById("tone-feedback").textContent =
      rewardResult.citizensAdded > 0
        ? "Correct! +1 knowledge, +1 citizen progress, and a new citizen joined."
        : "Correct! +1 knowledge and +1 citizen progress.";
  } else {
    selectedButton.classList.add("wrong-answer");

    document.getElementById("tone-feedback").textContent =
      "Not quite. The correct tone pattern is shown.";
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
  } else {
    savedWord.toneWrongCount += 1;
  }

  saveState(state);
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
  document.getElementById("tone-detail-meaning").textContent = word.meaning || "";

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
    correctToneAnswers + " / " + toneWords.length;

  document.getElementById("tone-knowledge-earned").textContent =
    toneKnowledgeEarned;

  document.getElementById("tone-citizen-earned").textContent =
    toneCitizensAdded > 0
      ? toneCitizenProgressEarned + " progress, " + toneCitizensAdded + " new citizen(s)"
      : toneCitizenProgressEarned;
}

function restartTonePractice() {
  document.getElementById("tone-results").classList.add("hidden");
  document.getElementById("tone-setup").classList.remove("hidden");
}

function renderTonePracticeLockState() {
  const startButton = document.getElementById("start-tone-btn");
  const message = document.getElementById("tone-setup-message");

  if (canUseTonePractice()) {
    startButton.disabled = false;
    message.textContent = "";
    return;
  }

  startButton.disabled = true;
  message.textContent = "Tone Practice unlocks when School reaches Level 2.";
}

document.addEventListener("DOMContentLoaded", () => {
  populateToneFilters();
  renderTonePracticeLockState();

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
