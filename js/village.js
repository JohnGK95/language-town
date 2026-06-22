const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;
const TOTAL_TILES = MAP_WIDTH * MAP_HEIGHT;

let selectedBuildingId = null;
let buildMode = false;
let selectedTile = null;
let movingBuildingId = null;
let movingPlacedItem = null;
let selectedHouse = null;
let builderAction = null;
let selectedBuildItem = null;
const MAP_UNLOCKS = {
  start: {
    name: "Starting Area",
    minX: 1,
    maxX: MAP_WIDTH / 2,
    minY: 1,
    maxY: MAP_HEIGHT / 2,
    requiredLevel: 1,
  },
  northeast: {
    name: "East Expansion",
    minX: MAP_WIDTH / 2 + 1,
    maxX: MAP_WIDTH,
    minY: 1,
    maxY: MAP_HEIGHT / 2,
    requiredLevel: 8,
  },
  southwest: {
    name: "South Expansion",
    minX: 1,
    maxX: MAP_WIDTH / 2,
    minY: MAP_HEIGHT / 2 + 1,
    maxY: MAP_HEIGHT,
    requiredLevel: 12,
  },
  southeast: {
    name: "Grand Expansion",
    minX: MAP_WIDTH / 2 + 1,
    maxX: MAP_WIDTH,
    minY: MAP_HEIGHT / 2 + 1,
    maxY: MAP_HEIGHT,
    requiredLevel: 18,
  },
};
const BUILDING_DATA = {
  townHall: {
    id: "townHall",
    name: "Town Hall",
    owner: "Mayor Elian",
    dialogue:
      "Welcome back, founder. Every strong village begins with steady learning.",
    x: 7,
    y: 2,
    width: 3,
    height: 2,
    upgradeCost: {
      coins: 100,
      knowledge: 25,
    },
  },

  library: {
    id: "library",
    name: "Library",
    owner: "Archivist Mina",
    dialogue: "Every word you learn adds another book to our shelves.",
    x: 3,
    y: 3,
    width: 2,
    height: 2,
    upgradeCost: {
      knowledge: 50,
    },
  },

  market: {
    id: "market",
    name: "Market",
    owner: "Merchant Ren",
    dialogue: "Bring me coins, and I can help gather supplies for the village.",
    x: 12,
    y: 4,
    width: 2,
    height: 2,
    upgradeCost: {
      coins: 75,
    },
  },
  lumberMill: {
    id: "lumberMill",
    name: "Lumber Mill",
    owner: "Foreman Rowan",
    dialogue: "Every bit of practice helps us gather stronger timber.",
    x: 13,
    y: 8,
    width: 2,
    height: 2,
    upgradeCost: {
      coins: 100,
      knowledge: 50,
    },
  },
  school: {
    id: "school",
    name: "School",
    owner: "Teacher Lian",
    dialogue: "Practice turns knowledge into skill.",
    x: 6,
    y: 7,
    width: 3,
    height: 2,
    upgradeCost: {
      coins: 50,
      knowledge: 50,
    },
  },
};

const PLACEABLE_ITEMS = {
  tree: {
    name: "Tree",
    icon: "🌳",
    className: "placed-tree",
    buildCost: {},
  },
  house: {
    name: "House",
    icon: "🏠",
    className: "placed-house",
    buildCost: {
      coins: 50,
      wood: 20,
    },
  },
  garden: {
    name: "Garden",
    icon: "🌷",
    className: "placed-garden",
    buildCost: {},
  },
  path: {
    name: "Path",
    icon: "🟫",
    className: "placed-path",
    buildCost: {},
  },
  well: {
    name: "Well",
    icon: "🪣",
    className: "placed-well",
    buildCost: {
      coins: 40,
      wood: 10,
    },
  },

  farm: {
    name: "Farm",
    icon: "🌾",
    className: "placed-farm",
    buildCost: {
      coins: 75,
      wood: 25,
    },
  },

  shrine: {
    name: "Shrine",
    icon: "⛩️",
    className: "placed-shrine",
    buildCost: {
      coins: 100,
      knowledge: 50,
    },
  },

  bench: {
    name: "Bench",
    icon: "🪑",
    className: "placed-bench",
    buildCost: {
      wood: 5,
    },
  },
};

function renderVillage() {
  const map = document.getElementById("village-map");
  const state = getState();

  if (!map) return;

  map.innerHTML = "";

  for (let i = 0; i < TOTAL_TILES; i++) {
    const tile = document.createElement("button");

    const x = (i % MAP_WIDTH) + 1;
    const y = Math.floor(i / MAP_WIDTH) + 1;

    tile.classList.add("map-tile");

    if (!isTileUnlocked(x, y)) {
      tile.classList.add("locked-map-tile");
      tile.title = "This area is locked.";
    }

    if (buildMode) {
      tile.classList.add("build-mode-active");
    }

    tile.style.gridColumn = `${x} / span 1`;
    tile.style.gridRow = `${y} / span 1`;

    tile.addEventListener("click", () => {
      if (!isTileUnlocked(x, y)) {
        const section = getMapSectionForTile(x, y);

        document.getElementById("build-mode-message").textContent =
          `${section.name} unlocks at Level ${section.requiredLevel}.`;

        return;
      }

      handleTileClick(x, y);
    });

    map.appendChild(tile);
  }

  renderPlacedItems(state);
  renderBuildings();
  renderPopulation();
}
function getMapSectionForTile(x, y) {
  return Object.values(MAP_UNLOCKS).find((section) => {
    return (
      x >= section.minX &&
      x <= section.maxX &&
      y >= section.minY &&
      y <= section.maxY
    );
  });
}

function isTileUnlocked(x, y) {
  const state = getState();
  const section = getMapSectionForTile(x, y);

  if (!section) return false;

  return state.player.level >= section.requiredLevel;
}
function renderBuildings() {
  const map = document.getElementById("village-map");
  const state = getState();

  Object.values(BUILDING_DATA).forEach((building) => {
    const savedBuilding = state.village.buildings[building.id];

    const buildingElement = document.createElement("button");

    buildingElement.classList.add("building");
    buildingElement.textContent = building.name;

    if (movingBuildingId === building.id) {
      buildingElement.classList.add("moving-building");
    }

    buildingElement.style.gridColumn = `${savedBuilding.x} / span ${savedBuilding.width}`;

    buildingElement.style.gridRow = `${savedBuilding.y} / span ${savedBuilding.height}`;

    buildingElement.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!buildMode) {
        openBuildingModal(building.id);
        return;
      }

      if (builderAction === "move") {
        movingBuildingId = building.id;
        movingPlacedItem = null;

        document.getElementById("builder-menu-message").textContent =
          `Moving ${building.name}. Click an empty area to place it.`;

        renderVillage();
        return;
      }

      if (builderAction === "bulldoze") {
        document.getElementById("builder-menu-message").textContent =
          "Main buildings cannot be bulldozed.";
      }
    });

    map.appendChild(buildingElement);
  });
}

function renderPlacedItems(state) {
  const map = document.getElementById("village-map");

  state.village.placedItems.forEach((item) => {
    const itemData = PLACEABLE_ITEMS[item.type];

    if (!itemData) return;

    const itemElement = document.createElement("button");

    itemElement.classList.add("placed-item", itemData.className);
    if (item.type === "house") {
      itemElement.textContent = `${itemData.icon} ${item.level || 1}`;
    } else {
      itemElement.textContent = itemData.icon;
    }

    itemElement.title = itemData.name;

    itemElement.style.gridColumn = `${item.x} / span 1`;
    itemElement.style.gridRow = `${item.y} / span 1`;

    itemElement.addEventListener("click", (event) => {
      event.stopPropagation();

      if (!buildMode) {
        if (item.type === "house") {
          openHouseModal(item.x, item.y);
        }
        return;
      }

      if (builderAction === "bulldoze") {
        removePlacedItem(item.x, item.y);
        document.getElementById("builder-menu-message").textContent =
          "Item removed.";
        return;
      }

      if (builderAction === "move") {
        movingBuildingId = null;
        selectedTile = { x: item.x, y: item.y };
        movePlacedItemStart(item.x, item.y);
      }
    });

    map.appendChild(itemElement);
  });
}
function movePlacedItemStart(x, y) {
  const state = getState();

  const item = state.village.placedItems.find((placedItem) => {
    return placedItem.x === x && placedItem.y === y;
  });

  if (!item) return;

  movingPlacedItem = {
    originalX: item.x,
    originalY: item.y,
  };

  document.getElementById("builder-menu-message").textContent =
    `Moving ${PLACEABLE_ITEMS[item.type].name}. Click an empty tile.`;
}

function movePlacedItemToTile(x, y) {
  if (!movingPlacedItem) return;

  const state = getState();

  const item = state.village.placedItems.find((placedItem) => {
    return (
      placedItem.x === movingPlacedItem.originalX &&
      placedItem.y === movingPlacedItem.originalY
    );
  });

  if (!item) return;

  if (isTileOccupiedForPlacedItemMove(x, y, item)) {
    document.getElementById("builder-menu-message").textContent =
      "That tile is occupied.";
    return;
  }

  item.x = x;
  item.y = y;

  saveState(state);

  movingPlacedItem = null;

  renderVillage();

  document.getElementById("builder-menu-message").textContent = "Item moved.";
}

function isTileOccupiedForPlacedItemMove(x, y, movingItem) {
  const state = getState();

  const hasPlacedItem = state.village.placedItems.some((item) => {
    const isSameItem =
      item.x === movingItem.x &&
      item.y === movingItem.y &&
      item.type === movingItem.type;

    if (isSameItem) return false;

    return item.x === x && item.y === y;
  });

  if (hasPlacedItem) return true;

  const hasBuilding = Object.keys(state.village.buildings).some((id) => {
    const building = state.village.buildings[id];

    const withinX = x >= building.x && x < building.x + building.width;
    const withinY = y >= building.y && y < building.y + building.height;

    return withinX && withinY;
  });

  return hasBuilding;
}
function handleTileClick(x, y) {
  if (!buildMode) return;

  if (builderAction === "move" && movingBuildingId) {
    moveBuildingToTile(movingBuildingId, x, y);
    return;
  }

  if (builderAction === "move" && movingPlacedItem) {
    movePlacedItemToTile(x, y);
    return;
  }

  if (builderAction === "build" && selectedBuildItem) {
    placeItemAtTile(selectedBuildItem, x, y);
    return;
  }
}
function placeItemAtTile(type, x, y) {
  if (!isTileUnlocked(x, y)) {
    document.getElementById("builder-menu-message").textContent =
      "This area is still locked.";
    return;
  }
  const state = getState();
  const itemData = PLACEABLE_ITEMS[type];

  if (!itemData) return;

  if (isTileOccupied(x, y)) {
    document.getElementById("builder-menu-message").textContent =
      "That tile is already occupied.";
    return;
  }

  const cost = itemData.buildCost || {};

  if (!canAffordUpgrade(state, cost)) {
    document.getElementById("builder-menu-message").textContent =
      `Not enough resources. Need ${formatCost(cost)}.`;
    return;
  }

  payUpgradeCost(state, cost);

  state.village.placedItems.push({
    type,
    x,
    y,
    level: type === "house" ? 1 : null,
    placedAt: new Date().toISOString(),
  });

  saveState(state);
  renderState();
  renderVillage();

  document.getElementById("builder-menu-message").textContent =
    `${itemData.name} placed.`;
}
function moveBuildingToTile(buildingId, x, y) {
  const state = getState();
  const building = state.village.buildings[buildingId];

  if (!building) return;

  if (!canPlaceBuilding(buildingId, x, y)) {
    document.getElementById("build-mode-message").textContent =
      "That building cannot be placed there.";

    return;
  }

  building.x = x;
  building.y = y;

  saveState(state);

  movingBuildingId = null;

  document.getElementById("build-mode-message").textContent = "Building moved.";

  renderVillage();
}

function canPlaceBuilding(buildingId, x, y) {
  for (let tileY = y; tileY < y + building.height; tileY++) {
    for (let tileX = x; tileX < x + building.width; tileX++) {
      if (!isTileUnlocked(tileX, tileY)) {
        return false;
      }
    }
  }
  const state = getState();
  const building = state.village.buildings[buildingId];

  const width = building.width;
  const height = building.height;

  if (x + width - 1 > MAP_WIDTH || y + height - 1 > MAP_HEIGHT) {
    return false;
  }

  for (let tileY = y; tileY < y + height; tileY++) {
    for (let tileX = x; tileX < x + width; tileX++) {
      if (isTileOccupiedForMove(tileX, tileY, buildingId)) {
        return false;
      }
    }
  }

  return true;
}

function isTileOccupiedForMove(x, y, movingId) {
  const state = getState();

  const hasPlacedItem = state.village.placedItems.some((item) => {
    return item.x === x && item.y === y;
  });

  if (hasPlacedItem) return true;

  const hasOtherBuilding = Object.keys(state.village.buildings).some((id) => {
    if (id === movingId) return false;

    const building = state.village.buildings[id];

    const withinX = x >= building.x && x < building.x + building.width;
    const withinY = y >= building.y && y < building.y + building.height;

    return withinX && withinY;
  });

  return hasOtherBuilding;
}
function isTileOccupied(x, y) {
  const state = getState();

  const hasPlacedItem = state.village.placedItems.some((item) => {
    return item.x === x && item.y === y;
  });

  if (hasPlacedItem) return true;

  const hasBuilding = Object.keys(state.village.buildings).some((id) => {
    const building = state.village.buildings[id];

    const withinX = x >= building.x && x < building.x + building.width;
    const withinY = y >= building.y && y < building.y + building.height;

    return withinX && withinY;
  });

  return hasBuilding;
}

function placeItem(type) {
  if (!selectedTile) return;

  const state = getState();

  const itemData = PLACEABLE_ITEMS[type];

  if (!itemData) return;

  if (isTileOccupied(selectedTile.x, selectedTile.y)) {
    document.getElementById("build-modal-message").textContent =
      "That tile is already occupied.";

    return;
  }

  const cost = itemData.buildCost || {};

  if (!canAffordUpgrade(state, cost)) {
    document.getElementById("build-modal-message").textContent =
      `Not enough resources. Need ${formatCost(cost)}.`;

    return;
  }

  payUpgradeCost(state, cost);

  state.village.placedItems.push({
    type,
    x: selectedTile.x,
    y: selectedTile.y,
    level: type === "house" ? 1 : null,
    placedAt: new Date().toISOString(),
  });

  saveState(state);

  selectedTile = null;

  document.getElementById("build-modal").classList.add("hidden");

  renderState();
  renderVillage();
}
function calculatePopulationCap(state) {
  const basePopulationCap = 5;

  const housePopulationCap = state.village.placedItems
    .filter((item) => item.type === "house")
    .reduce((total, house) => {
      return total + (house.level || 1);
    }, 0);

  return basePopulationCap + housePopulationCap;
}

function renderPopulationCap() {
  const state = getState();
  const populationCapElement = document.getElementById("population-cap");

  if (!populationCapElement) return;

  populationCapElement.textContent = calculatePopulationCap(state);
}
function removePlacedItem(x, y) {
  const state = getState();

  state.village.placedItems = state.village.placedItems.filter((item) => {
    return !(item.x === x && item.y === y);
  });

  saveState(state);
  renderVillage();
}

function toggleBuildMode() {
  buildMode = !buildMode;

  const button = document.getElementById("toggle-build-mode-btn");
  const message = document.getElementById("build-mode-message");
  const builderMenu = document.getElementById("builder-menu");

  if (buildMode) {
    button.classList.add("active");
    builderMenu.classList.remove("hidden");
    message.textContent = "Build mode is on.";
  } else {
    button.classList.remove("active");
    builderMenu.classList.add("hidden");
    message.textContent = "Build mode is off.";

    builderAction = null;
    selectedBuildItem = null;
    movingBuildingId = null;

    document.getElementById("build-options").classList.add("hidden");
  }

  renderVillage();
}
function setBuilderAction(action) {
  builderAction = action;
  selectedBuildItem = null;
  movingBuildingId = null;
  movingPlacedItem = null;

  document.getElementById("build-options").classList.add("hidden");

  if (action === "build") {
    document.getElementById("build-options").classList.remove("hidden");
    document.getElementById("builder-menu-message").textContent =
      "Choose something to build.";
  }

  if (action === "move") {
    document.getElementById("builder-menu-message").textContent =
      "Click an item or building to move it.";
  }

  if (action === "bulldoze") {
    document.getElementById("builder-menu-message").textContent =
      "Click a placed item to remove it.";
  }
}

function selectBuildItem(type) {
  selectedBuildItem = type;

  document.getElementById("builder-menu-message").textContent =
    `Selected: ${PLACEABLE_ITEMS[type].name}. Click an empty tile.`;
}
function clearPlacedItems() {
  const state = getState();

  state.village.placedItems = [];

  saveState(state);
  renderVillage();
  renderTownName();
}
function renderTownName() {
  const state = getState();

  const townNameDisplay = document.getElementById("town-name-display");
  const townNameInput = document.getElementById("town-name-input");

  if (townNameDisplay) {
    townNameDisplay.textContent = state.townName || "Language Town";
  }

  if (townNameInput) {
    townNameInput.value = state.townName || "Language Town";
  }
}

function saveTownName() {
  const state = getState();

  const input = document.getElementById("town-name-input");

  const newName = input.value.trim();

  if (!newName) return;

  state.townName = newName;

  saveState(state);

  renderTownName();

  document.getElementById("town-name-modal").classList.add("hidden");
}
function openTownNameModal() {
  const state = getState();

  document.getElementById("town-name-input").value =
    state.townName || "Language Town";

  document.getElementById("town-name-modal").classList.remove("hidden");
}

function closeTownNameModal() {
  document.getElementById("town-name-modal").classList.add("hidden");
}
function openBuildingModal(buildingId) {
  const state = getState();
  const building = BUILDING_DATA[buildingId];

  selectedBuildingId = buildingId;

  if (!state.village.buildings[buildingId]) {
    state.village.buildings[buildingId] = {
      name: building.name,
      level: 1,
    };

    saveState(state);
  }

  const savedBuilding = state.village.buildings[buildingId];

  document.getElementById("modal-building-name").textContent = building.name;
  document.getElementById("modal-owner").textContent =
    `Manager: ${building.owner}`;
  document.getElementById("modal-dialogue").textContent = building.dialogue;
  document.getElementById("modal-building-level").textContent =
    savedBuilding.level;

  document.getElementById("modal-upgrade-cost").textContent =
    `Upgrade Cost: ${formatCost(building.upgradeCost)}`;

  document.getElementById("modal-message").textContent = "";

  document.getElementById("building-modal").classList.remove("hidden");
  const marketActions = document.getElementById("market-actions");

  if (marketActions) {
    if (buildingId === "market") {
      marketActions.classList.remove("hidden");
    } else {
      marketActions.classList.add("hidden");
    }
  }
}

function closeBuildingModal() {
  document.getElementById("building-modal").classList.add("hidden");
}

function closeBuildModal() {
  selectedTile = null;
  document.getElementById("build-modal").classList.add("hidden");
}

function formatCost(cost) {
  return Object.entries(cost)
    .map(([resource, amount]) => `${amount} ${resource}`)
    .join(", ");
}

function canAffordUpgrade(state, cost) {
  return Object.entries(cost).every(([resource, amount]) => {
    return state.resources[resource] >= amount;
  });
}

function payUpgradeCost(state, cost) {
  Object.entries(cost).forEach(([resource, amount]) => {
    state.resources[resource] -= amount;
  });
}

function upgradeSelectedBuilding() {
  if (!selectedBuildingId) return;

  const state = getState();
  const building = BUILDING_DATA[selectedBuildingId];
  const savedBuilding = state.village.buildings[selectedBuildingId];

  const modalMessage = document.getElementById("modal-message");

  if (!canAffordUpgrade(state, building.upgradeCost)) {
    modalMessage.textContent = "Not enough resources yet.";
    return;
  }

  payUpgradeCost(state, building.upgradeCost);

  savedBuilding.level += 1;

  saveState(state);
  renderState();

  openBuildingModal(selectedBuildingId);

  document.getElementById("modal-message").textContent =
    `${building.name} upgraded to Level ${savedBuilding.level}!`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderVillage();
  document
    .getElementById("builder-build-btn")
    .addEventListener("click", () => setBuilderAction("build"));

  document
    .getElementById("builder-move-btn")
    .addEventListener("click", () => setBuilderAction("move"));

  document
    .getElementById("builder-bulldoze-btn")
    .addEventListener("click", () => setBuilderAction("bulldoze"));
  document
    .getElementById("close-modal")
    .addEventListener("click", closeBuildingModal);
  document
    .getElementById("close-build-modal")
    .addEventListener("click", closeBuildModal);
  document
    .getElementById("buy-wood-btn")
    .addEventListener("click", buyWoodFromMarket);
  document
    .getElementById("upgrade-building-btn")
    .addEventListener("click", upgradeSelectedBuilding);

  document
    .getElementById("toggle-build-mode-btn")
    .addEventListener("click", toggleBuildMode);

  document
    .getElementById("close-house-modal")
    .addEventListener("click", closeHouseModal);

  document
    .getElementById("upgrade-house-btn")
    .addEventListener("click", upgradeHouse);
  document
    .getElementById("edit-town-name-btn")
    .addEventListener("click", openTownNameModal);

  document
    .getElementById("close-town-name-modal")
    .addEventListener("click", closeTownNameModal);

  document
    .getElementById("save-town-name-btn")
    .addEventListener("click", saveTownName);
});
function openHouseModal(x, y) {
  const state = getState();

  const house = state.village.placedItems.find((item) => {
    return item.type === "house" && item.x === x && item.y === y;
  });

  if (!house) return;

  if (!house.level) {
    house.level = 1;
  }

  selectedHouse = {
    x,
    y,
  };

  document.getElementById("house-level").textContent = house.level;

  document.getElementById("house-population").textContent = house.level;

  const cost = getHouseUpgradeCost(house.level);

  if (cost) {
    document.getElementById("house-upgrade-cost").textContent =
      `Upgrade Cost: ${formatCost(cost)}`;

    document.getElementById("upgrade-house-btn").style.display = "block";
  } else {
    document.getElementById("house-upgrade-cost").textContent =
      "Maximum level reached";

    document.getElementById("upgrade-house-btn").style.display = "none";
  }

  document.getElementById("house-message").textContent = "";

  document.getElementById("house-modal").classList.remove("hidden");
}

function closeHouseModal() {
  selectedHouse = null;

  document.getElementById("house-modal").classList.add("hidden");
}
function upgradeHouse() {
  if (!selectedHouse) return;

  const state = getState();

  const house = state.village.placedItems.find((item) => {
    return (
      item.type === "house" &&
      item.x === selectedHouse.x &&
      item.y === selectedHouse.y
    );
  });

  if (!house) return;

  if (!house.level) {
    house.level = 1;
  }

  const upgradeCost = getHouseUpgradeCost(house.level);

  if (!upgradeCost) return;

  if (!canAffordUpgrade(state, upgradeCost)) {
    document.getElementById("house-message").textContent =
      `Not enough resources. Need ${formatCost(upgradeCost)}.`;

    return;
  }

  payUpgradeCost(state, upgradeCost);

  house.level += 1;

  saveState(state);

  renderState();
  renderVillage();

  openHouseModal(house.x, house.y);
}
function getHouseUpgradeCost(houseLevel) {
  if (houseLevel === 1) {
    return { coins: 25, wood: 5 };
  }

  if (houseLevel === 2) {
    return { coins: 50, wood: 10 };
  }

  return null;
}
function getNextCitizenRequirement(currentPopulation) {
  if (currentPopulation === 0) return 25;
  if (currentPopulation === 1) return 50;
  return 100;
}

function renderPopulation() {
  const state = getState();

  const currentPopulationElement =
    document.getElementById("current-population");
  const populationCapElement = document.getElementById("population-cap");
  const nextCitizenProgressElement = document.getElementById(
    "next-citizen-progress",
  );

  const populationCap = calculatePopulationCap(state);
  const population = state.village.population;

  if (currentPopulationElement) {
    currentPopulationElement.textContent = population.current;
  }

  if (populationCapElement) {
    populationCapElement.textContent = populationCap;
  }

  if (nextCitizenProgressElement) {
    nextCitizenProgressElement.textContent = `${population.learnedWordsSinceLastCitizen} / ${population.nextCitizenRequirement}`;
  }
}
function buyWoodFromMarket() {
  const state = getState();

  const cost = {
    coins: 25,
  };

  if (!canAffordUpgrade(state, cost)) {
    document.getElementById("modal-message").textContent = "Not enough coins.";
    return;
  }

  payUpgradeCost(state, cost);

  state.resources.wood += 10;

  saveState(state);
  renderState();

  document.getElementById("modal-message").textContent =
    "Bought 10 wood for 25 coins.";
}
