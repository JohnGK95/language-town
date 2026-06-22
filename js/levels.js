const LEVEL_REQUIREMENTS = {
  2: {
    xp: 150,
    learnedWords: 50,
    familiarWords: 25,
    masteredWords: 10,
    citizens: 1,
    unlocks: ["Builder Tao", "Houses", "Population system"],
  },
  3: {
    xp: 300,
    learnedWords: 100,
    familiarWords: 50,
    masteredWords: 25,
    citizens: 3,
    unlocks: ["Farmer Mei", "Farm", "Rice"],
  },
  4: {
    xp: 500,
    learnedWords: 175,
    familiarWords: 85,
    masteredWords: 40,
    citizens: 5,
    unlocks: ["Mandarin Teacher expansion", "Wheat", "Quests"],
  },
};

function countLearnedWords(state) {
  return state.vocab.filter((word) => (word.correctCount || 0) > 0).length;
}

function countFamiliarWords(state) {
  return state.vocab.filter((word) => (word.quizCorrectCount || 0) >= 1).length;
}

function countMasteredWords(state) {
  return state.vocab.filter((word) => (word.quizCorrectCount || 0) >= 5).length;
}

function getCurrentLevelRequirement() {
  const state = getState();
  return LEVEL_REQUIREMENTS[state.player.level + 1];
}

function renderLevelModal() {
  const state = getState();
  const nextLevel = state.player.level + 1;
  const req = LEVEL_REQUIREMENTS[nextLevel];

  const title = document.getElementById("level-modal-title");
  const reqList = document.getElementById("level-requirements-list");
  const unlockList = document.getElementById("level-unlocks-list");
  const levelUpBtn = document.getElementById("level-up-btn");

  if (!req) {
    title.textContent = "Max Level Reached";
    reqList.innerHTML = "<p>You have reached the current level cap.</p>";
    unlockList.innerHTML = "";
    levelUpBtn.classList.add("hidden");
    return;
  }

  const current = {
    xp: state.player.xp,
    learnedWords: countLearnedWords(state),
    familiarWords: countFamiliarWords(state),
    masteredWords: countMasteredWords(state),
    citizens: state.village.population.current,
  };

  title.textContent = `Level ${state.player.level} → Level ${nextLevel}`;

  const requirements = [
    ["XP", current.xp, req.xp],
    ["Learned Words", current.learnedWords, req.learnedWords],
    ["Familiar Words", current.familiarWords, req.familiarWords],
    ["Mastered Words", current.masteredWords, req.masteredWords],
    ["Citizens", current.citizens, req.citizens],
  ];

  reqList.innerHTML = requirements
    .map(([label, value, needed]) => {
      const complete = value >= needed;

      return `
        <div class="requirement-row">
          <span>${label}</span>
          <span class="${complete ? "requirement-complete" : "requirement-incomplete"}">
            ${value} / ${needed}
          </span>
        </div>
      `;
    })
    .join("");

  unlockList.innerHTML = req.unlocks
    .map((unlock) => `<p>🔓 ${unlock}</p>`)
    .join("");

  const allComplete = requirements.every(
    ([, value, needed]) => value >= needed,
  );

  if (allComplete) {
    levelUpBtn.classList.remove("hidden");
  } else {
    levelUpBtn.classList.add("hidden");
  }
}

function openLevelModal() {
  renderLevelModal();
  document.getElementById("level-modal").classList.remove("hidden");
}

function closeLevelModal() {
  document.getElementById("level-modal").classList.add("hidden");
}

function levelUpPlayer() {
  const state = getState();

  state.player.level += 1;
  state.player.xp = 0;

  state.villagers.forEach((villager) => {
    if (villager.unlockLevel && state.player.level >= villager.unlockLevel) {
      villager.unlocked = true;
    }
  });

  saveState(state);
  renderState();
  renderLevelModal();

  document.getElementById("level-modal-message").textContent =
    `You reached Level ${state.player.level}!`;
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("open-level-modal-btn")
    .addEventListener("click", openLevelModal);

  document
    .getElementById("close-level-modal-btn")
    .addEventListener("click", closeLevelModal);

  document
    .getElementById("level-up-btn")
    .addEventListener("click", levelUpPlayer);
});
