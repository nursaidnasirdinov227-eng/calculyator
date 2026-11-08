/**
 * Internationalization (i18n) for Cosmic Calculator
 * Supports English ('en') and O'zbekcha ('uz')
 */

export type Language = 'en' | 'uz';

export const translations = {
  en: {
    // Brand & Common
    appName: 'COSMIC CALCULATOR',
    tagline: 'Universal Mathematical Interface',
    precision64: 'PRECISION 64-BIT',
    copy: 'Copy',
    copied: 'Copied',
    insert: 'Insert',
    clearAll: 'Clear All',
    delete: 'DEL',
    allClear: 'AC',
    close: 'Close',
    shortcuts: 'Shortcuts',
    chronicles: 'Chronicles',
    themes: 'Cosmic Themes',
    toggleAudio: 'Toggle Audio Feedback',

    // Navigation
    navHome: 'Home',
    navCalculator: 'Calculator',
    navModes: 'Modes',
    navHistory: 'History',
    navFeatures: 'Features',
    navAbout: 'About',

    // Hero Section
    heroKicker: 'Next-Generation Computational Environment',
    heroTitlePrefix: 'COSMIC',
    heroTitleSuffix: 'CALCULATOR',
    heroSubtitle: 'Beyond Numbers. Beyond Limits.',
    heroDescription:
      'Explore the universe of mathematics with a calculator designed for the future. Seamlessly navigate standard, scientific, programmer, currency, and astronomical unit systems in a luxury glassmorphism cockpit.',
    heroLaunchBtn: 'Launch Calculator',
    heroExploreBtn: 'Explore Features',
    heroStatModes: 'Compute Modes',
    heroStatLogic: 'Programmer Logic',
    heroStatAudio: 'Instant Synthesizer',
    orbitalActive: 'ORBITAL SYMMETRY ACTIVE',

    // Calculator Cockpit
    cockpitTitle: 'COMPUTATIONAL COCKPIT',
    cockpitSubtitle: 'Select an operational mode tailored to your analytical requirements.',
    modeStandard: 'Standard',
    modeScientific: 'Scientific',
    modeProgrammer: 'Programmer',
    modePercentage: 'Percentage',
    modeCurrency: 'Currency',
    modeUnit: 'Unit Convert',

    modeDescStandard: 'Everyday arithmetic & powers',
    modeDescScientific: 'Trig, logs, roots & radian control',
    modeDescProgrammer: 'HEX/DEC/OCT/BIN & 32-bit bitboard',
    modeDescPercentage: 'Ratio, change & margin analysis',
    modeDescCurrency: 'Global exchange rates',
    modeDescUnit: 'Metric, imperial & cosmic scales',

    // Programmer Mode
    bitMatrix: 'BIT TOGGLE MATRIX',
    msbLsb: 'MSB [31] ... LSB [0]',

    // Percentage Mode
    pctTitle1: 'What is X% of Y?',
    pctTitle2: 'Part-to-Whole Ratio',
    pctTitle3: 'Percentage Change (Growth & Decay)',
    pctTitle4: 'Commercial Margin & Markup',
    pctWhatIs: 'What is',
    pctOf: 'of',
    pctIsWhatPctOf: 'is what % of',
    pctFrom: 'From',
    pctTo: 'To',
    pctCost: 'Cost Price ($)',
    pctMarkup: 'Markup (%)',
    pctSellPrice: 'Selling Price',
    pctMargin: 'Gross Margin',

    // Currency Mode
    currTransferAmount: 'Transfer / Convert Amount',
    currFrom: 'From Currency',
    currTo: 'To Currency',
    currConverted: 'Estimated Converted Amount',
    currLastUpdate: 'Last rate update',
    currLiveApi: '● Live ER API',
    currOfflineBase: '● Offline Base',
    currRefresh: 'Refresh exchange rates',

    // Unit Converter
    unitMagnitude: 'Magnitude Value',
    unitFrom: 'From Unit',
    unitTo: 'To Unit',
    unitNormalized: 'Normalized Result',
    catLength: 'Length',
    catWeight: 'Weight',
    catTemp: 'Temperature',
    catArea: 'Area',
    catVolume: 'Volume',
    catTime: 'Time',
    catSpeed: 'Speed',
    catData: 'Data Storage',

    // History Drawer
    histTitle: 'CHRONICLES',
    histEmptyTitle: 'No calculations recorded',
    histEmptyDesc: 'Computations performed in any mode will automatically stream here.',
    histExportJSON: 'Export history JSON',
    histCopyAll: 'Copy all history',
    histClearConfirm: 'Clear all history',

    // Shortcuts Modal
    shortTitle: 'KEYBOARD PROTOCOLS',
    shortDigits: 'Input digits',
    shortDecimal: 'Decimal point',
    shortOps: 'Basic arithmetic operators',
    shortEnter: 'Compute / Evaluate result',
    shortBackspace: 'Delete last character',
    shortEscape: 'All Clear (AC)',
    shortParens: 'Parentheses',
    shortPower: 'Power function (xʸ)',
    shortPercent: 'Percentage',
    shortAcknowledge: 'Acknowledge',

    // Features Section
    featKicker: 'ARCHITECTURAL CAPABILITIES',
    featTitle: 'ENGINEERED FOR THE COSMOS',
    featSubtitle: 'A harmonious union of computational rigor, deep-space aesthetics, and tactile micro-interactions.',
    feat1Title: 'Precision Math Kernel',
    feat1Desc: 'Engineered with high-precision tokenization and Reverse Polish Notation (RPN), eliminating floating-point rounding quirks.',
    feat2Title: 'Haptic Audio Synthesizer',
    feat2Desc: 'Subtle sine and harmonic oscillators synthesize tactile cosmic blips on every keystroke, fully toggleable.',
    feat3Title: '64-Bit Bitboard & Radix',
    feat3Desc: 'Simultaneous HEX, DEC, OCT, and BIN readouts with a clickable 32-bit matrix and bitwise operators.',
    feat4Title: 'Astrophysical Conversions',
    feat4Desc: 'Convert seamlessly across standard laboratory units and cosmic scales, from nanometers to light-years and Astronomical Units.',
    feat5Title: 'Persistent Chronicles',
    feat5Desc: 'Every calculation is logged to session storage with one-click insertion back into your active compute terminal.',
    feat6Title: 'Cosmic Atmosphere & Themes',
    feat6Desc: 'Interactive particle starfield, parallax dust, shooting meteors, and 4 cosmic color profiles.',

    // About Section
    aboutKicker: 'PHILOSOPHY OF COSMIC COMPUTATION',
    aboutTitle: 'MATHEMATICS ACROSS SPACE & TIME',
    aboutDesc: 'Traditional calculators were forged in the era of plastic handhelds and beige office spreadsheets. COSMIC CALCULATOR was architected under a different presumption: that mathematics is the universal language of stellar mechanics, orbital trajectories, and cosmic geometry.',
    aboutCard1Title: 'Deterministic Precision',
    aboutCard1Desc: 'Strict decimal normalization prevents standard IEEE 754 float drift in commercial and engineering evaluations.',
    aboutCard2Title: 'Zero Network Latency',
    aboutCard2Desc: 'Local-first client evaluation executes computations instantly with zero telemetry overhead.',
    aboutConstTitle: 'Physical Constant Reference',
    aboutLightSpeed: 'Speed of Light (c)',
    aboutAU: 'Astronomical Unit (AU)',
    aboutPi: 'Archimedes Constant (π)',
    aboutEuler: "Euler's Number (e)",

    // Footer
    footerCopy: 'Cosmic Calculator. Designed for the Future.',
  },
  uz: {
    // Brand & Common
    appName: 'KOSMIK KALKULYATOR',
    tagline: 'Universal Matematik Interfeys',
    precision64: 'ANIQLIK 64-BIT',
    copy: 'Nusxalash',
    copied: 'Nusxalandi',
    insert: 'Qo‘yish',
    clearAll: 'Barchasini tozalash',
    delete: 'DEL',
    allClear: 'AC',
    close: 'Yopish',
    shortcuts: 'Tugmalar',
    chronicles: 'Solnoma / Tarix',
    themes: 'Kosmik Mavzular',
    toggleAudio: 'Ovoz effektlarini yoqish/o‘chirish',

    // Navigation
    navHome: 'Bosh sahifa',
    navCalculator: 'Kalkulyator',
    navModes: 'Rejimlar',
    navHistory: 'Tarix',
    navFeatures: 'Imkoniyatlar',
    navAbout: 'Haqida',

    // Hero Section
    heroKicker: 'Kelajak Avlod Hisoblash Tizimi',
    heroTitlePrefix: 'KOSMIK',
    heroTitleSuffix: 'KALKULYATOR',
    heroSubtitle: 'Raqamlardan Narida. Chegaralardan Tashqarida.',
    heroDescription:
      'Kelajak uchun loyihalangan kalkulyator bilan matematika olamini kashf eting. Hashamatli shishasimon kosmik kabinada standart, ilmiy, dasturchi, valyuta kursi va astronomik birliklarni bir zumda hisoblang.',
    heroLaunchBtn: 'Kalkulyatorni Ishga Tushirish',
    heroExploreBtn: 'Imkoniyatlarni Ko‘rish',
    heroStatModes: 'Hisob Rejimlari',
    heroStatLogic: 'Dasturchi Mantig‘i',
    heroStatAudio: 'Lahzalik Sintezator',
    orbitalActive: 'ORBITAL SIMMETRIYA FAOL',

    // Calculator Cockpit
    cockpitTitle: 'HISOBLASH KABINASI',
    cockpitSubtitle: 'Tahliliy vazifangizga mos keladigan operatsion rejimni tanlang.',
    modeStandard: 'Standart',
    modeScientific: 'Ilmiy',
    modeProgrammer: 'Dasturchi',
    modePercentage: 'Foizlar',
    modeCurrency: 'Valyuta',
    modeUnit: 'Birliklar',

    modeDescStandard: 'Kundalik arifmetika va darajalar',
    modeDescScientific: 'Trigonometriya, logarifmlar va burchaklar',
    modeDescProgrammer: 'HEX/DEC/OCT/BIN va 32-bitli bitbord',
    modeDescPercentage: 'Nisbat, o‘sish va foyda marjasi',
    modeDescCurrency: 'Dunyo valyutalari kurslari',
    modeDescUnit: 'Metrik, imperial va fazoviy birliklar',

    // Programmer Mode
    bitMatrix: 'BITLARNI BOSHQARISH MATRITSASI',
    msbLsb: 'MSB [31] ... LSB [0]',

    // Percentage Mode
    pctTitle1: 'X sonining Y foizi qancha?',
    pctTitle2: 'Butunga Nisbatan Ulush',
    pctTitle3: 'O‘zgarish Foizi (O‘sish va Pasayish)',
    pctTitle4: 'Tijoriy Marja va Ustama',
    pctWhatIs: 'Qanchasi:',
    pctOf: 'ning',
    pctIsWhatPctOf: 'soni necha % tashkil qiladi:',
    pctFrom: 'Boshlang‘ich',
    pctTo: 'Yangi qiymat',
    pctCost: 'Tan narxi ($)',
    pctMarkup: 'Ustama foizi (%)',
    pctSellPrice: 'Sotuv narxi',
    pctMargin: 'Sof foyda marjasi',

    // Currency Mode
    currTransferAmount: 'Almashtirish miqdori',
    currFrom: 'Qaysi valyutadan',
    currTo: 'Qaysi valyutaga',
    currConverted: 'Natijaviy konvertatsiya summasi',
    currLastUpdate: 'Kurs yangilangan vaqti',
    currLiveApi: '● Jonli Valyuta API',
    currOfflineBase: '● Zaxira Bazasi',
    currRefresh: 'Valyuta kurslarini yangilash',

    // Unit Converter
    unitMagnitude: 'Boshlang‘ich Qiymat',
    unitFrom: 'Qaysi birlikdan',
    unitTo: 'Qaysi birlikka',
    unitNormalized: 'Natijaviy Qiymat',
    catLength: 'Uzunlik',
    catWeight: 'Og‘irlik / Massa',
    catTemp: 'Harorat',
    catArea: 'Maydon',
    catVolume: 'Hajm',
    catTime: 'Vaqt',
    catSpeed: 'Tezlik',
    catData: 'Ma‘lumot hajmi',

    // History Drawer
    histTitle: 'SOLNOMA / TARIX',
    histEmptyTitle: 'Hali hisob-kitoblar mavjud emas',
    histEmptyDesc: 'Har qanday rejimda bajarilgan amallar avtomatik ravishda bu yerda saqlanib boradi.',
    histExportJSON: 'Tarixni JSON sifatida yuklash',
    histCopyAll: 'Barcha tarixni nusxalash',
    histClearConfirm: 'Tarixni tozalash',

    // Shortcuts Modal
    shortTitle: 'KLAVIATURA PROTOKOLLARI',
    shortDigits: 'Raqamlarni kiritish',
    shortDecimal: 'O‘nlik kasr nuqtasi',
    shortOps: 'Asosiy arifmetik amallar',
    shortEnter: 'Hisoblash / Natija chiqarish',
    shortBackspace: 'Oxirgi belgini o‘chirish',
    shortEscape: 'To‘liq tozalash (AC)',
    shortParens: 'Qavslar',
    shortPower: 'Daraja funksiyasi (xʸ)',
    shortPercent: 'Foiz hisoblash',
    shortAcknowledge: 'Tushunarli',

    // Features Section
    featKicker: 'ARXITEKTURA IMKONIYATLARI',
    featTitle: 'KOINOT CHUQURLIKLARI UCHUN YARATILGAN',
    featSubtitle: 'Hisoblash aniqligi, chuqur fazo estetikasi va nozik taktil aloqa uyg‘unligi.',
    feat1Title: 'Oliy Aniqlikdagi Matematik Yadro',
    feat1Desc: 'Reverse Polish Notation (RPN) va maxsus tokenizator yordamida o‘nlik xatoliklar bartaraf etilgan.',
    feat2Title: 'Haptik Audio Sintezatori',
    feat2Desc: 'Har bir tugma bosilganda brauzerning Web Audio API orqali yumshoq kosmik tovushlar hosil qilinadi.',
    feat3Title: '64-Bitli Dasturchi Bitbordi',
    feat3Desc: 'HEX, DEC, OCT va BIN formatlarida bir vaqtda aks ettirish hamda bosiladigan 32-bitli matritsa.',
    feat4Title: 'Astrofizik O‘lchov Birliklari',
    feat4Desc: 'Nanometrlardan tortib, yorug‘lik yillari va Astronomik Birlikkacha (AU) bo‘lgan fazoviy o‘lchovlar.',
    feat5Title: 'Doimiy Solnoma va Tarix',
    feat5Desc: 'Barcha hisob-kitoblar saqlanadi va birgina tugma bilan qayta hisoblash maydoniga joylanadi.',
    feat6Title: 'Kosmik Muhit va Ranglar',
    feat6Desc: 'Interaktiv yulduzlar maydoni, yulduz changlari, uchuvchi meteorlar va 4 xil kosmik ranglar jamlanmasi.',

    // About Section
    aboutKicker: 'KOSMIK HISOBLASH FALSAFASI',
    aboutTitle: 'MAKON VA VAQTDA MATEMATIKA',
    aboutDesc: 'Klassik kalkulyatorlar oddiy plastik asboblar davrida yaratilgan. KOSMIK KALKULYATOR esa butunlay yangicha tushuncha bilan loyihalangan: matematika bu yulduzlar mexanikasi, orbital traektoriyalar va koinotning universal tili hisoblanadi.',
    aboutCard1Title: 'Deterministik Aniqlik',
    aboutCard1Desc: 'Standart IEEE 754 o‘nlik xatoliklarini to‘g‘rilovchi qat‘iy matematik normalizatsiya.',
    aboutCard2Title: 'Mutlaq Nol Kechikish',
    aboutCard2Desc: 'Barcha hisob-kitoblar to‘g‘ridan-to‘g‘ri qurilmangizda lahzalik tezlikda amalga oshiriladi.',
    aboutConstTitle: 'Fizik Doimiylar Jadvali',
    aboutLightSpeed: 'Yorug‘lik Tezligi (c)',
    aboutAU: 'Astronomik Birlik (AU)',
    aboutPi: 'Arximed Doimiysi (π)',
    aboutEuler: 'Eyler Soni (e)',

    // Footer
    footerCopy: 'Kosmik Kalkulyator. Kelajak uchun yaratilgan.',
  },
};

export const getTranslation = (lang: Language) => translations[lang] || translations.en;
