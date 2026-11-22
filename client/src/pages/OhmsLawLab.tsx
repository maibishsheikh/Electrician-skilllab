import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';

interface Reading {
  voltage: number;
  current: number;
}

export default function OhmsLawLab() {
  const { t } = useTranslation();
  const { language, addXP } = useAppStore();
  const [resistance, setResistance] = useState(100);
  const [supplyVoltage, setSupplyVoltage] = useState(0);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [showTheory, setShowTheory] = useState(false);

  const current = useMemo(() => {
    if (resistance <= 0) return 0;
    return supplyVoltage / resistance;
  }, [supplyVoltage, resistance]);

  const takeReading = () => {
    if (supplyVoltage > 0) {
      const newReading = { voltage: supplyVoltage, current: Number(current.toFixed(4)) };
      setReadings((prev) => {
        // Avoid duplicate voltage readings
        if (prev.some((r) => r.voltage === newReading.voltage)) return prev;
        return [...prev, newReading].sort((a, b) => a.voltage - b.voltage);
      });
      addXP(5);
    }
  };

  const clearReadings = () => setReadings([]);

  // SVG Chart dimensions
  const chartW = 400;
  const chartH = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const plotW = chartW - padding.left - padding.right;
  const plotH = chartH - padding.top - padding.bottom;

  const maxV = Math.max(24, ...readings.map((r) => r.voltage)) * 1.1;
  const maxI = Math.max(0.5, ...readings.map((r) => r.current)) * 1.1;

  const scaleX = (v: number) => padding.left + (v / maxV) * plotW;
  const scaleY = (i: number) => padding.top + plotH - (i / maxI) * plotH;

  // Ammeter gauge
  const ammeterAngle = Math.min((current / (maxI || 1)) * 180, 180) - 90;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{t('labs.ohmsLaw')}</h1>
          <p className="text-xs text-slate-500">
            {language === 'hi' ? 'ओम के नियम को सत्यापित करें: V = IR' : "Verify Ohm's Law: V = IR"}
          </p>
        </div>
        <button onClick={() => setShowTheory(!showTheory)} className="btn-secondary text-xs px-3 py-1.5">
          📖 {showTheory ? (language === 'hi' ? 'छिपाएं' : 'Hide Theory') : (language === 'hi' ? 'सिद्धांत' : 'Theory')}
        </button>
      </div>

      {showTheory && (
        <div className="card p-5 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold mb-2">
            {language === 'hi' ? 'ओम का नियम (Ohm\'s Law)' : "Ohm's Law"}
          </h3>
          <div className="text-sm space-y-2 text-slate-700 dark:text-slate-300">
            <p className="text-lg font-mono font-bold text-brand-600">V = I × R</p>
            <p>{language === 'hi'
              ? 'किसी चालक में बहने वाली विद्युत धारा (I) उसके सिरों पर लगाए गए विभवांतर (V) के समानुपाती होती है, जबकि ताप और अन्य भौतिक परिस्थितियाँ स्थिर रहें।'
              : 'The current (I) flowing through a conductor is directly proportional to the potential difference (V) across its ends, provided temperature and other physical conditions remain constant.'
            }</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>V</strong> = {language === 'hi' ? 'वोल्टेज (वोल्ट, V)' : 'Voltage (Volts, V)'}</li>
              <li><strong>I</strong> = {language === 'hi' ? 'धारा (एम्पियर, A)' : 'Current (Amperes, A)'}</li>
              <li><strong>R</strong> = {language === 'hi' ? 'प्रतिरोध (ओम, Ω)' : 'Resistance (Ohms, Ω)'}</li>
            </ul>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Virtual Lab Setup */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4">🔬 {language === 'hi' ? 'प्रयोग सेटअप' : 'Experiment Setup'}</h2>

          {/* Circuit Diagram (simple SVG) */}
          <svg viewBox="0 0 320 180" className="w-full mb-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-surface-dark p-2">
            {/* Battery */}
            <line x1="40" y1="140" x2="40" y2="40" className="wire-path" />
            <line x1="30" y1="80" x2="50" y2="80" stroke="currentColor" strokeWidth="3" />
            <line x1="34" y1="70" x2="46" y2="70" stroke="currentColor" strokeWidth="1.5" />
            <text x="20" y="78" fontSize="8" fill="currentColor">+</text>
            <text x="52" y="85" fontSize="9" fill="currentColor" className="font-mono">{supplyVoltage}V</text>

            {/* Top wire */}
            <line x1="40" y1="40" x2="130" y2="40" className="wire-path" />

            {/* Ammeter */}
            <circle cx="130" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="130" y="44" fontSize="10" textAnchor="middle" fontWeight="bold" fill="currentColor">A</text>
            <text x="130" y="20" fontSize="8" textAnchor="middle" className="fill-amber-500 font-mono">
              {(current * 1000).toFixed(1)} mA
            </text>

            <line x1="145" y1="40" x2="220" y2="40" className="wire-path" />

            {/* Resistor */}
            <polyline
              points="220,40 227,25 237,55 247,25 257,55 267,25 273,40 280,40"
              fill="none" stroke="currentColor" strokeWidth="2"
            />
            <text x="250" y="68" fontSize="9" textAnchor="middle" fill="currentColor" className="font-mono">
              {resistance}Ω
            </text>

            {/* Voltmeter branch */}
            <line x1="220" y1="40" x2="220" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4,2" />
            <circle cx="250" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="250" y="104" fontSize="10" textAnchor="middle" fontWeight="bold" fill="currentColor">V</text>
            <text x="250" y="125" fontSize="8" textAnchor="middle" className="fill-brand-500 font-mono">
              {supplyVoltage.toFixed(1)} V
            </text>
            <line x1="280" y1="40" x2="280" y2="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4,2" />
            <line x1="280" y1="80" x2="280" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4,2" />
            <line x1="265" y1="100" x2="280" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4,2" />
            <line x1="220" y1="80" x2="220" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4,2" />
            <line x1="220" y1="100" x2="235" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4,2" />

            {/* Return path */}
            <line x1="280" y1="40" x2="280" y2="140" className="wire-path" />
            <line x1="280" y1="140" x2="40" y2="140" className="wire-path" />

            {/* Current arrow */}
            {current > 0.0001 && (
              <g className="text-amber-500">
                <line x1="80" y1="35" x2="100" y2="35" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="90" y="30" fontSize="7" textAnchor="middle" fill="currentColor">I</text>
              </g>
            )}
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" className="fill-amber-500" />
              </marker>
            </defs>
          </svg>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium flex justify-between">
                <span>{language === 'hi' ? 'आपूर्ति वोल्टेज' : 'Supply Voltage'}</span>
                <span className="font-mono text-brand-600">{supplyVoltage} V</span>
              </label>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={supplyVoltage}
                onChange={(e) => setSupplyVoltage(Number(e.target.value))}
                className="w-full mt-1 accent-brand-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 V</span><span>12 V</span><span>24 V</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium flex justify-between">
                <span>{language === 'hi' ? 'प्रतिरोध' : 'Resistance'}</span>
                <span className="font-mono text-brand-600">{resistance} Ω</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={resistance}
                onChange={(e) => setResistance(Number(e.target.value))}
                className="w-full mt-1 accent-brand-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10 Ω</span><span>500 Ω</span><span>1000 Ω</span>
              </div>
            </div>

            {/* Live readings */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-500">{language === 'hi' ? 'वोल्टेज' : 'Voltage'}</p>
                <p className="text-lg font-bold font-mono text-brand-600">{supplyVoltage.toFixed(1)}</p>
                <p className="text-[10px] text-slate-400">V</p>
              </div>
              <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-500">{language === 'hi' ? 'धारा' : 'Current'}</p>
                <p className="text-lg font-bold font-mono text-amber-600">{(current * 1000).toFixed(1)}</p>
                <p className="text-[10px] text-slate-400">mA</p>
              </div>
              <div className="bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-2 text-center">
                <p className="text-[10px] text-slate-500">{language === 'hi' ? 'शक्ति' : 'Power'}</p>
                <p className="text-lg font-bold font-mono text-green-600">{(supplyVoltage * current * 1000).toFixed(1)}</p>
                <p className="text-[10px] text-slate-400">mW</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={takeReading} className="btn-primary text-xs flex-1 py-2">
                📊 {language === 'hi' ? 'रीडिंग लें' : 'Take Reading'}
              </button>
              <button onClick={clearReadings} className="btn-secondary text-xs px-3 py-2">
                🗑 {language === 'hi' ? 'साफ़ करें' : 'Clear'}
              </button>
            </div>
          </div>
        </div>

        {/* V-I Graph */}
        <div className="card p-5">
          <h2 className="font-semibold mb-4">📈 {language === 'hi' ? 'V-I ग्राफ' : 'V-I Characteristic'}</h2>

          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-surface-dark">
            {/* Axes */}
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartH - padding.bottom} stroke="currentColor" strokeWidth="1.5" />
            <line x1={padding.left} y1={chartH - padding.bottom} x2={chartW - padding.right} y2={chartH - padding.bottom} stroke="currentColor" strokeWidth="1.5" />

            {/* Axis labels */}
            <text x={chartW / 2} y={chartH - 5} fontSize="10" textAnchor="middle" fill="currentColor">
              {language === 'hi' ? 'वोल्टेज (V)' : 'Voltage (V)'}
            </text>
            <text x="12" y={chartH / 2} fontSize="10" textAnchor="middle" fill="currentColor" transform={`rotate(-90, 12, ${chartH / 2})`}>
              {language === 'hi' ? 'धारा (A)' : 'Current (A)'}
            </text>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((frac) => (
              <g key={frac}>
                <line
                  x1={padding.left}
                  y1={scaleY(maxI * frac)}
                  x2={chartW - padding.right}
                  y2={scaleY(maxI * frac)}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  opacity="0.3"
                />
                <text x={padding.left - 5} y={scaleY(maxI * frac) + 3} fontSize="7" textAnchor="end" fill="currentColor" opacity="0.6">
                  {(maxI * frac).toFixed(2)}
                </text>
              </g>
            ))}
            {[0.25, 0.5, 0.75, 1].map((frac) => (
              <g key={frac}>
                <line
                  x1={scaleX(maxV * frac)}
                  y1={padding.top}
                  x2={scaleX(maxV * frac)}
                  y2={chartH - padding.bottom}
                  stroke="currentColor"
                  strokeWidth="0.3"
                  opacity="0.3"
                />
                <text x={scaleX(maxV * frac)} y={chartH - padding.bottom + 12} fontSize="7" textAnchor="middle" fill="currentColor" opacity="0.6">
                  {(maxV * frac).toFixed(0)}
                </text>
              </g>
            ))}

            {/* Theoretical line (V/R) */}
            <line
              x1={scaleX(0)}
              y1={scaleY(0)}
              x2={scaleX(maxV)}
              y2={scaleY(maxV / resistance)}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="4,3"
              opacity="0.3"
            />

            {/* Data points */}
            {readings.map((r, i) => (
              <g key={i}>
                <circle cx={scaleX(r.voltage)} cy={scaleY(r.current)} r="4" className="fill-brand-500" />
                <text x={scaleX(r.voltage) + 6} y={scaleY(r.current) - 4} fontSize="6" fill="currentColor" opacity="0.7">
                  ({r.voltage}, {(r.current * 1000).toFixed(0)}mA)
                </text>
              </g>
            ))}

            {/* Best fit line through data */}
            {readings.length >= 2 && (() => {
              const first = readings[0];
              const last = readings[readings.length - 1];
              return (
                <line
                  x1={scaleX(first.voltage)}
                  y1={scaleY(first.current)}
                  x2={scaleX(last.voltage)}
                  y2={scaleY(last.current)}
                  className="stroke-brand-500"
                  strokeWidth="2"
                />
              );
            })()}

            {/* Current point indicator */}
            {supplyVoltage > 0 && (
              <circle
                cx={scaleX(supplyVoltage)}
                cy={scaleY(current)}
                r="6"
                fill="none"
                className="stroke-amber-500"
                strokeWidth="2"
              >
                <animate attributeName="r" values="4;8;4" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Legend */}
            <g transform={`translate(${chartW - padding.right - 80}, ${padding.top + 5})`}>
              <circle cx="5" cy="0" r="3" className="fill-brand-500" />
              <text x="12" y="3" fontSize="7" fill="currentColor">{language === 'hi' ? 'रीडिंग' : 'Readings'}</text>
              <line x1="0" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
              <text x="12" y="15" fontSize="7" fill="currentColor" opacity="0.5">{language === 'hi' ? 'सैद्धांतिक' : 'Theoretical'}</text>
            </g>
          </svg>

          {/* Data table */}
          {readings.length > 0 && (
            <div className="mt-4 overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-surface-dark-2">
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-right">{language === 'hi' ? 'वोल्टेज (V)' : 'Voltage (V)'}</th>
                    <th className="p-2 text-right">{language === 'hi' ? 'धारा (mA)' : 'Current (mA)'}</th>
                    <th className="p-2 text-right">V/I (Ω)</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((r, i) => (
                    <tr key={i} className="border-t border-slate-100 dark:border-slate-700">
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2 text-right font-mono">{r.voltage.toFixed(1)}</td>
                      <td className="p-2 text-right font-mono">{(r.current * 1000).toFixed(1)}</td>
                      <td className="p-2 text-right font-mono">{r.current > 0 ? (r.voltage / r.current).toFixed(0) : '∞'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[10px] text-slate-400 mt-2">
                {language === 'hi'
                  ? `V/I अनुपात ≈ ${resistance}Ω (नियत) → ओम का नियम सत्यापित ✓`
                  : `V/I ratio ≈ ${resistance}Ω (constant) → Ohm's Law verified ✓`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
