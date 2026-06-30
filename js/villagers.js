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
        id: "mei-farm-grows",
        question: "農場可以種東西嗎？",
        pinyin: "Nóngchǎng kěyǐ zhòng dōngxi ma?",
        english: "Can farms grow things?",
        correctAnswer: "可以",
        wrongAnswers: ["鉛筆", "茶杯", "圖書館"],
      },
      {
        id: "mei-rice-food",
        question: "米飯是食物嗎？",
        pinyin: "Mǐfàn shì shíwù ma?",
        english: "Is rice food?",
        correctAnswer: "是",
        wrongAnswers: ["鉛筆", "木頭", "船"],
      },
      {
        id: "mei-farmer-work",
        question: "農夫在哪裡工作？",
        pinyin: "Nóngfū zài nǎlǐ gōngzuò?",
        english: "Where does a farmer work?",
        correctAnswer: "農夫在農場工作",
        wrongAnswers: ["農夫在書本裡工作", "農夫在茶杯裡工作", "農夫在鉛筆裡工作"],
      },
      {
        id: "mei-water-crops",
        question: "作物需要水嗎？",
        pinyin: "Zuòwù xūyào shuǐ ma?",
        english: "Do crops need water?",
        correctAnswer: "需要",
        wrongAnswers: ["書本", "市場", "房子"],
      },
      {
        id: "mei-scallion-crop",
        question: "青蔥是作物嗎？",
        pinyin: "Qīngcōng shì zuòwù ma?",
        english: "Are scallions a crop?",
        correctAnswer: "是",
        wrongAnswers: ["不是，青蔥是鉛筆", "不是，青蔥是船", "不是，青蔥是房子"],
      },
      {
        id: "mei-plant-seeds",
        question: "你會種種子嗎？",
        pinyin: "Nǐ huì zhòng zhǒngzi ma?",
        english: "Can you plant seeds?",
        correctAnswer: "會",
        wrongAnswers: ["茶杯", "木頭", "圖書館"],
      },
      {
        id: "mei-word-farm",
        question: "farm 中文怎麼說？",
        pinyin: "farm Zhōngwén zěnme shuō?",
        english: "How do you say \"farm\" in Mandarin?",
        correctAnswer: "農場",
        wrongAnswers: ["圖書館", "茶杯", "鉛筆"],
      },
      {
        id: "mei-word-rice",
        question: "rice 中文怎麼說？",
        pinyin: "rice Zhōngwén zěnme shuō?",
        english: "How do you say \"rice\" in Mandarin?",
        correctAnswer: "米飯",
        wrongAnswers: ["木頭", "市場", "房子"],
      },
      {
        id: "mei-word-scallion",
        question: "scallion 中文怎麼說？",
        pinyin: "scallion Zhōngwén zěnme shuō?",
        english: "How do you say \"scallion\" in Mandarin?",
        correctAnswer: "青蔥",
        wrongAnswers: ["書本", "船", "學校"],
      },
      {
        id: "mei-word-seed",
        question: "seed 中文怎麼說？",
        pinyin: "seed Zhōngwén zěnme shuō?",
        english: "How do you say \"seed\" in Mandarin?",
        correctAnswer: "種子",
        wrongAnswers: ["茶杯", "市場", "圖書館"],
      },
      {
        id: "mei-word-crop",
        question: "crop 中文怎麼說？",
        pinyin: "crop Zhōngwén zěnme shuō?",
        english: "How do you say \"crop\" in Mandarin?",
        correctAnswer: "作物",
        wrongAnswers: ["鉛筆", "房子", "船"],
      },
      {
        id: "mei-feeling-today",
        question: "你今天覺得怎麼樣？",
        pinyin: "Nǐ jīntiān juéde zěnmeyàng?",
        english: "How do you feel today?",
        correctAnswer: "很好",
        wrongAnswers: ["還可以", "不太好", "有一點累"],
        allAnswersCorrect: true,
      },
      {
        id: "mei-want-plant-choice",
        question: "你今天想種什麼？",
        pinyin: "Nǐ jīntiān xiǎng zhòng shénme?",
        english: "What do you want to plant today?",
        correctAnswer: "我想種米",
        wrongAnswers: ["我想種青蔥", "我想種種子", "我想種作物"],
        allAnswersCorrect: true,
      },
      {
        id: "mei-like-food-choice",
        question: "你喜歡哪一種食物？",
        pinyin: "Nǐ xǐhuān nǎ yì zhǒng shíwù?",
        english: "Which food do you like?",
        correctAnswer: "我喜歡米飯",
        wrongAnswers: ["我喜歡青蔥", "我喜歡蔬菜", "我喜歡水果"],
        allAnswersCorrect: true,
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
        id: "mei-fragrant-scallion",
        question: "青蔥香嗎？",
        pinyin: "Qīngcōng xiāng ma?",
        english: "Are scallions fragrant?",
        correctAnswer: "青蔥很香",
        wrongAnswers: ["青蔥很吵", "青蔥很冷", "青蔥很高"],
      },
      {
        id: "mei-harvest-rice",
        question: "收成以後可以做什麼？",
        pinyin: "Shōuchéng yǐhòu kěyǐ zuò shénme?",
        english: "What can you do after harvest?",
        correctAnswer: "可以賣作物",
        wrongAnswers: ["可以讀茶杯", "可以種鉛筆", "可以開書本"],
      },
      {
        id: "mei-field-needs-sun",
        question: "田裡的作物需要陽光嗎？",
        pinyin: "Tián lǐ de zuòwù xūyào yángguāng ma?",
        english: "Do crops in the field need sunlight?",
        correctAnswer: "需要",
        wrongAnswers: ["一艘船", "一本書", "一支筆"],
      },
      {
        id: "mei-ingredient-market",
        question: "食材可以在哪裡賣？",
        pinyin: "Shícái kěyǐ zài nǎlǐ mài?",
        english: "Where can ingredients be sold?",
        correctAnswer: "食材可以在市場賣",
        wrongAnswers: ["食材可以在鉛筆裡賣", "食材可以在茶杯裡賣", "食材可以在書本裡賣"],
      },
      {
        id: "mei-good-soil",
        question: "好土對作物有幫助嗎？",
        pinyin: "Hǎo tǔ duì zuòwù yǒu bāngzhù ma?",
        english: "Does good soil help crops?",
        correctAnswer: "有幫助",
        wrongAnswers: ["會唱歌", "很會開船", "是一本書"],
      },
      {
        id: "mei-taiwan-scallion",
        question: "三星蔥是哪一種食材？",
        pinyin: "Sānxīng cōng shì nǎ yì zhǒng shícái?",
        english: "What kind of ingredient is Sanxing scallion?",
        correctAnswer: "三星蔥是青蔥",
        wrongAnswers: ["三星蔥是茶杯", "三星蔥是房子", "三星蔥是鉛筆"],
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
          id: "mayor-town-residents",
          question: "城鎮有居民嗎？",
          pinyin: "Chéngzhèn yǒu jūmín ma?",
          english: "Does a town have residents?",
          correctAnswer: "有",
          wrongAnswers: ["鉛筆", "茶杯", "書本"],
        },
        {
          id: "mayor-name-town",
          question: "城鎮有名字嗎？",
          pinyin: "Chéngzhèn yǒu míngzi ma?",
          english: "Does a town have a name?",
          correctAnswer: "有",
          wrongAnswers: ["鉛筆", "木頭", "船"],
        },
        {
          id: "mayor-people-town",
          question: "居民住在城鎮裡嗎？",
          pinyin: "Jūmín zhù zài chéngzhèn lǐ ma?",
          english: "Do residents live in the town?",
          correctAnswer: "住在城鎮裡",
          wrongAnswers: ["住在茶杯裡", "住在鉛筆裡", "住在書本裡"],
        },
        {
          id: "mayor-greeting",
          question: "市長會說你好嗎？",
          pinyin: "Shìzhǎng huì shuō nǐ hǎo ma?",
          english: "Can the mayor say hello?",
          correctAnswer: "會",
          wrongAnswers: ["市場", "茶杯", "木頭"],
        },
        {
          id: "mayor-town-big",
          question: "城鎮可以變大嗎？",
          pinyin: "Chéngzhèn kěyǐ biàn dà ma?",
          english: "Can a town become bigger?",
          correctAnswer: "可以",
          wrongAnswers: ["書本", "鉛筆", "飯碗"],
        },
        {
          id: "mayor-night-market-place",
          question: "夜市在城鎮裡嗎？",
          pinyin: "Yèshì zài chéngzhèn lǐ ma?",
          english: "Is the night market in the town?",
          correctAnswer: "在城鎮裡",
          wrongAnswers: ["在茶杯裡", "在鉛筆裡", "在書本裡"],
        },
        {
          id: "mayor-word-town",
          question: "town 中文怎麼說？",
          pinyin: "town Zhōngwén zěnme shuō?",
          english: "How do you say \"town\" in Mandarin?",
          correctAnswer: "城鎮",
          wrongAnswers: ["米飯", "茶杯", "木頭"],
        },
        {
          id: "mayor-word-mayor",
          question: "mayor 中文怎麼說？",
          pinyin: "mayor Zhōngwén zěnme shuō?",
          english: "How do you say \"mayor\" in Mandarin?",
          correctAnswer: "市長",
          wrongAnswers: ["農夫", "鉛筆", "船"],
        },
        {
          id: "mayor-word-resident",
          question: "resident 中文怎麼說？",
          pinyin: "resident Zhōngwén zěnme shuō?",
          english: "How do you say \"resident\" in Mandarin?",
          correctAnswer: "居民",
          wrongAnswers: ["書本", "青蔥", "茶杯"],
        },
        {
          id: "mayor-word-night-market",
          question: "night market 中文怎麼說？",
          pinyin: "night market Zhōngwén zěnme shuō?",
          english: "How do you say \"night market\" in Mandarin?",
          correctAnswer: "夜市",
          wrongAnswers: ["學校", "木頭", "鉛筆"],
        },
      {
        id: "mayor-word-community",
        question: "community 中文怎麼說？",
        pinyin: "community Zhōngwén zěnme shuō?",
        english: "How do you say \"community\" in Mandarin?",
        correctAnswer: "社區",
        wrongAnswers: ["米飯", "茶杯", "船"],
      },
        {
          id: "mayor-feeling-today",
          question: "你今天覺得怎麼樣？",
          pinyin: "Nǐ jīntiān juéde zěnmeyàng?",
          english: "How do you feel today?",
          correctAnswer: "很好",
          wrongAnswers: ["還可以", "有一點忙", "不太好"],
          allAnswersCorrect: true,
        },
        {
          id: "mayor-like-town-place",
          question: "你喜歡城鎮的哪裡？",
          pinyin: "Nǐ xǐhuān chéngzhèn de nǎlǐ?",
          english: "What part of the town do you like?",
          correctAnswer: "我喜歡市中心",
          wrongAnswers: ["我喜歡夜市", "我喜歡市場", "我喜歡公園"],
          allAnswersCorrect: true,
        },
        {
          id: "mayor-help-town-choice",
          question: "你想怎麼幫助城鎮？",
          pinyin: "Nǐ xiǎng zěnme bāngzhù chéngzhèn?",
          english: "How do you want to help the town?",
          correctAnswer: "我想認識居民",
          wrongAnswers: ["我想整理街道", "我想參加活動", "我想支持夜市"],
          allAnswersCorrect: true,
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
        {
          id: "mayor-public-work",
          question: "公共建設對城鎮重要嗎？",
          pinyin: "Gōnggòng jiànshè duì chéngzhèn zhòngyào ma?",
          english: "Are public works important for a town?",
          correctAnswer: "很重要",
          wrongAnswers: ["是茶杯", "是鉛筆", "是一本書"],
        },
        {
          id: "mayor-town-growth",
          question: "城鎮升級以後會怎麼樣？",
          pinyin: "Chéngzhèn shēngjí yǐhòu huì zěnmeyàng?",
          english: "What happens after the town levels up?",
          correctAnswer: "城鎮會更好",
          wrongAnswers: ["城鎮會變成鉛筆", "城鎮會住在茶杯裡", "城鎮會開船"],
        },
        {
          id: "mayor-recipe-quest",
          question: "市長可以介紹新食譜嗎？",
          pinyin: "Shìzhǎng kěyǐ jièshào xīn shípǔ ma?",
          english: "Can the mayor introduce new recipes?",
          correctAnswer: "可以",
          wrongAnswers: ["一支筆", "一本書", "一杯茶"],
        },
        {
          id: "mayor-community-help",
          question: "居民可以幫助城鎮嗎？",
          pinyin: "Jūmín kěyǐ bāngzhù chéngzhèn ma?",
          english: "Can residents help the town?",
          correctAnswer: "可以幫助",
          wrongAnswers: ["可以吃鉛筆", "可以住茶杯", "可以開書本"],
        },
        {
          id: "mayor-night-market-food",
          question: "夜市可以賣食物嗎？",
          pinyin: "Yèshì kěyǐ mài shíwù ma?",
          english: "Can the night market sell food?",
          correctAnswer: "可以賣食物",
          wrongAnswers: ["可以賣月亮", "可以賣鉛筆雨", "可以賣書本船"],
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
          id: "mina-library-books",
          question: "圖書館有書嗎？",
          pinyin: "Túshūguǎn yǒu shū ma?",
          english: "Does the library have books?",
          correctAnswer: "有",
          wrongAnswers: ["沒有，圖書館有船", "沒有，圖書館有木頭", "沒有，圖書館有茶杯"],
        },
        {
          id: "mina-read",
          question: "你看書嗎？",
          pinyin: "Nǐ kàn shū ma?",
          english: "Do you read books?",
          correctAnswer: "我看書",
          wrongAnswers: ["我買木頭", "我開船", "我蓋房子"],
        },
        {
          id: "mina-book-reading",
          question: "書可以閱讀嗎？",
          pinyin: "Shū kěyǐ yuèdú ma?",
          english: "Can books be read?",
          correctAnswer: "可以閱讀",
          wrongAnswers: ["可以開船", "可以住茶杯", "可以種米"],
        },
        {
          id: "mina-word-study",
          question: "單字可以學嗎？",
          pinyin: "Dānzì kěyǐ xué ma?",
          english: "Can vocabulary be studied?",
          correctAnswer: "可以",
          wrongAnswers: ["木頭", "船", "市場"],
        },
        {
          id: "mina-library-quiet",
          question: "圖書館安靜嗎？",
          pinyin: "Túshūguǎn ānjìng ma?",
          english: "Is the library quiet?",
          correctAnswer: "很安靜",
          wrongAnswers: ["很會開船", "很會種米", "很會蓋房子"],
        },
        {
          id: "mina-archive-words",
          question: "檔案館有資料嗎？",
          pinyin: "Dǎng'ànguǎn yǒu zīliào ma?",
          english: "Does the archive have records?",
          correctAnswer: "有資料",
          wrongAnswers: ["有茶杯", "有船", "有木頭"],
        },
        {
          id: "mina-read-today",
          question: "今天要讀書嗎？",
          pinyin: "Jīntiān yào dúshū ma?",
          english: "Will we read today?",
          correctAnswer: "要讀書",
          wrongAnswers: ["要開船", "要買木頭", "要蓋房子"],
        },
        {
          id: "mina-word-book",
          question: "book 中文怎麼說？",
          pinyin: "book Zhōngwén zěnme shuō?",
          english: "How do you say \"book\" in Mandarin?",
          correctAnswer: "書",
          wrongAnswers: ["船", "木頭", "青蔥"],
        },
        {
          id: "mina-word-library",
          question: "library 中文怎麼說？",
          pinyin: "library Zhōngwén zěnme shuō?",
          english: "How do you say \"library\" in Mandarin?",
          correctAnswer: "圖書館",
          wrongAnswers: ["市場", "農場", "茶杯"],
        },
        {
          id: "mina-word-vocabulary",
          question: "vocabulary 中文怎麼說？",
          pinyin: "vocabulary Zhōngwén zěnme shuō?",
          english: "How do you say \"vocabulary\" in Mandarin?",
          correctAnswer: "單字",
          wrongAnswers: ["房子", "米飯", "船"],
        },
        {
          id: "mina-word-archive",
          question: "archive 中文怎麼說？",
          pinyin: "archive Zhōngwén zěnme shuō?",
          english: "How do you say \"archive\" in Mandarin?",
          correctAnswer: "檔案館",
          wrongAnswers: ["農場", "鉛筆", "夜市"],
        },
      {
        id: "mina-word-note",
        question: "note 中文怎麼說？",
        pinyin: "note Zhōngwén zěnme shuō?",
        english: "How do you say \"note\" in Mandarin?",
        correctAnswer: "筆記",
        wrongAnswers: ["茶杯", "木頭", "房子"],
      },
        {
          id: "mina-feeling-today",
          question: "你今天覺得怎麼樣？",
          pinyin: "Nǐ jīntiān juéde zěnmeyàng?",
          english: "How do you feel today?",
          correctAnswer: "很好",
          wrongAnswers: ["還可以", "有一點累", "不太好"],
          allAnswersCorrect: true,
        },
        {
          id: "mina-read-choice",
          question: "你今天想讀什麼？",
          pinyin: "Nǐ jīntiān xiǎng dú shénme?",
          english: "What do you want to read today?",
          correctAnswer: "我想讀書",
          wrongAnswers: ["我想讀筆記", "我想讀單字", "我想讀故事"],
          allAnswersCorrect: true,
        },
        {
          id: "mina-study-time-choice",
          question: "你什麼時候想複習？",
          pinyin: "Nǐ shénme shíhòu xiǎng fùxí?",
          english: "When do you want to review?",
          correctAnswer: "我早上想複習",
          wrongAnswers: ["我中午想複習", "我晚上想複習", "我現在想複習"],
          allAnswersCorrect: true,
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
        {
          id: "mina-review-words",
          question: "複習單字有幫助嗎？",
          pinyin: "Fùxí dānzì yǒu bāngzhù ma?",
          english: "Does reviewing vocabulary help?",
          correctAnswer: "有幫助",
          wrongAnswers: ["會開船", "是茶杯", "是木頭"],
        },
        {
          id: "mina-dictionary-use",
          question: "字典可以查單字嗎？",
          pinyin: "Zìdiǎn kěyǐ chá dānzì ma?",
          english: "Can a dictionary look up vocabulary?",
          correctAnswer: "可以查單字",
          wrongAnswers: ["可以種米", "可以蓋房子", "可以開船"],
        },
        {
          id: "mina-shelf-books",
          question: "書架上通常有什麼？",
          pinyin: "Shūjià shàng tōngcháng yǒu shénme?",
          english: "What is usually on a bookshelf?",
          correctAnswer: "書架上有書",
          wrongAnswers: ["書架上有船", "書架上有田", "書架上有夜市"],
        },
        {
          id: "mina-notes",
          question: "筆記可以幫助記憶嗎？",
          pinyin: "Bǐjì kěyǐ bāngzhù jìyì ma?",
          english: "Can notes help memory?",
          correctAnswer: "可以幫助",
          wrongAnswers: ["可以煮飯", "可以開船", "可以蓋農場"],
        },
        {
          id: "mina-archive-place",
          question: "重要資料應該放在哪裡？",
          pinyin: "Zhòngyào zīliào yīnggāi fàng zài nǎlǐ?",
          english: "Where should important records be kept?",
          correctAnswer: "放在檔案館",
          wrongAnswers: ["放在茶杯裡", "放在鉛筆裡", "放在船上"],
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
        {
          id: "teacher-listen",
          question: "你會聽中文嗎？",
          pinyin: "Nǐ huì tīng Zhōngwén ma?",
          english: "Can you listen to Mandarin?",
          correctAnswer: "會",
          wrongAnswers: ["木頭", "茶杯", "市場"],
        },
        {
          id: "teacher-read",
          question: "你想讀中文嗎？",
          pinyin: "Nǐ xiǎng dú Zhōngwén ma?",
          english: "Do you want to read Mandarin?",
          correctAnswer: "想",
          wrongAnswers: ["鉛筆", "船", "木頭"],
        },
        {
          id: "teacher-tone",
          question: "中文有聲調嗎？",
          pinyin: "Zhōngwén yǒu shēngdiào ma?",
          english: "Does Mandarin have tones?",
          correctAnswer: "有",
          wrongAnswers: ["房子", "茶杯", "市場"],
        },
        {
          id: "teacher-classroom",
          question: "老師在哪裡教書？",
          pinyin: "Lǎoshī zài nǎlǐ jiāoshū?",
          english: "Where does a teacher teach?",
          correctAnswer: "老師在學校教書",
          wrongAnswers: ["老師在茶杯裡教書", "老師在船上教書", "老師在市場裡種米"],
        },
        {
          id: "teacher-practice",
          question: "練習中文重要嗎？",
          pinyin: "Liànxí Zhōngwén zhòngyào ma?",
          english: "Is practicing Mandarin important?",
          correctAnswer: "很重要",
          wrongAnswers: ["是木頭", "是茶杯", "是船"],
        },
        {
          id: "teacher-word-teacher",
          question: "teacher 中文怎麼說？",
          pinyin: "teacher Zhōngwén zěnme shuō?",
          english: "How do you say \"teacher\" in Mandarin?",
          correctAnswer: "老師",
          wrongAnswers: ["市場", "木頭", "茶杯"],
        },
        {
          id: "teacher-word-mandarin",
          question: "Mandarin 中文怎麼說？",
          pinyin: "Mandarin Zhōngwén zěnme shuō?",
          english: "How do you say \"Mandarin\" in Mandarin?",
          correctAnswer: "中文",
          wrongAnswers: ["房子", "船", "米飯"],
        },
        {
          id: "teacher-word-pinyin",
          question: "pinyin 中文怎麼說？",
          pinyin: "pinyin Zhōngwén zěnme shuō?",
          english: "How do you say \"pinyin\" in Mandarin?",
          correctAnswer: "拼音",
          wrongAnswers: ["市場", "青蔥", "木頭"],
        },
        {
          id: "teacher-word-tone",
          question: "tone 中文怎麼說？",
          pinyin: "tone Zhōngwén zěnme shuō?",
          english: "How do you say \"tone\" in Mandarin?",
          correctAnswer: "聲調",
          wrongAnswers: ["茶杯", "農場", "房子"],
        },
      {
        id: "teacher-word-sentence",
        question: "sentence 中文怎麼說？",
        pinyin: "sentence Zhōngwén zěnme shuō?",
        english: "How do you say \"sentence\" in Mandarin?",
        correctAnswer: "句子",
        wrongAnswers: ["船", "市場", "米飯"],
      },
        {
          id: "teacher-feeling-today",
          question: "你今天覺得怎麼樣？",
          pinyin: "Nǐ jīntiān juéde zěnmeyàng?",
          english: "How do you feel today?",
          correctAnswer: "很好",
          wrongAnswers: ["還可以", "有一點緊張", "不太好"],
          allAnswersCorrect: true,
        },
        {
          id: "teacher-practice-choice",
          question: "你今天想練習什麼？",
          pinyin: "Nǐ jīntiān xiǎng liànxí shénme?",
          english: "What do you want to practice today?",
          correctAnswer: "我想練習發音",
          wrongAnswers: ["我想練習聲調", "我想練習拼音", "我想練習句子"],
          allAnswersCorrect: true,
        },
        {
          id: "teacher-study-mood",
          question: "你覺得中文怎麼樣？",
          pinyin: "Nǐ juéde Zhōngwén zěnmeyàng?",
          english: "What do you think of Mandarin?",
          correctAnswer: "很有趣",
          wrongAnswers: ["有一點難", "很好聽", "很重要"],
          allAnswersCorrect: true,
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
        {
          id: "teacher-pinyin",
          question: "拼音可以幫助發音嗎？",
          pinyin: "Pīnyīn kěyǐ bāngzhù fāyīn ma?",
          english: "Can pinyin help pronunciation?",
          correctAnswer: "可以幫助發音",
          wrongAnswers: ["可以蓋房子", "可以買木頭", "可以開船"],
        },
        {
          id: "teacher-character",
          question: "漢字可以用來寫中文嗎？",
          pinyin: "Hànzì kěyǐ yòng lái xiě Zhōngwén ma?",
          english: "Can Chinese characters be used to write Mandarin?",
          correctAnswer: "可以寫中文",
          wrongAnswers: ["可以種米", "可以賣木頭", "可以開船"],
        },
        {
          id: "teacher-question",
          question: "不懂的時候可以問問題嗎？",
          pinyin: "Bù dǒng de shíhòu kěyǐ wèn wèntí ma?",
          english: "Can you ask questions when you do not understand?",
          correctAnswer: "可以問問題",
          wrongAnswers: ["可以吃鉛筆", "可以住茶杯", "可以開書本"],
        },
        {
          id: "teacher-slowly",
          question: "慢慢說可以幫助學習嗎？",
          pinyin: "Màn man shuō kěyǐ bāngzhù xuéxí ma?",
          english: "Can speaking slowly help learning?",
          correctAnswer: "可以幫助學習",
          wrongAnswers: ["可以買市場", "可以喝木頭", "可以種書本"],
        },
        {
          id: "teacher-sentence",
          question: "句子需要意思嗎？",
          pinyin: "Jùzi xūyào yìsi ma?",
          english: "Does a sentence need meaning?",
          correctAnswer: "需要意思",
          wrongAnswers: ["需要一艘船", "需要一杯木頭", "需要一座鉛筆"],
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
          question: "買東西需要錢嗎？",
          pinyin: "Mǎi dōngxi xūyào qián ma?",
          english: "Do you need money to buy things?",
          correctAnswer: "需要",
          wrongAnswers: ["學校", "書本", "船"],
        },
        {
          id: "merchant-market",
          question: "市場在哪裡？",
          pinyin: "Shìchǎng zài nǎlǐ?",
          english: "Where is the market?",
          correctAnswer: "市場在城鎮裡",
          wrongAnswers: ["市場在書本裡", "市場在鉛筆裡", "市場在茶杯裡"],
        },
        {
          id: "merchant-sell-food",
          question: "市場可以賣食物嗎？",
          pinyin: "Shìchǎng kěyǐ mài shíwù ma?",
          english: "Can the market sell food?",
          correctAnswer: "可以",
          wrongAnswers: ["書本", "茶杯", "鉛筆"],
        },
        {
          id: "merchant-coins-use",
          question: "金幣可以買東西嗎？",
          pinyin: "Jīnbì kěyǐ mǎi dōngxi ma?",
          english: "Can coins buy things?",
          correctAnswer: "可以買東西",
          wrongAnswers: ["可以住茶杯", "可以開書本", "可以種鉛筆"],
        },
        {
          id: "merchant-price",
          question: "商品有價格嗎？",
          pinyin: "Shāngpǐn yǒu jiàgé ma?",
          english: "Do goods have prices?",
          correctAnswer: "有價格",
          wrongAnswers: ["有船", "有學校", "有木頭"],
        },
        {
          id: "merchant-buy-rice",
          question: "你可以在市場買米嗎？",
          pinyin: "Nǐ kěyǐ zài shìchǎng mǎi mǐ ma?",
          english: "Can you buy rice at the market?",
          correctAnswer: "可以買米",
          wrongAnswers: ["可以買月亮", "可以買書本雨", "可以買鉛筆船"],
        },
        {
          id: "merchant-shop",
          question: "商店賣東西嗎？",
          pinyin: "Shāngdiàn mài dōngxi ma?",
          english: "Does a shop sell things?",
          correctAnswer: "賣東西",
          wrongAnswers: ["教發音", "蓋房子", "開船"],
        },
        {
          id: "merchant-word-money",
          question: "money 中文怎麼說？",
          pinyin: "money Zhōngwén zěnme shuō?",
          english: "How do you say \"money\" in Mandarin?",
          correctAnswer: "錢",
          wrongAnswers: ["書", "船", "青蔥"],
        },
        {
          id: "merchant-word-market",
          question: "market 中文怎麼說？",
          pinyin: "market Zhōngwén zěnme shuō?",
          english: "How do you say \"market\" in Mandarin?",
          correctAnswer: "市場",
          wrongAnswers: ["學校", "茶杯", "木頭"],
        },
        {
          id: "merchant-word-price",
          question: "price 中文怎麼說？",
          pinyin: "price Zhōngwén zěnme shuō?",
          english: "How do you say \"price\" in Mandarin?",
          correctAnswer: "價格",
          wrongAnswers: ["房子", "米飯", "船"],
        },
        {
          id: "merchant-word-shop",
          question: "shop 中文怎麼說？",
          pinyin: "shop Zhōngwén zěnme shuō?",
          english: "How do you say \"shop\" in Mandarin?",
          correctAnswer: "商店",
          wrongAnswers: ["農場", "圖書館", "鉛筆"],
        },
      {
        id: "merchant-word-goods",
        question: "goods 中文怎麼說？",
        pinyin: "goods Zhōngwén zěnme shuō?",
        english: "How do you say \"goods\" in Mandarin?",
        correctAnswer: "商品",
        wrongAnswers: ["茶杯", "木頭", "老師"],
      },
        {
          id: "merchant-feeling-today",
          question: "你今天覺得怎麼樣？",
          pinyin: "Nǐ jīntiān juéde zěnmeyàng?",
          english: "How do you feel today?",
          correctAnswer: "很好",
          wrongAnswers: ["還可以", "有一點忙", "不太好"],
          allAnswersCorrect: true,
        },
        {
          id: "merchant-buy-choice",
          question: "你今天想買什麼？",
          pinyin: "Nǐ jīntiān xiǎng mǎi shénme?",
          english: "What do you want to buy today?",
          correctAnswer: "我想買米",
          wrongAnswers: ["我想買茶", "我想買水果", "我想買商品"],
          allAnswersCorrect: true,
        },
        {
          id: "merchant-price-feeling",
          question: "你覺得價格怎麼樣？",
          pinyin: "Nǐ juéde jiàgé zěnmeyàng?",
          english: "What do you think of the prices?",
          correctAnswer: "很便宜",
          wrongAnswers: ["還可以", "有一點貴", "很合理"],
          allAnswersCorrect: true,
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
        {
          id: "merchant-fair-price",
          question: "公平的價格重要嗎？",
          pinyin: "Gōngpíng de jiàgé zhòngyào ma?",
          english: "Is a fair price important?",
          correctAnswer: "很重要",
          wrongAnswers: ["是一艘船", "是一杯茶", "是一本書"],
        },
        {
          id: "merchant-sell-crops",
          question: "作物可以賣給誰？",
          pinyin: "Zuòwù kěyǐ mài gěi shéi?",
          english: "Who can crops be sold to?",
          correctAnswer: "可以賣給商人",
          wrongAnswers: ["可以賣給鉛筆", "可以賣給茶杯", "可以賣給書本"],
        },
        {
          id: "merchant-market-busy",
          question: "市場很熱鬧嗎？",
          pinyin: "Shìchǎng hěn rènào ma?",
          english: "Is the market lively?",
          correctAnswer: "很熱鬧",
          wrongAnswers: ["很會開船", "很會睡在鉛筆裡", "很會變成書"],
        },
        {
          id: "merchant-count-coins",
          question: "買東西以前要看什麼？",
          pinyin: "Mǎi dōngxi yǐqián yào kàn shénme?",
          english: "What should you check before buying things?",
          correctAnswer: "要看價格",
          wrongAnswers: ["要看月亮住哪裡", "要看茶杯會不會開船", "要看鉛筆會不會吃飯"],
        },
        {
          id: "merchant-product-value",
          question: "高級商品通常比較貴嗎？",
          pinyin: "Gāojí shāngpǐn tōngcháng bǐjiào guì ma?",
          english: "Are luxury goods usually more expensive?",
          correctAnswer: "通常比較貴",
          wrongAnswers: ["通常是茶杯", "通常住在鉛筆裡", "通常會教中文"],
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
          id: "foreman-build-with-wood",
          question: "木頭可以蓋建築嗎？",
          pinyin: "Mùtou kěyǐ gài jiànzhú ma?",
          english: "Can wood be used to build buildings?",
          correctAnswer: "可以",
          wrongAnswers: ["茶杯", "書本", "市場"],
        },
        {
          id: "foreman-lumber-mill",
          question: "木材廠在哪裡？",
          pinyin: "Mùcái chǎng zài nǎlǐ?",
          english: "Where is the lumber mill?",
          correctAnswer: "木材廠在城鎮裡",
          wrongAnswers: ["木材廠在書本裡", "木材廠在茶杯裡", "木材廠在鉛筆裡"],
        },
        {
          id: "foreman-hammer-tool",
          question: "槌子是工具嗎？",
          pinyin: "Chuízi shì gōngjù ma?",
          english: "Is a hammer a tool?",
          correctAnswer: "是工具",
          wrongAnswers: ["是茶杯", "是書本", "是市場"],
        },
        {
          id: "foreman-build-house",
          question: "工人可以蓋房子嗎？",
          pinyin: "Gōngrén kěyǐ gài fángzi ma?",
          english: "Can workers build houses?",
          correctAnswer: "可以",
          wrongAnswers: ["鉛筆", "茶杯", "書本"],
        },
        {
          id: "foreman-wood-material",
          question: "木頭是材料嗎？",
          pinyin: "Mùtou shì cáiliào ma?",
          english: "Is wood a material?",
          correctAnswer: "是材料",
          wrongAnswers: ["是船長", "是茶杯", "是學校"],
        },
        {
          id: "foreman-upgrade",
          question: "建築可以升級嗎？",
          pinyin: "Jiànzhú kěyǐ shēngjí ma?",
          english: "Can buildings be upgraded?",
          correctAnswer: "可以升級",
          wrongAnswers: ["可以吃飯", "可以住鉛筆", "可以讀茶杯"],
        },
        {
          id: "foreman-worksite",
          question: "工地有工人嗎？",
          pinyin: "Gōngdì yǒu gōngrén ma?",
          english: "Does a worksite have workers?",
          correctAnswer: "有工人",
          wrongAnswers: ["有書本魚", "有茶杯船", "有鉛筆雨"],
        },
        {
          id: "foreman-word-wood",
          question: "wood 中文怎麼說？",
          pinyin: "wood Zhōngwén zěnme shuō?",
          english: "How do you say \"wood\" in Mandarin?",
          correctAnswer: "木頭",
          wrongAnswers: ["米飯", "茶杯", "船"],
        },
        {
          id: "foreman-word-hammer",
          question: "hammer 中文怎麼說？",
          pinyin: "hammer Zhōngwén zěnme shuō?",
          english: "How do you say \"hammer\" in Mandarin?",
          correctAnswer: "槌子",
          wrongAnswers: ["書本", "青蔥", "夜市"],
        },
        {
          id: "foreman-word-tool",
          question: "tool 中文怎麼說？",
          pinyin: "tool Zhōngwén zěnme shuō?",
          english: "How do you say \"tool\" in Mandarin?",
          correctAnswer: "工具",
          wrongAnswers: ["農場", "茶杯", "米飯"],
        },
        {
          id: "foreman-word-worksite",
          question: "worksite 中文怎麼說？",
          pinyin: "worksite Zhōngwén zěnme shuō?",
          english: "How do you say \"worksite\" in Mandarin?",
          correctAnswer: "工地",
          wrongAnswers: ["圖書館", "市場", "船"],
        },
      {
        id: "foreman-word-upgrade",
        question: "upgrade 中文怎麼說？",
        pinyin: "upgrade Zhōngwén zěnme shuō?",
        english: "How do you say \"upgrade\" in Mandarin?",
        correctAnswer: "升級",
        wrongAnswers: ["青蔥", "房子", "茶杯"],
      },
        {
          id: "foreman-feeling-today",
          question: "你今天覺得怎麼樣？",
          pinyin: "Nǐ jīntiān juéde zěnmeyàng?",
          english: "How do you feel today?",
          correctAnswer: "很好",
          wrongAnswers: ["還可以", "有一點累", "不太好"],
          allAnswersCorrect: true,
        },
        {
          id: "foreman-build-choice",
          question: "你今天想蓋什麼？",
          pinyin: "Nǐ jīntiān xiǎng gài shénme?",
          english: "What do you want to build today?",
          correctAnswer: "我想蓋房子",
          wrongAnswers: ["我想蓋農場", "我想蓋商店", "我想蓋學校"],
          allAnswersCorrect: true,
        },
        {
          id: "foreman-tool-choice",
          question: "你想用什麼工具？",
          pinyin: "Nǐ xiǎng yòng shénme gōngjù?",
          english: "What tool do you want to use?",
          correctAnswer: "我想用槌子",
          wrongAnswers: ["我想用鋸子", "我想用尺", "我想用工具箱"],
          allAnswersCorrect: true,
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
        {
          id: "foreman-plan-building",
          question: "蓋建築以前需要計畫嗎？",
          pinyin: "Gài jiànzhú yǐqián xūyào jìhuà ma?",
          english: "Do you need a plan before building?",
          correctAnswer: "需要計畫",
          wrongAnswers: ["需要茶杯唱歌", "需要鉛筆睡覺", "需要書本開船"],
        },
        {
          id: "foreman-strong-building",
          question: "堅固的建築需要好材料嗎？",
          pinyin: "Jiāngù de jiànzhú xūyào hǎo cáiliào ma?",
          english: "Does a strong building need good materials?",
          correctAnswer: "需要好材料",
          wrongAnswers: ["需要一碗月亮", "需要一艘鉛筆", "需要一杯書"],
        },
        {
          id: "foreman-lumber-use",
          question: "木材可以用來做什麼？",
          pinyin: "Mùcái kěyǐ yòng lái zuò shénme?",
          english: "What can lumber be used for?",
          correctAnswer: "可以用來蓋建築",
          wrongAnswers: ["可以用來喝茶", "可以用來開書", "可以用來住鉛筆"],
        },
        {
          id: "foreman-safety",
          question: "工地安全重要嗎？",
          pinyin: "Gōngdì ānquán zhòngyào ma?",
          english: "Is worksite safety important?",
          correctAnswer: "很重要",
          wrongAnswers: ["是市場", "是茶杯", "是一本書"],
        },
        {
          id: "foreman-more-slots",
          question: "建築升級以後容量會增加嗎？",
          pinyin: "Jiànzhú shēngjí yǐhòu róngliàng huì zēngjiā ma?",
          english: "Does capacity increase after a building upgrade?",
          correctAnswer: "會增加",
          wrongAnswers: ["會變成茶杯", "會住進鉛筆", "會開到書裡"],
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
          id: "builder-residents-need-houses",
          question: "居民需要房子嗎？",
          pinyin: "Jūmín xūyào fángzi ma?",
          english: "Do residents need houses?",
          correctAnswer: "需要",
          wrongAnswers: ["茶杯", "書本", "船"],
        },
        {
          id: "builder-build",
          question: "你想蓋房子嗎？",
          pinyin: "Nǐ xiǎng gài fángzi ma?",
          english: "Do you want to build a house?",
          correctAnswer: "想",
          wrongAnswers: ["書本", "茶杯", "鉛筆"],
        },
        {
          id: "builder-house-place",
          question: "房子可以住人嗎？",
          pinyin: "Fángzi kěyǐ zhù rén ma?",
          english: "Can people live in houses?",
          correctAnswer: "可以住人",
          wrongAnswers: ["可以住鉛筆", "可以住茶杯", "可以住船"],
        },
        {
          id: "builder-roof",
          question: "房子有屋頂嗎？",
          pinyin: "Fángzi yǒu wūdǐng ma?",
          english: "Does a house have a roof?",
          correctAnswer: "有屋頂",
          wrongAnswers: ["有米飯", "有船", "有市場"],
        },
        {
          id: "builder-door",
          question: "門在房子上嗎？",
          pinyin: "Mén zài fángzi shàng ma?",
          english: "Is a door on a house?",
          correctAnswer: "在房子上",
          wrongAnswers: ["在茶杯裡", "在鉛筆裡", "在書本裡"],
        },
        {
          id: "builder-home",
          question: "家讓人休息嗎？",
          pinyin: "Jiā ràng rén xiūxí ma?",
          english: "Does a home let people rest?",
          correctAnswer: "讓人休息",
          wrongAnswers: ["讓茶杯開船", "讓鉛筆吃飯", "讓書本種米"],
        },
        {
          id: "builder-town-houses",
          question: "城鎮需要很多房子嗎？",
          pinyin: "Chéngzhèn xūyào hěn duō fángzi ma?",
          english: "Does a town need many houses?",
          correctAnswer: "需要",
          wrongAnswers: ["茶杯", "船", "鉛筆"],
        },
        {
          id: "builder-word-house",
          question: "house 中文怎麼說？",
          pinyin: "house Zhōngwén zěnme shuō?",
          english: "How do you say \"house\" in Mandarin?",
          correctAnswer: "房子",
          wrongAnswers: ["青蔥", "市場", "船"],
        },
        {
          id: "builder-word-door",
          question: "door 中文怎麼說？",
          pinyin: "door Zhōngwén zěnme shuō?",
          english: "How do you say \"door\" in Mandarin?",
          correctAnswer: "門",
          wrongAnswers: ["米飯", "茶杯", "木頭"],
        },
        {
          id: "builder-word-roof",
          question: "roof 中文怎麼說？",
          pinyin: "roof Zhōngwén zěnme shuō?",
          english: "How do you say \"roof\" in Mandarin?",
          correctAnswer: "屋頂",
          wrongAnswers: ["農場", "鉛筆", "船"],
        },
        {
          id: "builder-word-home",
          question: "home 中文怎麼說？",
          pinyin: "home Zhōngwén zěnme shuō?",
          english: "How do you say \"home\" in Mandarin?",
          correctAnswer: "家",
          wrongAnswers: ["夜市", "茶杯", "書本"],
        },
        {
          id: "builder-word-building",
          question: "building 中文怎麼說？",
          pinyin: "building Zhōngwén zěnme shuō?",
          english: "How do you say \"building\" in Mandarin?",
          correctAnswer: "建築",
          wrongAnswers: ["米飯", "青蔥", "船"],
        },
        {
          id: "builder-feeling-today",
          question: "你今天覺得怎麼樣？",
          pinyin: "Nǐ jīntiān juéde zěnmeyàng?",
          english: "How do you feel today?",
          correctAnswer: "很好",
          wrongAnswers: ["還可以", "有一點累", "不太好"],
          allAnswersCorrect: true,
        },
        {
          id: "builder-home-choice",
          question: "你喜歡哪一種房子？",
          pinyin: "Nǐ xǐhuān nǎ yì zhǒng fángzi?",
          english: "What kind of house do you like?",
          correctAnswer: "我喜歡小房子",
          wrongAnswers: ["我喜歡大房子", "我喜歡新房子", "我喜歡漂亮的房子"],
          allAnswersCorrect: true,
        },
        {
          id: "builder-build-choice",
          question: "你今天想蓋什麼？",
          pinyin: "Nǐ jīntiān xiǎng gài shénme?",
          english: "What do you want to build today?",
          correctAnswer: "我想蓋房子",
          wrongAnswers: ["我想蓋商店", "我想蓋學校", "我想蓋夜市"],
          allAnswersCorrect: true,
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
        {
          id: "builder-build-materials",
          question: "蓋房子需要材料嗎？",
          pinyin: "Gài fángzi xūyào cáiliào ma?",
          english: "Do you need materials to build a house?",
          correctAnswer: "需要材料",
          wrongAnswers: ["需要茶杯唱歌", "需要鉛筆睡覺", "需要書本開船"],
        },
        {
          id: "builder-upgrade-house",
          question: "房子升級以後會更好嗎？",
          pinyin: "Fángzi shēngjí yǐhòu huì gèng hǎo ma?",
          english: "Does a house get better after upgrading?",
          correctAnswer: "會更好",
          wrongAnswers: ["會變成茶杯", "會住在鉛筆裡", "會開到書上"],
        },
        {
          id: "builder-new-resident",
          question: "新居民需要住處嗎？",
          pinyin: "Xīn jūmín xūyào zhùchù ma?",
          english: "Does a new resident need a place to live?",
          correctAnswer: "需要住處",
          wrongAnswers: ["需要一艘書", "需要一杯木頭", "需要一支夜市"],
        },
        {
          id: "builder-place-building",
          question: "建築可以放在地圖上嗎？",
          pinyin: "Jiànzhú kěyǐ fàng zài dìtú shàng ma?",
          english: "Can buildings be placed on the map?",
          correctAnswer: "可以放在地圖上",
          wrongAnswers: ["可以放在茶杯裡", "可以放在鉛筆裡", "可以放在書本裡"],
        },
        {
          id: "builder-good-town",
          question: "好的房子會幫助城鎮嗎？",
          pinyin: "Hǎo de fángzi huì bāngzhù chéngzhèn ma?",
          english: "Will good houses help the town?",
          correctAnswer: "會幫助城鎮",
          wrongAnswers: ["會喝茶杯", "會開鉛筆", "會住月亮"],
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
    ...wrongAnswers.map((answer) => ({
      text: answer,
      correct: Boolean(question.allAnswersCorrect),
    })),
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

  villager.lastConversationQuestionId = activeConversation.question?.id || null;

  if (!alreadyRewarded) {
    villager.lastInteractionDate = today;
    villager.dailyTaskCompleted = true;
    villager.streak += 1;
    addRelationshipXP(villager, reward.relationship);
    state.resources.knowledge = (state.resources.knowledge || 0) + reward.knowledge;
  }

  saveState(state);

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
