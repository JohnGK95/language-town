const MAP_WIDTH = 16;
const MAP_HEIGHT = 12;
const TOTAL_TILES = MAP_WIDTH * MAP_HEIGHT;

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
};

let selectedBuildingId = null;
let buildMode = false;
let selectedTile = null;
let selectedHouse = null;

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

    if (buildMode) {
      tile.classList.add("build-mode-active");
    }

    tile.style.gridColumn = `${x} / span 1`;
    tile.style.gridRow = `${y} / span 1`;

    tile.addEventListener("click", () => {
      handleTileClick(x, y);
    });

    map.appendChild(tile);
  }

  renderPlacedItems(state);
  renderBuildings();
  renderPopulation();
}

function renderBuildings() {
  const map = document.getElementById("village-map");

  Object.values(BUILDING_DATA).forEach((building) => {
    const buildingElement = document.createElement("button");

    buildingElement.classList.add("building");
    buildingElement.textContent = building.name;

    buildingElement.style.gridColumn = `${building.x} / span ${building.width}`;
    buildingElement.style.gridRow = `${building.y} / span ${building.height}`;

    buildingElement.addEventListener("click", () => {
      openBuildingModal(building.id);
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

      if (buildMode) {
        removePlacedItem(item.x, item.y);
        return;
      }

      if (item.type === "house") {
        openHouseModal(item.x, item.y);
      }
    });

    map.appendChild(itemElement);
  });
}

function handleTileClick(x, y) {
  if (!buildMode) return;

  if (isTileOccupied(x, y)) {
    return;
  }

  selectedTile = { x, y };

  document.getElementById("build-modal-message").textContent = "";
  document.getElementById("build-modal").classList.remove("hidden");
}

function isTileOccupied(x, y) {
  const state = getState();

  const hasPlacedItem = state.village.placedItems.some((item) => {
    return item.x === x && item.y === y;
  });

  if (hasPlacedItem) return true;

  const hasBuilding = Object.values(BUILDING_DATA).some((building) => {
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
  return state.village.placedItems
    .filter((item) => item.type === "house")
    .reduce((total, house) => {
      return total + (house.level || 1);
    }, 0);
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

  if (buildMode) {
    button.textContent = "Exit Build Mode";
    message.textContent =
      "Build mode is on. Click an empty tile to place something. Click a placed item to remove it.";
  } else {
    button.textContent = "Enter Build Mode";
    message.textContent = "Build mode is off.";
  }

  renderVillage();
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
  const townNameInput = document.getElementById("town-name-input");

  const newName = townNameInput.value.trim();

  if (!newName) return;

  state.townName = newName;

  saveState(state);
  renderTownName();
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
    .getElementById("clear-placements-btn")
    .addEventListener("click", clearPlacedItems);
  document
    .getElementById("close-house-modal")
    .addEventListener("click", closeHouseModal);

  document
    .getElementById("upgrade-house-btn")
    .addEventListener("click", upgradeHouse);
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
