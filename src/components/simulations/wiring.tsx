import { useState, useMemo } from 'react';
import {
  SimCanvas, SimShell, Segmented, Readout, useLang, palette, drawGrid,
} from './primitives';

/* ============================================================
   MODULE 5 — Two-way / godown switching (interactive)
   ============================================================ */
export function WiringSwitchSim() {
  const L = useLang();
  const [mode, setMode] = useState<'two' | 'godown'>('two');
  const [s1, setS1] = useState(0);
  const [s2, setS2] = useState(0);
  const [sm, setSm] = useState(0); // intermediate (straight=0 / cross=1)

  const lampOn = mode === 'two' ? s1 === s2 : (sm === 0 ? s1 === s2 : s1 !== s2);

  return (
    <SimShell
      title={L('Two-Way & Godown Switching', 'टू-वे एवं गोदाम स्विचिंग')}
      subtitle={L('Control one lamp from two (or more) places. Flip any switch — the lamp toggles, just like a real staircase circuit.',
        'एक लैंप को दो (या अधिक) जगहों से नियंत्रित करें। कोई भी स्विच पलटें — लैंप टॉगल होता है, असली सीढ़ी सर्किट की तरह।')}
      controls={<div className="flex flex-wrap items-center gap-2">
        <Segmented value={mode} onChange={(m) => { setMode(m); }} options={[
          { value: 'two', label: L('2 switches (staircase)', '2 स्विच (सीढ़ी)') },
          { value: 'godown', label: L('3 switches (godown)', '3 स्विच (गोदाम)') },
        ]} />
        <button onClick={() => setS1(s1 ? 0 : 1)} className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-200 dark:bg-surface-dark-2 active:scale-95">Switch 1 ⇅</button>
        {mode === 'godown' && <button onClick={() => setSm(sm ? 0 : 1)} className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-200 dark:bg-surface-dark-2 active:scale-95">Switch 2 ⇅</button>}
        <button onClick={() => setS2(s2 ? 0 : 1)} className="px-3 py-1.5 rounded-md text-xs font-bold bg-slate-200 dark:bg-surface-dark-2 active:scale-95">{mode === 'godown' ? 'Switch 3' : 'Switch 2'} ⇅</button>
      </div>}
    >
      <SimCanvas height={200} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 26);
        const on = lampOn;
        const wire = (pts: number[][], live: boolean) => {
          ctx.strokeStyle = live ? '#ef4444' : p.sub; ctx.lineWidth = live ? 3 : 2;
          ctx.beginPath(); pts.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])); ctx.stroke();
          if (live) { ctx.fillStyle = '#fde047'; const seg = Math.floor((t * 2) % (pts.length - 1)); const f = (t * 2) % 1; const a = pts[seg], b = pts[seg + 1]; ctx.beginPath(); ctx.arc(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 3, 0, Math.PI * 2); ctx.fill(); }
        };
        // lamp top center
        const lx = w / 2, ly = 30;
        ctx.fillStyle = on ? 'rgba(250,204,21,0.9)' : (dark ? '#334155' : '#cbd5e1');
        ctx.beginPath(); ctx.arc(lx, ly, 15, 0, Math.PI * 2); ctx.fill();
        if (on) { ctx.fillStyle = 'rgba(250,204,21,0.25)'; ctx.beginPath(); ctx.arc(lx, ly, 24, 0, Math.PI * 2); ctx.fill(); }
        ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lx, ly, 15, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = p.axis; ctx.beginPath(); ctx.moveTo(lx - 6, ly - 6); ctx.lineTo(lx + 6, ly + 6); ctx.moveTo(lx + 6, ly - 6); ctx.lineTo(lx - 6, ly + 6); ctx.stroke();

        const sw = (x: number, sel: number, label: string) => {
          const cy = h - 36, cxx = x;
          // common + two throws
          ctx.fillStyle = p.text; ctx.font = '8px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(label, cxx, cy + 26);
          const throwT = [cxx, cy - 16], throwB = [cxx, cy + 10], common = [cxx - 22, cy - 3];
          [throwT, throwB, common].forEach((pt) => { ctx.fillStyle = p.axis; ctx.beginPath(); ctx.arc(pt[0], pt[1], 3, 0, Math.PI * 2); ctx.fill(); });
          // lever to selected throw
          ctx.strokeStyle = on ? '#ef4444' : p.text; ctx.lineWidth = 2.5;
          const tgt = sel === 0 ? throwT : throwB;
          ctx.beginPath(); ctx.moveTo(common[0], common[1]); ctx.lineTo(tgt[0], tgt[1]); ctx.stroke();
          return { throwT, throwB, common };
        };
        const left = sw(w * 0.2, s1, 'S1');
        const right = sw(w * 0.8, s2, mode === 'godown' ? 'S3' : 'S2');
        // live feed to left common, lamp to right common
        wire([[w * 0.05, h - 16], [w * 0.05, left.common[1]], left.common], on);
        wire([right.common, [w * 0.95, right.common[1]], [w * 0.95, ly], [lx + 15, ly]], on);
        wire([[lx - 15, ly], [w * 0.5, ly + 60]], on); // lamp other side down to travelers junction (visual)
        // travelers between throws (with optional intermediate cross)
        if (mode === 'two') {
          wire([left.throwT, [w * 0.5, left.throwT[1] - 6], right.throwT], on && s1 === 0 && s2 === 0);
          wire([left.throwB, [w * 0.5, left.throwB[1] + 6], right.throwB], on && s1 === 1 && s2 === 1);
        } else {
          const mx = w * 0.5, my = h - 40;
          // intermediate switch box
          ctx.strokeStyle = p.axis; ctx.lineWidth = 2; ctx.strokeRect(mx - 16, my - 18, 32, 32);
          ctx.fillStyle = p.text; ctx.font = '8px sans-serif'; ctx.fillText('S2', mx, my + 26);
          if (sm === 0) { // straight
            wire([left.throwT, [mx - 16, left.throwT[1]]], false); wire([[mx + 16, right.throwT[1]], right.throwT], false);
          } else { // cross
            ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(mx - 12, my - 12); ctx.lineTo(mx + 12, my + 10); ctx.moveTo(mx - 12, my + 10); ctx.lineTo(mx + 12, my - 12); ctx.stroke();
          }
          wire([left.throwT, [mx - 16, left.throwT[1]]], on);
          wire([[mx + 16, right.throwT[1]], right.throwT], on);
        }
      }} />
      <div className="grid grid-cols-2 gap-2">
        <Readout label={L('Lamp', 'लैंप')} value={lampOn ? L('ON 💡', 'चालू 💡') : L('OFF', 'बंद')} color={lampOn ? '#eab308' : '#64748b'} />
        <Readout label={L('Switches', 'स्विच')} value={mode === 'two' ? '2 × SPDT' : '2×SPDT + 1 interm.'} color="#3b82f6" sub={L('each place can toggle', 'हर जगह टॉगल कर सकती है')} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 12/29 — Electrical symbol matching game
   ============================================================ */
type Sym = { id: string; en: string; hi: string; draw: (ctx: CanvasRenderingContext2D, cx: number, cy: number, col: string) => void };
const SYMBOLS: Sym[] = [
  { id: 'res', en: 'Resistor', hi: 'प्रतिरोधक', draw: (c, x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 36, y); c.lineTo(x - 24, y); let px = x - 24; for (let k = 0; k < 6; k++) { c.lineTo(px + 4, y + (k % 2 ? 9 : -9)); px += 4; } c.lineTo(x + 24, y); c.lineTo(x + 36, y); c.stroke(); } },
  { id: 'cap', en: 'Capacitor', hi: 'संधारित्र', draw: (c, x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 36, y); c.lineTo(x - 6, y); c.moveTo(x - 6, y - 14); c.lineTo(x - 6, y + 14); c.moveTo(x + 6, y - 14); c.lineTo(x + 6, y + 14); c.moveTo(x + 6, y); c.lineTo(x + 36, y); c.stroke(); } },
  { id: 'ind', en: 'Inductor / Coil', hi: 'प्रेरक / कॉइल', draw: (c, x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 36, y); for (let k = 0; k < 4; k++) c.arc(x - 24 + k * 16, y, 8, Math.PI, 0, false); c.moveTo(x + 36, y); c.lineTo(x + 36, y); c.stroke(); c.beginPath(); c.moveTo(x + 28, y); c.lineTo(x + 36, y); c.stroke(); } },
  { id: 'diode', en: 'Diode', hi: 'डायोड', draw: (c, x, y, col) => { c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 36, y); c.lineTo(x - 10, y); c.stroke(); c.beginPath(); c.moveTo(x - 10, y - 11); c.lineTo(x - 10, y + 11); c.lineTo(x + 10, y); c.closePath(); c.fill(); c.beginPath(); c.moveTo(x + 10, y - 11); c.lineTo(x + 10, y + 11); c.moveTo(x + 10, y); c.lineTo(x + 36, y); c.stroke(); } },
  { id: 'bat', en: 'Battery / Cell', hi: 'बैटरी / सेल', draw: (c, x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 36, y); c.lineTo(x - 10, y); c.moveTo(x - 10, y - 16); c.lineTo(x - 10, y + 16); c.moveTo(x + 2, y - 8); c.lineTo(x + 2, y + 8); c.moveTo(x + 2, y); c.lineTo(x + 36, y); c.stroke(); } },
  { id: 'lamp', en: 'Lamp', hi: 'लैंप', draw: (c, x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.arc(x, y, 14, 0, Math.PI * 2); c.moveTo(x - 10, y - 10); c.lineTo(x + 10, y + 10); c.moveTo(x + 10, y - 10); c.lineTo(x - 10, y + 10); c.moveTo(x - 36, y); c.lineTo(x - 14, y); c.moveTo(x + 14, y); c.lineTo(x + 36, y); c.stroke(); } },
  { id: 'switch', en: 'Switch', hi: 'स्विच', draw: (c, x, y, col) => { c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 36, y); c.lineTo(x - 12, y); c.moveTo(x + 12, y); c.lineTo(x + 36, y); c.stroke(); c.beginPath(); c.arc(x - 12, y, 3, 0, Math.PI * 2); c.arc(x + 12, y, 3, 0, Math.PI * 2); c.fill(); c.beginPath(); c.moveTo(x - 12, y); c.lineTo(x + 10, y - 14); c.stroke(); } },
  { id: 'earth', en: 'Earth / Ground', hi: 'अर्थ / भूमि', draw: (c, x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y - 16); c.lineTo(x, y); c.moveTo(x - 16, y); c.lineTo(x + 16, y); c.moveTo(x - 10, y + 6); c.lineTo(x + 10, y + 6); c.moveTo(x - 5, y + 12); c.lineTo(x + 5, y + 12); c.stroke(); } },
  { id: 'fuse', en: 'Fuse', hi: 'फ्यूज', draw: (c, x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x - 36, y); c.lineTo(x - 18, y); c.moveTo(x + 18, y); c.lineTo(x + 36, y); c.strokeRect(x - 18, y - 8, 36, 16); c.moveTo(x - 18, y); c.lineTo(x + 18, y); c.stroke(); } },
  { id: 'xfmr', en: 'Transformer', hi: 'ट्रांसफॉर्मर', draw: (c, x, y, col) => { c.strokeStyle = col; c.lineWidth = 2.5; c.beginPath(); for (let k = 0; k < 3; k++) c.arc(x - 16, y - 16 + k * 16, 7, -Math.PI / 2, Math.PI / 2, false); for (let k = 0; k < 3; k++) c.arc(x + 16, y - 16 + k * 16, 7, Math.PI / 2, -Math.PI / 2, true); c.stroke(); c.beginPath(); c.moveTo(x, y - 22); c.lineTo(x, y + 22); c.stroke(); } },
];

export function SymbolMatchSim() {
  const L = useLang();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [asked, setAsked] = useState(0);

  const order = useMemo(() => [...SYMBOLS].sort(() => Math.random() - 0.5), []);
  const current = order[idx % order.length];
  const options = useMemo(() => {
    const wrong = SYMBOLS.filter((s) => s.id !== current.id).sort(() => Math.random() - 0.5).slice(0, 3);
    return [...wrong, current].sort(() => Math.random() - 0.5);
  }, [current]);

  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    setAsked((a) => a + 1);
    if (id === current.id) setScore((s) => s + 1);
  };
  const next = () => { setPicked(null); setIdx((i) => i + 1); };

  return (
    <SimShell
      title={L('Electrical Symbol Match', 'विद्युत प्रतीक मिलान')}
      subtitle={L('Identify the schematic symbol — the language of wiring diagrams. Build speed before your drawing exam.',
        'योजनाबद्ध प्रतीक पहचानें — वायरिंग आरेख की भाषा। ड्राइंग परीक्षा से पहले गति बनाएं।')}
      controls={<div className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const state = picked ? (o.id === current.id ? 'correct' : (o.id === picked ? 'wrong' : 'idle')) : 'idle';
          return (
            <button key={o.id} onClick={() => choose(o.id)} disabled={!!picked}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                state === 'correct' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : state === 'wrong' ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                : 'border-slate-200 dark:border-slate-700 hover:border-brand-400'}`}>
              {L(o.en, o.hi)}{state === 'correct' ? ' ✅' : state === 'wrong' ? ' ❌' : ''}
            </button>
          );
        })}
      </div>}
    >
      <SimCanvas height={130} running={false} draw={({ ctx, w, h, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 22);
        current.draw(ctx, w / 2, h / 2, p.text);
      }} />
      <div className="flex items-center justify-between">
        <Readout label={L('Score', 'स्कोर')} value={`${score}/${asked}`} color="#22c55e" />
        {picked && (
          <button onClick={next} className="btn-primary text-sm px-5 py-2">
            {L('Next symbol', 'अगला प्रतीक')} →
          </button>
        )}
      </div>
    </SimShell>
  );
}
