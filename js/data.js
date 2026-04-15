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
function guideSteps(setup, movement, control, warning = '') {
  const steps = [
    { t: 'Ustawienie', d: setup },
    { t: 'Ruch', d: movement },
    { t: 'Kontrola', d: control }
  ];

  if (warning) steps[2].tip = { type: 'warn', text: warning };
  return steps;
}

function guideExercise(exercise) {
  return {
    level: 'podstawowy',
    diff: 1,
    aliases: [],
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: [],
    ...exercise
  };
}

const GUIDE_DATA = [
  guideExercise({ id: 'pompki-wyz', name: 'Pompki na podwyższeniu', cat: 'klatka', icon: '🤸',
    desc: 'Łatwiejszy wariant pompki. Dobry na start albo wtedy, gdy zwykłe pompki psują technikę.',
    aliases: ['incline push-up', 'pompki incline', 'pompka na podwyższeniu'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['triceps', 'przedni akton barków', 'core'], equipment: ['masa ciała', 'stabilne podwyższenie'],
    steps: guideSteps('Oprzyj dłonie na stabilnym podwyższeniu trochę szerzej niż barki. Ustaw ciało w jednej linii.', 'Ugnij łokcie i zejdź klatką w stronę podwyższenia. Łokcie prowadź lekko po skosie.', 'Wypchnij się do góry i utrzymaj napięty brzuch oraz pośladki.', 'Im wyżej ustawisz dłonie, tym łatwiejsze będzie ćwiczenie.') }),
  guideExercise({ id: 'pompki-klasyczne', name: 'Pompki klasyczne', cat: 'klatka', icon: '🤸',
    desc: 'Podstawowy ruch wypychania z masą ciała. Dobrze sprawdza się, jeśli pilnujesz linii tułowia.',
    aliases: ['push-up', 'pushup', 'pompka klasyczna'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['triceps', 'przedni akton barków', 'core'], equipment: ['masa ciała'],
    steps: guideSteps('Ustaw dłonie pod barkami lub trochę szerzej. Stopy oprzyj stabilnie, brzuch napnij przed zejściem.', 'Opuść ciało w jednym kawałku. Klatka idzie w dół, biodra nie zostają z tyłu.', 'Wypchnij podłogę od siebie i zakończ ruch bez zapadania odcinka lędźwiowego.', 'Jeśli biodra opadają, wróć na chwilę do wersji na podwyższeniu.') }),
  guideExercise({ id: 'pompki-kolana', name: 'Pompki na kolanach', cat: 'klatka', icon: '🤸',
    desc: 'Prosty wariant do nauki ruchu wypychania. Przydatny, gdy chcesz zebrać więcej czystych powtórzeń.',
    aliases: ['knee push-up', 'pompki damskie'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['triceps', 'przedni akton barków'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Oprzyj kolana o podłogę i ustaw dłonie trochę szerzej niż barki. Utrzymaj linię od kolan do głowy.', 'Zejdź klatką w stronę podłogi bez wypychania głowy do przodu.', 'Wróć do góry płynnie. Traktuj ten wariant jak pełne ćwiczenie, nie jak skrót.', 'Nie siadaj biodrami do tyłu między powtórzeniami.') }),
  guideExercise({ id: 'pompki-pauza', name: 'Pompki z pauzą', cat: 'klatka', level: 'sredni', diff: 2, icon: '🤸',
    desc: 'Wariant pompki, który ogranicza pośpiech. Pauza pomaga sprawdzić kontrolę na dole ruchu.',
    aliases: ['pause push-up', 'pompki stop'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['triceps', 'core'], equipment: ['masa ciała'],
    steps: guideSteps('Przyjmij pozycję jak do zwykłej pompki. Ustaw napięcie zanim zaczniesz ruch.', 'Zejdź w dół i zatrzymaj się na około sekundę nad podłogą.', 'Wypchnij się do góry bez rozluźniania brzucha w pauzie.', 'Pauza ma być kontrolowana, nie zapadnięta.') }),
  guideExercise({ id: 'pompki-waskie', name: 'Pompki wąskie', cat: 'klatka', level: 'sredni', diff: 2, icon: '🤸',
    desc: 'Pompka z większym udziałem tricepsa. Dobra, gdy chcesz dodać mocniejsze wypychanie bez sprzętu.',
    aliases: ['close grip push-up', 'narrow push-up', 'pompki tricepsowe'],
    primaryMuscles: ['triceps'], secondaryMuscles: ['klatka piersiowa', 'przedni akton barków'], equipment: ['masa ciała'],
    steps: guideSteps('Ustaw dłonie mniej więcej pod barkami. Łokcie trzymaj bliżej tułowia niż w klasycznej pompce.', 'Zejdź w dół, prowadząc łokcie w tył. Nie wciskaj dłoni zbyt blisko siebie, jeśli czujesz nadgarstki.', 'Wypchnij się do pełnej pozycji i utrzymaj spokojne tempo.', 'Jeśli barki uciekają do uszu, zmniejsz zakres albo wybierz wersję na podwyższeniu.') }),
  guideExercise({ id: 'pompki-nogi-podwyzszenie', name: 'Pompki z nogami na podwyższeniu', cat: 'klatka', level: 'sredni', diff: 2, icon: '🤸',
    desc: 'Trudniejszy wariant pompki. Przesuwa akcent w stronę górnej części klatki i barków.',
    aliases: ['decline push-up', 'pompki decline'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['przedni akton barków', 'triceps', 'core'], equipment: ['masa ciała', 'podwyższenie'],
    steps: guideSteps('Oprzyj stopy na stabilnym podwyższeniu. Dłonie ustaw jak do klasycznej pompki.', 'Opuść ciało w kontrolowany sposób, bez łamania pozycji w biodrach.', 'Wypchnij się mocno z dłoni i utrzymaj głowę w przedłużeniu tułowia.', 'Zacznij od niskiego podwyższenia.') }),
  guideExercise({ id: 'wycisk-podl', name: 'Wyciskanie hantli na podłodze', cat: 'klatka', icon: '💪',
    desc: 'Wyciskanie bez ławki. Podłoga ogranicza dolny zakres, więc łatwiej utrzymać spokojny ruch.',
    aliases: ['dumbbell floor press', 'DB floor press'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['triceps', 'przedni akton barków'], equipment: ['hantle', 'podłoga lub mata'],
    steps: guideSteps('Połóż się na plecach, ugnij kolana i ustaw hantle nad klatką. Łokcie startują przy podłodze.', 'Wciśnij hantle w górę po lekko skośnym torze. Nie zderzaj ich na górze.', 'Opuść hantle spokojnie, aż ramiona dotkną podłogi.', 'Nie odbijaj łokci od podłogi.') }),
  guideExercise({ id: 'wycisk-lawka', name: 'Wyciskanie hantli na ławce', cat: 'klatka', level: 'sredni', diff: 2, icon: '💪',
    desc: 'Klasyczne wyciskanie z większym zakresem niż na podłodze. Wymaga stabilnej ławki albo solidnego podparcia.',
    aliases: ['dumbbell bench press', 'DB bench press'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['triceps', 'przedni akton barków'], equipment: ['hantle', 'ławka'],
    steps: guideSteps('Połóż się na ławce i ustaw stopy stabilnie na podłodze. Hantle trzymaj po bokach klatki.', 'Wyciskaj hantle w górę, prowadząc łokcie lekko pod kątem do tułowia.', 'Opuść je do komfortowego zakresu, bez wymuszania głębokiego rozciągnięcia.', 'Zakres ruchu ma być kontrolowany, nie maksymalny za wszelką cenę.') }),
  guideExercise({ id: 'rozpietki-podloga', name: 'Rozpiętki hantlami na podłodze', cat: 'klatka', icon: '💪',
    desc: 'Akcesoryjny ruch na klatkę. Podłoga pomaga ograniczyć zbyt głębokie opuszczanie ramion.',
    aliases: ['floor fly', 'dumbbell floor fly', 'rozpiętki floor'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['przedni akton barków'], equipment: ['hantle', 'podłoga lub mata'],
    steps: guideSteps('Połóż się na plecach i trzymaj hantle nad klatką. Łokcie zostaw lekko ugięte.', 'Rozłóż ramiona na boki do momentu, w którym tricepsy zbliżą się do podłogi.', 'Zamknij ruch, prowadząc hantle nad klatkę. Łokcie zostają w podobnym kącie przez całe powtórzenie.', 'Nie prostuj łokci na siłę.') }),
  guideExercise({ id: 'wycisk-jednoracz-podloga', name: 'Wyciskanie hantla jednorącz na podłodze', cat: 'klatka', icon: '💪',
    desc: 'Wyciskanie jedną ręką. Poza klatką uczy trzymania tułowia bez skręcania.',
    aliases: ['single arm floor press', 'one arm dumbbell floor press'],
    primaryMuscles: ['klatka piersiowa'], secondaryMuscles: ['triceps', 'core'], equipment: ['hantel', 'podłoga lub mata'],
    steps: guideSteps('Połóż się na plecach i trzymaj jeden hantel przy klatce. Drugą rękę połóż na podłodze dla stabilizacji.', 'Wyciskaj hantel nad bark, nie pozwalając tułowiowi obracać się za ciężarem.', 'Opuść hantel do kontaktu ramienia z podłogą i zmień stronę po wykonaniu serii.', 'Jeśli biodra się przekręcają, zmniejsz ciężar.') }),
  guideExercise({ id: 'wiosl', name: 'Wiosłowanie hantlą jednorącz', cat: 'plecy', icon: '🏋️',
    desc: 'Praktyczne ćwiczenie na plecy z jednym hantlem. Podparcie ułatwia skupienie się na pracy łopatki.',
    aliases: ['one arm dumbbell row', 'DB row', 'wiosłowanie jednorącz z podparciem'],
    primaryMuscles: ['najszerszy grzbietu', 'środkowa część pleców'], secondaryMuscles: ['biceps', 'tył barków', 'chwyt'], equipment: ['hantel', 'ławka lub krzesło'],
    steps: guideSteps('Oprzyj dłoń i kolano o stabilne podparcie. Druga ręka trzyma hantel pod barkiem.', 'Pociągnij łokieć w stronę biodra. Najpierw pracuje łopatka, potem ramię.', 'Opuść hantel do pełnego, kontrolowanego wyprostu bez skręcania tułowia.', 'Nie zamieniaj ruchu w szarpanie barkiem.') }),
  guideExercise({ id: 'wiosl-hantle-opad', name: 'Wiosłowanie hantlami w opadzie', cat: 'plecy', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Wariant oburącz dla osób, które potrafią utrzymać stabilny opad tułowia.',
    aliases: ['bent over dumbbell row', 'DB bent row'],
    primaryMuscles: ['środkowa część pleców', 'najszerszy grzbietu'], secondaryMuscles: ['tył barków', 'biceps', 'prostowniki grzbietu'], equipment: ['hantle'],
    steps: guideSteps('Stań z hantlami i cofnij biodra jak do rumuńskiego martwego ciągu. Plecy trzymaj stabilnie.', 'Pociągnij oba łokcie w tył, prowadząc hantle blisko ciała.', 'Opuść hantle bez prostowania tułowia między powtórzeniami.', 'Jeśli nie trzymasz pozycji pleców, wybierz wersję jednorącz z podparciem.') }),
  guideExercise({ id: 'wiosl-guma-siedzac', name: 'Wiosłowanie gumą siedząc', cat: 'plecy', icon: '🧲',
    desc: 'Lekki wariant wiosłowania z gumą. Dobrze pasuje do treningu domowego i rozgrzewki pleców.',
    aliases: ['band seated row', 'seated band row'],
    primaryMuscles: ['środkowa część pleców'], secondaryMuscles: ['najszerszy grzbietu', 'biceps'], equipment: ['guma oporowa'],
    steps: guideSteps('Usiądź z nogami przed sobą i zaczep gumę o stopy albo stabilny punkt. Plecy ustaw prosto.', 'Ściągnij łopatki i przyciągnij gumę w stronę dolnej części żeber.', 'Wróć do wyprostu ramion, ale nie puszczaj napięcia gumy.', 'Nie odchylaj tułowia, żeby dociągnąć ostatnie centymetry.') }),
  guideExercise({ id: 'wiosl-guma-stojac', name: 'Wiosłowanie gumą stojąc', cat: 'plecy', icon: '🧲',
    desc: 'Wiosłowanie przy zaczepionej gumie. Proste do ustawienia, gdy masz drzwi, słupek albo stabilny uchwyt.',
    aliases: ['standing band row', 'band row'],
    primaryMuscles: ['środkowa część pleców'], secondaryMuscles: ['najszerszy grzbietu', 'biceps', 'core'], equipment: ['guma oporowa', 'stabilny zaczep'],
    steps: guideSteps('Stań przodem do zaczepu gumy. Ustaw stopy stabilnie i lekko ugnij kolana.', 'Przyciągnij gumę do tułowia, prowadząc łokcie blisko ciała.', 'Oddaj ramiona do przodu z kontrolą. Tułów zostaje nieruchomy.', 'Zaczep gumę pewnie, zanim zaczniesz serię.') }),
  guideExercise({ id: 'face-pull-guma', name: 'Face pull z gumą', cat: 'plecy', icon: '🧲',
    desc: 'Ruch na tył barków i górę pleców. Przydatny jako lekkie akcesorium po wyciskaniach.',
    aliases: ['band face pull', 'facepull'],
    primaryMuscles: ['tył barków', 'górna część pleców'], secondaryMuscles: ['rotatory barku', 'środkowy trapez'], equipment: ['guma oporowa', 'stabilny zaczep'],
    steps: guideSteps('Zaczep gumę na wysokości twarzy. Chwyć końce i odejdź tak, żeby czuć lekkie napięcie.', 'Przyciągnij gumę w stronę twarzy, rozchodząc łokcie na boki.', 'Wróć spokojnie do wyprostu ramion. Szyja zostaje luźna.', 'To nie jest ćwiczenie na duży ciężar; kontrola ma pierwszeństwo.') }),
  guideExercise({ id: 'sciaganie-gumy-klatka', name: 'Ściąganie gumy do klatki', cat: 'plecy', icon: '🧲',
    desc: 'Domowy zamiennik ruchu ściągania drążka. Daje plecom inny bodziec niż wiosłowanie.',
    aliases: ['band lat pulldown', 'lat pulldown z gumą'],
    primaryMuscles: ['najszerszy grzbietu'], secondaryMuscles: ['biceps', 'dolna część łopatek'], equipment: ['guma oporowa', 'wysoki zaczep'],
    steps: guideSteps('Zaczep gumę wysoko. Uklęknij albo usiądź tak, żeby ramiona startowały nad głową.', 'Ściągnij łokcie w dół w stronę żeber. Myśl o ruchu łopatek, nie o samych dłoniach.', 'Wróć do góry z pełną kontrolą i bez puszczania napięcia.', 'Nie wyginaj mocno pleców, żeby skrócić ruch.') }),
  guideExercise({ id: 'pullover-hantlem', name: 'Pullover hantlem', cat: 'plecy', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Ruch przez barki z akcentem na najszerszy grzbietu i kontrolę klatki.',
    aliases: ['dumbbell pullover', 'DB pullover'],
    primaryMuscles: ['najszerszy grzbietu'], secondaryMuscles: ['klatka piersiowa', 'triceps', 'core'], equipment: ['hantel', 'ławka lub podłoga'],
    steps: guideSteps('Połóż się na ławce albo podłodze. Trzymaj hantel oburącz nad klatką.', 'Przenieś hantel za głowę w zakresie, który kontrolujesz barkami.', 'Wróć nad klatkę, utrzymując lekko ugięte łokcie.', 'Nie szukaj zakresu na siłę, jeśli barki ciągną lub tracisz kontrolę.') }),
  guideExercise({ id: 'reverse-fly', name: 'Odwrotne rozpiętki hantlami', cat: 'plecy', icon: '🏋️',
    desc: 'Akcesorium na tył barków i górę pleców. Wymaga małego ciężaru i spokojnego tempa.',
    aliases: ['reverse fly', 'rear delt fly', 'odwrotne rozpiętki'],
    primaryMuscles: ['tył barków'], secondaryMuscles: ['górna część pleców', 'łopatki'], equipment: ['hantle'],
    steps: guideSteps('Pochyl tułów i trzymaj lekkie hantle pod barkami. Łokcie zostaw lekko ugięte.', 'Unieś ramiona na boki, aż poczujesz pracę tyłu barków.', 'Opuść hantle powoli. Nie bujaj tułowiem.', 'Jeśli musisz szarpać, ciężar jest za duży.') }),
  guideExercise({ id: 'superman-hold', name: 'Superman hold', cat: 'plecy', icon: '🧲',
    desc: 'Krótki izometryczny ruch na tylną taśmę. Lepiej traktować go jako dodatek, nie główne ćwiczenie siłowe.',
    aliases: ['superman', 'superman plank'],
    primaryMuscles: ['prostowniki grzbietu'], secondaryMuscles: ['pośladki', 'tył barków'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Połóż się na brzuchu i wyciągnij ręce przed siebie. Czoło skieruj do podłogi.', 'Unieś ręce i nogi kilka centymetrów, bez zadzierania głowy.', 'Przytrzymaj krótko i wróć do maty z kontrolą.', 'Nie rób dużego przeprostu w lędźwiach.') }),
  guideExercise({ id: 'ytw-brzuch', name: 'Y-T-W na brzuchu', cat: 'plecy', icon: '🧲',
    desc: 'Lekki zestaw ruchów dla łopatek i tyłu barków. Dobrze działa jako akcesorium techniczne.',
    aliases: ['prone YTW', 'YTW raises'],
    primaryMuscles: ['górna część pleców', 'tył barków'], secondaryMuscles: ['rotatory barku', 'łopatki'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Połóż się na brzuchu. Unieś ręce w kształcie litery Y, potem T, potem W.', 'W każdej pozycji lekko ściągnij łopatki i zatrzymaj ruch na moment.', 'Pracuj małym zakresem. Szyja zostaje neutralna.', 'Nie unoś rąk kosztem odginania głowy.') }),
  guideExercise({ id: 'goblet', name: 'Goblet squat', cat: 'nogi', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Przysiad z hantlem trzymanym z przodu. Pomaga utrzymać bardziej pionowy tułów.',
    aliases: ['goblet squat', 'przysiad goblet'],
    primaryMuscles: ['czworogłowe uda'], secondaryMuscles: ['pośladki', 'core', 'przywodziciele'], equipment: ['hantel'],
    steps: guideSteps('Trzymaj hantel przy klatce. Stopy ustaw trochę szerzej niż biodra, palce lekko na zewnątrz.', 'Zejdź w przysiad, prowadząc kolana w kierunku palców.', 'Wstań, naciskając całą stopą na podłogę. Tułów zostaje stabilny.', 'Nie pozwól, żeby pięty odrywały się od podłogi.') }),
  guideExercise({ id: 'przysiad-krzeslo', name: 'Przysiad do krzesła', cat: 'nogi', icon: '🦵',
    desc: 'Dobry wariant do nauki przysiadu i kontroli głębokości. Krzesło daje jasny punkt odniesienia.',
    aliases: ['box squat', 'chair squat'],
    primaryMuscles: ['czworogłowe uda'], secondaryMuscles: ['pośladki', 'core'], equipment: ['masa ciała', 'krzesło'],
    steps: guideSteps('Stań przed krzesłem. Stopy ustaw stabilnie, a ręce trzymaj przed sobą albo przy klatce.', 'Cofnij biodra i usiądź lekko na krześle bez pełnego rozluźnienia.', 'Wstań, naciskając stopami na podłogę.', 'Nie opadaj na krzesło jak na przerwę między powtórzeniami.') }),
  guideExercise({ id: 'split-squat', name: 'Split squat z podparciem', cat: 'nogi', level: 'sredni', diff: 2, icon: '🦵',
    desc: 'Ćwiczenie jednostronne na nogi. Podparcie pozwala skupić się na pracy przedniej nogi.',
    aliases: ['split squat', 'supported split squat'],
    primaryMuscles: ['czworogłowe uda'], secondaryMuscles: ['pośladki', 'przywodziciele'], equipment: ['masa ciała', 'krzesło lub ściana'],
    steps: guideSteps('Ustaw jedną nogę z przodu, drugą z tyłu. Złap lekkie podparcie, jeśli potrzebujesz równowagi.', 'Opuść tylne kolano w stronę podłogi. Przednia stopa zostaje dociśnięta.', 'Wstań przez przednią nogę. Po serii zmień stronę.', 'Nie skracaj ruchu tylko dlatego, że tracisz równowagę. Użyj podparcia.') }),
  guideExercise({ id: 'wykrok-w-tyl', name: 'Wykrok w tył', cat: 'nogi', level: 'sredni', diff: 2, icon: '🦵',
    desc: 'Wariant wykroku często łatwiejszy do kontroli niż krok w przód. Dobrze pasuje do małej przestrzeni.',
    aliases: ['reverse lunge', 'backward lunge'],
    primaryMuscles: ['czworogłowe uda'], secondaryMuscles: ['pośladki', 'łydki', 'core'], equipment: ['masa ciała', 'opcjonalnie hantle'],
    steps: guideSteps('Stań prosto i napnij brzuch. Możesz trzymać hantle po bokach.', 'Zrób krok w tył i opuść kolano w stronę podłogi.', 'Odepchnij się przednią stopą i wróć do stania. Zmieniaj nogi albo rób całą serię na jedną stronę.', 'Kolano przedniej nogi prowadź stabilnie, bez zapadania do środka.') }),
  guideExercise({ id: 'step-up', name: 'Step-up', cat: 'nogi', icon: '🦵',
    desc: 'Wejście na podwyższenie. Prosty ruch jednostronny, który łatwo skalować wysokością i obciążeniem.',
    aliases: ['step up', 'wchodzenie na stopień'],
    primaryMuscles: ['czworogłowe uda'], secondaryMuscles: ['pośladki', 'łydki', 'core'], equipment: ['stabilne podwyższenie', 'opcjonalnie hantle'],
    steps: guideSteps('Stań przed stabilnym stopniem. Całą stopę pracującej nogi postaw na podwyższeniu.', 'Wejdź na górę, odpychając się głównie nogą ustawioną na stopniu.', 'Zejdź powoli tą samą drogą i wykonaj kolejne powtórzenie.', 'Nie odbijaj się mocno nogą z podłogi.') }),
  guideExercise({ id: 'bulgarian-split-squat', name: 'Przysiad bułgarski', cat: 'nogi', level: 'zaawansowany', diff: 3, icon: '🦵',
    desc: 'Trudniejszy wariant split squatu z tylną nogą na podwyższeniu. Wymaga kontroli i cierpliwego tempa.',
    aliases: ['bulgarian split squat', 'BSS'],
    primaryMuscles: ['czworogłowe uda'], secondaryMuscles: ['pośladki', 'przywodziciele', 'core'], equipment: ['ławka lub krzesło', 'opcjonalnie hantle'],
    steps: guideSteps('Oprzyj tylną stopę na ławce albo krześle. Przednią stopę ustaw tak, żeby kolano miało miejsce na ruch.', 'Zejdź w dół, utrzymując ciężar głównie na przedniej nodze.', 'Wstań przez przednią stopę i nie blokuj biodra w górze na siłę.', 'Jeśli czujesz głównie tylną nogę, popraw odległość od podwyższenia.') }),
  guideExercise({ id: 'przysiad-pauza', name: 'Przysiad z pauzą', cat: 'nogi', level: 'sredni', diff: 2, icon: '🦵',
    desc: 'Przysiad, który uczy kontroli w dole. Pauza szybko pokazuje, czy ruch jest stabilny.',
    aliases: ['pause squat', 'paused squat'],
    primaryMuscles: ['czworogłowe uda'], secondaryMuscles: ['pośladki', 'core'], equipment: ['masa ciała', 'opcjonalnie hantel'],
    steps: guideSteps('Ustaw stopy jak do swojego zwykłego przysiadu. Napnij brzuch przed zejściem.', 'Zejdź w dół i zatrzymaj się na sekundę w kontrolowanej pozycji.', 'Wstań bez odbicia z dołu. Tempo ma zostać równe.', 'Pauza nie oznacza rozluźnienia na dole.') }),
  guideExercise({ id: 'wall-sit', name: 'Wall sit', cat: 'nogi', icon: '🦵',
    desc: 'Izometryczne ćwiczenie na uda. Dobre jako prosty finisher albo wariant bez ruchu kolana.',
    aliases: ['krzesełko przy ścianie', 'wall squat hold'],
    primaryMuscles: ['czworogłowe uda'], secondaryMuscles: ['pośladki', 'łydki'], equipment: ['masa ciała', 'ściana'],
    steps: guideSteps('Oprzyj plecy o ścianę i zejdź do pozycji krzesełka. Stopy ustaw przed kolanami.', 'Utrzymaj pozycję przez wybrany czas. Oddychaj spokojnie.', 'Wyjdź z pozycji, przesuwając plecy po ścianie do góry.', 'Nie schodź tak nisko, że tracisz ustawienie kolan.') }),
  guideExercise({ id: 'wspiecia-palce', name: 'Wspięcia na palce', cat: 'nogi', icon: '🦵',
    desc: 'Prosty ruch na łydki. Najwięcej daje wtedy, gdy robisz go wolno i w pełnym zakresie.',
    aliases: ['calf raise', 'standing calf raise'],
    primaryMuscles: ['łydki'], secondaryMuscles: ['stopy', 'stabilizacja kostki'], equipment: ['masa ciała', 'opcjonalnie hantle'],
    steps: guideSteps('Stań prosto, najlepiej przy ścianie dla równowagi. Stopy ustaw na szerokość bioder.', 'Unieś pięty jak najwyżej, bez uciekania kostek na boki.', 'Opuść pięty powoli. Możesz dodać pauzę na górze.', 'Nie sprężynuj krótkimi powtórzeniami.') }),
  guideExercise({ id: 'przysiad-sumo-hantlem', name: 'Przysiad sumo z hantlem', cat: 'nogi', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Szerszy wariant przysiadu z hantlem trzymanym nisko. Mocniej angażuje przywodziciele i pośladki.',
    aliases: ['sumo squat', 'dumbbell sumo squat'],
    primaryMuscles: ['czworogłowe uda', 'przywodziciele'], secondaryMuscles: ['pośladki', 'core'], equipment: ['hantel'],
    steps: guideSteps('Stań szerzej niż biodra, palce skieruj lekko na zewnątrz. Hantel trzymaj pionowo przed sobą.', 'Zejdź w dół, prowadząc kolana w kierunku palców.', 'Wstań, naciskając całą stopą na podłogę.', 'Nie wybieraj tak szerokiego ustawienia, że tracisz kontrolę kolan.') }),
  guideExercise({ id: 'glute-bridge', name: 'Glute bridge', cat: 'posladki', icon: '🍑',
    desc: 'Podstawowy most biodrowy na pośladki. Łatwy do ustawienia i dobry do nauki pracy bioder.',
    aliases: ['most biodrowy', 'glute bridge', 'hip bridge'],
    primaryMuscles: ['pośladki'], secondaryMuscles: ['tył uda', 'core'], equipment: ['masa ciała', 'opcjonalnie hantel'],
    steps: guideSteps('Połóż się na plecach, ugnij kolana i ustaw stopy blisko bioder.', 'Wypchnij biodra w górę, myśląc o skróceniu pośladków, nie o wyginaniu pleców.', 'Opuść biodra spokojnie prawie do podłogi.', 'Na górze nie przeprostowuj odcinka lędźwiowego.') }),
  guideExercise({ id: 'hip-thrust', name: 'Hip thrust o ławkę', cat: 'posladki', level: 'sredni', diff: 2, icon: '🍑',
    desc: 'Most biodrowy z plecami na podwyższeniu. Daje większy zakres pracy bioder niż wersja z podłogi.',
    aliases: ['hip thrust', 'hip thrust o kanapę', 'glute bridge na ławce'],
    primaryMuscles: ['pośladki'], secondaryMuscles: ['tył uda', 'core'], equipment: ['ławka lub kanapa', 'opcjonalnie hantel'],
    steps: guideSteps('Oprzyj górę pleców o ławkę albo kanapę. Stopy ustaw tak, żeby na górze kolana były mniej więcej nad stopami.', 'Wypchnij biodra w górę i zatrzymaj ruch krótkim napięciem pośladków.', 'Opuść biodra do kontrolowanego rozciągnięcia i powtórz.', 'Nie odchylaj głowy i żeber do tyłu na górze.') }),
  guideExercise({ id: 'rdl-hantle', name: 'Rumuński martwy ciąg z hantlami', cat: 'posladki', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Hip hinge z hantlami. Jeden z najbardziej praktycznych ruchów na tył uda i pośladki w domu.',
    aliases: ['dumbbell RDL', 'romanian deadlift', 'RDL z hantlami'],
    primaryMuscles: ['tył uda', 'pośladki'], secondaryMuscles: ['prostowniki grzbietu', 'chwyt'], equipment: ['hantle'],
    steps: guideSteps('Stań z hantlami przed udami. Lekko ugnij kolana i ustaw plecy stabilnie.', 'Cofaj biodra, prowadząc hantle blisko nóg. Schodź do mocnego, kontrolowanego rozciągnięcia tyłu uda.', 'Wróć do stania przez wypchnięcie bioder do przodu.', 'Nie zaokrąglaj pleców, żeby sięgnąć niżej.') }),
  guideExercise({ id: 'rdl-jednonoz-podparcie', name: 'RDL jednonóż z podparciem', cat: 'posladki', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Jednostronny hip hinge. Podparcie pozwala trenować tył uda bez walki o równowagę.',
    aliases: ['single leg RDL', 'supported single leg RDL'],
    primaryMuscles: ['tył uda', 'pośladki'], secondaryMuscles: ['core', 'stopa i łydka'], equipment: ['hantel', 'krzesło lub ściana'],
    steps: guideSteps('Stań na jednej nodze i lekko podeprzyj się ręką. Hantel trzymaj po stronie nogi pracującej albo przeciwnej.', 'Cofnij biodro i pochyl tułów, prowadząc wolną nogę do tyłu.', 'Wróć do stania, utrzymując miednicę możliwie równo.', 'Nie skręcaj bioder tylko po to, żeby zejść niżej.') }),
  guideExercise({ id: 'good-morning-guma', name: 'Good morning z gumą', cat: 'posladki', icon: '🍑',
    desc: 'Lekki hip hinge z gumą. Dobry do nauki cofania bioder i pracy tylnej taśmy.',
    aliases: ['band good morning', 'dzień dobry z gumą'],
    primaryMuscles: ['tył uda', 'pośladki'], secondaryMuscles: ['prostowniki grzbietu', 'core'], equipment: ['guma oporowa'],
    steps: guideSteps('Stań na gumie i przełóż ją za kark albo górę pleców. Kolana zostaw lekko ugięte.', 'Cofnij biodra i pochyl tułów, utrzymując plecy stabilnie.', 'Wróć do stania przez pracę bioder, nie przez zadzieranie głowy.', 'Guma nie może zsuwać się na szyję.') }),
  guideExercise({ id: 'uginanie-nog-recznik', name: 'Uginanie nóg z ręcznikiem', cat: 'posladki', level: 'sredni', diff: 2, icon: '🍑',
    desc: 'Domowy wariant uginania nóg na tył uda. Działa najlepiej na śliskiej podłodze.',
    aliases: ['hamstring slide', 'sliding leg curl', 'leg curl z ręcznikiem'],
    primaryMuscles: ['tył uda'], secondaryMuscles: ['pośladki', 'łydki', 'core'], equipment: ['ręcznik lub ślizgacze', 'gładka podłoga'],
    steps: guideSteps('Połóż się na plecach i połóż pięty na ręczniku. Unieś biodra jak w glute bridge.', 'Powoli wysuń pięty do przodu, utrzymując biodra nad podłogą.', 'Przyciągnij pięty z powrotem pod kolana i dopiero wtedy zakończ powtórzenie.', 'Jeśli biodra opadają, skróć zakres albo rób samą fazę wysuwania.') }),
  guideExercise({ id: 'frog-pumps', name: 'Frog pumps', cat: 'posladki', icon: '🍑',
    desc: 'Krótki ruch na pośladki z podeszwami stóp razem. Dobrze sprawdza się jako lekki dodatek.',
    aliases: ['frog pump', 'żabki pośladki'],
    primaryMuscles: ['pośladki'], secondaryMuscles: ['przywodziciele'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Połóż się na plecach, połącz podeszwy stóp i pozwól kolanom opaść na boki.', 'Unieś biodra krótkim ruchem, napinając pośladki na górze.', 'Opuść biodra z kontrolą i trzymaj stałe tempo.', 'Nie rób ruchu z lędźwi. Zakres może być mały.') }),
  guideExercise({ id: 'donkey-kick', name: 'Donkey kick', cat: 'posladki', icon: '🍑',
    desc: 'Proste ćwiczenie na pośladek w podporze. Najlepiej działa przy spokojnym tempie i małym zakresie.',
    aliases: ['kopnięcie osła', 'glute kickback'],
    primaryMuscles: ['pośladki'], secondaryMuscles: ['core', 'tył uda'], equipment: ['masa ciała', 'mata', 'opcjonalnie guma mini band'],
    steps: guideSteps('Ustaw się na czworakach. Dłonie pod barkami, kolana pod biodrami.', 'Unieś jedną nogę do tyłu i lekko w górę, zachowując zgięte kolano.', 'Wróć kolanem pod biodro. Miednica zostaje możliwie nieruchoma.', 'Nie skręcaj tułowia, żeby podnieść nogę wyżej.') }),
  guideExercise({ id: 'fire-hydrant', name: 'Fire hydrant', cat: 'posladki', icon: '🍑',
    desc: 'Odwodzenie biodra w podporze. Użyteczne jako lekki dodatek do treningu pośladków.',
    aliases: ['hydrant', 'odwodzenie biodra w podporze'],
    primaryMuscles: ['pośladek średni'], secondaryMuscles: ['core', 'rotatory biodra'], equipment: ['masa ciała', 'mata', 'opcjonalnie guma mini band'],
    steps: guideSteps('Ustaw się na czworakach i napnij brzuch. Kolana trzymaj pod biodrami.', 'Unieś kolano w bok bez obracania całego tułowia.', 'Opuść nogę do pozycji startowej i powtórz na tę samą stronę.', 'Mniejszy, czysty zakres jest lepszy niż szeroki ruch z rotacją.') }),
  guideExercise({ id: 'pull-through-guma', name: 'Pull-through z gumą', cat: 'posladki', icon: '🍑',
    desc: 'Hip hinge z gumą zaczepioną za plecami. Dobry sposób na naukę pracy bioder.',
    aliases: ['band pull-through', 'pull through z gumą'],
    primaryMuscles: ['pośladki', 'tył uda'], secondaryMuscles: ['core', 'prostowniki grzbietu'], equipment: ['guma oporowa', 'niski zaczep'],
    steps: guideSteps('Zaczep gumę nisko za sobą i chwyć ją między nogami. Odejdź, aż poczujesz napięcie.', 'Cofnij biodra, pozwalając gumie ciągnąć dłonie do tyłu.', 'Wypchnij biodra do przodu i wróć do stania.', 'Nie ciągnij ruchu samymi rękami.') }),
  guideExercise({ id: 'wycisk-hantli-nad-glowe', name: 'Wyciskanie hantli nad głowę', cat: 'barki', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Podstawowe wyciskanie na barki. Dobrze logować je osobno, bo łatwo śledzić progres obciążenia.',
    aliases: ['dumbbell overhead press', 'DB shoulder press', 'OHP hantlami'],
    primaryMuscles: ['barki'], secondaryMuscles: ['triceps', 'core'], equipment: ['hantle'],
    steps: guideSteps('Stań albo usiądź z hantlami na wysokości barków. Żebra trzymaj pod kontrolą.', 'Wyciskaj hantle nad głowę, prowadząc je lekko do środka.', 'Opuść hantle do barków bez odbijania i utraty pozycji tułowia.', 'Jeśli wyginasz plecy, zmniejsz ciężar albo usiądź z podparciem.') }),
  guideExercise({ id: 'wycisk-hantla-jednoracz', name: 'Wyciskanie hantla jednorącz nad głowę', cat: 'barki', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Jednorącz łatwiej zauważyć różnice stron. Tułów musi pracować, żeby nie uciekać w bok.',
    aliases: ['single arm dumbbell press', 'one arm shoulder press'],
    primaryMuscles: ['barki'], secondaryMuscles: ['triceps', 'core'], equipment: ['hantel'],
    steps: guideSteps('Trzymaj hantel przy barku. Drugą rękę możesz oprzeć na brzuchu albo trzymać z boku.', 'Wyciskaj hantel nad głowę bez przechylania tułowia.', 'Opuść go do barku i wykonaj całą serię na jedną stronę.', 'Nie pomagaj sobie skrętem bioder.') }),
  guideExercise({ id: 'unoszenia', name: 'Unoszenie hantli bokiem', cat: 'barki', icon: '🏋️',
    desc: 'Akcesorium na środkową część barków. Mały ciężar i równe tempo robią tu więcej niż ego.',
    aliases: ['lateral raise', 'side raise', 'unoszenia bokiem'],
    primaryMuscles: ['środkowy akton barków'], secondaryMuscles: ['górna część pleców'], equipment: ['hantle'],
    steps: guideSteps('Stań z hantlami po bokach. Łokcie zostaw lekko ugięte.', 'Unieś ramiona na boki mniej więcej do wysokości barków.', 'Opuść hantle powoli. Nie rozkręcaj ruchu biodrami.', 'Jeśli musisz bujać tułowiem, ciężar jest za duży.') }),
  guideExercise({ id: 'unoszenie-przodem', name: 'Unoszenie hantli przodem', cat: 'barki', icon: '🏋️',
    desc: 'Ruch na przednią część barków. Warto dawkować go rozsądnie, bo wyciskania też mocno ją angażują.',
    aliases: ['front raise', 'dumbbell front raise'],
    primaryMuscles: ['przedni akton barków'], secondaryMuscles: ['klatka piersiowa', 'core'], equipment: ['hantle'],
    steps: guideSteps('Stań prosto z hantlami przed udami. Kolana lekko ugnij.', 'Unieś jeden albo oba hantle przed siebie do wysokości barków.', 'Opuść je powoli, bez odchylania tułowia do tyłu.', 'Nie dodawaj tego ćwiczenia w dużej objętości, jeśli masz już dużo wyciskań.') }),
  guideExercise({ id: 'arnold-press', name: 'Arnold press', cat: 'barki', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Wyciskanie z rotacją hantli. Dobre jako urozmaicenie, ale wymaga płynnego ruchu barków.',
    aliases: ['arnold press', 'wyciskanie Arnolda'],
    primaryMuscles: ['barki'], secondaryMuscles: ['triceps', 'górna część klatki'], equipment: ['hantle'],
    steps: guideSteps('Zacznij z hantlami przed barkami, dłonie skierowane do siebie.', 'Wyciskając hantle, obróć dłonie tak, żeby na górze były skierowane do przodu.', 'Wróć tą samą drogą, bez urywania dolnej fazy.', 'Jeśli rotacja jest niewygodna, wybierz zwykłe wyciskanie nad głowę.') }),
  guideExercise({ id: 'pike-push-up', name: 'Pike push-up', cat: 'barki', level: 'sredni', diff: 2, icon: '🤸',
    desc: 'Pompka z biodrami wysoko. Domowy wariant mocniejszego ruchu na barki bez hantli.',
    aliases: ['pompka pike', 'pike press'],
    primaryMuscles: ['barki'], secondaryMuscles: ['triceps', 'górna część klatki', 'core'], equipment: ['masa ciała'],
    steps: guideSteps('Ustaw dłonie na podłodze i unieś biodra wysoko, tworząc odwróconą literę V.', 'Ugnij łokcie i skieruj głowę w stronę podłogi przed dłońmi.', 'Wypchnij się do góry, utrzymując biodra wysoko.', 'Nie zamieniaj ruchu w zwykłą pompkę z opadającymi biodrami.') }),
  guideExercise({ id: 'rotacja-zewnetrzna-guma', name: 'Rotacja zewnętrzna barku z gumą', cat: 'barki', icon: '🧲',
    desc: 'Małe ćwiczenie na kontrolę barku. Pasuje jako lekkie akcesorium, nie jako główny ruch treningu.',
    aliases: ['band external rotation', 'rotatory barku'],
    primaryMuscles: ['rotatory barku'], secondaryMuscles: ['tył barków'], equipment: ['guma oporowa'],
    steps: guideSteps('Zaczep gumę na wysokości łokcia. Stań bokiem i trzymaj łokieć blisko tułowia.', 'Obróć przedramię na zewnątrz, utrzymując łokieć przy boku.', 'Wróć powoli do pozycji startowej. Ruch jest mały i spokojny.', 'Nie odrywaj łokcia od tułowia, żeby uzyskać większy zakres.') }),
  guideExercise({ id: 'scaption-hantle', name: 'Scaption z hantlami', cat: 'barki', icon: '🏋️',
    desc: 'Unoszenie ramion po skosie między przodem a bokiem. Często wygodniejsze niż klasyczne unoszenie bokiem.',
    aliases: ['scaption raise', 'scaption'],
    primaryMuscles: ['barki'], secondaryMuscles: ['górna część pleców'], equipment: ['hantle'],
    steps: guideSteps('Stań z lekkimi hantlami. Ramiona ustaw lekko przed linią tułowia.', 'Unieś hantle po skosie do wysokości barków.', 'Opuść je wolno, zachowując ten sam tor ruchu.', 'Nie ustawiaj kciuków agresywnie w dół.') }),
  guideExercise({ id: 'halo-hantlem', name: 'Halo z hantlem', cat: 'barki', icon: '🏋️',
    desc: 'Krążenie hantlem wokół głowy. Bardziej ćwiczenie kontroli barków i tułowia niż bicie rekordów.',
    aliases: ['dumbbell halo', 'halo'],
    primaryMuscles: ['barki'], secondaryMuscles: ['core', 'górna część pleców'], equipment: ['hantel'],
    steps: guideSteps('Trzymaj lekki hantel oburącz przed twarzą. Stań stabilnie i napnij brzuch.', 'Poprowadź hantel powoli wokół głowy, blisko ciała.', 'Wykonaj ruch w obie strony. Żebra i biodra zostają spokojne.', 'Nie używaj ciężaru, który wymusza wyginanie pleców.') }),
  guideExercise({ id: 'rear-delt-row', name: 'Wiosłowanie na tył barków', cat: 'barki', icon: '🏋️',
    desc: 'Wiosłowanie z łokciami szerzej. Dobry dodatek do równoważenia wyciskań.',
    aliases: ['rear delt row', 'wide elbow row'],
    primaryMuscles: ['tył barków'], secondaryMuscles: ['górna część pleców', 'biceps'], equipment: ['hantle'],
    steps: guideSteps('Pochyl tułów i trzymaj lekkie hantle pod barkami.', 'Pociągnij łokcie szerzej niż w klasycznym wiosłowaniu, w stronę górnej części żeber.', 'Opuść hantle spokojnie, utrzymując pochylenie tułowia.', 'Nie unoś barków do uszu.') }),
  guideExercise({ id: 'uginanie', name: 'Uginanie hantli', cat: 'ramiona', icon: '💪',
    desc: 'Podstawowe ćwiczenie na zginanie łokcia. Łatwe do progresji i czytelne w dzienniku.',
    aliases: ['biceps curl', 'dumbbell curl', 'uginanie na biceps'],
    primaryMuscles: ['biceps'], secondaryMuscles: ['przedramiona', 'chwyt'], equipment: ['hantle'],
    steps: guideSteps('Stań z hantlami po bokach. Łokcie trzymaj blisko tułowia.', 'Ugnij łokcie i unieś hantle bez bujania barkami.', 'Opuść hantle do pełnego, kontrolowanego wyprostu.', 'Nie odchylaj tułowia, żeby dokończyć powtórzenie.') }),
  guideExercise({ id: 'hammer', name: 'Hammer curl', cat: 'ramiona', icon: '🔨',
    desc: 'Uginanie z chwytem neutralnym. Dobry wariant dla bicepsa, mięśnia ramiennego i przedramion.',
    aliases: ['młotki', 'hammer curl', 'neutral grip curl'],
    primaryMuscles: ['mięsień ramienny', 'biceps'], secondaryMuscles: ['przedramiona', 'chwyt'], equipment: ['hantle'],
    steps: guideSteps('Trzymaj hantle neutralnie, jak dwa młotki. Łokcie zostają przy tułowiu.', 'Ugnij łokcie, nie obracając dłoni w trakcie ruchu.', 'Opuść hantle wolno do wyprostu.', 'Nie wypychaj łokci do przodu w końcówce ruchu.') }),
  guideExercise({ id: 'uginanie-naprzemienne', name: 'Uginanie hantli naprzemienne', cat: 'ramiona', icon: '💪',
    desc: 'Wariant, w którym łatwiej pilnować każdej ręki osobno. Dobre, gdy ciężar wymaga większej kontroli.',
    aliases: ['alternating curl', 'alternating dumbbell curl'],
    primaryMuscles: ['biceps'], secondaryMuscles: ['przedramiona'], equipment: ['hantle'],
    steps: guideSteps('Stań z hantlami po bokach. Jedna ręka pracuje, druga czeka nieruchomo.', 'Ugnij jeden łokieć i unieś hantel do góry.', 'Opuść go do końca, zanim ruszy druga ręka.', 'Nie skracaj opuszczania, żeby szybciej zmienić stronę.') }),
  guideExercise({ id: 'uginanie-supinacja', name: 'Uginanie hantli z supinacją', cat: 'ramiona', icon: '💪',
    desc: 'Uginanie z obrotem dłoni. Naturalny wariant, gdy chcesz połączyć chwyt neutralny i klasyczny curl.',
    aliases: ['supinating curl', 'dumbbell curl supination'],
    primaryMuscles: ['biceps'], secondaryMuscles: ['przedramiona'], equipment: ['hantle'],
    steps: guideSteps('Zacznij z hantlami w chwycie neutralnym po bokach ciała.', 'Podczas uginania obracaj dłonie tak, żeby na górze były skierowane ku górze.', 'Opuść hantle i wróć do chwytu neutralnego.', 'Obrót ma być płynny, nie wymuszony nadgarstkiem.') }),
  guideExercise({ id: 'concentration-curl', name: 'Concentration curl', cat: 'ramiona', icon: '💪',
    desc: 'Uginanie w siadzie z łokciem opartym o udo. Pozwala ograniczyć bujanie tułowiem.',
    aliases: ['uginanie w koncentracji', 'concentration curl'],
    primaryMuscles: ['biceps'], secondaryMuscles: ['przedramiona'], equipment: ['hantel', 'krzesło lub ławka'],
    steps: guideSteps('Usiądź i oprzyj tył ramienia o wewnętrzną stronę uda. Hantel startuje nisko.', 'Ugnij łokieć, prowadząc hantel w stronę barku.', 'Opuść hantel powoli, nie odrywając ramienia od uda.', 'Nie skręcaj barku, żeby podnieść ciężar wyżej.') }),
  guideExercise({ id: 'triceps-extension-nad-glowa', name: 'Prostowanie ramion z hantlem nad głową', cat: 'ramiona', level: 'sredni', diff: 2, icon: '💪',
    desc: 'Ćwiczenie na triceps z dużym zakresem zgięcia łokcia. Dobrze działa z jednym hantlem trzymanym oburącz.',
    aliases: ['overhead triceps extension', 'triceps extension'],
    primaryMuscles: ['triceps'], secondaryMuscles: ['core', 'barki'], equipment: ['hantel'],
    steps: guideSteps('Trzymaj hantel oburącz nad głową. Żebra schowaj, nie wyginaj pleców.', 'Ugnij łokcie i opuść hantel za głowę w kontrolowanym zakresie.', 'Wyprostuj ramiona, utrzymując łokcie możliwie blisko głowy.', 'Jeśli barki czują się źle w tej pozycji, wybierz prostowanie z gumą.') }),
  guideExercise({ id: 'francuskie-hantle', name: 'Francuskie wyciskanie hantli leżąc', cat: 'ramiona', level: 'sredni', diff: 2, icon: '💪',
    desc: 'Leżący wariant pracy tricepsa. Łatwiej kontrolować tułów niż w wersji stojącej.',
    aliases: ['skull crusher', 'lying triceps extension', 'french press'],
    primaryMuscles: ['triceps'], secondaryMuscles: ['przedramiona'], equipment: ['hantle', 'podłoga lub ławka'],
    steps: guideSteps('Połóż się i ustaw hantle nad barkami. Łokcie zostaw skierowane w górę.', 'Ugnij łokcie, opuszczając hantle w stronę boków głowy.', 'Wyprostuj ramiona bez przesuwania łokci mocno do przodu.', 'Zacznij lekko. Łokcie szybko pokażą, czy ciężar jest rozsądny.') }),
  guideExercise({ id: 'kickback-triceps', name: 'Kickback triceps', cat: 'ramiona', icon: '💪',
    desc: 'Małe ćwiczenie na końcowy wyprost łokcia. Wymaga małego ciężaru i stabilnego barku.',
    aliases: ['triceps kickback', 'prostowanie ramienia w opadzie'],
    primaryMuscles: ['triceps'], secondaryMuscles: ['tył barków'], equipment: ['hantel'],
    steps: guideSteps('Pochyl tułów i oprzyj jedną rękę o krzesło albo udo. Drugie ramię trzymaj blisko tułowia.', 'Wyprostuj łokieć, prowadząc hantel do tyłu.', 'Wróć do zgięcia łokcia bez opuszczania ramienia.', 'Nie zamachuj całym ramieniem.') }),
  guideExercise({ id: 'prostowanie-guma-triceps', name: 'Prostowanie ramion z gumą', cat: 'ramiona', icon: '🧲',
    desc: 'Domowy odpowiednik prostowania na wyciągu. Guma daje największy opór pod koniec ruchu.',
    aliases: ['band triceps pushdown', 'triceps pushdown z gumą'],
    primaryMuscles: ['triceps'], secondaryMuscles: ['przedramiona'], equipment: ['guma oporowa', 'wysoki zaczep'],
    steps: guideSteps('Zaczep gumę wysoko i stań przodem do zaczepu. Łokcie trzymaj przy bokach.', 'Wyprostuj ramiona w dół, napinając triceps na końcu ruchu.', 'Wróć do zgięcia łokci bez unoszenia ramion.', 'Nie pochylaj całego ciała, żeby docisnąć gumę.') }),
  guideExercise({ id: 'zottman-curl', name: 'Zottman curl', cat: 'ramiona', level: 'sredni', diff: 2, icon: '💪',
    desc: 'Uginanie z obrotem chwytu na górze. Łączy pracę bicepsa i przedramion.',
    aliases: ['zottman curl', 'uginanie Zottmana'],
    primaryMuscles: ['biceps'], secondaryMuscles: ['przedramiona', 'chwyt'], equipment: ['hantle'],
    steps: guideSteps('Ugnij hantle jak w klasycznym curlu, dłonie skierowane ku górze.', 'Na górze obróć dłonie w dół.', 'Opuść hantle w tym chwycie, a na dole wróć do pozycji startowej.', 'Nie używaj ciężaru, którego nie kontrolujesz w opuszczaniu.') }),
  guideExercise({ id: 'dead-bug', name: 'Dead bug', cat: 'core', icon: '🦗',
    desc: 'Ćwiczenie kontroli tułowia w leżeniu. Dobre, gdy chcesz trenować core bez spięć szyi.',
    aliases: ['deadbug', 'martwy robak'],
    primaryMuscles: ['core'], secondaryMuscles: ['zginacze bioder', 'koordynacja'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Połóż się na plecach. Unieś ręce i nogi tak, żeby biodra oraz kolana były zgięte pod kątem około 90 stopni.', 'Opuść przeciwną rękę i nogę, utrzymując lędźwie blisko podłogi.', 'Wróć do środka i zmień stronę.', 'Jeśli lędźwie odrywają się od podłogi, skróć zakres.') }),
  guideExercise({ id: 'side-plank', name: 'Side plank z kolan', cat: 'core', icon: '🧘',
    desc: 'Łatwiejsza wersja podporu bokiem. Dobra do nauki stabilizacji bez walki o długi czas utrzymania.',
    aliases: ['side plank knees', 'deska bokiem z kolan'],
    primaryMuscles: ['mięśnie skośne brzucha'], secondaryMuscles: ['pośladek średni', 'barki'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Oprzyj się na łokciu i dolnym kolanie. Biodra ustaw w jednej linii z tułowiem.', 'Unieś biodra i utrzymaj pozycję przez wybrany czas.', 'Opuść biodra spokojnie i zmień stronę.', 'Nie pozwól biodrom cofać się za tułów.') }),
  guideExercise({ id: 'side-plank-pelny', name: 'Side plank', cat: 'core', level: 'sredni', diff: 2, icon: '🧘',
    desc: 'Podpór bokiem w pełnej wersji. Dobrze sprawdza stabilizację boczną tułowia.',
    aliases: ['deska bokiem', 'side bridge'],
    primaryMuscles: ['mięśnie skośne brzucha'], secondaryMuscles: ['pośladek średni', 'barki'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Oprzyj się na łokciu i bocznych krawędziach stóp. Ustaw łokieć pod barkiem.', 'Unieś biodra i utrzymaj ciało w jednej linii.', 'Oddychaj spokojnie i zakończ serię, zanim pozycja się rozsypie.', 'Nie licz czasu kosztem opadających bioder.') }),
  guideExercise({ id: 'plank', name: 'Plank', cat: 'core', icon: '🧘',
    desc: 'Klasyczny podpór przodem. Największy sens ma wtedy, gdy traktujesz go jako ćwiczenie napięcia, nie konkurs czasu.',
    aliases: ['deska', 'front plank'],
    primaryMuscles: ['core'], secondaryMuscles: ['pośladki', 'barki'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Oprzyj łokcie pod barkami i ustaw stopy za sobą. Napnij brzuch oraz pośladki.', 'Utrzymaj ciało w jednej linii. Oddychaj krótko, bez rozluźniania brzucha.', 'Zakończ serię, gdy biodra zaczynają opadać albo unosić się za wysoko.', 'Lepsze 20 sekund dobrej pozycji niż minuta wiszenia na lędźwiach.') }),
  guideExercise({ id: 'bird-dog', name: 'Bird-dog', cat: 'core', icon: '🐕',
    desc: 'Spokojne ćwiczenie naprzemienne. Uczy trzymania tułowia, gdy pracują ręka i noga.',
    aliases: ['bird dog', 'ptak-pies'],
    primaryMuscles: ['core'], secondaryMuscles: ['pośladki', 'prostowniki grzbietu', 'koordynacja'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Ustaw się na czworakach. Dłonie pod barkami, kolana pod biodrami.', 'Wyciągnij przeciwną rękę i nogę, nie obracając miednicy.', 'Wróć do środka i zmień stronę albo wykonaj całą serię na jedną stronę.', 'Ruch ma być wolny. Szybkość zwykle psuje sens ćwiczenia.') }),
  guideExercise({ id: 'pallof', name: 'Pallof press', cat: 'core', level: 'sredni', diff: 2, icon: '🧘',
    desc: 'Ćwiczenie antyrotacyjne z gumą. Proste i bardzo użyteczne, jeśli masz gdzie zaczepić gumę.',
    aliases: ['pallof press', 'antyrotacja z gumą'],
    primaryMuscles: ['core'], secondaryMuscles: ['mięśnie skośne brzucha', 'barki'], equipment: ['guma oporowa', 'stabilny zaczep'],
    steps: guideSteps('Stań bokiem do zaczepu gumy. Trzymaj gumę przy klatce i ustaw stopy stabilnie.', 'Wypchnij ręce przed siebie, nie pozwalając gumie obrócić tułowia.', 'Wróć do klatki z kontrolą. Po serii obróć się na drugą stronę.', 'Dalej od zaczepu zwykle znaczy trudniej.') }),
  guideExercise({ id: 'hollow-body-hold', name: 'Hollow body hold', cat: 'core', level: 'sredni', diff: 2, icon: '🧘',
    desc: 'Trudniejsza izometria brzucha. Wymaga kontroli lędźwi, więc warto skalować zakres.',
    aliases: ['hollow hold', 'łódka gimnastyczna'],
    primaryMuscles: ['core'], secondaryMuscles: ['zginacze bioder', 'barki'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Połóż się na plecach i dociśnij lędźwie do podłogi. Unieś łopatki oraz nogi.', 'Trzymaj pozycję bez odrywania lędźwi. Ręce mogą być przy ciele albo za głową.', 'Skróć serię, gdy tracisz ustawienie pleców.', 'Im niżej nogi i dalej ręce, tym trudniej.') }),
  guideExercise({ id: 'mountain-climber', name: 'Mountain climber', cat: 'core', level: 'sredni', diff: 2, icon: '🧘',
    desc: 'Dynamiczny ruch w podporze. Dobrze pasuje jako krótki blok kondycyjny albo dodatek do core.',
    aliases: ['wspinaczka', 'mountain climbers'],
    primaryMuscles: ['core'], secondaryMuscles: ['zginacze bioder', 'barki', 'nogi'], equipment: ['masa ciała'],
    steps: guideSteps('Ustaw się w podporze jak do pompki. Dłonie pod barkami, brzuch napięty.', 'Przyciągaj kolano w stronę klatki i odstawiaj nogę z powrotem.', 'Zmieniaj strony w tempie, które pozwala utrzymać pozycję barków i bioder.', 'Nie pozwól biodrom skakać góra-dół przy każdym kroku.') }),
  guideExercise({ id: 'reverse-crunch', name: 'Reverse crunch', cat: 'core', icon: '🧘',
    desc: 'Unoszenie miednicy w leżeniu. Lepsze jako kontrolowany ruch niż szybkie machanie nogami.',
    aliases: ['odwrotne spięcie brzucha', 'reverse crunches'],
    primaryMuscles: ['mięśnie brzucha'], secondaryMuscles: ['zginacze bioder'], equipment: ['masa ciała', 'mata'],
    steps: guideSteps('Połóż się na plecach i ugnij kolana. Ręce połóż na podłodze dla stabilizacji.', 'Podwiń miednicę i unieś biodra kilka centymetrów nad podłogę.', 'Opuść biodra powoli, bez rzucania nogami w dół.', 'Zakres jest mały. Nie musi wyglądać efektownie.') }),
  guideExercise({ id: 'suitcase-carry', name: 'Suitcase carry', cat: 'core', level: 'sredni', diff: 2, icon: '🏋️',
    desc: 'Marsz z ciężarem po jednej stronie. Bardzo praktyczny sposób na core, chwyt i stabilną postawę.',
    aliases: ['walizka', 'suitcase walk', 'farmer walk jednorącz'],
    primaryMuscles: ['core'], secondaryMuscles: ['chwyt', 'barki', 'pośladki'], equipment: ['hantel', 'miejsce do marszu'],
    steps: guideSteps('Chwyć hantel w jedną rękę i stań prosto. Druga ręka zostaje swobodnie przy boku.', 'Idź spokojnie, nie pozwalając tułowiowi przechylać się w stronę ciężaru.', 'Po wybranym dystansie albo czasie zmień stronę.', 'Nie kompensuj ciężaru odchylaniem barków.') }),
];

const GUIDE_CATS = [
  { id: 'all',     label: 'Wszystkie' },
  { id: 'klatka',  label: 'Klatka' },
  { id: 'plecy',   label: 'Plecy' },
  { id: 'nogi',    label: 'Nogi' },
  { id: 'posladki', label: 'Pośladki' },
  { id: 'barki',   label: 'Barki' },
  { id: 'ramiona', label: 'Ramiona' },
  { id: 'core',    label: 'Core' },
];

const GUIDE_CATEGORY_LABELS = {
  all: 'Wszystkie',
  klatka: 'Klatka',
  plecy: 'Plecy',
  nogi: 'Nogi',
  posladki: 'Pośladki',
  barki: 'Barki',
  ramiona: 'Ramiona',
  core: 'Core',
  brzuch: 'Core',
  biceps: 'Ramiona',
  inne: 'Inne'
};

const GUIDE_CATEGORY_ICONS = {
  klatka: '🏋️',
  plecy: '🧲',
  nogi: '🦵',
  posladki: '🍑',
  barki: '🏋️',
  ramiona: '💪',
  core: '🧘',
  brzuch: '🧘',
  biceps: '💪',
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

function normalizeGuideCategoryId(categoryId) {
  const normalized = slugifyGuideValue(categoryId);
  const aliases = {
    brzuch: 'core',
    core: 'core',
    abs: 'core',
    biceps: 'ramiona',
    triceps: 'ramiona',
    arms: 'ramiona',
    arm: 'ramiona',
    shoulder: 'barki',
    shoulders: 'barki',
    barki: 'barki',
    glute: 'posladki',
    glutes: 'posladki',
    posladki: 'posladki',
    hamstring: 'posladki',
    hamstrings: 'posladki'
  };

  return aliases[normalized] || normalized || 'inne';
}

function getGuideCategoryLabel(categoryId) {
  const normalized = normalizeGuideCategoryId(categoryId);
  return GUIDE_CATEGORY_LABELS[normalized] || GUIDE_CATEGORY_LABELS[categoryId] || (normalized.charAt(0).toUpperCase() + normalized.slice(1));
}

function inferGuideCategory(rawCategory, primaryMuscles = [], secondaryMuscles = []) {
  const haystack = [rawCategory, ...primaryMuscles, ...secondaryMuscles].join(' ').toLowerCase();

  if (/(chest|pector)/.test(haystack)) return 'klatka';
  if (/(back|lat|trap|rhomboid|spine|erector)/.test(haystack)) return 'plecy';
  if (/(glute|hamstring|hip)/.test(haystack)) return 'posladki';
  if (/(leg|quad|calf|thigh)/.test(haystack)) return 'nogi';
  if (/(ab|core|oblique|rectus|transverse)/.test(haystack)) return 'core';
  if (/(shoulder|deltoid)/.test(haystack)) return 'barki';
  if (/(biceps|tricep|triceps|arm|forearm)/.test(haystack)) return 'ramiona';
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
        d: desc || title || `Wykonaj ćwiczenie ${fallbackName}.`,
        tip: step?.tip && step.tip.text ? {
          type: step.tip.type === 'warn' ? 'warn' : 'info',
          text: stripGuideHtml(step.tip.text)
        } : null
      };
    })
    .filter(Boolean);

  if (normalizedSteps.length) return normalizedSteps;

  return [
    { t: 'Ustawienie', d: fallbackDesc || `Przygotuj pozycję startową do ćwiczenia ${fallbackName}.` },
    { t: 'Ruch', d: `Wykonaj kontrolowany ruch w ćwiczeniu ${fallbackName}.` },
    { t: 'Powrót', d: 'Wróć do pozycji startowej z pełną kontrolą.' }
  ];
}

function normalizeGuideBenefits(rawBenefits, primaryMuscles = [], secondaryMuscles = [], equipment = []) {
  if (Array.isArray(rawBenefits) && rawBenefits.length) {
    return rawBenefits.slice(0, 3).map((benefit, index) => ({
      icon: benefit?.icon || ['fitness_center', 'accessibility_new', 'monitoring'][index] || 'fitness_center',
      color: benefit?.color || ['var(--p)', 'var(--s)', 'var(--t)'][index] || 'var(--p)',
      t: stripGuideHtml(benefit?.t || benefit?.title || `Korzyść ${index + 1}`),
      d: stripGuideHtml(benefit?.d || benefit?.description || '')
    }));
  }

  const cards = [];
  const primaryLabel = primaryMuscles.slice(0, 3).join(', ');
  const secondaryLabel = secondaryMuscles.slice(0, 3).join(', ');
  const equipmentLabel = equipment.slice(0, 3).join(', ');

  if (primaryLabel) {
    cards.push({ icon: 'fitness_center', color: 'var(--p)', t: 'Główna praca', d: `Najbardziej pracują: ${primaryLabel}.` });
  }

  if (secondaryLabel) {
    cards.push({ icon: 'accessibility_new', color: 'var(--s)', t: 'Wspiera ruch', d: `Pomagają albo stabilizują: ${secondaryLabel}.` });
  }

  if (equipmentLabel) {
    cards.push({ icon: 'monitoring', color: 'var(--t)', t: 'Sprzęt', d: `Wystarczy: ${equipmentLabel}.` });
  }

  while (cards.length < 3) {
    cards.push({
      icon: ['fitness_center', 'accessibility_new', 'monitoring'][cards.length],
      color: ['var(--p)', 'var(--s)', 'var(--t)'][cards.length],
      t: ['Technika', 'Kontrola', 'Progresja'][cards.length],
      d: [
        'Utrzymaj stabilną pozycję i zakres, który faktycznie kontrolujesz.',
        'Prowadź każde powtórzenie spokojnie, bez szarpania.',
        'Dodawaj trudność dopiero po opanowaniu techniki.'
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
  const cat = normalizeGuideCategoryId(rawExercise?.cat || inferGuideCategory(rawExercise?.category, primaryMuscles, secondaryMuscles));
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
    desc: desc || `Ćwiczenie ${name} zaimportowane do encyklopedii.`,
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
    .sort((left, right) => getGuideCategoryLabel(left).localeCompare(getGuideCategoryLabel(right)))
    .map(categoryId => ({
      id: categoryId,
      label: getGuideCategoryLabel(categoryId)
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
