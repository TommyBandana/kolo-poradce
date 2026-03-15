import { useState, useRef, useCallback } from "react";

// ——— DATA: QUIZ 1 - VÝBĚR TYPU KOLA ———

const questions = [
  {
    id: 1,
    question: "Kde budeš nejčastěji jezdit?",
    subtitle: "Vyber povrch, na kterém strávíš nejvíc času",
    options: [
      { label: "Asfalt a silnice", icon: "🛣️", desc: "Městské cesty, cyklotrasy, silnice", tags: { road: 3, gravel: 0, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 2, cross: 1, cx: 0, fitness: 2 } },
      { label: "Mix silnic a lehkého terénu", icon: "🌾", desc: "Polní cesty, štěrk, cyklostezky", tags: { road: 0, gravel: 3, mtb_xc: 1, mtb_trail: 1, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 2, cx: 1, fitness: 1 } },
      { label: "Terén – lesy, traily, hory", icon: "⛰️", desc: "Singltreky, kořeny, kameny", tags: { road: 0, gravel: 1, mtb_xc: 2, mtb_trail: 3, mtb_enduro: 3, mtb_dh: 2, city: 0, cross: 0, cx: 0, fitness: 0 } },
      { label: "Hlavně po městě", icon: "🏙️", desc: "Dojíždění, nákupy, město", tags: { road: 1, gravel: 0, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 1, cx: 0, fitness: 2 } },
    ],
  },
  {
    id: 2,
    question: "Jaký je tvůj hlavní cíl?",
    subtitle: "Co tě na kole baví nebo co potřebuješ",
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
    options: [
      { label: "Výkon nad komfort", icon: "🏆", desc: "Tvrdý podvozek mi nevadí", tags: { road: 3, gravel: 1, mtb_xc: 3, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 0, cross: 1, cx: 3, fitness: 1 } },
      { label: "Vyvážený mix", icon: "⚖️", desc: "Chci obojí", tags: { road: 1, gravel: 3, mtb_xc: 1, mtb_trail: 3, mtb_enduro: 1, mtb_dh: 0, city: 1, cross: 3, cx: 1, fitness: 2 } },
      { label: "Komfort je klíčový", icon: "🛋️", desc: "Pohodlná jízda, vzpřímená pozice", tags: { road: 0, gravel: 1, mtb_xc: 0, mtb_trail: 1, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 2, cx: 0, fitness: 2 } },
      { label: "Plné odpružení", icon: "🧲", desc: "Maximální kontrola v terénu", tags: { road: 0, gravel: 0, mtb_xc: 0, mtb_trail: 2, mtb_enduro: 3, mtb_dh: 3, city: 0, cross: 0, cx: 0, fitness: 0 } },
    ],
  },
  {
    id: 6,
    question: "Budeš převážet náklad?",
    subtitle: "Batoh, brašny, nákupy...",
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
    subtitle: "Upřímně – neexistuje špatná odpověď",
    options: [
      { label: "Začátečník", icon: "🌱", desc: "Déle jsem nejezdil / začínám", tags: { road: 0, gravel: 1, mtb_xc: 0, mtb_trail: 0, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 2, cx: 0, fitness: 2 } },
      { label: "Rekreační jezdec", icon: "😊", desc: "Jezdím sem tam, baví mě to", tags: { road: 1, gravel: 2, mtb_xc: 1, mtb_trail: 2, mtb_enduro: 0, mtb_dh: 0, city: 2, cross: 3, cx: 0, fitness: 3 } },
      { label: "Pokročilý", icon: "💪", desc: "Pravidelně jezdím, znám základy", tags: { road: 2, gravel: 3, mtb_xc: 3, mtb_trail: 3, mtb_enduro: 2, mtb_dh: 1, city: 0, cross: 1, cx: 2, fitness: 1 } },
      { label: "Zkušený", icon: "🏅", desc: "Roky zkušeností, vím co chci", tags: { road: 3, gravel: 2, mtb_xc: 3, mtb_trail: 2, mtb_enduro: 3, mtb_dh: 3, city: 0, cross: 0, cx: 3, fitness: 0 } },
    ],
  },
  {
    id: 9,
    question: "Plánuješ jezdit i v zimě nebo za deště?",
    subtitle: "Celoroční jízda vyžaduje odolnější kolo",
    options: [
      { label: "Jen v sezóně (jaro–podzim)", icon: "☀️", desc: "Hlavně za hezkého počasí", tags: { road: 2, gravel: 1, mtb_xc: 1, mtb_trail: 1, mtb_enduro: 1, mtb_dh: 1, city: 1, cross: 1, cx: 1, fitness: 2 } },
      { label: "Celoročně, i za deště", icon: "🌧️", desc: "Blatníky a spolehlivost jsou důležité", tags: { road: 0, gravel: 2, mtb_xc: 0, mtb_trail: 1, mtb_enduro: 0, mtb_dh: 0, city: 3, cross: 3, cx: 2, fitness: 1 } },
      { label: "Hlavně v terénu za každého počasí", icon: "🌨️", desc: "Bláto, déšť, sníh – jedu", tags: { road: 0, gravel: 1, mtb_xc: 1, mtb_trail: 2, mtb_enduro: 2, mtb_dh: 1, city: 0, cross: 1, cx: 3, fitness: 0 } },
    ],
  },
  {
    id: 10,
    question: "Chceš elektropohon?",
    subtitle: "E-bike není podvádění – je to technologie",
    options: [
      { label: "Ne, jen svaly", icon: "🦵", desc: "Klasické kolo", tags: { ebike: false } },
      { label: "Proč ne", icon: "🔋", desc: "Otevřený/á tomu", tags: { ebike: "open" } },
      { label: "Ano, určitě", icon: "⚡", desc: "Chci motor na pomoc", tags: { ebike: true } },
    ],
  },
];

const bikeProfiles = {
  road: { name: "Silniční kolo", icon: "🚴‍♂️", color: "#C62828", description: "Rychlé, lehké kolo stvořené na asfalt. Ideální na trénink, závody i dlouhé výjezdy po silnicích.", params: ["Rám: Karbon nebo hliník", "Kola: 700c, pláště 25–32 mm", "Převodovka: 2×11 nebo 2×12", "Brzdy: Kotoučové nebo ráfkové", "Hmotnost: 7–9 kg"], tip: "Při rozpočtu do 30 000 Kč hledej hliníkový rám se Shimano 105 nebo Tiagra. Karbon začíná od cca 40 000 Kč." },
  gravel: { name: "Gravel bike", icon: "🌍", color: "#37474F", description: "Univerzál na silnice i terén. Zvládne štěrk, les, polní cesty i asfalt. Král dobrodružství.", params: ["Rám: Hliník nebo karbon", "Kola: 700c nebo 650b, pláště 35–50 mm", "Převodovka: 1× nebo 2× (11/12 rychlostí)", "Brzdy: Kotoučové hydraulické", "Hmotnost: 8–11 kg"], tip: "Skvělé první \"vážné\" kolo. Hledej modely s úchyty na brašny. Kazeta 11-36T nebo 11-42T dá pohodový rozsah i do kopců." },
  mtb_xc: { name: "MTB Cross-country (XC)", icon: "🏔", color: "#1B5E20", description: "Závodní horské kolo pro rychlost a efektivitu. Maratony, XC závody, rychlé jízdy krajinou.", params: ["Rám: Karbon nebo hliník", "Kola: 29\"", "Odpružení: Hardtail 100 mm nebo full 100–120 mm", "Převodovka: 1×12", "Hmotnost: 8–11 kg"], tip: "Hardtail je levnější a lehčí start. Full-sus XC zvyšuje komfort a trakci. Od 35 000 Kč najdeš solidní modely." },
  mtb_trail: { name: "MTB Trail / All-mountain", icon: "🚲", color: "#2E7D32", description: "Nejuniverzálnější horské kolo. Traily, výlety, singltreky – zvládne výjezdy i sjezdy.", params: ["Rám: Hliník nebo karbon", "Kola: 29\" nebo 27.5\"", "Odpružení: Full-sus 120–150 mm", "Převodovka: 1×12", "Hmotnost: 12–15 kg"], tip: "Ideální první \"vážné\" MTB. Zdvih 130–140 mm je zlatý střed. Pokud začínáš, trail bike je nejlepší volba do terénu." },
  mtb_enduro: { name: "MTB Enduro / Freeride", icon: "🔥", color: "#E65100", description: "Agresivní kolo pro náročný terén, strmé sjezdy, skoky a enduro závody. Sjede i vyjede.", params: ["Rám: Hliník nebo karbon", "Kola: 29\" nebo 27.5\"", "Odpružení: Full-sus 150–180 mm", "Převodovka: 1×12, robustní komponenty", "Hmotnost: 14–17 kg"], tip: "Vyplatí se investovat do kvalitního odpružení. Od 50 000 Kč dostaneš kolo, se kterým si v terénu opravdu užiješ." },
  mtb_dh: { name: "MTB Downhill", icon: "⬇️", color: "#B71C1C", description: "Speciál na sjezdy a bikeparky. Maximální odpružení, robustnost a kontrola při vysoké rychlosti.", params: ["Rám: Hliník nebo karbon", "Kola: 29\" nebo 27.5\"", "Odpružení: Full-sus 180–200+ mm", "Brzdy: 4pístové, kotouče 200+ mm", "Hmotnost: 15–19 kg"], tip: "DH kolo se nevyplatí jako jediné – je to speciál. Zvažuj, jestli nestačí enduro. Dává smysl od 60 000 Kč+." },
  city: { name: "Městské / Trekingové kolo", icon: "🏙️", color: "#F9A825", description: "Spolehlivý společník na dojíždění a město. Vzpřímená pozice, světla, blatníky, nosič.", params: ["Rám: Hliník (step-through nebo klasický)", "Kola: 28\" s blatníky", "Převodovka: Nábojové řazení nebo 1×8/9", "Brzdy: Kotoučové nebo V-brake", "Výbava: Světla, nosič, blatníky, zámek"], tip: "Prioritou je spolehlivost a nízká údržba. Nábojové řazení + řemen = téměř bezúdržbový stroj." },
  cross: { name: "Krosové / Trekové kolo", icon: "🤸️", color: "#00695C", description: "Sportovní univerzál na cyklostezky a lehký terén. Rychlejší než MTB, odolnější než silnička.", params: ["Rám: Hliník", "Kola: 28\", pláště 35–42 mm", "Odpružení: Vidlice 50–63 mm nebo pevná", "Převodovka: 3×8/9 nebo 1×10", "Hmotnost: 12–15 kg"], tip: "Nejprodávanější typ kola v ČR. Skvělý na cykloturistiku i dojíždění. Můžeš dovybavit blatníky a nosič." },
  cx: { name: "Cyklokrosové kolo", icon: "🌀", color: "#4A148C", description: "Závodní kolo na CX závody a zimní trénink. Lehké, mrštné, zvládne bláto i trávu.", params: ["Rám: Karbon nebo hliník", "Kola: 700c, pláště 32–40 mm se vzorkem", "Převodovka: 1× nebo 2×", "Brzdy: Kotoučové hydraulické", "Hmotnost: 8–10 kg"], tip: "Pokud neplánuješ CX závody, gravel bike je univerzálnější. CX je specifický závodní nástroj." },
  fitness: { name: "Fitness kolo", icon: "💪", color: "#0277BD", description: "Rychlé městské kolo s rovnými řídítky. Sportovnější než krosové, pohodlnější než silniční.", params: ["Rám: Hliník, karbonová vidlice", "Kola: 28\", pláště 28–35 mm", "Převodovka: 2×8/9 nebo 1×11", "Brzdy: Kotoučové", "Hmotnost: 9–12 kg"], tip: "Ideální pro kondici a dojíždění na zpevněných cestách. Rovná řídítka = komfortnější pozice než silnička." },
};

// ——— DATA: QUIZ 2 - VELIKOST KOLA ———

const sizeQuestions = [
  { id: "height", question: "Jaká je tvoje výška?", subtitle: "Vyber rozmezí nejblíže tvé postavě", options: [
    { label: "Pod 155 cm", value: "xs" }, { label: "155 – 165 cm", value: "s" }, { label: "165 – 175 cm", value: "m" },
    { label: "175 – 185 cm", value: "l" }, { label: "185 – 195 cm", value: "xl" }, { label: "Nad 195 cm", value: "xxl" },
  ]},
  { id: "inseam", question: "Jaká je délka tvé vnitřní nohy?", subtitle: "Změř vzdálenost od podlahy k rozkroku (v cm). Stůj rovně, bez bot.", options: [
    { label: "Pod 70 cm", value: "short" }, { label: "70 – 76 cm", value: "medium_short" }, { label: "76 – 82 cm", value: "medium" },
    { label: "82 – 88 cm", value: "medium_long" }, { label: "88 – 94 cm", value: "long" }, { label: "Nad 94 cm", value: "very_long" },
  ]},
  { id: "bikeType", question: "Pro jaký typ kola hledáš velikost?", subtitle: "Různé typy mají odlišné tabulky", options: [
    { label: "Horské kolo (MTB)", value: "mtb" }, { label: "Silniční kolo", value: "road" }, { label: "Gravel", value: "gravel" },
    { label: "Krosové / Trekingové", value: "cross" }, { label: "Městské kolo", value: "city" },
  ]},
  { id: "style", question: "Jaký styl jízdy preferuješ?", subtitle: "Ovlivňuje, zda zvolit menší nebo větší rám", options: [
    { label: "Sportovní a agresivní", value: "sport", desc: "Menší rám = lepší ovladatelnost" },
    { label: "Pohodová a výletní", value: "comfort", desc: "Větší rám = stabilita a komfort" },
    { label: "Nevím, něco mezi", value: "neutral", desc: "Standardní doporučení" },
  ]},
];

const sizeTables = {
  mtb: { xs: { frame: "13.5\"–14\" (XS)", wheel: "27.5\"" }, s: { frame: "15\"–16\" (S)", wheel: "27.5\" / 29\"" }, m: { frame: "17\"–18\" (M)", wheel: "29\"" }, l: { frame: "19\"–20\" (L)", wheel: "29\"" }, xl: { frame: "21\"–22\" (XL)", wheel: "29\"" }, xxl: { frame: "22\"+ (XXL)", wheel: "29\"" } },
  road: { xs: { frame: "47–49 cm (XXS)", wheel: "700c" }, s: { frame: "49–52 cm (S)", wheel: "700c" }, m: { frame: "52–54 cm (M)", wheel: "700c" }, l: { frame: "54–56 cm (L)", wheel: "700c" }, xl: { frame: "56–58 cm (XL)", wheel: "700c" }, xxl: { frame: "60–62 cm (XXL)", wheel: "700c" } },
  gravel: { xs: { frame: "47–49 cm (XS)", wheel: "650b / 700c" }, s: { frame: "49–52 cm (S)", wheel: "650b / 700c" }, m: { frame: "52–54 cm (M)", wheel: "700c" }, l: { frame: "54–56 cm (L)", wheel: "700c" }, xl: { frame: "56–58 cm (XL)", wheel: "700c" }, xxl: { frame: "58–61 cm (XXL)", wheel: "700c" } },
  cross: { xs: { frame: "15\" (XS)", wheel: "28\"" }, s: { frame: "17\" (S)", wheel: "28\"" }, m: { frame: "19\" (M)", wheel: "28\"" }, l: { frame: "21\" (L)", wheel: "28\"" }, xl: { frame: "22\" (XL)", wheel: "28\"" }, xxl: { frame: "23\"+ (XXL)", wheel: "28\"" } },
  city: { xs: { frame: "15\" (XS)", wheel: "26\" / 28\"" }, s: { frame: "17\" (S)", wheel: "28\"" }, m: { frame: "19\" (M)", wheel: "28\"" }, l: { frame: "21\" (L)", wheel: "28\"" }, xl: { frame: "22\" (XL)", wheel: "28\"" }, xxl: { frame: "23\"+ (XXL)", wheel: "28\"" } },
};

const inseamAdj = { short: -1, medium_short: -0.5, medium: 0, medium_long: 0, long: 0.5, very_long: 1 };
const btLabels = { mtb: "Horské kolo", road: "Silniční kolo", gravel: "Gravel", cross: "Krosové kolo", city: "Městské kolo" };

// ——— UI COMPONENTS ———

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

function ResCard({ profile, score, maxScore, ebike, rank }) {
  const pct = Math.round((score / maxScore) * 100);
  const top = rank === 0;
  return (
    <div style={{ background: top ? profile.color : "#faf8f4", color: top ? "#fff" : "#1a1a2e", borderRadius: "16px", padding: top ? "24px" : "18px", opacity: 0, animation: "fadeSlideIn 0.5s ease forwards", animationDelay: `${rank * 0.1}s`, border: top ? "none" : "1px solid #e0ddd5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          {top && <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.8, marginBottom: "5px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>★ Nejlepší volba pro tebe</div>}
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
      {top && (
        <>
          <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: "10px", padding: "12px 16px", marginBottom: "10px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "6px", opacity: 0.7, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Doporučené parametry</div>
            {profile.params.map((p, i) => <div key={i} style={{ fontSize: "12px", padding: "2px 0", fontFamily: "'DM Sans',sans-serif", opacity: 0.9 }}>{p}</div>)}
          </div>
          <div style={{ background: "rgba(255,255,255,0.11)", borderRadius: "10px", padding: "10px 14px", fontSize: "12px", lineHeight: 1.5, fontFamily: "'DM Sans',sans-serif" }}>
            <strong>💡 Tip:</strong> {profile.tip}
          </div>
        </>
      )}
    </div>
  );
}

// ——— ANATOMY DATA ———

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
      { name: "Inverted (USD)", info: "Obrácená konstrukce – nohy nahoře. Lepší tuhost. Na DH a enduro speciály. Zdvihy 170–200+ mm." },
    ],
  },
  wheels: {
    label: "Kola a pláště", icon: "⭕", color: "#E65100",
    desc: "Průměr kol a šířka plášťů zásadně ovlivňují rychlost, komfort a terénní schopnosti.",
    options: [
      { name: "26\" (MTB legacy)", info: "Dříve standard MTB. Dnes hlavně na DH speciály a dětská kola. Obratné, ale pomalejší přes překážky." },
      { name: "27.5\" (650b)", info: "Kompromis mezi obratností a rychlostí. Oblíbené u enduro/trail kol a menších jezdců. Hravější pocit." },
      { name: "29\" (MTB standard)", info: "Dnešní standard pro MTB. Lépe překonávají překážky, vyšší rychlost, stabilita. Pro jezdce nad 165 cm." },
      { name: "700c / 28\"", info: "Standard pro silniční, gravel, krosová a městská kola. Pláště od 25 mm (silnice) po 50 mm (gravel)." },
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
      { name: "Nábojové řazení", info: "Převody ukryté v zadním náboji (Shimano Nexus/Alfine). Bezúdržbové, čisté. Na městská a trekinková kola." },
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
      { name: "Městská / Treková", info: "Lehce zahnutá nahoru. Vzpřímená pozice, komfort. Na městská a trekinková kola. Dobrý přehled v provozu." },
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
      { name: "S výkrojením / kanálem", info: "Odlehčení tlaku na citlivá místa. Doporučeno pro delší jízdy. Unisex a speciální dámské varianty." },
      { name: "Teleskopická sedlovka (dropper)", info: "Sedlo se dá za jízdy spustit tlačítkem. Standard pro MTB trail/enduro. Lepší kontrola ve sjezdech." },
    ],
  },
  pedals: {
    label: "Pedály", icon: "👟", color: "#AD1457",
    desc: "Spojení mezi jezdcem a kolem. Typ pedálů ovlivňuje efektivitu a bezpečnost.",
    options: [
      { name: "Platformové (ploché)", info: "Univerzální, lze jezdit v jakékoli obuvi. Noha se snadno sundá. Pro město, začátečníky, MTB gravity." },
      { name: "Nášlapné SPD (MTB)", info: "Cvaknutí tretry do pedálu. Efektivnější šlapání – táhnete i nahoru. Shimano SPD je standard pro MTB a trekking." },
      { name: "Nášlapné Look/SPD-SL (silniční)", info: "Větší plocha kontaktu, maximální přenos síly. Pro silniční a závodní jízdu. Špatná chůze v tretrách." },
      { name: "Kombinované (hybrid)", info: "Jedna strana nášlapná, druhá plochá. Kompromis pro dojíždění – tretry nebo běžné boty." },
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
            <line x1="145" y1="120" x2="265" y2="120" stroke="#1a1a2e" strokeWidth="5" strokeLinecap="round" />
            <line x1="145" y1="120" x2="120" y2="210" stroke="#1a1a2e" strokeWidth="5" strokeLinecap="round" />
            <line x1="265" y1="120" x2="290" y2="230" stroke="#1a1a2e" strokeWidth="5" strokeLinecap="round" />
            <line x1="265" y1="120" x2="380" y2="210" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" />
            <line x1="290" y1="230" x2="380" y2="210" stroke="#1a1a2e" strokeWidth="4" strokeLinecap="round" />
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
        <span style={{ fontSize: "14px", color: "#aaa", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none" }}>⌄</span>
      </div>
      {open && (
        <p style={{ margin: "8px 0 0", fontSize: "12px", lineHeight: 1.55, color: "#555", fontFamily: "'DM Sans',sans-serif" }}>{opt.info}</p>
      )}
    </div>
  );
}

// ——— LANDING PAGE SECTIONS ———

function HeroSection({ onStart }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "60px 20px 80px", position: "relative", overflow: "hidden" }}>
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
        <span style={{ fontSize: "12px", color: "#aaa7a0", fontFamily: "'DM Sans',sans-serif" }}>Zdarma • Bez registrace • 10 otázek</span>
      </div>

      <div style={{ display: "flex", gap: "32px", marginTop: "56px", opacity: 0, animation: "fadeSlideIn 0.7s ease forwards", animationDelay: "0.7s" }}>
        {[{ n: "10+", l: "typů kol" }, { n: "3", l: "nástroje" }, { n: "2 min", l: "stačí" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 900, color: "#1a1a2e", fontFamily: "'DM Sans',sans-serif" }}>{s.n}</div>
            <div style={{ fontSize: "11px", color: "#aaa7a0", fontFamily: "'DM Sans',sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>{s.l}</div>
          </div>
        ))}
      </div>

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
    { icon: "🧭", title: "Jaké kolo je pro mě?", desc: "10 otázek o terénu, cílech a rozpočtu – přesné doporučení z 10 typů kol.", color: "#C62828" },
    { icon: "📏", title: "Jaká velikost rámu?", desc: "4 otázky o výšce a stylu jízdy – doporučená velikost rámu a průměr kol.", color: "#1B5E20" },
    { icon: "🔧", title: "Anatomie kola", desc: "Interaktivní průvodce všemi komponenty – rám, brzdy, převodovka a další.", color: "#0277BD" },
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
    { q: "Jak přesné je doporučení?", a: "Kvíz pracuje s bodovacím systémem, který vyhodnocuje 10 kategorií kol na základě tvých odpovědí. Výsledek je orientační doporučení – finální rozhodnutí bys měl/a vždy konzultovat s prodejcem a kolo ideálně vyzkoušet." },
    { q: "Prodáváte kola?", a: "Ne, jsme nezávislý poradce. Neprodáváme žádné zboží. Naším cílem je pomoci ti zorientovat se ve světě kol, ať už kupuješ poprvé nebo upgradeuješ." },
    { q: "Pro koho je kvíz určený?", a: "Pro kohokoliv – od úplných začátečníků, kteří nevědí, jaký typ kola potřebují, po pokročilé jezdce, kteří chtějí ověřit svůj výběr nebo zjistit velikost rámu." },
    { q: "Mohu si výsledek uložit?", a: "Ano, na výsledkové stránce najdeš tlačítko pro uložení výsledku jako obrázek do telefonu nebo počítače." },
    { q: "Jaké typy kol kvíz pokrývá?", a: "Silniční, gravel, MTB cross-country, MTB trail/all-mountain, MTB enduro/freeride, MTB downhill, městské, krosové/trekové, cyklokrosové a fitness kolo – celkem 10 kategorií." },
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
                <span style={{ fontSize: "16px", color: "#aaa", transition: "transform 0.3s", transform: open === i ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: "12px" }}>⌄</span>
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

// ——— MAIN APP ———

export default function App() {
  const [page, setPage] = useState("landing");
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

  const qs = quiz === "type" ? questions : sizeQuestions;
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
    Object.entries(ans).forEach(([qi, oi]) => {
      const opt = questions[parseInt(qi)].options[oi];
      if (opt.tags.ebike !== undefined) eb = opt.tags.ebike;
      else Object.entries(opt.tags).forEach(([k, v]) => { if (scores[k] !== undefined) scores[k] += v; });
    });
    const mx = Math.max(...Object.values(scores));
    return { sorted: Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 4), mx, eb };
  };

  const sizeResults = () => {
    const hv = sizeQuestions[0].options[ans[0]]?.value || "m";
    const iv = sizeQuestions[1].options[ans[1]]?.value || "medium";
    const bt = sizeQuestions[2].options[ans[2]]?.value || "mtb";
    const sv = sizeQuestions[3].options[ans[3]]?.value || "neutral";
    const tbl = sizeTables[bt] || sizeTables.mtb;
    const base = tbl[hv] || tbl.m;
    const keys = Object.keys(tbl);
    const idx = keys.indexOf(hv);
    const adj = (inseamAdj[iv] || 0) + (sv === "sport" ? -0.5 : sv === "comfort" ? 0.5 : 0);
    let alt = null;
    if (adj < -0.5 && idx > 0) alt = { dir: "menší", ...tbl[keys[idx - 1]] };
    else if (adj > 0.5 && idx < keys.length - 1) alt = { dir: "větší", ...tbl[keys[idx + 1]] };
    return { base, bt, hv, iv, sv, alt };
  };

  // —— LANDING PAGE ——
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

  // —— QUIZ PAGES ——

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
          {[{ k: "type", ic: "🧭", t: "Jaké kolo je pro mě?", d: "10 otázek → doporučení typu kola s parametry", dl: "0.1s" },
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
    const { sorted, mx, eb } = typeResults();
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
              {sorted.map(([k, sc], i) => <ResCard key={k} profile={bikeProfiles[k]} score={sc} maxScore={mx} ebike={i === 0 ? eb : false} rank={i} />)}
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

  // SIZE RESULTS
  if (quiz === "size" && done) {
    const r = sizeResults();
    return (
      <div style={S.ctr}><style>{KF}</style>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div style={S.inn}>
          <div ref={ref} style={{ background: "linear-gradient(165deg,#f5f3ed,#ece8df)", borderRadius: "18px", padding: "24px 18px" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h1 style={{ ...S.ttl, fontSize: "28px" }}>Tvoje velikost kola</h1>
              <p style={{ ...S.sub, margin: "3px 0 0" }}>{btLabels[r.bt]}</p>
            </div>
            <div style={{ background: "#1a1a2e", color: "#faf8f4", borderRadius: "16px", padding: "24px", opacity: 0, animation: "fadeSlideIn 0.5s ease forwards" }}>
              <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.7, marginBottom: "14px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>★ Doporučená velikost</div>
              <div style={{ display: "flex", justifyContent: "space-around", textAlign: "center", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "5px", fontFamily: "'DM Sans',sans-serif" }}>Velikost rámu</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>{r.base.frame}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "5px", fontFamily: "'DM Sans',sans-serif" }}>Průměr kol</div>
                  <div style={{ fontSize: "22px", fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>{r.base.wheel}</div>
                </div>
              </div>
              {r.alt && <div style={{ marginTop: "14px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", fontSize: "12px", fontFamily: "'DM Sans',sans-serif" }}>
                💡 Na základě délky nohou a stylu jízdy zvažuj i <strong>{r.alt.dir} rám: {r.alt.frame}</strong>
              </div>}
            </div>
            {[{ t: "Jak ověřit velikost", x: "Stoj obkročmo nad rámem – horní trubka by měla být asi 5 cm pod rozkrokem. Sedni si na kolo – pokud je to pohodlné na první dobrou, velikost je správná." },
              { t: "Na rozmezí dvou velikostí?", x: r.sv === "sport" ? "Volíš sportovnější styl – vyber menší rám pro lepší ovladatelnost." : r.sv === "comfort" ? "Preferuješ komfort – vyber větší rám pro stabilitu." : "Sportovní jezdci volí menší rám (hravost), výletní jezdci větší rám (stabilita)." },
              { t: "⚠️ Orientační údaje", x: "Každý výrobce má jinou geometrii rámu. Vždy se řiďte tabulkou konkrétního modelu a ideálně kolo vyzkoušejte na prodejně." },
            ].map((it, i) => (
              <div key={i} style={{ background: "#faf8f4", border: "1px solid #e0ddd5", borderRadius: "11px", padding: "12px 16px", marginTop: "10px", opacity: 0, animation: "fadeSlideIn 0.4s ease forwards", animationDelay: `${0.2 + i * 0.1}s` }}>
                <div style={{ fontSize: "12px", fontWeight: 700, marginBottom: "3px", fontFamily: "'DM Sans',sans-serif" }}>{it.t}</div>
                <div style={{ fontSize: "12px", lineHeight: 1.5, color: "#555", fontFamily: "'DM Sans',sans-serif" }}>{it.x}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "18px", flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={saveImg} disabled={saving} style={{ ...S.pri, opacity: saving ? 0.5 : 1 }}>{saving ? "Ukládám..." : "📱 Uložit výsledek"}</button>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "8px", justifyContent: "center" }}>
            <button onClick={reset} style={S.sec}>↺ Znovu</button>
            <button onClick={menu} style={S.sec}>← Menu</button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ FLOW
  return (
    <div style={S.ctr}><style>{KF}</style>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={S.inn}>
        <div style={{ textAlign: "center", marginBottom: "4px" }}>
          <h1 style={{ ...S.ttl, fontSize: "24px" }}>{quiz === "type" ? "Jaké kolo je pro tebe?" : "Jaká velikost rámu?"}</h1>
          <p style={S.sub}>{quiz === "type" ? `${qs.length} otázek → tvoje ideální kolo` : "4 otázky → přesné doporučení"}</p>
        </div>
        <ProgressBar current={step} total={qs.length} />
        <div style={{ opacity: anim ? 0 : 1, transform: anim ? "translateY(8px)" : "translateY(0)", transition: "all 0.2s" }}>
          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: "#8a8580", marginBottom: "5px", fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Otázka {step + 1} z {qs.length}</div>
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
