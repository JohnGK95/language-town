const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;
const TOTAL_TILES = MAP_WIDTH * MAP_HEIGHT;

let selectedBuildingId = null;
let buildMode = false;
let selectedTile = null;
let movingBuildingId = null;
let movingPlacedItem = null;
let selectedHouse = null;
let selectedFarm = null;
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

const CROP_DATA = {
  rice: {
    name: "Rice",
    icon: "🍚",
    unlockLevel: 3,
  },
  wheat: {
    name: "Wheat",
    icon: "🌾",
    unlockLevel: 4,
  },
  soybean: {
    name: "Soybean",
    icon: "🫘",
    unlockLevel: 5,
  },
  greenOnion: {
    name: "Yilan Green Onion",
    icon: "🧅",
    unlockLevel: 6,
  },
  tea: {
    name: "Tea",
    icon: "🍵",
    unlockLevel: 10,
  },
};

/* ---------------------------------------
   General DOM helpers
--------------------------------------- */

function setText(id, text) {
  const element = document.getElementById(id);
  if (element) element.textContent = text;
}

function showElement(id) {
  const element = document.getElementById(id);
  if (element) element.classList.remove("hidden");
}

function hideElement(id) {
  const element = document.getElementById(id);
  if (element) element.classList.add("hidden");
}

function addClickListener(id, callback) {
  const element = document.getElementById(id);
  if (element) element.addEventListener("click", callback);
}

/* ---------------------------------------
   Map rendering
--------------------------------------- */

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
    tile.style.gridColumn = `${x} / span 1`;
    tile.style.gridRow = `${y} / span 1`;

    if (!isTileUnlocked(x, y)) {
      tile.classList.add("locked-map-tile");
      tile.title = "This area is locked.";
    }

    if (buildMode) {
      tile.classList.add("build-mode-active");
    }

    tile.addEventListener("click", () => handleMapTileClick(x, y));

    map.appendChild(tile);
  }

  renderPlacedItems(state);
  renderBuildings();
  renderPopulation();
  renderCropCapacityHud();
}

function handleMapTileClick(x, y) {
  if (!isTileUnlocked(x, y)) {
    const section = getMapSectionForTile(x, y);

    if (section) {
      setText(
        "build-mode-message",
        `${section.name} unlocks at Level ${section.requiredLevel}.`,
      );
    }

    return;
  }

  handleTileClick(x, y);
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

/* ---------------------------------------
   Main buildings
--------------------------------------- */

function renderBuildings() {
  const map = document.getElementById("village-map");
  const state = getState();

  if (!map) return;

  Object.values(BUILDING_DATA).forEach((building) => {
    const savedBuilding = getSavedBuildingState(state, building.id);

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
      handleBuildingClick(building.id);
    });

    map.appendChild(buildingElement);
  });
}

function getSavedBuildingState(state, buildingId) {
  const baseBuilding = BUILDING_DATA[buildingId];

  if (!state.village.buildings[buildingId]) {
    state.village.buildings[buildingId] = {
      name: baseBuilding.name,
      level: 1,
      x: baseBuilding.x,
      y: baseBuilding.y,
      width: baseBuilding.width,
      height: baseBuilding.height,
    };

    saveState(state);
  }

  const savedBuilding = state.village.buildings[buildingId];

  savedBuilding.name = savedBuilding.name || baseBuilding.name;
  savedBuilding.level = savedBuilding.level || 1;
  savedBuilding.x = savedBuilding.x || baseBuilding.x;
  savedBuilding.y = savedBuilding.y || baseBuilding.y;
  savedBuilding.width = savedBuilding.width || baseBuilding.width;
  savedBuilding.height = savedBuilding.height || baseBuilding.height;

  return savedBuilding;
}

function handleBuildingClick(buildingId) {
  const building = BUILDING_DATA[buildingId];

  if (!buildMode) {
    openBuildingModal(buildingId);
    return;
  }

  if (builderAction === "move") {
    movingBuildingId = buildingId;
    movingPlacedItem = null;

    setText(
      "builder-menu-message",
      `Moving ${building.name}. Click an empty area to place it.`,
    );

    renderVillage();
    return;
  }

  if (builderAction === "bulldoze") {
    setText("builder-menu-message", "Main buildings cannot be bulldozed.");
  }
}

function openBuildingModal(buildingId) {
  const state = getState();
  const building = BUILDING_DATA[buildingId];

  if (!building) return;

  selectedBuildingId = buildingId;

  const savedBuilding = getSavedBuildingState(state, buildingId);

  setText("modal-building-name", building.name);
  setText("modal-owner", `Manager: ${building.owner}`);
  setText("modal-dialogue", building.dialogue);
  setText("modal-building-level", savedBuilding.level);
  setText(
    "modal-upgrade-cost",
    `Upgrade Cost: ${formatCost(building.upgradeCost)}`,
  );
  setText("modal-message", "");

  renderBuildingActions(buildingId, savedBuilding.level);

  showElement("building-modal");
}

function renderBuildingActions(buildingId, buildingLevel) {
  const marketActions = document.getElementById("market-actions");
  const schoolActions = document.getElementById("school-actions");
  const tonePracticeLink = document.getElementById("tone-practice-link");
  const tonePracticeLockedMessage = document.getElementById(
    "tone-practice-locked-message",
  );

  if (marketActions) {
    if (buildingId === "market") {
      marketActions.classList.remove("hidden");
    } else {
      marketActions.classList.add("hidden");
    }
  }

  if (schoolActions) {
    if (buildingId === "school") {
      schoolActions.classList.remove("hidden");

      if (tonePracticeLink && tonePracticeLockedMessage) {
        if (buildingLevel >= 2) {
          tonePracticeLink.classList.remove("hidden");
          tonePracticeLockedMessage.classList.add("hidden");
        } else {
          tonePracticeLink.classList.add("hidden");
          tonePracticeLockedMessage.classList.remove("hidden");
        }
      }
    } else {
      schoolActions.classList.add("hidden");
    }
  }
}

function closeBuildingModal() {
  hideElement("building-modal");
}

function upgradeSelectedBuilding() {
  if (!selectedBuildingId) return;

  const state = getState();
  const building = BUILDING_DATA[selectedBuildingId];
  const savedBuilding = getSavedBuildingState(state, selectedBuildingId);

  if (!building || !savedBuilding) return;

  if (!canAffordUpgrade(state, building.upgradeCost)) {
    setText("modal-message", "Not enough resources yet.");
    return;
  }

  payUpgradeCost(state, building.upgradeCost);

  savedBuilding.level += 1;

  saveState(state);
  renderState();

  openBuildingModal(selectedBuildingId);

  setText(
    "modal-message",
    `${building.name} upgraded to Level ${savedBuilding.level}!`,
  );
}

/* ---------------------------------------
   Placeable items
--------------------------------------- */

function renderPlacedItems(state) {
  const map = document.getElementById("village-map");

  if (!map) return;

  state.village.placedItems.forEach((item) => {
    const itemData = PLACEABLE_ITEMS[item.type];

    if (!itemData) return;

    const itemElement = document.createElement("button");

    itemElement.classList.add("placed-item", itemData.className);
    itemElement.title = itemData.name;
    itemElement.style.gridColumn = `${item.x} / span 1`;
    itemElement.style.gridRow = `${item.y} / span 1`;

    if (item.type === "house") {
      itemElement.textContent = `${itemData.icon} ${item.level || 1}`;
    } else {
      itemElement.textContent = itemData.icon;
    }

    if (
      movingPlacedItem &&
      movingPlacedItem.originalX === item.x &&
      movingPlacedItem.originalY === item.y
    ) {
      itemElement.classList.add("moving-building");
    }

    itemElement.addEventListener("click", (event) => {
      event.stopPropagation();
      handlePlacedItemClick(item);
    });

    map.appendChild(itemElement);
  });
}

function handlePlacedItemClick(item) {
  if (!buildMode) {
    if (item.type === "house") {
      openHouseModal(item.x, item.y);
      return;
    }

    if (item.type === "farm") {
      openFarmModal(item.x, item.y);
      return;
    }

    return;
  }

  if (builderAction === "bulldoze") {
    removePlacedItem(item.x, item.y);
    setText("builder-menu-message", "Item removed.");
    return;
  }

  if (builderAction === "move") {
    movingBuildingId = null;
    selectedTile = { x: item.x, y: item.y };
    movePlacedItemStart(item.x, item.y);
  }
}

function placeItemAtTile(type, x, y) {
  const state = getState();
  const itemData = PLACEABLE_ITEMS[type];

  if (!itemData) return;

  if (!isBuildItemUnlocked(type)) {
    setText("builder-menu-message", `${itemData.name} is not unlocked yet.`);
    return;
  }

  if (!isTileUnlocked(x, y)) {
    setText("builder-menu-message", "This area is still locked.");
    return;
  }

  if (isTileOccupied(x, y)) {
    setText("builder-menu-message", "That tile is already occupied.");
    return;
  }

  const cost = itemData.buildCost || {};

  if (!canAffordUpgrade(state, cost)) {
    setText(
      "builder-menu-message",
      `Not enough resources. Need ${formatCost(cost)}.`,
    );
    return;
  }

  payUpgradeCost(state, cost);

  state.village.placedItems.push(createPlacedItem(type, x, y));

  saveState(state);
  renderState();
  renderVillage();

  setText("builder-menu-message", `${itemData.name} placed.`);
}

function createPlacedItem(type, x, y) {
  const item = {
    type,
    x,
    y,
    level: null,
    placedAt: new Date().toISOString(),
  };

  if (type === "house") {
    item.level = 1;
  }

  if (type === "farm") {
    item.level = 1;
    item.cropSlots = [];
  }

  return item;
}

function removePlacedItem(x, y) {
  const state = getState();

  state.village.placedItems = state.village.placedItems.filter((item) => {
    return !(item.x === x && item.y === y);
  });

  saveState(state);
  renderVillage();
  renderCropCapacityHud();
}

/* ---------------------------------------
   Build mode
--------------------------------------- */

function toggleBuildMode() {
  buildMode = !buildMode;

  const button = document.getElementById("toggle-build-mode-btn");
  const builderMenu = document.getElementById("builder-menu");

  if (buildMode) {
    if (button) button.classList.add("active");
    if (builderMenu) builderMenu.classList.remove("hidden");

    renderBuildOptions();
    setText("build-mode-message", "Build mode is on.");
  } else {
    if (button) button.classList.remove("active");
    if (builderMenu) builderMenu.classList.add("hidden");

    builderAction = null;
    selectedBuildItem = null;
    movingBuildingId = null;
    movingPlacedItem = null;

    hideElement("build-options");
    setText("build-mode-message", "Build mode is off.");
  }

  renderVillage();
}

function setBuilderAction(action) {
  builderAction = action;
  selectedBuildItem = null;
  movingBuildingId = null;
  movingPlacedItem = null;

  hideElement("build-options");

  if (action === "build") {
    showElement("build-options");
    setText("builder-menu-message", "Choose something to build.");
  }

  if (action === "move") {
    setText("builder-menu-message", "Click an item or building to move it.");
  }

  if (action === "bulldoze") {
    setText("builder-menu-message", "Click a placed item to remove it.");
  }
}

function renderBuildOptions() {
  const buttons = document.querySelectorAll(".build-option-btn");

  buttons.forEach((button) => {
    const type = button.dataset.buildType;

    if (!isBuildItemUnlocked(type)) {
      button.classList.add("locked-build-option");
      button.disabled = false;
      button.title = "Locked";
    } else {
      button.classList.remove("locked-build-option");
      button.disabled = false;
      button.title = "";
    }
  });
}

function isBuildItemUnlocked(type) {
  const state = getState();
  const level = state.player.level;

  const unlockLevels = {
    tree: 1,
    garden: 1,
    path: 1,
    well: 1,
    bench: 1,
    house: 2,
    farm: 3,
    shrine: 7,
  };

  return level >= (unlockLevels[type] || 1);
}

function selectBuildItem(type) {
  const itemData = PLACEABLE_ITEMS[type];

  if (!itemData) return;

  if (!isBuildItemUnlocked(type)) {
    const unlockLevels = {
      house: 2,
      farm: 3,
      shrine: 7,
    };

    setText(
      "builder-menu-message",
      `${itemData.name} unlocks at Level ${unlockLevels[type] || 1}.`,
    );

    return;
  }

  selectedBuildItem = type;

  setText(
    "builder-menu-message",
    `Selected: ${itemData.name}. Click an empty tile.`,
  );
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
  }
}

/* ---------------------------------------
   Moving
--------------------------------------- */

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

  setText(
    "builder-menu-message",
    `Moving ${PLACEABLE_ITEMS[item.type].name}. Click an empty tile.`,
  );

  renderVillage();
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
    setText("builder-menu-message", "That tile is occupied.");
    return;
  }

  item.x = x;
  item.y = y;

  saveState(state);

  movingPlacedItem = null;

  renderVillage();

  setText("builder-menu-message", "Item moved.");
}

function moveBuildingToTile(buildingId, x, y) {
  const state = getState();
  const building = getSavedBuildingState(state, buildingId);

  if (!building) return;

  if (!canPlaceBuilding(buildingId, x, y)) {
    setText("builder-menu-message", "That building cannot be placed there.");
    return;
  }

  building.x = x;
  building.y = y;

  saveState(state);

  movingBuildingId = null;

  renderVillage();

  setText("builder-menu-message", "Building moved.");
}

function canPlaceBuilding(buildingId, x, y) {
  const state = getState();
  const building = getSavedBuildingState(state, buildingId);

  if (!building) return false;

  const width = building.width;
  const height = building.height;

  if (x + width - 1 > MAP_WIDTH || y + height - 1 > MAP_HEIGHT) {
    return false;
  }

  for (let tileY = y; tileY < y + height; tileY++) {
    for (let tileX = x; tileX < x + width; tileX++) {
      if (!isTileUnlocked(tileX, tileY)) {
        return false;
      }

      if (isTileOccupiedForMove(tileX, tileY, buildingId)) {
        return false;
      }
    }
  }

  return true;
}

/* ---------------------------------------
   Tile occupancy
--------------------------------------- */

function isTileOccupied(x, y) {
  const state = getState();

  const hasPlacedItem = state.village.placedItems.some((item) => {
    return item.x === x && item.y === y;
  });

  if (hasPlacedItem) return true;

  return hasBuildingOnTile(state, x, y);
}

function isTileOccupiedForMove(x, y, movingBuildingIdToIgnore) {
  const state = getState();

  const hasPlacedItem = state.village.placedItems.some((item) => {
    return item.x === x && item.y === y;
  });

  if (hasPlacedItem) return true;

  return Object.keys(state.village.buildings).some((id) => {
    if (id === movingBuildingIdToIgnore) return false;

    const building = state.village.buildings[id];

    return isPointInsideBuilding(x, y, building);
  });
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

  return hasBuildingOnTile(state, x, y);
}

function hasBuildingOnTile(state, x, y) {
  return Object.keys(state.village.buildings).some((id) => {
    const building = state.village.buildings[id];
    return isPointInsideBuilding(x, y, building);
  });
}

function isPointInsideBuilding(x, y, building) {
  if (!building) return false;

  const withinX = x >= building.x && x < building.x + building.width;
  const withinY = y >= building.y && y < building.y + building.height;

  return withinX && withinY;
}

/* ---------------------------------------
   Farm system
--------------------------------------- */

function getUnlockedCrops() {
  const state = getState();
  const level = state.player.level;

  return Object.entries(CROP_DATA)
    .filter(([, crop]) => level >= crop.unlockLevel)
    .map(([cropId]) => cropId);
}

function getFarmCropCapacity() {
  const state = getState();
  const cropCapacity = {};

  state.village.placedItems
    .filter((item) => item.type === "farm")
    .forEach((farm) => {
      if (!farm.level) farm.level = 1;
      if (!farm.cropSlots) farm.cropSlots = [];

      for (let i = 0; i < farm.level; i++) {
        const cropId = farm.cropSlots[i];

        if (!cropId) continue;

        if (!cropCapacity[cropId]) {
          cropCapacity[cropId] = {
            available: 0,
            total: 0,
          };
        }

        cropCapacity[cropId].available += 1;
        cropCapacity[cropId].total += 1;
      }
    });

  return cropCapacity;
}

function renderCropCapacityHud() {
  const cropCapacity = getFarmCropCapacity();

  Object.keys(CROP_DATA).forEach((cropId) => {
    const element = document.getElementById(cropId);

    if (!element) return;

    const capacity = cropCapacity[cropId];

    if (!capacity) {
      element.textContent = "0 / 0";
      return;
    }

    element.textContent = `${capacity.available} / ${capacity.total}`;
  });
}

function openFarmModal(x, y) {
  const state = getState();

  const farm = state.village.placedItems.find((item) => {
    return item.type === "farm" && item.x === x && item.y === y;
  });

  if (!farm) return;

  if (!farm.level) farm.level = 1;
  if (!farm.cropSlots) farm.cropSlots = [];

  selectedFarm = { x, y };

  setText("farm-level", farm.level);
  setText("farm-slots", farm.level);

  renderFarmCropSlots(farm);
  renderFarmCropCapacitySummary();

  setText("farm-message", "");
  showElement("farm-modal");

  saveState(state);
}

function renderFarmCropSlots(farm) {
  const container = document.getElementById("farm-crop-slots");

  if (!container) return;

  const unlockedCrops = getUnlockedCrops();

  container.innerHTML = "";

  for (let i = 0; i < farm.level; i++) {
    const currentCrop = farm.cropSlots[i] || "";

    const row = document.createElement("div");
    row.classList.add("farm-slot-row");

    row.innerHTML = `
      <label>
        Slot ${i + 1}
        <select data-slot-index="${i}">
          <option value="">Empty</option>
          ${unlockedCrops
            .map((cropId) => {
              const crop = CROP_DATA[cropId];

              return `
                <option value="${cropId}" ${currentCrop === cropId ? "selected" : ""}>
                  ${crop.icon} ${crop.name}
                </option>
              `;
            })
            .join("")}
        </select>
      </label>
    `;

    container.appendChild(row);
  }

  container.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", updateFarmCropSlot);
  });
}

function renderFarmCropCapacitySummary() {
  const container = document.getElementById("farm-capacity-summary");

  if (!container) return;

  const cropCapacity = getFarmCropCapacity();
  const entries = Object.entries(cropCapacity);

  if (entries.length === 0) {
    container.innerHTML = `
      <p class="farm-capacity-empty">No crops assigned yet.</p>
    `;
    return;
  }

  container.innerHTML = entries
    .map(([cropId, capacity]) => {
      const crop = CROP_DATA[cropId];

      if (!crop) return "";

      return `
        <div class="farm-capacity-row">
          <span>${crop.icon} ${crop.name}</span>
          <strong>${capacity.available} / ${capacity.total}</strong>
        </div>
      `;
    })
    .join("");
}

function updateFarmCropSlot(event) {
  if (!selectedFarm) return;

  const state = getState();

  const farm = state.village.placedItems.find((item) => {
    return (
      item.type === "farm" &&
      item.x === selectedFarm.x &&
      item.y === selectedFarm.y
    );
  });

  if (!farm) return;

  if (!farm.cropSlots) farm.cropSlots = [];

  const slotIndex = Number(event.target.dataset.slotIndex);
  const cropId = event.target.value;

  farm.cropSlots[slotIndex] = cropId;

  saveState(state);

  renderFarmCropSlots(farm);
  renderFarmCropCapacitySummary();
  renderCropCapacityHud();
  renderState();

  setText("farm-message", "Crop selection saved.");
}

function closeFarmModal() {
  selectedFarm = null;
  hideElement("farm-modal");
}

/* ---------------------------------------
   House system
--------------------------------------- */

function openHouseModal(x, y) {
  const state = getState();

  const house = state.village.placedItems.find((item) => {
    return item.type === "house" && item.x === x && item.y === y;
  });

  if (!house) return;

  if (!house.level) house.level = 1;

  selectedHouse = { x, y };

  setText("house-level", house.level);
  setText("house-population", house.level);

  const cost = getHouseUpgradeCost(house.level);
  const upgradeButton = document.getElementById("upgrade-house-btn");

  if (cost) {
    setText("house-upgrade-cost", `Upgrade Cost: ${formatCost(cost)}`);

    if (upgradeButton) {
      upgradeButton.style.display = "block";
    }
  } else {
    setText("house-upgrade-cost", "Maximum level reached");

    if (upgradeButton) {
      upgradeButton.style.display = "none";
    }
  }

  setText("house-message", "");
  showElement("house-modal");
}

function closeHouseModal() {
  selectedHouse = null;
  hideElement("house-modal");
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

  if (!house.level) house.level = 1;

  const upgradeCost = getHouseUpgradeCost(house.level);

  if (!upgradeCost) return;

  if (!canAffordUpgrade(state, upgradeCost)) {
    setText(
      "house-message",
      `Not enough resources. Need ${formatCost(upgradeCost)}.`,
    );
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

/* ---------------------------------------
   Population
--------------------------------------- */

function calculatePopulationCap(state) {
  const basePopulationCap = 5;

  const housePopulationCap = state.village.placedItems
    .filter((item) => item.type === "house")
    .reduce((total, house) => {
      return total + (house.level || 1);
    }, 0);

  return basePopulationCap + housePopulationCap;
}

function renderPopulation() {
  const state = getState();
  const populationCap = calculatePopulationCap(state);
  const population = state.village.population;

  setText("current-population", population.current);
  setText("population-cap", populationCap);
  setText(
    "next-citizen-progress",
    `${population.learnedWordsSinceLastCitizen} / ${population.nextCitizenRequirement}`,
  );
}

function renderPopulationCap() {
  const state = getState();
  setText("population-cap", calculatePopulationCap(state));
}

function getNextCitizenRequirement(currentPopulation) {
  if (currentPopulation === 0) return 25;
  if (currentPopulation === 1) return 50;
  return 100;
}

/* ---------------------------------------
   Market
--------------------------------------- */

function buyWoodFromMarket() {
  const state = getState();

  const cost = {
    coins: 25,
  };

  if (!canAffordUpgrade(state, cost)) {
    setText("modal-message", "Not enough coins.");
    return;
  }

  payUpgradeCost(state, cost);

  state.resources.wood += 10;

  saveState(state);
  renderState();

  setText("modal-message", "Bought 10 wood for 25 coins.");
}

/* ---------------------------------------
   Town name
--------------------------------------- */

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

function openTownNameModal() {
  const state = getState();

  const input = document.getElementById("town-name-input");

  if (input) {
    input.value = state.townName || "Language Town";
  }

  showElement("town-name-modal");
}

function closeTownNameModal() {
  hideElement("town-name-modal");
}

function saveTownName() {
  const state = getState();
  const input = document.getElementById("town-name-input");

  if (!input) return;

  const newName = input.value.trim();

  if (!newName) return;

  state.townName = newName;
  saveState(state);

  renderTownName();
  closeTownNameModal();
}

/* ---------------------------------------
   Legacy build modal support
--------------------------------------- */

function placeItem(type) {
  if (!selectedTile) return;

  const state = getState();
  const itemData = PLACEABLE_ITEMS[type];

  if (!itemData) return;

  if (isTileOccupied(selectedTile.x, selectedTile.y)) {
    setText("build-modal-message", "That tile is already occupied.");
    return;
  }

  const cost = itemData.buildCost || {};

  if (!canAffordUpgrade(state, cost)) {
    setText(
      "build-modal-message",
      `Not enough resources. Need ${formatCost(cost)}.`,
    );
    return;
  }

  payUpgradeCost(state, cost);

  state.village.placedItems.push(
    createPlacedItem(type, selectedTile.x, selectedTile.y),
  );

  saveState(state);

  selectedTile = null;

  hideElement("build-modal");

  renderState();
  renderVillage();
}

function closeBuildModal() {
  selectedTile = null;
  hideElement("build-modal");
}

/* ---------------------------------------
   Shared resource helpers
--------------------------------------- */

function formatCost(cost) {
  const entries = Object.entries(cost || {});

  if (entries.length === 0) return "Free";

  return entries
    .map(([resource, amount]) => `${amount} ${resource}`)
    .join(", ");
}

function canAffordUpgrade(state, cost) {
  return Object.entries(cost || {}).every(([resource, amount]) => {
    return (state.resources[resource] || 0) >= amount;
  });
}

function payUpgradeCost(state, cost) {
  Object.entries(cost || {}).forEach(([resource, amount]) => {
    state.resources[resource] = (state.resources[resource] || 0) - amount;
  });
}

/* ---------------------------------------
   Dev / reset helper
--------------------------------------- */

function clearPlacedItems() {
  const state = getState();

  state.village.placedItems = [];

  saveState(state);
  renderVillage();
  renderTownName();
}

/* ---------------------------------------
   Page init
--------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderTownName();
  renderVillage();

  addClickListener("builder-build-btn", () => setBuilderAction("build"));
  addClickListener("builder-move-btn", () => setBuilderAction("move"));
  addClickListener("builder-bulldoze-btn", () => setBuilderAction("bulldoze"));

  addClickListener("toggle-build-mode-btn", toggleBuildMode);

  addClickListener("close-modal", closeBuildingModal);
  addClickListener("upgrade-building-btn", upgradeSelectedBuilding);

  addClickListener("buy-wood-btn", buyWoodFromMarket);

  addClickListener("close-build-modal", closeBuildModal);

  addClickListener("close-house-modal", closeHouseModal);
  addClickListener("upgrade-house-btn", upgradeHouse);

  addClickListener("close-farm-modal", closeFarmModal);

  addClickListener("edit-town-name-btn", openTownNameModal);
  addClickListener("close-town-name-modal", closeTownNameModal);
  addClickListener("save-town-name-btn", saveTownName);

  const oldCollectCropsBtn = document.getElementById("collect-crops-btn");

  if (oldCollectCropsBtn) {
    oldCollectCropsBtn.remove();
  }
});
