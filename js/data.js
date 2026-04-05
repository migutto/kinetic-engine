// ═══════════════════════════════════════════════════════════════
// THE KINETIC ENGINE — data.js
// Stałe danych (plan, poradnik), stan aplikacji, localStorage
// ═══════════════════════════════════════════════════════════════

// ── PLAN TRENINGOWY ─────────────────────────────────────────────
const PLAN = {
  A: {
    name: 'Dzień A', subtitle: 'Klatka + Plecy', color: 'var(--p)', weekday: 0,
    exercises: [
      { n: 'Pompki na podwyższeniu',             sets: 3, reps: '6–12',   weight: false, icon: '🤸' },
      { n: 'Wiosłowanie jednorącz z podparciem', sets: 3, reps: '8–15',   weight: true,  note: '/strona', icon: '💪' },
      { n: 'Goblet squat do krzesła',            sets: 3, reps: '8–12',   weight: true,  icon: '🏋️' },
      { n: 'Wyciskanie hantli na podłodze',      sets: 3, reps: '8–12',   weight: true,  icon: '💪' },
      { n: 'Uginanie hantli',                    sets: 2, reps: '10–15',  weight: true,  icon: '💪' },
      { n: 'Side plank z kolan',                 sets: 2, reps: '15–30s', weight: false, isTime: true, note: '/strona', icon: '🧘' },
      { n: 'Dead bug',                           sets: 2, reps: '6–10',   weight: false, note: '/strona', icon: '🦗' },
    ]
  },
  B: {
    name: 'Dzień B', subtitle: 'Nogi + Brzuch', color: 'var(--s)', weekday: 2,
    exercises: [
      { n: 'Split squat z podparciem',          sets: 3, reps: '8–12',  weight: false, note: '/noga',   icon: '🦵' },
      { n: 'Wyciskanie hantla jednorącz',        sets: 3, reps: '8–12',  weight: true,  note: '/strona', icon: '💪' },
      { n: 'Wiosłowanie gumą / hantlem',         sets: 3, reps: '10–15', weight: true,  icon: '🏋️' },
      { n: 'Hip thrust / Glute bridge',          sets: 3, reps: '10–20', weight: true,  icon: '🍑' },
      { n: 'Triceps extension / pompki wąskie',  sets: 3, reps: '10–15', weight: false, icon: '💪' },
      { n: 'Bird-dog z pauzą',                   sets: 2, reps: '6–8',   weight: false, note: '/strona', icon: '🐕' },
      { n: 'Pallof press',                       sets: 2, reps: '10–12', weight: false, note: '/strona', icon: '🧘' },
    ]
  },
  C: {
    name: 'Dzień C', subtitle: 'Barki + Ramiona', color: 'var(--td)', weekday: 4,
    exercises: [
      { n: 'Pompki na niższym podwyższeniu',     sets: 3, reps: '6–12',   weight: false, icon: '🤸' },
      { n: 'Step-up',                            sets: 3, reps: '8–12',   weight: false, note: '/noga', icon: '🦵' },
      { n: 'Wyciskanie hantli z pauzą 1s',       sets: 3, reps: '8–12',   weight: true,  icon: '💪' },
      { n: 'Wiosłowanie jednorącz z podparciem', sets: 3, reps: '8–15',   weight: true,  note: '/strona', icon: '💪' },
      { n: 'Unoszenia bokiem',                   sets: 3, reps: '12–20',  weight: true,  icon: '🏋️' },
      { n: 'Hammer curl',                        sets: 2, reps: '10–15',  weight: true,  icon: '💪' },
      { n: 'Dead bug / Side plank',              sets: 2, reps: '2 serie', weight: false, icon: '🧘' },
    ]
  }
};

const BASE_TRAINING_PLAN_ID = 'base-default';
const BASE_PLAN_DAYS = clonePlanDays(PLAN);
const TRAINING_DAY_COLOR_SEQUENCE = ['var(--p)', 'var(--s)', 'var(--td)', 'var(--p)', 'var(--s)', 'var(--td)', 'var(--p)'];
const TRAINING_WEEKDAY_SEQUENCE = [0, 2, 4, 1, 3, 5, 6];

// ── PORADNIK ĆWICZEŃ ────────────────────────────────────────────
const GUIDE_DATA = [
  { id: 'pompki-wyz', name: 'Pompki na Podwyższeniu', cat: 'klatka', level: 'podstawowy', icon: '🤸',
    desc: 'Wersja pompek z rękoma na podwyższeniu. Zmniejsza obciążenie, świetna na start.',
    steps: [
      { t: 'Pozycja wyjściowa', d: 'Połóż dłonie na stabilnym podwyższeniu szerzej niż ramiona. Ciało tworzy prostą linię. Napnij brzuch i pośladki.', tip: { type: 'info', text: 'Im wyżej podwyższenie — tym łatwiej' } },
      { t: 'Opuszczanie (ekscentryka)', d: 'Ugnij łokcie i opuść klatkę piersiową ku powierzchni. Łokcie pod kątem 45° od tułowia.', tip: { type: 'warn', text: 'Nie pozwól biodrku opadać' } },
      { t: 'Powrót (koncentryka)', d: 'Wypchnij się mocno z dłoni do pozycji startowej z wydechem. Napnij klatkę w górze.' }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Klatka piersiowa', d: 'Główny mięsień pracujący przez cały ruch.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Triceps i barki', d: 'Mięśnie synergistyczne aktywne podczas wypychania.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Korpus', d: 'Praca core przez cały czas serii.' }
    ], diff: 1 },

  { id: 'wiosl', name: 'Wiosłowanie Jednorącz', cat: 'plecy', level: 'podstawowy', icon: '🏋️',
    desc: 'Efektywne ćwiczenie na górne plecy. Wymaga jedynie hantla i podparcia.',
    steps: [
      { t: 'Ustawienie', d: 'Oprzyj rękę i kolano o krzesło. Ciało równoległe do podłogi. Hantel swobodnie zwisa.', tip: { type: 'info', text: 'Plecy równoległe do podłogi' } },
      { t: 'Ciągnięcie', d: 'Pociągnij hantel ku biodrowi — łokieć blisko tułowia. Napnij łopatkę przez 1 sekundę.', tip: { type: 'warn', text: 'Nie rotuj tułowia' } },
      { t: 'Powrót', d: 'Powoli opuść do pełnego wyprostu ramienia.' }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Najszerszy grzbietu', d: 'Główny motor ruchu wiosłowania.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Biceps i barki', d: 'Aktywne jako mięśnie synergistyczne.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Stabilizacja', d: 'Unilateralny ruch poprawia balans mięśniowy.' }
    ], diff: 1 },

  { id: 'goblet', name: 'Goblet Squat', cat: 'nogi', level: 'sredni', icon: '🏋️',
    desc: 'Bezpieczny przysiad trzymając hantel przodem. Idealny na mobilność bioder.',
    steps: [
      { t: 'Pozycja wyjściowa', d: 'Trzymaj hantel oburącz na wysokości klatki. Stopy nieco szerzej niż biodra, palce lekko na zewnątrz.', tip: { type: 'info', text: 'Łokcie skieruj w dół' } },
      { t: 'Ruch w dół', d: 'Zacznij od wycofania bioder i schodź w dół. Uda co najmniej równolegle do podłogi.', tip: { type: 'warn', text: 'Utrzymaj proste plecy' } },
      { t: 'Powrót', d: 'Odepchnij się mocno z pięt. Napnij pośladki na górze.' }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Czworogłowe uda', d: 'Główny mięsień przy wstawaniu.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Mobilność bioder', d: 'Zwiększa zakres ruchu w stawach.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Korpus', d: 'Pionowa pozycja wymusza pracę brzucha.' }
    ], diff: 2 },

  { id: 'wycisk-podl', name: 'Wyciskanie Hantli na Podłodze', cat: 'klatka', level: 'podstawowy', icon: '💪',
    desc: 'Bezpieczna alternatywa dla wyciskania na ławce. Chroniona amplituda ruchu.',
    steps: [
      { t: 'Pozycja', d: 'Połóż się na plecach. Hantle nad klatką, łokcie oparte o podłogę.', tip: { type: 'info', text: 'Łokcie opierają się między seriami' } },
      { t: 'Wyciskanie', d: 'Wypchnij hantle ku górze. Zbliż je w górnej fazie. Nie blokuj łokci.' },
      { t: 'Opuszczanie', d: 'Kontrolowanie opuść do dotyku łokci z podłogą.', tip: { type: 'warn', text: 'Nie przeprostowuj poniżej podłogi' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Klatka', d: 'Bezpieczna praca bez ryzyka przeprostu.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Triceps', d: 'Aktywny w fazie prostowania.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Barki', d: 'Ograniczony zakres chroni staw ramienny.' }
    ], diff: 1 },

  { id: 'uginanie', name: 'Uginanie Hantli (Biceps Curl)', cat: 'biceps', level: 'podstawowy', icon: '💪',
    desc: 'Klasyczne ćwiczenie na biceps. Izolowane zgięcie w stawie łokciowym.',
    steps: [
      { t: 'Pozycja', d: 'Stój z hantlami, chwytem supinowanym (dłonie ku górze). Łokcie blisko tułowia.' },
      { t: 'Uginanie', d: 'Ugnij łokcie i unieś hantle ku ramionom. Tylko przedramię pracuje.', tip: { type: 'info', text: 'Napnij biceps na górze' } },
      { t: 'Opuszczanie', d: 'Powoli opuść do pełnego wyprostowania.', tip: { type: 'warn', text: 'Nie bujaj tułowiem' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Biceps brachii', d: 'Izolowane wzmocnienie dwugłowego ramienia.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Brachialis', d: 'Głębszy mięsień pod bicepsem.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Chwyty', d: 'Wzmacnia siłę chwytu przydatną w wiosłowaniu.' }
    ], diff: 1 },

  { id: 'side-plank', name: 'Side Plank z Kolan', cat: 'brzuch', level: 'podstawowy', icon: '🧘',
    desc: 'Boczna stabilizacja tułowia. Wzmacnia mięśnie skośne i stabilizatory bioder.',
    steps: [
      { t: 'Pozycja', d: 'Połóż się na boku z oparciem na łokciu i kolanie. Biodra uniesione — ciało tworzy linię.', tip: { type: 'info', text: 'Kolano ułatwia ćwiczenie' } },
      { t: 'Utrzymanie', d: 'Napnij boczne mięśnie brzucha i trzymaj. Oddychaj spokojnie.' },
      { t: 'Koniec', d: 'Opuść biodra kontrolowanie. Zmień stronę.', tip: { type: 'warn', text: 'Nie pozwól biodrku opadać' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Mięśnie skośne', d: 'Kluczowe dla stabilizacji bocznej kręgosłupa.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Odwodziciele bioder', d: 'Aktywne przy utrzymywaniu pozycji.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Ochrona pleców', d: 'Silny core chroni dolny kręgosłup.' }
    ], diff: 1 },

  { id: 'dead-bug', name: 'Dead Bug', cat: 'brzuch', level: 'podstawowy', icon: '🦗',
    desc: 'Stabilizacja lędźwiowa. Uczy koordynacji i aktywacji mięśni głębokich.',
    steps: [
      { t: 'Pozycja', d: 'Połóż się na plecach. Ramiona ku górze, biodra i kolana 90°. Kręgosłup przy podłodze.', tip: { type: 'info', text: 'Plecy cały czas przy podłodze!' } },
      { t: 'Ruch', d: 'Jednocześnie opuść prawą rękę i lewą nogę. Nie dotykaj podłogi. Zmień stronę.', tip: { type: 'warn', text: 'Nie odrywaj lędźwi' } },
      { t: 'Powrót', d: 'Wróć do pozycji startowej z kontrolą.' }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Głębokie brzucha', d: 'Aktywacja transversus abdominis.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Koordynacja', d: 'Praca naprzemiennych kończyn.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Lędźwie', d: 'Uczy neutralnej pozycji kręgosłupa.' }
    ], diff: 1 },

  { id: 'split-squat', name: 'Split Squat', cat: 'nogi', level: 'sredni', icon: '🦵',
    desc: 'Unilateralny przysiad. Identyfikuje i koryguje asymetrie siłowe.',
    steps: [
      { t: 'Ustawienie', d: 'Jedna noga przed, druga za w szerokim wykroku. Możesz trzymać oparcie krzesła.', tip: { type: 'info', text: 'Stopy jak tory kolejowe' } },
      { t: 'Opadanie', d: 'Opuść tylne kolano ku podłodze. Tułów pionowy lub lekko ku przodowi.' },
      { t: 'Powrót', d: 'Wypchnij się z pięty przedniej nogi.', tip: { type: 'warn', text: 'Kolano nie za bardzo za palcami' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Czworogłowe', d: 'Główny mięsień przy wstawaniu.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Pośladki', d: 'Mocno angażowane w fazie opuszczania.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Balans', d: 'Wykrywa asymetrie mięśniowe.' }
    ], diff: 2 },

  { id: 'hip-thrust', name: 'Hip Thrust / Glute Bridge', cat: 'nogi', level: 'podstawowy', icon: '🍑',
    desc: 'Najefektywniejsze ćwiczenie na pośladki. Izolowana praca gluteus maximus.',
    steps: [
      { t: 'Pozycja', d: 'Połóż się na plecach (glute bridge). Stopy na podłodze, kolana zgięte.', tip: { type: 'info', text: 'Opcjonalnie: hantel na biodrach' } },
      { t: 'Wypchnięcie', d: 'Wypchnij biodra ku górze napinając pośladki. Uda równoległe lub wyżej.', tip: { type: 'warn', text: 'Nie przeprostowuj kręgosłupa' } },
      { t: 'Opuszczanie', d: 'Powoli opuść biodra prawie do podłogi.' }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Pośladki', d: 'Izolowane maksymalne zaangażowanie.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Dwugłowe uda', d: 'Aktywne jako synergisty.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Biodra', d: 'Wzmacnia stabilizatory stawu.' }
    ], diff: 1 },

  { id: 'bird-dog', name: 'Bird-Dog', cat: 'brzuch', level: 'podstawowy', icon: '🐕',
    desc: 'Klasyczne ćwiczenie stabilizacyjne. Wzmacnia mięśnie przykręgosłupowe.',
    steps: [
      { t: 'Pozycja', d: 'Na czworakach: dłonie pod ramionami, kolana pod biodrami. Kręgosłup neutralny.', tip: { type: 'info', text: 'Szklanka wody na plecach — nie rozlej' } },
      { t: 'Ruch', d: 'Wyciągnij prawą rękę i lewą nogę równolegle. Wytrzymaj 3–5 sek.' },
      { t: 'Utrzymanie', d: 'Napnij pośladek wyciągniętej nogi.', tip: { type: 'warn', text: 'Nie rotuj miednicy' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Prostowniki', d: 'Wzmocnienie mięśni wyprostnych pleców.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Koordynacja', d: 'Praca naprzemiennych kończyn.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Lędźwie', d: 'Bezpieczne wzmocnienie core.' }
    ], diff: 1 },

  { id: 'pallof', name: 'Pallof Press', cat: 'brzuch', level: 'sredni', icon: '🧘',
    desc: 'Antyrotacyjne ćwiczenie core z gumą. Trenuje odporność na rotację.',
    steps: [
      { t: 'Ustawienie', d: 'Stań bokiem do gumy na wysokości klatki. Stopy szerzej niż ramiona.', tip: { type: 'info', text: 'Dystans od zaczepu = trudność' } },
      { t: 'Wyciskanie', d: 'Trzymaj gumę przy klatce, wypchnij ramiona przed siebie. Tułów nieruchomy. 2 sekundy.' },
      { t: 'Powrót', d: 'Wróć do klatki z kontrolą. Obróć się na drugą stronę.', tip: { type: 'warn', text: 'Guma nie ciągnie tułowia' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Mięśnie poprzeczne', d: 'Antyrotacja to najfunkcjonalniejsza praca core.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Mięśnie skośne', d: 'Aktywacja w trybie stabilizacyjnym.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Ochrona kręgosłupa', d: 'Silny core antyrotacyjny.' }
    ], diff: 2 },

  { id: 'unoszenia', name: 'Unoszenia Bokiem', cat: 'ramiona', level: 'podstawowy', icon: '🏋️',
    desc: 'Izolowane ćwiczenie na środkową głowę naramiennego. Poszerza sylwetkę.',
    steps: [
      { t: 'Pozycja', d: 'Stój z hantlami po bokach. Tułów lekko pochylony — 5–10° do przodu.', tip: { type: 'info', text: 'Mały ciężar, pełna kontrola' } },
      { t: 'Unoszenie', d: 'Unieś ramiona na boki do poziomu barków. Kciuki lekko w dół.' },
      { t: 'Opuszczanie', d: 'Powoli opuść z pełną kontrolą.', tip: { type: 'warn', text: 'Nie używaj rozmachu' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Środkowa głowa naramiennego', d: 'Izolowana praca tworząca szerokość.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Górny trapez', d: 'Angażowany powyżej barków.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Estetyka', d: 'Szerokie barki to fundament atletycznej sylwetki.' }
    ], diff: 1 },

  { id: 'hammer', name: 'Hammer Curl', cat: 'biceps', level: 'podstawowy', icon: '🔨',
    desc: 'Uginanie z chwytem neutralnym. Wzmacnia brachialis i przedramiona.',
    steps: [
      { t: 'Pozycja', d: 'Stój z hantlami w chwycie neutralnym (kciuki ku górze). Łokcie przy tułowiu.' },
      { t: 'Uginanie', d: 'Ugnij łokcie unosząc hantle. Chwyc neutralny przez cały ruch.', tip: { type: 'info', text: 'Wyobraź sobie że trzymasz młotek' } },
      { t: 'Powrót', d: 'Powoli opuść do wyprostu.', tip: { type: 'warn', text: 'Łokcie przy tułowiu' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Brachialis', d: 'Mięsień pod bicepsem.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Brachioradialis', d: 'Mięsień przedramienia przy chwycie neutralnym.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Siła chwytu', d: 'Klucz do wiosłowania i przysiadów.' }
    ], diff: 1 },

  { id: 'step-up', name: 'Step-Up', cat: 'nogi', level: 'podstawowy', icon: '🦵',
    desc: 'Unilateralne wchodzenie na stopień. Bezpieczne i funkcjonalne.',
    steps: [
      { t: 'Ustawienie', d: 'Stań przed stopniem (ok. 20–30 cm). Stopy równolegle. Opcjonalnie hantle.' },
      { t: 'Wejście', d: 'Postaw stopę na stopniu i wypchnij się z pięty.', tip: { type: 'info', text: 'Wolniej = większa praca mięśni' } },
      { t: 'Zejście', d: 'Powoli opuść tylną stopę z kontrolą.', tip: { type: 'warn', text: 'Schodź z kontrolą, nie skacz' } }
    ],
    benefits: [
      { icon: 'fitness_center', color: 'var(--p)', t: 'Czworogłowe', d: 'Główny mięsień przy wchodzeniu.' },
      { icon: 'accessibility_new', color: 'var(--s)', t: 'Pośladki', d: 'Aktywne przy prostowaniu bioder.' },
      { icon: 'monitoring', color: 'var(--t)', t: 'Balans', d: 'Unilateralny ruch trenuje równowagę.' }
    ], diff: 1 },
];

const GUIDE_CATS = [
  { id: 'all',     label: 'Wszystkie' },
  { id: 'klatka',  label: 'Klatka' },
  { id: 'plecy',   label: 'Plecy' },
  { id: 'nogi',    label: 'Nogi' },
  { id: 'brzuch',  label: 'Brzuch' },
  { id: 'biceps',  label: 'Biceps' },
  { id: 'ramiona', label: 'Ramiona' },
];

const GUIDE_CATEGORY_LABELS = {
  all: 'Wszystkie',
  klatka: 'Klatka',
  plecy: 'Plecy',
  nogi: 'Nogi',
  brzuch: 'Brzuch',
  biceps: 'Biceps',
  ramiona: 'Ramiona',
  inne: 'Inne'
};

const GUIDE_CATEGORY_ICONS = {
  klatka: '🏋️',
  plecy: '🧲',
  nogi: '🦵',
  brzuch: '🧠',
  biceps: '💪',
  ramiona: '🏋️',
  inne: '📚'
};

const AVATARS = ['💪','🏋️','🧗','⚡','🦾','🔥','🏆','👊','🐺','🦁'];

// ── STAN APLIKACJI ──────────────────────────────────────────────
const state = {
  currentTab:        'dashboard',
  currentWeekMonday: null,      // ustawiany w app.js
  activeDayType:     null,
  activeDayDate:     null,
  guideFilter:       'all',
  guideSelected:     null,
  charts:            {}
};

// ── LOCALSTORAGE ────────────────────────────────────────────────
function loadData() {
  try { return JSON.parse(localStorage.getItem('ke_data') || '{}'); }
  catch { return {}; }
}

function saveData(d) {
  syncActiveTrainingPlan(d);
  localStorage.setItem('ke_data', JSON.stringify(d));
}

function getData() {
  const d = loadData();
  if (!d.workouts)      d.workouts      = {};
  if (!d.cardio)        d.cardio        = [];
  if (!d.guideImports)  d.guideImports  = [];
  if (!d.profile)       d.profile       = {
    name: 'Moj Profil',
    avatar: '💪',
    primaryGoal: 'recomp',
    focusNote: '',
    weeklyWorkoutGoal: 3,
    weeklyCardioGoalKm: 10
  };
  if (!d.settings)      d.settings      = { stepGoal: 8000, calGoal: 2500, restDuration: 90, notifTraining: true, notifSteps: true };
  if (!d.notifications) d.notifications = [];
  if (!d.measurements)  d.measurements  = [];
  if (!d.bodyHeight)    d.bodyHeight    = 178;
  if (!d.profile.name) d.profile.name = 'Moj Profil';
  if (!d.profile.avatar) d.profile.avatar = '💪';
  if (!d.profile.primaryGoal) d.profile.primaryGoal = 'recomp';
  if (!('focusNote' in d.profile)) d.profile.focusNote = '';
  if (d.profile.weeklyWorkoutGoal == null) d.profile.weeklyWorkoutGoal = 3;
  if (d.profile.weeklyCardioGoalKm == null) d.profile.weeklyCardioGoalKm = 10;
  if (!Array.isArray(d.guideImports)) d.guideImports = [];
  if (d.guideImportMeta && typeof d.guideImportMeta !== 'object') d.guideImportMeta = null;
  ensureTrainingPlans(d);
  syncActiveTrainingPlan(d);
  return d;
}

function getProfile()  { return getData().profile; }
function getSettings() { return getData().settings; }

function stripGuideHtml(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, '\'')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeGuideStringList(values) {
  return [...new Set((Array.isArray(values) ? values : [])
    .map(value => {
      if (!value) return '';
      if (typeof value === 'string') return stripGuideHtml(value);
      if (typeof value.name === 'string') return stripGuideHtml(value.name);
      if (typeof value.name_en === 'string') return stripGuideHtml(value.name_en);
      return '';
    })
    .filter(Boolean))];
}

function slugifyGuideValue(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function inferGuideCategory(rawCategory, primaryMuscles = [], secondaryMuscles = []) {
  const haystack = [rawCategory, ...primaryMuscles, ...secondaryMuscles].join(' ').toLowerCase();

  if (/(chest|pector)/.test(haystack)) return 'klatka';
  if (/(back|lat|trap|rhomboid|spine|erector)/.test(haystack)) return 'plecy';
  if (/(leg|quad|hamstring|glute|calf|thigh)/.test(haystack)) return 'nogi';
  if (/(ab|core|oblique|rectus|transverse)/.test(haystack)) return 'brzuch';
  if (/(biceps)/.test(haystack)) return 'biceps';
  if (/(shoulder|deltoid|tricep|triceps|arm|forearm)/.test(haystack)) return 'ramiona';
  return 'inne';
}

function normalizeGuideSteps(rawSteps, fallbackName, fallbackDesc) {
  const normalizedSteps = (Array.isArray(rawSteps) ? rawSteps : [])
    .map((step, index) => {
      if (typeof step === 'string') {
        const text = stripGuideHtml(step);
        if (!text) return null;
        return { t: `Krok ${index + 1}`, d: text };
      }

      const title = stripGuideHtml(step?.t || step?.title || `Krok ${index + 1}`);
      const desc = stripGuideHtml(step?.d || step?.description || '');
      if (!title && !desc) return null;

      return {
        t: title || `Krok ${index + 1}`,
        d: desc || title || `Wykonaj cwiczenie ${fallbackName}.`,
        tip: step?.tip && step.tip.text ? {
          type: step.tip.type === 'warn' ? 'warn' : 'info',
          text: stripGuideHtml(step.tip.text)
        } : null
      };
    })
    .filter(Boolean);

  if (normalizedSteps.length) return normalizedSteps;

  return [
    { t: 'Ustawienie', d: fallbackDesc || `Przygotuj pozycje startowa do cwiczenia ${fallbackName}.` },
    { t: 'Ruch', d: `Wykonaj kontrolowany ruch w cwiczeniu ${fallbackName}.` },
    { t: 'Powrot', d: 'Wroc do pozycji startowej z pelna kontrola.' }
  ];
}

function normalizeGuideBenefits(rawBenefits, primaryMuscles = [], secondaryMuscles = [], equipment = []) {
  if (Array.isArray(rawBenefits) && rawBenefits.length) {
    return rawBenefits.slice(0, 3).map((benefit, index) => ({
      icon: benefit?.icon || ['fitness_center', 'accessibility_new', 'monitoring'][index] || 'fitness_center',
      color: benefit?.color || ['var(--p)', 'var(--s)', 'var(--t)'][index] || 'var(--p)',
      t: stripGuideHtml(benefit?.t || benefit?.title || `Korzysc ${index + 1}`),
      d: stripGuideHtml(benefit?.d || benefit?.description || '')
    }));
  }

  const cards = [];

  if (primaryMuscles[0]) {
    cards.push({ icon: 'fitness_center', color: 'var(--p)', t: primaryMuscles[0], d: 'Glowna grupa miesniowa zaangazowana w tym ruchu.' });
  }

  if (secondaryMuscles[0]) {
    cards.push({ icon: 'accessibility_new', color: 'var(--s)', t: secondaryMuscles[0], d: 'Dodatkowa grupa wspierajaca ruch lub stabilizacje.' });
  }

  if (equipment[0]) {
    cards.push({ icon: 'monitoring', color: 'var(--t)', t: equipment[0], d: 'Podstawowy sprzet potrzebny do wykonania cwiczenia.' });
  }

  while (cards.length < 3) {
    cards.push({
      icon: ['fitness_center', 'accessibility_new', 'monitoring'][cards.length],
      color: ['var(--p)', 'var(--s)', 'var(--t)'][cards.length],
      t: ['Technika', 'Kontrola', 'Progres'][cards.length],
      d: [
        'Skup sie na pelnym zakresie ruchu i stabilnej pozycji.',
        'Prowadz kazde powtorzenie spokojnie i bez szarpania.',
        'Dodawaj trudnosc dopiero po opanowaniu techniki.'
      ][cards.length]
    });
  }

  return cards.slice(0, 3);
}

function normalizeGuideExercise(rawExercise, index = 0) {
  const name = stripGuideHtml(rawExercise?.name);
  if (!name) return null;

  const primaryMuscles = normalizeGuideStringList(rawExercise?.primaryMuscles || rawExercise?.muscles);
  const secondaryMuscles = normalizeGuideStringList(rawExercise?.secondaryMuscles || rawExercise?.musclesSecondary);
  const equipment = normalizeGuideStringList(rawExercise?.equipment);
  const cat = rawExercise?.cat || inferGuideCategory(rawExercise?.category, primaryMuscles, secondaryMuscles);
  const desc = stripGuideHtml(rawExercise?.desc || rawExercise?.description || '');
  const level = rawExercise?.level || 'sredni';
  const diff = Math.max(1, Math.min(3, Number(rawExercise?.diff) || (level === 'podstawowy' ? 1 : level === 'zaawansowany' ? 3 : 2)));
  const normalizedId = rawExercise?.id || `${rawExercise?.source || 'guide'}-${slugifyGuideValue(name) || `exercise-${index}`}`;

  return {
    id: normalizedId,
    name,
    cat,
    level,
    icon: rawExercise?.icon || GUIDE_CATEGORY_ICONS[cat] || GUIDE_CATEGORY_ICONS.inne,
    desc: desc || `Cwiczenie ${name} zaimportowane do encyklopedii.`,
    steps: normalizeGuideSteps(rawExercise?.steps, name, desc),
    benefits: normalizeGuideBenefits(rawExercise?.benefits, primaryMuscles, secondaryMuscles, equipment),
    diff,
    aliases: normalizeGuideStringList(rawExercise?.aliases),
    primaryMuscles,
    secondaryMuscles,
    equipment,
    images: normalizeGuideStringList(rawExercise?.images),
    video: stripGuideHtml(rawExercise?.video || ''),
    source: rawExercise?.source || 'local',
    sourceId: rawExercise?.sourceId ?? null
  };
}

function mergeGuideExercises(baseExercises, importedExercises) {
  const merged = [];
  const seen = new Set();

  [...baseExercises, ...importedExercises].forEach((exercise, index) => {
    const normalized = normalizeGuideExercise(exercise, index);
    if (!normalized) return;

    const dedupeKey = slugifyGuideValue(normalized.name) || normalized.id;
    if (seen.has(dedupeKey)) return;

    seen.add(dedupeKey);
    merged.push(normalized);
  });

  return merged;
}

function getGuideData() {
  const data = getData();
  return mergeGuideExercises(GUIDE_DATA, data.guideImports || []);
}

function getGuideCategories() {
  const available = new Set(getGuideData().map(exercise => exercise.cat).filter(Boolean));
  const orderedBase = GUIDE_CATS.filter(category => category.id === 'all' || available.has(category.id));
  const dynamic = [...available]
    .filter(categoryId => !orderedBase.some(category => category.id === categoryId))
    .sort((left, right) => (GUIDE_CATEGORY_LABELS[left] || left).localeCompare(GUIDE_CATEGORY_LABELS[right] || right))
    .map(categoryId => ({
      id: categoryId,
      label: GUIDE_CATEGORY_LABELS[categoryId] || (categoryId.charAt(0).toUpperCase() + categoryId.slice(1))
    }));

  return [orderedBase[0], ...orderedBase.slice(1), ...dynamic].filter(Boolean);
}

function getGuideImportMeta() {
  return getData().guideImportMeta || null;
}

function saveGuideImports(importedExercises, meta = {}) {
  const data = getData();
  data.guideImports = mergeGuideExercises([], Array.isArray(importedExercises) ? importedExercises : []);
  data.guideImportMeta = {
    source: meta.source || 'custom',
    importedAt: meta.importedAt || new Date().toISOString(),
    importedCount: data.guideImports.length,
    totalCount: mergeGuideExercises(GUIDE_DATA, data.guideImports).length
  };
  saveData(data);
  return data.guideImports;
}

function clearGuideImports() {
  const data = getData();
  data.guideImports = [];
  data.guideImportMeta = null;
  saveData(data);
}

function clonePlanDays(days) {
  return JSON.parse(JSON.stringify(days || {}));
}

function normalizePlanDay(day, fallbackType, fallbackIndex = 0) {
  const parsedWeekday = Number(day?.weekday);
  const fallbackWeekday = { A: 0, B: 2, C: 4 }[fallbackType] ?? (TRAINING_WEEKDAY_SEQUENCE[fallbackIndex] ?? Math.min(fallbackIndex, 6));

  return {
    name: day?.name || `Dzien ${fallbackType}`,
    subtitle: day?.subtitle || '',
    color: day?.color || TRAINING_DAY_COLOR_SEQUENCE[fallbackIndex % TRAINING_DAY_COLOR_SEQUENCE.length],
    weekday: Number.isInteger(parsedWeekday) && parsedWeekday >= 0 && parsedWeekday <= 6 ? parsedWeekday : fallbackWeekday,
    exercises: Array.isArray(day?.exercises) ? clonePlanDays(day.exercises) : []
  };
}

function createBaseTrainingPlan() {
  return {
    id: BASE_TRAINING_PLAN_ID,
    name: 'Plan bazowy',
    description: 'Domyslny plan A/B/C',
    isSystem: true,
    days: clonePlanDays(BASE_PLAN_DAYS)
  };
}

function normalizeTrainingPlan(plan, index = 0) {
  const rawDays = plan?.days && typeof plan.days === 'object'
    ? plan.days
    : {
        A: plan?.A || BASE_PLAN_DAYS.A,
        B: plan?.B || BASE_PLAN_DAYS.B,
        C: plan?.C || BASE_PLAN_DAYS.C
      };
  const normalizedDays = {};
  const sourceEntries = Object.entries(rawDays);

  if (!sourceEntries.length) {
    Object.entries(BASE_PLAN_DAYS).forEach(([dayId, day], dayIndex) => {
      normalizedDays[dayId] = normalizePlanDay(day, dayId, dayIndex);
    });
  } else {
    sourceEntries.forEach(([dayId, day], dayIndex) => {
      normalizedDays[dayId] = normalizePlanDay(day, dayId, dayIndex);
    });
  }

  return {
    id: plan?.id || `plan-${Date.now()}-${index}`,
    name: plan?.name || `Plan ${index + 1}`,
    description: plan?.description || '',
    isSystem: plan?.id === BASE_TRAINING_PLAN_ID || !!plan?.isSystem,
    days: normalizedDays
  };
}

function ensureTrainingPlans(data) {
  const rawPlans = Array.isArray(data.trainingPlans) ? data.trainingPlans : [];
  const normalizedPlans = rawPlans.map((plan, index) => normalizeTrainingPlan(plan, index));
  const basePlan = normalizedPlans.find(plan => plan.id === BASE_TRAINING_PLAN_ID);

  if (basePlan) {
    basePlan.isSystem = true;
    basePlan.name = 'Plan bazowy';
    basePlan.description = 'Domyslny plan A/B/C';
    basePlan.days = clonePlanDays(BASE_PLAN_DAYS);
  } else {
    normalizedPlans.unshift(createBaseTrainingPlan());
  }

  data.trainingPlans = normalizedPlans;

  const activeId = data.activeTrainingPlanId;
  if (!activeId || !data.trainingPlans.some(plan => plan.id === activeId)) {
    data.activeTrainingPlanId = BASE_TRAINING_PLAN_ID;
  }
}

function syncActiveTrainingPlan(data) {
  ensureTrainingPlans(data);
  const activePlan = data.trainingPlans.find(plan => plan.id === data.activeTrainingPlanId) || data.trainingPlans[0];

  Object.keys(PLAN).forEach(key => delete PLAN[key]);
  Object.assign(PLAN, clonePlanDays(activePlan.days));

  return activePlan;
}

function getTrainingPlans() {
  return getData().trainingPlans;
}

function getActiveTrainingPlanId() {
  return getData().activeTrainingPlanId;
}

function getActiveTrainingPlan() {
  const data = getData();
  return data.trainingPlans.find(plan => plan.id === data.activeTrainingPlanId) || data.trainingPlans[0];
}

function getOrderedPlanDays(plan = getActiveTrainingPlan()) {
  return Object.entries(plan?.days || {})
    .map(([dayId, day], index) => ({
      id: dayId,
      ...normalizePlanDay(day, dayId, index)
    }))
    .sort((a, b) => a.weekday - b.weekday || a.name.localeCompare(b.name));
}

function getNextAvailableTrainingWeekday(plan = getActiveTrainingPlan()) {
  const usedWeekdays = new Set(getOrderedPlanDays(plan).map(day => day.weekday));
  return TRAINING_WEEKDAY_SEQUENCE.find(weekday => !usedWeekdays.has(weekday)) ?? null;
}

function canUseTrainingPlanWeekday(planId, dayId, weekday) {
  const data = getData();
  const plan = data.trainingPlans.find(item => item.id === planId);
  const normalizedWeekday = Number(weekday);

  if (!plan || !Number.isInteger(normalizedWeekday) || normalizedWeekday < 0 || normalizedWeekday > 6) {
    return false;
  }

  return !Object.entries(plan.days || {}).some(([entryId, day]) =>
    entryId !== dayId && Number(day?.weekday) === normalizedWeekday
  );
}

function setActiveTrainingPlan(planId) {
  const data = getData();
  if (!data.trainingPlans.some(plan => plan.id === planId)) return false;
  data.activeTrainingPlanId = planId;
  saveData(data);
  return true;
}

function createTrainingPlanCopy(name, sourcePlanId = getActiveTrainingPlanId()) {
  const data = getData();
  const sourcePlan = data.trainingPlans.find(plan => plan.id === sourcePlanId) || data.trainingPlans[0];
  const trimmedName = (name || '').trim();
  const nextPlan = {
    id: `plan-${Date.now()}`,
    name: trimmedName || `Plan ${data.trainingPlans.length}`,
    description: '',
    isSystem: false,
    days: clonePlanDays(sourcePlan.days)
  };

  data.trainingPlans.push(nextPlan);
  data.activeTrainingPlanId = nextPlan.id;
  saveData(data);
  return nextPlan;
}

function createTrainingPlanDay(planId) {
  const data = getData();
  const plan = data.trainingPlans.find(item => item.id === planId);
  if (!plan || plan.isSystem) return null;

  const nextWeekday = getNextAvailableTrainingWeekday(plan);
  if (nextWeekday == null) return null;

  const dayIndex = Object.keys(plan.days || {}).length;
  let dayId = `day-${Date.now()}`;
  while (plan.days?.[dayId]) dayId = `day-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  plan.days[dayId] = normalizePlanDay({
    name: `Dzien ${dayIndex + 1}`,
    subtitle: '',
    color: TRAINING_DAY_COLOR_SEQUENCE[dayIndex % TRAINING_DAY_COLOR_SEQUENCE.length],
    weekday: nextWeekday,
    exercises: []
  }, dayId, dayIndex);

  saveData(data);
  return { id: dayId, ...plan.days[dayId] };
}

function renameTrainingPlan(planId, nextName) {
  const data = getData();
  const plan = data.trainingPlans.find(item => item.id === planId);
  if (!plan || plan.isSystem) return false;

  const trimmedName = (nextName || '').trim();
  if (!trimmedName) return false;

  plan.name = trimmedName;
  saveData(data);
  return true;
}

function deleteTrainingPlan(planId) {
  const data = getData();
  const plan = data.trainingPlans.find(item => item.id === planId);
  if (!plan || plan.isSystem) return false;

  data.trainingPlans = data.trainingPlans.filter(item => item.id !== planId);
  if (data.activeTrainingPlanId === planId) {
    data.activeTrainingPlanId = BASE_TRAINING_PLAN_ID;
  }

  saveData(data);
  return true;
}

function deleteTrainingPlanDay(planId, dayId) {
  const data = getData();
  const plan = data.trainingPlans.find(item => item.id === planId);
  if (!plan || plan.isSystem || !plan.days?.[dayId]) return false;
  if (Object.keys(plan.days).length <= 1) return false;

  delete plan.days[dayId];
  saveData(data);
  return true;
}

function updateTrainingPlanDay(planId, dayType, patch) {
  const data = getData();
  const plan = data.trainingPlans.find(item => item.id === planId);
  if (!plan || plan.isSystem || !plan.days?.[dayType]) return false;
  if (patch?.weekday != null && !canUseTrainingPlanWeekday(planId, dayType, patch.weekday)) return false;

  plan.days[dayType] = {
    ...plan.days[dayType],
    ...patch,
    exercises: Array.isArray(patch?.exercises)
      ? clonePlanDays(patch.exercises)
      : clonePlanDays(plan.days[dayType].exercises)
  };

  saveData(data);
  return true;
}

function saveSetting(key, val) {
  const d = getData();
  d.settings[key] = val;
  saveData(d);
}

// ── TAB SWITCHING ───────────────────────────────────────────────
const TAB_TITLES = {
  dashboard: 'Mój Dashboard',
  training:  'Plan Treningowy',
  cardio:    'Cardio i Aktywność',
  guide:     'Encyklopedia Ćwiczeń',
  sylwetka:  'Sylwetka & Kompozycja Ciała'
};

function switchTab(tab) {
  state.currentTab = tab;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n =>
    n.classList.toggle('active', n.dataset.tab === tab)
  );
  document.getElementById('topbar-title').textContent = TAB_TITLES[tab];
  document.getElementById('search-wrap').style.display = tab === 'guide' ? 'block' : 'none';

  if (tab === 'dashboard') renderDashboard();
  if (tab === 'training')  renderTraining();
  if (tab === 'cardio')    renderCardio();
  if (tab === 'guide')     renderGuide();
  if (tab === 'sylwetka')  renderSylwetka();
}
