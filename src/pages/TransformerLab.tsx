import { useState, useMemo } from 'react';
import { useAppStore } from '@/context/store';

type TransTab = 'theory' | 'tests' | 'calculator' | 'quiz';
type TestType = 'oc' | 'sc';

export default function TransformerLab() {
  const { language, addXP } = useAppStore();
  const [activeTab, setActiveTab] = useState<TransTab>('theory');
  const [testType, setTestType] = useState<TestType>('oc');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Calculator state
  const [kva, setKva] = useState(5);
  const [v1, setV1] = useState(230);
  const [v2, setV2] = useState(115);
  const [ocW, setOcW] = useState(50);
  const [scW, setScW] = useState(120);
  const [loadPercent, setLoadPercent] = useState(100);
  const [pf, setPf] = useState(0.8);

  const calcs = useMemo(() => {
    const turnsRatio = v1 / v2;
    const i1Rated = (kva * 1000) / v1;
    const i2Rated = (kva * 1000) / v2;
    const coreLoss = ocW; // Wi = P_oc
    const cuLoss = scW; // Wcu_fl = P_sc at rated current
    const cuLossAtLoad = cuLoss * Math.pow(loadPercent / 100, 2);
    const output = kva * 1000 * (loadPercent / 100) * pf;
    const totalLoss = coreLoss + cuLossAtLoad;
    const efficiency = (output / (output + totalLoss)) * 100;
    const maxEffLoad = Math.sqrt(coreLoss / cuLoss) * 100; // % load at max efficiency
    const regulation = ((scW / (kva * 1000)) * pf * 100); // approx
    return { turnsRatio, i1Rated, i2Rated, coreLoss, cuLoss, cuLossAtLoad, output, totalLoss, efficiency, maxEffLoad, regulation };
  }, [kva, v1, v2, ocW, scW, loadPercent, pf]);

  const toggleStep = (key: string) => {
    const next = new Set(completedSteps);
    if (next.has(key)) next.delete(key); else { next.add(key); addXP(5); }
    setCompletedSteps(next);
  };

  const OC_STEPS = [
    { en: 'Connect LV winding to rated LV voltage supply through variac', hi: 'LV वाइंडिंग को वैरिएक के माध्यम से रेटेड LV वोल्टेज सप्लाई से जोड़ें' },
    { en: 'Keep HV side OPEN (no load connected)', hi: 'HV साइड OPEN रखें (कोई लोड नहीं)' },
    { en: 'Connect wattmeter, ammeter on LV side, voltmeter on both sides', hi: 'LV साइड पर वॉटमीटर, एमीटर और दोनों तरफ वोल्टमीटर जोड़ें' },
    { en: 'Gradually increase voltage to rated value using variac', hi: 'वैरिएक से धीरे-धीरे वोल्टेज को रेटेड मान तक बढ़ाएं' },
    { en: 'Record V₁ (applied voltage), I₀ (no-load current), W₀ (core loss)', hi: 'V₁ (लगाया गया वोल्टेज), I₀ (नो-लोड करंट), W₀ (कोर लॉस) रिकॉर्ड करें' },
    { en: 'Record V₂ (HV side voltage) to find turns ratio: a = V₂/V₁', hi: 'V₂ (HV साइड वोल्टेज) रिकॉर्ड करें, टर्न्स रेशियो: a = V₂/V₁' },
    { en: 'Calculate: R₀ = V₁/Iw, X₀ = V₁/Iμ, cos φ₀ = W₀/(V₁×I₀)', hi: 'गणना: R₀ = V₁/Iw, X₀ = V₁/Iμ, cos φ₀ = W₀/(V₁×I₀)' },
  ];

  const SC_STEPS = [
    { en: 'SHORT CIRCUIT the LV winding terminals', hi: 'LV वाइंडिंग टर्मिनलों को शॉर्ट सर्किट करें' },
    { en: 'Connect HV winding to a low voltage supply through variac', hi: 'HV वाइंडिंग को वैरिएक के माध्यम से कम वोल्टेज सप्लाई से जोड़ें' },
    { en: 'Connect wattmeter, ammeter, voltmeter on HV side', hi: 'HV साइड पर वॉटमीटर, एमीटर, वोल्टमीटर जोड़ें' },
    { en: 'SLOWLY increase voltage until ammeter shows rated full-load current', hi: 'धीरे-धीरे वोल्टेज बढ़ाएं जब तक एमीटर रेटेड फुल-लोड करंट न दिखाए' },
    { en: '⚠️ CAUTION: Only 5-10% of rated voltage needed! Do not exceed rated current!', hi: '⚠️ सावधानी: केवल 5-10% रेटेड वोल्टेज की आवश्यकता! रेटेड करंट से अधिक न करें!' },
    { en: 'Record Vsc (applied voltage), Isc (rated current), Wsc (copper loss)', hi: 'Vsc (लगाया गया वोल्टेज), Isc (रेटेड करंट), Wsc (कॉपर लॉस) रिकॉर्ड करें' },
    { en: 'Calculate: Zeq = Vsc/Isc, Req = Wsc/Isc², Xeq = √(Zeq² - Req²)', hi: 'गणना: Zeq = Vsc/Isc, Req = Wsc/Isc², Xeq = √(Zeq² - Req²)' },
  ];

  const QUIZ = [
    {
      q: { en: 'Open circuit test of transformer determines:', hi: 'ट्रांसफॉर्मर का ओपन सर्किट परीक्षण निर्धारित करता है:' },
      opts: [
        { en: 'Copper loss', hi: 'कॉपर लॉस' },
        { en: 'Core/Iron loss', hi: 'कोर/आयरन लॉस' },
        { en: 'Stray loss', hi: 'स्ट्रे लॉस' },
        { en: 'Friction loss', hi: 'फ्रिक्शन लॉस' },
      ],
      correct: 1,
    },
    {
      q: { en: 'In OC test, which side is kept open?', hi: 'OC परीक्षण में कौन सी साइड खुली रखी जाती है?' },
      opts: [
        { en: 'LV side', hi: 'LV साइड' },
        { en: 'HV side', hi: 'HV साइड' },
        { en: 'Both sides', hi: 'दोनों साइड' },
        { en: 'Neither side', hi: 'कोई भी साइड नहीं' },
      ],
      correct: 1,
    },
    {
      q: { en: 'Maximum efficiency of transformer occurs when:', hi: 'ट्रांसफॉर्मर की अधिकतम दक्षता तब होती है जब:' },
      opts: [
        { en: 'Core loss = Copper loss', hi: 'कोर लॉस = कॉपर लॉस' },
        { en: 'Core loss > Copper loss', hi: 'कोर लॉस > कॉपर लॉस' },
        { en: 'Core loss < Copper loss', hi: 'कोर लॉस < कॉपर लॉस' },
        { en: 'At full load always', hi: 'हमेशा पूर्ण लोड पर' },
      ],
      correct: 0,
    },
    {
      q: { en: 'Transformer works on the principle of:', hi: 'ट्रांसफॉर्मर किस सिद्धांत पर काम करता है:' },
      opts: [
        { en: 'Self induction', hi: 'स्व-प्रेरण' },
        { en: 'Mutual induction', hi: 'पारस्परिक प्रेरण' },
        { en: 'Electromagnetic force', hi: 'विद्युत चुम्बकीय बल' },
        { en: 'Coulombs law', hi: 'कूलम्ब का नियम' },
      ],
      correct: 1,
    },
    {
      q: { en: 'In SC test, voltage applied is approximately:', hi: 'SC परीक्षण में लगाया गया वोल्टेज लगभग होता है:' },
      opts: [
        { en: '100% of rated', hi: 'रेटेड का 100%' },
        { en: '50% of rated', hi: 'रेटेड का 50%' },
        { en: '5-10% of rated', hi: 'रेटेड का 5-10%' },
        { en: '25% of rated', hi: 'रेटेड का 25%' },
      ],
      correct: 2,
    },
    {
      q: { en: 'Turns ratio of a transformer with 460 primary and 230 secondary turns is:', hi: '460 प्राइमरी और 230 सेकेंडरी टर्न वाले ट्रांसफॉर्मर का टर्न्स रेशियो है:' },
      opts: [
        { en: '1:2', hi: '1:2' },
        { en: '2:1', hi: '2:1' },
        { en: '1:1', hi: '1:1' },
        { en: '4:1', hi: '4:1' },
      ],
      correct: 1,
    },
  ];

  const quizScore = quizSubmitted ? QUIZ.reduce((a, q, i) => a + (quizAnswers[i] === q.correct ? 1 : 0), 0) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">🔄 {language === 'hi' ? 'ट्रांसफॉर्मर प्रयोगशाला' : 'Transformer Lab'}</h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'hi' ? 'ट्रांसफॉर्मर सिद्धांत, OC/SC परीक्षण और दक्षता गणना' : 'Transformer theory, OC/SC tests and efficiency calculations'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-surface-dark-2 rounded-xl">
        {[
          { key: 'theory' as const, icon: '📖', en: 'Theory', hi: 'सिद्धांत' },
          { key: 'tests' as const, icon: '🧪', en: 'OC/SC Tests', hi: 'OC/SC परीक्षण' },
          { key: 'calculator' as const, icon: '🧮', en: 'Calculator', hi: 'कैलकुलेटर' },
          { key: 'quiz' as const, icon: '📝', en: 'Quiz', hi: 'क्विज़' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-xs font-medium py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-surface-dark shadow-md text-brand-600 dark:text-brand-400'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon} {language === 'hi' ? tab.hi : tab.en}
          </button>
        ))}
      </div>

      {activeTab === 'theory' && (
        <div className="card p-5 space-y-5">
          <h2 className="font-bold text-lg">📖 {language === 'hi' ? 'ट्रांसफॉर्मर सिद्धांत' : 'Transformer Theory'}</h2>

          {/* Working Principle */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="font-semibold text-sm mb-2">⚡ {language === 'hi' ? 'कार्य सिद्धांत' : 'Working Principle'}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {language === 'hi'
                ? 'ट्रांसफॉर्मर पारस्परिक प्रेरण (Mutual Induction) के सिद्धांत पर काम करता है। जब प्राइमरी वाइंडिंग में AC करंट बहता है, तो यह कोर में बदलता चुंबकीय फ्लक्स उत्पन्न करता है। यह फ्लक्स सेकेंडरी वाइंडिंग से होकर गुजरता है और फैराडे के नियम के अनुसार EMF प्रेरित करता है।'
                : 'A transformer works on the principle of Mutual Induction (Faraday\'s law of electromagnetic induction). When AC current flows through the primary winding, it produces an alternating magnetic flux in the core. This flux links with the secondary winding and induces an EMF according to Faraday\'s law.'}
            </p>
          </div>

          {/* Key Formulas */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: { en: 'EMF Equation', hi: 'EMF समीकरण' }, formula: 'E = 4.44 × f × N × Φm', desc: { en: 'f=frequency, N=turns, Φm=max flux', hi: 'f=आवृत्ति, N=टर्न, Φm=अधिकतम फ्लक्स' } },
              { title: { en: 'Turns Ratio', hi: 'टर्न्स रेशियो' }, formula: 'a = N₁/N₂ = V₁/V₂ = I₂/I₁', desc: { en: 'Voltage ratio = Turns ratio', hi: 'वोल्टेज अनुपात = टर्न अनुपात' } },
              { title: { en: 'Efficiency', hi: 'दक्षता' }, formula: 'η = Output / (Output + Losses)', desc: { en: 'Losses = Wi + Wcu', hi: 'हानियां = Wi + Wcu' } },
              { title: { en: 'Max Efficiency Condition', hi: 'अधिकतम दक्षता शर्त' }, formula: 'Wi = Wcu (Core loss = Cu loss)', desc: { en: 'Iron loss = Copper loss at max η', hi: 'अधिकतम η पर आयरन लॉस = कॉपर लॉस' } },
            ].map((f, i) => (
              <div key={i} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-indigo-800 dark:text-indigo-300 mb-1">{language === 'hi' ? f.title.hi : f.title.en}</p>
                <p className="font-mono text-sm text-indigo-700 dark:text-indigo-400">{f.formula}</p>
                <p className="text-[10px] text-indigo-500 mt-1">{language === 'hi' ? f.desc.hi : f.desc.en}</p>
              </div>
            ))}
          </div>

          {/* Types */}
          <div>
            <h3 className="font-semibold text-sm mb-3">📋 {language === 'hi' ? 'ट्रांसफॉर्मर के प्रकार' : 'Types of Transformers'}</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { type: { en: 'Step-Up', hi: 'स्टेप-अप' }, desc: { en: 'V₂ > V₁, N₂ > N₁ — used in power stations', hi: 'V₂ > V₁, N₂ > N₁ — पावर स्टेशन में उपयोग' }, icon: '⬆️' },
                { type: { en: 'Step-Down', hi: 'स्टेप-डाउन' }, desc: { en: 'V₂ < V₁, N₂ < N₁ — used at distribution end', hi: 'V₂ < V₁, N₂ < N₁ — वितरण में उपयोग' }, icon: '⬇️' },
                { type: { en: 'Core Type', hi: 'कोर टाइप' }, desc: { en: 'Windings surround the core limbs', hi: 'वाइंडिंग कोर लिम्ब को घेरती हैं' }, icon: '🔲' },
                { type: { en: 'Shell Type', hi: 'शेल टाइप' }, desc: { en: 'Core surrounds the windings', hi: 'कोर वाइंडिंग को घेरती है' }, icon: '🔳' },
                { type: { en: 'Auto Transformer', hi: 'ऑटो ट्रांसफॉर्मर' }, desc: { en: 'Single winding, part common — more efficient', hi: 'एकल वाइंडिंग, भाग कॉमन — अधिक कुशल' }, icon: '🔄' },
                { type: { en: 'Instrument (CT/PT)', hi: 'इंस्ट्रूमेंट (CT/PT)' }, desc: { en: 'For measurement — CT in series, PT in parallel', hi: 'मापन के लिए — CT श्रेणी में, PT समानांतर में' }, icon: '📏' },
              ].map((t, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 flex items-start gap-2.5">
                  <span className="text-xl">{t.icon}</span>
                  <div>
                    <p className="font-semibold text-xs">{language === 'hi' ? t.type.hi : t.type.en}</p>
                    <p className="text-[11px] text-slate-500">{language === 'hi' ? t.desc.hi : t.desc.en}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Losses */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-300 mb-2">
              ⚡ {language === 'hi' ? 'ट्रांसफॉर्मर में हानियां' : 'Transformer Losses'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400">{language === 'hi' ? 'कोर/आयरन हानि (Wi)' : 'Core/Iron Loss (Wi)'}</p>
                <p className="text-amber-600 dark:text-amber-400">
                  {language === 'hi'
                    ? '• हिस्टैरिसिस लॉस: Wh ∝ f × Bmax^1.6\n• एड़ी करंट लॉस: We ∝ f² × Bmax²\n• लोड से स्वतंत्र (constant)'
                    : '• Hysteresis loss: Wh ∝ f × Bmax^1.6\n• Eddy current loss: We ∝ f² × Bmax²\n• Independent of load (constant)'}
                </p>
              </div>
              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-400">{language === 'hi' ? 'कॉपर हानि (Wcu)' : 'Copper Loss (Wcu)'}</p>
                <p className="text-amber-600 dark:text-amber-400">
                  {language === 'hi'
                    ? '• Wcu = I²R (दोनों वाइंडिंग)\n• लोड के वर्ग के अनुपात में\n• SC परीक्षण से ज्ञात'
                    : '• Wcu = I²R (both windings)\n• Proportional to square of load\n• Determined from SC test'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            {[
              { key: 'oc' as const, icon: '🔓', en: 'Open Circuit (OC) Test', hi: 'ओपन सर्किट (OC) परीक्षण' },
              { key: 'sc' as const, icon: '🔗', en: 'Short Circuit (SC) Test', hi: 'शॉर्ट सर्किट (SC) परीक्षण' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setTestType(t.key); setCompletedSteps(new Set()); }}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                  testType === t.key
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700'
                }`}
              >
                {t.icon} {language === 'hi' ? t.hi : t.en}
              </button>
            ))}
          </div>

          <div className="card p-5 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">{testType === 'oc' ? '🔓' : '🔗'}</span>
              <div>
                <h2 className="font-bold text-lg">
                  {testType === 'oc'
                    ? language === 'hi' ? 'ओपन सर्किट (नो-लोड) परीक्षण' : 'Open Circuit (No-Load) Test'
                    : language === 'hi' ? 'शॉर्ट सर्किट (फुल-लोड) परीक्षण' : 'Short Circuit (Full-Load) Test'
                  }
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {testType === 'oc'
                    ? language === 'hi' ? 'कोर हानि, नो-लोड करंट, टर्न्स रेशियो और शंट ब्रांच पैरामीटर निर्धारित करता है' : 'Determines core loss, no-load current, turns ratio and shunt branch parameters'
                    : language === 'hi' ? 'कॉपर हानि, %इम्पीडेंस और सीरीज ब्रांच पैरामीटर निर्धारित करता है' : 'Determines copper loss, %impedance and series branch parameters'
                  }
                </p>
              </div>
            </div>

            {/* Key Info */}
            <div className={`rounded-xl p-3 ${testType === 'oc' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="grid sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <p className={`font-semibold ${testType === 'oc' ? 'text-blue-800 dark:text-blue-300' : 'text-red-800 dark:text-red-300'}`}>
                    {language === 'hi' ? 'सप्लाई साइड' : 'Supply Side'}
                  </p>
                  <p className={testType === 'oc' ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}>
                    {testType === 'oc' ? 'LV (Low Voltage)' : 'HV (High Voltage)'}
                  </p>
                </div>
                <div>
                  <p className={`font-semibold ${testType === 'oc' ? 'text-blue-800 dark:text-blue-300' : 'text-red-800 dark:text-red-300'}`}>
                    {language === 'hi' ? 'दूसरी साइड' : 'Other Side'}
                  </p>
                  <p className={testType === 'oc' ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}>
                    {testType === 'oc'
                      ? language === 'hi' ? 'HV — ओपन (खुला)' : 'HV — Open'
                      : language === 'hi' ? 'LV — शॉर्ट सर्किट' : 'LV — Short Circuited'}
                  </p>
                </div>
                <div>
                  <p className={`font-semibold ${testType === 'oc' ? 'text-blue-800 dark:text-blue-300' : 'text-red-800 dark:text-red-300'}`}>
                    {language === 'hi' ? 'क्या मापता है' : 'Determines'}
                  </p>
                  <p className={testType === 'oc' ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}>
                    {testType === 'oc'
                      ? language === 'hi' ? 'कोर/आयरन हानि (Wi)' : 'Core/Iron Loss (Wi)'
                      : language === 'hi' ? 'कॉपर हानि (Wcu)' : 'Copper Loss (Wcu)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div>
              <h3 className="font-semibold text-sm mb-3">📋 {language === 'hi' ? 'प्रक्रिया:' : 'Procedure:'}</h3>
              <div className="space-y-2">
                {(testType === 'oc' ? OC_STEPS : SC_STEPS).map((step, i) => {
                  const stepKey = `${testType}-${i}`;
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
                        done ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-600'
                      }`}>
                        {done ? '✓' : i + 1}
                      </span>
                      <span className="text-sm leading-relaxed">{language === 'hi' ? step.hi : step.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Safety Warning */}
            {testType === 'sc' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800">
                <p className="text-xs font-bold text-red-700 dark:text-red-400">
                  ⚠️ {language === 'hi'
                    ? 'चेतावनी: SC परीक्षण में कभी भी पूर्ण रेटेड वोल्टेज न लगाएं! केवल 5-10% वोल्टेज पर रेटेड करंट प्राप्त होता है। पूर्ण वोल्टेज = वाइंडिंग जल जाएगी!'
                    : 'WARNING: Never apply full rated voltage in SC test! Only 5-10% voltage gives rated current. Full voltage = Winding burnout!'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="card p-5 space-y-5">
          <h2 className="font-bold text-lg">🧮 {language === 'hi' ? 'ट्रांसफॉर्मर दक्षता कैलकुलेटर' : 'Transformer Efficiency Calculator'}</h2>

          {/* Input Parameters */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: { en: 'Rating (kVA)', hi: 'रेटिंग (kVA)' }, value: kva, set: setKva, step: 0.5 },
              { label: { en: 'Primary V₁ (V)', hi: 'प्राइमरी V₁ (V)' }, value: v1, set: setV1, step: 10 },
              { label: { en: 'Secondary V₂ (V)', hi: 'सेकेंडरी V₂ (V)' }, value: v2, set: setV2, step: 10 },
              { label: { en: 'OC Test Wattage W₀ (W)', hi: 'OC टेस्ट वॉटेज W₀ (W)' }, value: ocW, set: setOcW, step: 5 },
              { label: { en: 'SC Test Wattage Wsc (W)', hi: 'SC टेस्ट वॉटेज Wsc (W)' }, value: scW, set: setScW, step: 5 },
              { label: { en: 'Load (%)', hi: 'लोड (%)' }, value: loadPercent, set: setLoadPercent, step: 10 },
            ].map((input, i) => (
              <div key={i}>
                <label className="text-[10px] text-slate-500 block mb-1">{language === 'hi' ? input.label.hi : input.label.en}</label>
                <input
                  type="number"
                  step={input.step}
                  value={input.value}
                  onChange={(e) => input.set(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-sm font-mono"
                />
              </div>
            ))}
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">{language === 'hi' ? 'पावर फैक्टर (cos φ)' : 'Power Factor (cos φ)'}</label>
              <input
                type="number"
                step={0.05}
                min={0.1}
                max={1}
                value={pf}
                onChange={(e) => setPf(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-sm font-mono"
              />
            </div>
          </div>

          {/* Results */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: { en: 'Turns Ratio', hi: 'टर्न्स रेशियो' }, value: `${calcs.turnsRatio.toFixed(2)}:1`, color: 'brand' },
              { label: { en: 'I₁ Rated', hi: 'I₁ रेटेड' }, value: `${calcs.i1Rated.toFixed(2)} A`, color: 'blue' },
              { label: { en: 'I₂ Rated', hi: 'I₂ रेटेड' }, value: `${calcs.i2Rated.toFixed(2)} A`, color: 'blue' },
              { label: { en: 'Core Loss (Wi)', hi: 'कोर हानि (Wi)' }, value: `${calcs.coreLoss} W`, color: 'amber' },
              { label: { en: `Cu Loss at ${loadPercent}%`, hi: `${loadPercent}% पर Cu हानि` }, value: `${calcs.cuLossAtLoad.toFixed(1)} W`, color: 'amber' },
              { label: { en: 'Total Losses', hi: 'कुल हानि' }, value: `${calcs.totalLoss.toFixed(1)} W`, color: 'red' },
              { label: { en: 'Output Power', hi: 'आउटपुट पावर' }, value: `${calcs.output.toFixed(0)} W`, color: 'green' },
              { label: { en: 'Efficiency (η)', hi: 'दक्षता (η)' }, value: `${calcs.efficiency.toFixed(2)}%`, color: 'green' },
            ].map((r, i) => (
              <div key={i} className={`rounded-xl p-3 bg-${r.color === 'brand' ? 'brand' : r.color}-50 dark:bg-${r.color === 'brand' ? 'brand' : r.color}-900/20`}>
                <p className="text-[10px] text-slate-500">{language === 'hi' ? r.label.hi : r.label.en}</p>
                <p className="font-mono font-bold text-lg mt-0.5">{r.value}</p>
              </div>
            ))}
          </div>

          {/* Max efficiency info */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <p className="font-semibold text-sm text-green-800 dark:text-green-300 mb-1">
              🎯 {language === 'hi' ? 'अधिकतम दक्षता का बिंदु' : 'Maximum Efficiency Point'}
            </p>
            <p className="text-xs text-green-700 dark:text-green-400">
              {language === 'hi'
                ? `अधिकतम दक्षता ${calcs.maxEffLoad.toFixed(1)}% लोड पर होती है (जब Wi = Wcu = ${calcs.coreLoss}W)`
                : `Maximum efficiency occurs at ${calcs.maxEffLoad.toFixed(1)}% load (when Wi = Wcu = ${calcs.coreLoss}W)`}
            </p>
            <p className="text-xs text-green-600 dark:text-green-500 mt-1 font-mono">
              {language === 'hi' ? 'x = √(Wi/Wcu_fl)' : 'x = √(Wi/Wcu_fl)'} = √({calcs.coreLoss}/{calcs.cuLoss}) = {(calcs.maxEffLoad / 100).toFixed(3)}
            </p>
          </div>

          {/* Load vs Efficiency quick view */}
          <div>
            <h3 className="font-semibold text-sm mb-2">{language === 'hi' ? 'लोड बनाम दक्षता' : 'Load vs Efficiency'}</h3>
            <div className="flex items-end gap-1 h-32">
              {[25, 50, 75, 100, 125].map((load) => {
                const cuL = calcs.cuLoss * Math.pow(load / 100, 2);
                const out = kva * 1000 * (load / 100) * pf;
                const eff = (out / (out + calcs.coreLoss + cuL)) * 100;
                const height = Math.max(5, (eff - 80) * 5); // scale for display
                return (
                  <div key={load} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono">{eff.toFixed(1)}%</span>
                    <div
                      className={`w-full rounded-t-md transition-all ${load === loadPercent ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-[9px] text-slate-500">{load}%</span>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-1">{language === 'hi' ? '% लोड →' : '% Load →'}</p>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-lg">📝 {language === 'hi' ? 'क्विज़: ट्रांसफॉर्मर' : 'Quiz: Transformer'}</h2>
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
