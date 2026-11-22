import { useState } from 'react';
import {
  SimCanvas, SimShell, Slider, Segmented, Readout, useLang, palette, drawGrid, roundRect,
} from './primitives';

/* ============================================================
   MODULE 11 — Transformer turns-ratio with flux
   ============================================================ */
export function TransformerSim() {
  const L = useLang();
  const [n1, setN1] = useState(400);
  const [n2, setN2] = useState(100);
  const [v1, setV1] = useState(230);
  const ratio = n1 / n2;
  const v2 = v1 / ratio;
  const type = ratio > 1 ? L('Step-down', 'स्टेप-डाउन') : ratio < 1 ? L('Step-up', 'स्टेप-अप') : L('Isolation', 'आइसोलेशन');

  return (
    <SimShell
      title={L('Transformer Turns Ratio', 'ट्रांसफॉर्मर टर्न अनुपात')}
      subtitle={L('V₁/V₂ = N₁/N₂. Flux in the core links both windings — change the turns and watch the output volts.',
        'V₁/V₂ = N₁/N₂। कोर में फ्लक्स दोनों वाइंडिंग को जोड़ता है — टर्न बदलें और आउटपुट वोल्ट देखें।')}
      controls={<div className="grid sm:grid-cols-3 gap-3">
        <Slider label={L('Primary V₁', 'प्राथमिक V₁')} value={v1} min={110} max={440} step={10} unit=" V" color="#ef4444" onChange={setV1} />
        <Slider label="N₁" value={n1} min={50} max={600} step={10} color="#ef4444" onChange={setN1} />
        <Slider label="N₂" value={n2} min={50} max={600} step={10} color="#3b82f6" onChange={setN2} />
      </div>}
    >
      <SimCanvas height={200} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        const cx = w / 2, cy = h / 2;
        // laminated core (two limbs + yokes)
        ctx.fillStyle = dark ? '#475569' : '#94a3b8';
        const coreX = cx - 50, coreY = cy - 60, coreW = 100, coreH = 120, bar = 18;
        roundRect(ctx, coreX, coreY, coreW, coreH, 4); ctx.fill();
        ctx.fillStyle = dark ? '#1e293b' : '#f1f5f9';
        roundRect(ctx, coreX + bar, coreY + bar, coreW - 2 * bar, coreH - 2 * bar, 2); ctx.fill();
        // primary coil turns (left limb) count ~ n1
        const drawCoil = (x: number, col: string, turns: number) => {
          ctx.strokeStyle = col; ctx.lineWidth = 2.5;
          const nViz = Math.round(4 + (turns / 600) * 8);
          const span = coreH - 2 * bar - 8;
          for (let k = 0; k < nViz; k++) {
            const yy = coreY + bar + 6 + (k / nViz) * span;
            ctx.beginPath(); ctx.arc(x, yy, 9, -Math.PI / 2, Math.PI * 1.5); ctx.stroke();
          }
        };
        drawCoil(coreX + bar / 2, '#ef4444', n1);
        drawCoil(coreX + coreW - bar / 2, '#3b82f6', n2);
        // flux arrows circulating in core
        ctx.fillStyle = '#f59e0b';
        const path = [
          [cx, coreY + bar / 2], [coreX + coreW - bar / 2, cy], [cx, coreY + coreH - bar / 2], [coreX + bar / 2, cy],
        ];
        for (let k = 0; k < 4; k++) {
          const ph = ((t * 0.6 + k / 4) % 1) * 4; const seg = Math.floor(ph); const f = ph - seg;
          const a = path[seg % 4], b = path[(seg + 1) % 4];
          const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
          ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#f59e0b'; ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Φ', cx, cy + 3);
        // labels
        ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${v1}V`, coreX - 22, cy - 6); ctx.fillText(`N₁=${n1}`, coreX - 22, cy + 8);
        ctx.fillStyle = '#3b82f6'; ctx.fillText(`${v2.toFixed(0)}V`, coreX + coreW + 24, cy - 6); ctx.fillText(`N₂=${n2}`, coreX + coreW + 24, cy + 8);
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Turns ratio', 'टर्न अनुपात')} value={ratio.toFixed(2)} unit=":1" color="#8b5cf6" />
        <Readout label={L('Output V₂', 'आउटपुट V₂')} value={v2.toFixed(0)} unit=" V" color="#3b82f6" />
        <Readout label={L('Type', 'प्रकार')} value={type} color="#f59e0b" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 18 — Three-phase waveforms + phasors
   ============================================================ */
export function ThreePhaseSim() {
  const L = useLang();
  const [vph, setVph] = useState(230);
  const vLine = vph * Math.SQRT2 * 0 + vph * 1.732; // √3 Vph
  return (
    <SimShell
      title={L('Three-Phase Supply', 'तीन-फेज आपूर्ति')}
      subtitle={L('R, Y, B are 120° apart. In star, line voltage = √3 × phase voltage. Watch the phasors rotate.',
        'R, Y, B 120° अलग हैं। स्टार में लाइन वोल्टेज = √3 × फेज वोल्टेज। फेजर घूमते देखें।')}
      controls={<Slider label={L('Phase voltage', 'फेज वोल्टेज')} value={vph} min={110} max={300} step={5} unit=" V" color="#ef4444" onChange={setVph} />}
    >
      <SimCanvas height={200} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 24);
        const cols = ['#ef4444', '#eab308', '#3b82f6'];
        const midY = h / 2, amp = h / 2 - 20, waveW = w * 0.6;
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(waveW, midY); ctx.stroke();
        for (let ph = 0; ph < 3; ph++) {
          ctx.strokeStyle = cols[ph]; ctx.lineWidth = 2; ctx.beginPath();
          for (let x = 0; x <= waveW; x++) {
            const a = (x / waveW) * Math.PI * 4 - t * 2 - ph * (Math.PI * 2 / 3);
            const y = midY - Math.sin(a) * amp;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        // phasor wheel on right
        const px = w * 0.82, py = midY, pr = Math.min(h / 2 - 14, w * 0.14);
        ctx.strokeStyle = p.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.stroke();
        for (let ph = 0; ph < 3; ph++) {
          const a = -t * 2 - ph * (Math.PI * 2 / 3);
          ctx.strokeStyle = cols[ph]; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(a) * pr, py + Math.sin(a) * pr); ctx.stroke();
          ctx.fillStyle = cols[ph]; ctx.beginPath(); ctx.arc(px + Math.cos(a) * pr, py + Math.sin(a) * pr, 3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = p.sub; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('R  Y  B', px, py + pr + 14);
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Phase V', 'फेज V')} value={vph} unit=" V" color="#ef4444" />
        <Readout label={L('Line V (star)', 'लाइन V (स्टार)')} value={vLine.toFixed(0)} unit=" V" color="#3b82f6" sub="√3 × Vph" />
        <Readout label={L('Phase shift', 'फेज शिफ्ट')} value="120" unit="°" color="#eab308" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 16 — Rotating magnetic field + rotor slip
   ============================================================ */
export function RMFSim() {
  const L = useLang();
  const [poles, setPoles] = useState(4);
  const [slip, setSlip] = useState(4);
  const f = 50;
  const ns = (120 * f) / poles;
  const nr = ns * (1 - slip / 100);

  return (
    <SimShell
      title={L('Rotating Magnetic Field (Induction Motor)', 'घूर्णन चुंबकीय क्षेत्र (प्रेरण मोटर)')}
      subtitle={L('Three stator currents create a field that spins at synchronous speed. The rotor chases it, always a little behind (slip).',
        'तीन स्टेटर धाराएं एक क्षेत्र बनाती हैं जो तुल्यकाली गति से घूमता है। रोटर उसका पीछा करता है, हमेशा थोड़ा पीछे (स्लिप)।')}
      controls={<div className="grid sm:grid-cols-2 gap-3">
        <Slider label={L('Poles', 'ध्रुव')} value={poles} min={2} max={8} step={2} color="#8b5cf6" onChange={setPoles} />
        <Slider label={L('Slip', 'स्लिप')} value={slip} min={0} max={10} step={0.5} unit=" %" color="#f59e0b" onChange={setSlip} />
      </div>}
    >
      <SimCanvas height={210} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 14;
        // stator ring
        ctx.strokeStyle = p.axis; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
        // 3 phase coils at 120°, color-coded, intensity pulsing
        const cols = ['#ef4444', '#eab308', '#3b82f6'];
        for (let ph = 0; ph < 3; ph++) {
          const a = -Math.PI / 2 + ph * (Math.PI * 2 / 3);
          const cur = Math.sin(t * 2 - ph * (Math.PI * 2 / 3));
          ctx.fillStyle = cols[ph]; ctx.globalAlpha = 0.3 + 0.7 * Math.abs(cur);
          ctx.beginPath(); ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 9, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
        }
        // resultant rotating field vector (synchronous)
        const fieldAng = t * 2 - Math.PI / 2;
        ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(fieldAng) * R * 0.8, cy + Math.sin(fieldAng) * R * 0.8); ctx.stroke();
        ctx.fillStyle = '#22c55e'; ctx.beginPath();
        ctx.arc(cx + Math.cos(fieldAng) * R * 0.8, cy + Math.sin(fieldAng) * R * 0.8, 4, 0, Math.PI * 2); ctx.fill();
        // rotor bar lagging by slip
        const rotorAng = t * 2 * (1 - slip / 100) - Math.PI / 2;
        ctx.strokeStyle = dark ? '#cbd5e1' : '#334155'; ctx.lineWidth = 10; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - Math.cos(rotorAng) * R * 0.45, cy - Math.sin(rotorAng) * R * 0.45);
        ctx.lineTo(cx + Math.cos(rotorAng) * R * 0.45, cy + Math.sin(rotorAng) * R * 0.45); ctx.stroke();
        ctx.fillStyle = p.panel; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = p.axis; ctx.lineWidth = 2; ctx.stroke();
        // legend
        ctx.fillStyle = '#22c55e'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(L('● field (Ns)', '● क्षेत्र (Ns)'), 8, 14);
        ctx.fillStyle = dark ? '#cbd5e1' : '#334155'; ctx.fillText(L('▬ rotor (Nr)', '▬ रोटर (Nr)'), 8, 26);
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Sync speed Ns', 'तुल्य गति Ns')} value={ns.toFixed(0)} unit=" rpm" color="#22c55e" sub="120f/P" />
        <Readout label={L('Rotor speed Nr', 'रोटर गति Nr')} value={nr.toFixed(0)} unit=" rpm" color="#64748b" sub="Ns(1−s)" />
        <Readout label={L('Slip', 'स्लिप')} value={slip} unit=" %" color="#f59e0b" sub="(Ns−Nr)/Ns" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 14/15 — DC motor (back-EMF, torque, speed)
   ============================================================ */
export function DCMotorSim() {
  const L = useLang();
  const [v, setV] = useState(220);
  const [load, setLoad] = useState(30);     // % load torque
  const ra = 1.2;
  // crude model: Ia rises with load; Eb = V - Ia*Ra; speed ∝ Eb
  const ia = 2 + (load / 100) * 18;
  const eb = Math.max(0, v - ia * ra);
  const rpm = (eb / 220) * 1500;
  const torque = ia * 1.2; // N·m-ish

  return (
    <SimShell
      title={L('DC Motor — Back-EMF & Speed', 'DC मोटर — बैक-EMF एवं गति')}
      subtitle={L('As load rises, armature current climbs, back-EMF drops and the motor slows. V = Eb + Ia·Ra.',
        'लोड बढ़ने पर आर्मेचर धारा बढ़ती है, बैक-EMF घटती है और मोटर धीमी होती है। V = Eb + Ia·Ra।')}
      controls={<div className="grid sm:grid-cols-2 gap-3">
        <Slider label={L('Supply voltage', 'आपूर्ति वोल्टेज')} value={v} min={100} max={250} step={5} unit=" V" color="#ef4444" onChange={setV} />
        <Slider label={L('Mechanical load', 'यांत्रिक लोड')} value={load} min={0} max={100} unit=" %" color="#f59e0b" onChange={setLoad} />
      </div>}
    >
      <SimCanvas height={200} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 18;
        // field poles N (top) S (bottom)
        ctx.fillStyle = '#ef444455'; roundRect(ctx, cx - 26, cy - R - 2, 52, 18, 4); ctx.fill();
        ctx.fillStyle = '#3b82f655'; roundRect(ctx, cx - 26, cy + R - 16, 52, 18, 4); ctx.fill();
        ctx.fillStyle = p.text; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('N', cx, cy - R + 11); ctx.fillText('S', cx, cy + R - 3);
        // rotating armature coil
        const spin = rpm / 1500;
        const ang = t * (1 + spin * 6);
        ctx.strokeStyle = '#8b5cf6'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        for (let k = 0; k < 2; k++) {
          const a = ang + k * Math.PI;
          ctx.beginPath();
          ctx.ellipse(cx, cy, R * 0.55, R * 0.2, a, 0, Math.PI * 2);
          ctx.stroke();
        }
        // commutator hub
        ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
        // speed text
        ctx.fillStyle = p.text; ctx.font = 'bold 10px monospace'; ctx.fillText(`${rpm.toFixed(0)} rpm`, cx, cy + R + 14 > h - 2 ? h - 4 : cy + R + 14);
      }} />
      <div className="grid grid-cols-4 gap-2">
        <Readout label="Ia" value={ia.toFixed(1)} unit=" A" color="#f59e0b" />
        <Readout label="Eb" value={eb.toFixed(0)} unit=" V" color="#3b82f6" sub="V−IaRa" />
        <Readout label={L('Speed', 'गति')} value={rpm.toFixed(0)} unit=" rpm" color="#8b5cf6" />
        <Readout label={L('Torque', 'बलाघूर्ण')} value={torque.toFixed(1)} unit=" Nm" color="#22c55e" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 18 — Alternator frequency f = PN/120
   ============================================================ */
export function AlternatorSim() {
  const L = useLang();
  const [poles, setPoles] = useState(4);
  const [rpm, setRpm] = useState(1500);
  const f = (poles * rpm) / 120;
  const ok = Math.abs(f - 50) < 0.5;
  return (
    <SimShell
      title={L('Alternator Frequency', 'अल्टरनेटर आवृत्ति')}
      subtitle={L('Grid frequency must be 50 Hz. Match poles and speed so that f = P·N/120 = 50.',
        'ग्रिड आवृत्ति 50 Hz होनी चाहिए। ध्रुव व गति ऐसे मिलाएं कि f = P·N/120 = 50।')}
      controls={<div className="grid sm:grid-cols-2 gap-3">
        <Slider label={L('Poles', 'ध्रुव')} value={poles} min={2} max={12} step={2} color="#8b5cf6" onChange={setPoles} />
        <Slider label={L('Prime-mover speed', 'प्राइम-मूवर गति')} value={rpm} min={300} max={3600} step={50} unit=" rpm" color="#3b82f6" onChange={setRpm} />
      </div>}
    >
      <SimCanvas height={150} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 24);
        const midY = h / 2, amp = h / 2 - 20;
        ctx.strokeStyle = p.axis; ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();
        ctx.strokeStyle = ok ? '#22c55e' : '#f59e0b'; ctx.lineWidth = 2.5; ctx.beginPath();
        for (let x = 0; x <= w; x++) { const a = (x / w) * (f / 50) * Math.PI * 4 - t * f * 0.1; const y = midY - Math.sin(a) * amp; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
        ctx.fillStyle = ok ? '#22c55e' : '#f59e0b'; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${f.toFixed(1)} Hz`, w / 2, 18);
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Frequency', 'आवृत्ति')} value={f.toFixed(1)} unit=" Hz" color={ok ? '#22c55e' : '#f59e0b'} sub="P·N/120" />
        <Readout label={L('Target', 'लक्ष्य')} value="50" unit=" Hz" color="#3b82f6" />
        <Readout label={L('Status', 'स्थिति')} value={ok ? L('✓ synced', '✓ सिंक') : L('adjust', 'समायोजित करें')} color={ok ? '#22c55e' : '#f59e0b'} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 17 — Star vs Delta line/phase relationships
   ============================================================ */
export function StarDeltaSim() {
  const L = useLang();
  const [conn, setConn] = useState<'star' | 'delta'>('star');
  const [vph, setVph] = useState(230);
  const [iph, setIph] = useState(10);
  const vLine = conn === 'star' ? vph * 1.732 : vph;
  const iLine = conn === 'star' ? iph : iph * 1.732;
  const power = 1.732 * vLine * iLine * 0.8 / 1000;

  return (
    <SimShell
      title={L('Star ↔ Delta Connection', 'स्टार ↔ डेल्टा कनेक्शन')}
      subtitle={L('Star: V_line = √3·V_phase, I_line = I_phase. Delta: V_line = V_phase, I_line = √3·I_phase. This is why star-delta starters cut starting current to ⅓.',
        'स्टार: V_लाइन = √3·V_फेज। डेल्टा: I_लाइन = √3·I_फेज। इसीलिए स्टार-डेल्टा स्टार्टर प्रारंभिक धारा ⅓ कर देता है।')}
      controls={<div className="space-y-3">
        <Segmented value={conn} onChange={setConn} options={[
          { value: 'star', label: L('Star (Y)', 'स्टार (Y)') }, { value: 'delta', label: L('Delta (Δ)', 'डेल्टा (Δ)') },
        ]} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Slider label={L('Phase voltage', 'फेज वोल्टेज')} value={vph} min={110} max={300} step={5} unit=" V" color="#ef4444" onChange={setVph} />
          <Slider label={L('Phase current', 'फेज धारा')} value={iph} min={1} max={40} unit=" A" color="#3b82f6" onChange={setIph} />
        </div>
      </div>}
    >
      <SimCanvas height={190} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 26);
        const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 24;
        const cols = ['#ef4444', '#eab308', '#3b82f6'];
        const pts = [0, 1, 2].map((k) => { const a = -Math.PI / 2 + k * (Math.PI * 2 / 3); return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; });
        if (conn === 'star') {
          pts.forEach((pt, k) => { ctx.strokeStyle = cols[k]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(pt[0], pt[1]); ctx.stroke(); });
          ctx.fillStyle = p.text; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
          ctx.font = '9px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('N', cx + 10, cy + 12);
        } else {
          for (let k = 0; k < 3; k++) { ctx.strokeStyle = cols[k]; ctx.lineWidth = 3; const a = pts[k], b = pts[(k + 1) % 3]; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
        }
        // line terminals + current particles
        pts.forEach((pt, k) => {
          ctx.fillStyle = cols[k]; ctx.beginPath(); ctx.arc(pt[0], pt[1], 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fde047';
          for (let j = 0; j < 3; j++) { const ph = ((t * (0.5 + iLine / 40) + j / 3) % 1); const x = pt[0] + (cx - pt[0]) * (1 - ph) * (conn === 'star' ? 1 : 0); void x; }
          const lab = ['R', 'Y', 'B'][k];
          ctx.fillStyle = cols[k]; ctx.font = 'bold 10px sans-serif'; ctx.fillText(lab, pt[0] + (pt[0] > cx ? 14 : pt[0] < cx ? -14 : 0), pt[1] + (pt[1] < cy ? -10 : 14));
        });
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Line voltage', 'लाइन वोल्टेज')} value={vLine.toFixed(0)} unit=" V" color="#ef4444" sub={conn === 'star' ? '√3·Vph' : 'Vph'} />
        <Readout label={L('Line current', 'लाइन धारा')} value={iLine.toFixed(1)} unit=" A" color="#3b82f6" sub={conn === 'star' ? 'Iph' : '√3·Iph'} />
        <Readout label={L('Power (0.8 pf)', 'शक्ति (0.8 pf)')} value={power.toFixed(1)} unit=" kW" color="#22c55e" sub="√3·VL·IL·cosφ" />
      </div>
    </SimShell>
  );
}
