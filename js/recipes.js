let editingRecipeId = null;

function getRecipeFormData() {
  const name = document.getElementById("recipe-name").value.trim();
  const idInput = document.getElementById("recipe-id").value.trim();

  return normalizeRecipe({
    id: idInput || createRecipeId(name),
    name,
    icon: document.getElementById("recipe-icon").value.trim() || name.slice(0, 1).toUpperCase(),
    coins: Number(document.getElementById("recipe-coins").value || 0),
    culture: Number(document.getElementById("recipe-culture").value || 0),
    discoveryPack: document.getElementById("recipe-discovery-pack").value.trim(),
    ingredients: readIngredientRows(),
    questStarted: editingRecipeId ? Boolean(findRecipe(editingRecipeId)?.questStarted) : false,
    researchComplete: editingRecipeId ? Boolean(findRecipe(editingRecipeId)?.researchComplete) : false,
  });
}

function readIngredientRows() {
  return [...document.querySelectorAll(".recipe-ingredient-row")]
    .map((row) => ({
      productId: row.querySelector(".recipe-product-select").value,
      variant: row.querySelector(".recipe-variant-select").value,
      quantity: Number(row.querySelector(".recipe-quantity-input").value || 1),
    }))
    .filter((ingredient) => ingredient.productId);
}

function addIngredientRow(ingredient = {}) {
  const container = document.getElementById("recipe-ingredients");
  const products = getProducts();
  const row = document.createElement("div");
  row.className = "recipe-ingredient-row";
  row.innerHTML = `
    <select class="recipe-product-select">
      <option value="">Choose product</option>
      ${products
        .map(
          (product) =>
            `<option value="${product.id}" ${ingredient.productId === product.id ? "selected" : ""}>${product.standardName}</option>`,
        )
        .join("")}
    </select>
    <select class="recipe-variant-select">
      <option value="standard" ${ingredient.variant !== "luxury" ? "selected" : ""}>Standard</option>
      <option value="luxury" ${ingredient.variant === "luxury" ? "selected" : ""}>Luxury</option>
    </select>
    <input class="recipe-quantity-input" type="number" min="1" value="${ingredient.quantity || 1}" />
    <button type="button" class="remove-ingredient-btn">Remove</button>
  `;
  row.querySelector(".remove-ingredient-btn").addEventListener("click", () => row.remove());
  container.appendChild(row);
}

function saveRecipe(event) {
  event.preventDefault();
  const state = getState();
  ensureRecipeState(state);
  const recipe = getRecipeFormData();
  const existingIndex = state.recipes.findIndex((entry) => entry.id === (editingRecipeId || recipe.id));

  if (existingIndex >= 0) state.recipes[existingIndex] = recipe;
  else state.recipes.push(recipe);

  saveState(state);
  clearRecipeForm();
  renderRecipes();
}

function editRecipe(recipeId) {
  const recipe = findRecipe(recipeId);
  if (!recipe) return;

  editingRecipeId = recipe.id;
  document.getElementById("recipe-id").value = recipe.id;
  document.getElementById("recipe-name").value = recipe.name;
  document.getElementById("recipe-icon").value = recipe.icon;
  document.getElementById("recipe-coins").value = recipe.coins;
  document.getElementById("recipe-culture").value = recipe.culture;
  document.getElementById("recipe-discovery-pack").value = recipe.discoveryPack;
  document.getElementById("recipe-ingredients").innerHTML = "";

  if (recipe.ingredients.length) recipe.ingredients.forEach(addIngredientRow);
  else addIngredientRow();
}

function deleteRecipe(recipeId) {
  const state = getState();
  ensureRecipeState(state);
  state.recipes = state.recipes.filter((recipe) => recipe.id !== recipeId);
  state.village.placedItems
    .filter((item) => item.type === "nightMarket")
    .forEach((item) => {
      item.recipeSlots = (item.recipeSlots || []).map((slot) => (slot === recipeId ? "" : slot));
    });
  saveState(state);
  renderRecipes();
}

function clearRecipeForm() {
  editingRecipeId = null;
  document.getElementById("recipe-form").reset();
  document.getElementById("recipe-coins").value = 25;
  document.getElementById("recipe-culture").value = 2;
  document.getElementById("recipe-ingredients").innerHTML = "";
  addIngredientRow();
}

function formatRecipeIngredients(recipe) {
  if (!recipe.ingredients.length) return "-";
  return recipe.ingredients
    .map((ingredient) => {
      const product = findProduct(ingredient.productId);
      const name = product ? product.standardName : ingredient.productId;
      const variant = ingredient.variant === "luxury" ? " luxury" : "";
      return `${ingredient.quantity} ${name}${variant}`;
    })
    .join(", ");
}

function getRecipeStatusText(recipe) {
  if (recipe.researchComplete) return "Research complete";
  if (recipe.questStarted) return "Quest started";
  return "Not discovered";
}

function renderRecipes() {
  const recipes = getRecipes();
  const tableBody = document.getElementById("recipes-table-body");
  const recipeSelect = document.getElementById("recipe-csv-select");

  tableBody.innerHTML = recipes
    .map(
      (recipe) =>
        `<tr><td>${recipe.icon} ${recipe.name}</td><td>${recipe.coins} coins / ${recipe.culture} culture</td><td>${formatRecipeIngredients(recipe)}</td><td>${recipe.discoveryPack || "-"}</td><td>${getRecipeStatusText(recipe)}</td><td><button type="button" onclick="editRecipe('${recipe.id}')">Edit</button><button type="button" onclick="deleteRecipe('${recipe.id}')">Delete</button></td></tr>`,
    )
    .join("");

  recipeSelect.innerHTML = recipes.map((recipe) => `<option value="${recipe.id}">${recipe.name}</option>`).join("");
}

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let insideQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      i++;
    } else if (char === '"') insideQuotes = !insideQuotes;
    else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      }
      if (char === "\r" && nextChar === "\n") i++;
    } else currentCell += char;
  }
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }
  return rows;
}

function normalizeHeader(header) {
  return header.trim().toLowerCase();
}

function importRecipeDiscoveryPack(event) {
  const file = event.target.files[0];
  const message = document.getElementById("recipe-csv-message");
  const recipe = findRecipe(document.getElementById("recipe-csv-select").value);
  if (!file || !recipe) return;

  const reader = new FileReader();
  reader.onload = function (loadEvent) {
    const rows = parseCSV(loadEvent.target.result);
    if (rows.length < 2) {
      message.textContent = "This CSV does not appear to have vocabulary rows.";
      return;
    }

    const headers = rows[0].map(normalizeHeader);
    const state = getState();
    let addedCount = 0;
    let updatedCount = 0;

    rows.slice(1).forEach((row) => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index] ? row[index].trim() : "";
      });
      if (!rowData.word || !rowData.meaning) return;

      const importedWord = {
        language: rowData.language || "Taiwan Mandarin",
        word: rowData.word || "",
        pronunciation: rowData.pronunciation || "",
        tonePractice: rowData["tone practice"] || "",
        toneDistractor1: rowData["tone distractor 1"] || "",
        toneDistractor2: rowData["tone distractor 2"] || "",
        toneDistractor3: rowData["tone distractor 3"] || "",
        meaning: rowData.meaning || "",
        example: rowData["example sentence"] || "",
        examplePronunciation: rowData["sentence pronunciation"] || rowData["pronunciation sentence"] || "",
        exampleMeaning: rowData["sentence meaning"] || "",
        level: rowData.level || "Discovery",
        group: rowData.group || "recipe",
        tag: rowData.tag || recipe.id,
        pack: recipe.discoveryPack || `${recipe.name} Discovery Pack`,
        notes: rowData.notes || "",
      };

      const existingWord = state.vocab.find(
        (savedWord) => savedWord.word === importedWord.word && savedWord.pack === importedWord.pack,
      );
      if (existingWord) {
        Object.assign(existingWord, importedWord);
        updatedCount++;
      } else {
        state.vocab.push({
          ...importedWord,
          timesStudied: 0,
          correctCount: 0,
          quizCorrectCount: 0,
          quizWrongCount: 0,
          toneCorrectCount: 0,
          toneWrongCount: 0,
          createdAt: new Date().toISOString(),
        });
        addedCount++;
      }
    });

    saveState(state);
    message.textContent = `Discovery Pack import complete: ${addedCount} new, ${updatedCount} updated.`;
    event.target.value = "";
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("recipe-form").addEventListener("submit", saveRecipe);
  document.getElementById("clear-recipe-form-btn").addEventListener("click", clearRecipeForm);
  document.getElementById("add-ingredient-btn").addEventListener("click", () => addIngredientRow());
  document.getElementById("recipe-csv-input").addEventListener("change", importRecipeDiscoveryPack);
  clearRecipeForm();
  renderRecipes();
});
