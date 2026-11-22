import { useState } from 'react';
import { useAppStore } from '@/context/store';

type CircuitType = 'staircase' | 'godown' | 'tubelight' | 'fan' | 'dol' | 'starDelta';
type WiringTab = 'circuits' | 'practice' | 'quiz';

interface WireStep {
  en: string;
  hi: string;
}

interface CircuitData {
  icon: string;
  title: { en: string; hi: string };
  desc: { en: string; hi: string };
  components: { en: string; hi: string }[];
  steps: WireStep[];
  formula?: { label: { en: string; hi: string }; value: string };
  tip: { en: string; hi: string };
}

const CIRCUITS: Record<CircuitType, CircuitData> = {
  staircase: {
    icon: '🏠',
    title: { en: 'Staircase Wiring (Two-Way Control)', hi: 'सीढ़ी वायरिंग (दो-तरफा नियंत्रण)' },
    desc: {
      en: 'Controls a lamp from two different positions using two 2-way (SPDT) switches. Used in staircases, long corridors, and bedrooms.',
      hi: 'दो 2-वे (SPDT) स्विच का उपयोग करके दो अलग-अलग स्थानों से एक लैंप को नियंत्रित करता है। सीढ़ियों, लंबे गलियारों और बेडरूम में उपयोग होता है।',
    },
    components: [
      { en: '2× Two-way (SPDT) switches', hi: '2× दो-तरफा (SPDT) स्विच' },
      { en: '1× Lamp holder with bulb', hi: '1× लैंप होल्डर बल्ब सहित' },
      { en: 'Phase, Neutral, Earth wires', hi: 'फेज, न्यूट्रल, अर्थ तार' },
      { en: 'Junction box, PVC conduit', hi: 'जंक्शन बॉक्स, PVC कंड्यूट' },
    ],
    steps: [
      { en: 'Connect Phase (Red) wire to common terminal of Switch-1', hi: 'फेज (लाल) तार को स्विच-1 के कॉमन टर्मिनल से जोड़ें' },
      { en: 'Connect two strappers between Switch-1 and Switch-2 (terminals L1-L1 and L2-L2)', hi: 'स्विच-1 और स्विच-2 के बीच दो स्ट्रैपर जोड़ें (टर्मिनल L1-L1 और L2-L2)' },
      { en: 'Connect common terminal of Switch-2 to Lamp holder', hi: 'स्विच-2 के कॉमन टर्मिनल को लैंप होल्डर से जोड़ें' },
      { en: 'Connect Neutral (Black) wire directly to Lamp holder', hi: 'न्यूट्रल (काला) तार सीधे लैंप होल्डर से जोड़ें' },
      { en: 'Connect Earth (Green-Yellow) wire to all metal parts', hi: 'अर्थ (हरा-पीला) तार सभी धातु भागों से जोड़ें' },
      { en: 'Test: Toggle either switch to turn lamp ON/OFF from both positions', hi: 'परीक्षण: किसी भी स्विच को टॉगल करके दोनों स्थानों से लैंप ON/OFF करें' },
    ],
    tip: {
      en: 'Key principle: When both switches are in the same position (both UP or both DOWN), lamp is ON. When in different positions, lamp is OFF.',
      hi: 'मुख्य सिद्धांत: जब दोनों स्विच एक ही स्थिति में हों (दोनों UP या दोनों DOWN), लैंप ON। जब अलग-अलग स्थिति में हों, लैंप OFF।',
    },
  },
  godown: {
    icon: '🏭',
    title: { en: 'Godown Wiring (Multi-Point Control)', hi: 'गोदाम वायरिंग (बहु-बिंदु नियंत्रण)' },
    desc: {
      en: 'Controls a lamp from more than two positions using intermediate (4-way/DPDT) switches between two 2-way switches. Used in godowns, large halls, and warehouses.',
      hi: 'दो 2-वे स्विच के बीच मध्यवर्ती (4-वे/DPDT) स्विच का उपयोग करके दो से अधिक स्थानों से एक लैंप को नियंत्रित करता है।',
    },
    components: [
      { en: '2× Two-way (SPDT) switches (at ends)', hi: '2× दो-तरफा (SPDT) स्विच (सिरों पर)' },
      { en: '1+ Intermediate (DPDT/4-way) switch(es)', hi: '1+ मध्यवर्ती (DPDT/4-वे) स्विच' },
      { en: '1× Lamp holder with bulb', hi: '1× लैंप होल्डर बल्ब सहित' },
      { en: 'Wiring, conduit, junction boxes', hi: 'तार, कंड्यूट, जंक्शन बॉक्स' },
    ],
    steps: [
      { en: 'Connect Phase to common of first 2-way switch (S1)', hi: 'फेज को पहले 2-वे स्विच (S1) के कॉमन से जोड़ें' },
      { en: 'Connect S1 terminals L1,L2 to intermediate switch input pair', hi: 'S1 के टर्मिनल L1,L2 को इंटरमीडिएट स्विच इनपुट से जोड़ें' },
      { en: 'Cross-connect intermediate switch: in straight position, signals pass through; in cross position, signals swap', hi: 'इंटरमीडिएट स्विच क्रॉस-कनेक्ट करें: सीधी स्थिति में सिग्नल गुजरते हैं; क्रॉस स्थिति में सिग्नल स्वैप होते हैं' },
      { en: 'Connect intermediate switch output pair to last 2-way switch (S2) terminals', hi: 'इंटरमीडिएट स्विच आउटपुट को अंतिम 2-वे स्विच (S2) से जोड़ें' },
      { en: 'Connect S2 common to Lamp, Neutral directly to Lamp', hi: 'S2 कॉमन को लैंप से, न्यूट्रल सीधे लैंप से जोड़ें' },
      { en: 'For more control points, add more intermediate switches in series', hi: 'अधिक नियंत्रण बिंदुओं के लिए, श्रेणी में और मध्यवर्ती स्विच जोड़ें' },
    ],
    tip: {
      en: 'For N control points: use 2 two-way switches + (N-2) intermediate switches.',
      hi: 'N नियंत्रण बिंदुओं के लिए: 2 दो-तरफा स्विच + (N-2) मध्यवर्ती स्विच का उपयोग करें।',
    },
  },
  tubelight: {
    icon: '💡',
    title: { en: 'Tube Light Circuit', hi: 'ट्यूब लाइट सर्किट' },
    desc: {
      en: 'Fluorescent tube light circuit with choke (ballast) and starter. The choke limits current and starter provides initial high voltage kick.',
      hi: 'चोक (बैलास्ट) और स्टार्टर के साथ फ्लोरोसेंट ट्यूब लाइट सर्किट। चोक करंट सीमित करता है और स्टार्टर प्रारंभिक उच्च वोल्टेज किक प्रदान करता है।',
    },
    components: [
      { en: '1× Fluorescent tube (20W/36W/40W)', hi: '1× फ्लोरोसेंट ट्यूब (20W/36W/40W)' },
      { en: '1× Choke/Ballast (matching wattage)', hi: '1× चोक/बैलास्ट (मिलान वाट)' },
      { en: '1× Starter (matching rating)', hi: '1× स्टार्टर (मिलान रेटिंग)' },
      { en: '1× Switch, Phase/Neutral wires', hi: '1× स्विच, फेज/न्यूट्रल तार' },
    ],
    steps: [
      { en: 'Connect Phase through Switch to one end of Choke', hi: 'फेज को स्विच के माध्यम से चोक के एक सिरे से जोड़ें' },
      { en: 'Connect other end of Choke to Pin-1 of Tube', hi: 'चोक के दूसरे सिरे को ट्यूब के Pin-1 से जोड़ें' },
      { en: 'Connect Pin-2 of Tube to one terminal of Starter', hi: 'ट्यूब के Pin-2 को स्टार्टर के एक टर्मिनल से जोड़ें' },
      { en: 'Connect other terminal of Starter to Pin-3 of Tube', hi: 'स्टार्टर के दूसरे टर्मिनल को ट्यूब के Pin-3 से जोड़ें' },
      { en: 'Connect Pin-4 of Tube directly to Neutral', hi: 'ट्यूब के Pin-4 को सीधे न्यूट्रल से जोड़ें' },
      { en: 'Working: Starter heats filaments → breaks → choke generates high voltage kick → gas ionizes → tube glows', hi: 'कार्यविधि: स्टार्टर फिलामेंट गर्म करता है → टूटता है → चोक उच्च वोल्टेज किक उत्पन्न करता है → गैस आयनित होती है → ट्यूब चमकती है' },
    ],
    formula: { label: { en: 'Power Factor Correction', hi: 'पावर फैक्टर सुधार' }, value: 'C = I / (2πfV) for PF improvement' },
    tip: {
      en: 'If tube flickers: check starter first. If ends glow but no light: starter is faulty. If no glow at all: check choke continuity.',
      hi: 'यदि ट्यूब टिमटिमाती है: पहले स्टार्टर जांचें। यदि सिरे चमकते हैं लेकिन प्रकाश नहीं: स्टार्टर खराब है। यदि कोई चमक नहीं: चोक की निरंतरता जांचें।',
    },
  },
  fan: {
    icon: '🌀',
    title: { en: 'Ceiling Fan with Regulator', hi: 'सीलिंग फैन रेगुलेटर सहित' },
    desc: {
      en: 'Single-phase induction motor (ceiling fan) with electronic/step-type regulator for speed control. Fan is a capacitor-start, capacitor-run motor.',
      hi: 'इलेक्ट्रॉनिक/स्टेप-टाइप रेगुलेटर के साथ सिंगल-फेज इंडक्शन मोटर (सीलिंग फैन) स्पीड कंट्रोल के लिए।',
    },
    components: [
      { en: '1× Ceiling fan (capacitor motor)', hi: '1× सीलिंग फैन (कैपेसिटर मोटर)' },
      { en: '1× Fan regulator (electronic or step type)', hi: '1× फैन रेगुलेटर (इलेक्ट्रॉनिक या स्टेप टाइप)' },
      { en: '1× Capacitor (2.25μF for standard fan)', hi: '1× कैपेसिटर (मानक फैन के लिए 2.25μF)' },
      { en: 'Switch, wiring, down rod, canopy', hi: 'स्विच, वायरिंग, डाउन रॉड, कैनोपी' },
    ],
    steps: [
      { en: 'Connect Phase through Switch to Regulator input', hi: 'फेज को स्विच के माध्यम से रेगुलेटर इनपुट से जोड़ें' },
      { en: 'Connect Regulator output to Fan terminal (Blue/Black wire)', hi: 'रेगुलेटर आउटपुट को फैन टर्मिनल (नीला/काला तार) से जोड़ें' },
      { en: 'Connect Capacitor between Main and Auxiliary windings', hi: 'मुख्य और सहायक वाइंडिंग के बीच कैपेसिटर जोड़ें' },
      { en: 'Connect Neutral directly to Fan common terminal', hi: 'न्यूट्रल सीधे फैन कॉमन टर्मिनल से जोड़ें' },
      { en: 'Connect Earth to fan body and down rod', hi: 'अर्थ को फैन बॉडी और डाउन रॉड से जोड़ें' },
      { en: 'Electronic regulator: uses TRIAC/DIAC to control voltage waveform (more efficient)', hi: 'इलेक्ट्रॉनिक रेगुलेटर: TRIAC/DIAC का उपयोग करके वोल्टेज वेवफॉर्म नियंत्रित करता है (अधिक कुशल)' },
    ],
    tip: {
      en: 'Electronic regulators save 30-40% energy vs resistance-type. Capacitor value affects starting torque — wrong value causes humming.',
      hi: 'इलेक्ट्रॉनिक रेगुलेटर प्रतिरोध-प्रकार की तुलना में 30-40% ऊर्जा बचाते हैं। कैपेसिटर मान स्टार्टिंग टॉर्क को प्रभावित करता है।',
    },
  },
  dol: {
    icon: '⚙️',
    title: { en: 'DOL Starter (Direct Online)', hi: 'DOL स्टार्टर (डायरेक्ट ऑनलाइन)' },
    desc: {
      en: 'Simplest motor starter that connects motor directly to supply. Suitable for motors up to 5 HP. Uses contactor and overload relay for protection.',
      hi: 'सबसे सरल मोटर स्टार्टर जो मोटर को सीधे सप्लाई से जोड़ता है। 5 HP तक की मोटरों के लिए उपयुक्त।',
    },
    components: [
      { en: '1× Main contactor (3-pole)', hi: '1× मुख्य कॉन्टैक्टर (3-पोल)' },
      { en: '1× Thermal overload relay (OLR)', hi: '1× थर्मल ओवरलोड रिले (OLR)' },
      { en: 'Start (NO) and Stop (NC) push buttons', hi: 'स्टार्ट (NO) और स्टॉप (NC) पुश बटन' },
      { en: 'MCB/Fuse, 3-phase supply, motor', hi: 'MCB/फ्यूज, 3-फेज सप्लाई, मोटर' },
    ],
    steps: [
      { en: 'Connect 3-phase supply R-Y-B through MCB', hi: '3-फेज सप्लाई R-Y-B को MCB के माध्यम से जोड़ें' },
      { en: 'Connect MCB output to main contactor input terminals', hi: 'MCB आउटपुट को मुख्य कॉन्टैक्टर इनपुट टर्मिनलों से जोड़ें' },
      { en: 'Connect contactor output through OLR to motor terminals', hi: 'कॉन्टैक्टर आउटपुट को OLR के माध्यम से मोटर टर्मिनलों से जोड़ें' },
      { en: 'Control circuit: Stop(NC) → Start(NO) in parallel with auxiliary contact → Coil A1', hi: 'कंट्रोल सर्किट: Stop(NC) → Start(NO) सहायक संपर्क के समानांतर → कॉइल A1' },
      { en: 'Connect A2 through OLR NC contact to Neutral', hi: 'A2 को OLR NC संपर्क के माध्यम से न्यूट्रल से जोड़ें' },
      { en: 'Self-holding: Auxiliary NO contact across Start button maintains circuit after Start is released', hi: 'सेल्फ-होल्डिंग: स्टार्ट बटन के पार सहायक NO संपर्क स्टार्ट छोड़ने के बाद सर्किट बनाए रखता है' },
    ],
    formula: { label: { en: 'Starting Current', hi: 'स्टार्टिंग करंट' }, value: 'I_start = 6 to 8 × I_full_load' },
    tip: {
      en: 'DOL gives full voltage starting — high starting current (6-8× full load). Not suitable for motors > 5HP due to voltage dip in supply.',
      hi: 'DOL पूर्ण वोल्टेज स्टार्टिंग देता है — उच्च स्टार्टिंग करंट (6-8× पूर्ण लोड)। 5HP से बड़ी मोटरों के लिए उपयुक्त नहीं।',
    },
  },
  starDelta: {
    icon: '🔺',
    title: { en: 'Star-Delta Starter', hi: 'स्टार-डेल्टा स्टार्टर' },
    desc: {
      en: 'Reduced voltage starter for 3-phase motors >5HP. Starts in Star (Y) connection (1/3 voltage) and switches to Delta (Δ) for running. Starting current reduced to 1/3 of DOL.',
      hi: '3-फेज मोटरों >5HP के लिए कम वोल्टेज स्टार्टर। स्टार (Y) कनेक्शन (1/3 वोल्टेज) में शुरू होता है और चलने के लिए डेल्टा (Δ) में बदलता है।',
    },
    components: [
      { en: '1× Main contactor (K1)', hi: '1× मुख्य कॉन्टैक्टर (K1)' },
      { en: '1× Star contactor (K2)', hi: '1× स्टार कॉन्टैक्टर (K2)' },
      { en: '1× Delta contactor (K3)', hi: '1× डेल्टा कॉन्टैक्टर (K3)' },
      { en: '1× Timer relay, OLR, Start/Stop buttons', hi: '1× टाइमर रिले, OLR, स्टार्ट/स्टॉप बटन' },
    ],
    steps: [
      { en: 'Connect 3-phase supply through MCB to Main contactor K1', hi: '3-फेज सप्लाई को MCB के माध्यम से मुख्य कॉन्टैक्टर K1 से जोड़ें' },
      { en: 'K1 output to motor terminal U1, V1, W1', hi: 'K1 आउटपुट को मोटर टर्मिनल U1, V1, W1 से जोड़ें' },
      { en: 'Star contactor K2: short-circuits motor ends U2, V2, W2 together (star point)', hi: 'स्टार कॉन्टैक्टर K2: मोटर सिरों U2, V2, W2 को एक साथ शॉर्ट करता है (स्टार पॉइंट)' },
      { en: 'Delta contactor K3: connects U2→V1, V2→W1, W2→U1 (delta connection)', hi: 'डेल्टा कॉन्टैक्टर K3: U2→V1, V2→W1, W2→U1 जोड़ता है (डेल्टा कनेक्शन)' },
      { en: 'Timer: On Start → K1+K2 energize (Star start). After timer delay → K2 drops, K3 energizes (Delta run)', hi: 'टाइमर: स्टार्ट पर → K1+K2 ऊर्जित (स्टार स्टार्ट)। टाइमर विलंब के बाद → K2 गिरता है, K3 ऊर्जित (डेल्टा रन)' },
      { en: 'INTERLOCK K2 and K3 — both must NEVER be ON simultaneously (short circuit!)', hi: 'इंटरलॉक K2 और K3 — दोनों कभी एक साथ ON नहीं होने चाहिए (शॉर्ट सर्किट!)' },
    ],
    formula: { label: { en: 'Starting Current Ratio', hi: 'स्टार्टिंग करंट अनुपात' }, value: 'I_star = I_DOL / 3 = (I_FL × 6-8) / 3' },
    tip: {
      en: 'Star-Delta can only be used with motors designed for Delta running. Motor must have 6 terminals (both ends of each winding accessible).',
      hi: 'स्टार-डेल्टा केवल डेल्टा रनिंग के लिए डिज़ाइन की गई मोटरों के साथ उपयोग किया जा सकता है। मोटर में 6 टर्मिनल होने चाहिए।',
    },
  },
};

export default function WiringLab() {
  const { language, addXP } = useAppStore();
  const [activeTab, setActiveTab] = useState<WiringTab>('circuits');
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitType>('staircase');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const circuit = CIRCUITS[selectedCircuit];

  const toggleStep = (key: string) => {
    const next = new Set(completedSteps);
    if (next.has(key)) next.delete(key);
    else { next.add(key); addXP(5); }
    setCompletedSteps(next);
  };

  const QUIZ = [
    {
      q: { en: 'In staircase wiring, how many 2-way switches are used?', hi: 'सीढ़ी वायरिंग में कितने 2-वे स्विच उपयोग होते हैं?' },
      opts: [
        { en: '1', hi: '1' },
        { en: '2', hi: '2' },
        { en: '3', hi: '3' },
        { en: '4', hi: '4' },
      ],
      correct: 1,
    },
    {
      q: { en: 'Which component in a tube light circuit limits current?', hi: 'ट्यूब लाइट सर्किट में कौन सा घटक करंट सीमित करता है?' },
      opts: [
        { en: 'Starter', hi: 'स्टार्टर' },
        { en: 'Choke/Ballast', hi: 'चोक/बैलास्ट' },
        { en: 'Capacitor', hi: 'कैपेसिटर' },
        { en: 'Switch', hi: 'स्विच' },
      ],
      correct: 1,
    },
    {
      q: { en: 'DOL starter is suitable for motors up to:', hi: 'DOL स्टार्टर किस तक की मोटरों के लिए उपयुक्त है:' },
      opts: [
        { en: '1 HP', hi: '1 HP' },
        { en: '5 HP', hi: '5 HP' },
        { en: '20 HP', hi: '20 HP' },
        { en: '50 HP', hi: '50 HP' },
      ],
      correct: 1,
    },
    {
      q: { en: 'In Star-Delta starter, starting current is reduced to:', hi: 'स्टार-डेल्टा स्टार्टर में स्टार्टिंग करंट कम होकर कितनी हो जाती है:' },
      opts: [
        { en: '1/2 of DOL', hi: 'DOL का 1/2' },
        { en: '1/3 of DOL', hi: 'DOL का 1/3' },
        { en: '1/4 of DOL', hi: 'DOL का 1/4' },
        { en: '2/3 of DOL', hi: 'DOL का 2/3' },
      ],
      correct: 1,
    },
    {
      q: { en: 'What happens if K2 and K3 are ON simultaneously in Star-Delta starter?', hi: 'यदि स्टार-डेल्टा स्टार्टर में K2 और K3 एक साथ ON हों तो क्या होगा?' },
      opts: [
        { en: 'Motor runs at half speed', hi: 'मोटर आधी गति पर चलती है' },
        { en: 'Short circuit occurs', hi: 'शॉर्ट सर्किट होता है' },
        { en: 'Motor reverses', hi: 'मोटर उल्टी चलती है' },
        { en: 'Nothing happens', hi: 'कुछ नहीं होता' },
      ],
      correct: 1,
    },
    {
      q: { en: 'Fan speed control by electronic regulator uses:', hi: 'इलेक्ट्रॉनिक रेगुलेटर द्वारा फैन स्पीड कंट्रोल उपयोग करता है:' },
      opts: [
        { en: 'Resistance variation', hi: 'प्रतिरोध परिवर्तन' },
        { en: 'TRIAC/DIAC', hi: 'TRIAC/DIAC' },
        { en: 'Transformer', hi: 'ट्रांसफॉर्मर' },
        { en: 'Capacitor bank', hi: 'कैपेसिटर बैंक' },
      ],
      correct: 1,
    },
  ];

  const quizScore = quizSubmitted ? QUIZ.reduce((a, q, i) => a + (quizAnswers[i] === q.correct ? 1 : 0), 0) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">🔌 {language === 'hi' ? 'वायरिंग प्रयोगशाला' : 'Wiring Practice Lab'}</h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'hi' ? 'घरेलू और औद्योगिक वायरिंग सर्किट सीखें और अभ्यास करें' : 'Learn and practice domestic & industrial wiring circuits'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-surface-dark-2 rounded-xl">
        {[
          { key: 'circuits' as const, icon: '🔌', en: 'Circuits', hi: 'सर्किट' },
          { key: 'practice' as const, icon: '🛠️', en: 'Practice', hi: 'अभ्यास' },
          { key: 'quiz' as const, icon: '📝', en: 'Quiz', hi: 'क्विज़' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-xs font-medium py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-surface-dark shadow-md text-brand-600 dark:text-brand-400'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {language === 'hi' ? tab.hi : tab.en}
          </button>
        ))}
      </div>

      {activeTab === 'circuits' && (
        <div className="grid lg:grid-cols-[240px_1fr] gap-4">
          {/* Circuit Selector */}
          <div className="space-y-1.5">
            {(Object.entries(CIRCUITS) as [CircuitType, CircuitData][]).map(([key, c]) => (
              <button
                key={key}
                onClick={() => { setSelectedCircuit(key); setCompletedSteps(new Set()); }}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  selectedCircuit === key
                    ? 'bg-brand-50 dark:bg-brand-900/20 border-2 border-brand-500'
                    : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-brand-300'
                }`}
              >
                <span className="text-xl">{c.icon}</span>
                <span className="font-medium text-xs leading-tight">{language === 'hi' ? c.title.hi : c.title.en}</span>
              </button>
            ))}
          </div>

          {/* Circuit Detail */}
          <div className="card p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                {circuit.icon} {language === 'hi' ? circuit.title.hi : circuit.title.en}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {language === 'hi' ? circuit.desc.hi : circuit.desc.en}
              </p>
            </div>

            {/* Components */}
            <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-2">🧰 {language === 'hi' ? 'आवश्यक सामग्री:' : 'Components Required:'}</h3>
              <div className="grid sm:grid-cols-2 gap-1.5">
                {circuit.components.map((comp, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    {language === 'hi' ? comp.hi : comp.en}
                  </div>
                ))}
              </div>
            </div>

            {/* Wiring Steps */}
            <div>
              <h3 className="font-semibold text-sm mb-3">📋 {language === 'hi' ? 'वायरिंग चरण:' : 'Wiring Steps:'}</h3>
              <div className="space-y-2">
                {circuit.steps.map((step, i) => {
                  const stepKey = `${selectedCircuit}-${i}`;
                  const done = completedSteps.has(stepKey);
                  return (
                    <button
                      key={i}
                      onClick={() => toggleStep(stepKey)}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all border ${
                        done
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                          : 'bg-white dark:bg-surface-dark border-slate-200 dark:border-slate-700 hover:border-brand-300'
                      }`}
                    >
                      <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                        done ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                      }`}>
                        {done ? '✓' : i + 1}
                      </span>
                      <span className={`text-sm leading-relaxed ${done ? 'text-green-700 dark:text-green-400' : ''}`}>
                        {language === 'hi' ? step.hi : step.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formula */}
            {circuit.formula && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 flex items-center gap-3">
                <span className="text-xl">📐</span>
                <div>
                  <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300">
                    {language === 'hi' ? circuit.formula.label.hi : circuit.formula.label.en}
                  </p>
                  <p className="font-mono text-sm text-indigo-700 dark:text-indigo-400">{circuit.formula.value}</p>
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <p className="text-xs text-amber-800 dark:text-amber-300">{language === 'hi' ? circuit.tip.hi : circuit.tip.en}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-lg mb-4">🛠️ {language === 'hi' ? 'वायरिंग अभ्यास' : 'Wiring Practice'}</h2>

            {/* Wire Color Codes */}
            <div className="mb-5">
              <h3 className="font-semibold text-sm mb-3">{language === 'hi' ? 'तार रंग कोड (भारतीय मानक)' : 'Wire Color Code (Indian Standard)'}</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  { color: '#EF4444', label: { en: 'Red — Phase (R)', hi: 'लाल — फेज (R)' } },
                  { color: '#EAB308', label: { en: 'Yellow — Phase (Y)', hi: 'पीला — फेज (Y)' } },
                  { color: '#3B82F6', label: { en: 'Blue — Phase (B)', hi: 'नीला — फेज (B)' } },
                  { color: '#1F2937', label: { en: 'Black — Neutral (N)', hi: 'काला — न्यूट्रल (N)' } },
                  { color: '#22C55E', label: { en: 'Green/Yellow — Earth (PE)', hi: 'हरा/पीला — अर्थ (PE)' } },
                ].map((w, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-surface-dark-2">
                    <div className="w-8 h-4 rounded" style={{ backgroundColor: w.color, border: w.color === '#1F2937' ? '1px solid #94A3B8' : 'none' }} />
                    <span className="text-xs font-medium">{language === 'hi' ? w.label.hi : w.label.en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cable Sizing */}
            <div className="mb-5">
              <h3 className="font-semibold text-sm mb-3">{language === 'hi' ? 'केबल साइज़िंग गाइड' : 'Cable Sizing Guide'}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-surface-dark-2">
                      <th className="p-2 text-left">{language === 'hi' ? 'उपयोग' : 'Application'}</th>
                      <th className="p-2 text-left">{language === 'hi' ? 'केबल साइज़' : 'Cable Size'}</th>
                      <th className="p-2 text-left">{language === 'hi' ? 'MCB रेटिंग' : 'MCB Rating'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { app: { en: 'Lighting', hi: 'लाइटिंग' }, size: '1.5 sq mm', mcb: '6A' },
                      { app: { en: 'Power socket (5A)', hi: 'पावर सॉकेट (5A)' }, size: '2.5 sq mm', mcb: '16A' },
                      { app: { en: 'Power socket (15A)', hi: 'पावर सॉकेट (15A)' }, size: '4 sq mm', mcb: '20A' },
                      { app: { en: 'AC/Geyser', hi: 'AC/गीज़र' }, size: '4 sq mm', mcb: '25A/32A' },
                      { app: { en: 'Main supply', hi: 'मुख्य सप्लाई' }, size: '6-10 sq mm', mcb: '40A/63A' },
                    ].map((r, i) => (
                      <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-2">{language === 'hi' ? r.app.hi : r.app.en}</td>
                        <td className="p-2 font-mono">{r.size}</td>
                        <td className="p-2 font-mono">{r.mcb}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Common Faults */}
            <div>
              <h3 className="font-semibold text-sm mb-3">🔍 {language === 'hi' ? 'सामान्य दोष और उपचार' : 'Common Faults & Remedies'}</h3>
              <div className="space-y-2">
                {[
                  {
                    fault: { en: 'Open Circuit', hi: 'ओपन सर्किट' },
                    symptoms: { en: 'No current flow, device does not work', hi: 'कोई करंट नहीं बहता, उपकरण काम नहीं करता' },
                    remedy: { en: 'Check continuity with multimeter, find break and rejoin', hi: 'मल्टीमीटर से निरंतरता जांचें, टूट ढूंढें और पुनः जोड़ें' },
                  },
                  {
                    fault: { en: 'Short Circuit', hi: 'शॉर्ट सर्किट' },
                    symptoms: { en: 'MCB trips, fuse blows, excessive current', hi: 'MCB ट्रिप होता है, फ्यूज उड़ता है, अत्यधिक करंट' },
                    remedy: { en: 'Find short with megger, repair insulation, replace damaged wire', hi: 'मेगर से शॉर्ट ढूंढें, इन्सुलेशन सुधारें, क्षतिग्रस्त तार बदलें' },
                  },
                  {
                    fault: { en: 'Earth Fault', hi: 'अर्थ फॉल्ट' },
                    symptoms: { en: 'ELCB/RCCB trips, tingling from metal parts', hi: 'ELCB/RCCB ट्रिप होता है, धातु भागों से झनझनाहट' },
                    remedy: { en: 'Check insulation resistance, verify earthing connections', hi: 'इन्सुलेशन प्रतिरोध जांचें, अर्थिंग कनेक्शन सत्यापित करें' },
                  },
                ].map((f, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                    <p className="font-semibold text-sm text-red-600 dark:text-red-400">⚠️ {language === 'hi' ? f.fault.hi : f.fault.en}</p>
                    <p className="text-xs text-slate-500 mt-1">{language === 'hi' ? f.symptoms.hi : f.symptoms.en}</p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">✅ {language === 'hi' ? f.remedy.hi : f.remedy.en}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-lg">📝 {language === 'hi' ? 'क्विज़: वायरिंग' : 'Quiz: Wiring'}</h2>
          {QUIZ.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="font-medium text-sm mb-3">{qi + 1}. {language === 'hi' ? q.q.hi : q.q.en}</p>
              <div className="grid gap-2">
                {q.opts.map((opt, oi) => {
                  const isSelected = quizAnswers[qi] === oi;
                  const isCorrect = quizSubmitted && oi === q.correct;
                  const isWrong = quizSubmitted && isSelected && oi !== q.correct;
                  return (
                    <button
                      key={oi}
                      onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })}
                      disabled={quizSubmitted}
                      className={`text-left text-sm px-4 py-2 rounded-lg border transition-all ${
                        isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : isWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : isSelected ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + oi)}. {language === 'hi' ? opt.hi : opt.en}
                      {isCorrect && ' ✅'}{isWrong && ' ❌'}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!quizSubmitted ? (
            <button onClick={() => { setQuizSubmitted(true); if (quizScore >= 4) addXP(30); }} className="btn-primary text-sm px-6 py-2">
              📝 {language === 'hi' ? 'जमा करें' : 'Submit'}
            </button>
          ) : (
            <div className={`p-4 rounded-xl text-center ${quizScore >= 4 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
              <p className="text-2xl mb-1">{quizScore >= 4 ? '🎉' : '📚'}</p>
              <p className="font-bold">{quizScore}/{QUIZ.length} {language === 'hi' ? 'सही' : 'Correct'}</p>
              <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} className="btn-secondary text-xs px-4 py-1.5 mt-2">
                🔄 {language === 'hi' ? 'पुनः प्रयास' : 'Retry'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
