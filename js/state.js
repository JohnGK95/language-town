// ===============================
// LANGUAGE VILLAGE - GAME STATE
// ===============================

const DEFAULT_STATE = {
  player: {
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
  },

  resources: {
    coins: 100,
    knowledge: 0,
    wood: 0,
    culture: 0,
  },

  progress: {
    wordsLearned: 0,
    studiedToday: 0,
    reviewsCompleted: 0,
    streak: 0,
  },

  vocab: [],

  village: {
    placedItems: [],
    buildings: {
      townHall: {
        name: "Town Hall",
        level: 1,
      },
      population: {
        current: 0,
        learnedWordsSinceLastCitizen: 0,
        nextCitizenRequirement: 25,
      },
      library: {
        name: "Library",
        level: 1,
      },
      market: {
        name: "Market",
        level: 1,
      },
      lumberMill: {
        name: "Lumber Mill",
        level: 1,
      },
      school: {
        name: "School",
        level: 1,
      },
    },
  },
};

// Load saved state or create new state
function loadState() {
  const savedState = localStorage.getItem("languageVillageState");

  if (savedState) {
    const state = JSON.parse(savedState);

    if (!state.village.placedItems) {
      state.village.placedItems = [];
    }

    if (!state.village.population) {
      state.village.population = {
        current: 0,
        learnedWordsSinceLastCitizen: 0,
        nextCitizenRequirement: 25,
      };
    }

    if (!state.village.buildings.lumberMill) {
      state.village.buildings.lumberMill = {
        name: "Lumber Mill",
        level: 1,
      };
    }

    return state;
  }

  saveState(DEFAULT_STATE);
  return DEFAULT_STATE;
}

// Save state
function saveState(state) {
  localStorage.setItem("languageVillageState", JSON.stringify(state));
}

// Get current state
function getState() {
  return loadState();
}

// Update state
function updateState(newState) {
  saveState(newState);
  renderState();
}

// Add XP
function addXP(amount) {
  const state = getState();

  state.player.xp += amount;

  while (state.player.xp >= state.player.xpToNextLevel) {
    state.player.xp -= state.player.xpToNextLevel;
    state.player.level += 1;
    state.player.xpToNextLevel += 50;
  }

  updateState(state);
}

// Add resource
function addResource(resourceName, amount) {
  const state = getState();

  if (state.resources[resourceName] !== undefined) {
    state.resources[resourceName] += amount;
  }

  updateState(state);
}

// Spend resource
function spendResource(resourceName, amount) {
  const state = getState();

  if (state.resources[resourceName] >= amount) {
    state.resources[resourceName] -= amount;
    updateState(state);
    return true;
  }

  return false;
}

// Render state to page
function renderState() {
  const state = getState();

  const levelElement = document.getElementById("player-level");
  const xpCountElement = document.getElementById("xp-count");
  const xpFillElement = document.getElementById("xp-fill");

  const coinsElement = document.getElementById("coins");
  const knowledgeElement = document.getElementById("knowledge");
  const woodElement = document.getElementById("wood");
  const cultureElement = document.getElementById("culture");

  const wordsLearnedElement = document.getElementById("words-learned");
  const studiedTodayElement = document.getElementById("studied-today");
  const reviewsElement = document.getElementById("reviews");
  const streakElement = document.getElementById("streak");

  if (levelElement) {
    levelElement.textContent = state.player.level;
  }

  if (xpCountElement) {
    xpCountElement.textContent = state.player.xp;
  }

  if (xpFillElement) {
    const xpPercent = (state.player.xp / state.player.xpToNextLevel) * 100;

    xpFillElement.style.width = `${xpPercent}%`;
  }

  if (coinsElement) {
    coinsElement.textContent = state.resources.coins;
  }

  if (knowledgeElement) {
    knowledgeElement.textContent = state.resources.knowledge;
  }

  if (woodElement) {
    woodElement.textContent = state.resources.wood;
  }

  if (cultureElement) {
    cultureElement.textContent = state.resources.culture;
  }

  if (wordsLearnedElement) {
    const learnedCount = state.vocab.filter(
      (word) => word.correctCount > 0,
    ).length;
    wordsLearnedElement.textContent = learnedCount;
  }

  if (studiedTodayElement) {
    studiedTodayElement.textContent = state.progress.studiedToday;
  }

  if (reviewsElement) {
    reviewsElement.textContent = state.progress.reviewsCompleted;
  }

  if (streakElement) {
    streakElement.textContent = state.progress.streak;
  }
}

// Reset game — useful during testing
function resetGame() {
  localStorage.removeItem("languageVillageState");
  location.reload();
}

// Run when page loads
document.addEventListener("DOMContentLoaded", renderState);
