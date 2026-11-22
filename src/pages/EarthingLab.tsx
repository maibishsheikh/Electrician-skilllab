import { useState } from 'react';
import { useAppStore } from '@/context/store';

type EarthTab = 'types' | 'testing' | 'quiz';
type EarthType = 'pipe' | 'plate' | 'rod' | 'strip';

export default function EarthingLab() {
  const { language, addXP } = useAppStore();
  const [activeTab, setActiveTab] = useState<EarthTab>('types');
  const [earthType, setEarthType] = useState<EarthType>('pipe');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Earth resistance calculator
  const [soilRes, setSoilRes] = useState(100);
  const [pipeLen, setPipeLen] = useState(2.5);
  const [pipeDia, setPipeDia] = useState(0.038);
  const calcR = () => {
    // R = ρ / (2πL) × ln(4L/d) for pipe/rod earthing
    const R = soilRes / (2 * Math.PI * pipeLen) * Math.log(4 * pipeLen / pipeDia);
    return R;
  };

  const EARTH_TYPES: Record<EarthType, {
    icon: string;
    title: { en: string; hi: string };
    desc: { en: string; hi: string };
    specs: { label: { en: string; hi: string }; value: string }[];
    steps: { en: string; hi: string }[];
    advantages: { en: string; hi: string }[];
  }> = {
    pipe: {
      icon: '🔩',
      title: { en: 'Pipe Earthing', hi: 'पाइप अर्थिंग' },
      desc: {
        en: 'Most common type in India. A GI pipe is buried vertically in the ground. Suitable for large installations with heavy current.',
        hi: 'भारत में सबसे आम प्रकार। एक GI पाइप को जमीन में लंबवत गाड़ा जाता है। भारी करंट वाली बड़ी स्थापनाओं के लिए उपयुक्त।',
      },
      specs: [
        { label: { en: 'Pipe Material', hi: 'पाइप सामग्री' }, value: 'GI (Galvanized Iron)' },
        { label: { en: 'Pipe Diameter', hi: 'पाइप व्यास' }, value: '38mm (1.5") / 50mm (2")' },
        { label: { en: 'Pipe Length', hi: 'पाइप लंबाई' }, value: '2.5m to 3m' },
        { label: { en: 'Depth Below Ground', hi: 'जमीन से नीचे गहराई' }, value: 'Min 2.5m (bottom in moist soil)' },
        { label: { en: 'Earth Wire', hi: 'अर्थ तार' }, value: '8 SWG GI wire' },
      ],
      steps: [
        { en: 'Dig a pit of 30cm × 30cm × 3m depth', hi: '30cm × 30cm × 3m गहराई का गड्ढा खोदें' },
        { en: 'Place GI pipe vertically in the pit', hi: 'GI पाइप को गड्ढे में लंबवत रखें' },
        { en: 'Fill alternate layers of charcoal and salt around the pipe (15cm each)', hi: 'पाइप के चारों ओर चारकोल और नमक की वैकल्पिक परतें भरें (प्रत्येक 15cm)' },
        { en: 'Connect 8 SWG GI earth wire to pipe using GI bolt and nut', hi: '8 SWG GI अर्थ तार को GI बोल्ट और नट से पाइप से जोड़ें' },
        { en: 'Pour water through funnel arrangement (connected via GI pipe from surface)', hi: 'फनल व्यवस्था के माध्यम से पानी डालें (सतह से GI पाइप से जुड़ा)' },
        { en: 'Cover with cement concrete at ground level with inspection cover (CI cover)', hi: 'जमीन के स्तर पर सीमेंट कंक्रीट से ढकें, निरीक्षण कवर (CI कवर) के साथ' },
        { en: 'Measure earth resistance — must be ≤ 2Ω for power systems, ≤ 5Ω for domestic', hi: 'अर्थ प्रतिरोध मापें — पावर सिस्टम के लिए ≤ 2Ω, घरेलू के लिए ≤ 5Ω होना चाहिए' },
      ],
      advantages: [
        { en: 'Lower earth resistance', hi: 'कम अर्थ प्रतिरोध' },
        { en: 'Longer life (15-20 years)', hi: 'लंबा जीवन (15-20 वर्ष)' },
        { en: 'Can carry heavy fault current', hi: 'भारी फॉल्ट करंट वहन कर सकता है' },
      ],
    },
    plate: {
      icon: '🔲',
      title: { en: 'Plate Earthing', hi: 'प्लेट अर्थिंग' },
      desc: {
        en: 'A copper or GI plate is buried in the earth pit. Provides large surface area for current dissipation. Used where soil resistivity is moderate.',
        hi: 'एक तांबा या GI प्लेट को अर्थ पिट में गाड़ा जाता है। करंट विसर्जन के लिए बड़ा सतह क्षेत्र प्रदान करता है।',
      },
      specs: [
        { label: { en: 'Copper Plate', hi: 'तांबा प्लेट' }, value: '600mm × 600mm × 3.15mm' },
        { label: { en: 'GI Plate', hi: 'GI प्लेट' }, value: '600mm × 600mm × 6.3mm' },
        { label: { en: 'Depth', hi: 'गहराई' }, value: '3m from ground level' },
        { label: { en: 'Earth Wire (Copper)', hi: 'अर्थ तार (तांबा)' }, value: 'Min 6 SWG copper wire' },
        { label: { en: 'Earth Wire (GI)', hi: 'अर्थ तार (GI)' }, value: 'Min 6 SWG GI wire' },
      ],
      steps: [
        { en: 'Dig a pit of 60cm × 60cm × 3m depth', hi: '60cm × 60cm × 3m गहराई का गड्ढा खोदें' },
        { en: 'Place earth plate vertically at the bottom of pit', hi: 'अर्थ प्लेट को गड्ढे के तल पर लंबवत रखें' },
        { en: 'Connect earth wire to plate using bolt, nut and washer', hi: 'बोल्ट, नट और वॉशर का उपयोग करके अर्थ तार को प्लेट से जोड़ें' },
        { en: 'Fill with alternate layers of charcoal and salt (15cm each)', hi: 'चारकोल और नमक की वैकल्पिक परतें भरें (प्रत्येक 15cm)' },
        { en: 'Fill remaining pit with local soil, well tamped', hi: 'शेष गड्ढे को स्थानीय मिट्टी से भरें, अच्छी तरह दबाएं' },
        { en: 'Install funnel arrangement for watering during dry season', hi: 'सूखे मौसम में पानी देने के लिए फनल व्यवस्था स्थापित करें' },
        { en: 'Build masonry chamber at ground level with CI cover plate', hi: 'जमीन के स्तर पर CI कवर प्लेट के साथ मेसनरी चैम्बर बनाएं' },
      ],
      advantages: [
        { en: 'Large contact area with soil', hi: 'मिट्टी के साथ बड़ा संपर्क क्षेत्र' },
        { en: 'Suitable for high resistivity soil', hi: 'उच्च प्रतिरोधकता मिट्टी के लिए उपयुक्त' },
        { en: 'Commonly used in substations', hi: 'सबस्टेशनों में सामान्यतः प्रयुक्त' },
      ],
    },
    rod: {
      icon: '📍',
      title: { en: 'Rod Earthing', hi: 'रॉड अर्थिंग' },
      desc: {
        en: 'A copper or GI rod is driven into the ground. Quick installation, used where space is limited. Common for lightning protection.',
        hi: 'एक तांबा या GI रॉड को जमीन में ठोका जाता है। तेज़ स्थापना, जहां जगह कम हो वहां उपयोग।',
      },
      specs: [
        { label: { en: 'Rod Material', hi: 'रॉड सामग्री' }, value: 'Copper / Copper-clad steel' },
        { label: { en: 'Rod Diameter', hi: 'रॉड व्यास' }, value: '12.5mm to 16mm' },
        { label: { en: 'Rod Length', hi: 'रॉड लंबाई' }, value: '1.5m to 3m (can be extended)' },
        { label: { en: 'Driving Depth', hi: 'ड्राइविंग गहराई' }, value: 'Full length into ground' },
      ],
      steps: [
        { en: 'Select location away from building foundations', hi: 'भवन नींव से दूर स्थान चुनें' },
        { en: 'Drive rod into ground using hammer or driving tool', hi: 'हथौड़े या ड्राइविंग टूल से रॉड को जमीन में ठोकें' },
        { en: 'Connect earth conductor using clamp at top of rod', hi: 'रॉड के शीर्ष पर क्लैंप से अर्थ कंडक्टर जोड़ें' },
        { en: 'If resistance is high, drive additional rods at 3m spacing', hi: 'यदि प्रतिरोध अधिक है, तो 3m अंतराल पर अतिरिक्त रॉड ठोकें' },
        { en: 'Connect multiple rods in parallel to reduce resistance', hi: 'प्रतिरोध कम करने के लिए कई रॉड को समानांतर में जोड़ें' },
      ],
      advantages: [
        { en: 'Quick and easy installation', hi: 'तेज़ और आसान स्थापना' },
        { en: 'Minimal space required', hi: 'कम जगह की आवश्यकता' },
        { en: 'Can reach deeper moist soil layers', hi: 'गहरी नम मिट्टी की परतों तक पहुंच सकता है' },
      ],
    },
    strip: {
      icon: '〰️',
      title: { en: 'Strip/Wire Earthing', hi: 'स्ट्रिप/तार अर्थिंग' },
      desc: {
        en: 'A strip or wire conductor is buried horizontally in a trench. Used for transmission line tower earthing and large area installations.',
        hi: 'एक स्ट्रिप या तार कंडक्टर को खाई में क्षैतिज रूप से गाड़ा जाता है। ट्रांसमिशन लाइन टावर अर्थिंग के लिए उपयोग।',
      },
      specs: [
        { label: { en: 'Strip Material', hi: 'स्ट्रिप सामग्री' }, value: 'GI strip / Copper strip' },
        { label: { en: 'Strip Size (GI)', hi: 'स्ट्रिप साइज़ (GI)' }, value: '25mm × 3mm to 40mm × 6mm' },
        { label: { en: 'Burial Depth', hi: 'गड्ढे की गहराई' }, value: '0.5m to 1m' },
        { label: { en: 'Length', hi: 'लंबाई' }, value: 'As required (can be 10-100m+)' },
      ],
      steps: [
        { en: 'Dig a trench 0.5-1m deep along the required path', hi: 'आवश्यक पथ के साथ 0.5-1m गहरी खाई खोदें' },
        { en: 'Lay the GI/copper strip flat in the trench', hi: 'GI/तांबा स्ट्रिप को खाई में सपाट बिछाएं' },
        { en: 'Cover with charcoal and salt mixture', hi: 'चारकोल और नमक के मिश्रण से ढकें' },
        { en: 'Backfill with original soil', hi: 'मूल मिट्टी से वापस भरें' },
        { en: 'Connect earth leads at regular intervals', hi: 'नियमित अंतराल पर अर्थ लीड जोड़ें' },
      ],
      advantages: [
        { en: 'Covers large area — low resistance', hi: 'बड़ा क्षेत्र कवर करता है — कम प्रतिरोध' },
        { en: 'Suitable for rocky/hard soil', hi: 'पथरीली/कठोर मिट्टी के लिए उपयुक्त' },
        { en: 'Used in transmission line towers', hi: 'ट्रांसमिशन लाइन टावरों में उपयोग' },
      ],
    },
  };

  const earthData = EARTH_TYPES[earthType];

  const toggleStep = (key: string) => {
    const next = new Set(completedSteps);
    if (next.has(key)) next.delete(key); else { next.add(key); addXP(5); }
    setCompletedSteps(next);
  };

  const QUIZ = [
    {
      q: { en: 'As per IE Rules, minimum insulation resistance for a 230V installation is:', hi: 'IE नियमों के अनुसार, 230V स्थापना के लिए न्यूनतम इन्सुलेशन प्रतिरोध है:' },
      opts: [
        { en: '0.5 MΩ', hi: '0.5 MΩ' },
        { en: '1 MΩ', hi: '1 MΩ' },
        { en: '5 MΩ', hi: '5 MΩ' },
        { en: '10 MΩ', hi: '10 MΩ' },
      ],
      correct: 1,
    },
    {
      q: { en: 'Which material is used to reduce soil resistivity around earth electrode?', hi: 'अर्थ इलेक्ट्रोड के आसपास मिट्टी की प्रतिरोधकता कम करने के लिए कौन सी सामग्री उपयोग होती है?' },
      opts: [
        { en: 'Sand and cement', hi: 'रेत और सीमेंट' },
        { en: 'Charcoal and salt', hi: 'चारकोल और नमक' },
        { en: 'Gravel and lime', hi: 'बजरी और चूना' },
        { en: 'Clay and ash', hi: 'मिट्टी और राख' },
      ],
      correct: 1,
    },
    {
      q: { en: 'Earth resistance for a domestic installation should be:', hi: 'घरेलू स्थापना के लिए अर्थ प्रतिरोध होना चाहिए:' },
      opts: [
        { en: '≤ 1Ω', hi: '≤ 1Ω' },
        { en: '≤ 5Ω', hi: '≤ 5Ω' },
        { en: '≤ 10Ω', hi: '≤ 10Ω' },
        { en: '≤ 25Ω', hi: '≤ 25Ω' },
      ],
      correct: 1,
    },
    {
      q: { en: 'Earth electrode tester works on which principle?', hi: 'अर्थ इलेक्ट्रोड टेस्टर किस सिद्धांत पर काम करता है?' },
      opts: [
        { en: 'Wheatstone bridge', hi: 'व्हीटस्टोन ब्रिज' },
        { en: 'Fall of potential method', hi: 'पोटेंशियल ड्रॉप विधि' },
        { en: 'Ohm\'s law', hi: 'ओम का नियम' },
        { en: 'Kirchhoff\'s law', hi: 'किरचॉफ का नियम' },
      ],
      correct: 1,
    },
    {
      q: { en: 'Standard size of GI earth plate is:', hi: 'GI अर्थ प्लेट का मानक आकार है:' },
      opts: [
        { en: '300mm × 300mm × 3mm', hi: '300mm × 300mm × 3mm' },
        { en: '600mm × 600mm × 6.3mm', hi: '600mm × 600mm × 6.3mm' },
        { en: '900mm × 900mm × 10mm', hi: '900mm × 900mm × 10mm' },
        { en: '1200mm × 1200mm × 12mm', hi: '1200mm × 1200mm × 12mm' },
      ],
      correct: 1,
    },
  ];

  const quizScore = quizSubmitted ? QUIZ.reduce((a, q, i) => a + (quizAnswers[i] === q.correct ? 1 : 0), 0) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">🌍 {language === 'hi' ? 'अर्थिंग प्रयोगशाला' : 'Earthing Lab'}</h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'hi' ? 'अर्थिंग के प्रकार, स्थापना और परीक्षण सीखें' : 'Learn types, installation and testing of earthing systems'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-surface-dark-2 rounded-xl">
        {[
          { key: 'types' as const, icon: '🔩', en: 'Earthing Types', hi: 'अर्थिंग प्रकार' },
          { key: 'testing' as const, icon: '📏', en: 'Testing', hi: 'परीक्षण' },
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

      {activeTab === 'types' && (
        <div className="grid lg:grid-cols-[220px_1fr] gap-4">
          {/* Type Selector */}
          <div className="space-y-1.5">
            {(Object.entries(EARTH_TYPES) as [EarthType, typeof earthData][]).map(([key, e]) => (
              <button
                key={key}
                onClick={() => { setEarthType(key); setCompletedSteps(new Set()); }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                  earthType === key
                    ? 'bg-brand-50 dark:bg-brand-900/20 border-2 border-brand-500'
                    : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-brand-300'
                }`}
              >
                <span className="text-2xl">{e.icon}</span>
                <span className="font-medium text-xs">{language === 'hi' ? e.title.hi : e.title.en}</span>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="card p-5 space-y-4">
            <div>
              <h2 className="font-bold text-lg flex items-center gap-2">
                {earthData.icon} {language === 'hi' ? earthData.title.hi : earthData.title.en}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {language === 'hi' ? earthData.desc.hi : earthData.desc.en}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-2">📋 {language === 'hi' ? 'विनिर्देश:' : 'Specifications:'}</h3>
              <div className="space-y-1.5">
                {earthData.specs.map((s, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">{language === 'hi' ? s.label.hi : s.label.en}</span>
                    <span className="font-mono font-medium">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Installation Steps */}
            <div>
              <h3 className="font-semibold text-sm mb-3">🔧 {language === 'hi' ? 'स्थापना चरण:' : 'Installation Steps:'}</h3>
              <div className="space-y-2">
                {earthData.steps.map((step, i) => {
                  const stepKey = `${earthType}-${i}`;
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
                      <span className="text-sm leading-relaxed">{language === 'hi' ? step.hi : step.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advantages */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
              <h3 className="font-semibold text-sm text-green-800 dark:text-green-300 mb-2">
                ✅ {language === 'hi' ? 'फायदे:' : 'Advantages:'}
              </h3>
              {earthData.advantages.map((a, i) => (
                <p key={i} className="text-xs text-green-700 dark:text-green-400">• {language === 'hi' ? a.hi : a.en}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'testing' && (
        <div className="space-y-4">
          {/* Earth Resistance Tester */}
          <div className="card p-5 space-y-4">
            <h2 className="font-bold text-lg">📏 {language === 'hi' ? 'अर्थ प्रतिरोध परीक्षण' : 'Earth Resistance Testing'}</h2>

            {/* Fall of Potential Method */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-sm mb-2">🎯 {language === 'hi' ? 'पोटेंशियल ड्रॉप विधि (3-पॉइंट)' : 'Fall of Potential Method (3-Point)'}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                {language === 'hi'
                  ? 'सबसे सटीक विधि। तीन इलेक्ट्रोड: E (अर्थ), P (पोटेंशियल), C (करंट) का उपयोग करती है।'
                  : 'Most accurate method. Uses three electrodes: E (Earth), P (Potential), C (Current).'}
              </p>

              {/* Visual layout of test setup */}
              <div className="bg-slate-800 rounded-xl p-5 text-white text-center mb-4">
                <p className="text-xs text-slate-400 mb-4">{language === 'hi' ? 'परीक्षण सेटअप' : 'Test Setup'}</p>
                <div className="flex items-end justify-center gap-8 h-24">
                  <div className="text-center">
                    <div className="w-6 h-16 bg-green-500 rounded-t-sm mx-auto" />
                    <div className="w-10 h-2 bg-amber-700 mx-auto" />
                    <p className="text-[10px] text-green-400 mt-1 font-mono">E</p>
                    <p className="text-[10px] text-slate-400">{language === 'hi' ? 'अर्थ' : 'Earth'}</p>
                  </div>
                  <div className="flex-1 max-w-16 border-b-2 border-dashed border-slate-500 mb-6 relative">
                    <span className="absolute -bottom-5 text-[9px] text-slate-400 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      {language === 'hi' ? '15.5m' : '15.5m (62%)'}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-10 bg-yellow-500 rounded-t-sm mx-auto" />
                    <div className="w-8 h-2 bg-amber-700 mx-auto" />
                    <p className="text-[10px] text-yellow-400 mt-1 font-mono">P</p>
                    <p className="text-[10px] text-slate-400">{language === 'hi' ? 'पोटेंशियल' : 'Potential'}</p>
                  </div>
                  <div className="flex-1 max-w-16 border-b-2 border-dashed border-slate-500 mb-6 relative">
                    <span className="absolute -bottom-5 text-[9px] text-slate-400 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      {language === 'hi' ? '9.5m' : '9.5m (38%)'}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-10 bg-red-500 rounded-t-sm mx-auto" />
                    <div className="w-8 h-2 bg-amber-700 mx-auto" />
                    <p className="text-[10px] text-red-400 mt-1 font-mono">C</p>
                    <p className="text-[10px] text-slate-400">{language === 'hi' ? 'करंट' : 'Current'}</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-6">
                  {language === 'hi' ? 'E-P दूरी = E-C दूरी का 62%' : 'E-P distance = 62% of E-C distance'}
                </p>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p>• {language === 'hi' ? 'C इलेक्ट्रोड: E से 25m दूर' : 'C electrode: 25m from E'}</p>
                <p>• {language === 'hi' ? 'P इलेक्ट्रोड: E से 15.5m (62% of 25m) दूर' : 'P electrode: 15.5m (62% of 25m) from E'}</p>
                <p>• {language === 'hi' ? 'टेस्टर पर रीडिंग = अर्थ प्रतिरोध (Ω)' : 'Reading on tester = Earth resistance (Ω)'}</p>
              </div>
            </div>

            {/* Calculator */}
            <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 text-white">
              <h3 className="font-semibold text-sm mb-3">🧮 {language === 'hi' ? 'अर्थ प्रतिरोध कैलकुलेटर' : 'Earth Resistance Calculator'}</h3>
              <p className="text-[10px] text-slate-400 mb-3 font-mono">R = ρ / (2πL) × ln(4L/d)</p>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">{language === 'hi' ? 'मिट्टी प्रतिरोधकता (ρ Ω·m)' : 'Soil Resistivity (ρ Ω·m)'}</label>
                  <input
                    type="number"
                    value={soilRes}
                    onChange={(e) => setSoilRes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-slate-600 text-sm font-mono text-green-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">{language === 'hi' ? 'पाइप/रॉड लंबाई (L मीटर)' : 'Pipe/Rod Length (L m)'}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={pipeLen}
                    onChange={(e) => setPipeLen(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-slate-600 text-sm font-mono text-green-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">{language === 'hi' ? 'पाइप/रॉड व्यास (d मीटर)' : 'Pipe/Rod Dia (d m)'}</label>
                  <input
                    type="number"
                    step="0.001"
                    value={pipeDia}
                    onChange={(e) => setPipeDia(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-slate-600 text-sm font-mono text-green-400"
                  />
                </div>
              </div>
              <div className="text-center p-3 rounded-lg bg-black/30 border border-slate-600">
                <p className="text-xs text-slate-400">{language === 'hi' ? 'अनुमानित अर्थ प्रतिरोध' : 'Estimated Earth Resistance'}</p>
                <p className="text-3xl font-mono text-green-400 mt-1">{calcR().toFixed(2)} Ω</p>
                <p className={`text-xs mt-1 ${calcR() <= 5 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcR() <= 2 ? '✅ ' + (language === 'hi' ? 'पावर सिस्टम के लिए उपयुक्त' : 'Suitable for power systems')
                   : calcR() <= 5 ? '✅ ' + (language === 'hi' ? 'घरेलू उपयोग के लिए उपयुक्त' : 'Suitable for domestic use')
                   : '❌ ' + (language === 'hi' ? 'बहुत अधिक — सुधार आवश्यक' : 'Too high — improvement needed')}
                </p>
              </div>
            </div>

            {/* Soil Resistivity Table */}
            <div>
              <h3 className="font-semibold text-sm mb-2">🌍 {language === 'hi' ? 'मिट्टी प्रतिरोधकता मान' : 'Soil Resistivity Values'}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-surface-dark-2">
                      <th className="p-2 text-left">{language === 'hi' ? 'मिट्टी का प्रकार' : 'Soil Type'}</th>
                      <th className="p-2 text-left">ρ (Ω·m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: { en: 'Marshy/Wet clay', hi: 'दलदली/गीली मिट्टी' }, val: '5 - 40' },
                      { type: { en: 'Garden soil', hi: 'बगीचे की मिट्टी' }, val: '10 - 100' },
                      { type: { en: 'Clay', hi: 'चिकनी मिट्टी' }, val: '20 - 200' },
                      { type: { en: 'Sandy soil', hi: 'रेतीली मिट्टी' }, val: '50 - 500' },
                      { type: { en: 'Rocky soil', hi: 'पथरीली मिट्टी' }, val: '500 - 5000' },
                      { type: { en: 'Dry sand/gravel', hi: 'सूखी रेत/बजरी' }, val: '1000 - 10000' },
                    ].map((r, i) => (
                      <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                        <td className="p-2">{language === 'hi' ? r.type.hi : r.type.en}</td>
                        <td className="p-2 font-mono">{r.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-lg">📝 {language === 'hi' ? 'क्विज़: अर्थिंग' : 'Quiz: Earthing'}</h2>
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
            <button onClick={() => { setQuizSubmitted(true); if (quizScore >= 3) addXP(25); }} className="btn-primary text-sm px-6 py-2">
              📝 {language === 'hi' ? 'जमा करें' : 'Submit'}
            </button>
          ) : (
            <div className={`p-4 rounded-xl text-center ${quizScore >= 3 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
              <p className="text-2xl mb-1">{quizScore >= 3 ? '🎉' : '📚'}</p>
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
