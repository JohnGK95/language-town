let selectedVillagerId = null;
const RELATIONSHIP_LEVELS = {
  1: {
    currentXP: 0,
    nextXP: 100,
  },
  2: {
    currentXP: 100,
    nextXP: 300,
  },
  3: {
    currentXP: 300,
    nextXP: 700,
  },
  4: {
    currentXP: 700,
    nextXP: 1500,
  },
  5: {
    currentXP: 1500,
    nextXP: null,
  },
};

function getRelationshipProgress(villager) {
  const levelData = RELATIONSHIP_LEVELS[villager.relationshipLevel];

  if (!levelData || levelData.nextXP === null) {
    return {
      current: 1,
      text: "Max relationship",
    };
  }

  const progressXP = villager.relationshipXP - levelData.currentXP;
  const neededXP = levelData.nextXP - levelData.currentXP;

  return {
    current: Math.min(progressXP / neededXP, 1),
    text: `${progressXP} / ${neededXP}`,
  };
}

function getHearts(level) {
  const filled = "❤️".repeat(level);
  const empty = "🤍".repeat(5 - level);

  return filled + empty;
}
function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function getProductAssignedDays(state, productId) {
  const now = Date.now();
  let totalDays = state.productSlotHistory?.[productId] || 0;
  state.village.placedItems.filter((item) => item.type === "farm").forEach((farm) => {
    const slots = farm.productSlots || (farm.cropSlots || []).map((cropId) => cropId ? { productKey: cropId + ":standard", assignedAt: new Date().toISOString(), accumulatedDays: 0 } : null);
    slots.forEach((slot) => {
      if (!slot) return;
      const key = typeof slot === "string" ? slot : slot.productKey;
      if (!key || key.split(":")[0] !== productId) return;
      const assignedAt = typeof slot === "string" ? now : Date.parse(slot.assignedAt || new Date().toISOString());
      const currentDays = Math.max(0, (now - assignedAt) / 86400000);
      totalDays += (slot.accumulatedDays || 0) + currentDays;
    });
  });
  return totalDays;
}

function hasFullyUpgradedFarm(state) {
  return state.village.placedItems.some((item) => item.type === "farm" && (item.level || 1) >= 3);
}

function isDiscoveryPackMastered(state, product) {
  if (!product.discoveryPack) return false;
  const packWords = state.vocab.filter((word) => word.pack === product.discoveryPack);
  return packWords.length > 0 && packWords.every((word) => (word.quizCorrectCount || 0) >= 5);
}

function getEligibleLuxuryProducts(state, farmer) {
  return getProducts(state).filter((product) => {
    return product.type === "crop" &&
      product.luxuryName &&
      !product.luxuryUnlocked &&
      state.player.level >= product.luxuryUnlockLevel &&
      (farmer.relationshipLevel || 1) >= 3 &&
      hasFullyUpgradedFarm(state) &&
      getProductAssignedDays(state, product.id) >= 14;
  });
}

function renderFarmerLuxuryQuest(state, farmer) {
  const section = document.getElementById("luxury-quest-section");
  if (!section) return;
  section.classList.add("hidden");
  section.innerHTML = "";
  if (!farmer || farmer.id !== "farmer_mei") return;
  const eligibleProducts = getEligibleLuxuryProducts(state, farmer);
  if (eligibleProducts.length === 0 || Math.random() > 0.5) return;
  const product = eligibleProducts[Math.floor(Math.random() * eligibleProducts.length)];
  const paid = product.questStarted;
  const mastered = isDiscoveryPackMastered(state, product);
  section.classList.remove("hidden");
  section.innerHTML = "<hr><h3>Discovery Quest</h3><p>Farmer Mei can help you unlock " + product.luxuryName + ".</p><p>Cost: 100 knowledge. Discovery Pack: " + (product.discoveryPack || "not set") + ".</p>" + (paid ? "<p>Quest started. Master every word in the Discovery Pack to unlock the luxury crop.</p>" : "<button id=\"start-luxury-quest-btn\">Start Quest</button>") + (paid && mastered ? "<button id=\"complete-luxury-quest-btn\">Unlock Luxury Crop</button>" : "");
  const startButton = document.getElementById("start-luxury-quest-btn");
  if (startButton) startButton.addEventListener("click", () => startLuxuryQuest(product.id));
  const completeButton = document.getElementById("complete-luxury-quest-btn");
  if (completeButton) completeButton.addEventListener("click", () => completeLuxuryQuest(product.id));
}

function startLuxuryQuest(productId) {
  const state = getState();
  const product = state.products.find((entry) => entry.id === productId);
  if (!product) return;
  if ((state.resources.knowledge || 0) < 100) { document.getElementById("daily-task-message").textContent = "You need 100 knowledge to start this quest."; return; }
  state.resources.knowledge -= 100;
  product.questStarted = true;
  saveState(state);
  document.getElementById("daily-task-message").textContent = "Discovery Quest started. Master the pack to unlock " + product.luxuryName + ".";
  renderFarmerLuxuryQuest(state, state.villagers.find((person) => person.id === "farmer_mei"));
}

function completeLuxuryQuest(productId) {
  const state = getState();
  const product = state.products.find((entry) => entry.id === productId);
  if (!product || !isDiscoveryPackMastered(state, product)) return;
  product.luxuryUnlocked = true;
  saveState(state);
  document.getElementById("daily-task-message").textContent = product.luxuryName + " is now available on any Farm.";
  renderFarmerLuxuryQuest(state, state.villagers.find((person) => person.id === "farmer_mei"));
}
function openVillagerTalkModal(villagerId) {
  const state = getState();

  const villager = state.villagers.find((person) => {
    return person.id === villagerId;
  });

  if (!villager) return;

  selectedVillagerId = villagerId;

  document.getElementById("talk-villager-name").textContent = villager.name;
  document.getElementById("talk-villager-dialogue").textContent =
    villager.dialogue;

  const today = getTodayDateString();

  if (villager.lastInteractionDate === today) {
    document.getElementById("daily-task-message").textContent =
      "You already completed today's task with this villager.";

    document.getElementById("complete-daily-task-btn").disabled = true;
  } else {
    document.getElementById("daily-task-message").textContent =
      "Complete today's task to gain friendship.";

    document.getElementById("complete-daily-task-btn").disabled = false;
  }

  renderFarmerLuxuryQuest(state, villager);
  document.getElementById("villager-talk-modal").classList.remove("hidden");
}

function closeVillagerTalkModal() {
  selectedVillagerId = null;
  document.getElementById("villager-talk-modal").classList.add("hidden");
}

function addRelationshipXP(villager, amount) {
  villager.relationshipXP += amount;

  const nextLevelData = RELATIONSHIP_LEVELS[villager.relationshipLevel];

  if (!nextLevelData || nextLevelData.nextXP === null) return;

  if (villager.relationshipXP >= nextLevelData.nextXP) {
    villager.relationshipLevel += 1;
  }
}

function completeDailyTask() {
  if (!selectedVillagerId) return;

  const state = getState();

  const villager = state.villagers.find((person) => {
    return person.id === selectedVillagerId;
  });

  if (!villager) return;

  const today = getTodayDateString();

  if (villager.lastInteractionDate === today) {
    document.getElementById("daily-task-message").textContent =
      "You already completed today's task.";
    return;
  }

  villager.lastInteractionDate = today;
  villager.dailyTaskCompleted = true;
  villager.streak += 1;

  addRelationshipXP(villager, 10);

  saveState(state);

  document.getElementById("daily-task-message").textContent =
    "+10 friendship gained!";

  document.getElementById("complete-daily-task-btn").disabled = true;

  renderVillagers();
}
function renderVillagers() {
  const state = getState();
  const villagerList = document.getElementById("villager-list");

  if (!villagerList) return;

  villagerList.innerHTML = "";

  state.villagers.forEach((villager) => {
    const card = document.createElement("div");

    const relationshipProgress = getRelationshipProgress(villager);

    card.classList.add("villager-card");

    if (!villager.unlocked) {
      card.classList.add("locked-villager");
    }

    card.innerHTML = `
      <h3>${villager.unlocked ? villager.name : "???"}</h3>

      <p><strong>Role:</strong> ${villager.unlocked ? villager.role : "Unknown"}</p>
      <p><strong>Building:</strong> ${villager.unlocked ? villager.building : "Locked"}</p>

      <p class="heart-row">
        ${villager.unlocked ? getHearts(villager.relationshipLevel) : "🤍🤍🤍🤍🤍"}
      </p>

      <p>
        <strong>Friendship:</strong>
        ${villager.unlocked ? relationshipProgress.text : "Locked"}
      </p>

      <div class="relationship-bar">
        <div
          class="relationship-fill"
          style="width: ${villager.unlocked ? relationshipProgress.current * 100 : 0}%"
        ></div>
      </div>

      <p><strong>Daily Streak:</strong> 🔥 ${villager.unlocked ? villager.streak : 0}</p>

      <p><strong>Focus:</strong> ${
        villager.unlocked
          ? villager.focus
          : "Unlock this villager by progressing your town."
      }</p>

      <p class="villager-dialogue">
        ${
          villager.unlocked
            ? `"${villager.dialogue}"`
            : `Unlocks at Town Level ${villager.unlockLevel}`
        }
      </p>

      ${
        villager.unlocked
          ? `<button class="talk-villager-btn" data-villager-id="${villager.id}">
              Talk
            </button>`
          : ""
      }
    `;

    villagerList.appendChild(card);
  });

  document.querySelectorAll(".talk-villager-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const villagerId = button.dataset.villagerId;
      openVillagerTalkModal(villagerId);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderVillagers();

  document
    .getElementById("close-villager-talk-modal")
    .addEventListener("click", closeVillagerTalkModal);

  document
    .getElementById("complete-daily-task-btn")
    .addEventListener("click", completeDailyTask);
});
