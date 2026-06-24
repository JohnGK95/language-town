let editingIndex = null;

function renderVocabTable() {
  const state = getState();
  const tableBody = document.getElementById("vocab-table-body");

  if (!tableBody) return;

  tableBody.innerHTML = "";

  state.vocab.forEach((entry, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.language || ""}</td>
      <td>${entry.word || ""}</td>
      <td>${entry.pronunciation || ""}</td>
      <td>${entry.tonePractice || ""}</td>
      <td>${entry.meaning || ""}</td>
      <td>${entry.level || ""}</td>
      <td>${entry.group || ""}</td>
      <td>${entry.tag || ""}</td>
      <td>${entry.pack || ""}</td>
      <td>
        <button onclick="openEditForm(${index})">Edit</button>
        <button onclick="deleteVocabWord(${index})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function openEditForm(index) {
  const state = getState();
  const entry = state.vocab[index];

  editingIndex = index;

  document.getElementById("edit-language").value = entry.language || "";
  document.getElementById("edit-word").value = entry.word || "";
  document.getElementById("edit-pronunciation").value =
    entry.pronunciation || "";

  document.getElementById("edit-tone-practice").value =
    entry.tonePractice || "";
  document.getElementById("edit-tone-distractor-1").value =
    entry.toneDistractor1 || "";
  document.getElementById("edit-tone-distractor-2").value =
    entry.toneDistractor2 || "";
  document.getElementById("edit-tone-distractor-3").value =
    entry.toneDistractor3 || "";

  document.getElementById("edit-meaning").value = entry.meaning || "";

  document.getElementById("edit-example").value = entry.example || "";
  document.getElementById("edit-example-pronunciation").value =
    entry.examplePronunciation || "";
  document.getElementById("edit-example-meaning").value =
    entry.exampleMeaning || "";

  document.getElementById("edit-level").value = entry.level || "";
  document.getElementById("edit-group").value = entry.group || "";
  document.getElementById("edit-tag").value = entry.tag || "";
  document.getElementById("edit-pack").value = entry.pack || "";

  document.getElementById("edit-notes").value = entry.notes || "";

  document.getElementById("edit-vocab-section").classList.remove("hidden");
}

function saveEditedWord(event) {
  event.preventDefault();

  if (editingIndex === null) return;

  const state = getState();

  state.vocab[editingIndex] = {
    ...state.vocab[editingIndex],

    language: document.getElementById("edit-language").value.trim(),

    word: document.getElementById("edit-word").value.trim(),
    pronunciation: document.getElementById("edit-pronunciation").value.trim(),

    tonePractice: document.getElementById("edit-tone-practice").value.trim(),
    toneDistractor1: document
      .getElementById("edit-tone-distractor-1")
      .value.trim(),
    toneDistractor2: document
      .getElementById("edit-tone-distractor-2")
      .value.trim(),
    toneDistractor3: document
      .getElementById("edit-tone-distractor-3")
      .value.trim(),

    meaning: document.getElementById("edit-meaning").value.trim(),

    example: document.getElementById("edit-example").value.trim(),
    examplePronunciation: document
      .getElementById("edit-example-pronunciation")
      .value.trim(),
    exampleMeaning: document
      .getElementById("edit-example-meaning")
      .value.trim(),

    level: document.getElementById("edit-level").value.trim(),
    group: document.getElementById("edit-group").value.trim(),
    tag: document.getElementById("edit-tag").value.trim(),
    pack: document.getElementById("edit-pack").value.trim(),

    notes: document.getElementById("edit-notes").value.trim(),
  };

  saveState(state);

  editingIndex = null;

  document.getElementById("edit-vocab-form").reset();
  document.getElementById("edit-vocab-section").classList.add("hidden");

  renderVocabTable();
}

function cancelEdit() {
  editingIndex = null;

  document.getElementById("edit-vocab-form").reset();
  document.getElementById("edit-vocab-section").classList.add("hidden");
}

function addVocabWord(event) {
  event.preventDefault();

  const state = getState();

  const newWord = {
    language: document.getElementById("language").value.trim(),

    word: document.getElementById("word").value.trim(),
    pronunciation: document.getElementById("pronunciation").value.trim(),

    tonePractice: document.getElementById("tone-practice").value.trim(),
    toneDistractor1: document.getElementById("tone-distractor-1").value.trim(),
    toneDistractor2: document.getElementById("tone-distractor-2").value.trim(),
    toneDistractor3: document.getElementById("tone-distractor-3").value.trim(),

    meaning: document.getElementById("meaning").value.trim(),

    example: document.getElementById("example").value.trim(),
    examplePronunciation: document
      .getElementById("example-pronunciation")
      .value.trim(),
    exampleMeaning: document.getElementById("example-meaning").value.trim(),

    level: document.getElementById("level").value.trim(),
    group: document.getElementById("group").value.trim(),
    tag: document.getElementById("tag").value.trim(),
    pack: document.getElementById("pack").value.trim(),

    notes: document.getElementById("notes").value.trim(),

    timesStudied: 0,
    correctCount: 0,
    quizCorrectCount: 0,
    quizWrongCount: 0,
    createdAt: new Date().toISOString(),
  };

  state.vocab.push(newWord);

  saveState(state);

  document.getElementById("vocab-form").reset();

  renderVocabTable();
}

function deleteVocabWord(index) {
  const state = getState();

  state.vocab.splice(index, 1);

  saveState(state);

  renderVocabTable();
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
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      }

      if (char === "\r" && nextChar === "\n") {
        i++;
      }
    } else {
      currentCell += char;
    }
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

function importCSV(event) {
  const file = event.target.files[0];
  const message = document.getElementById("import-message");

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const csvText = e.target.result;
    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      message.textContent =
        "This CSV does not appear to have any vocabulary rows.";
      return;
    }

    const headers = rows[0].map(normalizeHeader);
    const dataRows = rows.slice(1);

    const state = getState();

    let addedCount = 0;
    let updatedCount = 0;

    dataRows.forEach((row) => {
      const rowData = {};

      headers.forEach((header, index) => {
        rowData[header] = row[index] ? row[index].trim() : "";
      });

      if (!rowData.word || !rowData.meaning) return;

      const importedWord = {
        language: rowData.language || "",

        word: rowData.word || "",
        pronunciation: rowData.pronunciation || "",

        tonePractice: rowData["tone practice"] || "",
        toneDistractor1: rowData["tone distractor 1"] || "",
        toneDistractor2: rowData["tone distractor 2"] || "",
        toneDistractor3: rowData["tone distractor 3"] || "",

        meaning: rowData.meaning || "",

        example: rowData["example sentence"] || "",
        examplePronunciation:
          rowData["sentence pronunciation"] ||
          rowData["pronunciation sentence"] ||
          "",

        exampleMeaning: rowData["sentence meaning"] || "",

        level: rowData.level || "",
        group: rowData.group || "",
        tag: rowData.tag || "",
        pack: rowData.pack || "",

        notes: rowData.notes || "",
      };

      const existingWord = state.vocab.find((savedWord) => {
        return savedWord.word === importedWord.word;
      });

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

          createdAt: new Date().toISOString(),
        });

        addedCount++;
      }
    });

    saveState(state);
    renderVocabTable();

    message.textContent = `Import complete: ${addedCount} new word(s), ${updatedCount} updated word(s).`;

    event.target.value = "";
  };

  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("vocab-form");
  const editForm = document.getElementById("edit-vocab-form");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  const csvInput = document.getElementById("csv-file-input");

  if (form) form.addEventListener("submit", addVocabWord);
  if (editForm) editForm.addEventListener("submit", saveEditedWord);
  if (cancelEditBtn) cancelEditBtn.addEventListener("click", cancelEdit);
  if (csvInput) csvInput.addEventListener("change", importCSV);

  renderVocabTable();
});
