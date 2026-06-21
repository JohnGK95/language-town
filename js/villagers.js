function renderVillagers() {
  const state = getState();
  const villagerList = document.getElementById("villager-list");

  if (!villagerList) return;

  villagerList.innerHTML = "";

  state.villagers.forEach((villager) => {
    const card = document.createElement("div");

    card.classList.add("villager-card");

    if (!villager.unlocked) {
      card.classList.add("locked-villager");
    }

    card.innerHTML = `
      <h3>${villager.unlocked ? villager.name : "???"}</h3>
      <p><strong>Role:</strong> ${villager.unlocked ? villager.role : "Unknown"}</p>
      <p><strong>Building:</strong> ${villager.unlocked ? villager.building : "Locked"}</p>
      <p><strong>Relationship:</strong> Lv ${villager.relationshipLevel}</p>
      <p><strong>Focus:</strong> ${villager.unlocked ? villager.focus : "Unlock this villager by progressing your town."}</p>
      <p class="villager-dialogue">
        ${villager.unlocked ? `"${villager.dialogue}"` : `Unlocks at Town Level ${villager.unlockLevel}`}
      </p>
    `;

    villagerList.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderVillagers);
