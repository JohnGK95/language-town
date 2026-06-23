const LEVEL_REQUIREMENTS = {
  2: {
    xp: 150,
    learnedWords: 50,
    familiarWords: 25,
    masteredWords: 10,
    citizens: 1,
    buildings: [],
    unlocks: ["Builder Tao arrives", "Houses", "Population system"],
  },

  3: {
    xp: 300,
    learnedWords: 100,
    familiarWords: 50,
    masteredWords: 25,
    citizens: 3,
    buildings: ["Town Hall Lv2"],
    unlocks: [
      "Farmer Mei arrives",
      "Farms",
      "Rice Discovery Quest",
      "Gardens generate Culture",
    ],
  },

  4: {
    xp: 500,
    learnedWords: 175,
    familiarWords: 85,
    masteredWords: 40,
    citizens: 5,
    buildings: ["School Lv2", "Library Lv2"],
    unlocks: [
      "Mandarin Teacher lessons",
      "Tone practice",
      "Wheat Discovery Quest",
      "Quest system",
    ],
  },

  5: {
    xp: 750,
    learnedWords: 225,
    familiarWords: 110,
    masteredWords: 60,
    citizens: 7,
    buildings: ["Town Hall Lv3", "Market Lv2"],
    unlocks: ["Specialty Decorations", "Soy Discovery Quest", "NPC Requests"],
  },

  6: {
    xp: 1000,
    learnedWords: 300,
    familiarWords: 150,
    masteredWords: 70,
    citizens: 10,
    buildings: ["School Lv3", "Market Lv3", "Lumber Mill Lv3", "Farm Lv3"],
    unlocks: [
      "A2 Vocabulary Available",
      "Yilan Green Onion Discovery Quest",
      "Advanced Farming",
    ],
  },

  7: {
    xp: 1500,
    learnedWords: 375,
    familiarWords: 175,
    masteredWords: 90,
    citizens: 12,
    buildings: ["Town Hall Lv4"],
    unlocks: ["Festival Events", "Temple Decoration", "Mango Discovery Quest"],
  },

  8: {
    xp: 2000,
    learnedWords: 450,
    familiarWords: 225,
    masteredWords: 125,
    citizens: 18,
    buildings: ["School Lv4", "Market Lv4", "Farm Lv4"],
    unlocks: [
      "East Map Expansion Available",
      "Theater Expansion",
      "Taiwan Pork Discovery Quest",
      "Listening Practice",
    ],
  },

  9: {
    xp: 2500,
    learnedWords: 550,
    familiarWords: 275,
    masteredWords: 175,
    citizens: 22,
    buildings: ["Town Hall Lv5"],
    unlocks: [
      "Trade Routes",
      "Beef Noodle Soup Discovery Quest",
      "B1 Vocabulary Available",
    ],
  },

  10: {
    xp: 3000,
    learnedWords: 675,
    familiarWords: 375,
    masteredWords: 250,
    citizens: 26,
    buildings: ["School Lv5", "Market Lv5", "Farm Lv5"],
    unlocks: [
      "Night Market Stalls",
      "Food Conversion System",
      "Bubble Tea Discovery Quest",
    ],
  },

  11: {
    xp: 4000,
    learnedWords: 800,
    familiarWords: 500,
    masteredWords: 350,
    citizens: 32,
    buildings: ["Town Hall Lv6"],
    unlocks: ["Writing Hall", "Writing Practice"],
  },

  12: {
    xp: 5000,
    learnedWords: 950,
    familiarWords: 650,
    masteredWords: 450,
    citizens: 40,
    buildings: ["School Lv6", "Market Lv6", "Farm Lv6"],
    unlocks: [
      "South Map Expansion Available",
      "Grammar Academy",
      "Advanced Grammar Lessons",
    ],
  },

  13: {
    xp: 6500,
    learnedWords: 1100,
    familiarWords: 800,
    masteredWords: 600,
    citizens: 45,
    buildings: ["Town Hall Lv7"],
    unlocks: ["Reading Practice", "Short Stories"],
  },

  14: {
    xp: 8000,
    learnedWords: 1400,
    familiarWords: 1000,
    masteredWords: 750,
    citizens: 50,
    buildings: ["School Lv7", "Market Lv7", "Farm Lv7"],
    unlocks: ["Newspaper Office", "Long-form Reading"],
  },

  15: {
    xp: 10000,
    learnedWords: 1700,
    familiarWords: 1250,
    masteredWords: 900,
    citizens: 55,
    buildings: ["Town Hall Lv8"],
    unlocks: ["Visitor Center", "Regional Mandarin Visitors"],
  },

  16: {
    xp: 13000,
    learnedWords: 2000,
    familiarWords: 1500,
    masteredWords: 1100,
    citizens: 60,
    buildings: ["School Lv8", "Market Lv8", "Farm Lv8"],
    unlocks: ["Advanced Listening Challenges"],
  },

  17: {
    xp: 16000,
    learnedWords: 2500,
    familiarWords: 1900,
    masteredWords: 1400,
    citizens: 65,
    buildings: ["Town Hall Lv9"],
    unlocks: ["Cultural Exchange Events"],
  },

  18: {
    xp: 20000,
    learnedWords: 3000,
    familiarWords: 2300,
    masteredWords: 1800,
    citizens: 70,
    buildings: ["School Lv9", "Market Lv9", "Farm Lv9"],
    unlocks: ["Final Map Expansion Available", "B2 Vocabulary Available"],
  },

  19: {
    xp: 25000,
    learnedWords: 4000,
    familiarWords: 3000,
    masteredWords: 2400,
    citizens: 75,
    buildings: ["Town Hall Lv10"],
    unlocks: ["Cultural Mastery Challenges"],
  },

  20: {
    xp: 35000,
    learnedWords: 5000,
    familiarWords: 4000,
    masteredWords: 3000,
    citizens: 80,
    buildings: ["School Lv10", "Market Lv10", "Farm Lv10", "Lumber Mill Lv10"],
    unlocks: ["Cultural Capital Status", "Final B2 Challenges"],
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
function getBuildingLevel(state, buildingName) {
  const buildingMap = {
    "Town Hall": "townHall",
    Library: "library",
    School: "school",
    Market: "market",
    "Lumber Mill": "lumberMill",
    Farm: "farm",
  };

  const buildingId = buildingMap[buildingName];

  if (!buildingId) return 0;

  if (buildingId === "farm") {
    const farm = state.village.placedItems.find((item) => item.type === "farm");
    return farm ? farm.level || 1 : 0;
  }

  return state.village.buildings[buildingId]?.level || 0;
}
function parseBuildingRequirement(requirementText) {
  const parts = requirementText.split(" Lv");
  const buildingName = parts[0];
  const requiredLevel = Number(parts[1]);

  return {
    buildingName,
    requiredLevel,
  };
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
  const buildingRequirements = (req.buildings || []).map((buildingReq) => {
    const parsed = parseBuildingRequirement(buildingReq);
    const currentLevel = getBuildingLevel(state, parsed.buildingName);

    return [buildingReq, currentLevel, parsed.requiredLevel];
  });
  reqList.innerHTML = [...requirements, ...buildingRequirements]
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

  const allComplete = [...requirements, ...buildingRequirements].every(
    ([, value, needed]) => value >= needed,
  );

  if (allComplete) {
    levelUpBtn.classList.remove("hidden");
  } else {
    levelUpBtn.classList.add("hidden");
  }
}
function canLevelUp() {
  const state = getState();
  const nextLevel = state.player.level + 1;
  const req = LEVEL_REQUIREMENTS[nextLevel];

  if (!req) return false;

  const requirements = [
    ["XP", state.player.xp, req.xp],
    ["Learned Words", countLearnedWords(state), req.learnedWords],
    ["Familiar Words", countFamiliarWords(state), req.familiarWords],
    ["Mastered Words", countMasteredWords(state), req.masteredWords],
    ["Citizens", state.village.population.current, req.citizens],
  ];

  const buildingRequirements = (req.buildings || []).map((buildingReq) => {
    const parsed = parseBuildingRequirement(buildingReq);
    const currentLevel = getBuildingLevel(state, parsed.buildingName);

    return [buildingReq, currentLevel, parsed.requiredLevel];
  });

  return [...requirements, ...buildingRequirements].every(
    ([, value, needed]) => {
      return value >= needed;
    },
  );
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

  if (!canLevelUp()) {
    document.getElementById("level-modal-message").textContent =
      "You do not meet all level up requirements yet.";
    renderLevelModal();
    return;
  }

  state.player.level += 1;

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
