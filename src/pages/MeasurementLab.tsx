import { useState, useCallback } from 'react';
import { useAppStore } from '@/context/store';

type Instrument = 'multimeter' | 'megger' | 'clamp' | 'wattmeter';
type MeterMode = 'voltage' | 'current' | 'resistance';

export default function MeasurementLab() {
  const { language, addXP } = useAppStore();
  const [instrument, setInstrument] = useState<Instrument>('multimeter');
  const [meterMode, setMeterMode] = useState<MeterMode>('voltage');
  const [dialValue, setDialValue] = useState(0);
  const [reading, setReading] = useState<number | null>(null);
  const [rangeIndex, setRangeIndex] = useState(2);
  const [activeTab, setActiveTab] = useState<'simulator' | 'theory' | 'quiz'>('simulator');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const RANGES: Record<MeterMode, { label: string; max: number; unit: string }[]> = {
    voltage: [
      { label: '200mV', max: 0.2, unit: 'mV' },
      { label: '2V', max: 2, unit: 'V' },
      { label: '20V', max: 20, unit: 'V' },
      { label: '200V', max: 200, unit: 'V' },
      { label: '750V', max: 750, unit: 'V' },
    ],
    current: [
      { label: '200μA', max: 0.0002, unit: 'μA' },
      { label: '2mA', max: 0.002, unit: 'mA' },
      { label: '20mA', max: 0.02, unit: 'mA' },
      { label: '200mA', max: 0.2, unit: 'mA' },
      { label: '10A', max: 10, unit: 'A' },
    ],
    resistance: [
      { label: '200Ω', max: 200, unit: 'Ω' },
      { label: '2kΩ', max: 2000, unit: 'kΩ' },
      { label: '20kΩ', max: 20000, unit: 'kΩ' },
      { label: '200kΩ', max: 200000, unit: 'kΩ' },
      { label: '2MΩ', max: 2000000, unit: 'MΩ' },
    ],
  };

  const currentRange = RANGES[meterMode][rangeIndex];

  const takeReading = useCallback(() => {
    let val = 0;
    switch (meterMode) {
      case 'voltage':
        val = Math.random() * currentRange.max * 0.8;
        break;
      case 'current':
        val = Math.random() * currentRange.max * 0.6;
        break;
      case 'resistance':
        val = Math.random() * currentRange.max * 0.7;
        break;
    }
    setReading(val);
    setDialValue(val / currentRange.max);
    addXP(3);
  }, [meterMode, currentRange, addXP]);

  const formatReading = (val: number): string => {
    if (meterMode === 'voltage') {
      if (currentRange.unit === 'mV') return `${(val * 1000).toFixed(1)} mV`;
      return `${val.toFixed(2)} V`;
    }
    if (meterMode === 'current') {
      if (currentRange.unit === 'μA') return `${(val * 1000000).toFixed(1)} μA`;
      if (currentRange.unit === 'mA') return `${(val * 1000).toFixed(2)} mA`;
      return `${val.toFixed(3)} A`;
    }
    if (currentRange.unit === 'kΩ') return `${(val / 1000).toFixed(2)} kΩ`;
    if (currentRange.unit === 'MΩ') return `${(val / 1000000).toFixed(3)} MΩ`;
    return `${val.toFixed(1)} Ω`;
  };

  const QUIZ = [
    {
      q: { en: 'An ammeter should be connected in:', hi: 'एमीटर को जोड़ना चाहिए:' },
      options: [
        { en: 'Parallel', hi: 'समानांतर' },
        { en: 'Series', hi: 'श्रेणी' },
        { en: 'Either way', hi: 'दोनों तरह' },
        { en: 'Through a transformer', hi: 'ट्रांसफॉर्मर से' },
      ],
      correct: 1,
    },
    {
      q: { en: 'What voltage does a 500V megger generate?', hi: '500V मेगर कितना वोल्टेज उत्पन्न करता है?' },
      options: [
        { en: '12V DC', hi: '12V DC' },
        { en: '240V AC', hi: '240V AC' },
        { en: '500V DC', hi: '500V DC' },
        { en: '1000V AC', hi: '1000V AC' },
      ],
      correct: 2,
    },
    {
      q: { en: 'A clamp meter measures current using:', hi: 'क्लैंप मीटर करंट मापता है:' },
      options: [
        { en: 'Direct contact with wire', hi: 'तार से सीधा संपर्क' },
        { en: 'Current transformer principle', hi: 'करंट ट्रांसफॉर्मर सिद्धांत' },
        { en: 'Capacitive coupling', hi: 'कैपेसिटिव कपलिंग' },
        { en: 'Resistance bridge', hi: 'प्रतिरोध ब्रिज' },
      ],
      correct: 1,
    },
    {
      q: { en: 'When measuring unknown voltage, which range should you start with?', hi: 'अज्ञात वोल्टेज मापते समय, किस रेंज से शुरू करना चाहिए?' },
      options: [
        { en: 'Lowest range', hi: 'सबसे कम रेंज' },
        { en: 'Middle range', hi: 'मध्य रेंज' },
        { en: 'Highest range', hi: 'सबसे अधिक रेंज' },
        { en: 'Auto range', hi: 'ऑटो रेंज' },
      ],
      correct: 2,
    },
    {
      q: { en: 'Wattmeter has:', hi: 'वॉटमीटर में होते हैं:' },
      options: [
        { en: 'One coil', hi: 'एक कॉइल' },
        { en: 'Two coils — current and pressure', hi: 'दो कॉइल — करंट और प्रेशर' },
        { en: 'Three coils', hi: 'तीन कॉइल' },
        { en: 'No coils — digital only', hi: 'कोई कॉइल नहीं — केवल डिजिटल' },
      ],
      correct: 1,
    },
  ];

  const quizScore = quizSubmitted ? QUIZ.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">📏 {language === 'hi' ? 'मापक यंत्र प्रयोगशाला' : 'Measuring Instruments Lab'}</h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'hi' ? 'मल्टीमीटर, मेगर, क्लैंप मीटर और वॉटमीटर का उपयोग सीखें' : 'Learn to use multimeter, megger, clamp meter and wattmeter'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-surface-dark-2 rounded-xl">
        {[
          { key: 'simulator' as const, icon: '🔧', en: 'Simulator', hi: 'सिम्युलेटर' },
          { key: 'theory' as const, icon: '📖', en: 'Theory', hi: 'सिद्धांत' },
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

      {activeTab === 'simulator' && (
        <div className="grid lg:grid-cols-[260px_1fr] gap-4">
          {/* Instrument Selector */}
          <div className="space-y-2">
            {([
              { key: 'multimeter' as Instrument, icon: '🔧', en: 'Digital Multimeter', hi: 'डिजिटल मल्टीमीटर' },
              { key: 'megger' as Instrument, icon: '📏', en: 'Megger (IR Tester)', hi: 'मेगर (IR टेस्टर)' },
              { key: 'clamp' as Instrument, icon: '🔗', en: 'Clamp Meter', hi: 'क्लैंप मीटर' },
              { key: 'wattmeter' as Instrument, icon: '⚡', en: 'Wattmeter', hi: 'वॉटमीटर' },
            ]).map((inst) => (
              <button
                key={inst.key}
                onClick={() => setInstrument(inst.key)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                  instrument === inst.key
                    ? 'bg-brand-50 dark:bg-brand-900/20 border-2 border-brand-500'
                    : 'bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 hover:border-brand-300'
                }`}
              >
                <span className="text-2xl">{inst.icon}</span>
                <span className="font-medium text-sm">{language === 'hi' ? inst.hi : inst.en}</span>
              </button>
            ))}
          </div>

          {/* Instrument Interface */}
          <div className="space-y-4">
            {instrument === 'multimeter' && (
              <div className="card p-5 space-y-4">
                <h2 className="font-bold flex items-center gap-2">🔧 {language === 'hi' ? 'डिजिटल मल्टीमीटर' : 'Digital Multimeter'}</h2>

                {/* Mode selector */}
                <div className="flex gap-2">
                  {[
                    { key: 'voltage' as MeterMode, icon: '⚡', en: 'V (Voltage)', hi: 'V (वोल्टेज)' },
                    { key: 'current' as MeterMode, icon: '🔌', en: 'A (Current)', hi: 'A (धारा)' },
                    { key: 'resistance' as MeterMode, icon: '⊗', en: 'Ω (Resistance)', hi: 'Ω (प्रतिरोध)' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      onClick={() => { setMeterMode(m.key); setReading(null); setRangeIndex(2); }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        meterMode === m.key
                          ? 'bg-brand-500 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-surface-dark-2 hover:bg-slate-200'
                      }`}
                    >
                      {m.icon} {language === 'hi' ? m.hi : m.en}
                    </button>
                  ))}
                </div>

                {/* Range selector */}
                <div>
                  <p className="text-xs text-slate-500 mb-2">{language === 'hi' ? 'रेंज चुनें:' : 'Select Range:'}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {RANGES[meterMode].map((r, i) => (
                      <button
                        key={i}
                        onClick={() => { setRangeIndex(i); setReading(null); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          rangeIndex === i
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-surface-dark-2 hover:bg-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Digital Display */}
                <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center">
                  <div className="rounded-lg bg-black/60 p-4 mb-3 border border-slate-600">
                    <p className="font-mono text-3xl text-green-400 tracking-widest">
                      {reading !== null ? formatReading(reading) : '---'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {language === 'hi' ? `मोड: ${meterMode === 'voltage' ? 'वोल्टेज' : meterMode === 'current' ? 'धारा' : 'प्रतिरोध'}` : `Mode: ${meterMode.charAt(0).toUpperCase() + meterMode.slice(1)}`}
                      {' '} | {language === 'hi' ? 'रेंज' : 'Range'}: {currentRange.label}
                    </p>
                  </div>

                  {/* Meter dial gauge (CSS-based) */}
                  <div className="relative w-48 h-24 mx-auto mb-3 overflow-hidden">
                    <div className="absolute inset-0 rounded-t-full border-4 border-slate-600" style={{ borderBottom: 'none' }} />
                    {/* Scale marks */}
                    {Array.from({ length: 11 }, (_, i) => {
                      const angle = -90 + (i * 180 / 10);
                      return (
                        <div
                          key={i}
                          className="absolute w-0.5 h-3 bg-slate-500"
                          style={{
                            left: '50%',
                            bottom: 0,
                            transformOrigin: 'bottom center',
                            transform: `rotate(${angle}deg) translateX(-50%)`,
                          }}
                        />
                      );
                    })}
                    {/* Needle */}
                    <div
                      className="absolute h-20 w-0.5 bg-red-500 transition-transform duration-700"
                      style={{
                        left: '50%',
                        bottom: 0,
                        transformOrigin: 'bottom center',
                        transform: `rotate(${-90 + (dialValue * 180)}deg) translateX(-50%)`,
                      }}
                    />
                    <div className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-red-600 -translate-x-1/2 translate-y-1/2" />
                  </div>

                  <div className="flex gap-3 justify-center">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-[10px] text-red-400">+VΩ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-slate-800 border border-slate-500" />
                      <span className="text-[10px] text-slate-400">COM</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-700" />
                      <span className="text-[10px] text-red-500">10A</span>
                    </div>
                  </div>
                </div>

                <button onClick={takeReading} className="btn-primary text-sm px-6 py-2.5 w-full">
                  📊 {language === 'hi' ? 'रीडिंग लें' : 'Take Reading'}
                </button>

                {/* Connection guide */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-xs">
                  <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    💡 {language === 'hi' ? 'कनेक्शन गाइड:' : 'Connection Guide:'}
                  </p>
                  {meterMode === 'voltage' && (
                    <p className="text-blue-700 dark:text-blue-400">
                      {language === 'hi'
                        ? '• वोल्टमीटर को हमेशा लोड के समानांतर जोड़ें\n• लाल प्रोब (+) को उच्च पोटेंशियल से जोड़ें\n• काला प्रोब (COM) को निम्न पोटेंशियल से जोड़ें'
                        : '• Always connect voltmeter in parallel across the load\n• Red probe (+) to higher potential\n• Black probe (COM) to lower potential'}
                    </p>
                  )}
                  {meterMode === 'current' && (
                    <p className="text-blue-700 dark:text-blue-400">
                      {language === 'hi'
                        ? '• एमीटर को हमेशा सर्किट में श्रेणी (series) में जोड़ें\n• सर्किट तोड़ें और मीटर बीच में लगाएं\n• 10A रेंज के लिए अलग जैक का उपयोग करें'
                        : '• Always connect ammeter in series with the circuit\n• Break the circuit and insert meter\n• Use separate jack for 10A range'}
                    </p>
                  )}
                  {meterMode === 'resistance' && (
                    <p className="text-blue-700 dark:text-blue-400">
                      {language === 'hi'
                        ? '• प्रतिरोध मापने से पहले सर्किट को डी-एनर्जाइज करें\n• कभी भी लाइव सर्किट पर प्रतिरोध न मापें\n• प्रोब को कॉम्पोनेंट के दोनों सिरों पर लगाएं'
                        : '• De-energize circuit before measuring resistance\n• Never measure resistance on a live circuit\n• Touch probes to both ends of the component'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {instrument === 'megger' && (
              <div className="card p-5 space-y-4">
                <h2 className="font-bold flex items-center gap-2">📏 {language === 'hi' ? 'मेगर (इन्सुलेशन प्रतिरोध परीक्षक)' : 'Megger (Insulation Resistance Tester)'}</h2>
                <div className="rounded-xl bg-gradient-to-br from-amber-800 to-orange-900 p-6 text-center text-white">
                  <p className="text-xs opacity-70 mb-2">MEGGER 500V / 1000V</p>
                  <div className="rounded-lg bg-black/40 p-4 mb-4 border border-amber-600">
                    <p className="font-mono text-2xl text-green-400">
                      {reading !== null ? `${(reading / 1000000 * 50 + 0.5).toFixed(1)} MΩ` : '--- MΩ'}
                    </p>
                    <p className="text-[10px] text-amber-300 mt-1">
                      {language === 'hi' ? 'इन्सुलेशन प्रतिरोध' : 'Insulation Resistance'}
                    </p>
                  </div>
                  <div className="flex gap-3 justify-center mb-4">
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-red-600 mx-auto mb-1 border-2 border-red-400 flex items-center justify-center text-xs">L</div>
                      <span className="text-[10px]">Line</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-green-600 mx-auto mb-1 border-2 border-green-400 flex items-center justify-center text-xs">E</div>
                      <span className="text-[10px]">Earth</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 mx-auto mb-1 border-2 border-blue-400 flex items-center justify-center text-xs">G</div>
                      <span className="text-[10px]">Guard</span>
                    </div>
                  </div>
                  <button onClick={takeReading} className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm transition-colors">
                    🔄 {language === 'hi' ? 'क्रैंक और मापें' : 'Crank & Measure'}
                  </button>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-xs">
                  <p className="font-semibold text-amber-800 dark:text-amber-300 mb-2">
                    ⚠️ {language === 'hi' ? 'सुरक्षा नोट:' : 'Safety Note:'}
                  </p>
                  <p className="text-amber-700 dark:text-amber-400">
                    {language === 'hi'
                      ? '• मेगर उच्च वोल्टेज (500V-2500V DC) उत्पन्न करता है\n• परीक्षण से पहले सर्किट को पूरी तरह डी-एनर्जाइज करें\n• परीक्षण के बाद केबल को डिस्चार्ज करें\n• कभी भी लाइव सर्किट पर मेगर का उपयोग न करें'
                      : '• Megger generates high voltage (500V-2500V DC)\n• Fully de-energize circuit before testing\n• Discharge cable after testing\n• Never use megger on a live circuit'}
                  </p>
                </div>
              </div>
            )}

            {instrument === 'clamp' && (
              <div className="card p-5 space-y-4">
                <h2 className="font-bold flex items-center gap-2">🔗 {language === 'hi' ? 'क्लैंप मीटर (टोंग टेस्टर)' : 'Clamp Meter (Tong Tester)'}</h2>
                <div className="rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 p-6 text-center text-white">
                  <div className="relative w-32 mx-auto mb-4">
                    <div className="w-32 h-16 border-4 border-yellow-500 rounded-t-full" />
                    <p className="text-[10px] text-yellow-400 mt-1">{language === 'hi' ? 'तार को जबड़े में डालें' : 'Clamp around conductor'}</p>
                  </div>
                  <div className="rounded-lg bg-black/40 p-4 mb-4 border border-slate-500">
                    <p className="font-mono text-2xl text-green-400">
                      {reading !== null ? `${(reading * 100).toFixed(1)} A` : '--- A'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">AC Current (RMS)</p>
                  </div>
                  <button onClick={takeReading} className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-medium text-sm transition-colors">
                    📊 {language === 'hi' ? 'रीडिंग लें' : 'Take Reading'}
                  </button>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-xs">
                  <p className="font-semibold text-green-800 dark:text-green-300 mb-2">
                    ✅ {language === 'hi' ? 'फायदे:' : 'Advantages:'}
                  </p>
                  <p className="text-green-700 dark:text-green-400">
                    {language === 'hi'
                      ? '• सर्किट तोड़े बिना करंट मापें\n• लाइव सर्किट पर सुरक्षित उपयोग\n• AC और DC दोनों मापन\n• करंट ट्रांसफॉर्मर सिद्धांत पर काम करता है'
                      : '• Measure current without breaking circuit\n• Safe to use on live circuits\n• Both AC and DC measurement\n• Works on current transformer principle'}
                  </p>
                </div>
              </div>
            )}

            {instrument === 'wattmeter' && (
              <div className="card p-5 space-y-4">
                <h2 className="font-bold flex items-center gap-2">⚡ {language === 'hi' ? 'वॉटमीटर' : 'Wattmeter'}</h2>
                <div className="rounded-xl bg-gradient-to-br from-indigo-800 to-purple-900 p-6 text-center text-white">
                  <p className="text-xs opacity-70 mb-3">DYNAMOMETER WATTMETER</p>
                  <div className="rounded-lg bg-black/40 p-4 mb-4 border border-indigo-500">
                    <p className="font-mono text-2xl text-green-400">
                      {reading !== null ? `${(reading * 500 + 100).toFixed(0)} W` : '--- W'}
                    </p>
                    <p className="text-[10px] text-indigo-300 mt-1">{language === 'hi' ? 'सक्रिय शक्ति' : 'Active Power'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="rounded-lg bg-white/10 p-2">
                      <p className="text-indigo-300">{language === 'hi' ? 'करंट कॉइल (CC)' : 'Current Coil (CC)'}</p>
                      <p className="text-xs opacity-60">{language === 'hi' ? 'श्रेणी में जोड़ें' : 'Connect in series'}</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-2">
                      <p className="text-indigo-300">{language === 'hi' ? 'प्रेशर कॉइल (PC)' : 'Pressure Coil (PC)'}</p>
                      <p className="text-xs opacity-60">{language === 'hi' ? 'समानांतर में जोड़ें' : 'Connect in parallel'}</p>
                    </div>
                  </div>
                  <button onClick={takeReading} className="px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm transition-colors">
                    📊 {language === 'hi' ? 'रीडिंग लें' : 'Take Reading'}
                  </button>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-xs">
                  <p className="font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                    📐 {language === 'hi' ? 'सूत्र:' : 'Formula:'}
                  </p>
                  <p className="font-mono text-indigo-700 dark:text-indigo-400">
                    P = V × I × cos(φ)
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-400 mt-1">
                    {language === 'hi' ? 'जहां cos(φ) = पावर फैक्टर' : 'Where cos(φ) = Power Factor'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'theory' && (
        <div className="card p-5 space-y-5">
          <h2 className="font-bold text-lg">📖 {language === 'hi' ? 'मापक यंत्रों का सिद्धांत' : 'Theory of Measuring Instruments'}</h2>

          <div className="space-y-4">
            {[
              {
                title: { en: 'Multimeter', hi: 'मल्टीमीटर' },
                icon: '🔧',
                content: {
                  en: 'A multimeter (VOM - Volt-Ohm-Milliammeter) is the most versatile instrument. Digital multimeters (DMM) display readings numerically. Key rule: for VOLTAGE measurement, connect in PARALLEL (high internal resistance). For CURRENT measurement, connect in SERIES (low internal resistance). Always start from the HIGHEST range when measuring an unknown quantity.',
                  hi: 'मल्टीमीटर (VOM) सबसे बहुमुखी यंत्र है। डिजिटल मल्टीमीटर (DMM) रीडिंग को संख्यात्मक रूप से दिखाता है। मुख्य नियम: वोल्टेज मापन के लिए, समानांतर में जोड़ें (उच्च आंतरिक प्रतिरोध)। धारा मापन के लिए, श्रेणी में जोड़ें (कम आंतरिक प्रतिरोध)। अज्ञात मात्रा मापते समय हमेशा उच्चतम रेंज से शुरू करें।',
                },
              },
              {
                title: { en: 'Megger', hi: 'मेगर' },
                icon: '📏',
                content: {
                  en: 'A megger (megohmmeter) tests insulation resistance by applying a high DC voltage (500V, 1000V, 2500V, or 5000V). It has three terminals: Line (L), Earth (E), and Guard (G). The guard terminal prevents surface leakage from affecting the reading. As per IE Rules, minimum insulation resistance = 1 MΩ × (kV rating of the system). For a 230V system, minimum IR = 1 MΩ.',
                  hi: 'मेगर (मेगाओममीटर) उच्च DC वोल्टेज (500V, 1000V, 2500V, या 5000V) लगाकर इन्सुलेशन प्रतिरोध का परीक्षण करता है। इसमें तीन टर्मिनल हैं: लाइन (L), अर्थ (E), और गार्ड (G)। गार्ड टर्मिनल सतह लीकेज को रीडिंग को प्रभावित करने से रोकता है।',
                },
              },
              {
                title: { en: 'Clamp Meter', hi: 'क्लैंप मीटर' },
                icon: '🔗',
                content: {
                  en: 'A clamp meter (tong tester) measures current without breaking the circuit. It works on the current transformer principle — the jaw acts as the CT core and the conductor as the primary. For accurate reading, clamp around ONLY ONE conductor (phase or neutral, not both together — the fields cancel out). Can also measure voltage and resistance like a multimeter.',
                  hi: 'क्लैंप मीटर (टोंग टेस्टर) सर्किट तोड़े बिना करंट मापता है। यह करंट ट्रांसफॉर्मर सिद्धांत पर काम करता है — जबड़ा CT कोर के रूप में और चालक प्राइमरी के रूप में कार्य करता है। सटीक रीडिंग के लिए, केवल एक चालक के चारों ओर क्लैंप करें।',
                },
              },
            ].map((section, i) => (
              <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  {section.icon} {language === 'hi' ? section.title.hi : section.title.en}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'hi' ? section.content.hi : section.content.en}
                </p>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-surface-dark-2">
                  <th className="p-2 text-left rounded-tl-lg">{language === 'hi' ? 'यंत्र' : 'Instrument'}</th>
                  <th className="p-2 text-left">{language === 'hi' ? 'मापता है' : 'Measures'}</th>
                  <th className="p-2 text-left">{language === 'hi' ? 'कनेक्शन' : 'Connection'}</th>
                  <th className="p-2 text-left rounded-tr-lg">{language === 'hi' ? 'आंतरिक प्रतिरोध' : 'Int. Resistance'}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['🔧 Voltmeter', 'V', { en: 'Parallel', hi: 'समानांतर' }, { en: 'Very High', hi: 'बहुत अधिक' }],
                  ['🔌 Ammeter', 'I', { en: 'Series', hi: 'श्रेणी' }, { en: 'Very Low', hi: 'बहुत कम' }],
                  ['📏 Megger', 'IR (MΩ)', { en: 'L-E terminals', hi: 'L-E टर्मिनल' }, { en: 'N/A', hi: 'N/A' }],
                  ['🔗 Clamp', 'I (A)', { en: 'Clamp around wire', hi: 'तार के चारों ओर क्लैंप' }, { en: 'N/A', hi: 'N/A' }],
                  ['⚡ Wattmeter', 'P (W)', { en: 'CC: Series, PC: Parallel', hi: 'CC: श्रेणी, PC: समानांतर' }, { en: 'CC low, PC high', hi: 'CC कम, PC अधिक' }],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="p-2 font-medium">{row[0] as string}</td>
                    <td className="p-2 font-mono">{row[1] as string}</td>
                    <td className="p-2">{language === 'hi' ? (row[2] as any).hi : (row[2] as any).en}</td>
                    <td className="p-2">{language === 'hi' ? (row[3] as any).hi : (row[3] as any).en}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-lg">📝 {language === 'hi' ? 'क्विज़: मापक यंत्र' : 'Quiz: Measuring Instruments'}</h2>
          {QUIZ.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="font-medium text-sm mb-3">{qi + 1}. {language === 'hi' ? q.q.hi : q.q.en}</p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
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
