import { useState, useMemo } from 'react';
import {
  Cable, PlugZap, Droplets, Zap, TriangleAlert, Unplug, Power, Hand,
  FireExtinguisher, SquareCheck, CheckCircle2, XCircle, RotateCcw, Flame,
  Droplet, Wind, Sparkles, type LucideIcon,
} from 'lucide-react';
import { SimShell, Segmented, useLang } from './primitives';
import { THEMES } from './theme';

const T = THEMES.safety;

/* ============================================================
   PART 1 — Hazard Hunt (spot-the-danger scene)
   ============================================================ */
interface Spot {
  id: string; x: number; y: number; Icon: LucideIcon; hazard: boolean;
  nameEn: string; nameHi: string; whyEn: string; whyHi: string; fixEn: string; fixHi: string;
}
const SPOTS: Spot[] = [
  { id: 'cable', x: 20, y: 64, Icon: Cable, hazard: true, nameEn: 'Frayed cable', nameHi: 'कटा-फटा तार',
    whyEn: 'Damaged insulation exposes the live conductor — a direct shock and short-circuit risk.', whyHi: 'क्षतिग्रस्त इन्सुलेशन लाइव चालक को खोल देता है — सीधा झटका व शॉर्ट-सर्किट जोखिम।',
    fixEn: 'Replace the cable. Never wrap bare copper with tape.', fixHi: 'तार बदलें। खुले तांबे पर टेप न लगाएं।' },
  { id: 'octopus', x: 82, y: 58, Icon: PlugZap, hazard: true, nameEn: 'Overloaded socket', nameHi: 'ओवरलोडेड सॉकेट',
    whyEn: 'Too many loads on one socket overheat the wiring and can start a fire.', whyHi: 'एक सॉकेट पर अधिक लोड वायरिंग को गरम कर आग लगा सकते हैं।',
    fixEn: 'Distribute loads across circuits; avoid multi-plug adaptors.', fixHi: 'लोड को अलग सर्किट पर बांटें; मल्टी-प्लग से बचें।' },
  { id: 'water', x: 32, y: 88, Icon: Droplets, hazard: true, nameEn: 'Water near socket', nameHi: 'सॉकेट के पास पानी',
    whyEn: 'Water conducts electricity — a spill under a socket can give a fatal shock.', whyHi: 'पानी बिजली का चालक है — सॉकेट के नीचे पानी घातक झटका दे सकता है।',
    fixEn: 'Keep electrical areas dry; mop spills before working.', fixHi: 'विद्युत क्षेत्र सूखा रखें; काम से पहले पानी पोंछें।' },
  { id: 'bare', x: 60, y: 30, Icon: Zap, hazard: true, nameEn: 'Bare live wire', nameHi: 'खुला लाइव तार',
    whyEn: 'An exposed live end hanging in reach can be touched accidentally.', whyHi: 'पहुंच में लटका खुला लाइव सिरा गलती से छू सकता है।',
    fixEn: 'Isolate, then terminate inside a proper junction box.', fixHi: 'आइसोलेट करें, फिर जंक्शन बॉक्स में समाप्त करें।' },
  { id: 'ladder', x: 46, y: 16, Icon: TriangleAlert, hazard: true, nameEn: 'Metal ladder at line', nameHi: 'लाइन पर धातु सीढ़ी',
    whyEn: 'A metal ladder near an overhead line can bridge to live and electrocute you.', whyHi: 'ओवरहेड लाइन के पास धातु सीढ़ी लाइव से जुड़कर करंट दे सकती है।',
    fixEn: 'Use a fibreglass ladder and keep safe clearance.', fixHi: 'फाइबरग्लास सीढ़ी प्रयोग करें व सुरक्षित दूरी रखें।' },
  { id: 'noearth', x: 82, y: 86, Icon: Unplug, hazard: true, nameEn: 'No earth pin', nameHi: 'अर्थ पिन नहीं',
    whyEn: 'A 2-pin plug on a metal-body appliance leaves the body un-earthed — shock on fault.', whyHi: '2-पिन प्लग धातु-बॉडी उपकरण को अर्थ नहीं करता — फॉल्ट पर झटका।',
    fixEn: 'Use a 3-pin earthed plug and socket.', fixHi: '3-पिन अर्थेड प्लग व सॉकेट प्रयोग करें।' },
  { id: 'live', x: 13, y: 34, Icon: Power, hazard: true, nameEn: 'Live panel open', nameHi: 'लाइव पैनल खुला',
    whyEn: 'Working on a live board without lock-out risks arc flash and shock.', whyHi: 'बिना लॉक-आउट लाइव बोर्ड पर काम आर्क व झटके का जोखिम।',
    fixEn: 'Switch off, Lock-out, Tag-out, then verify dead.', fixHi: 'बंद करें, लॉक-आउट, टैग-आउट, फिर मृत सत्यापित करें।' },
  { id: 'ppe', x: 60, y: 70, Icon: Hand, hazard: true, nameEn: 'Bare hands on tool', nameHi: 'नंगे हाथ औज़ार पर',
    whyEn: 'No insulating gloves or shoes — body becomes the path to earth.', whyHi: 'इन्सुलेटिंग दस्ताने/जूते नहीं — शरीर अर्थ का रास्ता बनता है।',
    fixEn: 'Wear insulated gloves and safety shoes.', fixHi: 'इन्सुलेटेड दस्ताने व सुरक्षा जूते पहनें।' },
  // safe decoys
  { id: 'extin', x: 92, y: 30, Icon: FireExtinguisher, hazard: false, nameEn: 'CO₂ extinguisher', nameHi: 'CO₂ अग्निशामक',
    whyEn: 'Correct — a CO₂ extinguisher is right for electrical fires. Good to have here.', whyHi: 'सही — विद्युत आग हेतु CO₂ उपयुक्त है। यहां होना अच्छा है।',
    fixEn: 'This is safe equipment, not a hazard.', fixHi: 'यह सुरक्षित उपकरण है, खतरा नहीं।' },
  { id: 'jbox', x: 30, y: 44, Icon: SquareCheck, hazard: false, nameEn: 'Closed junction box', nameHi: 'बंद जंक्शन बॉक्स',
    whyEn: 'Correct — a covered junction box keeps joints enclosed. This is good practice.', whyHi: 'सही — ढका जंक्शन बॉक्स जोड़ों को बंद रखता है। अच्छी प्रथा।',
    fixEn: 'This is safe, not a hazard.', fixHi: 'यह सुरक्षित है, खतरा नहीं।' },
];
const TOTAL_HAZARDS = SPOTS.filter((s) => s.hazard).length;

// Marker positions over the illustrated scene (800×480 viewBox)
const POS: Record<string, { x: number; y: number }> = {
  live: { x: 96, y: 150 }, cable: { x: 430, y: 150 }, octopus: { x: 648, y: 392 },
  water: { x: 612, y: 452 }, bare: { x: 300, y: 262 }, noearth: { x: 178, y: 372 },
  ladder: { x: 712, y: 180 }, ppe: { x: 452, y: 330 }, extin: { x: 126, y: 214 }, jbox: { x: 540, y: 116 },
};

function HazardScene() {
  return (
    <>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#dfe7f0" /><stop offset="1" stopColor="#cdd8e6" /></linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#b9a888" /><stop offset="1" stopColor="#a2906f" /></linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#cbd5e1" /><stop offset="0.5" stopColor="#f1f5f9" /><stop offset="1" stopColor="#94a3b8" /></linearGradient>
      </defs>
      {/* room */}
      <rect x="0" y="0" width="800" height="318" fill="url(#wall)" />
      <rect x="0" y="318" width="800" height="162" fill="url(#floor)" />
      <rect x="0" y="312" width="800" height="8" fill="#8a7a5c" />
      {/* window */}
      <rect x="250" y="40" width="120" height="80" rx="4" fill="#afd3ef" stroke="#8aa0b4" strokeWidth="3" />
      <line x1="310" y1="40" x2="310" y2="120" stroke="#8aa0b4" strokeWidth="2" /><line x1="250" y1="80" x2="370" y2="80" stroke="#8aa0b4" strokeWidth="2" />
      {/* ceiling light */}
      <line x1="410" y1="0" x2="410" y2="24" stroke="#64748b" strokeWidth="2" /><ellipse cx="410" cy="30" rx="18" ry="7" fill="#fde68a" stroke="#eab308" />
      {/* ceiling supply wire + metal ladder (hazard) */}
      <line x1="620" y1="0" x2="760" y2="60" stroke="#475569" strokeWidth="2.5" />
      <g stroke="#9ca3af" strokeWidth="4"><line x1="700" y1="90" x2="690" y2="300" /><line x1="726" y1="90" x2="736" y2="300" />
        {[110, 150, 190, 230, 270].map((y, i) => <line key={i} x1={698 - i} y1={y} x2={728 + i} y2={y} />)}</g>
      {/* open distribution board (hazard: live panel) */}
      <rect x="52" y="72" width="88" height="130" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
      <rect x="140" y="72" width="40" height="130" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" transform="skewY(-8)" opacity="0.9" />
      <rect x="64" y="96" width="64" height="12" rx="2" fill="#475569" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={68 + i * 15} y="90" width="10" height="20" rx="1" fill="#f8fafc" stroke="#64748b" />)}
      {/* exposed live wires from panel */}
      <path d="M70 200 q-6 24 6 40" fill="none" stroke="#dc2626" strokeWidth="3" />
      <path d="M86 200 q10 20 -2 44" fill="none" stroke="#1e293b" strokeWidth="3" />
      <path d="M102 200 q8 26 18 36" fill="none" stroke="#2563eb" strokeWidth="3" />
      {/* fire extinguisher (safe) */}
      <rect x="116" y="190" width="22" height="46" rx="8" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" /><rect x="123" y="180" width="8" height="12" fill="#334155" /><line x1="127" y1="180" x2="150" y2="196" stroke="#334155" strokeWidth="2" />
      {/* junction box (safe, closed) */}
      <rect x="516" y="96" width="48" height="40" rx="4" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" /><circle cx="524" cy="104" r="2" fill="#64748b" /><circle cx="556" cy="104" r="2" fill="#64748b" /><circle cx="524" cy="128" r="2" fill="#64748b" /><circle cx="556" cy="128" r="2" fill="#64748b" />
      {/* frayed cable from ceiling (hazard) */}
      <path d="M430 24 q-10 70 2 110" fill="none" stroke="#1e293b" strokeWidth="5" />
      <g stroke="#f59e0b" strokeWidth="2" fill="none"><path d="M432 134 l-8 16" /><path d="M432 134 l2 20" /><path d="M432 134 l10 14" /></g>
      {/* wall socket + bare wire (hazard) */}
      <rect x="286" y="232" width="28" height="22" rx="3" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" /><circle cx="296" cy="243" r="2" fill="#64748b" /><circle cx="304" cy="243" r="2" fill="#64748b" />
      <path d="M300 254 q-14 20 -2 44" fill="none" stroke="#1e293b" strokeWidth="3" /><line x1="298" y1="296" x2="294" y2="306" stroke="#f59e0b" strokeWidth="2" /><line x1="298" y1="296" x2="303" y2="305" stroke="#f59e0b" strokeWidth="2" />
      {/* appliance with 2-pin plug (hazard: no earth) */}
      <rect x="150" y="344" width="56" height="40" rx="4" fill="#64748b" /><rect x="158" y="352" width="40" height="18" rx="2" fill="#94a3b8" />
      <line x1="178" y1="384" x2="178" y2="332" stroke="#334155" strokeWidth="2" /><rect x="170" y="326" width="16" height="10" rx="2" fill="#1e293b" />
      {/* workbench + bare hands on tool (hazard: no PPE) */}
      <rect x="372" y="322" width="150" height="16" rx="2" fill="#9a7b53" /><rect x="380" y="338" width="6" height="40" fill="#7c5f3d" /><rect x="508" y="338" width="6" height="40" fill="#7c5f3d" />
      <rect x="430" y="308" width="44" height="14" rx="2" fill="#334155" /><line x1="452" y1="308" x2="452" y2="300" stroke="#dc2626" strokeWidth="2" />
      <circle cx="438" cy="318" r="7" fill="#f3c19b" /><circle cx="466" cy="318" r="7" fill="#f3c19b" />
      {/* overloaded power strip + tangled plugs (hazard) */}
      <rect x="600" y="384" width="96" height="18" rx="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={606 + i * 17} y="372" width="13" height="14" rx="2" fill={['#dc2626', '#1e293b', '#2563eb', '#16a34a', '#eab308'][i]} />)}
      <path d="M612 386 q-30 10 -40 40 M629 386 q40 20 60 10 M663 386 q-20 30 -60 40" fill="none" stroke="#334155" strokeWidth="2" opacity="0.7" />
      {/* water puddle (hazard) */}
      <ellipse cx="612" cy="452" rx="70" ry="16" fill="#60a5fa" opacity="0.55" /><ellipse cx="612" cy="452" rx="44" ry="9" fill="#3b82f6" opacity="0.4" />
      <rect x="628" y="402" width="8" height="16" fill="url(#metal)" />
    </>
  );
}

function HazardHunt() {
  const L = useLang();
  const [found, setFound] = useState<Set<string>>(new Set());
  const [misses, setMisses] = useState(0);
  const [active, setActive] = useState<Spot | null>(null);

  const click = (s: Spot) => {
    setActive(s);
    if (s.hazard && !found.has(s.id)) setFound(new Set(found).add(s.id));
    else if (!s.hazard) setMisses((m) => m + 1);
  };
  const reset = () => { setFound(new Set()); setMisses(0); setActive(null); };
  const done = found.size === TOTAL_HAZARDS;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">{L('Inspect the workshop and tap each electrical hazard', 'कार्यशाला का निरीक्षण करें और हर विद्युत खतरा टैप करें')}</span>
        <span className="font-mono font-bold" style={{ color: T.accent }}>{found.size}/{TOTAL_HAZARDS}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${(found.size / TOTAL_HAZARDS) * 100}%`, background: T.accent }} />
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <svg viewBox="0 0 800 480" className="w-full block select-none" style={{ touchAction: 'manipulation' }}>
          <HazardScene />
          {SPOTS.map((s) => {
            const pos = POS[s.id]; if (!pos) return null;
            const isFound = found.has(s.id);
            const isSafe = !s.hazard && active?.id === s.id;
            const col = isFound ? '#16a34a' : isSafe ? '#0891b2' : '#dc2626';
            return (
              <g key={s.id} onClick={() => click(s)} style={{ cursor: 'pointer' }}>
                {!isFound && !isSafe && (
                  <circle cx={pos.x} cy={pos.y} r="20" fill="none" stroke={col} strokeWidth="2" opacity="0.8">
                    <animate attributeName="r" values="16;24;16" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle cx={pos.x} cy={pos.y} r="15" fill={isFound || isSafe ? col : '#ffffff'} fillOpacity={isFound || isSafe ? 0.9 : 0.35} stroke={col} strokeWidth="2.5" />
                {(isFound || isSafe) && <path d={`M${pos.x - 6} ${pos.y} l4 4 l8 -8`} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
              </g>
            );
          })}
        </svg>
      </div>

      {active ? (
        <div className="rounded-xl border p-3" style={{ borderColor: active.hazard ? '#dc262644' : '#0891b244', background: active.hazard ? 'rgba(254,242,242,0.9)' : 'rgba(236,254,255,0.9)' }}>
          <div className="flex items-center gap-2 mb-1">
            {active.hazard ? <TriangleAlert size={16} className="text-red-600" /> : <CheckCircle2 size={16} className="text-cyan-600" />}
            <span className="font-bold text-sm" style={{ color: active.hazard ? '#b91c1c' : '#0e7490' }}>{L(active.nameEn, active.nameHi)}</span>
          </div>
          <p className="text-xs text-slate-700">{L(active.whyEn, active.whyHi)}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: active.hazard ? '#b91c1c' : '#0e7490' }}>→ {L(active.fixEn, active.fixHi)}</p>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">{L('Tap a pulsing circle to inspect that part of the workshop.', 'कार्यशाला के उस भाग की जांच हेतु स्पंदित वृत्त टैप करें।')}</p>
      )}

      {done && (
        <div className="rounded-xl p-3 text-sm font-medium flex items-center gap-2" style={{ background: '#16a34a1a', color: '#15803d' }}>
          <CheckCircle2 size={18} />{L(`All ${TOTAL_HAZARDS} hazards identified (${misses} false alarms). This pre-work inspection is standard practice before any electrical job.`, `सभी ${TOTAL_HAZARDS} खतरे पहचाने (${misses} गलत)। किसी भी विद्युत कार्य से पहले यह निरीक्षण मानक प्रथा है।`)}
        </div>
      )}
      <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700"><RotateCcw size={13} /> {L('Reset inspection', 'निरीक्षण रीसेट करें')}</button>
    </div>
  );
}

/* ============================================================
   PART 2 — Fire response (match extinguisher to fire class)
   ============================================================ */
interface FireCase { id: string; Icon: LucideIcon; en: string; hi: string; answer: string; reasonEn: string; reasonHi: string; }
const EXTINGUISHERS: { id: string; Icon: LucideIcon; en: string; hi: string }[] = [
  { id: 'water', Icon: Droplet, en: 'Water', hi: 'पानी' },
  { id: 'foam', Icon: Wind, en: 'Foam', hi: 'फोम' },
  { id: 'co2', Icon: Sparkles, en: 'CO₂', hi: 'CO₂' },
  { id: 'dcp', Icon: FireExtinguisher, en: 'Dry powder (DCP)', hi: 'ड्राई पाउडर (DCP)' },
];
const FIRES: FireCase[] = [
  { id: 'panel', Icon: Power, en: 'Live electrical panel on fire', hi: 'लाइव विद्युत पैनल में आग', answer: 'co2',
    reasonEn: 'CO₂ is non-conductive and leaves no residue — the right choice for live equipment. Never use water or foam on electrical fire.', reasonHi: 'CO₂ अचालक है व अवशेष नहीं छोड़ता — लाइव उपकरण हेतु सही। विद्युत आग पर पानी/फोम कभी नहीं।' },
  { id: 'wood', Icon: Flame, en: 'Wood / paper / rags (Class A)', hi: 'लकड़ी/कागज (क्लास A)', answer: 'water',
    reasonEn: 'Ordinary combustibles with no live power — water cools and extinguishes Class A fires.', reasonHi: 'बिना लाइव पावर सामान्य ज्वलनशील — पानी क्लास A आग बुझाता है।' },
  { id: 'oil', Icon: Droplets, en: 'Oil / petrol / grease (Class B)', hi: 'तेल/पेट्रोल (क्लास B)', answer: 'dcp',
    reasonEn: 'Flammable liquids — dry powder or foam smothers them. Water spreads burning oil.', reasonHi: 'ज्वलनशील तरल — ड्राई पाउडर/फोम दबाता है। पानी जलते तेल को फैलाता है।' },
];
function FireResponse() {
  const L = useLang();
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const f = FIRES[idx % FIRES.length];
  const pick = (id: string) => { if (picked) return; setPicked(id); if (id === f.answer) setScore((s) => s + 1); };
  const next = () => { setPicked(null); setIdx((i) => i + 1); };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: '#f59e0b44', background: '#fffbeb' }}>
        <span className="grid place-items-center w-11 h-11 rounded-xl" style={{ background: '#f59e0b22', color: '#d97706' }}>
          <f.Icon size={22} />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-amber-600 font-semibold">{L('Fire scenario', 'आग परिदृश्य')}</p>
          <p className="font-bold text-sm text-slate-800">{L(f.en, f.hi)}</p>
        </div>
      </div>
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{L('Which extinguisher do you grab?', 'कौन सा अग्निशामक उठाएंगे?')}</p>
      <div className="grid grid-cols-2 gap-2">
        {EXTINGUISHERS.map((e) => {
          const state = picked ? (e.id === f.answer ? 'right' : e.id === picked ? 'wrong' : 'dim') : 'idle';
          return (
            <button key={e.id} onClick={() => pick(e.id)} disabled={!!picked}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                state === 'right' ? 'border-green-500 bg-green-50 text-green-700'
                : state === 'wrong' ? 'border-red-500 bg-red-50 text-red-700'
                : state === 'dim' ? 'border-slate-200 opacity-50'
                : 'border-slate-200 dark:border-slate-700 hover:border-amber-400'}`}>
              <e.Icon size={18} /> {L(e.en, e.hi)}
              {state === 'right' && <CheckCircle2 size={15} className="ml-auto" />}
              {state === 'wrong' && <XCircle size={15} className="ml-auto" />}
            </button>
          );
        })}
      </div>
      {picked && (
        <div className="rounded-xl p-3 text-xs" style={{ background: picked === f.answer ? '#16a34a14' : '#dc262614', color: picked === f.answer ? '#15803d' : '#b91c1c' }}>
          {L(f.reasonEn, f.reasonHi)}
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono font-bold">{L('Score', 'स्कोर')}: {score}</span>
            <button onClick={next} className="px-4 py-1.5 rounded-lg font-bold text-white" style={{ background: T.accent }}>
              {L('Next fire', 'अगली आग')} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PART 3 — Electric-shock rescue sequence
   ============================================================ */
const STEPS = [
  { id: 's1', en: 'Switch off the mains / isolate the supply', hi: 'मेन बंद करें / आपूर्ति अलग करें' },
  { id: 's2', en: 'If you cannot switch off, push the victim free with a dry wooden stick — never touch bare skin', hi: 'बंद न कर सकें तो सूखी लकड़ी से पीड़ित को अलग करें — नंगी त्वचा न छुएं' },
  { id: 's3', en: 'Call for help / emergency services', hi: 'मदद / आपातकालीन सेवा बुलाएं' },
  { id: 's4', en: 'Check breathing and pulse', hi: 'सांस व नाड़ी जांचें' },
  { id: 's5', en: 'Start CPR / artificial respiration if not breathing', hi: 'सांस न हो तो CPR / कृत्रिम श्वास दें' },
  { id: 's6', en: 'Place in recovery position and keep warm', hi: 'रिकवरी पोजीशन में रखें व गर्म रखें' },
];
function ShockRescue() {
  const L = useLang();
  const [order, setOrder] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const shuffled = useMemo(() => [...STEPS].sort(() => Math.random() - 0.5), []);
  const nextCorrect = STEPS[order.length]?.id;

  const tap = (id: string) => {
    if (order.includes(id)) return;
    if (id === nextCorrect) { setOrder([...order, id]); setWrong(null); }
    else { setWrong(id); setTimeout(() => setWrong(null), 600); }
  };
  const done = order.length === STEPS.length;

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {L('Tap the rescue steps in the correct order.', 'बचाव चरणों को सही क्रम में टैप करें।')}
      </p>
      {/* ordered result */}
      <div className="space-y-1.5">
        {order.map((id, i) => {
          const s = STEPS.find((x) => x.id === id)!;
          return (
            <div key={id} className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs" style={{ background: '#16a34a14' }}>
              <span className="grid place-items-center w-5 h-5 rounded-full text-white text-[10px] font-bold flex-shrink-0" style={{ background: '#16a34a' }}>{i + 1}</span>
              <span className="text-slate-700 dark:text-slate-200">{L(s.en, s.hi)}</span>
            </div>
          );
        })}
      </div>
      {/* choices */}
      {!done && (
        <div className="space-y-1.5">
          {shuffled.filter((s) => !order.includes(s.id)).map((s) => (
            <button key={s.id} onClick={() => tap(s.id)}
              className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-all ${wrong === s.id ? 'border-red-500 bg-red-50 animate-pulse' : 'border-slate-200 dark:border-slate-700 hover:border-red-300'}`}>
              {L(s.en, s.hi)}
            </button>
          ))}
        </div>
      )}
      {done && (
        <div className="rounded-xl p-3 text-sm font-medium flex items-center gap-2" style={{ background: '#16a34a1a', color: '#15803d' }}>
          <CheckCircle2 size={18} /> {L('Correct sequence! Isolate first — rescuer safety always comes before the victim.', 'सही क्रम! पहले आइसोलेट — बचावकर्ता की सुरक्षा हमेशा पहले।')}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Container — the Safety module simulation
   ============================================================ */
export function SafetySim() {
  const L = useLang();
  const [tab, setTab] = useState<'hazard' | 'fire' | 'rescue'>('hazard');
  return (
    <SimShell
      accent={T.accent}
      Icon={T.Icon}
      title={L('Workshop Safety Trainer', 'कार्यशाला सुरक्षा प्रशिक्षक')}
      subtitle={L('Spot hazards, fight the right fire, and rescue a shock victim — the three things that keep an electrician alive.',
        'खतरे पहचानें, सही आग बुझाएं, और झटका पीड़ित को बचाएं — तीन चीजें जो इलेक्ट्रीशियन को सुरक्षित रखती हैं।')}
    >
      <Segmented value={tab} onChange={setTab} options={[
        { value: 'hazard', label: L('Hazard Hunt', 'खतरा खोज') },
        { value: 'fire', label: L('Fire Response', 'आग प्रतिक्रिया') },
        { value: 'rescue', label: L('Shock Rescue', 'झटका बचाव') },
      ]} />
      {tab === 'hazard' && <HazardHunt />}
      {tab === 'fire' && <FireResponse />}
      {tab === 'rescue' && <ShockRescue />}
    </SimShell>
  );
}
