import { useState, useRef, useCallback } from "react";

// ─── DATA: QUIZ 1 - VÝBĚR TYPU KOLA ───

const questions = [
  {
    id: 1,
    question: "Kde budeš nejčastěji jezdit?",
    subtitle: "Vyber povrch, na kterém strávíš nejvíc času",
    multiplier: 1.5,
    options: [
      { label: "Asfalt a silnice", icon: "🛣️", desc: "Městské cesty, cyklotrasy, silnice", tags: { road: 3, gravel: 0, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 2, cross: 1, cx: 0, fitness: 2 } },
      { label: "Mix silnic a lehkého terénu", icon: "🌾", desc: "Polní cesty, štěrk, cyklostezky", tags: { road: 0, gravel: 3, mtb_xc: 1, mtb_trail: 1, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 2, cx: 1, fitness: 1 } },
      { label: "Terén — lesy, traily, hory", icon: "⛰️", desc: "Singltreky, kořeny, kameny", tags: { road: 0, gravel: 1, mtb_xc: 2, mtb_trail: 3, mtb_enduro: 3, mtb_dh: 2, city: 0, cross: 0, cx: 0, fitness: 0 } },
      { label: "Hlavně po městě", icon: "🏙️", desc: "Dojíždění, nákupy, město", tags: { road: 1, gravel: 0, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 1, cx: 0, fitness: 2 } },
    ],
  },
  {
    id: 2,
    question: "Jaký je tvůj hlavní cíl?",
    subtitle: "Co tě na kole baví nebo co potřebuješ",
    multiplier: 1.5,
    options: [
      { label: "Rychlost a výkon", icon: "⚡", desc: "Trénink, závody, segmenty", tags: { road: 3, gravel: 1, mtb_xc: 3, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 1, cx: 2, fitness: 2 } },
      { label: "Objevování a dobrodružství", icon: "🧭", desc: "Nová místa, víkendové výlety", tags: { road: 1, gravel: 3, mtb_xc: 1, mtb_trail: 2, mtb_enduro: 1, mtb_dh: 0, city: 0, cross: 2, cx: 0, fitness: 0 } },
      { label: "Adrenalin a technická jízda", icon: "🔥", desc: "Sjezdy, skoky, traily, bikeparky", tags: { road: 0, gravel: 0, mtb_xc: 0, mtb_trail: 2, mtb_enduro: 3, mtb_dh: 3, city: 0, cross: 0, cx: 0, fitness: 0 } },
      { label: "Praktické dojíždění a kondice", icon: "💼", desc: "Do práce, po městě, udržení formy", tags: { road: 1, gravel: 1, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 2, cx: 0, fitness: 3 } },
    ],
  },
  {
    id: 3,
    question: "Jaká pozice na kole ti vyhovuje?",
    subtitle: "Ovlivňuje typ řídítek i geometrii kola",
    multiplier: 1.2,
    options: [
      { label: "Sportovní, předkloněná", icon: "🏎️", desc: "Závodní pozice, drop řídítka (beranidla)", tags: { road: 3, gravel: 2, mtb_xc: 1, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 0, cx: 3, fitness: 0 } },
      { label: "Mírně předkloněná", icon: "🚴", desc: "Sportovní ale pohodlná, rovná řídítka", tags: { road: 0, gravel: 1, mtb_xc: 3, mtb_trail: 2, mtb_enduro: 1, mtb_dh: 0, city: 0, cross: 2, cx: 0, fitness: 3 } },
      { label: "Vzpřímená a pohodlná", icon: "🧘", desc: "Relaxovaná pozice, vidím daleko", tags: { road: 0, gravel: 0, mtb_xc: 0, mtb_trail: 1, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 3, cx: 0, fitness: 1 } },
      { label: "Je mi to jedno / nevím", icon: "🤷", desc: "Nechám se poradit", tags: { road: 1, gravel: 2, mtb_xc: 1, mtb_trail: 2, mtb_enduro: 1, mtb_dh: 1, city: 1, cross: 1, cx: 0, fitness: 1 } },
    ],
  },
  {
    id: 4,
    question: "Jak dlouhé budou tvoje typické jízdy?",
    subtitle: "Průměrná délka jednoho výjezdu",
    multiplier: 1.0,
    options: [
      { label: "Do 20 km", icon: "📍", desc: "Krátké jízdy po okolí", tags: { road: 0, gravel: 1, mtb_xc: 0, mtb_trail: 2, mtb_enduro: 2, mtb_dh: 3, city: 3, cross: 1, cx: 1, fitness: 2 } },
      { label: "20 – 60 km", icon: "🗺️", desc: "Střední výlety a tréninky", tags: { road: 2, gravel: 3, mtb_xc: 3, mtb_trail: 2, mtb_enduro: 1, mtb_dh: 0, city: 1, cross: 3, cx: 2, fitness: 3 } },
      { label: "60 – 120 km", icon: "🚴", desc: "Delší tréninky a výlety", tags: { road: 3, gravel: 2, mtb_xc: 2, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 2, cx: 1, fitness: 1 } },
      { label: "120+ km", icon: "🏔️", desc: "Ultra a vícedenní akce", tags: { road: 3, gravel: 2, mtb_xc: 1, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 1, cx: 0, fitness: 0 } },
    ],
  },
  {
    id: 5,
    question: "Jak důležitý je pro tebe komfort?",
    subtitle: "Tvoje tolerance na tvrdší podvozek",
    multiplier: 1.2,
    options: [
      { label: "Výkon nad komfort", icon: "🏁", desc: "Tvrdý podvozek mi nevadí", tags: { road: 3, gravel: 1, mtb_xc: 3, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 1, cx: 3, fitness: 1 } },
      { label: "Vyvážený mix", icon: "⚖️", desc: "Chci obojí", tags: { road: 1, gravel: 3, mtb_xc: 1, mtb_trail: 3, mtb_enduro: 1, mtb_dh: 0, city: 1, cross: 3, cx: 1, fitness: 2 } },
      { label: "Komfort je klíčový", icon: "🛋️", desc: "Pohodlná jízda, vzpřímená pozice", tags: { road: 0, gravel: 1, mtb_xc: 0, mtb_trail: 1, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 2, cx: 0, fitness: 2 } },
      { label: "Plné odpružení", icon: "🔧", desc: "Maximální kontrola v terénu", tags: { road: 0, gravel: 0, mtb_xc: 0, mtb_trail: 2, mtb_enduro: 3, mtb_dh: 3, city: 0, cross: 0, cx: 0, fitness: 0 } },
    ],
  },
  {
    id: 6,
    question: "Budeš převážet náklad?",
    subtitle: "Batoh, brašny, nákupy...",
    multiplier: 0.7,
    options: [
      { label: "Ne, jedu nalehko", icon: "🪶", desc: "Jen láhev a mobil", tags: { road: 3, gravel: 1, mtb_xc: 3, mtb_trail: 2, mtb_enduro: 3, mtb_dh: 3, city: 0, cross: 0, cx: 3, fitness: 2 } },
      { label: "Občas batoh", icon: "🎒", desc: "Menší náklad sem tam", tags: { road: 1, gravel: 2, mtb_xc: 1, mtb_trail: 1, mtb_enduro: 1, mtb_dh: 0, city: 1, cross: 2, cx: 0, fitness: 2 } },
      { label: "Ano, brašny a nosič", icon: "🧳", desc: "Pravidelné převážení věcí", tags: { road: 0, gravel: 3, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 2, cross: 3, cx: 0, fitness: 0 } },
      { label: "Velký náklad / děti", icon: "📦", desc: "Nákupy, vozík, cargo", tags: { road: 0, gravel: 1, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 2, cx: 0, fitness: 0 } },
    ],
  },
  {
    id: 7,
    question: "Jaký je tvůj rozpočet?",
    subtitle: "Orientační budget na kompletní kolo",
    multiplier: 1.0,
    options: [
      { label: "Do 15 000 Kč", icon: "💰", desc: "Entry level", tags: { road: 1, gravel: 1, mtb_xc: 1, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 2, cx: 0, fitness: 2 } },
      { label: "15 – 35 000 Kč", icon: "💰💰", desc: "Střední třída", tags: { road: 2, gravel: 2, mtb_xc: 2, mtb_trail: 2, mtb_enduro: 1, mtb_dh: 0, city: 2, cross: 2, cx: 1, fitness: 3 } },
      { label: "35 – 70 000 Kč", icon: "💰💰💰", desc: "Vyšší třída", tags: { road: 3, gravel: 3, mtb_xc: 3, mtb_trail: 3, mtb_enduro: 3, mtb_dh: 2, city: 1, cross: 2, cx: 2, fitness: 2 } },
      { label: "70 000+ Kč", icon: "💎", desc: "Premium segment", tags: { road: 3, gravel: 3, mtb_xc: 3, mtb_trail: 3, mtb_enduro: 3, mtb_dh: 3, city: 0, cross: 1, cx: 3, fitness: 1 } },
    ],
  },
  {
    id: 8,
    question: "Jaké jsou tvoje zkušenosti s koly?",
    subtitle: "Upřímně — neexistuje špatná odpověď",
    multiplier: 1.0,
    options: [
      { label: "Začátečník", icon: "🌱", desc: "Déle jsem nejezdil / začínám", tags: { road: 0, gravel: 1, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 2, cx: 0, fitness: 2 } },
      { label: "Rekreační jezdec", icon: "😊", desc: "Jezdím sem tam, baví mě to", tags: { road: 1, gravel: 2, mtb_xc: 1, mtb_trail: 2, mtb_enduro: 0, mtb_dh: 0, city: 2, cross: 3, cx: 0, fitness: 3 } },
      { label: "Pokročilý", icon: "💪", desc: "Pravidelně jezdím, znám základy", tags: { road: 2, gravel: 3, mtb_xc: 3, mtb_trail: 3, mtb_enduro: 2, mtb_dh: 1, city: 0, cross: 1, cx: 2, fitness: 1 } },
      { label: "Zkušený", icon: "🏆", desc: "Roky zkušeností, vím co chci", tags: { road: 3, gravel: 2, mtb_xc: 3, mtb_trail: 2, mtb_enduro: 3, mtb_dh: 3, city: 0, cross: 0, cx: 3, fitness: 0 } },
    ],
  },
  {
    id: 9,
    question: "Chceš elektropohon?",
    subtitle: "E-bike není podvádění — je to technologie",
    multiplier: 1.0,
    options: [
      { label: "Ne, jen svaly", icon: "🦵", desc: "Klasické kolo", tags: { ebike: false } },
      { label: "Proč ne", icon: "🔋", desc: "Otevřený/á tomu", tags: { ebike: "open" } },
      { label: "Ano, určitě", icon: "⚡", desc: "Chci motor na pomoc", tags: { ebike: true } },
    ],
  },
];

// Dynamic follow-up questions triggered by specific answer patterns
const dynamicQuestions = [
  {
    id: "dyn_mtb_style",
    trigger: (answers, qs) => {
      // If Q1=terrain OR Q2=adrenalin → ask about MTB style
      const q1 = qs[0].options[answers[0]];
      const q2 = qs[1].options[answers[1]];
      if (!q1 || !q2) return false;
      const terrainPick = answers[0] === 2; // "Terén"
      const adrenalinPick = answers[1] === 2; // "Adrenalin"
      return terrainPick || adrenalinPick;
    },
    question: "Jaký styl terénní jízdy tě láká?",
    subtitle: "Pomůže nám rozlišit mezi typy horských kol",
    multiplier: 1.3,
    options: [
      { label: "Rychlé a efektivní šlapání", icon: "🏅", desc: "Maratony, XC závody, kondice v terénu", tags: { road: 0, gravel: 0, mtb_xc: 3, mtb_trail: 1, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 0, cx: 0, fitness: 0 } },
      { label: "Hravé traily a singltreky", icon: "🌲", desc: "Mix výjezdů a sjezdů, celodenní výlety", tags: { road: 0, gravel: 0, mtb_xc: 1, mtb_trail: 3, mtb_enduro: 1, mtb_dh: 0, city: 0, cross: 0, cx: 0, fitness: 0 } },
      { label: "Agresivní sjezdy a skoky", icon: "💥", desc: "Enduro závody, náročný terén, dropy", tags: { road: 0, gravel: 0, mtb_xc: 0, mtb_trail: 1, mtb_enduro: 3, mtb_dh: 2, city: 0, cross: 0, cx: 0, fitness: 0 } },
      { label: "Bikeparky a sjezdovky", icon: "🎢", desc: "Čistě sjezd, lanovka nahoru", tags: { road: 0, gravel: 0, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 1, mtb_dh: 3, city: 0, cross: 0, cx: 0, fitness: 0 } },
    ],
  },
  {
    id: "dyn_road_style",
    trigger: (answers, qs) => {
      // If Q1=asfalt OR Q2=rychlost → ask about road style
      const asphaltPick = answers[0] === 0; // "Asfalt"
      const speedPick = answers[1] === 0; // "Rychlost"
      return asphaltPick && speedPick;
    },
    question: "Jak chceš jezdit na silnici?",
    subtitle: "Pomůže rozlišit mezi silničním, fitness a gravel kolem",
    multiplier: 1.3,
    options: [
      { label: "Čistě závodní styl", icon: "🏁", desc: "Maximum rychlosti, závody, Strava segmenty", tags: { road: 3, gravel: 0, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 0, cx: 1, fitness: 0 } },
      { label: "Sportovní, ale i výlety", icon: "🚴", desc: "Delší vyjížďky, občas skupinová jízda", tags: { road: 2, gravel: 2, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 0, cx: 0, fitness: 1 } },
      { label: "Kondice s rovnými řídítky", icon: "🏃", desc: "Nechci berany, chci pohodlí a rychlost", tags: { road: 0, gravel: 0, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 1, cx: 0, fitness: 3 } },
    ],
  },
  {
    id: "dyn_practical",
    trigger: (answers, qs) => {
      // If Q1=město OR Q2=dojíždění → ask about maintenance
      const cityPick = answers[0] === 3; // "Město"
      const commutePick = answers[1] === 3; // "Dojíždění"
      return cityPick || commutePick;
    },
    question: "Jak moc chceš kolo udržovat?",
    subtitle: "Vliv na typ převodovky a celkovou konstrukci",
    multiplier: 1.2,
    options: [
      { label: "Minimálně — chci klid", icon: "🧘", desc: "Nábové řazení, řemen, bez starostí", tags: { road: 0, gravel: 0, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 1, cx: 0, fitness: 0 } },
      { label: "Základní údržba OK", icon: "🔧", desc: "Promazat řetěz, dofoukat kola", tags: { road: 1, gravel: 1, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 1, cross: 3, cx: 0, fitness: 2 } },
      { label: "Nevadí mi to", icon: "⚙️", desc: "Rád šteluju, baví mě technika", tags: { road: 2, gravel: 2, mtb_xc: 1, mtb_trail: 1, mtb_enduro: 1, mtb_dh: 0, city: 0, cross: 0, cx: 1, fitness: 1 } },
    ],
  },
];

// Combo bonuses for typical rider personas
const comboRules = [
  // Gravel bikepacker: mix terrain + adventure + bags
  { conditions: { 0: 1, 1: 1, 5: 2 }, bonuses: { gravel: 4 } },
  // XC racer: terrain + speed + performance over comfort
  { conditions: { 0: 2, 1: 0, 4: 0 }, bonuses: { mtb_xc: 4 } },
  // City commuter: city + practical + comfort
  { conditions: { 0: 3, 1: 3, 4: 2 }, bonuses: { city: 4 } },
  // Road racer: asphalt + speed + sport position
  { conditions: { 0: 0, 1: 0, 2: 0 }, bonuses: { road: 4 } },
  // Trail explorer: terrain + adventure + balanced comfort
  { conditions: { 0: 2, 1: 1, 4: 1 }, bonuses: { mtb_trail: 4 } },
  // Enduro shredder: terrain + adrenalin + full suspension
  { conditions: { 0: 2, 1: 2, 4: 3 }, bonuses: { mtb_enduro: 4 } },
  // Fitness commuter: asphalt + practical + light position
  { conditions: { 0: 0, 1: 3, 2: 1 }, bonuses: { fitness: 3 } },
  // Trekking tourist: mix terrain + adventure + bags + comfort
  { conditions: { 0: 1, 1: 1, 4: 2 }, bonuses: { cross: 3 } },
];

// Minimum realistic budget per bike type (in CZK)
const minBudget = {
  road: 15000, gravel: 18000, mtb_xc: 15000, mtb_trail: 25000,
  mtb_enduro: 35000, mtb_dh: 45000, city: 8000, cross: 10000,
  cx: 25000, fitness: 12000,
};
const budgetLabels = {
  0: 15000, 1: 35000, 2: 70000, 3: 999999,
};

// budget: 0=do15k, 1=15-35k, 2=35-70k, 3=70k+
// experience: 0=začátečník, 1=rekreační, 2=pokročilý, 3=zkušený
// goal: 0=rychlost, 1=dobrodružství, 2=adrenalin, 3=praktické
const bikeProfiles = {
  road: { name: "Silniční kolo", icon: "🚴‍♂️", color: "#C62828", description: "Rychlé, lehké kolo stvořené na asfalt. Ideální na trénink, závody i dlouhé výjezdy po silnicích.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget <= 1) {
        p.params = ["Rám: Hliník", "Kola: 700c, pláště 25–28 mm", "Převodovka: 2×8 nebo 2×9", "Brzdy: Ráfkové (dual-pivot)", "Hmotnost: 9–11 kg"];
        p.tip = "V rozpočtu do 35 000 Kč hledej hliníkový rám. Důležitější než rám je kvalitní sada řazení — cíl na aspoň 2×9 rychlostí.";
      } else if (budget === 2) {
        p.params = ["Rám: Hliník nebo entry karbon", "Kola: 700c, pláště 25–30 mm", "Převodovka: 2×11", "Brzdy: Kotoučové hydraulické", "Hmotnost: 8–9.5 kg"];
        p.tip = "Od 35 000 Kč se dostaneš ke kotoučovým brzdám a kvalitnějšímu řazení. Karbonová vidlice výrazně zlepší komfort.";
      } else {
        p.params = ["Rám: Karbon", "Kola: 700c, pláště 25–32 mm", "Převodovka: 2×12 nebo elektronické řazení", "Brzdy: Hydraulické kotoučové", "Hmotnost: 7–8 kg"];
        p.tip = "V premium segmentu rozhoduje geometrie, tuhost a komfort rámu. Vyzkoušej kolo osobně — každá značka sedí jinak.";
      }
      if (goal === 0) p.tip += " Pro závodní ambice preferuj aerodynamickou geometrii a užší pláště.";
      if (xp <= 1) p.tip += " Jako začátečník zvažuj komfortnější geometrii (endurance) místo čistě závodní.";
      return p;
    }},
  gravel: { name: "Gravel bike", icon: "🌄", color: "#37474F", description: "Univerzál na silnice i terén. Zvládne štěrk, les, polní cesty i asfalt. Král dobrodružství.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget <= 1) {
        p.params = ["Rám: Hliník", "Kola: 700c, pláště 35–40 mm", "Převodovka: 2×8/9 nebo 1×10", "Brzdy: Mechanické kotoučové", "Hmotnost: 10–12 kg"];
        p.tip = "Entry gravel do 35 000 Kč — hledej alespoň kotoučové brzdy a prostor pro široké pláště (min. 40 mm).";
      } else if (budget === 2) {
        p.params = ["Rám: Hliník s karbonovou vidlicí", "Kola: 700c nebo 650b, pláště 38–50 mm", "Převodovka: 1×11 nebo 2×11", "Brzdy: Hydraulické kotoučové", "Hmotnost: 9–10.5 kg"];
        p.tip = "Středně-vyšší třída gravelu. Hydraulické brzdy jsou must-have. Karbonová vidlice výrazně tlumí vibrace na štěrku.";
      } else {
        p.params = ["Rám: Karbon", "Kola: 700c/650b, pláště 38–50 mm", "Převodovka: 1×12 nebo 2×12", "Brzdy: Hydraulické kotoučové", "Hmotnost: 8–9.5 kg"];
        p.tip = "Premium gravel — karbon výrazně tlumí vibrace a šetří váhu. Elektronické řazení zvyšuje spolehlivost v blátě.";
      }
      if (goal === 1) p.tip += " Pro dobrodružství a bikepacking hledej model s úchyty na brašny (min. 3 páry šroubů na rámu).";
      if (goal === 0) p.tip += " Pro rychlou jízdu zvol užší pláště 32–38 mm a agresivnější geometrii.";
      return p;
    }},
  mtb_xc: { name: "MTB Cross-country (XC)", icon: "🏅", color: "#1B5E20", description: "Závodní horské kolo pro rychlost a efektivitu. Maratony, XC závody, rychlé jízdy krajinou.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget <= 1) {
        p.params = ["Rám: Hliník, hardtail", "Kola: 29 palců", "Vidlice: Vzduchová, zdvih 100 mm", "Převodovka: 1×10 nebo 1×11", "Hmotnost: 11–13 kg"];
        p.tip = "XC hardtail je skvělý start. Klíčové je mít vzduchovou vidlici (ne pružinovou) — dá se nastavit na tvou váhu.";
      } else if (budget === 2) {
        p.params = ["Rám: Hliník nebo karbon, hardtail/full 100 mm", "Kola: 29 palců", "Vidlice: Vzduchová, zdvih 100–120 mm", "Převodovka: 1×12", "Hmotnost: 9.5–11 kg"];
        p.tip = "Od 35 000 Kč zvažuj full-suspension XC — lepší trakce a komfort. Hardtail v této ceně bude mít špičkové komponenty.";
      } else {
        p.params = ["Rám: Karbon, full-sus 100–120 mm", "Kola: 29 palců", "Vidlice: Vzduchová premium, zdvih 100–120 mm", "Převodovka: 1×12", "Hmotnost: 8–10 kg"];
        p.tip = "Závodní XC — každý gram se počítá. Karbonový full-sus s teleskopickou sedlovkou je dnes standard i na hobby úrovni.";
      }
      if (xp <= 1) p.tip += " Jako méně zkušený jezdec ocen hardtail — je jednodušší na údržbu a naučíš se na něm lepší techniku.";
      return p;
    }},
  mtb_trail: { name: "MTB Trail / All-mountain", icon: "🌲", color: "#2E7D32", description: "Nejuniverzálnější horské kolo. Traily, výlety, singltreky — zvládne výjezdy i sjezdy.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget <= 1) {
        p.params = ["Rám: Hliník, hardtail", "Kola: 29 palců nebo 27.5 palců", "Vidlice: Vzduchová, zdvih 120–140 mm", "Převodovka: 1×10 nebo 1×11", "Hmotnost: 13–15 kg"];
        p.tip = "Trail hardtail do 35 000 Kč je skvělý vstup. Moderní hardtail se zdvihem 130–140 mm zvládne překvapivě hodně.";
      } else if (budget === 2) {
        p.params = ["Rám: Hliník, full-sus 130–150 mm", "Kola: 29 palců", "Vidlice: Vzduchová, zdvih 140–150 mm", "Převodovka: 1×12", "Hmotnost: 13–15 kg"];
        p.tip = "Full-sus trail bike od 35 000 Kč — zlatý standard pro většinu jezdců. Teleskopická sedlovka je must-have.";
      } else {
        p.params = ["Rám: Karbon, full-sus 130–150 mm", "Kola: 29 palců", "Vidlice: Vzduchová premium, zdvih 140–150 mm", "Převodovka: 1×12", "Hmotnost: 12–13.5 kg"];
        p.tip = "Premium trail — karbonový rám šetří váhu i na full-susu. Investice do kvalitního odpružení se vrátí na každé jízdě.";
      }
      if (goal === 1) p.tip += " Pro celodenní výlety zvol model s pohodlnější geometrií a prostorem pro láhev v rámu.";
      if (xp <= 1) p.tip += " Trail bike je ideální první 'vážné' MTB -- zvládne výjezdy i sjezdy bez toho, aby tě limitovalo.";
      return p;
    }},
  mtb_enduro: { name: "MTB Enduro / Freeride", icon: "💥", color: "#E65100", description: "Agresivní kolo pro náročný terén, strmé sjezdy, skoky a enduro závody. Sjede i vyjede.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget <= 2) {
        p.params = ["Rám: Hliník, full-sus 150–170 mm", "Kola: 29 palců nebo mullet (29/27.5)", "Vidlice: Vzduchová, zdvih 160–170 mm", "Převodovka: 1×12, robustní", "Hmotnost: 14–16 kg"];
        p.tip = "Enduro od 35 000 Kč — hledej kvalitní odpružení, silné brzdy a robustní kola. Na rámu šetři, na odpružení ne.";
      } else {
        p.params = ["Rám: Karbon nebo high-end hliník, full-sus 160–180 mm", "Kola: 29 palců nebo mullet", "Vidlice: Vzduchová premium, zdvih 170–180 mm", "Převodovka: 1×12", "Hmotnost: 13.5–15.5 kg"];
        p.tip = "Premium enduro — karbonový rám šetří váhu při zachování tuhosti. Kvalitní odpružení s nastavitelnou kompresí je klíčové.";
      }
      if (xp <= 1) p.tip += " Enduro je náročné na techniku — zvažuj, jestli pro začátek nestačí trail bike se zdvihem 140 mm.";
      if (goal === 2) p.tip += " Pro závodní enduro hledej model s efektivní geometrií do výjezdů — ne jen sjezdový speciál.";
      return p;
    }},
  mtb_dh: { name: "MTB Downhill", icon: "⬇️", color: "#B71C1C", description: "Speciál na sjezdy a bikeparky. Maximální odpružení, robustnost a kontrola při vysoké rychlosti.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      p.params = ["Rám: Hliník nebo karbon, full-sus 180–200+ mm", "Kola: 29 palců nebo 27.5 palců", "Vidlice: Inverted (USD), zdvih 200 mm", "Brzdy: 4pístové, kotouče 200+ mm", "Hmotnost: 15–19 kg"];
      if (budget <= 2) {
        p.tip = "DH kolo je speciál — kupuj ho pouze pokud pravidelně jezdíš bikeparky. Jinak je enduro univerzálnější volba.";
      } else {
        p.tip = "Premium DH kolo s karbonovým rámem a špičkovým odpružením. Dává smysl pro pravidelné závodní použití.";
      }
      if (xp <= 1) p.tip += " Jako méně zkušený jezdec zvažuj spíš enduro — zvládne bikeparky i výjezdy, a je bezpečnější pro učení.";
      return p;
    }},
  city: { name: "Městské / Trekkingové kolo", icon: "🏙️", color: "#F9A825", description: "Spolehlivý společník na dojíždění a město. Vzpřímená pozice, světla, blatníky, nosič.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget === 0) {
        p.params = ["Rám: Hliník", "Kola: 28 palců s blatníky", "Převodovka: 1×7/8 nebo 3×7", "Brzdy: V-brake", "Výbava: Blatníky, nosič, stojan"];
        p.tip = "Základní městské kolo — hledej hliníkový rám (ne ocel), blatníky a nosič v základu. Ušetříš za dovybavení.";
      } else if (budget <= 2) {
        p.params = ["Rám: Hliník (step-through nebo klasický)", "Kola: 28 palců s blatníky", "Převodovka: Nábové řazení (Nexus 7/8) nebo 1×9", "Brzdy: Kotoučové nebo V-brake", "Výbava: Světla, nosič, blatníky, zámek"];
        p.tip = "Nábové řazení je ideální na město — uzavřené převody, minimální údržba, čisté. Řemenový pohon = žádné mazání.";
      } else {
        p.params = ["Rám: Premium hliník, integrovaný design", "Kola: 28 palců", "Převodovka: Nábové řazení (Alfine 11) nebo Enviolo", "Brzdy: Hydraulické kotoučové", "Výbava: Integrované světla (dynamo), nosič, blatníky"];
        p.tip = "Premium městské kolo s integrovaným osvětlením, řemenem a bezúdržbovým nábovým řazením — elegance a spolehlivost.";
      }
      if (goal === 3) p.tip += " Pro dojíždění do práce jsou klíčové blatníky, světla a zámok — ověř, že jsou v základní výbavě.";
      return p;
    }},
  cross: { name: "Krosové / Trekové kolo", icon: "🛤️", color: "#00695C", description: "Sportovní univerzál na cyklostezky a lehký terén. Rychlejší než MTB, odolnější než silnička.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget <= 1) {
        p.params = ["Rám: Hliník", "Kola: 28 palců, pláště 38–42 mm", "Vidlice: Odpružená 50–63 mm", "Převodovka: 3×8 nebo 1×9", "Hmotnost: 13–15 kg"];
        p.tip = "Krosové kolo do 35 000 Kč — nejprodávanější typ v ČR. Na cyklostezky a lehký terén plně postačí.";
      } else {
        p.params = ["Rám: Hliník, karbonová vidlice", "Kola: 28 palců, pláště 35–40 mm", "Vidlice: Odpružená s blokací nebo pevná", "Převodovka: 1×10/11", "Hmotnost: 11–13 kg"];
        p.tip = "Vyšší krosové kolo s možností blokace vidlice — na silnici zamkneš odpružení, v terénu odemkneš. Univerzální řešení.";
      }
      if (goal === 1) p.tip += " Pro cykloturistiku hledej úchyty na nosič a brašny — ideální je kolo připravené na dovybavení.";
      if (xp <= 1) p.tip += " Krosové kolo je skvělá volba pro začátek — zvládne většinu povrchů a snadno se na něm naučíš jezdit.";
      return p;
    }},
  cx: { name: "Cyklokrosové kolo", icon: "🏁", color: "#4A148C", description: "Závodní kolo na CX závody a zimní trénink. Lehké, mrštné, zvládne bláto i trávu.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget <= 2) {
        p.params = ["Rám: Hliník s karbonovou vidlicí", "Kola: 700c, pláště 33–40 mm se vzorkem", "Převodovka: 1×11", "Brzdy: Hydraulické kotoučové", "Hmotnost: 9–10.5 kg"];
        p.tip = "CX kolo je závodní speciál — pokud neplánuješ CX závody, gravel bike bude univerzálnější. CX má agresivnější geometrii.";
      } else {
        p.params = ["Rám: Karbon", "Kola: 700c, pláště 33–40 mm", "Převodovka: 1×12 nebo 1× elektronické", "Brzdy: Hydraulické kotoučové", "Hmotnost: 7.5–9 kg"];
        p.tip = "Závodní CX karbón — ultra lehké, tuhé, rychlé řazení. Na závody top, na výlety zvol radši gravel.";
      }
      if (xp <= 1) p.tip += " CX vyžaduje dobrou techniku jízdy v blátě a na trávě — bez závodních ambicí zvol gravel.";
      return p;
    }},
  fitness: { name: "Fitness kolo", icon: "🏃", color: "#0277BD", description: "Rychlé městské kolo s rovnými řídítky. Sportovnější než krosové, pohodlnější než silniční.",
    getParams: (budget, xp, goal) => {
      const p = { params: [], tip: "" };
      if (budget <= 1) {
        p.params = ["Rám: Hliník", "Kola: 28 palců, pláště 32–35 mm", "Převodovka: 2×8/9 nebo 1×9", "Brzdy: Mechanické kotoučové", "Hmotnost: 10–12 kg"];
        p.tip = "Fitness kolo do 35 000 Kč — rovinaté řidítka pro pohodlnější pozici než silnička, ale rychlejší než krosové kolo.";
      } else {
        p.params = ["Rám: Hliník, karbonová vidlice", "Kola: 28 palců, pláště 28–32 mm", "Převodovka: 1×11 nebo 2×10", "Brzdy: Hydraulické kotoučové", "Hmotnost: 9–10.5 kg"];
        p.tip = "Vyšší fitness kolo s karbonovou vidlicí a hydraulickými brzdami. Skvělý kompromis pro kondici i dojíždění.";
      }
      if (goal === 3) p.tip += " Pro dojíždění zvažuj model s úchyty na blatníky a nosič — fitness kolo s výbavou je super komuter.";
      if (xp <= 1) p.tip += " Fitness kolo je ideální pokud chceš sportovní jízdu bez nutnosti učit se jezdit s berany (drop řídítky).";
      return p;
    }},
};

// ─── DATA: QUIZ 2 - VELIKOST KOLA (v2 — precise inputs) ───

// Brand-specific sizing tables: array of {size, min, max} where min/max = height in cm
const brandTables = {
  trek: {
    name: "Trek",
    mtb: [{s:"XS",min:137,max:155},{s:"S",min:153,max:166},{s:"M",min:161,max:172},{s:"M/L",min:165,max:179},{s:"L",min:177,max:188},{s:"XL",min:186,max:196},{s:"2XL",min:195,max:203}],
    road: [{s:"44",min:150,max:153},{s:"47",min:152,max:158},{s:"50",min:158,max:163},{s:"52",min:163,max:168},{s:"54",min:168,max:174},{s:"56",min:174,max:180},{s:"58",min:180,max:185},{s:"60",min:185,max:190},{s:"62",min:190,max:195}],
    gravel: [{s:"XS",min:143,max:158},{s:"S",min:158,max:162},{s:"M",min:162,max:173},{s:"ML",min:173,max:179},{s:"L",min:179,max:188},{s:"XL",min:188,max:213}],
  },
  cannondale: {
    name: "Cannondale",
    mtb: [{s:"S (15\")",min:160,max:170},{s:"M (17\")",min:170,max:178},{s:"L (19\")",min:178,max:188},{s:"XL (21\")",min:188,max:196}],
    road: [{s:"48 (XXS)",min:152,max:162},{s:"50 (XS)",min:162,max:166},{s:"52 (S)",min:166,max:170},{s:"54 (M)",min:170,max:178},{s:"56 (L)",min:178,max:182},{s:"58 (XL)",min:182,max:188},{s:"60 (XXL)",min:188,max:192},{s:"63 (XXXL)",min:192,max:200}],
    cross: [{s:"XS (14\")",min:152,max:162},{s:"S (16\")",min:162,max:168},{s:"M (18\")",min:168,max:178},{s:"L (20\")",min:178,max:186},{s:"XL (22\")",min:186,max:192},{s:"XXL (24\")",min:192,max:200}],
  },
  superior: {
    name: "Superior",
    mtb: [{s:"XS (13-14\")",min:145,max:165},{s:"S (15.5-16.5\")",min:160,max:170},{s:"M (17.5-18\")",min:170,max:180},{s:"L (19-20\")",min:180,max:190},{s:"XL (21-22\")",min:190,max:200},{s:"XXL (23\")",min:195,max:205}],
    road: [{s:"XS (50cm)",min:160,max:175},{s:"S (52cm)",min:170,max:180},{s:"M (54cm)",min:175,max:185},{s:"L (56cm)",min:180,max:190},{s:"XL (58cm)",min:185,max:200}],
    cross: [{s:"XS (13-14\")",min:145,max:165},{s:"S (15.5-16.5\")",min:160,max:170},{s:"M (17.5-18\")",min:170,max:180},{s:"L (19-20\")",min:180,max:190},{s:"XL (21-22\")",min:190,max:200},{s:"XXL (23\")",min:195,max:205}],
  },
  merida: {
    name: "Merida",
    mtb: [{s:"15\" (S)",min:155,max:165},{s:"17\" (M)",min:165,max:175},{s:"19\" (L)",min:175,max:185},{s:"21\" (XL)",min:185,max:200},{s:"23\" (XXL)",min:200,max:210}],
    road: [{s:"44 (XXS)",min:150,max:155},{s:"47 (XS)",min:155,max:163},{s:"50 (S)",min:163,max:172},{s:"52 (S/M)",min:172,max:177},{s:"54 (M/L)",min:177,max:183},{s:"56 (L)",min:183,max:192},{s:"59 (XL)",min:192,max:205}],
    cross: [{s:"41 (XS)",min:150,max:157},{s:"44 (S)",min:157,max:163},{s:"46 (S/M)",min:163,max:168},{s:"48 (M)",min:168,max:175},{s:"52 (L)",min:175,max:183},{s:"55 (XL)",min:183,max:193},{s:"58 (XXL)",min:193,max:200}],
  },
};

// Generic tables for "no brand" option — based on universal CZ sizing chart
const genericTables = {
  mtb: [{s:"XXS-XS (13-14\")",min:140,max:150},{s:"XS-S (15-16\")",min:150,max:160},{s:"S-M (17-18\")",min:160,max:170},{s:"M-L (18-20\")",min:170,max:180},{s:"L-XL (19-21\")",min:180,max:190},{s:"XL-XXL (21\"+)",min:190,max:210}],
  road: [{s:"XS-S (44-46 cm)",min:150,max:160},{s:"S-M (46-50 cm)",min:160,max:170},{s:"M-L (50-56 cm)",min:170,max:180},{s:"L-XL (55-59 cm)",min:180,max:190},{s:"XL-XXL (60 cm)",min:190,max:205}],
  gravel: [{s:"XS-S (44-46 cm)",min:150,max:160},{s:"S-M (46-50 cm)",min:160,max:170},{s:"M-L (50-56 cm)",min:170,max:180},{s:"L-XL (55-59 cm)",min:180,max:190},{s:"XL-XXL (60 cm)",min:190,max:205}],
  cross: [{s:"XS-S (16-17\")",min:150,max:160},{s:"S-M (17-18\")",min:160,max:170},{s:"M-L (18-20\")",min:170,max:180},{s:"L-XL (20-22\")",min:180,max:190},{s:"XL-XXL (22\"+)",min:190,max:205}],
  city: [{s:"XS-S (16-17\")",min:150,max:160},{s:"S-M (17-18\")",min:160,max:170},{s:"M-L (18-20\")",min:170,max:180},{s:"L-XL (20-22\")",min:180,max:190},{s:"XL-XXL (22\"+)",min:190,max:205}],
};

// Inseam multipliers for frame size formula
const inseamMultipliers = { mtb: 0.574, road: 0.665, gravel: 0.635, cross: 0.61, city: 0.61 };

const btLabels = { mtb: "Horske kolo", road: "Silnicni kolo", gravel: "Gravel", cross: "Krosove kolo", city: "Mestske kolo" };

// Size quiz is now a custom interactive form, not step-by-step questions
function SizeQuizPage({ onBack, onMenu }) {
  const [sStep, setSStep] = useState(0);
  const [sData, setSData] = useState({ height: "", inseam: "", weight: "", bikeType: "mtb", brand: "generic", style: "neutral" });
  const [sAnim, setSAnim] = useState(false);
  const [sResult, setSResult] = useState(null);

  const upd = (k, v) => setSData({ ...sData, [k]: v });
  const sNext = () => { setSAnim(true); setTimeout(() => { setSStep(sStep + 1); setSAnim(false); }, 200); };
  const sBack = () => { if (sStep === 0) { onBack(); return; } setSAnim(true); setTimeout(() => { setSStep(sStep - 1); setSAnim(false); }, 200); };
  const canGo = () => {
    if (sStep === 0) { const h = parseInt(sData.height); return h >= 130 && h <= 220; }
    return true;
  };
  const sTot = 5;

  const calc = () => {
    const h = parseInt(sData.height); const ins = parseInt(sData.inseam); const bt = sData.bikeType;
    let table = (sData.brand !== "generic" && brandTables[sData.brand]) ? (brandTables[sData.brand][bt] || genericTables[bt]) : (genericTables[bt] || genericTables.mtb);
    const matches = [];
    table.forEach(r => { if (h >= r.min && h <= r.max) matches.push({ ...r, fit: "primary" }); });
    if (matches.length === 0) { let cl = table[0], md = 999; table.forEach(r => { const d = Math.abs(h-(r.min+r.max)/2); if(d<md){md=d;cl=r;} }); matches.push({...cl,fit:"closest"}); }
    let formulaSize = null;
    if (ins && ins >= 60 && ins <= 110) { const m = inseamMultipliers[bt]||0.574; const raw=ins*m; formulaSize={raw,inches:(raw/2.54).toFixed(1),cm:raw.toFixed(1)}; }
    let wheelRec = null;
    if (bt==="mtb") { if(h<165) wheelRec="27.5 palců — lepší ovladatelnost pro menší postavu"; else if(h<175) wheelRec="27.5 nebo 29 palců — oba budou fungovat, vyzkoušej obě"; else wheelRec="29 palců — standard pro tvou výšku"; }
    let weightNote = null; const w = parseInt(sData.weight);
    if (w&&w>100) weightNote="Ři vaší váze "+w+" kg doporučujeme robustnější ráfky (dvojstěnné), silnější výplety a širší pláště.";
    else if (w&&w>85) weightNote="Při výběru kola se ujisti, že ráfky a výplety odpovídají tvému zatížení.";
    let styleNote = null;
    if (matches.length>=1) { const idx=table.findIndex(r=>r.s===matches[0].s);
      if(sData.style==="sport"&&idx>0) styleNote="Pro sportovní jízdu můžeš zvolit menší rám "+table[idx-1].s+" — lepší ovladatelnost.";
      else if(sData.style==="comfort"&&idx<table.length-1) styleNote="Pro pohodlnější jízdu můžeš zvolit větší rám "+table[idx+1].s+" — větší stabilita.";
    }
    setSResult({ matches, formulaSize, wheelRec, weightNote, styleNote,
      brandName: sData.brand==="generic"?"Univerzální tabulka":brandTables[sData.brand].name,
      bikeTypeName: btLabels[bt]||bt, height:h, inseam:ins||null });
  };
  const doFinish = () => { setSAnim(true); setTimeout(()=>{calc();setSAnim(false);},300); };

  const inpS = { padding:"14px 16px", borderRadius:"12px", border:"2px solid #e0ddd5", background:"#faf8f4", fontSize:"18px", fontFamily:"'DM Sans',sans-serif", color:"#1a1a2e", width:"100%", boxSizing:"border-box", outline:"none", textAlign:"center" };

  // RESULT
  if (sResult) { const r=sResult; return (
    <div style={S.ctr}><style>{KF}</style><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <div style={S.inn}>
      <div style={{background:"linear-gradient(165deg,#f5f3ed,#ece8df)",borderRadius:"18px",padding:"24px 18px"}}>
        <div style={{textAlign:"center",marginBottom:"24px"}}>
          <h1 style={{...S.ttl,fontSize:"28px"}}>Tvoje velikost kola</h1>
          <p style={{...S.sub,margin:"3px 0 0"}}>{r.bikeTypeName} | {r.brandName} | {r.height} cm</p>
        </div>
        <div style={{background:"#1a1a2e",color:"#faf8f4",borderRadius:"16px",padding:"24px",opacity:0,animation:"fadeSlideIn 0.5s ease forwards"}}>
          <div style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"2px",opacity:0.7,marginBottom:"14px",fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>Doporučená velikost</div>
          <div style={{display:"flex",justifyContent:"center",gap:"16px",flexWrap:"wrap"}}>
            {r.matches.map((m,i)=>(<div key={i} style={{textAlign:"center",background:"rgba(255,255,255,0.1)",borderRadius:"12px",padding:"16px 24px",minWidth:"120px"}}>
              <div style={{fontSize:"26px",fontWeight:900,fontFamily:"'DM Sans',sans-serif"}}>{m.s}</div>
              <div style={{fontSize:"11px",opacity:0.6,marginTop:"4px",fontFamily:"'DM Sans',sans-serif"}}>{m.min}–{m.max} cm</div>
              {m.fit==="closest"&&<div style={{fontSize:"10px",opacity:0.5,marginTop:"4px"}}>nejbližší velikost</div>}
            </div>))}
          </div>
          {r.matches.length>1&&<div style={{marginTop:"14px",background:"rgba(255,255,255,0.08)",borderRadius:"10px",padding:"10px 14px",fontSize:"12px",fontFamily:"'DM Sans',sans-serif",opacity:0.8}}>Jsi na rozmezí dvou velikostí. Sportovní jezdci volí menší (hravější), výletní jezdci větší (stabilnější).</div>}
        </div>
        {r.formulaSize&&<div style={{background:"#faf8f4",border:"1px solid #e0ddd5",borderRadius:"12px",padding:"14px 18px",marginTop:"12px",opacity:0,animation:"fadeSlideIn 0.4s ease forwards",animationDelay:"0.15s"}}>
          <div style={{fontSize:"12px",fontWeight:700,marginBottom:"4px",fontFamily:"'DM Sans',sans-serif"}}>Výpočet z délky nohou ({r.inseam} cm)</div>
          <div style={{fontSize:"13px",color:"#555",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>Ideální velikost rámu: <strong>{r.formulaSize.cm} cm</strong> ({r.formulaSize.inches} palců). Porovnej s číslem v názvu velikosti.</div>
        </div>}
        {r.wheelRec&&<div style={{background:"#faf8f4",border:"1px solid #e0ddd5",borderRadius:"12px",padding:"14px 18px",marginTop:"10px",opacity:0,animation:"fadeSlideIn 0.4s ease forwards",animationDelay:"0.25s"}}>
          <div style={{fontSize:"12px",fontWeight:700,marginBottom:"4px",fontFamily:"'DM Sans',sans-serif"}}>Průměr kol</div>
          <div style={{fontSize:"13px",color:"#555",fontFamily:"'DM Sans',sans-serif"}}>{r.wheelRec}</div>
        </div>}
        {r.styleNote&&<div style={{background:"#faf8f4",border:"1px solid #e0ddd5",borderRadius:"12px",padding:"14px 18px",marginTop:"10px",opacity:0,animation:"fadeSlideIn 0.4s ease forwards",animationDelay:"0.35s"}}>
          <div style={{fontSize:"12px",fontWeight:700,marginBottom:"4px",fontFamily:"'DM Sans',sans-serif"}}>Styl jízdy</div>
          <div style={{fontSize:"13px",color:"#555",fontFamily:"'DM Sans',sans-serif"}}>{r.styleNote}</div>
        </div>}
        {r.weightNote&&<div style={{background:"#FFF8E1",border:"1px solid #FFE082",borderRadius:"12px",padding:"14px 18px",marginTop:"10px",opacity:0,animation:"fadeSlideIn 0.4s ease forwards",animationDelay:"0.45s"}}>
          <div style={{fontSize:"12px",fontWeight:700,marginBottom:"4px",fontFamily:"'DM Sans',sans-serif",color:"#8D6E00"}}>Hmotnost jezdce</div>
          <div style={{fontSize:"13px",color:"#8D6E00",fontFamily:"'DM Sans',sans-serif"}}>{r.weightNote}</div>
        </div>}
        <div style={{background:"#faf8f4",border:"1px solid #e0ddd5",borderRadius:"12px",padding:"14px 18px",marginTop:"10px",opacity:0,animation:"fadeSlideIn 0.4s ease forwards",animationDelay:"0.55s"}}>
          <div style={{fontSize:"12px",fontWeight:700,marginBottom:"4px",fontFamily:"'DM Sans',sans-serif"}}>Orientační údaje</div>
          <div style={{fontSize:"12px",color:"#555",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>Každý výrobce má jinou geometrii rámu. Vždy se řiď velikostní tabulkou konkrétního modelu a ideálně kolo vyzkoušej na prodejně.</div>
        </div>
      </div>
      <div style={{display:"flex",gap:"8px",marginTop:"18px",flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>{setSResult(null);setSStep(0);}} style={S.sec}>{"↺"} Zkusit znovu</button>
        <button onClick={onMenu} style={S.sec}>{"←"} Menu</button>
      </div>
    </div></div>);
  }

  // STEPS
  const stepContent = [
    ()=>(<div>
      <div style={{background:"#faf8f4",borderRadius:"14px",padding:"16px",border:"1px solid #e0ddd5",marginBottom:"16px"}}>
        <div style={{display:"flex",gap:"14px",alignItems:"flex-start"}}>
          <svg viewBox="0 0 60 120" width="45" style={{flexShrink:0}}>
            <circle cx="30" cy="15" r="7" fill="#1a1a2e"/><line x1="30" y1="22" x2="30" y2="55" stroke="#1a1a2e" strokeWidth="3"/>
            <line x1="30" y1="30" x2="18" y2="45" stroke="#1a1a2e" strokeWidth="2.5"/><line x1="30" y1="30" x2="42" y2="45" stroke="#1a1a2e" strokeWidth="2.5"/>
            <line x1="30" y1="55" x2="20" y2="85" stroke="#1a1a2e" strokeWidth="2.5"/><line x1="30" y1="55" x2="40" y2="85" stroke="#1a1a2e" strokeWidth="2.5"/>
            <line x1="5" y1="4" x2="5" y2="88" stroke="#C62828" strokeWidth="1.5" strokeDasharray="3,2"/>
            <line x1="3" y1="4" x2="7" y2="4" stroke="#C62828" strokeWidth="1.5"/><line x1="3" y1="88" x2="7" y2="88" stroke="#C62828" strokeWidth="1.5"/>
          </svg>
          <div style={{fontSize:"12px",lineHeight:1.6,color:"#555",fontFamily:"'DM Sans',sans-serif"}}>Postav se bos{"ý"} z{"á"}dy ke st{"ě"}n{"ě"} a zm{"ě"}{"ř"} vzd{"á"}lenost od podlahy po vrch hlavy.</div>
        </div>
      </div>
      <input type="number" value={sData.height} onChange={e=>upd("height",e.target.value)} placeholder={"Např. 178"} min="130" max="220" style={inpS}/>
      <div style={{fontSize:"11px",color:"#aaa",textAlign:"center",marginTop:"6px",fontFamily:"'DM Sans',sans-serif"}}>Zadej v{"ý"}{"š"}ku v centimetrech (130{"–"}220 cm)</div>
    </div>),
    ()=>(<div>
      <div style={{background:"#faf8f4",borderRadius:"14px",padding:"16px",border:"1px solid #e0ddd5",marginBottom:"16px"}}>
        <div style={{display:"flex",gap:"14px",alignItems:"flex-start"}}>
          <svg viewBox="0 0 60 120" width="45" style={{flexShrink:0}}>
            <circle cx="30" cy="15" r="7" fill="#ccc"/><line x1="30" y1="22" x2="30" y2="55" stroke="#ccc" strokeWidth="3"/>
            <line x1="30" y1="30" x2="18" y2="45" stroke="#ccc" strokeWidth="2.5"/><line x1="30" y1="30" x2="42" y2="45" stroke="#ccc" strokeWidth="2.5"/>
            <line x1="30" y1="55" x2="20" y2="85" stroke="#1a1a2e" strokeWidth="2.5"/><line x1="30" y1="55" x2="40" y2="85" stroke="#1a1a2e" strokeWidth="2.5"/>
            <line x1="50" y1="55" x2="50" y2="88" stroke="#0277BD" strokeWidth="1.5" strokeDasharray="3,2"/>
            <line x1="48" y1="55" x2="52" y2="55" stroke="#0277BD" strokeWidth="1.5"/><line x1="48" y1="88" x2="52" y2="88" stroke="#0277BD" strokeWidth="1.5"/>
            <rect x="22" y="53" width="16" height="4" rx="1" fill="#0277BD" opacity="0.4"/>
          </svg>
          <div style={{fontSize:"12px",lineHeight:1.6,color:"#555",fontFamily:"'DM Sans',sans-serif"}}>Dej si knihu mezi nohy (jako sedlo) a zm{"ě"}{"ř"} vzd{"á"}lenost od podlahy po horn{"í"} hranu knihy.</div>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
        <div><div style={{fontSize:"13px",fontWeight:600,marginBottom:"5px",fontFamily:"'DM Sans',sans-serif",color:"#1a1a2e"}}>V{"ý"}{"š"}ka rozkroku (cm) {"—"} voliteln{"é"}</div>
          <input type="number" value={sData.inseam} onChange={e=>upd("inseam",e.target.value)} placeholder={"Např. 83"} min="55" max="115" style={inpS}/></div>
        <div><div style={{fontSize:"13px",fontWeight:600,marginBottom:"5px",fontFamily:"'DM Sans',sans-serif",color:"#1a1a2e"}}>Hmotnost (kg) {"—"} voliteln{"é"}</div>
          <input type="number" value={sData.weight} onChange={e=>upd("weight",e.target.value)} placeholder={"Např. 82"} min="40" max="200" style={inpS}/></div>
      </div>
      <div style={{fontSize:"11px",color:"#aaa",textAlign:"center",marginTop:"8px",fontFamily:"'DM Sans',sans-serif"}}>Tyto {"ú"}daje zp{"ř"}esn{"í"} v{"ý"}sledek, ale nejsou povinn{"é"}</div>
    </div>),
    ()=>(<div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {[{v:"mtb",l:"Horské kolo (MTB)",ic:"⛰️"},{v:"road",l:"Silniční kolo",ic:"\uD83D\uDEB4"},{v:"gravel",l:"Gravel",ic:"\uD83C\uDF04"},{v:"cross",l:"Krosové / Trekkingové",ic:"\uD83D\uDEE4️"},{v:"city",l:"Městské kolo",ic:"\uD83C\uDFD9️"}].map((o,i)=>(
        <OptCard key={o.v} option={{label:o.l,icon:o.ic}} selected={sData.bikeType===o.v} onClick={()=>upd("bikeType",o.v)} index={i}/>
      ))}
    </div>),
    ()=>(<div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      <OptCard option={{label:"Nemám / nevím",icon:"\uD83D\uDCCB",desc:"Univerzální tabulka"}} selected={sData.brand==="generic"} onClick={()=>upd("brand","generic")} index={0}/>
      {Object.entries(brandTables).map(([k,b],i)=>{const has=!!b[sData.bikeType];
        return <OptCard key={k} option={{label:b.name,icon:"\uD83C\uDFE2",desc:has?"Oficiální tabulka výrobce":"Nemá tabulku pro tento typ"}} selected={sData.brand===k} onClick={()=>has&&upd("brand",k)} index={i+1}/>;
      })}
    </div>),
    ()=>(<div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
      {[{v:"sport",l:"Sportovní a agresivní",ic:"\uD83C\uDFC1",d:"Menší rám = lepší ovladatelnost"},{v:"neutral",l:"Standardní / nevím",ic:"⚖️",d:"Doporučená velikost beze změny"},{v:"comfort",l:"Pohodová a výletní",ic:"\uD83D\uDECB️",d:"Větší rám = stabilita a komfort"}].map((o,i)=>(
        <OptCard key={o.v} option={{label:o.l,icon:o.ic,desc:o.d}} selected={sData.style===o.v} onClick={()=>upd("style",o.v)} index={i}/>
      ))}
    </div>),
  ];

  const titles = [
    {q:"Jaká je tvoje výška?",sub:"Přesná výška pomůže s přesnějším výsledkem"},
    {q:"Doplňující údaje",sub:"Výška rozkroku a hmotnost (volitelné)"},
    {q:"Pro jaký typ kola?",sub:"Různé typy mají odlišné tabulky"},
    {q:"Máš vyhlédnutou značku?",sub:"Každý výrobce má vlastní velikosti"},
    {q:"Jaký styl jízdy?",sub:"Ovlivňuje, zda zvolit menší nebo větší rám"},
  ];
  const isLast = sStep===sTot-1; const t=titles[sStep];

  return (
    <div style={S.ctr}><style>{KF}</style><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <div style={S.inn}>
      <div style={{textAlign:"center",marginBottom:"4px"}}>
        <h1 style={{...S.ttl,fontSize:"24px"}}>Jak{"á"} velikost r{"á"}mu?</h1>
        <p style={S.sub}>5 krok{"ů"} k p{"ř"}esn{"é"}mu doporu{"č"}en{"í"}</p>
      </div>
      <ProgressBar current={sStep} total={sTot}/>
      <div style={{opacity:sAnim?0:1,transform:sAnim?"translateY(8px)":"translateY(0)",transition:"all 0.2s"}}>
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"10px",textTransform:"uppercase",letterSpacing:"2px",color:"#8a8580",marginBottom:"5px",fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>Krok {sStep+1} z {sTot}</div>
          <h2 style={{margin:"0 0 2px",fontSize:"20px",fontFamily:"'Playfair Display',serif",fontWeight:700,color:"#1a1a2e"}}>{t.q}</h2>
          <p style={{margin:0,fontSize:"13px",color:"#8a8580",fontFamily:"'DM Sans',sans-serif"}}>{t.sub}</p>
        </div>
        <div style={{marginBottom:"24px"}}>{stepContent[sStep]()}</div>
        <div style={{display:"flex",gap:"10px",justifyContent:"space-between"}}>
          <button onClick={sBack} style={S.sec}>{sStep===0?"← Menu":"← Zpět"}</button>
          <button onClick={isLast?doFinish:sNext} disabled={!canGo()} style={{...S.pri,opacity:canGo()?1:0.35,cursor:canGo()?"pointer":"default"}}>
            {isLast?"Zobrazit výsledek →":"Dále →"}
          </button>
        </div>
      </div>
    </div></div>
  );
}

// ─── UI COMPONENTS ───

function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: "5px", marginBottom: "28px", padding: "0 4px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i <= current ? "#1a1a2e" : "#ddd8cf", transition: "background 0.4s" }} />
      ))}
    </div>
  );
}

function OptCard({ option, selected, onClick, index }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: "14px", width: "100%", padding: "15px 18px",
        border: selected ? "2px solid #1a1a2e" : "2px solid transparent", borderRadius: "14px",
        background: selected ? "#1a1a2e" : h ? "#f0ede6" : "#faf8f4",
        color: selected ? "#faf8f4" : "#1a1a2e", cursor: "pointer", textAlign: "left",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)", transform: h && !selected ? "translateX(4px)" : "none",
        opacity: 0, animation: "fadeSlideIn 0.3s ease forwards", animationDelay: `${index * 0.04}s`, fontFamily: "inherit",
      }}>
      {option.icon && <span style={{ fontSize: "22px", flexShrink: 0 }}>{option.icon}</span>}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "15px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>{option.label}</div>
        {option.desc && <div style={{ fontSize: "12px", opacity: 0.6, marginTop: "1px", fontFamily: "'DM Sans',sans-serif" }}>{option.desc}</div>}
      </div>
      <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: selected ? "2px solid #faf8f4" : "2px solid #c8c4bb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {selected && <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#faf8f4" }} />}
      </div>
    </button>
  );
}

function ResCard({ profile, score, maxScore, ebike, rank, budgetWarning, dynParams }) {
  const pct = Math.round((score / maxScore) * 100);
  const top = rank === 0;
  const params = dynParams?.params || [];
  const tip = dynParams?.tip || "";
  return (
    <div style={{ background: top ? profile.color : "#faf8f4", color: top ? "#fff" : "#1a1a2e", borderRadius: "16px", padding: top ? "24px" : "18px", opacity: 0, animation: "fadeSlideIn 0.5s ease forwards", animationDelay: `${rank * 0.1}s`, border: top ? "none" : "1px solid #e0ddd5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          {top && <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.8, marginBottom: "5px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>✦ Nejlepší volba pro tebe</div>}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: top ? "32px" : "24px" }}>{profile.icon}</span>
            <h3 style={{ margin: 0, fontSize: top ? "20px" : "15px", fontFamily: "'Playfair Display',serif", fontWeight: 700 }}>
              {profile.name}{ebike === true ? " ⚡ E-bike" : ebike === "open" ? " (zvážit E-bike)" : ""}
            </h3>
          </div>
        </div>
        <div style={{ fontSize: top ? "26px" : "18px", fontWeight: 800, fontFamily: "'DM Sans',sans-serif", opacity: top ? 1 : 0.6 }}>{pct}%</div>
      </div>
      <p style={{ margin: "10px 0", fontSize: "13px", lineHeight: 1.55, opacity: 0.9, fontFamily: "'DM Sans',sans-serif" }}>{profile.description}</p>
      {budgetWarning && (
        <div style={{ background: top ? "rgba(255,200,0,0.2)" : "#FFF8E1", borderRadius: "10px", padding: "10px 14px", marginBottom: "10px", border: top ? "1px solid rgba(255,200,0,0.3)" : "1px solid #FFE082" }}>
          <div style={{ fontSize: "12px", lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif", color: top ? "#fff" : "#8D6E00" }}>
            <strong>⚠️ Rozpočet:</strong> {budgetWarning}
          </div>
        </div>
      )}
      {top && params.length > 0 && (
        <>
          <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: "10px", padding: "12px 16px", marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "6px", opacity: 0.7, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Doporučené parametry pro tvůj rozpočet</div>
            {params.map((p, i) => <div key={i} style={{ fontSize: "12px", padding: "2px 0", fontFamily: "'DM Sans',sans-serif", opacity: 0.9 }}>{p}</div>)}
          </div>
          {tip && <div style={{ background: "rgba(255,255,255,0.11)", borderRadius: "10px", padding: "10px 14px", fontSize: "12px", lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>
            <strong>💡 Tip:</strong> {tip}
          </div>}
        </>
      )}
    </div>
  );
}

// ─── ANATOMY DATA ───

const componentData = {
  frame: {
    label: "Rám", icon: "🏗️", color: "#C62828",
    desc: "Nosná konstrukce kola. Určuje geometrii, komfort a charakter jízdy.",
    options: [
      { name: "Hliník (Al)", info: "Nejrozšířenější materiál. Lehký, cenově dostupný, tuhý. Ideální pro většinu jezdců. Nepruží tolik jako karbon." },
      { name: "Karbon (carbon)", info: "Lehčí a poddajnější než hliník. Lepší tlumení vibrací. Vyšší cena, citlivější na údery. Pro výkon a komfort." },
      { name: "Ocel (Cr-Mo)", info: "Tradiční materiál, komfortní jízda, snadná oprava. Těžší, ale velmi odolný. Oblíbený u turingových a retro kol." },
      { name: "Titan", info: "Kombinuje výhody oceli a hliníku. Extrémně odolný, lehký, celoživotní. Nejvyšší cenová kategorie." },
    ],
  },
  fork: {
    label: "Vidlice", icon: "🔧", color: "#1B5E20",
    desc: "Drží přední kolo a určuje odpružení. Klíčový komponent pro komfort a kontrolu v terénu.",
    options: [
      { name: "Pevná vidlice", info: "Bez odpružení. Lehká, bez údržby. Na silniční, gravel a městská kola. Přenáší vibrace přímo na jezdce." },
      { name: "Pružinová vidlice", info: "Základní odpružení, nenastavitelné. Na levnější MTB a krosová kola. Zdvih 50–100 mm." },
      { name: "Vzduchová vidlice", info: "Nastavitelná tvrdost podle váhy jezdce. Na kvalitní MTB. Zdvihy 100–180 mm. Lehčí než pružinová." },
      { name: "Inverted (USD)", info: "Obrácená konstrukce — nohy nahoře. Lepší tuhost. Na DH a enduro speciály. Zdvihy 170–200+ mm." },
    ],
  },
  wheels: {
    label: "Kola a pláště", icon: "⭕", color: "#E65100",
    desc: "Průměr kol a šířka plášťů zásadně ovlivňují rychlost, komfort a terénní schopnosti.",
    options: [
      { name: "26 palců (MTB legacy)", info: "Dříve standard MTB. Dnes hlavně na DH speciály a dětská kola. Obratné, ale pomalejší přes překážky." },
      { name: "27.5 palců (650b)", info: "Kompromis mezi obratností a rychlostí. Oblíbené u enduro/trail kol a menších jezdců. Hravější pocit." },
      { name: "29 palců (MTB standard)", info: "Dnešní standard pro MTB. Lépe překonávají překážky, vyšší rychlost, stabilita. Pro jezdce nad 165 cm." },
      { name: "700c / 28 palců", info: "Standard pro silniční, gravel, krosová a městská kola. Pláště od 25 mm (silnice) po 50 mm (gravel)." },
    ],
  },
  brakes: {
    label: "Brzdy", icon: "✋", color: "#4A148C",
    desc: "Bezpečnost na prvním místě. Typ brzd ovlivňuje brzdný účinek, údržbu i cenu kola.",
    options: [
      { name: "V-brake (ráfkové)", info: "Brzdí o ráfek. Levné, lehké, snadná údržba. Slabší za mokra. Na levnější krosová a městská kola." },
      { name: "Mechanické kotoučové", info: "Kotoučová brzda ovládaná lankem. Lepší než V-brake, ale horší modulace. Na kola střední třídy." },
      { name: "Hydraulické kotoučové", info: "Nejlepší brzdný účinek a modulace. Standard pro MTB a lepší gravel/silniční kola. Vyšší cena." },
      { name: "Silniční ráfkové (dual-pivot)", info: "Lehké brzdy na silniční kola. Dobrý výkon za sucha. Postupně nahrazovány kotoučovými." },
    ],
  },
  drivetrain: {
    label: "Převodovka", icon: "⚙️", color: "#0277BD",
    desc: "Řazení, přehazovačka, kazeta a kliky. Určuje rozsah převodů a komfort řazení.",
    options: [
      { name: "1× (single)", info: "Jeden převodník vpředu + široká kazeta vzadu (10-52z). Standard MTB. Jednodušší, lehčí, méně poruch." },
      { name: "2× (double)", info: "Dva převodníky vpředu. Standard silničních a gravel kol. Větší rozsah, menší skoky mezi převody." },
      { name: "Nábové řazení", info: "Převody ukryté v zadním náboji (Shimano Nexus/Alfine). Bezúdržbové, čisté. Na městská a trekingová kola." },
      { name: "Elektronické řazení", info: "Shimano Di2, SRAM AXS. Přeřazení na tlačítko, přesné, automatické ladění. Premium segment." },
    ],
  },
  cassette: {
    label: "Kazeta", icon: "🎯", color: "#00695C",
    desc: "Sada pastorků na zadním kole. Rozsah kazety určuje, jak lehce vyjedeš kopce a jak rychle sjedeš.",
    options: [
      { name: "11-28T / 11-30T", info: "Úzký rozsah pro silniční kola. Malé skoky mezi převody = plynulé řazení. Na roviny a mírné kopce." },
      { name: "11-34T / 11-36T", info: "Univerzální rozsah pro gravel a krosová kola. Zvládne i strmější kopce. Dobrý kompromis." },
      { name: "11-42T / 11-46T", info: "Široký rozsah pro MTB. Lehké stoupání i rychlé sjezdy. Větší skoky mezi převody." },
      { name: "10-52T", info: "Maximální rozsah (SRAM Eagle, Shimano Deore+). Nahrazuje potřebu přesmykače. Pro 1× systémy." },
    ],
  },
  handlebars: {
    label: "Řídítka", icon: "🤲", color: "#37474F",
    desc: "Typ řídítek určuje pozici na kole, komfort a styl ovládání.",
    options: [
      { name: "Drop (beranidla)", info: "Silniční, gravel, CX kola. Více pozic pro ruce. Aerodynamická pozice. Lepší na delší vzdálenosti." },
      { name: "Rovná (flat bar)", info: "MTB, fitness kola. Jedna pozice, přímá kontrola. Vzpřímenější pozice než drop. Lepší pro terén." },
      { name: "Riser", info: "Vyvýšená rovná řídítka. MTB trail/enduro. Vyšší pozice rukou = lepší kontrola ve sjezdech." },
      { name: "Městská / Trekková", info: "Lehce zahnutá nahoru. Vzpřímená pozice, komfort. Na městská a trekingová kola. Dobrý přehled v provozu." },
    ],
  },
  suspension: {
    label: "Odpružení", icon: "〰️", color: "#F9A825",
    desc: "Přední vidlice a zadní tlumič. Zdvih určuje terénní schopnosti kola.",
    options: [
      { name: "Hardtail (jen přední)", info: "Odpružená jen vidlice. Lehčí, levnější, efektivnější šlapání. Pro XC, kros, lehký terén." },
      { name: "Full-suspension (celoodpružení)", info: "Vidlice + zadní tlumič. Maximální komfort a trakce. Pro trail, enduro, DH. Těžší a dražší." },
      { name: "Rigid (bez odpružení)", info: "Žádné odpružení. Silniční, gravel, městská kola. Nejlehčí a nejefektivnější přenos síly." },
      { name: "Zdvih: 100 / 130 / 150 / 180+ mm", info: "XC = 100 mm. Trail = 120–150 mm. Enduro = 150–180 mm. DH = 180–200+ mm. Více zdvihu = lepší tlumení, ale těžší kolo." },
    ],
  },
  saddle: {
    label: "Sedlo a sedlovka", icon: "🪑", color: "#6A1B9A",
    desc: "Správné sedlo je klíčové pro komfort. Špatné sedlo zkazí i skvělé kolo.",
    options: [
      { name: "Sportovní úzké", info: "Pro závodní a sportovní jízdu. Umožňuje volný pohyb nohou. Vyžaduje cyklistické kraťasy s vložkou." },
      { name: "Komfortní široké", info: "Pro vzpřímenou pozici a krátké jízdy. Více polstrování. Na městská a treková kola." },
      { name: "S vykrojením / kanálem", info: "Odlehčení tlaku na citlivá místa. Doporučeno pro delší jízdy. Unisex a speciální dámské varianty." },
      { name: "Teleskopická sedlovka (dropper)", info: "Sedlo se dá za jízdy spustit tlačítkem. Standard pro MTB trail/enduro. Lepší kontrola ve sjezdech." },
    ],
  },
  pedals: {
    label: "Pedály", icon: "👟", color: "#AD1457",
    desc: "Spojení mezi jezdcem a kolem. Typ pedálů ovlivňuje efektivitu a bezpečnost.",
    options: [
      { name: "Platformové (ploché)", info: "Univerzální, lze jezdit v jakékoli obuvi. Noha se snadno sundá. Pro město, začátečníky, MTB gravity." },
      { name: "Nášlapné SPD (MTB)", info: "Cvaknutí tretry do pedálu. Efektivnější šlapání — táhnete i nahoru. Shimano SPD je standard pro MTB a trekking." },
      { name: "Nášlapné Look/SPD-SL (silniční)", info: "Větší plocha kontaktu, maximální přenos síly. Pro silniční a závodní jízdu. Špatná chůze v tretrách." },
      { name: "Kombinované (hybrid)", info: "Jedna strana nášlapná, druhá plochá. Kompromis pro dojíždění — tretry nebo běžné boty." },
    ],
  },
};

const hotspots = [
  { id: "frame", x: 48, y: 38, label: "Rám" },
  { id: "fork", x: 22, y: 32, label: "Vidlice" },
  { id: "wheels", x: 16, y: 62, label: "Kola" },
  { id: "brakes", x: 78, y: 55, label: "Brzdy" },
  { id: "drivetrain", x: 58, y: 70, label: "Převodovka" },
  { id: "cassette", x: 73, y: 68, label: "Kazeta" },
  { id: "handlebars", x: 24, y: 18, label: "Řídítka" },
  { id: "suspension", x: 15, y: 42, label: "Odpružení" },
  { id: "saddle", x: 60, y: 18, label: "Sedlo" },
  { id: "pedals", x: 50, y: 75, label: "Pedály" },
];

function AnatomyPage({ onBack }) {
  const [selected, setSelected] = useState(null);
  const data = selected ? componentData[selected] : null;

  return (
    <div style={S.ctr}><style>{KF}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.inn}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h1 style={{ ...S.ttl, fontSize: "26px" }}>Anatomie kola</h1>
          <p style={{ ...S.sub, margin: "2px 0 12px" }}>Klikni na komponent a zjisti, jaké máš možnosti</p>
        </div>

        {/* BIKE SVG */}
        <div style={{ position: "relative", width: "100%", paddingBottom: "65%", background: "#faf8f4", borderRadius: "16px", border: "1px solid #e0ddd5", marginBottom: "16px", overflow: "hidden" }}>
          <svg viewBox="0 0 500 325" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            {/* Wheels */}
            <circle cx="120" cy="210" r="75" fill="none" stroke="#bbb" strokeWidth="3" />
            <circle cx="120" cy="210" r="70" fill="none" stroke="#ddd" strokeWidth="1" />
            <circle cx="120" cy="210" r="8" fill="#888" />
            <circle cx="380" cy="210" r="75" fill="none" stroke="#bbb" strokeWidth="3" />
            <circle cx="380" cy="210" r="70" fill="none" stroke="#ddd" strokeWidth="1" />
            <circle cx="380" cy="210" r="8" fill="#888" />
            {/* Spokes hint */}
            {[0,45,90,135,180,225,270,315].map(a => <line key={`fs${a}`} x1={120+8*Math.cos(a*Math.PI/180)} y1={210+8*Math.sin(a*Math.PI/180)} x2={120+70*Math.cos(a*Math.PI/180)} y2={210+70*Math.sin(a*Math.PI/180)} stroke="#e8e4da" strokeWidth="0.8" />)}
            {[0,45,90,135,180,225,270,315].map(a => <line key={`rs${a}`} x1={380+8*Math.cos(a*Math.PI/180)} y1={210+8*Math.sin(a*Math.PI/180)} x2={380+70*Math.cos(a*Math.PI/180)} y2={210+70*Math.sin(a*Math.PI/180)} stroke="#e8e4da" strokeWidth="0.8" />)}
            {/* Frame */}
            <line x1="145" y1="120" x2="265" y2="120" stroke="#1a1a2e" strokeWidth="5" strokeLinecap="round" /> {/* top tube */}
            <line x1="145" y1="120" x2="120" y2="210" stroke="#1a1a2e" strokeWidth="5" strokeLinecap="round" /> {/* down tube */}
            <line x1="265" y1="120" x2="290" y2="230" stroke="#1a1a2e" strokeWidth="5" strokeLinecap="round" /> {/* seat tube */}
            <line x1="265" y1="120" x2="380" y2="210" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" /> {/* seat stay */}
            <line x1="290" y1="230" x2="380" y2="210" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" /> {/* chain stay */}
            {/* Fork */}
            <line x1="145" y1="120" x2="130" y2="100" stroke="#555" strokeWidth="4" strokeLinecap="round" />
            <line x1="130" y1="100" x2="120" y2="210" stroke="#555" strokeWidth="4" strokeLinecap="round" />
            {/* Handlebars */}
            <line x1="130" y1="100" x2="115" y2="80" stroke="#666" strokeWidth="4" strokeLinecap="round" />
            <line x1="115" y1="80" x2="100" y2="75" stroke="#666" strokeWidth="3" strokeLinecap="round" />
            <line x1="115" y1="80" x2="125" y2="68" stroke="#666" strokeWidth="3" strokeLinecap="round" />
            {/* Saddle */}
            <line x1="265" y1="120" x2="275" y2="75" stroke="#555" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="275" cy="68" rx="28" ry="7" fill="#444" />
            {/* Cranks and pedals */}
            <circle cx="290" cy="230" r="6" fill="#666" />
            <line x1="290" y1="230" x2="270" y2="255" stroke="#555" strokeWidth="4" strokeLinecap="round" />
            <line x1="290" y1="230" x2="310" y2="205" stroke="#555" strokeWidth="4" strokeLinecap="round" />
            <rect x="262" y="251" width="16" height="7" rx="2" fill="#888" />
            <rect x="303" y="201" width="16" height="7" rx="2" fill="#888" />
            {/* Chainring + chain hint */}
            <circle cx="290" cy="230" r="20" fill="none" stroke="#999" strokeWidth="2" />
            <circle cx="380" cy="210" r="14" fill="none" stroke="#999" strokeWidth="2" />
            <line x1="310" y1="228" x2="366" y2="210" stroke="#ccc" strokeWidth="1.5" />
            <line x1="310" y1="232" x2="366" y2="214" stroke="#ccc" strokeWidth="1.5" />
            {/* Brake discs */}
            <circle cx="120" cy="210" r="18" fill="none" stroke="#d44" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="380" cy="210" r="18" fill="none" stroke="#d44" strokeWidth="1.5" strokeDasharray="3,3" />
          </svg>

          {/* Hotspots */}
          {hotspots.map((h, i) => (
            <button key={h.id} onClick={() => setSelected(selected === h.id ? null : h.id)}
              style={{
                position: "absolute", left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%,-50%)",
                width: selected === h.id ? "30px" : "24px", height: selected === h.id ? "30px" : "24px",
                borderRadius: "50%", border: "2px solid #fff",
                background: selected === h.id ? (componentData[h.id]?.color || "#1a1a2e") : "rgba(26,26,46,0.8)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: selected === h.id ? `0 0 0 4px ${componentData[h.id]?.color || "#1a1a2e"}33, 0 2px 8px rgba(0,0,0,0.3)` : "0 2px 6px rgba(0,0,0,0.25)",
                transition: "all 0.25s ease", zIndex: 10,
                animation: "fadeSlideIn 0.3s ease forwards", animationDelay: `${i * 0.04}s`, opacity: 0,
                fontSize: "11px", color: "#fff", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", padding: 0,
              }}
              title={h.label}
            >
              <span style={{ fontSize: selected === h.id ? "14px" : "11px", lineHeight: 1 }}>
                {componentData[h.id]?.icon?.charAt(0) === "〰" ? "~" : componentData[h.id]?.icon}
              </span>
            </button>
          ))}
        </div>

        {/* Component chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px", justifyContent: "center" }}>
          {hotspots.map(h => (
            <button key={h.id} onClick={() => setSelected(selected === h.id ? null : h.id)}
              style={{
                padding: "6px 12px", borderRadius: "20px", border: "none", fontSize: "12px", fontWeight: 600,
                fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s",
                background: selected === h.id ? (componentData[h.id]?.color || "#1a1a2e") : "#eae7df",
                color: selected === h.id ? "#fff" : "#555",
              }}>
              {componentData[h.id]?.icon} {h.label}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        {data && (
          <div style={{
            background: "#faf8f4", border: `2px solid ${data.color}22`, borderRadius: "16px", padding: "20px",
            opacity: 0, animation: "fadeSlideIn 0.3s ease forwards",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span style={{ fontSize: "28px" }}>{data.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: data.color }}>{data.label}</h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#888", fontFamily: "'DM Sans',sans-serif" }}>{data.desc}</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {data.options.map((opt, i) => (
                <ExpandableOption key={i} opt={opt} color={data.color} index={i} />
              ))}
            </div>
          </div>
        )}

        {!data && (
          <div style={{ textAlign: "center", padding: "24px", color: "#aaa", fontSize: "13px", fontFamily: "'DM Sans',sans-serif" }}>
            ☝️ Klikni na bod v obrázku nebo na štítek výše
          </div>
        )}

        <button onClick={onBack} style={{ ...S.sec, display: "block", margin: "20px auto 0" }}>← Zpět do menu</button>
      </div>
    </div>
  );
}

function ExpandableOption({ opt, color, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        background: open ? `${color}0D` : "#f0ede6", borderRadius: "10px", padding: "12px 14px",
        cursor: "pointer", transition: "all 0.2s",
        border: open ? `1px solid ${color}33` : "1px solid transparent",
        opacity: 0, animation: "fadeSlideIn 0.25s ease forwards", animationDelay: `${index * 0.05}s`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", color: open ? color : "#333" }}>{opt.name}</span>
        <span style={{ fontSize: "14px", color: "#aaa", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </div>
      {open && (
        <p style={{ margin: "8px 0 0", fontSize: "12px", lineHeight: 1.55, color: "#555", fontFamily: "'DM Sans',sans-serif" }}>{opt.info}</p>
      )}
    </div>
  );
}

// ─── LANDING PAGE SECTIONS ───

function HeroSection({ onStart }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "60px 20px 80px", position: "relative", overflow: "hidden" }}>
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: "-120px", right: "-80px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(26,26,46,0.03)" }} />
      <div style={{ position: "absolute", bottom: "-60px", left: "-100px", width: "250px", height: "250px", borderRadius: "50%", background: "rgba(26,26,46,0.025)" }} />

      <div style={{ opacity: 0, animation: "fadeSlideIn 0.7s ease forwards", animationDelay: "0.1s" }}>
        <div style={{ fontSize: "72px", marginBottom: "16px", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}>🚲</div>
      </div>

      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 900, color: "#1a1a2e", margin: "0 0 16px", letterSpacing: "-1px", lineHeight: 1.15, maxWidth: "600px", opacity: 0, animation: "fadeSlideIn 0.7s ease forwards", animationDelay: "0.25s" }}>
        Najdi své ideální kolo<br /><span style={{ color: "#C62828" }}>za 2 minuty</span>
      </h1>

      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "clamp(15px, 2.5vw, 19px)", color: "#6b6560", margin: "0 0 36px", maxWidth: "480px", lineHeight: 1.6, opacity: 0, animation: "fadeSlideIn 0.7s ease forwards", animationDelay: "0.4s" }}>
        Odpověz na pár otázek a my ti doporučíme typ kola, správnou velikost rámu i na co si dát pozor při nákupu.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", opacity: 0, animation: "fadeSlideIn 0.7s ease forwards", animationDelay: "0.55s" }}>
        <button onClick={onStart} style={{ padding: "16px 40px", border: "none", borderRadius: "14px", background: "#1a1a2e", color: "#faf8f4", fontSize: "17px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.3s", boxShadow: "0 4px 20px rgba(26,26,46,0.25)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(26,26,46,0.35)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(26,26,46,0.25)"; }}>
          Spustit kvíz →
        </button>
        <span style={{ fontSize: "12px", color: "#aaa7a0", fontFamily: "'DM Sans',sans-serif" }}>Zdarma • Bez registrace • Personalizované otázky</span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "32px", marginTop: "56px", opacity: 0, animation: "fadeSlideIn 0.7s ease forwards", animationDelay: "0.7s" }}>
        {[{ n: "10+", l: "typů kol" }, { n: "3", l: "nástroje" }, { n: "2 min", l: "stačí" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "#1a1a2e", fontFamily: "'DM Sans',sans-serif" }}>{s.n}</div>
            <div style={{ fontSize: "11px", color: "#aaa7a0", fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", fontSize: "12px", color: "#ccc8c0", fontFamily: "'DM Sans',sans-serif", opacity: 0, animation: "fadeSlideIn 0.7s ease forwards", animationDelay: "1s" }}>
        ↓ Více informací níže
      </div>
    </section>
  );
}

function HowItWorks({ onStart }) {
  const steps = [
    { icon: "💬", title: "Odpověz na otázky", desc: "Krátký kvíz zjistí, kde jezdíš, jaký máš rozpočet a co od kola očekáváš." },
    { icon: "🎯", title: "Získej doporučení", desc: "Na základě odpovědí ti navrhneme ideální typ kola s konkrétními parametry." },
    { icon: "📏", title: "Zjisti velikost", desc: "Druhý kvíz ti řekne přesnou velikost rámu a průměr kol podle tvé postavy." },
  ];
  return (
    <section id="how" style={{ padding: "80px 20px", background: "#faf8f4" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#1a1a2e", textAlign: "center", margin: "0 0 12px" }}>Jak to funguje?</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: "#8a8580", textAlign: "center", margin: "0 0 48px" }}>Tři jednoduché kroky k tvému novému kolu</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "20px", alignItems: "flex-start", background: "#fff", borderRadius: "16px", padding: "24px", border: "1px solid #eae7df", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "linear-gradient(135deg, #1a1a2e, #2d2d4e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#C62828", fontFamily: "'DM Sans',sans-serif" }}>KROK {i + 1}</span>
                </div>
                <h3 style={{ margin: "0 0 4px", fontSize: "17px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", color: "#1a1a2e" }}>{s.title}</h3>
                <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.55, color: "#6b6560", fontFamily: "'DM Sans',sans-serif" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button onClick={onStart} style={{ padding: "14px 36px", border: "none", borderRadius: "12px", background: "#1a1a2e", color: "#faf8f4", fontSize: "15px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s" }}>Spustit kvíz →</button>
        </div>
      </div>
    </section>
  );
}

function ToolsPreview({ onStart }) {
  const tools = [
    { icon: "🧭", title: "Jaké kolo je pro mě?", desc: "Personalizované otázky → doporučení z 10 typů kol s parametry.", color: "#C62828" },
    { icon: "📏", title: "Jaká velikost rámu?", desc: "4 otázky o výšce a stylu jízdy → doporučená velikost rámu a průměr kol.", color: "#1B5E20" },
    { icon: "🔧", title: "Anatomie kola", desc: "Interaktivní průvodce všemi komponenty — rám, brzdy, převodovka a další.", color: "#0277BD" },
  ];
  return (
    <section style={{ padding: "80px 20px", background: "linear-gradient(165deg, #f5f3ed, #ece8df)" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#1a1a2e", textAlign: "center", margin: "0 0 12px" }}>Tři nástroje, jeden cíl</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: "#8a8580", textAlign: "center", margin: "0 0 48px" }}>Vše co potřebuješ vědět před koupí kola</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {tools.map((t, i) => (
            <div key={i} onClick={onStart} style={{ display: "flex", gap: "18px", alignItems: "center", background: "#fff", borderRadius: "16px", padding: "22px 24px", border: "1px solid #eae7df", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#eae7df"; e.currentTarget.style.transform = "none"; }}>
              <span style={{ fontSize: "32px" }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 3px", fontSize: "16px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif", color: "#1a1a2e" }}>{t.title}</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#8a8580", fontFamily: "'DM Sans',sans-serif" }}>{t.desc}</p>
              </div>
              <span style={{ color: t.color, fontSize: "18px", fontWeight: 700 }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    { q: "Je to opravdu zdarma?", a: "Ano, všechny tři nástroje jsou kompletně zdarma a bez registrace. Stačí odpovědět na otázky." },
    { q: "Jak přesné je doporučení?", a: "Kvíz pracuje s váženým bodovacím systémem — klíčové otázky o terénu a cílech mají vyšší váhu. Navíc se ti zobrazí doplňující otázky přizpůsobené tvým odpovědím. Výsledek je orientační doporučení — finální rozhodnutí bys měl/a vždy konzultovat s prodejcem a kolo ideálně vyzkoušet." },
    { q: "Prodáváte kola?", a: "Ne, jsme nezávislý poradce. Neprodáváme žádné zboží. Naším cílem je pomoci ti zorientovat se ve světě kol, ať už kupuješ poprvé nebo upgradeuješ." },
    { q: "Pro koho je kvíz určený?", a: "Pro kohokoliv — od úplných začátečníků, kteří nevědí, jaký typ kola potřebují, po pokročilé jezdce, kteří chtějí ověřit svůj výběr nebo zjistit velikost rámu." },
    { q: "Mohu si výsledek uložit?", a: "Ano, na výsledkové stránce najdeš tlačítko pro uložení výsledku jako obrázek do telefonu nebo počítače." },
    { q: "Jaké typy kol kvíz pokrývá?", a: "Silniční, gravel, MTB cross-country, MTB trail/all-mountain, MTB enduro/freeride, MTB downhill, městské, krosové/trekové, cyklokrosové a fitness kolo — celkem 10 kategorií." },
  ];
  return (
    <section id="faq" style={{ padding: "80px 20px", background: "#faf8f4" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#1a1a2e", textAlign: "center", margin: "0 0 12px" }}>Časté otázky</h2>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "15px", color: "#8a8580", textAlign: "center", margin: "0 0 40px" }}>Vše co tě může zajímat</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((it, i) => (
            <div key={i} onClick={() => setOpen(open === i ? null : i)}
              style={{ background: "#fff", borderRadius: "12px", padding: "18px 22px", cursor: "pointer", border: open === i ? "1px solid #1a1a2e22" : "1px solid #eae7df", transition: "all 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "15px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", color: "#1a1a2e" }}>{it.q}</span>
                <span style={{ fontSize: "16px", color: "#aaa", transition: "transform 0.3s", transform: open === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: "12px" }}>▾</span>
              </div>
              {open === i && (
                <p style={{ margin: "12px 0 0", fontSize: "14px", lineHeight: 1.6, color: "#6b6560", fontFamily: "'DM Sans',sans-serif" }}>{it.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({ onStart }) {
  return (
    <footer style={{ padding: "48px 20px 32px", background: "#1a1a2e", color: "#faf8f4" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>🚲</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, margin: "0 0 8px" }}>Průvodce výběrem kola</h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "rgba(250,248,244,0.5)", margin: "0 0 24px" }}>Nezávislý poradce pro výběr jízdního kola</p>

        <button onClick={onStart} style={{ padding: "12px 32px", border: "1px solid rgba(250,248,244,0.3)", borderRadius: "10px", background: "transparent", color: "#faf8f4", fontSize: "14px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s", marginBottom: "32px" }}>Spustit kvíz</button>

        <div style={{ borderTop: "1px solid rgba(250,248,244,0.1)", paddingTop: "20px", fontSize: "11px", color: "rgba(250,248,244,0.3)", fontFamily: "'DM Sans',sans-serif", lineHeight: 1.6 }}>
          © 2026 Průvodce výběrem kola. Všechna doporučení jsou orientační.<br />
          Pro finální rozhodnutí doporučujeme konzultaci s odborným prodejcem.
        </div>
      </div>
    </footer>
  );
}

// ─── MAIN APP ───

export default function App() {
  const [page, setPage] = useState("landing"); // landing | quiz
  const [quiz, setQuiz] = useState("menu");
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [anim, setAnim] = useState(false);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const ref = useRef(null);
  const quizRef = useRef(null);

  const goToQuiz = () => {
    setPage("quiz");
    setQuiz("menu");
    setStep(0); setAns({}); setDone(false);
    setTimeout(() => quizRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Build active question list with dynamic questions injected
  const getActiveQuestions = useCallback(() => {
    const base = [...questions];
    const dynToInsert = [];
    dynamicQuestions.forEach(dq => {
      if (dq.trigger(ans, questions)) dynToInsert.push(dq);
    });
    const ebikeQ = base.pop();
    return [...base, ...dynToInsert, ebikeQ];
  }, [ans]);

  const qs = quiz === "type" ? getActiveQuestions() : [];
  const last = step === qs.length - 1;
  const q = qs[step];

  const pick = (i) => setAns({ ...ans, [step]: i });
  const next = () => {
    if (ans[step] === undefined) return;
    if (last) { setAnim(true); setTimeout(() => { setDone(true); setAnim(false); }, 400); return; }
    setAnim(true); setTimeout(() => { setStep(step + 1); setAnim(false); }, 200);
  };
  const back = () => { if (step === 0) return; setAnim(true); setTimeout(() => { setStep(step - 1); setAnim(false); }, 200); };
  const reset = () => { setAnim(true); setTimeout(() => { setStep(0); setAns({}); setDone(false); setAnim(false); }, 250); };
  const menu = () => { setQuiz("menu"); setStep(0); setAns({}); setDone(false); };
  const goLanding = () => { setPage("landing"); setQuiz("menu"); setStep(0); setAns({}); setDone(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const saveImg = useCallback(async () => {
    if (!ref.current) return;
    setSaving(true);
    try {
      const el = ref.current;
      const c = document.createElement("canvas");
      const sc = 2;
      c.width = el.offsetWidth * sc;
      c.height = el.offsetHeight * sc;
      const ctx = c.getContext("2d");
      ctx.scale(sc, sc);
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("width", el.offsetWidth);
      svg.setAttribute("height", el.offsetHeight);
      const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
      fo.setAttribute("width", "100%");
      fo.setAttribute("height", "100%");
      const clone = el.cloneNode(true);
      clone.style.margin = "0";
      clone.querySelectorAll("*").forEach(n => {
        const cs = window.getComputedStyle(n);
        ["font-family","font-size","font-weight","color","background","background-color","border","border-radius","padding","margin","display","flex-direction","justify-content","align-items","gap","text-align","line-height","letter-spacing","text-transform","opacity","width","max-width","flex"].forEach(p => { n.style[p] = cs.getPropertyValue(p); });
        n.style.animation = "none"; n.style.opacity = "1";
      });
      clone.style.animation = "none";
      fo.appendChild(clone);
      svg.appendChild(fo);
      const data = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const a = document.createElement("a");
        a.download = quiz === "type" ? "moje-kolo.png" : "velikost-kola.png";
        a.href = c.toDataURL("image/png");
        a.click(); setSaving(false);
      };
      img.onerror = () => { txtFallback(el); setSaving(false); };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);
    } catch { txtFallback(ref.current); setSaving(false); }
  }, [quiz]);

  const txtFallback = (el) => {
    const b = new Blob([el.innerText], { type: "text/plain" });
    const a = document.createElement("a"); a.download = "vysledek.txt"; a.href = URL.createObjectURL(b); a.click();
  };

  const typeResults = () => {
    const scores = {}; Object.keys(bikeProfiles).forEach(k => scores[k] = 0);
    let eb = false;
    const allQs = getActiveQuestions();

    // Score each answer with multipliers
    Object.entries(ans).forEach(([qi, oi]) => {
      const q = allQs[parseInt(qi)];
      if (!q) return;
      const opt = q.options[oi];
      if (!opt) return;
      if (opt.tags.ebike !== undefined) { eb = opt.tags.ebike; return; }
      const mult = q.multiplier || 1.0;
      Object.entries(opt.tags).forEach(([k, v]) => {
        if (scores[k] !== undefined) scores[k] += v * mult;
      });
    });

    // Apply combo bonuses
    comboRules.forEach(rule => {
      const match = Object.entries(rule.conditions).every(([qIdx, optIdx]) => ans[parseInt(qIdx)] === optIdx);
      if (match) {
        Object.entries(rule.bonuses).forEach(([k, v]) => { if (scores[k] !== undefined) scores[k] += v; });
      }
    });

    // Budget check
    const budgetQIdx = allQs.findIndex(q => q.id === 7);
    const budgetAnswer = budgetQIdx >= 0 ? ans[budgetQIdx] : 1;
    const userMaxBudget = budgetLabels[budgetAnswer] || 35000;

    // Experience and goal for dynamic params
    const expQIdx = allQs.findIndex(q => q.id === 8);
    const goalQIdx = allQs.findIndex(q => q.id === 2);
    const expAnswer = expQIdx >= 0 ? (ans[expQIdx] ?? 1) : 1;
    const goalAnswer = goalQIdx >= 0 ? (ans[goalQIdx] ?? 1) : 1;

    const mx = Math.max(...Object.values(scores));
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 4);

    // Attach budget warnings and dynamic params
    const results = sorted.map(([key, score]) => {
      const min = minBudget[key] || 0;
      let budgetWarning = null;
      if (userMaxBudget < min) {
        budgetWarning = `Minimální smysluplný rozpočet pro ${bikeProfiles[key].name} je cca ${(min/1000).toFixed(0)} 000 Kč. S tvým rozpočtem doporučujeme zvážit jiný typ, nebo navýšit budget.`;
      } else if (userMaxBudget < min * 1.5) {
        budgetWarning = `Tvůj rozpočet stačí na základní model. Pro lepší komfort a komponenty zvažuj budget od ${(Math.round(min*1.5/1000)).toFixed(0)} 000 Kč.`;
      }
      const dynParams = bikeProfiles[key].getParams
        ? bikeProfiles[key].getParams(budgetAnswer, expAnswer, goalAnswer)
        : { params: [], tip: "" };
      return { key, score, budgetWarning, dynParams };
    });

    return { results, mx, eb };
  };

  // ── LANDING PAGE ──
  if (page === "landing") {
    return (
      <div style={{ background: "linear-gradient(165deg, #f5f3ed 0%, #ece8df 50%, #e8e4da 100%)", fontFamily: "'DM Sans',sans-serif" }}>
        <style>{KF}</style>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <HeroSection onStart={goToQuiz} />
        <HowItWorks onStart={goToQuiz} />
        <ToolsPreview onStart={goToQuiz} />
        <FAQ />
        <Footer onStart={goToQuiz} />
      </div>
    );
  }

  // ── QUIZ PAGES (page === "quiz") ──

  // ANATOMY
  if (quiz === "anatomy") {
    return <AnatomyPage onBack={menu} />;
  }

  // QUIZ MENU
  if (quiz === "menu") {
    return (
      <div style={S.ctr}><style>{KF}</style>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div ref={quizRef} style={S.inn}>
          <div style={{ textAlign: "center", marginBottom: "32px", opacity: 0, animation: "fadeSlideIn 0.5s ease forwards" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>🚲</div>
            <h1 style={{ ...S.ttl, fontSize: "28px" }}>Vyber si nástroj</h1>
            <p style={S.sub}>Co tě zajímá?</p>
          </div>
          {[{ k: "type", ic: "🧭", t: "Jaké kolo je pro mě?", d: "9+ otázek → doporučení typu kola s parametry", dl: "0.1s" },
            { k: "size", ic: "📏", t: "Jaká velikost rámu?", d: "4 otázky → doporučení velikosti rámu a kol", dl: "0.2s" },
            { k: "anatomy", ic: "🔧", t: "Anatomie kola", d: "Interaktivní průvodce všemi komponenty", dl: "0.3s" }].map(x => (
            <button key={x.k} onClick={() => setQuiz(x.k)} style={{
              display: "flex", alignItems: "center", gap: "16px", width: "100%", padding: "22px",
              border: "2px solid #e0ddd5", borderRadius: "16px", background: "#faf8f4", cursor: "pointer",
              textAlign: "left", fontFamily: "inherit", marginBottom: "12px",
              opacity: 0, animation: "fadeSlideIn 0.4s ease forwards", animationDelay: x.dl, transition: "all 0.2s",
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#1a1a2e"; e.currentTarget.style.transform = "translateY(-2px)"; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0ddd5"; e.currentTarget.style.transform = "none"; }}>
              <span style={{ fontSize: "34px" }}>{x.ic}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "17px", fontWeight: 700, fontFamily: "'Playfair Display',serif", color: "#1a1a2e" }}>{x.t}</div>
                <div style={{ fontSize: "12px", color: "#8a8580", marginTop: "3px", fontFamily: "'DM Sans',sans-serif" }}>{x.d}</div>
              </div>
              <span style={{ fontSize: "18px", color: "#8a8580" }}>→</span>
            </button>
          ))}
          <button onClick={goLanding} style={{ ...S.sec, display: "block", margin: "12px auto 0" }}>← Zpět na hlavní stránku</button>
        </div>
      </div>
    );
  }

  // TYPE RESULTS
  if (quiz === "type" && done) {
    const { results, mx, eb } = typeResults();
    return (
      <div style={S.ctr}><style>{KF}</style>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={S.inn}>
          <div ref={ref} style={{ background: "linear-gradient(165deg,#f5f3ed,#ece8df)", borderRadius: "18px", padding: "24px 18px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h1 style={{ ...S.ttl, fontSize: "28px" }}>Tvoje ideální kolo</h1>
              <p style={{ ...S.sub, margin: "3px 0 0" }}>Na základě tvých odpovědí</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {results.map((r, i) => <ResCard key={r.key} profile={bikeProfiles[r.key]} score={r.score} maxScore={mx} ebike={i === 0 ? eb : false} rank={i} budgetWarning={r.budgetWarning} dynParams={r.dynParams} />)}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "18px", flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={saveImg} disabled={saving} style={{ ...S.pri, opacity: saving ? 0.5 : 1 }}>{saving ? "Ukládám..." : "📱 Uložit výsledek"}</button>
            <button onClick={() => { setDone(false); setStep(0); setAns({}); setQuiz("size"); }} style={S.sec}>📏 Test velikosti →</button>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px", justifyContent: "center" }}>
            <button onClick={reset} style={S.sec}>↺ Znovu</button>
            <button onClick={menu} style={S.sec}>← Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // SIZE QUIZ — now a standalone page component
  if (quiz === "size") {
    return <SizeQuizPage onBack={menu} onMenu={menu} />;
  }

  // QUIZ FLOW (type quiz only)
  return (
    <div style={S.ctr}><style>{KF}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.inn}>
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <h1 style={{ ...S.ttl, fontSize: "24px" }}>Jake kolo je pro tebe?</h1>
          <p style={S.sub}>{qs.length} otazek prizpusobenych tvym odpovedim</p>
        </div>
        <ProgressBar current={step} total={qs.length} />
        <div style={{ opacity: anim ? 0 : 1, transform: anim ? "translateY(8px)" : "translateY(0)", transition: "all 0.2s" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "#8a8580", marginBottom: "5px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Otazka {step + 1} z {qs.length}</div>
            <h2 style={{ margin: "0 0 2px", fontSize: "20px", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: "#1a1a2e" }}>{q.question}</h2>
            <p style={{ margin: 0, fontSize: "13px", color: "#8a8580", fontFamily: "'DM Sans',sans-serif" }}>{q.subtitle}</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "24px" }}>
            {q.options.map((o, i) => <OptCard key={`${quiz}-${step}-${i}`} option={o} selected={ans[step] === i} onClick={() => pick(i)} index={i} />)}
          </div>
          <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
            <button onClick={step === 0 ? menu : back} style={S.sec}>{step === 0 ? "← Menu" : "← Zpět"}</button>
            <button onClick={next} disabled={ans[step] === undefined} style={{ ...S.pri, opacity: ans[step] === undefined ? 0.35 : 1, cursor: ans[step] === undefined ? "default" : "pointer" }}>
              {last ? "Zobrazit výsledek →" : "Dále →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const KF = `@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
const S = {
  ctr: { minHeight: "100vh", background: "linear-gradient(165deg,#f5f3ed 0%,#ece8df 50%,#e8e4da 100%)", display: "flex", justifyContent: "center", padding: "20px 12px", fontFamily: "'DM Sans',sans-serif" },
  inn: { width: "100%", maxWidth: "520px" },
  ttl: { fontFamily: "'Playfair Display',serif", fontSize: "28px", fontWeight: 900, color: "#1a1a2e", margin: "0 0 4px", letterSpacing: "-0.5px" },
  sub: { fontFamily: "'DM Sans',sans-serif", fontSize: "13px", color: "#8a8580", margin: "0 0 18px" },
  sec: { padding: "11px 18px", border: "1px solid #c8c4bb", borderRadius: "11px", background: "transparent", color: "#1a1a2e", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s" },
  pri: { padding: "11px 24px", border: "none", borderRadius: "11px", background: "#1a1a2e", color: "#faf8f4", fontSize: "13px", fontWeight: 600, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "all 0.2s" },
};
