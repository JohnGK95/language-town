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
