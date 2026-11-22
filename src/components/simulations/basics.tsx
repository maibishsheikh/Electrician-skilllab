import { useState } from 'react';
import {
  SimCanvas, SimShell, Slider, Segmented, Readout, useLang, palette, drawGrid, roundRect,
} from './primitives';

/* ============================================================
   MODULE 1 — Electric Shock & RCCB simulator
   ============================================================ */
export function ShockSim() {
  const L = useLang();
  const [mA, setMa] = useState(15);
  const rccb = mA >= 30;

  const band = (() => {
    if (mA < 1) return { en: 'Not perceptible', hi: 'महसूस नहीं होता', c: '#22c55e' };
    if (mA < 5) return { en: 'Slight perception / tingling', hi: 'हल्की झनझनाहट', c: '#84cc16' };
    if (mA < 10) return { en: 'Painful, muscle control retained', hi: 'दर्दनाक, नियंत्रण बना रहता है', c: '#eab308' };
    if (mA < 16) return { en: 'Let-go threshold exceeded — cannot release', hi: 'लेट-गो सीमा पार — छोड़ नहीं सकते', c: '#f59e0b' };
    if (mA < 30) return { en: 'Severe shock, breathing difficulty', hi: 'गंभीर झटका, सांस लेने में कठिनाई', c: '#f97316' };
    if (mA < 100) return { en: 'Ventricular fibrillation likely', hi: 'वेंट्रिकुलर फिब्रिलेशन संभव', c: '#ef4444' };
    return { en: 'Cardiac arrest, severe burns', hi: 'हृदयाघात, गंभीर जलन', c: '#dc2626' };
  })();

  return (
    <SimShell
      title={L('Electric Shock & RCCB Response', 'बिजली का झटका एवं RCCB प्रतिक्रिया')}
      subtitle={L('Drag the current to see its effect on the body and when a 30 mA RCCB trips.',
        'शरीर पर प्रभाव और 30 mA RCCB कब ट्रिप करता है, देखने के लिए धारा खिसकाएं।')}
      controls={<Slider label={L('Body current', 'शरीर धारा')} value={mA} min={0} max={200} step={1} unit=" mA" color={band.c} onChange={setMa} />}
    >
      <SimCanvas height={200} draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 28);
        const cx = w * 0.3, topY = 24;
        // current flows while > 1mA
        const flowing = mA >= 1;
        const intensity = Math.min(1, mA / 100);
        // body (head + torso + legs)
        ctx.strokeStyle = flowing ? band.c : p.sub;
        ctx.lineWidth = 2 + intensity * 4;
        ctx.fillStyle = flowing ? `${band.c}22` : 'transparent';
        ctx.beginPath(); ctx.arc(cx, topY + 14, 13, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        roundRect(ctx, cx - 16, topY + 28, 32, 64, 10); ctx.fill(); ctx.stroke();
        // arm to live wire (right), leg to earth (down)
        ctx.beginPath();
        ctx.moveTo(cx + 14, topY + 40); ctx.lineTo(w * 0.72, topY + 40); // arm -> live
        ctx.moveTo(cx - 8, topY + 92); ctx.lineTo(cx - 8, h - 14);       // leg -> earth
        ctx.moveTo(cx + 8, topY + 92); ctx.lineTo(cx + 8, h - 14);
        ctx.stroke();
        // live source
        ctx.fillStyle = p.live; roundRect(ctx, w * 0.72, topY + 28, 26, 26, 5); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center';
        ctx.fillText('~', w * 0.72 + 13, topY + 45);
        // earth hatch
        ctx.strokeStyle = p.earth; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(w * 0.1, h - 12); ctx.lineTo(w * 0.5, h - 12); ctx.stroke();
        for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(w * 0.14 + i * 18, h - 12); ctx.lineTo(w * 0.1 + i * 18, h - 4); ctx.stroke(); }
        // animated current particles
        if (flowing) {
          const n = 3 + Math.floor(intensity * 8);
          ctx.fillStyle = band.c;
          for (let i = 0; i < n; i++) {
            const ph = (t * (0.6 + intensity * 2.5) + i / n) % 1;
            // path: live -> arm -> body -> leg -> earth
            let x, y;
            if (ph < 0.45) { const k = ph / 0.45; x = w * 0.72 - k * (w * 0.72 - cx - 14); y = topY + 40; }
            else { const k = (ph - 0.45) / 0.55; x = cx; y = topY + 40 + k * (h - 14 - topY - 40); }
            ctx.beginPath(); ctx.arc(x, y, 2.5 + intensity * 2, 0, Math.PI * 2); ctx.fill();
          }
        }
        // RCCB indicator
        ctx.textAlign = 'left';
        ctx.font = 'bold 11px sans-serif';
        if (rccb) { ctx.fillStyle = '#22c55e'; ctx.fillText(L('⚡ RCCB TRIPPED — circuit cut in <30ms', '⚡ RCCB ट्रिप — सर्किट <30ms में कटा'), 10, 16); }
        else { ctx.fillStyle = p.warn; ctx.fillText(L('RCCB not yet tripping (needs 30 mA)', 'RCCB अभी ट्रिप नहीं (30 mA चाहिए)'), 10, 16); }
      }} />
      <div className="rounded-lg px-3 py-2 text-sm font-medium" style={{ background: `${band.c}1a`, color: band.c }}>
        {mA} mA → {L(band.en, band.hi)}
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 3 — Ohm's Law with live electron flow
   ============================================================ */
export function OhmsLawSim() {
  const L = useLang();
  const [v, setV] = useState(12);
  const [r, setR] = useState(60);
  const i = v / r;              // amps
  const pw = v * i;             // watts
  const bright = Math.min(1, i / 0.5);

  return (
    <SimShell
      title={L("Ohm's Law — Live Circuit", 'ओम का नियम — सजीव सर्किट')}
      subtitle={L('Change voltage and resistance; watch current, power and electron flow respond in real time.',
        'वोल्टेज और प्रतिरोध बदलें; धारा, शक्ति और इलेक्ट्रॉन प्रवाह को वास्तविक समय में देखें।')}
      controls={<div className="grid sm:grid-cols-2 gap-3">
        <Slider label={L('Voltage (V)', 'वोल्टेज (V)')} value={v} min={1} max={48} unit=" V" color="#ef4444" onChange={setV} />
        <Slider label={L('Resistance (R)', 'प्रतिरोध (R)')} value={r} min={5} max={240} step={5} unit=" Ω" color="#8b5cf6" onChange={setR} />
      </div>}
    >
      <SimCanvas height={180} draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        const m = 26, top = 36, bot = h - 28;
        // wire loop
        ctx.strokeStyle = p.axis; ctx.lineWidth = 4; ctx.lineJoin = 'round';
        ctx.strokeRect(m, top, w - 2 * m, bot - top);
        // battery (left side)
        ctx.strokeStyle = p.live; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(m, h / 2 - 16); ctx.lineTo(m, h / 2 - 4);
        ctx.moveTo(m - 7, h / 2 - 4); ctx.lineTo(m + 7, h / 2 - 4);
        ctx.moveTo(m - 4, h / 2 + 4); ctx.lineTo(m + 4, h / 2 + 4);
        ctx.moveTo(m, h / 2 + 4); ctx.lineTo(m, h / 2 + 16); ctx.stroke();
        ctx.fillStyle = p.live; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${v}V`, m + 16, h / 2 + 3);
        // resistor (right, zig-zag)
        const rx = w - m;
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 3; ctx.beginPath();
        let yy = h / 2 - 22; ctx.moveTo(rx, yy);
        for (let k = 0; k < 6; k++) { yy += 7.3; ctx.lineTo(rx + (k % 2 ? 9 : -9), yy); }
        ctx.lineTo(rx, h / 2 + 22); ctx.stroke();
        ctx.fillStyle = '#8b5cf6'; ctx.fillText(`${r}Ω`, rx - 20, h / 2 + 3);
        // lamp (top center) brightness ~ current
        const lx = w / 2;
        const glow = bright;
        ctx.fillStyle = `rgba(250,204,21,${0.15 + glow * 0.8})`;
        ctx.beginPath(); ctx.arc(lx, top, 12 + glow * 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#eab308'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lx, top, 10, 0, Math.PI * 2); ctx.stroke();
        // electrons moving around loop (speed ~ current)
        const speed = 0.15 + i * 1.6;
        const perim = 2 * ((w - 2 * m) + (bot - top));
        const n = 18;
        ctx.fillStyle = p.neutral;
        for (let k = 0; k < n; k++) {
          let d = ((t * speed + k / n) % 1) * perim;
          let x = m, y = top;
          const Wd = w - 2 * m, Hd = bot - top;
          if (d < Wd) { x = m + d; y = top; }
          else if (d < Wd + Hd) { x = w - m; y = top + (d - Wd); }
          else if (d < 2 * Wd + Hd) { x = w - m - (d - Wd - Hd); y = bot; }
          else { x = m; y = bot - (d - 2 * Wd - Hd); }
          ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        }
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Current', 'धारा')} value={i.toFixed(i < 1 ? 3 : 2)} unit=" A" color="#3b82f6" sub="I = V/R" />
        <Readout label={L('Power', 'शक्ति')} value={pw.toFixed(2)} unit=" W" color="#f59e0b" sub="P = V×I" />
        <Readout label={L('Lamp', 'लैंप')} value={`${Math.round(bright * 100)}`} unit=" %" color="#eab308" sub={L('brightness', 'चमक')} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 3/13 — Series vs Parallel resistor network
   ============================================================ */
export function SeriesParallelSim() {
  const L = useLang();
  const [mode, setMode] = useState<'series' | 'parallel'>('series');
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [r3, setR3] = useState(30);
  const v = 12;
  const rs = [r1, r2, r3];
  const rEq = mode === 'series' ? r1 + r2 + r3 : 1 / (1 / r1 + 1 / r2 + 1 / r3);
  const iTotal = v / rEq;

  return (
    <SimShell
      title={L('Series ↔ Parallel Networks', 'श्रेणी ↔ समानांतर नेटवर्क')}
      subtitle={L('Switch the connection and resize each resistor. Equivalent resistance and branch currents update live.',
        'कनेक्शन बदलें और प्रत्येक प्रतिरोधक बदलें। तुल्य प्रतिरोध और धाराएं तुरंत बदलती हैं।')}
      controls={<div className="space-y-3">
        <Segmented value={mode} onChange={setMode} options={[
          { value: 'series', label: L('Series', 'श्रेणी') },
          { value: 'parallel', label: L('Parallel', 'समानांतर') },
        ]} />
        <div className="grid sm:grid-cols-3 gap-3">
          <Slider label="R₁" value={r1} min={5} max={100} step={5} unit=" Ω" color="#ef4444" onChange={setR1} />
          <Slider label="R₂" value={r2} min={5} max={100} step={5} unit=" Ω" color="#3b82f6" onChange={setR2} />
          <Slider label="R₃" value={r3} min={5} max={100} step={5} unit=" Ω" color="#22c55e" onChange={setR3} />
        </div>
      </div>}
    >
      <SimCanvas height={180} draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); const cols = ['#ef4444', '#3b82f6', '#22c55e'];
        drawGrid(ctx, w, h, dark, 26);
        ctx.lineWidth = 3; ctx.strokeStyle = p.axis;
        const flow = (x1: number, y1: number, x2: number, y2: number, amps: number, col: string) => {
          ctx.strokeStyle = p.axis; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          const n = 6; ctx.fillStyle = col; const len = Math.hypot(x2 - x1, y2 - y1);
          for (let k = 0; k < n; k++) { const ph = (t * (0.4 + amps * 1.4) + k / n) % 1; const x = x1 + (x2 - x1) * ph, y = y1 + (y2 - y1) * ph; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill(); }
          void len;
        };
        const resBox = (x: number, y: number, label: string, col: string) => {
          ctx.fillStyle = `${col}22`; ctx.strokeStyle = col; ctx.lineWidth = 2;
          roundRect(ctx, x - 22, y - 11, 44, 22, 5); ctx.fill(); ctx.stroke();
          ctx.fillStyle = col; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.fillText(label, x, y + 3);
        };
        if (mode === 'series') {
          const y = h / 2; const xs = [w * 0.28, w * 0.5, w * 0.72];
          flow(w * 0.06, y, xs[0] - 22, y, iTotal, '#64748b');
          xs.forEach((x, k) => { resBox(x, y, `${rs[k]}Ω`, cols[k]); if (k < 2) flow(x + 22, y, xs[k + 1] - 22, y, iTotal, cols[k]); });
          flow(xs[2] + 22, y, w * 0.94, y, iTotal, cols[2]);
          ctx.strokeStyle = p.axis; ctx.beginPath();
          ctx.moveTo(w * 0.06, y); ctx.lineTo(w * 0.06, h - 16); ctx.lineTo(w * 0.94, h - 16); ctx.lineTo(w * 0.94, y); ctx.stroke();
          ctx.fillStyle = p.live; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${v}V`, w * 0.06, h - 4);
        } else {
          const xL = w * 0.14, xR = w * 0.86; const ys = [h * 0.26, h * 0.5, h * 0.74];
          ctx.strokeStyle = p.axis; ctx.beginPath(); ctx.moveTo(xL, ys[0]); ctx.lineTo(xL, ys[2]); ctx.moveTo(xR, ys[0]); ctx.lineTo(xR, ys[2]); ctx.stroke();
          ys.forEach((y, k) => { flow(xL, y, (xL + xR) / 2 - 22, y, v / rs[k], cols[k]); resBox((xL + xR) / 2, y, `${rs[k]}Ω`, cols[k]); flow((xL + xR) / 2 + 22, y, xR, y, v / rs[k], cols[k]); });
          ctx.fillStyle = p.live; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.fillText(`${v}V`, xL - 2, h * 0.5 - 60 > 10 ? 14 : 14);
        }
      }} />
      <div className="grid grid-cols-2 gap-2">
        <Readout label={L('Equivalent R', 'तुल्य प्रतिरोध')} value={rEq.toFixed(1)} unit=" Ω" color="#8b5cf6"
          sub={mode === 'series' ? 'R₁+R₂+R₃' : '1/(1/R₁+1/R₂+1/R₃)'} />
        <Readout label={L('Total current', 'कुल धारा')} value={iTotal.toFixed(2)} unit=" A" color="#3b82f6" sub={`${v}V ÷ ${rEq.toFixed(1)}Ω`} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 9 — Wheatstone Bridge balance
   ============================================================ */
export function WheatstoneSim() {
  const L = useLang();
  const [r1] = useState(100);
  const [r2] = useState(200);
  const [r3, setR3] = useState(150);
  // Balanced when R1/R2 = R3/Rx -> Rx = R3*R2/R1
  const rx = (r3 * r2) / r1;
  // Galvanometer current proportional to bridge imbalance around a nominal Rx guess
  const nominalRx = 300;
  const imbalance = (rx - nominalRx) / nominalRx; // 0 at balance
  const needle = Math.max(-1, Math.min(1, -imbalance * 2));

  return (
    <SimShell
      title={L('Wheatstone Bridge — Balance It', 'व्हीटस्टोन ब्रिज — संतुलित करें')}
      subtitle={L('Adjust R₃ until the galvanometer reads zero. Then Rx = R₃·R₂/R₁ gives the unknown resistor.',
        'गैल्वेनोमीटर शून्य होने तक R₃ समायोजित करें। तब Rx = R₃·R₂/R₁ अज्ञात प्रतिरोध देता है।')}
      controls={<Slider label="R₃ (variable)" value={r3} min={50} max={300} step={1} unit=" Ω" color="#f59e0b" onChange={setR3} />}
    >
      <SimCanvas height={200} draw={({ ctx, w, h, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        const cx = w / 2, top = 26, bot = h - 26, left = w * 0.22, right = w * 0.78, mid = (top + bot) / 2;
        // diamond bridge
        ctx.strokeStyle = p.axis; ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, top); ctx.lineTo(left, mid); ctx.lineTo(cx, bot); ctx.lineTo(right, mid); ctx.closePath(); ctx.stroke();
        const arm = (x1: number, y1: number, x2: number, y2: number, label: string, col: string) => {
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
          ctx.fillStyle = `${col}22`; ctx.strokeStyle = col; ctx.lineWidth = 2;
          roundRect(ctx, mx - 20, my - 9, 40, 18, 5); ctx.fill(); ctx.stroke();
          ctx.fillStyle = col; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center'; ctx.fillText(label, mx, my + 3);
        };
        arm(cx, top, left, mid, `R₁ ${r1}`, '#ef4444');
        arm(cx, top, right, mid, `R₂ ${r2}`, '#3b82f6');
        arm(left, mid, cx, bot, `R₃ ${r3}`, '#f59e0b');
        arm(right, mid, cx, bot, `Rx?`, '#22c55e');
        // galvanometer in the middle (left-right)
        ctx.strokeStyle = p.sub; ctx.beginPath(); ctx.moveTo(left, mid); ctx.lineTo(right, mid); ctx.stroke();
        const gx = cx, gy = mid;
        ctx.fillStyle = Math.abs(needle) < 0.03 ? '#22c55e' : p.panel;
        ctx.strokeStyle = Math.abs(needle) < 0.03 ? '#22c55e' : p.warn; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(gx, gy, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // needle
        const ang = -Math.PI / 2 + needle * 0.9;
        ctx.strokeStyle = Math.abs(needle) < 0.03 ? '#16a34a' : '#ef4444'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(gx, gy + 4); ctx.lineTo(gx + Math.cos(ang) * 13, gy + 4 + Math.sin(ang) * 13); ctx.stroke();
        ctx.fillStyle = p.text; ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('G', gx, gy - 20);
        // source
        ctx.fillStyle = p.live; ctx.font = 'bold 10px monospace'; ctx.fillText('+', cx, top - 6); ctx.fillText('−', cx, bot + 14);
      }} />
      <div className="grid grid-cols-2 gap-2">
        <Readout label={L('Galvanometer', 'गैल्वेनोमीटर')} value={Math.abs(needle) < 0.03 ? L('BALANCED', 'संतुलित') : L('deflecting', 'विक्षेपण')}
          color={Math.abs(needle) < 0.03 ? '#22c55e' : '#f59e0b'} />
        <Readout label={L('Measured Rx', 'मापित Rx')} value={rx.toFixed(0)} unit=" Ω" color="#22c55e" sub="R₃·R₂/R₁" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 3 (AC) — AC waveform generator
   ============================================================ */
export function ACWaveformSim() {
  const L = useLang();
  const [vp, setVp] = useState(325);   // peak (≈230Vrms)
  const [f, setF] = useState(50);
  const vrms = vp / Math.SQRT2;
  const vavg = (2 * vp) / Math.PI;
  const period = 1000 / f;

  return (
    <SimShell
      title={L('AC Waveform Generator', 'AC तरंग जनरेटर')}
      subtitle={L('Indian mains is 230 V RMS, 50 Hz. See how peak, RMS and average relate on a live sine wave.',
        'भारतीय मेन्स 230 V RMS, 50 Hz है। शिखर, RMS और औसत का संबंध सजीव साइन तरंग पर देखें।')}
      controls={<div className="grid sm:grid-cols-2 gap-3">
        <Slider label={L('Peak voltage', 'शिखर वोल्टेज')} value={vp} min={50} max={400} step={5} unit=" V" color="#ef4444" onChange={setVp} />
        <Slider label={L('Frequency', 'आवृत्ति')} value={f} min={10} max={100} unit=" Hz" color="#8b5cf6" onChange={setF} />
      </div>}
    >
      <SimCanvas height={190} draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 24);
        const midY = h / 2, amp = (h / 2 - 16) * (vp / 400);
        // axes
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();
        // RMS lines
        const rmsY = amp / Math.SQRT2;
        ctx.strokeStyle = 'rgba(34,197,94,0.6)'; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(0, midY - rmsY); ctx.lineTo(w, midY - rmsY); ctx.moveTo(0, midY + rmsY); ctx.lineTo(w, midY + rmsY); ctx.stroke();
        ctx.setLineDash([]);
        // sine (scroll with time, cycles scale with f)
        ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2.5; ctx.beginPath();
        const cycles = f / 25;
        for (let x = 0; x <= w; x++) {
          const ph = (x / w) * cycles * Math.PI * 2 - t * f * 0.12;
          const y = midY - Math.sin(ph) * amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = '#22c55e'; ctx.font = '9px monospace'; ctx.textAlign = 'left';
        ctx.fillText(`Vrms`, 4, midY - rmsY - 3);
        ctx.fillStyle = '#ef4444'; ctx.fillText(`Vpeak`, 4, midY - amp - 3 > 8 ? midY - amp - 3 : 10);
      }} />
      <div className="grid grid-cols-4 gap-2">
        <Readout label="Vpeak" value={vp} unit=" V" color="#ef4444" />
        <Readout label="Vrms" value={vrms.toFixed(0)} unit=" V" color="#22c55e" sub="Vp/√2" />
        <Readout label="Vavg" value={vavg.toFixed(0)} unit=" V" color="#3b82f6" sub="2Vp/π" />
        <Readout label={L('Period', 'आवर्तकाल')} value={period.toFixed(1)} unit=" ms" color="#8b5cf6" sub="1/f" />
      </div>
    </SimShell>
  );
}
