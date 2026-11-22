import { useState } from 'react';
import {
  SimCanvas, SimShell, Slider, Segmented, Readout, useLang, palette, drawGrid, roundRect,
} from './primitives';

/* ============================================================
   MODULE 21 — Rectifier (half / full / bridge)
   ============================================================ */
export function RectifierSim() {
  const L = useLang();
  const [type, setType] = useState<'half' | 'full' | 'bridge'>('bridge');
  const [cap, setCap] = useState(false);
  const Vm = 1;
  const vdc = type === 'half' ? (Vm / Math.PI) : (2 * Vm / Math.PI);
  const ripple = type === 'half' ? 1.21 : 0.48;

  return (
    <SimShell
      title={L('Rectifier — AC to DC', 'रेक्टिफायर — AC से DC')}
      subtitle={L('Diodes let current pass one way. Half-wave uses one diode; full-wave/bridge use the whole cycle. A capacitor smooths the output.',
        'डायोड धारा को एक दिशा में जाने देते हैं। हाफ-वेव एक डायोड; फुल-वेव/ब्रिज पूरा चक्र। कैपेसिटर आउटपुट को चिकना करता है।')}
      controls={<div className="flex flex-wrap items-center gap-3">
        <Segmented value={type} onChange={setType} options={[
          { value: 'half', label: L('Half-wave', 'हाफ-वेव') },
          { value: 'full', label: L('Full-wave', 'फुल-वेव') },
          { value: 'bridge', label: L('Bridge', 'ब्रिज') },
        ]} />
        <button onClick={() => setCap(!cap)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${cap ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-surface-dark-2 text-slate-500'}`}>
          {cap ? '✓ ' : ''}{L('Filter capacitor', 'फिल्टर कैपेसिटर')}
        </button>
      </div>}
    >
      <SimCanvas height={190} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 24);
        const midY = h * 0.55, amp = h * 0.32;
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();
        // input AC (faint)
        ctx.strokeStyle = 'rgba(148,163,184,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath();
        for (let x = 0; x <= w; x++) { const a = (x / w) * Math.PI * 6 - t * 2; const y = midY - Math.sin(a) * amp; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
        // rectified output
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.beginPath();
        let peakHold = 0;
        for (let x = 0; x <= w; x++) {
          const a = (x / w) * Math.PI * 6 - t * 2;
          let s = Math.sin(a);
          let out = type === 'half' ? Math.max(0, s) : Math.abs(s);
          if (cap) { peakHold = Math.max(out, peakHold - 0.012); out = peakHold; }
          const y = midY - out * amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        // DC average line
        ctx.strokeStyle = '#ef4444'; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
        const dcY = midY - (cap ? amp * 0.9 : vdc * amp);
        ctx.beginPath(); ctx.moveTo(0, dcY); ctx.lineTo(w, dcY); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('V_dc', 4, dcY - 3);
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Diodes used', 'प्रयुक्त डायोड')} value={type === 'half' ? 1 : type === 'full' ? 2 : 4} color="#8b5cf6" />
        <Readout label="V_dc" value={`${(cap ? 0.9 : vdc).toFixed(2)}·Vm`} color="#ef4444" sub={type === 'half' ? 'Vm/π' : '2Vm/π'} />
        <Readout label={L('Ripple factor', 'रिपल फैक्टर')} value={cap ? '≈0.05' : ripple.toFixed(2)} color={cap ? '#22c55e' : '#f59e0b'} sub={cap ? L('smoothed', 'चिकना') : L('pulsating', 'स्पंदित')} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 23 — PWM speed control
   ============================================================ */
export function PWMSim() {
  const L = useLang();
  const [duty, setDuty] = useState(50);
  const [supply, setSupply] = useState(24);
  const vavg = supply * duty / 100;

  return (
    <SimShell
      title={L('PWM Speed Control', 'PWM गति नियंत्रण')}
      subtitle={L('Switching DC on and off fast sets the average voltage. Wider ON pulses (higher duty) run the motor faster.',
        'DC को तेजी से ऑन/ऑफ करने से औसत वोल्टेज तय होता है। चौड़ी ON पल्स (अधिक ड्यूटी) मोटर तेज चलाती है।')}
      controls={<div className="grid sm:grid-cols-2 gap-3">
        <Slider label={L('Duty cycle', 'ड्यूटी साइकिल')} value={duty} min={0} max={100} unit=" %" color="#22c55e" onChange={setDuty} />
        <Slider label={L('DC supply', 'DC आपूर्ति')} value={supply} min={6} max={48} unit=" V" color="#ef4444" onChange={setSupply} />
      </div>}
    >
      <SimCanvas height={160} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 24);
        const base = h - 24, top = 20, period = 70; const d = duty / 100;
        // PWM square
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.beginPath();
        const scroll = (t * 60) % period;
        for (let x = 0; x <= w; x++) {
          const ph = ((x + scroll) % period) / period;
          const y = ph < d ? top : base;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        // average line
        const avgY = base - (base - top) * d;
        ctx.strokeStyle = '#ef4444'; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, avgY); ctx.lineTo(w, avgY); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`V_avg ${vavg.toFixed(1)}V`, 4, avgY - 3);
        // spinning motor indicator
        const mx = w - 26, my = 24, spin = t * (0.5 + d * 10);
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 2;
        for (let k = 0; k < 3; k++) { const a = spin + k * (Math.PI * 2 / 3); ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(a) * 10, my + Math.sin(a) * 10); ctx.stroke(); }
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Duty', 'ड्यूटी')} value={duty} unit=" %" color="#22c55e" />
        <Readout label={L('Avg voltage', 'औसत वोल्टेज')} value={vavg.toFixed(1)} unit=" V" color="#ef4444" sub="D × Vdc" />
        <Readout label={L('Motor speed', 'मोटर गति')} value={`${duty}`} unit=" %" color="#8b5cf6" sub={L('of max', 'अधिकतम का')} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 24 — Inverter DC→AC waveform types
   ============================================================ */
export function InverterSim() {
  const L = useLang();
  const [type, setType] = useState<'square' | 'modified' | 'sine'>('sine');
  const quality = { square: 48, modified: 24, sine: 3 }[type];

  return (
    <SimShell
      title={L('Inverter — DC to AC', 'इन्वर्टर — DC से AC')}
      subtitle={L('An inverter builds AC from a DC battery. Pure sine is cleanest; square/modified are cheaper but harsher on motors and electronics.',
        'इन्वर्टर DC बैटरी से AC बनाता है। प्योर साइन सबसे साफ; स्क्वायर/मॉडिफाइड सस्ते पर मोटर/इलेक्ट्रॉनिक्स के लिए कठोर।')}
      controls={<Segmented value={type} onChange={setType} options={[
        { value: 'square', label: L('Square', 'स्क्वायर') },
        { value: 'modified', label: L('Modified', 'मॉडिफाइड') },
        { value: 'sine', label: L('Pure sine', 'प्योर साइन') },
      ]} />}
    >
      <SimCanvas height={170} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 24);
        const midY = h / 2, amp = h / 2 - 20;
        ctx.strokeStyle = p.axis; ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();
        ctx.strokeStyle = type === 'sine' ? '#22c55e' : type === 'modified' ? '#f59e0b' : '#ef4444';
        ctx.lineWidth = 2.5; ctx.beginPath();
        for (let x = 0; x <= w; x++) {
          const a = (x / w) * Math.PI * 4 - t * 2;
          const s = Math.sin(a);
          let y;
          if (type === 'sine') y = s;
          else if (type === 'square') y = s >= 0 ? 1 : -1;
          else { const c = Math.cos(a); y = Math.abs(c) < 0.35 ? 0 : (s >= 0 ? 1 : -1); } // modified: dead zones
          ctx.lineTo(x, midY - y * amp);
        }
        ctx.stroke();
      }} />
      <div className="grid grid-cols-2 gap-2">
        <Readout label={L('Waveform', 'तरंगरूप')} value={type === 'sine' ? L('Pure sine', 'प्योर साइन') : type === 'modified' ? L('Modified', 'मॉडिफाइड') : L('Square', 'स्क्वायर')}
          color={type === 'sine' ? '#22c55e' : type === 'modified' ? '#f59e0b' : '#ef4444'} />
        <Readout label={L('Harmonic distortion', 'हार्मोनिक विकृति')} value={`≈${quality}`} unit=" %" color={quality < 5 ? '#22c55e' : '#f59e0b'} sub={quality < 5 ? L('appliance-safe', 'उपकरण-सुरक्षित') : L('may buzz/heat', 'भिनभिना/गरम हो सकता है')} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 27 — MCB trip curve (B / C / D)
   ============================================================ */
export function MCBTripSim() {
  const L = useLang();
  const [curve, setCurve] = useState<'B' | 'C' | 'D'>('C');
  const [mult, setMult] = useState(6);
  const band = { B: [3, 5], C: [5, 10], D: [10, 20] }[curve];
  const magTrips = mult >= band[0];
  const instant = mult >= band[1];
  const tripTime = instant ? '<0.1 s' : magTrips ? '0.1–5 s' : mult > 1.45 ? '>60 s' : '—';

  return (
    <SimShell
      title={L('MCB Trip Characteristics', 'MCB ट्रिप विशेषताएं')}
      subtitle={L('Type B, C, D differ in how big an overcurrent they tolerate before instant trip. Pick the curve for the load’s inrush.',
        'टाइप B, C, D तुरंत ट्रिप से पहले कितनी अधिक धारा सहन करते हैं, इसमें भिन्न हैं। लोड के इनरश हेतु वक्र चुनें।')}
      controls={<div className="space-y-3">
        <Segmented value={curve} onChange={setCurve} options={[
          { value: 'B', label: L('B (3–5×)', 'B (3–5×)') },
          { value: 'C', label: L('C (5–10×)', 'C (5–10×)') },
          { value: 'D', label: L('D (10–20×)', 'D (10–20×)') },
        ]} />
        <Slider label={L('Current as × rated', 'रेटेड का गुणक')} value={mult} min={1} max={22} step={0.5} unit=" ×In" color="#f59e0b" onChange={setMult} />
      </div>}
    >
      <SimCanvas height={190} running={false} draw={({ ctx, w, h, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 26);
        const m = 30; const pw = w - 2 * m, ph = h - 2 * m;
        const X = (x: number) => m + (Math.log10(x) / Math.log10(25)) * pw;
        const Y = (ty: number) => m + ph - (Math.log10(ty + 0.05) + 1.3) / 3.3 * ph;
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(m, m); ctx.lineTo(m, m + ph); ctx.lineTo(m + pw, m + ph); ctx.stroke();
        // inverse-time thermal curve
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.beginPath();
        for (let x = 1.1; x < band[1]; x += 0.1) { const ty = 80 / (x * x); const px = X(x), py = Y(ty); x === 1.1 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); }
        ctx.stroke();
        // magnetic instantaneous drop at band[1]
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(X(band[1]), Y(0.1)); ctx.lineTo(X(band[1]), m + ph); ctx.stroke();
        // marker line for selected current
        ctx.strokeStyle = '#22c55e'; ctx.setLineDash([4, 3]); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(X(mult), m); ctx.lineTo(X(mult), m + ph); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = p.sub; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
        [1, 3, 5, 10, 20].forEach((v) => ctx.fillText(`${v}×`, X(v), m + ph + 13));
        ctx.save(); ctx.translate(10, m + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(L('trip time', 'ट्रिप समय'), 0, 0); ctx.restore();
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Curve', 'वक्र')} value={`Type ${curve}`} color="#3b82f6" sub={`${band[0]}–${band[1]}× In`} />
        <Readout label={L('At this current', 'इस धारा पर')} value={tripTime} color={instant ? '#ef4444' : magTrips ? '#f59e0b' : '#22c55e'} />
        <Readout label={L('Mode', 'मोड')} value={instant ? L('Magnetic', 'चुंबकीय') : magTrips ? L('Transition', 'संक्रमण') : L('Thermal', 'तापीय')} color="#8b5cf6" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 22 — DOL starter ladder logic (Start/Stop latch)
   ============================================================ */
export function LadderLogicSim() {
  const L = useLang();
  const [running, setRunning] = useState(false);
  const [tripped, setTripped] = useState(false);

  const start = () => { if (!tripped) setRunning(true); };
  const stop = () => setRunning(false);
  const overload = () => { setRunning(false); setTripped(true); };
  const reset = () => setTripped(false);

  return (
    <SimShell
      title={L('DOL Starter — Hold-On Logic', 'DOL स्टार्टर — होल्ड-ऑन लॉजिक')}
      subtitle={L('Press START: the contactor latches through its own auxiliary contact and keeps the motor running. STOP or overload breaks the hold.',
        'START दबाएं: कॉन्टैक्टर अपने सहायक संपर्क से लैच होकर मोटर चालू रखता है। STOP या ओवरलोड होल्ड तोड़ता है।')}
      controls={<div className="flex flex-wrap gap-2">
        <button onClick={start} disabled={tripped} className="px-4 py-2 rounded-lg text-xs font-bold bg-green-500 text-white disabled:opacity-40 active:scale-95 transition">▶ START</button>
        <button onClick={stop} className="px-4 py-2 rounded-lg text-xs font-bold bg-red-500 text-white active:scale-95 transition">■ STOP</button>
        <button onClick={overload} className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 text-white active:scale-95 transition">⚡ {L('Overload', 'ओवरलोड')}</button>
        {tripped && <button onClick={reset} className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-500 text-white active:scale-95 transition">↺ {L('Reset', 'रीसेट')}</button>}
      </div>}
    >
      <SimCanvas height={180} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 26);
        const live = running;
        // two vertical rails
        const lx = 24, rx = w - 24, topY = 24, botY = h - 24;
        ctx.strokeStyle = live ? '#ef4444' : p.axis; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(lx, topY); ctx.lineTo(lx, botY); ctx.moveTo(rx, topY); ctx.lineTo(rx, botY); ctx.stroke();
        // rung Y = topY+30: Stop NC - Start NO (parallel aux) - OL NC - Coil
        const ry = topY + 34;
        const seg = (x1: number, x2: number, on: boolean) => { ctx.strokeStyle = on ? '#ef4444' : p.sub; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x1, ry); ctx.lineTo(x2, ry); ctx.stroke(); };
        seg(lx, w * 0.26, live);
        // Stop NC contact
        ctx.fillStyle = p.text; ctx.font = '8px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(L('STOP', 'STOP'), w * 0.3, ry - 10);
        ctx.strokeStyle = tripped ? p.sub : (live ? '#ef4444' : p.text); ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w * 0.26, ry); ctx.lineTo(w * 0.34, ry - (running ? 0 : 0)); ctx.stroke();
        // Start NO + aux parallel
        ctx.fillText(L('START', 'START'), w * 0.46, ry - 10);
        ctx.strokeStyle = running ? '#ef4444' : p.sub; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w * 0.42, ry); ctx.lineTo(w * 0.5, running ? ry : ry - 6); ctx.lineTo(w * 0.5, ry); ctx.stroke();
        seg(w * 0.34, w * 0.42, live);
        // aux contact (latch) below
        ctx.strokeStyle = running ? '#ef4444' : p.sub; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w * 0.34, ry); ctx.lineTo(w * 0.34, ry + 18); ctx.lineTo(w * 0.42, ry + 18); ctx.lineTo(w * 0.42, ry); ctx.stroke();
        ctx.fillStyle = running ? '#ef4444' : p.sub; ctx.fillText(L('aux (hold)', 'aux (होल्ड)'), w * 0.38, ry + 30);
        // OL contact
        seg(w * 0.5, w * 0.68, live && !tripped);
        ctx.fillStyle = tripped ? '#f59e0b' : p.text; ctx.fillText(L('O/L', 'O/L'), w * 0.6, ry - 10);
        // coil (circle)
        seg(w * 0.68, w * 0.84, live);
        ctx.strokeStyle = live ? '#22c55e' : p.sub; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(w * 0.88, ry, 9, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = live ? '#22c55e' : p.sub; ctx.fillText('M', w * 0.88, ry + 3);
        seg(w * 0.84 + 9, rx, live);
        // motor at bottom
        const my = botY - 18, mx = w / 2;
        ctx.strokeStyle = live ? '#22c55e' : p.axis; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(mx, my, 16, 0, Math.PI * 2); ctx.stroke();
        if (live) { const spin = t * 8; ctx.strokeStyle = '#22c55e'; for (let k = 0; k < 3; k++) { const a = spin + k * (Math.PI * 2 / 3); ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + Math.cos(a) * 12, my + Math.sin(a) * 12); ctx.stroke(); } }
        ctx.fillStyle = live ? '#22c55e' : p.sub; ctx.font = 'bold 10px sans-serif'; ctx.fillText(live ? L('RUNNING', 'चालू') : tripped ? L('TRIPPED', 'ट्रिप') : L('STOPPED', 'बंद'), mx, my + 34 > h - 2 ? h - 3 : my + 34);
      }} />
      <div className={`rounded-lg px-3 py-2 text-sm font-medium ${running ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : tripped ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'bg-slate-100 dark:bg-surface-dark-2 text-slate-500'}`}>
        {running ? L('Motor latched ON — the aux contact bypasses the START button.', 'मोटर लैच ON — aux संपर्क START बटन को बायपास करता है।')
          : tripped ? L('Overload relay tripped — press Reset, then Start.', 'ओवरलोड रिले ट्रिप — रीसेट फिर स्टार्ट दबाएं।')
          : L('Motor off — press START to energize the coil.', 'मोटर बंद — कॉइल एनर्जाइज करने हेतु START दबाएं।')}
      </div>
    </SimShell>
  );
}
