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
        <span className="font-medium text-slate-600 dark:text-slate-300">
          {L('Tap every hazard in the workshop', 'कार्यशाला में हर खतरा टैप करें')}
        </span>
        <span className="font-mono font-bold" style={{ color: T.accent }}>
          {found.size}/{TOTAL_HAZARDS} {L('found', 'मिले')}
        </span>
      </div>

      {/* Scene */}
      <div className="relative w-full rounded-xl overflow-hidden select-none" style={{ aspectRatio: '16/10', minHeight: 220 }}>
        {/* wall + floor */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(#e8eef5 0%, #dde6f0 58%, #c3b39a 58%, #b6a488 100%)' }} />
        <div className="absolute inset-0 dark:block hidden" style={{ background: 'linear-gradient(#1e293b 0%, #16202e 58%, #3a2f22 58%, #2a2217 100%)' }} />
        {/* overhead line */}
        <div className="absolute left-0 right-0" style={{ top: '13%', height: 3, background: '#64748b' }} />
        {/* distribution board */}
        <div className="absolute rounded-md border-2" style={{ left: '6%', top: '24%', width: '14%', height: '20%', background: '#cbd5e1', borderColor: '#94a3b8' }} />
        {/* workbench */}
        <div className="absolute rounded-sm" style={{ left: '40%', top: '62%', width: '34%', height: '8%', background: '#9a7b53' }} />
        <div className="absolute" style={{ left: '42%', top: '70%', width: 5, height: '18%', background: '#7c5f3d' }} />
        <div className="absolute" style={{ left: '70%', top: '70%', width: 5, height: '18%', background: '#7c5f3d' }} />
        {/* puddle */}
        <div className="absolute rounded-[50%]" style={{ left: '26%', top: '90%', width: '16%', height: '6%', background: 'rgba(56,189,248,0.55)' }} />

        {/* hotspots */}
        {SPOTS.map((s) => {
          const isFound = found.has(s.id);
          const isActive = active?.id === s.id;
          const state = isFound ? 'found' : (!s.hazard && isActive) ? 'safe' : 'idle';
          const col = state === 'found' ? '#16a34a' : state === 'safe' ? '#0891b2' : T.accent;
          return (
            <button
              key={s.id}
              onClick={() => click(s)}
              className="absolute grid place-items-center rounded-full border-2 transition-transform active:scale-90"
              style={{
                left: `${s.x}%`, top: `${s.y}%`, width: 34, height: 34, transform: 'translate(-50%,-50%)',
                background: '#fff', borderColor: col, color: col,
                boxShadow: state === 'idle' ? `0 0 0 0 ${col}` : `0 0 0 3px ${col}33`,
                animation: state === 'idle' ? 'simPulse 2s infinite' : 'none',
              }}
              aria-label={L(s.nameEn, s.nameHi)}
            >
              <s.Icon size={17} strokeWidth={2.2} />
            </button>
          );
        })}
        <style>{`@keyframes simPulse{0%{box-shadow:0 0 0 0 ${T.accent}55}70%{box-shadow:0 0 0 10px ${T.accent}00}100%{box-shadow:0 0 0 0 ${T.accent}00}}`}</style>
      </div>

      {/* info / feedback panel */}
      {active ? (
        <div className="rounded-xl border p-3" style={{ borderColor: active.hazard ? '#dc262644' : '#0891b244', background: active.hazard ? '#fef2f2' : '#ecfeff' }}>
          <div className="flex items-center gap-2 mb-1">
            {active.hazard ? <TriangleAlert size={16} className="text-red-600" /> : <CheckCircle2 size={16} className="text-cyan-600" />}
            <span className="font-bold text-sm" style={{ color: active.hazard ? '#b91c1c' : '#0e7490' }}>{L(active.nameEn, active.nameHi)}</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-700">{L(active.whyEn, active.whyHi)}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: active.hazard ? '#b91c1c' : '#0e7490' }}>→ {L(active.fixEn, active.fixHi)}</p>
        </div>
      ) : (
        <p className="text-xs text-slate-400 text-center py-2">{L('Tap a glowing marker to inspect it.', 'जांचने हेतु चमकता मार्कर टैप करें।')}</p>
      )}

      {done && (
        <div className="rounded-xl p-3 text-sm font-medium flex items-center gap-2" style={{ background: '#16a34a1a', color: '#15803d' }}>
          <CheckCircle2 size={18} />
          {L(`All ${TOTAL_HAZARDS} hazards identified with ${misses} false alarms. A real electrician scans like this before every job.`,
            `सभी ${TOTAL_HAZARDS} खतरे पहचाने, ${misses} गलत अलार्म। असली इलेक्ट्रीशियन हर काम से पहले ऐसे ही जांचता है।`)}
        </div>
      )}
      <button onClick={reset} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">
        <RotateCcw size={13} /> {L('Reset scene', 'सीन रीसेट करें')}
      </button>
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
