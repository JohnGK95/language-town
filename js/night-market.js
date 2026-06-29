function statusItem(label, value) {
  return `<div><span>${label}</span><strong>${value}</strong></div>`;
}

function yesNo(value) {
  return value ? "Ready" : "Locked";
}

function renderNightMarketStatus() {
  const state = getState();
  const status = document.getElementById("night-market-status");
  const title = document.getElementById("night-market-page-title");
  const nightMarket = getNightMarketPlacedItem(state);
  const mayor = getMayor(state);

  if (title) {
    title.textContent = nightMarket ? getNightMarketDisplayName(nightMarket, state) : `${state.townName || "Language Town"} Night Market`;
  }

  if (!status) return;

  status.innerHTML = [
    statusItem("Player Level", `${state.player.level} / 10`),
    statusItem("Building", nightMarket ? "Placed" : "Build at Level 10"),
    statusItem("Mayor Relationship", `${mayor?.relationshipLevel || 1} / 3`),
    statusItem("Knowledge", state.resources.knowledge || 0),
  ].join("");
}

function formatIngredientStatus(recipe) {
  const state = getState();
  const statuses = getRecipeIngredientStatus(recipe, state);

  if (!statuses.length) return "<p>No ingredients set.</p>";

  return statuses
    .map((ingredient) => {
      const product = ingredient.product;
      const name = product
        ? ingredient.variant === "luxury"
          ? product.luxuryName || product.standardName
          : product.standardName
        : ingredient.productId;
      return `<p class="${ingredient.ready ? "requirement-complete" : "requirement-incomplete"}">${name}: ${ingredient.available} / ${ingredient.quantity}</p>`;
    })
    .join("");
}

function renderRecipeResearch() {
  const state = getState();
  const container = document.getElementById("night-market-recipes");
  const recipes = getRecipes(state);
  const mayor = getMayor(state);
  const nightMarketReady = canUseNightMarket(state);

  if (!container) return;

  if (!recipes.length) {
    container.innerHTML = `<p class="helper-text">No recipes have been created yet.</p>`;
    return;
  }

  container.innerHTML = recipes
    .map((recipe) => {
      const ingredientsReady = areRecipeIngredientsReady(recipe, state);
      const mastered = isPackMastered(state, recipe.discoveryPack);
      const mayorReady = (mayor?.relationshipLevel || 1) >= 3;
      const canComplete = canResearchRecipe(recipe, state) && (state.resources.knowledge || 0) >= 100;
      const alreadyComplete = recipe.researchComplete;

      return `
        <div class="recipe-card">
          <h3>${recipe.icon} ${recipe.name}</h3>
          <p><strong>Rewards:</strong> ${recipe.coins} coins + ${recipe.culture} culture</p>
          <p><strong>Discovery Pack:</strong> ${recipe.discoveryPack || "Not set"}</p>
          <div class="recipe-requirements">
            <p class="${nightMarketReady ? "requirement-complete" : "requirement-incomplete"}">Night Market: ${yesNo(nightMarketReady)}</p>
            <p class="${mayorReady ? "requirement-complete" : "requirement-incomplete"}">Mayor relationship Level 3: ${yesNo(mayorReady)}</p>
            <p class="${recipe.questStarted ? "requirement-complete" : "requirement-incomplete"}">Mayor quest given: ${yesNo(recipe.questStarted)}</p>
            <p class="${ingredientsReady ? "requirement-complete" : "requirement-incomplete"}">Ingredients: ${yesNo(ingredientsReady)}</p>
            <p class="${mastered ? "requirement-complete" : "requirement-incomplete"}">Discovery Pack mastered: ${yesNo(mastered)}</p>
            ${formatIngredientStatus(recipe)}
          </div>
          ${
            alreadyComplete
              ? `<p class="requirement-complete">Research complete. This recipe can be selected in the village Night Market.</p>`
              : `<button type="button" ${canComplete ? "" : "disabled"} onclick="completeRecipeResearch('${recipe.id}')">Complete Research for 100 Knowledge</button>`
          }
        </div>
      `;
    })
    .join("");
}

function renderAvailableRecipes() {
  const container = document.getElementById("night-market-products");
  if (!container) return;

  const recipes = getResearchedRecipes();

  container.innerHTML = recipes.length
    ? recipes.map((recipe) => statusItem(recipe.name, `${recipe.coins} coins + ${recipe.culture} culture`)).join("")
    : `<p class="helper-text">No recipes have completed research yet.</p>`;
}

function completeRecipeResearch(recipeId) {
  const state = getState();
  const recipe = state.recipes.find((entry) => entry.id === recipeId);
  if (!recipe || !canResearchRecipe(recipe, state)) return;

  if ((state.resources.knowledge || 0) < 100) return;

  state.resources.knowledge -= 100;
  recipe.researchComplete = true;
  saveState(state);
  renderNightMarketStatus();
  renderRecipeResearch();
  renderAvailableRecipes();
}

document.addEventListener("DOMContentLoaded", () => {
  renderNightMarketStatus();
  renderRecipeResearch();
  renderAvailableRecipes();
});
