import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';
import { Zap, BookOpen, Activity, Gauge, LineChart as LineChartIcon, Plus, Trash2, Check } from 'lucide-react';
import { ProLineChart } from '@/components/simulations/charts';
import { THEMES, withAlpha } from '@/components/simulations/theme';

interface Reading { voltage: number; current: number }
const T = THEMES.circuit;

export default function OhmsLawLab() {
  const { t } = useTranslation();
  const { language, addXP } = useAppStore();
  const L = (en: string, hi: string) => (language === 'hi' ? hi : en);
  const [resistance, setResistance] = useState(100);
  const [supplyVoltage, setSupplyVoltage] = useState(6);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [showTheory, setShowTheory] = useState(false);

  const current = useMemo(() => (resistance <= 0 ? 0 : supplyVoltage / resistance), [supplyVoltage, resistance]);
  const power = supplyVoltage * current;

  const takeReading = () => {
    if (supplyVoltage > 0) {
      const nr = { voltage: supplyVoltage, current: Number(current.toFixed(4)) };
      setReadings((prev) => prev.some((r) => r.voltage === nr.voltage) ? prev : [...prev, nr].sort((a, b) => a.voltage - b.voltage));
      addXP(5);
    }
  };

  const maxV = 24;
  const lineData = Array.from({ length: 25 }, (_, k) => ({ x: k, i: +(k / resistance).toFixed(4) }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-2xl flex-shrink-0" style={{ background: withAlpha(T.accent, 0.15), color: T.accent }}>
            <Zap size={22} strokeWidth={2.2} />
          </span>
          <div>
            <h1 className="text-xl font-bold">{t('labs.ohmsLaw')}</h1>
            <p className="text-xs text-slate-500">{L("Verify Ohm's Law: V = I × R", 'ओम के नियम को सत्यापित करें: V = I × R')}</p>
          </div>
        </div>
        <button onClick={() => setShowTheory(!showTheory)} className="btn-secondary inline-flex items-center gap-1.5 text-xs px-3 py-1.5 self-start">
          <BookOpen size={14} /> {showTheory ? L('Hide theory', 'छिपाएं') : L('Theory', 'सिद्धांत')}
        </button>
      </div>

      {showTheory && (
        <div className="card p-5" style={{ background: withAlpha(T.accent, 0.06), borderColor: withAlpha(T.accent, 0.2) }}>
          <h3 className="font-semibold mb-2">{L("Ohm's Law", 'ओम का नियम')}</h3>
          <p className="text-2xl font-mono font-bold mb-2" style={{ color: T.accent }}>V = I × R</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{L(
            'The current (I) through a conductor is directly proportional to the voltage (V) across it, provided temperature and physical conditions stay constant.',
            'किसी चालक में धारा (I) उसके सिरों के विभवांतर (V) के समानुपाती होती है, जब ताप व भौतिक परिस्थितियाँ स्थिर रहें।')}</p>
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div><strong>V</strong> — {L('Volts (V)', 'वोल्ट (V)')}</div>
            <div><strong>I</strong> — {L('Amperes (A)', 'एम्पियर (A)')}</div>
            <div><strong>R</strong> — {L('Ohms (Ω)', 'ओम (Ω)')}</div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Setup */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Activity size={16} style={{ color: T.accent }} /> {L('Experiment Setup', 'प्रयोग सेटअप')}</h2>

          <svg viewBox="0 0 320 170" className="w-full mb-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-dark-2">
            <defs>
              <marker id="iarrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b" /></marker>
            </defs>
            {/* wires */}
            <g stroke={T.accent} strokeWidth="2.5" fill="none" strokeLinecap="round">
              <line x1="40" y1="130" x2="40" y2="40" /><line x1="40" y1="40" x2="120" y2="40" />
              <line x1="140" y1="40" x2="210" y2="40" /><line x1="280" y1="40" x2="280" y2="130" /><line x1="280" y1="130" x2="40" y2="130" />
            </g>
            {/* battery */}
            <line x1="30" y1="82" x2="50" y2="82" stroke="currentColor" strokeWidth="3" />
            <line x1="35" y1="74" x2="45" y2="74" stroke="currentColor" strokeWidth="1.5" />
            <text x="56" y="80" fontSize="10" fill="currentColor" className="font-mono font-bold">{supplyVoltage}V</text>
            {/* ammeter */}
            <circle cx="130" cy="40" r="14" fill="white" className="dark:fill-slate-800" stroke="#f59e0b" strokeWidth="2" />
            <text x="130" y="44" fontSize="11" textAnchor="middle" fontWeight="bold" fill="#f59e0b">A</text>
            <text x="130" y="18" fontSize="9" textAnchor="middle" fill="#f59e0b" className="font-mono">{(current * 1000).toFixed(0)} mA</text>
            {/* resistor */}
            <polyline points="210,40 217,28 227,52 237,28 247,52 257,28 264,40 280,40" fill="none" stroke="#8b5cf6" strokeWidth="2.5" />
            <text x="245" y="66" fontSize="10" textAnchor="middle" fill="#8b5cf6" className="font-mono">{resistance}Ω</text>
            {/* voltmeter */}
            <circle cx="245" cy="110" r="14" fill="white" className="dark:fill-slate-800" stroke={T.accent} strokeWidth="2" />
            <text x="245" y="114" fontSize="11" textAnchor="middle" fontWeight="bold" fill={T.accent}>V</text>
            <g stroke={T.accent} strokeWidth="1" strokeDasharray="3,2" opacity="0.6"><line x1="210" y1="40" x2="210" y2="110" /><line x1="210" y1="110" x2="231" y2="110" /><line x1="259" y1="110" x2="280" y2="110" /><line x1="280" y1="110" x2="280" y2="40" /></g>
            <text x="245" y="136" fontSize="9" textAnchor="middle" fill={T.accent} className="font-mono">{supplyVoltage.toFixed(1)} V</text>
            {/* current arrow */}
            {current > 0.0001 && <line x1="72" y1="40" x2="96" y2="40" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#iarrow)" />}
          </svg>

          <div className="space-y-4">
            <Field label={L('Supply voltage', 'आपूर्ति वोल्टेज')} value={`${supplyVoltage} V`} accent={T.accent}>
              <input type="range" min={0} max={24} step={0.5} value={supplyVoltage} onChange={(e) => setSupplyVoltage(+e.target.value)} className="w-full accent-brand-500" style={{ accentColor: T.accent }} />
              <div className="flex justify-between text-[10px] text-slate-400"><span>0 V</span><span>12 V</span><span>24 V</span></div>
            </Field>
            <Field label={L('Resistance', 'प्रतिरोध')} value={`${resistance} Ω`} accent="#8b5cf6">
              <input type="range" min={10} max={1000} step={10} value={resistance} onChange={(e) => setResistance(+e.target.value)} className="w-full" style={{ accentColor: '#8b5cf6' }} />
              <div className="flex justify-between text-[10px] text-slate-400"><span>10 Ω</span><span>500 Ω</span><span>1000 Ω</span></div>
            </Field>

            <div className="grid grid-cols-3 gap-2">
              <Stat label={L('Voltage', 'वोल्टेज')} value={supplyVoltage.toFixed(1)} unit="V" color={T.accent} />
              <Stat label={L('Current', 'धारा')} value={(current * 1000).toFixed(0)} unit="mA" color="#f59e0b" />
              <Stat label={L('Power', 'शक्ति')} value={(power * 1000).toFixed(0)} unit="mW" color="#16a34a" />
            </div>

            <div className="flex gap-2">
              <button onClick={takeReading} className="btn-primary inline-flex items-center justify-center gap-1.5 text-xs flex-1 py-2"><Plus size={14} /> {L('Take reading', 'रीडिंग लें')}</button>
              <button onClick={() => setReadings([])} className="btn-secondary inline-flex items-center gap-1.5 text-xs px-3 py-2"><Trash2 size={14} /> {L('Clear', 'साफ़ करें')}</button>
            </div>
          </div>
        </div>

        {/* Graph */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><LineChartIcon size={16} style={{ color: T.accent }} /> {L('V–I Characteristic', 'V-I ग्राफ')}</h2>
          <ProLineChart
            data={lineData} xKey="x" xLabel={L('Voltage (V)', 'वोल्टेज (V)')} yLabel={L('Current (A)', 'धारा (A)')}
            height={250} decimals={0} xDomain={[0, maxV]} legend={false}
            series={[{ key: 'i', name: L('I = V/R', 'I = V/R'), color: T.accent, area: true }]}
            refDots={[
              ...readings.map((r) => ({ x: r.voltage, y: r.current, color: '#8b5cf6' })),
              { x: supplyVoltage, y: +current.toFixed(4), color: '#f59e0b', label: L('now', 'अभी') },
            ]}
          />
          {readings.length > 0 && (
            <div className="mt-4 overflow-auto">
              <table className="w-full text-xs">
                <thead><tr className="bg-slate-50 dark:bg-surface-dark-2 text-slate-500">
                  <th className="p-2 text-left">#</th><th className="p-2 text-right">V (V)</th><th className="p-2 text-right">I (mA)</th><th className="p-2 text-right">V/I (Ω)</th>
                </tr></thead>
                <tbody>
                  {readings.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2 text-right font-mono">{r.voltage.toFixed(1)}</td>
                      <td className="p-2 text-right font-mono">{(r.current * 1000).toFixed(0)}</td>
                      <td className="p-2 text-right font-mono">{r.current > 0 ? (r.voltage / r.current).toFixed(0) : '∞'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                <Check size={13} /> {L(`V/I ≈ ${resistance} Ω (constant) — Ohm's Law verified`, `V/I ≈ ${resistance} Ω (नियत) — ओम का नियम सत्यापित`)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, accent, children }: { label: string; value: string; accent: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium flex justify-between mb-1">
        <span>{label}</span><span className="font-mono" style={{ color: accent }}>{value}</span>
      </label>
      {children}
    </div>
  );
}
function Stat({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-center bg-white dark:bg-surface-dark-1">
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className="text-lg font-bold font-mono leading-tight" style={{ color }}>{value}</p>
      <p className="text-[10px] text-slate-400">{unit}</p>
    </div>
  );
}
