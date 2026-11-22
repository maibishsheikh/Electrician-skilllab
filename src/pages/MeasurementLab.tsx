import { useState, useCallback } from 'react';
import { useAppStore } from '@/context/store';
import {
  Gauge, ShieldCheck, CircleDot, Zap, SlidersHorizontal, BookOpen, ClipboardList,
  Play, RotateCcw, Lightbulb, AlertTriangle, CheckCircle2, Sigma, Check, X,
  PartyPopper, GraduationCap, type LucideIcon,
} from 'lucide-react';
import { THEMES, withAlpha } from '@/components/simulations/theme';

type Instrument = 'multimeter' | 'megger' | 'clamp' | 'wattmeter';
type MeterMode = 'voltage' | 'current' | 'resistance';
const T = THEMES.meter;

export default function MeasurementLab() {
  const { language, addXP } = useAppStore();
  const L = (en: string, hi: string) => (language === 'hi' ? hi : en);
  const [instrument, setInstrument] = useState<Instrument>('multimeter');
  const [meterMode, setMeterMode] = useState<MeterMode>('voltage');
  const [dialValue, setDialValue] = useState(0);
  const [reading, setReading] = useState<number | null>(null);
  const [rangeIndex, setRangeIndex] = useState(2);
  const [activeTab, setActiveTab] = useState<'simulator' | 'theory' | 'quiz'>('simulator');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const RANGES: Record<MeterMode, { label: string; max: number; unit: string }[]> = {
    voltage: [{ label: '200mV', max: 0.2, unit: 'mV' }, { label: '2V', max: 2, unit: 'V' }, { label: '20V', max: 20, unit: 'V' }, { label: '200V', max: 200, unit: 'V' }, { label: '750V', max: 750, unit: 'V' }],
    current: [{ label: '200μA', max: 0.0002, unit: 'μA' }, { label: '2mA', max: 0.002, unit: 'mA' }, { label: '20mA', max: 0.02, unit: 'mA' }, { label: '200mA', max: 0.2, unit: 'mA' }, { label: '10A', max: 10, unit: 'A' }],
    resistance: [{ label: '200Ω', max: 200, unit: 'Ω' }, { label: '2kΩ', max: 2000, unit: 'kΩ' }, { label: '20kΩ', max: 20000, unit: 'kΩ' }, { label: '200kΩ', max: 200000, unit: 'kΩ' }, { label: '2MΩ', max: 2000000, unit: 'MΩ' }],
  };
  const currentRange = RANGES[meterMode][rangeIndex];

  const takeReading = useCallback(() => {
    const factor = meterMode === 'voltage' ? 0.8 : meterMode === 'current' ? 0.6 : 0.7;
    const val = Math.random() * currentRange.max * factor;
    setReading(val); setDialValue(val / currentRange.max); addXP(3);
  }, [meterMode, currentRange, addXP]);

  const formatReading = (val: number): string => {
    if (meterMode === 'voltage') return currentRange.unit === 'mV' ? `${(val * 1000).toFixed(1)} mV` : `${val.toFixed(2)} V`;
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
    { q: { en: 'An ammeter should be connected in:', hi: 'एमीटर को जोड़ना चाहिए:' }, options: [{ en: 'Parallel', hi: 'समानांतर' }, { en: 'Series', hi: 'श्रेणी' }, { en: 'Either way', hi: 'दोनों तरह' }, { en: 'Through a transformer', hi: 'ट्रांसफॉर्मर से' }], correct: 1 },
    { q: { en: 'What voltage does a 500V megger generate?', hi: '500V मेगर कितना वोल्टेज उत्पन्न करता है?' }, options: [{ en: '12V DC', hi: '12V DC' }, { en: '240V AC', hi: '240V AC' }, { en: '500V DC', hi: '500V DC' }, { en: '1000V AC', hi: '1000V AC' }], correct: 2 },
    { q: { en: 'A clamp meter measures current using:', hi: 'क्लैंप मीटर करंट मापता है:' }, options: [{ en: 'Direct contact', hi: 'सीधा संपर्क' }, { en: 'Current transformer principle', hi: 'करंट ट्रांसफॉर्मर सिद्धांत' }, { en: 'Capacitive coupling', hi: 'कैपेसिटिव कपलिंग' }, { en: 'Resistance bridge', hi: 'प्रतिरोध ब्रिज' }], correct: 1 },
    { q: { en: 'When measuring an unknown voltage, start with which range?', hi: 'अज्ञात वोल्टेज मापते समय किस रेंज से शुरू करें?' }, options: [{ en: 'Lowest range', hi: 'सबसे कम रेंज' }, { en: 'Middle range', hi: 'मध्य रेंज' }, { en: 'Highest range', hi: 'सबसे अधिक रेंज' }, { en: 'Auto range', hi: 'ऑटो रेंज' }], correct: 2 },
    { q: { en: 'A wattmeter has:', hi: 'वॉटमीटर में होते हैं:' }, options: [{ en: 'One coil', hi: 'एक कॉइल' }, { en: 'Two coils — current and pressure', hi: 'दो कॉइल — करंट व प्रेशर' }, { en: 'Three coils', hi: 'तीन कॉइल' }, { en: 'No coils', hi: 'कोई कॉइल नहीं' }], correct: 1 },
  ];
  const quizScore = quizSubmitted ? QUIZ.reduce((a, q, i) => a + (quizAnswers[i] === q.correct ? 1 : 0), 0) : 0;

  const instruments: { key: Instrument; Icon: LucideIcon; en: string; hi: string }[] = [
    { key: 'multimeter', Icon: Gauge, en: 'Digital Multimeter', hi: 'डिजिटल मल्टीमीटर' },
    { key: 'megger', Icon: ShieldCheck, en: 'Megger (IR Tester)', hi: 'मेगर (IR टेस्टर)' },
    { key: 'clamp', Icon: CircleDot, en: 'Clamp Meter', hi: 'क्लैंप मीटर' },
    { key: 'wattmeter', Icon: Zap, en: 'Wattmeter', hi: 'वॉटमीटर' },
  ];
  const tabs: { key: typeof activeTab; Icon: LucideIcon; en: string; hi: string }[] = [
    { key: 'simulator', Icon: SlidersHorizontal, en: 'Simulator', hi: 'सिम्युलेटर' },
    { key: 'theory', Icon: BookOpen, en: 'Theory', hi: 'सिद्धांत' },
    { key: 'quiz', Icon: ClipboardList, en: 'Quiz', hi: 'क्विज़' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="grid place-items-center w-11 h-11 rounded-2xl flex-shrink-0" style={{ background: withAlpha(T.accent, 0.15), color: T.accent }}><Gauge size={22} strokeWidth={2.2} /></span>
        <div>
          <h1 className="text-xl font-bold">{L('Measuring Instruments Lab', 'मापक यंत्र प्रयोगशाला')}</h1>
          <p className="text-xs text-slate-500">{L('Use a multimeter, megger, clamp meter and wattmeter', 'मल्टीमीटर, मेगर, क्लैंप मीटर व वॉटमीटर का उपयोग सीखें')}</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-surface-dark-2 rounded-xl">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 text-xs font-medium py-2.5 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.key ? 'bg-white dark:bg-surface-dark shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            style={activeTab === tab.key ? { color: T.accent } : undefined}>
            <tab.Icon size={14} /> {L(tab.en, tab.hi)}
          </button>
        ))}
      </div>

      {activeTab === 'simulator' && (
        <div className="grid lg:grid-cols-[260px_1fr] gap-4">
          <div className="space-y-2">
            {instruments.map((inst) => (
              <button key={inst.key} onClick={() => setInstrument(inst.key)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 border-2 ${instrument === inst.key ? '' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                style={instrument === inst.key ? { borderColor: T.accent, background: withAlpha(T.accent, 0.08) } : undefined}>
                <span className="grid place-items-center w-9 h-9 rounded-lg flex-shrink-0" style={{ background: withAlpha(T.accent, 0.12), color: T.accent }}><inst.Icon size={18} /></span>
                <span className="font-medium text-sm">{L(inst.en, inst.hi)}</span>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {instrument === 'multimeter' && (
              <div className="card p-5 space-y-4">
                <h2 className="font-bold flex items-center gap-2"><Gauge size={18} style={{ color: T.accent }} /> {L('Digital Multimeter', 'डिजिटल मल्टीमीटर')}</h2>
                <div className="flex gap-2">
                  {([['voltage', 'V — Voltage', 'V — वोल्टेज'], ['current', 'A — Current', 'A — धारा'], ['resistance', 'Ω — Resistance', 'Ω — प्रतिरोध']] as [MeterMode, string, string][]).map(([k, en, hi]) => (
                    <button key={k} onClick={() => { setMeterMode(k); setReading(null); setRangeIndex(2); }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${meterMode === k ? 'text-white shadow-sm' : 'bg-slate-100 dark:bg-surface-dark-2 hover:bg-slate-200'}`}
                      style={meterMode === k ? { background: T.accent } : undefined}>{L(en, hi)}</button>
                  ))}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2">{L('Select range:', 'रेंज चुनें:')}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {RANGES[meterMode].map((r, i) => (
                      <button key={i} onClick={() => { setRangeIndex(i); setReading(null); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${rangeIndex === i ? 'bg-amber-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-surface-dark-2 hover:bg-slate-200'}`}>{r.label}</button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center">
                  <div className="rounded-lg bg-black/60 p-4 mb-3 border border-slate-600">
                    <p className="font-mono text-3xl text-green-400 tracking-widest">{reading !== null ? formatReading(reading) : '---'}</p>
                    <p className="text-xs text-slate-400 mt-1">{L(`Mode: ${meterMode}`, `मोड: ${meterMode === 'voltage' ? 'वोल्टेज' : meterMode === 'current' ? 'धारा' : 'प्रतिरोध'}`)} | {L('Range', 'रेंज')}: {currentRange.label}</p>
                  </div>
                  <div className="relative w-48 h-24 mx-auto mb-3 overflow-hidden">
                    <div className="absolute inset-0 rounded-t-full border-4 border-slate-600" style={{ borderBottom: 'none' }} />
                    {Array.from({ length: 11 }, (_, i) => (
                      <div key={i} className="absolute w-0.5 h-3 bg-slate-500" style={{ left: '50%', bottom: 0, transformOrigin: 'bottom center', transform: `rotate(${-90 + i * 18}deg) translateX(-50%)` }} />
                    ))}
                    <div className="absolute h-20 w-0.5 bg-red-500 transition-transform duration-700" style={{ left: '50%', bottom: 0, transformOrigin: 'bottom center', transform: `rotate(${-90 + dialValue * 180}deg) translateX(-50%)` }} />
                    <div className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-red-600 -translate-x-1/2 translate-y-1/2" />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Terminal color="#ef4444" label="+VΩ" /><Terminal color="#1e293b" label="COM" border /><Terminal color="#b91c1c" label="10A" />
                  </div>
                </div>
                <button onClick={takeReading} className="btn-primary inline-flex items-center justify-center gap-1.5 text-sm px-6 py-2.5 w-full"><Play size={15} /> {L('Take reading', 'रीडिंग लें')}</button>
                <Guide Icon={Lightbulb} color={T.accent} title={L('Connection guide:', 'कनेक्शन गाइड:')} lines={
                  meterMode === 'voltage' ? [L('Connect the voltmeter in parallel across the load', 'वोल्टमीटर को लोड के समानांतर जोड़ें'), L('Red probe (+) to higher potential', 'लाल प्रोब (+) उच्च पोटेंशियल से'), L('Black probe (COM) to lower potential', 'काला प्रोब (COM) निम्न पोटेंशियल से')]
                  : meterMode === 'current' ? [L('Connect the ammeter in series with the circuit', 'एमीटर को सर्किट में श्रेणी में जोड़ें'), L('Break the circuit and insert the meter', 'सर्किट तोड़ें व मीटर लगाएं'), L('Use the separate 10 A jack for high current', '10A हेतु अलग जैक प्रयोग करें')]
                  : [L('De-energize the circuit before measuring resistance', 'मापन से पहले सर्किट डी-एनर्जाइज करें'), L('Never measure resistance on a live circuit', 'लाइव सर्किट पर प्रतिरोध न मापें'), L('Touch probes to both ends of the component', 'प्रोब कॉम्पोनेंट के दोनों सिरों पर लगाएं')]
                } />
              </div>
            )}

            {instrument === 'megger' && (
              <div className="card p-5 space-y-4">
                <h2 className="font-bold flex items-center gap-2"><ShieldCheck size={18} style={{ color: T.accent }} /> {L('Megger (Insulation Resistance Tester)', 'मेगर (इन्सुलेशन प्रतिरोध परीक्षक)')}</h2>
                <div className="rounded-xl bg-gradient-to-br from-amber-800 to-orange-900 p-6 text-center text-white">
                  <p className="text-xs opacity-70 mb-2">MEGGER 500V / 1000V</p>
                  <div className="rounded-lg bg-black/40 p-4 mb-4 border border-amber-600">
                    <p className="font-mono text-2xl text-green-400">{reading !== null ? `${(reading / 1000000 * 50 + 0.5).toFixed(1)} MΩ` : '--- MΩ'}</p>
                    <p className="text-[10px] text-amber-300 mt-1">{L('Insulation Resistance', 'इन्सुलेशन प्रतिरोध')}</p>
                  </div>
                  <div className="flex gap-3 justify-center mb-4">
                    <MeggerTerm color="#dc2626" letter="L" label="Line" /><MeggerTerm color="#16a34a" letter="E" label="Earth" /><MeggerTerm color="#2563eb" letter="G" label="Guard" />
                  </div>
                  <button onClick={takeReading} className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-medium text-sm transition-colors"><RotateCcw size={14} /> {L('Crank & measure', 'क्रैंक व मापें')}</button>
                </div>
                <Guide Icon={AlertTriangle} color="#d97706" title={L('Safety note:', 'सुरक्षा नोट:')} lines={[L('Megger generates high DC voltage (500–2500 V)', 'मेगर उच्च DC वोल्टेज (500–2500V) बनाता है'), L('Fully de-energize the circuit before testing', 'परीक्षण से पहले सर्किट डी-एनर्जाइज करें'), L('Discharge the cable after testing', 'परीक्षण के बाद केबल डिस्चार्ज करें'), L('Minimum IR for 230 V system = 1 MΩ', '230V सिस्टम हेतु न्यूनतम IR = 1 MΩ')]} />
              </div>
            )}

            {instrument === 'clamp' && (
              <div className="card p-5 space-y-4">
                <h2 className="font-bold flex items-center gap-2"><CircleDot size={18} style={{ color: T.accent }} /> {L('Clamp Meter (Tong Tester)', 'क्लैंप मीटर (टोंग टेस्टर)')}</h2>
                <div className="rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 p-6 text-center text-white">
                  <div className="w-32 h-16 border-4 border-yellow-500 rounded-t-full mx-auto mb-1" />
                  <p className="text-[10px] text-yellow-400 mb-3">{L('Clamp around one conductor only', 'केवल एक चालक के चारों ओर क्लैंप करें')}</p>
                  <div className="rounded-lg bg-black/40 p-4 mb-4 border border-slate-500">
                    <p className="font-mono text-2xl text-green-400">{reading !== null ? `${(reading * 100).toFixed(1)} A` : '--- A'}</p>
                    <p className="text-[10px] text-slate-400 mt-1">AC Current (RMS)</p>
                  </div>
                  <button onClick={takeReading} className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black font-medium text-sm transition-colors"><Play size={14} /> {L('Take reading', 'रीडिंग लें')}</button>
                </div>
                <Guide Icon={CheckCircle2} color="#16a34a" title={L('Advantages:', 'फायदे:')} lines={[L('Measures current without breaking the circuit', 'सर्किट तोड़े बिना करंट मापता है'), L('Safe to use on live circuits', 'लाइव सर्किट पर सुरक्षित'), L('Works on the current-transformer principle', 'करंट ट्रांसफॉर्मर सिद्धांत पर काम करता है')]} />
              </div>
            )}

            {instrument === 'wattmeter' && (
              <div className="card p-5 space-y-4">
                <h2 className="font-bold flex items-center gap-2"><Zap size={18} style={{ color: T.accent }} /> {L('Wattmeter', 'वॉटमीटर')}</h2>
                <div className="rounded-xl bg-gradient-to-br from-indigo-800 to-purple-900 p-6 text-center text-white">
                  <p className="text-xs opacity-70 mb-3">DYNAMOMETER WATTMETER</p>
                  <div className="rounded-lg bg-black/40 p-4 mb-4 border border-indigo-500">
                    <p className="font-mono text-2xl text-green-400">{reading !== null ? `${(reading * 500 + 100).toFixed(0)} W` : '--- W'}</p>
                    <p className="text-[10px] text-indigo-300 mt-1">{L('Active Power', 'सक्रिय शक्ति')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="rounded-lg bg-white/10 p-2"><p className="text-indigo-200">{L('Current Coil (CC)', 'करंट कॉइल (CC)')}</p><p className="opacity-60">{L('Connect in series', 'श्रेणी में जोड़ें')}</p></div>
                    <div className="rounded-lg bg-white/10 p-2"><p className="text-indigo-200">{L('Pressure Coil (PC)', 'प्रेशर कॉइल (PC)')}</p><p className="opacity-60">{L('Connect in parallel', 'समानांतर में जोड़ें')}</p></div>
                  </div>
                  <button onClick={takeReading} className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm transition-colors"><Play size={14} /> {L('Take reading', 'रीडिंग लें')}</button>
                </div>
                <Guide Icon={Sigma} color="#6366f1" title={L('Formula:', 'सूत्र:')} lines={['P = V × I × cos φ', L('where cos φ = power factor', 'जहां cos φ = पावर फैक्टर')]} mono />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'theory' && (
        <div className="card p-5 space-y-5">
          <h2 className="font-bold text-lg flex items-center gap-2"><BookOpen size={20} style={{ color: T.accent }} /> {L('Theory of Measuring Instruments', 'मापक यंत्रों का सिद्धांत')}</h2>
          {[
            { Icon: Gauge, title: { en: 'Multimeter', hi: 'मल्टीमीटर' }, content: { en: 'A multimeter (VOM) is the most versatile instrument. For VOLTAGE, connect in PARALLEL (high internal resistance). For CURRENT, connect in SERIES (low internal resistance). Always start from the HIGHEST range when measuring an unknown quantity.', hi: 'मल्टीमीटर (VOM) सबसे बहुमुखी यंत्र है। वोल्टेज हेतु समानांतर (उच्च आंतरिक प्रतिरोध); धारा हेतु श्रेणी (कम आंतरिक प्रतिरोध)। अज्ञात मात्रा हेतु सदैव उच्चतम रेंज से शुरू करें।' } },
            { Icon: ShieldCheck, title: { en: 'Megger', hi: 'मेगर' }, content: { en: 'A megger tests insulation resistance using a high DC voltage (500–5000 V). It has three terminals — Line (L), Earth (E), Guard (G). The guard eliminates surface-leakage error. Minimum IR = 1 MΩ × system kV; a 230 V system needs ≥ 1 MΩ.', hi: 'मेगर उच्च DC वोल्टेज (500–5000V) से इन्सुलेशन प्रतिरोध मापता है। तीन टर्मिनल — L, E, G। गार्ड सतह-लीकेज त्रुटि हटाता है। न्यूनतम IR = 1 MΩ × सिस्टम kV।' } },
            { Icon: CircleDot, title: { en: 'Clamp Meter', hi: 'क्लैंप मीटर' }, content: { en: 'A clamp meter measures current without breaking the circuit, using the current-transformer principle — the jaw is the CT core, the conductor is the primary. Clamp around ONE conductor only (both cancel out).', hi: 'क्लैंप मीटर सर्किट तोड़े बिना करंट मापता है — जबड़ा CT कोर, चालक प्राइमरी। केवल एक चालक के चारों ओर क्लैंप करें।' } },
          ].map((s, i) => (
            <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2"><s.Icon size={16} style={{ color: T.accent }} /> {L(s.title.en, s.title.hi)}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{L(s.content.en, s.content.hi)}</p>
            </div>
          ))}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-slate-100 dark:bg-surface-dark-2 text-slate-500">
                <th className="p-2 text-left rounded-tl-lg">{L('Instrument', 'यंत्र')}</th><th className="p-2 text-left">{L('Measures', 'मापता है')}</th><th className="p-2 text-left">{L('Connection', 'कनेक्शन')}</th><th className="p-2 text-left rounded-tr-lg">{L('Int. resistance', 'आंतरिक प्रतिरोध')}</th>
              </tr></thead>
              <tbody>
                {[['Voltmeter', 'V', { en: 'Parallel', hi: 'समानांतर' }, { en: 'Very high', hi: 'बहुत अधिक' }],
                  ['Ammeter', 'I', { en: 'Series', hi: 'श्रेणी' }, { en: 'Very low', hi: 'बहुत कम' }],
                  ['Megger', 'IR (MΩ)', { en: 'L–E terminals', hi: 'L–E टर्मिनल' }, { en: 'N/A', hi: 'N/A' }],
                  ['Clamp', 'I (A)', { en: 'Around conductor', hi: 'चालक के चारों ओर' }, { en: 'N/A', hi: 'N/A' }],
                  ['Wattmeter', 'P (W)', { en: 'CC series, PC parallel', hi: 'CC श्रेणी, PC समानांतर' }, { en: 'CC low, PC high', hi: 'CC कम, PC अधिक' }],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="p-2 font-medium">{row[0] as string}</td><td className="p-2 font-mono">{row[1] as string}</td>
                    <td className="p-2">{L((row[2] as any).en, (row[2] as any).hi)}</td><td className="p-2">{L((row[3] as any).en, (row[3] as any).hi)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="card p-5 space-y-4">
          <h2 className="font-bold text-lg flex items-center gap-2"><ClipboardList size={20} style={{ color: T.accent }} /> {L('Quiz: Measuring Instruments', 'क्विज़: मापक यंत्र')}</h2>
          {QUIZ.map((q, qi) => (
            <div key={qi} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="font-medium text-sm mb-3">{qi + 1}. {L(q.q.en, q.q.hi)}</p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = quizAnswers[qi] === oi;
                  const isCorrect = quizSubmitted && oi === q.correct;
                  const isWrong = quizSubmitted && isSelected && oi !== q.correct;
                  return (
                    <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [qi]: oi })} disabled={quizSubmitted}
                      className={`text-left text-sm px-4 py-2 rounded-lg border transition-all flex items-center ${isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : isWrong ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : isSelected ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                      <span className="font-mono text-xs mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>{L(opt.en, opt.hi)}
                      {isCorrect && <Check size={15} className="ml-auto text-green-600" />}{isWrong && <X size={15} className="ml-auto text-red-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {!quizSubmitted ? (
            <button onClick={() => { setQuizSubmitted(true); if (quizScore >= 3) addXP(25); }} className="btn-primary inline-flex items-center gap-1.5 text-sm px-6 py-2"><Check size={15} /> {L('Submit', 'जमा करें')}</button>
          ) : (
            <div className={`p-4 rounded-xl text-center ${quizScore >= 3 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
              {quizScore >= 3 ? <PartyPopper className="w-7 h-7 mx-auto mb-1 text-green-500" /> : <GraduationCap className="w-7 h-7 mx-auto mb-1 text-amber-500" />}
              <p className="font-bold">{quizScore}/{QUIZ.length} {L('Correct', 'सही')}</p>
              <button onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }} className="btn-secondary inline-flex items-center gap-1.5 text-xs px-4 py-1.5 mt-2"><RotateCcw size={13} /> {L('Retry', 'पुनः प्रयास')}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Terminal({ color, label, border }: { color: string; label: string; border?: boolean }) {
  return <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full" style={{ background: color, border: border ? '1px solid #64748b' : undefined }} /><span className="text-[10px] text-slate-400">{label}</span></div>;
}
function MeggerTerm({ color, letter, label }: { color: string; letter: string; label: string }) {
  return <div className="text-center"><div className="w-8 h-8 rounded-full mx-auto mb-1 grid place-items-center text-xs font-bold text-white" style={{ background: color }}>{letter}</div><span className="text-[10px]">{label}</span></div>;
}
function Guide({ Icon, color, title, lines, mono }: { Icon: LucideIcon; color: string; title: string; lines: string[]; mono?: boolean }) {
  return (
    <div className="rounded-xl p-4 text-xs" style={{ background: withAlpha(color, 0.08) }}>
      <p className="font-semibold mb-2 flex items-center gap-1.5" style={{ color }}><Icon size={14} /> {title}</p>
      <ul className="space-y-1 text-slate-600 dark:text-slate-300">
        {lines.map((l, i) => <li key={i} className={mono ? 'font-mono' : ''}>{mono ? l : `• ${l}`}</li>)}
      </ul>
    </div>
  );
}
