// ===============================
// LANGUAGE TOWN - GAME STATE
// ===============================

const STORAGE_KEY = "languageTownState";
const LEGACY_STORAGE_KEY = "languageVillageState";
let cachedState = null;

const DEFAULT_PRODUCTS = [
  { id: "rice", type: "crop", standardName: "Rice", luxuryName: "Chishang Rice", icon: "R", unlockLevel: 3, luxuryUnlockLevel: 6, standardPrice: 5, luxuryPrice: 15, luxuryCulture: 1, discoveryPack: "Rice Discovery Pack", dishes: "Braised pork rice, rice ball", luxuryUnlocked: false },
  { id: "wheat", type: "crop", standardName: "Wheat", luxuryName: "Taiwan Wheat", icon: "W", unlockLevel: 4, luxuryUnlockLevel: 7, standardPrice: 6, luxuryPrice: 18, luxuryCulture: 1, discoveryPack: "Wheat Discovery Pack", dishes: "Scallion pancake, noodles", luxuryUnlocked: false },
  { id: "soybean", type: "crop", standardName: "Soybean", luxuryName: "Tainan Soybean", icon: "S", unlockLevel: 5, luxuryUnlockLevel: 8, standardPrice: 7, luxuryPrice: 21, luxuryCulture: 1, discoveryPack: "Soybean Discovery Pack", dishes: "Soy milk, tofu pudding", luxuryUnlocked: false },
  { id: "greenOnion", type: "crop", standardName: "Green Onion", luxuryName: "Yilan Sanxing Scallion", icon: "G", unlockLevel: 6, luxuryUnlockLevel: 9, standardPrice: 8, luxuryPrice: 28, luxuryCulture: 2, discoveryPack: "Yilan Green Onion Discovery Pack", dishes: "Scallion pancake, green onion bun", luxuryUnlocked: false },
  { id: "tea", type: "crop", standardName: "Tea", luxuryName: "Alishan High Mountain Tea", icon: "T", unlockLevel: 10, luxuryUnlockLevel: 12, standardPrice: 12, luxuryPrice: 40, luxuryCulture: 3, discoveryPack: "Tea Discovery Pack", dishes: "Bubble tea, tea eggs", luxuryUnlocked: false },
];

const DEFAULT_RECIPES = [];

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

  recipes: DEFAULT_RECIPES,

  productUnlocks: {},

  recipeUnlocks: {},

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

function getPlacedItemProductSlots(item) {
  if (!item.productSlots) {
    item.productSlots = [];
    if (item.cropSlots) {
      item.productSlots = item.cropSlots.map((cropId) =>
        cropId
          ? {
              productKey: String(cropId).includes(":") ? cropId : `${cropId}:standard`,
              assignedAt: new Date().toISOString(),
              accumulatedDays: 0,
            }
          : null,
      );
    }
  }

  return item.productSlots;
}

function getPlacedItemProductKey(slot) {
  if (!slot) return "";
  if (typeof slot === "string") return slot.includes(":") ? slot : `${slot}:standard`;
  return slot.productKey || "";
}

function getProductionCapacity(state = getState()) {
  const capacity = {};
  const productionTypes = ["farm", "ranch", "fishingBoat"];

  (state.village?.placedItems || [])
    .filter((item) => productionTypes.includes(item.type))
    .forEach((item) => {
      if (!item.level) item.level = 1;
      const slots = getPlacedItemProductSlots(item);

      for (let i = 0; i < item.level; i++) {
        const productKey = getPlacedItemProductKey(slots[i]);
        if (!productKey) continue;

        const variant = getProductVariant(productKey, state);
        if (!variant) continue;

        if (!capacity[productKey]) {
          capacity[productKey] = {
            productKey,
            name: variant.name,
            price: variant.price,
            culture: variant.culture,
            available: 0,
            total: 0,
          };
        }

        capacity[productKey].available += 1;
        capacity[productKey].total += 1;
      }
    });

  return capacity;
}

function ensureProductState(state) {
  let changed = false;
  if (!Array.isArray(state.products)) {
    state.products = DEFAULT_PRODUCTS.map(normalizeProduct);
    changed = true;
  }
  const normalizedProducts = state.products.map(normalizeProduct);
  if (JSON.stringify(state.products) !== JSON.stringify(normalizedProducts)) changed = true;
  state.products = normalizedProducts;
  DEFAULT_PRODUCTS.forEach((defaultProduct) => {
    if (!state.products.some((product) => product.id === defaultProduct.id)) {
      state.products.push(normalizeProduct(defaultProduct));
      changed = true;
    }
  });
  if (!state.productUnlocks) {
    state.productUnlocks = {};
    changed = true;
  }
  return changed;
}

function createRecipeId(name) {
  return String(name || "recipe").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "recipe";
}

function normalizeRecipeIngredient(ingredient) {
  return {
    productId: ingredient.productId || "",
    variant: ingredient.variant || "standard",
    quantity: Number(ingredient.quantity || 1),
  };
}

function normalizeRecipe(recipe) {
  return {
    id: recipe.id || createRecipeId(recipe.name || "recipe"),
    name: recipe.name || "Recipe",
    icon: recipe.icon || "N",
    coins: Number(recipe.coins || 0),
    culture: Number(recipe.culture || 0),
    discoveryPack: recipe.discoveryPack || "",
    ingredients: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map(normalizeRecipeIngredient)
      : [],
    questStarted: Boolean(recipe.questStarted),
    researchComplete: Boolean(recipe.researchComplete),
  };
}

function ensureRecipeState(state) {
  let changed = false;
  if (!Array.isArray(state.recipes)) {
    state.recipes = DEFAULT_RECIPES.map(normalizeRecipe);
    changed = true;
  }
  const normalizedRecipes = state.recipes.map(normalizeRecipe);
  if (JSON.stringify(state.recipes) !== JSON.stringify(normalizedRecipes)) changed = true;
  state.recipes = normalizedRecipes;
  if (!state.recipeUnlocks) {
    state.recipeUnlocks = {};
    changed = true;
  }
  return changed;
}

function getRecipes(state = getState()) {
  ensureRecipeState(state);
  return state.recipes;
}

function saveRecipes(recipes) {
  const state = getState();
  state.recipes = recipes.map(normalizeRecipe);
  saveState(state);
}

function findRecipe(recipeId, state = getState()) {
  return getRecipes(state).find((recipe) => recipe.id === recipeId);
}

function getMayor(state = getState()) {
  return (state.villagers || []).find((villager) => villager.id === "mayor_elian");
}

function isPackMastered(state, packName) {
  if (!packName) return false;
  const packWords = (state.vocab || []).filter((word) => word.pack === packName);
  return packWords.length > 0 && packWords.every((word) => (word.quizCorrectCount || 0) >= 5);
}

function getNightMarketPlacedItem(state = getState()) {
  return (state.village?.placedItems || []).find((item) => item.type === "nightMarket");
}

function canUseNightMarket(state = getState()) {
  return state.player.level >= 10 && Boolean(getNightMarketPlacedItem(state));
}

function getNightMarketDisplayName(item, state = getState()) {
  return item?.customName || `${state.townName || "Language Town"} Night Market`;
}

function getRecipeIngredientStatus(recipe, state = getState()) {
  const capacity = typeof getProductionCapacity === "function" ? getProductionCapacity(state) : {};
  return recipe.ingredients.map((ingredient) => {
    const product = findProduct(ingredient.productId, state);
    const key = `${ingredient.productId}:${ingredient.variant || "standard"}`;
    const available = capacity[key]?.available || 0;
    const unlocked =
      product &&
      state.player.level >= product.unlockLevel &&
      (ingredient.variant !== "luxury" || product.luxuryUnlocked);

    return {
      ...ingredient,
      key,
      product,
      available,
      unlocked,
      ready: Boolean(unlocked && available >= ingredient.quantity),
    };
  });
}

function areRecipeIngredientsReady(recipe, state = getState()) {
  return getRecipeIngredientStatus(recipe, state).every((ingredient) => ingredient.ready);
}

function canResearchRecipe(recipe, state = getState()) {
  const mayor = getMayor(state);
  return (
    canUseNightMarket(state) &&
    (mayor?.relationshipLevel || 1) >= 3 &&
    recipe.questStarted &&
    areRecipeIngredientsReady(recipe, state) &&
    isPackMastered(state, recipe.discoveryPack)
  );
}

function getResearchedRecipes(state = getState()) {
  return getRecipes(state).filter((recipe) => recipe.researchComplete);
}
// Load saved state or create new state
function loadState() {
  if (cachedState) return cachedState;

  const savedState =
    localStorage.getItem(STORAGE_KEY) ||
    localStorage.getItem(LEGACY_STORAGE_KEY);

  if (savedState) {
    const state = JSON.parse(savedState);
    let migrated = false;

    if (!state.townName) {
      state.townName = "Language Town";
      migrated = true;
    }

    if (!state.villagers || state.villagers.length === 0) {
      state.villagers = DEFAULT_STATE.villagers;
      migrated = true;
    }
    state.villagers.forEach((villager) => {
      if (villager.relationshipXP === undefined) {
        villager.relationshipXP = villager.relationshipPoints || 0;
        migrated = true;
      }

      if (villager.lastInteractionDate === undefined) {
        villager.lastInteractionDate = null;
        migrated = true;
      }

      if (villager.dailyTaskCompleted === undefined) {
        villager.dailyTaskCompleted = false;
        migrated = true;
      }

      if (villager.streak === undefined) {
        villager.streak = 0;
        migrated = true;
      }
    });
    if (!state.village) {
      state.village = DEFAULT_STATE.village;
      migrated = true;
    }

    if (!state.village.placedItems) {
      state.village.placedItems = [];
      migrated = true;
    }

    if (!state.village.population) {
      state.village.population = {
        current: 0,
        learnedWordsSinceLastCitizen: 0,
        nextCitizenRequirement: 25,
      };
      migrated = true;
    }
    if (!state.player.name) {
      state.player.name = "Player";
      migrated = true;
    }
    if (!state.village.buildings) {
      state.village.buildings = DEFAULT_STATE.village.buildings;
      migrated = true;
    }

    if (!state.village.buildings.lumberMill) {
      state.village.buildings.lumberMill = {
        name: "Lumber Mill",
        level: 1,
      };
      migrated = true;
    }
    Object.keys(DEFAULT_STATE.village.buildings).forEach((buildingId) => {
      if (!state.village.buildings[buildingId]) {
        state.village.buildings[buildingId] =
          DEFAULT_STATE.village.buildings[buildingId];
        migrated = true;
      }

      const defaultBuilding = DEFAULT_STATE.village.buildings[buildingId];
      const savedBuilding = state.village.buildings[buildingId];

      if (!savedBuilding.x) {
        savedBuilding.x = defaultBuilding.x;
        migrated = true;
      }
      if (!savedBuilding.y) {
        savedBuilding.y = defaultBuilding.y;
        migrated = true;
      }
      if (!savedBuilding.width) {
        savedBuilding.width = defaultBuilding.width;
        migrated = true;
      }
      if (!savedBuilding.height) {
        savedBuilding.height = defaultBuilding.height;
        migrated = true;
      }
    });
    if (ensureProductState(state)) migrated = true;
    if (ensureRecipeState(state)) migrated = true;
    if (!Array.isArray(state.vocab)) {
      state.vocab = [];
      migrated = true;
    }
    state.vocab.forEach((word) => {
      if (word.language === undefined) {
        word.language = "";
        migrated = true;
      }
      if (word.tonePractice === undefined) {
        word.tonePractice = "";
        migrated = true;
      }
      if (word.toneDistractor1 === undefined) {
        word.toneDistractor1 = "";
        migrated = true;
      }
      if (word.toneDistractor2 === undefined) {
        word.toneDistractor2 = "";
        migrated = true;
      }
      if (word.toneDistractor3 === undefined) {
        word.toneDistractor3 = "";
        migrated = true;
      }

      if (word.level === undefined) {
        word.level = "";
        migrated = true;
      }
      if (word.pack === undefined) {
        word.pack = "";
        migrated = true;
      }

      if (word.quizCorrectCount === undefined) {
        word.quizCorrectCount = 0;
        migrated = true;
      }
      if (word.quizWrongCount === undefined) {
        word.quizWrongCount = 0;
        migrated = true;
      }
      if (word.toneCorrectCount === undefined) {
        word.toneCorrectCount = 0;
        migrated = true;
      }
      if (word.toneWrongCount === undefined) {
        word.toneWrongCount = 0;
        migrated = true;
      }
    });
    cachedState = state;
    if (migrated) {
      saveState(state);
    }
    return state;
  }

  cachedState = typeof structuredClone === "function"
    ? structuredClone(DEFAULT_STATE)
    : JSON.parse(JSON.stringify(DEFAULT_STATE));
  ensureProductState(cachedState);
  ensureRecipeState(cachedState);
  saveState(cachedState);
  return cachedState;
}

// Save state
function saveState(state) {
  cachedState = state;
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
