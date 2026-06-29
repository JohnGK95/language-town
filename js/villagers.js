let selectedVillagerId = null;
let activeConversation = null;

const FARMER_MEI_CONVERSATIONS = {
  greetings: [
    "The soil changes every day. A good farmer learns to listen before acting.",
    "Come, let us practice a little Mandarin before we check the fields.",
    "Every crop has a season, and every word has a use.",
  ],
  questions: {
    1: [
      {
        id: "mei-name",
        question: "你叫什麼名字？",
        pinyin: "Nǐ jiào shénme míngzi?",
        english: "What is your name?",
        correctAnswer: "playerName",
        wrongAnswers: ["農場", "圖書館", "市場"],
      },
      {
        id: "mei-how-are-you",
        question: "你好嗎？",
        pinyin: "Nǐ hǎo ma?",
        english: "How are you?",
        correctAnswer: "很好",
        wrongAnswers: ["米飯", "學校", "木頭"],
      },
      {
        id: "mei-like-rice",
        question: "你喜歡米飯嗎？",
        pinyin: "Nǐ xǐhuān mǐfàn ma?",
        english: "Do you like rice?",
        correctAnswer: "喜歡",
        wrongAnswers: ["圖書館", "三個", "木頭"],
      },
      {
        id: "mei-is-farm",
        question: "這是農場嗎？",
        pinyin: "Zhè shì nóngchǎng ma?",
        english: "Is this a farm?",
        correctAnswer: "是",
        wrongAnswers: ["不是，這是學校", "不是，這是圖書館", "不是，這是市場"],
      },
    ],
    2: [
      {
        id: "mei-plant-today",
        question: "你今天想種什麼？",
        pinyin: "Nǐ jīntiān xiǎng zhòng shénme?",
        english: "What do you want to plant today?",
        correctAnswer: "我想種米",
        wrongAnswers: ["我想蓋圖書館", "我想買鉛筆", "我想開船"],
      },
      {
        id: "mei-scallion-location",
        question: "青蔥在哪裡？",
        pinyin: "Qīngcōng zài nǎlǐ?",
        english: "Where are the scallions?",
        correctAnswer: "青蔥在農場",
        wrongAnswers: ["青蔥在學校", "青蔥在書本裡", "青蔥在船上"],
      },
      {
        id: "mei-farm-count",
        question: "你有幾個農場？",
        pinyin: "Nǐ yǒu jǐ ge nóngchǎng?",
        english: "How many farms do you have?",
        correctAnswer: "dynamicFarmCount",
        wrongAnswers: ["很多本書", "三杯茶", "一座學校"],
      },
      {
        id: "mei-fragrant-crop",
        question: "這個作物很香嗎？",
        pinyin: "Zhège zuòwù hěn xiāng ma?",
        english: "Is this crop fragrant?",
        correctAnswer: "很香",
        wrongAnswers: ["很吵", "很冷", "很高"],
      },
    ],
  },
};

const SHARED_BEGINNER_CONVERSATIONS = {
  greetings: ["Let us practice one small question today."],
  questions: {
    1: [
      {
        id: "shared-name",
        question: "你叫什麼名字？",
        pinyin: "Nǐ jiào shénme míngzi?",
        english: "What is your name?",
        correctAnswer: "playerName",
        wrongAnswers: ["學校", "市場", "木頭"],
      },
      {
        id: "shared-hello",
        question: "你好嗎？",
        pinyin: "Nǐ hǎo ma?",
        english: "How are you?",
        correctAnswer: "很好",
        wrongAnswers: ["鉛筆", "茶杯", "圖書館"],
      },
    ],
  },
};

const VILLAGER_CONVERSATIONS = {
  mayor_elian: {
    greetings: [
      "A town grows through small conversations and steady choices.",
      "Let us practice words that help a community work together.",
    ],
    questions: {
      1: [
        {
          id: "mayor-town-name",
          question: "我們的城鎮叫什麼名字？",
          pinyin: "Wǒmen de chéngzhèn jiào shénme míngzi?",
          english: "What is our town called?",
          correctAnswer: "townName",
          wrongAnswers: ["學校", "圖書館", "市場"],
        },
        {
          id: "mayor-is-town",
          question: "這是城鎮嗎？",
          pinyin: "Zhè shì chéngzhèn ma?",
          english: "Is this a town?",
          correctAnswer: "是",
          wrongAnswers: ["不是，這是鉛筆", "不是，這是書", "不是，這是茶杯"],
        },
      ],
      2: [
        {
          id: "mayor-people-live",
          question: "人們住在哪裡？",
          pinyin: "Rénmen zhù zài nǎlǐ?",
          english: "Where do people live?",
          correctAnswer: "人們住在城鎮裡",
          wrongAnswers: ["人們住在書本裡", "人們住在鉛筆裡", "人們住在茶杯裡"],
        },
        {
          id: "mayor-community",
          question: "城鎮需要什麼？",
          pinyin: "Chéngzhèn xūyào shénme?",
          english: "What does a town need?",
          correctAnswer: "城鎮需要居民",
          wrongAnswers: ["城鎮需要一碗飯", "城鎮需要一支筆", "城鎮需要一杯水"],
        },
      ],
    },
  },
  archivist_mina: {
    greetings: [
      "Every useful word deserves a careful place in the archive.",
      "Let us practice a small question from the shelves today.",
    ],
    questions: {
      1: [
        {
          id: "mina-book",
          question: "這是書嗎？",
          pinyin: "Zhè shì shū ma?",
          english: "Is this a book?",
          correctAnswer: "是",
          wrongAnswers: ["不是，這是杯子", "不是，這是木頭", "不是，這是船"],
        },
        {
          id: "mina-read",
          question: "你看書嗎？",
          pinyin: "Nǐ kàn shū ma?",
          english: "Do you read books?",
          correctAnswer: "我看書",
          wrongAnswers: ["我買木頭", "我開船", "我蓋房子"],
        },
      ],
      2: [
        {
          id: "mina-where-book",
          question: "書在哪裡？",
          pinyin: "Shū zài nǎlǐ?",
          english: "Where is the book?",
          correctAnswer: "書在圖書館",
          wrongAnswers: ["書在茶杯裡", "書在船上", "書在市場"],
        },
        {
          id: "mina-vocab",
          question: "你今天學什麼？",
          pinyin: "Nǐ jīntiān xué shénme?",
          english: "What are you studying today?",
          correctAnswer: "我今天學單字",
          wrongAnswers: ["我今天買木頭", "我今天開船", "我今天蓋房子"],
        },
      ],
    },
  },
  teacher_lian: {
    greetings: [
      "A clear answer begins with careful listening.",
      "Let us practice one simple question with confidence.",
    ],
    questions: {
      1: [
        {
          id: "teacher-speak",
          question: "你會說中文嗎？",
          pinyin: "Nǐ huì shuō Zhōngwén ma?",
          english: "Can you speak Mandarin?",
          correctAnswer: "會",
          wrongAnswers: ["鉛筆", "市場", "木頭"],
        },
        {
          id: "teacher-study",
          question: "你學中文嗎？",
          pinyin: "Nǐ xué Zhōngwén ma?",
          english: "Are you studying Mandarin?",
          correctAnswer: "我學中文",
          wrongAnswers: ["我買木頭", "我開船", "我蓋房子"],
        },
      ],
      2: [
        {
          id: "teacher-pronunciation",
          question: "你想練習什麼？",
          pinyin: "Nǐ xiǎng liànxí shénme?",
          english: "What do you want to practice?",
          correctAnswer: "我想練習發音",
          wrongAnswers: ["我想買木頭", "我想蓋房子", "我想開船"],
        },
        {
          id: "teacher-answer",
          question: "請選正確的答案。",
          pinyin: "Qǐng xuǎn zhèngquè de dá'àn.",
          english: "Please choose the correct answer.",
          correctAnswer: "正確的答案",
          wrongAnswers: ["一杯茶", "一棵樹", "一艘船"],
        },
      ],
    },
  },
  merchant_ren: {
    greetings: [
      "Good trade starts with clear words and fair prices.",
      "A market is easier when you know what to ask for.",
    ],
    questions: {
      1: [
        {
          id: "merchant-money",
          question: "這是錢嗎？",
          pinyin: "Zhè shì qián ma?",
          english: "Is this money?",
          correctAnswer: "是",
          wrongAnswers: ["不是，這是學校", "不是，這是書", "不是，這是船"],
        },
        {
          id: "merchant-market",
          question: "市場在哪裡？",
          pinyin: "Shìchǎng zài nǎlǐ?",
          english: "Where is the market?",
          correctAnswer: "市場在城鎮裡",
          wrongAnswers: ["市場在書本裡", "市場在鉛筆裡", "市場在茶杯裡"],
        },
      ],
      2: [
        {
          id: "merchant-buy",
          question: "你想買什麼？",
          pinyin: "Nǐ xiǎng mǎi shénme?",
          english: "What do you want to buy?",
          correctAnswer: "我想買東西",
          wrongAnswers: ["我想看書", "我想練發音", "我想蓋房子"],
        },
        {
          id: "merchant-sell",
          question: "商人做什麼？",
          pinyin: "Shāngrén zuò shénme?",
          english: "What does a merchant do?",
          correctAnswer: "商人買賣東西",
          wrongAnswers: ["商人教發音", "商人寫書", "商人蓋房子"],
        },
      ],
    },
  },
  foreman_rowan: {
    greetings: [
      "Strong buildings start with steady hands and good materials.",
      "Let us practice the words builders need every day.",
    ],
    questions: {
      1: [
        {
          id: "foreman-wood",
          question: "這是木頭嗎？",
          pinyin: "Zhè shì mùtou ma?",
          english: "Is this wood?",
          correctAnswer: "是",
          wrongAnswers: ["不是，這是茶杯", "不是，這是書", "不是，這是市場"],
        },
        {
          id: "foreman-lumber-mill",
          question: "木材廠在哪裡？",
          pinyin: "Mùcái chǎng zài nǎlǐ?",
          english: "Where is the lumber mill?",
          correctAnswer: "木材廠在城鎮裡",
          wrongAnswers: ["木材廠在書本裡", "木材廠在茶杯裡", "木材廠在鉛筆裡"],
        },
      ],
      2: [
        {
          id: "foreman-need-wood",
          question: "建築需要什麼？",
          pinyin: "Jiànzhú xūyào shénme?",
          english: "What do buildings need?",
          correctAnswer: "建築需要木頭",
          wrongAnswers: ["建築需要一本書", "建築需要一杯茶", "建築需要一支筆"],
        },
        {
          id: "foreman-work",
          question: "工頭做什麼？",
          pinyin: "Gōngtóu zuò shénme?",
          english: "What does a foreman do?",
          correctAnswer: "工頭管理工作",
          wrongAnswers: ["工頭教中文", "工頭寫書", "工頭開船"],
        },
      ],
    },
  },
  builder_tao: {
    greetings: [
      "A good town needs places where people can live and gather.",
      "Measure twice, build once, and practice a little Mandarin in between.",
    ],
    questions: {
      1: [
        {
          id: "builder-house",
          question: "這是房子嗎？",
          pinyin: "Zhè shì fángzi ma?",
          english: "Is this a house?",
          correctAnswer: "是",
          wrongAnswers: ["不是，這是茶杯", "不是，這是書", "不是，這是船"],
        },
        {
          id: "builder-build",
          question: "你想蓋房子嗎？",
          pinyin: "Nǐ xiǎng gài fángzi ma?",
          english: "Do you want to build a house?",
          correctAnswer: "想",
          wrongAnswers: ["書本", "茶杯", "鉛筆"],
        },
      ],
      2: [
        {
          id: "builder-where-live",
          question: "居民住在哪裡？",
          pinyin: "Jūmín zhù zài nǎlǐ?",
          english: "Where do residents live?",
          correctAnswer: "居民住在房子裡",
          wrongAnswers: ["居民住在書本裡", "居民住在茶杯裡", "居民住在鉛筆裡"],
        },
        {
          id: "builder-need-house",
          question: "城鎮需要房子嗎？",
          pinyin: "Chéngzhèn xūyào fángzi ma?",
          english: "Does the town need houses?",
          correctAnswer: "需要",
          wrongAnswers: ["書本", "鉛筆", "茶杯"],
        },
      ],
    },
  },
};
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

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function getVillagerConversationContent(villager) {
  if (villager.id === "farmer_mei") return FARMER_MEI_CONVERSATIONS;
  return VILLAGER_CONVERSATIONS[villager.id] || SHARED_BEGINNER_CONVERSATIONS;
}

function getConversationQuestionPool(villager) {
  const content = getVillagerConversationContent(villager);
  const level = Math.min(villager.relationshipLevel || 1, 2);

  return content.questions[level] || content.questions[1] || [];
}

function resolveConversationAnswer(answer, state) {
  if (answer === "playerName") return state.player?.name || "Player";
  if (answer === "townName") return state.townName || "Language Town";
  if (answer === "dynamicFarmCount") {
    const count = (state.village?.placedItems || []).filter(
      (item) => item.type === "farm",
    ).length;
    return `${count} 個農場`;
  }
  return answer;
}

function buildConversationQuestion(villager, state) {
  const pool = getConversationQuestionPool(villager);
  const availableQuestions =
    pool.length > 1
      ? pool.filter((question) => question.id !== villager.lastConversationQuestionId)
      : pool;
  const question =
    availableQuestions[Math.floor(Math.random() * availableQuestions.length)] ||
    pool[0];

  if (!question) return null;

  const correctAnswer = resolveConversationAnswer(question.correctAnswer, state);
  const wrongAnswers = question.wrongAnswers.map((answer) =>
    resolveConversationAnswer(answer, state),
  );
  const uniqueOptions = [
    { text: correctAnswer, correct: true },
    ...wrongAnswers.map((answer) => ({ text: answer, correct: false })),
  ].filter((option, index, options) => {
    return options.findIndex((entry) => entry.text === option.text) === index;
  });
  const options = shuffleArray(uniqueOptions);

  return {
    ...question,
    correctAnswer,
    options,
  };
}

function getVillagerGreeting(villager) {
  const content = getVillagerConversationContent(villager);
  const greetings = content.greetings || [];

  return greetings[Math.floor(Math.random() * greetings.length)] || villager.dialogue;
}

function getConversationReward(isCorrect, hintLevel) {
  if (!isCorrect) return { relationship: 2, knowledge: 0 };
  if (hintLevel >= 2) return { relationship: 5, knowledge: 1 };
  if (hintLevel === 1) return { relationship: 7, knowledge: 3 };
  return { relationship: 10, knowledge: 5 };
}

function getConversationQuestSnapshot(state, villager) {
  if (villager.id === "farmer_mei") {
    const product = getEligibleLuxuryProducts(state, villager)[0];
    return product ? { type: "farmerLuxury", id: product.id } : null;
  }

  if (villager.id === "mayor_elian") {
    const recipe = getEligibleRecipeQuests(state, villager)[0];
    return recipe ? { type: "mayorRecipe", id: recipe.id } : null;
  }

  return null;
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

function renderFarmerLuxuryQuest(state, farmer, options = {}) {
  const section = document.getElementById("luxury-quest-section");
  if (!section) return;
  section.classList.add("hidden");
  section.innerHTML = "";
  if (!options.allowQuest) return;
  if (!farmer || farmer.id !== "farmer_mei") return;
  const eligibleProducts = getEligibleLuxuryProducts(state, farmer);
  if (eligibleProducts.length === 0) return;
  const product =
    eligibleProducts.find((entry) => entry.id === options.questId) ||
    eligibleProducts[0];
  const paid = product.questStarted;
  const mastered = isDiscoveryPackMastered(state, product);
  section.classList.remove("hidden");
  section.innerHTML = "<hr><h3>Discovery Quest</h3><p>Farmer Mei can help you unlock " + product.luxuryName + ".</p><p>Cost: 100 knowledge. Discovery Pack: " + (product.discoveryPack || "not set") + ".</p>" + (paid ? "<p>Quest started. Master every word in the Discovery Pack to unlock the luxury crop.</p>" : "<button id=\"start-luxury-quest-btn\">Start Quest</button>") + (paid && mastered ? "<button id=\"complete-luxury-quest-btn\">Unlock Luxury Crop</button>" : "");
  const startButton = document.getElementById("start-luxury-quest-btn");
  if (startButton) startButton.addEventListener("click", () => startLuxuryQuest(product.id));
  const completeButton = document.getElementById("complete-luxury-quest-btn");
  if (completeButton) completeButton.addEventListener("click", () => completeLuxuryQuest(product.id));
}

function getEligibleRecipeQuests(state, mayor) {
  return getRecipes(state).filter((recipe) => {
    return (
      !recipe.questStarted &&
      !recipe.researchComplete &&
      canUseNightMarket(state) &&
      (mayor.relationshipLevel || 1) >= 3 &&
      areRecipeIngredientsReady(recipe, state)
    );
  });
}

function renderMayorRecipeQuest(state, mayor, options = {}) {
  const section = document.getElementById("luxury-quest-section");
  if (!section) return;
  section.classList.add("hidden");
  section.innerHTML = "";
  if (!options.allowQuest) return;
  if (!mayor || mayor.id !== "mayor_elian") return;

  const eligibleRecipes = getEligibleRecipeQuests(state, mayor);
  if (eligibleRecipes.length === 0) return;

  const recipe =
    eligibleRecipes.find((entry) => entry.id === options.questId) ||
    eligibleRecipes[0];
  section.classList.remove("hidden");
  section.innerHTML =
    "<hr><h3>Recipe Discovery Quest</h3><p>Mayor Elian can help you discover " +
    recipe.name +
    " for the Night Market.</p><p>Discovery Pack: " +
    (recipe.discoveryPack || "not set") +
    ".</p><button id=\"start-recipe-quest-btn\">Accept Quest</button>";

  const startButton = document.getElementById("start-recipe-quest-btn");
  if (startButton) startButton.addEventListener("click", () => startRecipeQuest(recipe.id));
}

function startRecipeQuest(recipeId) {
  const state = getState();
  const recipe = state.recipes.find((entry) => entry.id === recipeId);
  if (!recipe) return;
  recipe.questStarted = true;
  saveState(state);
  document.getElementById("daily-task-message").textContent =
    "Recipe Discovery Quest started. Master the pack, then complete research in the Night Market.";
  renderMayorRecipeQuest(state, state.villagers.find((person) => person.id === "mayor_elian"), { allowQuest: true });
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
  renderFarmerLuxuryQuest(state, state.villagers.find((person) => person.id === "farmer_mei"), { allowQuest: true });
}

function completeLuxuryQuest(productId) {
  const state = getState();
  const product = state.products.find((entry) => entry.id === productId);
  if (!product || !isDiscoveryPackMastered(state, product)) return;
  product.luxuryUnlocked = true;
  saveState(state);
  document.getElementById("daily-task-message").textContent = product.luxuryName + " is now available on any Farm.";
  renderFarmerLuxuryQuest(state, state.villagers.find((person) => person.id === "farmer_mei"), { allowQuest: true });
}

function renderConversationQuestion(villager, state) {
  const question = buildConversationQuestion(villager, state);
  const optionsContainer = document.getElementById("conversation-options");
  const hintButton = document.getElementById("conversation-hint-btn");

  activeConversation = {
    question,
    hintLevel: 0,
    answered: false,
    quest: getConversationQuestSnapshot(state, villager),
  };

  document.getElementById("conversation-question").textContent =
    question?.question || "你好嗎？";
  document.getElementById("conversation-pinyin").textContent = question?.pinyin || "";
  document.getElementById("conversation-english").textContent = question?.english || "";
  document.getElementById("conversation-pinyin").classList.add("hidden");
  document.getElementById("conversation-english").classList.add("hidden");
  document.getElementById("daily-task-message").textContent = "";

  if (hintButton) {
    hintButton.textContent = "Show Pinyin";
    hintButton.disabled = false;
  }

  optionsContainer.innerHTML = "";

  (question?.options || []).forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.text;
    button.dataset.correct = option.correct ? "true" : "false";
    button.addEventListener("click", () =>
      answerConversationQuestion(option.correct, button),
    );
    optionsContainer.appendChild(button);
  });
}

function showConversationHint() {
  if (!activeConversation || activeConversation.answered) return;

  const pinyin = document.getElementById("conversation-pinyin");
  const english = document.getElementById("conversation-english");
  const hintButton = document.getElementById("conversation-hint-btn");

  if (activeConversation.hintLevel === 0) {
    activeConversation.hintLevel = 1;
    pinyin.classList.remove("hidden");
    hintButton.textContent = "Show English";
    return;
  }

  activeConversation.hintLevel = 2;
  english.classList.remove("hidden");
  hintButton.disabled = true;
}

function renderQuestAfterConversation(state, villager) {
  if (!activeConversation?.quest) return;

  if (activeConversation.quest.type === "mayorRecipe") {
    renderMayorRecipeQuest(state, villager, {
      allowQuest: true,
      questId: activeConversation.quest.id,
    });
    return;
  }

  renderFarmerLuxuryQuest(state, villager, {
    allowQuest: true,
    questId: activeConversation.quest.id,
  });
}

function answerConversationQuestion(isCorrect, selectedButton) {
  if (!selectedVillagerId || !activeConversation || activeConversation.answered) return;

  const state = getState();
  const villager = state.villagers.find((person) => person.id === selectedVillagerId);

  if (!villager) return;

  activeConversation.answered = true;

  document.querySelectorAll("#conversation-options button").forEach((button) => {
    button.disabled = true;
    if (button.dataset.correct === "true") button.classList.add("correct-answer");
  });

  if (!isCorrect && selectedButton) selectedButton.classList.add("wrong-answer");

  const today = getTodayDateString();
  const alreadyRewarded = villager.lastInteractionDate === today;
  const reward = alreadyRewarded
    ? { relationship: 0, knowledge: 0 }
    : getConversationReward(isCorrect, activeConversation.hintLevel);

  if (!alreadyRewarded) {
    villager.lastInteractionDate = today;
    villager.dailyTaskCompleted = true;
    villager.streak += 1;
    villager.lastConversationQuestionId = activeConversation.question?.id || null;
    addRelationshipXP(villager, reward.relationship);
    state.resources.knowledge = (state.resources.knowledge || 0) + reward.knowledge;
    saveState(state);
  }

  const hintText =
    activeConversation.hintLevel >= 2
      ? "with pinyin and English hints"
      : activeConversation.hintLevel === 1
        ? "with a pinyin hint"
        : "without hints";
  const resultText = alreadyRewarded
    ? "You already received today's conversation reward with this villager."
    : isCorrect
      ? `Correct ${hintText}: +${reward.relationship} friendship and +${reward.knowledge} knowledge.`
      : `Not quite: +${reward.relationship} friendship and +0 knowledge.`;

  document.getElementById("daily-task-message").textContent = resultText;
  const hintButton = document.getElementById("conversation-hint-btn");
  if (hintButton) hintButton.disabled = true;

  renderQuestAfterConversation(state, villager);
  renderVillagers();
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
    getVillagerGreeting(villager);
  renderConversationQuestion(villager, state);

  if (villager.id === "mayor_elian") {
    renderMayorRecipeQuest(state, villager);
  } else {
    renderFarmerLuxuryQuest(state, villager);
  }
  document.getElementById("villager-talk-modal").classList.remove("hidden");
}

function closeVillagerTalkModal() {
  selectedVillagerId = null;
  activeConversation = null;
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
    .getElementById("conversation-hint-btn")
    .addEventListener("click", showConversationHint);
});
