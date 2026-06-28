// ===============================
// LANGUAGE TOWN - GAME STATE
// ===============================

const STORAGE_KEY = "languageTownState";
const LEGACY_STORAGE_KEY = "languageVillageState";

const DEFAULT_PRODUCTS = [
  { id: "rice", type: "crop", standardName: "Rice", luxuryName: "Chishang Rice", icon: "R", unlockLevel: 3, luxuryUnlockLevel: 6, standardPrice: 5, luxuryPrice: 15, luxuryCulture: 1, discoveryPack: "Rice Discovery Pack", dishes: "Braised pork rice, rice ball", luxuryUnlocked: false },
  { id: "wheat", type: "crop", standardName: "Wheat", luxuryName: "Taiwan Wheat", icon: "W", unlockLevel: 4, luxuryUnlockLevel: 7, standardPrice: 6, luxuryPrice: 18, luxuryCulture: 1, discoveryPack: "Wheat Discovery Pack", dishes: "Scallion pancake, noodles", luxuryUnlocked: false },
  { id: "soybean", type: "crop", standardName: "Soybean", luxuryName: "Tainan Soybean", icon: "S", unlockLevel: 5, luxuryUnlockLevel: 8, standardPrice: 7, luxuryPrice: 21, luxuryCulture: 1, discoveryPack: "Soybean Discovery Pack", dishes: "Soy milk, tofu pudding", luxuryUnlocked: false },
  { id: "greenOnion", type: "crop", standardName: "Green Onion", luxuryName: "Yilan Sanxing Scallion", icon: "G", unlockLevel: 6, luxuryUnlockLevel: 9, standardPrice: 8, luxuryPrice: 28, luxuryCulture: 2, discoveryPack: "Yilan Green Onion Discovery Pack", dishes: "Scallion pancake, green onion bun", luxuryUnlocked: false },
  { id: "tea", type: "crop", standardName: "Tea", luxuryName: "Alishan High Mountain Tea", icon: "T", unlockLevel: 10, luxuryUnlockLevel: 12, standardPrice: 12, luxuryPrice: 40, luxuryCulture: 3, discoveryPack: "Tea Discovery Pack", dishes: "Bubble tea, tea eggs", luxuryUnlocked: false },
];

const DEFAULT_STATE = {
  townName: "Language Town",

  player: {
    name: "Player",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
  },

  resources: {
    coins: 100,
    knowledge: 0,
    wood: 0,
    culture: 0,
    rice: 0,
    wheat: 0,
    soybean: 0,
    greenOnion: 0,
    tea: 0,
  },

  progress: {
    wordsLearned: 0,
    studiedToday: 0,
    reviewsCompleted: 0,
    streak: 0,
  },

  vocab: [],

  products: DEFAULT_PRODUCTS,

  productUnlocks: {},

  productSlotHistory: {},

  villagers: [
    {
      id: "mayor_elian",
      name: "Mayor Elian",
      role: "Mayor",
      building: "Town Hall",
      relationshipLevel: 1,
      relationshipPoints: 0,
      relationshipXP: 0,
      lastInteractionDate: null,
      dailyTaskCompleted: false,
      streak: 0,
      unlocked: true,
      dialogue:
        "Welcome, founder. A town grows when its people and language grow together.",
      focus: "Community and town growth",
    },
    {
      id: "archivist_mina",
      name: "Archivist Mina",
      role: "Librarian",
      building: "Library",
      relationshipLevel: 1,
      relationshipPoints: 0,
      relationshipXP: 0,
      lastInteractionDate: null,
      dailyTaskCompleted: false,
      streak: 0,
      unlocked: true,
      dialogue: "Every word you learn becomes part of our shared archive.",
      focus: "Vocabulary and study tools",
    },
    {
      id: "teacher_lian",
      name: "Teacher Lian",
      role: "Mandarin Teacher",
      building: "School",
      relationshipLevel: 1,
      relationshipPoints: 0,
      relationshipXP: 0,
      lastInteractionDate: null,
      dailyTaskCompleted: false,
      streak: 0,
      unlocked: true,
      dialogue:
        "Practice turns knowledge into skill. Let us keep improving together.",
      focus: "Pronunciation, grammar, writing, and reading",
    },
    {
      id: "merchant_ren",
      name: "Merchant Ren",
      role: "Merchant",
      building: "Market",
      relationshipLevel: 1,
      relationshipPoints: 0,
      relationshipXP: 0,
      lastInteractionDate: null,
      dailyTaskCompleted: false,
      streak: 0,
      unlocked: true,
      dialogue: "Bring me coins, and I will help your town prosper.",
      focus: "Shopping, trade, and economy",
    },
    {
      id: "foreman_rowan",
      name: "Foreman Rowan",
      role: "Lumber Mill Foreman",
      building: "Lumber Mill",
      relationshipLevel: 1,
      relationshipPoints: 0,
      relationshipXP: 0,
      lastInteractionDate: null,
      dailyTaskCompleted: false,
      streak: 0,
      unlocked: true,
      dialogue:
        "Strong buildings need strong timber. Keep learning, and we will keep building.",
      focus: "Construction and materials",
    },
    {
      id: "builder_tao",
      name: "Builder Tao",
      role: "Builder",
      building: "Build Mode",
      relationshipLevel: 1,
      relationshipPoints: 0,
      relationshipXP: 0,
      lastInteractionDate: null,
      dailyTaskCompleted: false,
      streak: 0,
      unlocked: false,
      unlockLevel: 2,
      dialogue: "People need homes before they can settle down.",
      focus: "Housing and construction",
    },
    {
      id: "farmer_mei",
      name: "Farmer Mei",
      role: "Farmer",
      building: "Farm",
      relationshipLevel: 1,
      relationshipPoints: 0,
      relationshipXP: 0,
      lastInteractionDate: null,
      dailyTaskCompleted: false,
      streak: 0,
      unlocked: false,
      unlockLevel: 3,
      dialogue: "The land teaches us patience, and every crop has a story.",
      focus: "Food, farming, and Taiwanese ingredients",
    },
  ],

  village: {
    placedItems: [],

    population: {
      current: 0,
      learnedWordsSinceLastCitizen: 0,
      nextCitizenRequirement: 25,
    },

    buildings: {
      townHall: {
        name: "Town Hall",
        level: 1,
        x: 7,
        y: 2,
        width: 3,
        height: 2,
      },
      library: {
        name: "Library",
        level: 1,
        x: 3,
        y: 3,
        width: 2,
        height: 2,
      },
      market: {
        name: "Market",
        level: 1,
        x: 12,
        y: 4,
        width: 2,
        height: 2,
      },
      lumberMill: {
        name: "Lumber Mill",
        level: 1,
        x: 13,
        y: 8,
        width: 2,
        height: 2,
      },
      school: {
        name: "School",
        level: 1,
        x: 6,
        y: 7,
        width: 3,
        height: 2,
      },
    },
  },
};
function renderPlayerName() {
  const state = getState();

  const playerNameDisplay = document.getElementById("player-name-display");
  const playerNameInput = document.getElementById("player-name-input");

  if (playerNameDisplay) {
    playerNameDisplay.textContent = state.player.name || "Player";
  }

  if (playerNameInput) {
    playerNameInput.value = state.player.name || "Player";
  }
}

function openPlayerNameModal() {
  renderPlayerName();
  document.getElementById("player-name-modal").classList.remove("hidden");
}

function closePlayerNameModal() {
  document.getElementById("player-name-modal").classList.add("hidden");
}

function savePlayerName() {
  const state = getState();
  const input = document.getElementById("player-name-input");
  const newName = input.value.trim();

  if (!newName) return;

  state.player.name = newName;

  saveState(state);
  renderPlayerName();

  document.getElementById("player-name-modal").classList.add("hidden");
}
function normalizeProduct(product) {
  const normalized = {
    id: product.id || createProductId(product.standardName || product.name || "product"),
    type: product.type || "crop",
    standardName: product.standardName || product.name || "Product",
    luxuryName: product.luxuryName || "",
    icon: product.icon || "P",
    unlockLevel: Number(product.unlockLevel || 1),
    luxuryUnlockLevel: Number(product.luxuryUnlockLevel || product.unlockLevel || 1),
    standardPrice: Number(product.standardPrice || 1),
    luxuryPrice: Number(product.luxuryPrice || product.standardPrice || 1),
    luxuryCulture: Number(product.luxuryCulture || 0),
    discoveryPack: product.discoveryPack || "",
    dishes: product.dishes || "",
    luxuryUnlocked: Boolean(product.luxuryUnlocked),
  };
  return normalized;
}

function createProductId(name) {
  return String(name || "product").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "product";
}

function getProducts(state = getState()) {
  return (state.products || []).map(normalizeProduct);
}

function saveProducts(products) {
  const state = getState();
  state.products = products.map(normalizeProduct);
  saveState(state);
}

function findProduct(productId, state = getState()) {
  return getProducts(state).find((product) => product.id === productId);
}

function getProductVariant(productKey, state = getState()) {
  const [productId, variant = "standard"] = String(productKey || "").split(":");
  const product = findProduct(productId, state);
  if (!product) return null;
  return { key: productId + ":" + variant, product, productId, variant, name: variant === "luxury" ? product.luxuryName : product.standardName, price: variant === "luxury" ? product.luxuryPrice : product.standardPrice, culture: variant === "luxury" ? product.luxuryCulture : 0 };
}

function ensureProductState(state) {
  if (!Array.isArray(state.products)) state.products = DEFAULT_PRODUCTS.map(normalizeProduct);
  state.products = state.products.map(normalizeProduct);
  DEFAULT_PRODUCTS.forEach((defaultProduct) => {
    if (!state.products.some((product) => product.id === defaultProduct.id)) state.products.push(normalizeProduct(defaultProduct));
  });
  if (!state.productUnlocks) state.productUnlocks = {};
}
// Load saved state or create new state
function loadState() {
  const savedState =
    localStorage.getItem(STORAGE_KEY) ||
    localStorage.getItem(LEGACY_STORAGE_KEY);

  if (savedState) {
    const state = JSON.parse(savedState);

    if (!state.townName) {
      state.townName = "Language Town";
    }

    if (!state.villagers || state.villagers.length === 0) {
      state.villagers = DEFAULT_STATE.villagers;
    }
    state.villagers.forEach((villager) => {
      if (villager.relationshipXP === undefined) {
        villager.relationshipXP = villager.relationshipPoints || 0;
      }

      if (villager.lastInteractionDate === undefined) {
        villager.lastInteractionDate = null;
      }

      if (villager.dailyTaskCompleted === undefined) {
        villager.dailyTaskCompleted = false;
      }

      if (villager.streak === undefined) {
        villager.streak = 0;
      }
    });
    if (!state.village) {
      state.village = DEFAULT_STATE.village;
    }

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
    if (!state.player.name) {
      state.player.name = "Player";
    }
    if (!state.village.buildings) {
      state.village.buildings = DEFAULT_STATE.village.buildings;
    }

    if (!state.village.buildings.lumberMill) {
      state.village.buildings.lumberMill = {
        name: "Lumber Mill",
        level: 1,
      };
    }
    Object.keys(DEFAULT_STATE.village.buildings).forEach((buildingId) => {
      if (!state.village.buildings[buildingId]) {
        state.village.buildings[buildingId] =
          DEFAULT_STATE.village.buildings[buildingId];
      }

      const defaultBuilding = DEFAULT_STATE.village.buildings[buildingId];
      const savedBuilding = state.village.buildings[buildingId];

      if (!savedBuilding.x) savedBuilding.x = defaultBuilding.x;
      if (!savedBuilding.y) savedBuilding.y = defaultBuilding.y;
      if (!savedBuilding.width) savedBuilding.width = defaultBuilding.width;
      if (!savedBuilding.height) savedBuilding.height = defaultBuilding.height;
    });
    ensureProductState(state);
    if (!Array.isArray(state.vocab)) {
      state.vocab = [];
    }
    state.vocab.forEach((word) => {
      if (word.language === undefined) word.language = "";
      if (word.tonePractice === undefined) word.tonePractice = "";
      if (word.toneDistractor1 === undefined) word.toneDistractor1 = "";
      if (word.toneDistractor2 === undefined) word.toneDistractor2 = "";
      if (word.toneDistractor3 === undefined) word.toneDistractor3 = "";

      if (word.level === undefined) word.level = "";
      if (word.pack === undefined) word.pack = "";

      if (word.quizCorrectCount === undefined) word.quizCorrectCount = 0;
      if (word.quizWrongCount === undefined) word.quizWrongCount = 0;
      if (word.toneCorrectCount === undefined) word.toneCorrectCount = 0;
      if (word.toneWrongCount === undefined) word.toneWrongCount = 0;
    });
    saveState(state);
    return state;
  }

  ensureProductState(DEFAULT_STATE);
  saveState(DEFAULT_STATE);
  return DEFAULT_STATE;
}

// Save state
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

function getBuildingLevel(buildingId) {
  const state = getState();
  return state.village?.buildings?.[buildingId]?.level || 1;
}

function canUseTonePractice() {
  return getBuildingLevel("school") >= 2;
}

function calculatePopulationCap(state) {
  const basePopulationCap = 5;

  const housePopulationCap = (state.village.placedItems || [])
    .filter((item) => item.type === "house")
    .reduce((total, house) => {
      return total + (house.level || 1);
    }, 0);

  return basePopulationCap + housePopulationCap;
}

function getNextCitizenRequirement(currentPopulation) {
  if (currentPopulation === 0) return 25;
  if (currentPopulation === 1) return 50;
  return 100;
}

function addKnowledgeAndCitizenProgress(knowledgeAmount, citizenProgressAmount) {
  const state = getState();

  state.resources.knowledge =
    (state.resources.knowledge || 0) + knowledgeAmount;

  if (!state.village.population) {
    state.village.population = {
      current: 0,
      learnedWordsSinceLastCitizen: 0,
      nextCitizenRequirement: 25,
    };
  }

  const population = state.village.population;
  const populationCap = calculatePopulationCap(state);
  let citizensAdded = 0;

  if (population.current < populationCap) {
    population.learnedWordsSinceLastCitizen += citizenProgressAmount;

    while (
      population.current < populationCap &&
      population.learnedWordsSinceLastCitizen >= population.nextCitizenRequirement
    ) {
      population.learnedWordsSinceLastCitizen -= population.nextCitizenRequirement;
      population.current += 1;
      citizensAdded += 1;
      population.nextCitizenRequirement = getNextCitizenRequirement(
        population.current,
      );
    }
  }

  if (population.current >= populationCap) {
    population.learnedWordsSinceLastCitizen = 0;
  }

  saveState(state);

  return {
    citizensAdded,
    atPopulationCap: population.current >= populationCap,
  };
}

// Render state to page
function renderState() {
  renderPlayerName();
  const state = getState();

  const levelElement = document.getElementById("player-level");
  const xpCountElement = document.getElementById("xp-count");
  const xpFillElement = document.getElementById("xp-fill");

  const coinsElement = document.getElementById("coins");
  const knowledgeElement = document.getElementById("knowledge");
  const woodElement = document.getElementById("wood");
  const cultureElement = document.getElementById("culture");
  const riceElement = document.getElementById("rice");
  const wheatElement = document.getElementById("wheat");
  const soybeanElement = document.getElementById("soybean");
  const greenOnionElement = document.getElementById("greenOnion");
  const teaElement = document.getElementById("tea");

  const wordsLearnedElement = document.getElementById("words-learned");
  const studiedTodayElement = document.getElementById("studied-today");
  const reviewsElement = document.getElementById("reviews");
  const streakElement = document.getElementById("streak");

  if (levelElement) {
    levelElement.textContent = state.player.level;
  }

  if (xpCountElement) {
    const nextLevelRequirement = getNextLevelXPRequirement(state);

    xpCountElement.textContent = `${state.player.xp} / ${nextLevelRequirement} XP`;
  }

  if (xpFillElement) {
    const nextLevelRequirement = getNextLevelXPRequirement(state);
    const xpPercent = (state.player.xp / nextLevelRequirement) * 100;
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
  if (riceElement) riceElement.textContent = state.resources.rice || 0;
  if (wheatElement) wheatElement.textContent = state.resources.wheat || 0;
  if (soybeanElement) soybeanElement.textContent = state.resources.soybean || 0;
  if (greenOnionElement)
    greenOnionElement.textContent = state.resources.greenOnion || 0;
  if (teaElement) teaElement.textContent = state.resources.tea || 0;

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
function getNextLevelXPRequirement(state) {
  const levelRequirements = {
    2: 150,
    3: 300,
    4: 500,
    5: 750,
    6: 1000,
    7: 1500,
    8: 2000,
    9: 2500,
    10: 3000,
    11: 4000,
    12: 5000,
    13: 6500,
    14: 8000,
    15: 10000,
    16: 13000,
    17: 16000,
    18: 20000,
    19: 25000,
    20: 35000,
  };

  return (
    levelRequirements[state.player.level + 1] || state.player.xpToNextLevel
  );
}
// Reset game — useful during testing
function resetGame() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  location.reload();
}

// Run when page loads
document.addEventListener("DOMContentLoaded", () => {
  renderState();

  const editPlayerNameBtn = document.getElementById("edit-player-name-btn");
  const closePlayerNameModalBtn = document.getElementById(
    "close-player-name-modal",
  );
  const savePlayerNameBtn = document.getElementById("save-player-name-btn");

  if (editPlayerNameBtn) {
    editPlayerNameBtn.addEventListener("click", openPlayerNameModal);
  }

  if (closePlayerNameModalBtn) {
    closePlayerNameModalBtn.addEventListener("click", closePlayerNameModal);
  }

  if (savePlayerNameBtn) {
    savePlayerNameBtn.addEventListener("click", savePlayerName);
  }
});
