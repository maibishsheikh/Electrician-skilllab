import { useState } from 'react';
import {
  SimCanvas, SimShell, Slider, Segmented, Readout, useLang, palette, drawGrid, roundRect,
} from './primitives';
import { THEMES } from './theme';

/* ============================================================
   MODULE 2 — Cable insulation-resistance (Megger) & continuity
   ============================================================ */
export function CableTestSim() {
  const L = useLang();
  const [condition, setCondition] = useState(10);   // 0 = new … 100 = failed
  const [testV, setTestV] = useState<250 | 500 | 1000>(500);
  // IR falls exponentially as insulation degrades; higher test V slightly lower reading
  const ir = Math.max(0.05, 2000 * Math.exp(-condition / 14) * (500 / testV) ** 0.15);
  const pass = ir >= 1; // IS 732: ≥ 1 MΩ
  const irText = ir >= 1000 ? '>1000' : ir.toFixed(ir < 10 ? 2 : 1);

  return (
    <SimShell
      accent={THEMES.cable.accent} Icon={THEMES.cable.Icon}
      title={L('Insulation Resistance (Megger) Test', 'इन्सुलेशन प्रतिरोध (मेगर) परीक्षण')}
      subtitle={L('A megger forces a high DC voltage through the insulation and reads how many megohms resist leakage. Below 1 MΩ the cable fails.',
        'मेगर इन्सुलेशन में उच्च DC वोल्टेज भेजकर पढ़ता है कितने मेगाओम लीकेज रोकते हैं। 1 MΩ से नीचे केबल फेल।')}
      controls={<div className="space-y-3">
        <Segmented value={testV} onChange={setTestV} options={[
          { value: 250, label: '250 V' }, { value: 500, label: '500 V' }, { value: 1000, label: '1000 V' },
        ]} />
        <Slider label={L('Insulation condition (aged/damp)', 'इन्सुलेशन स्थिति (पुराना/नम)')} value={condition} min={0} max={100} unit=" %" color={THEMES.cable.accent} onChange={setCondition} />
      </div>}
    >
      <SimCanvas height={200} running={false} draw={({ ctx, w, h, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        // analog megohm dial (log scale 0.1 .. 1000 MΩ over 240°)
        const cx = w * 0.5, cy = h * 0.92, R = Math.min(w * 0.42, h * 0.78);
        const a0 = Math.PI * 1.2, a1 = Math.PI * -0.2; // left to right (sweep)
        ctx.strokeStyle = p.axis; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1, true); ctx.stroke();
        const posFor = (v: number) => {
          const t = (Math.log10(v) + 1) / 4; // -1..3 -> 0..1
          return a0 + (a1 - a0) * Math.min(1, Math.max(0, t));
        };
        [0.1, 1, 10, 100, 1000].forEach((v) => {
          const a = posFor(v);
          const x1 = cx + Math.cos(a) * (R - 10), y1 = cy + Math.sin(a) * (R - 10);
          const x2 = cx + Math.cos(a) * R, y2 = cy + Math.sin(a) * R;
          ctx.strokeStyle = v < 1 ? '#ef4444' : p.sub; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.fillStyle = p.text; ctx.font = '9px monospace'; ctx.textAlign = 'center';
          ctx.fillText(v >= 1000 ? '∞' : `${v}`, cx + Math.cos(a) * (R - 22), cy + Math.sin(a) * (R - 22) + 3);
        });
        // 1 MΩ pass threshold arc (red danger zone below)
        ctx.strokeStyle = 'rgba(239,68,68,0.5)'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(cx, cy, R, a0, posFor(1), true); ctx.stroke();
        // needle
        const a = posFor(ir);
        ctx.strokeStyle = pass ? '#16a34a' : '#ef4444'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * (R - 16), cy + Math.sin(a) * (R - 16)); ctx.stroke();
        ctx.fillStyle = p.text; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = p.sub; ctx.font = '9px sans-serif'; ctx.fillText('MΩ', cx, cy - R * 0.5);
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Insulation R', 'इन्सुलेशन R')} value={irText} unit=" MΩ" color={pass ? '#16a34a' : '#ef4444'} />
        <Readout label={L('Continuity', 'कंटिन्युइटी')} value={condition > 95 ? L('OPEN', 'खुला') : L('OK', 'ठीक')} color={condition > 95 ? '#ef4444' : '#16a34a'} sub={L('core intact', 'कोर सही')} />
        <Readout label={L('Verdict', 'निर्णय')} value={pass ? L('PASS', 'पास') : L('FAIL', 'फेल')} color={pass ? '#16a34a' : '#ef4444'} sub={L('limit ≥1 MΩ', 'सीमा ≥1 MΩ')} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 6 — Earth electrode resistance & fall-of-potential
   ============================================================ */
export function EarthResistanceSim() {
  const L = useLang();
  const [rho, setRho] = useState(100);   // soil resistivity Ω·m
  const [len, setLen] = useState(2.5);   // electrode length m
  const [dia, setDia] = useState(40);    // mm
  const d = dia / 1000;
  const R = (rho / (2 * Math.PI * len)) * Math.log((4 * len) / d);
  const ok = R <= 5;
  const grade = R <= 1 ? L('Substation grade', 'सबस्टेशन स्तर') : R <= 5 ? L('Domestic OK', 'घरेलू ठीक') : L('Improve earthing', 'अर्थिंग सुधारें');

  return (
    <SimShell
      accent={THEMES.earth.accent} Icon={THEMES.earth.Icon}
      title={L('Earth Electrode Resistance', 'अर्थ इलेक्ट्रोड प्रतिरोध')}
      subtitle={L('Lower soil resistivity and a longer electrode give a lower earth resistance. Domestic earthing should be ≤ 5 Ω.',
        'कम मृदा प्रतिरोधकता व लंबा इलेक्ट्रोड कम अर्थ प्रतिरोध देते हैं। घरेलू अर्थिंग ≤ 5 Ω होनी चाहिए।')}
      controls={<div className="grid sm:grid-cols-3 gap-3">
        <Slider label={L('Soil resistivity ρ', 'मृदा प्रतिरोधकता ρ')} value={rho} min={10} max={1000} step={10} unit=" Ω·m" color={THEMES.earth.accent} onChange={setRho} />
        <Slider label={L('Electrode length', 'इलेक्ट्रोड लंबाई')} value={len} min={1} max={6} step={0.1} unit=" m" color="#a16207" onChange={setLen} />
        <Slider label={L('Diameter', 'व्यास')} value={dia} min={16} max={100} step={2} unit=" mm" color="#64748b" onChange={setDia} />
      </div>}
    >
      <SimCanvas height={200} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        // sky + soil
        ctx.fillStyle = dark ? '#1e293b' : '#dbeafe'; ctx.fillRect(0, 0, w, h * 0.28);
        ctx.fillStyle = dark ? '#3a2f22' : '#c3a884'; ctx.fillRect(0, h * 0.28, w, h);
        // three test electrodes E - P - C (fall of potential, 62% rule)
        const gy = h * 0.28; const ex = w * 0.18, px = w * 0.56, cx = w * 0.86;
        const spike = (x: number, depth: number, col: string, label: string) => {
          ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x, gy + depth); ctx.stroke();
          ctx.fillStyle = col; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center'; ctx.fillText(label, x, gy - 6);
        };
        // resistance shells around main electrode E
        for (let i = 4; i >= 1; i--) {
          ctx.strokeStyle = `rgba(21,128,61,${0.08 * i})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(ex, gy + len * 14, i * 22, i * 12, 0, 0, Math.PI); ctx.stroke();
        }
        spike(ex, len * 14, THEMES.earth.accent, 'E');
        spike(px, 26, '#f59e0b', 'P');
        spike(cx, 26, '#3b82f6', 'C');
        // distance line with 62% marker
        ctx.strokeStyle = p.sub; ctx.setLineDash([4, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(ex, gy + 60); ctx.lineTo(cx, gy + 60); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = p.sub; ctx.font = '9px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(L('P at 62% of E–C distance', 'P, E–C दूरी के 62% पर'), (ex + cx) / 2, gy + 74);
        // animated current from C to E through soil
        ctx.fillStyle = '#f59e0b';
        for (let k = 0; k < 6; k++) { const ph = ((t * 0.5 + k / 6) % 1); const x = cx + (ex - cx) * ph; const y = gy + 30 + Math.sin(ph * Math.PI) * 24; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill(); }
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Earth resistance', 'अर्थ प्रतिरोध')} value={R.toFixed(2)} unit=" Ω" color={ok ? '#16a34a' : '#ef4444'} sub="ρ/2πL·ln(4L/d)" />
        <Readout label={L('Status', 'स्थिति')} value={grade} color={ok ? '#16a34a' : '#ef4444'} />
        <Readout label={L('Method', 'विधि')} value={L('3-point', '3-पॉइंट')} color="#f59e0b" sub={L('fall of potential', 'फॉल ऑफ पोटेंशियल')} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 8 — Meter range extension (shunt / multiplier)
   ============================================================ */
export function MeterRangeSim() {
  const L = useLang();
  const [mode, setMode] = useState<'ammeter' | 'voltmeter'>('ammeter');
  const Im = 1;      // mA full-scale
  const Rm = 50;     // Ω coil
  const [range, setRange] = useState(10);  // A (ammeter) or V (voltmeter)
  const imA = Im / 1000;
  const shunt = (Rm * imA) / (range - imA);
  const mult = range / imA - Rm;

  return (
    <SimShell
      accent={THEMES.meter.accent} Icon={THEMES.meter.Icon}
      title={L('Extending Meter Range', 'मीटर रेंज विस्तार')}
      subtitle={L('A 1 mA, 50 Ω movement reads tiny currents. A parallel shunt makes an ammeter; a series multiplier makes a voltmeter.',
        '1 mA, 50 Ω मूवमेंट छोटी धारा पढ़ता है। समानांतर शंट एमीटर बनाता है; श्रेणी मल्टीप्लायर वोल्टमीटर।')}
      controls={<div className="space-y-3">
        <Segmented value={mode} onChange={setMode} options={[
          { value: 'ammeter', label: L('Ammeter (shunt)', 'एमीटर (शंट)') },
          { value: 'voltmeter', label: L('Voltmeter (multiplier)', 'वोल्टमीटर (मल्टीप्लायर)') },
        ]} />
        <Slider label={mode === 'ammeter' ? L('Desired range', 'वांछित रेंज') : L('Desired range', 'वांछित रेंज')}
          value={range} min={mode === 'ammeter' ? 1 : 1} max={mode === 'ammeter' ? 50 : 500} step={mode === 'ammeter' ? 1 : 5}
          unit={mode === 'ammeter' ? ' A' : ' V'} color={THEMES.meter.accent} onChange={setRange} />
      </div>}
    >
      <SimCanvas height={170} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 26);
        const cy = h / 2, cx = w / 2;
        // meter movement (circle M)
        ctx.strokeStyle = THEMES.meter.accent; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = THEMES.meter.accent; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('M', cx, cy + 4);
        ctx.fillStyle = p.sub; ctx.font = '8px monospace'; ctx.fillText('1mA 50Ω', cx, cy + 32);
        // leads
        ctx.strokeStyle = p.axis; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(40, cy); ctx.lineTo(cx - 20, cy); ctx.moveTo(cx + 20, cy); ctx.lineTo(w - 40, cy); ctx.stroke();
        if (mode === 'ammeter') {
          // shunt in parallel (arc under)
          ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(cx - 20, cy); ctx.lineTo(cx - 20, cy + 40); ctx.lineTo(cx + 20, cy + 40); ctx.lineTo(cx + 20, cy); ctx.stroke();
          ctx.fillStyle = '#f59e0b'; roundRect(ctx, cx - 16, cy + 32, 32, 16, 3); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 8px monospace'; ctx.fillText('Rsh', cx, cy + 43);
          // most current through shunt
          ctx.fillStyle = '#f59e0b';
          for (let k = 0; k < 7; k++) { const ph = ((t * 0.9 + k / 7) % 1); const x = (cx - 20) + 40 * ph; ctx.beginPath(); ctx.arc(x, cy + 40, 2.5, 0, Math.PI * 2); ctx.fill(); }
        } else {
          // multiplier in series
          ctx.fillStyle = '#8b5cf6'; roundRect(ctx, cx + 30, cy - 8, 40, 16, 3); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = 'bold 8px monospace'; ctx.fillText('Rse', cx + 50, cy + 3);
          ctx.strokeStyle = p.axis; ctx.beginPath(); ctx.moveTo(cx + 20, cy); ctx.lineTo(cx + 30, cy); ctx.moveTo(cx + 70, cy); ctx.lineTo(w - 40, cy); ctx.stroke();
          ctx.fillStyle = '#8b5cf6';
          for (let k = 0; k < 5; k++) { const ph = ((t * 0.5 + k / 5) % 1); const x = 40 + (w - 80) * ph; ctx.beginPath(); ctx.arc(x, cy, 2.5, 0, Math.PI * 2); ctx.fill(); }
        }
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Movement', 'मूवमेंट')} value="1 / 50" unit=" mA/Ω" color={THEMES.meter.accent} />
        {mode === 'ammeter'
          ? <Readout label={L('Shunt needed', 'आवश्यक शंट')} value={shunt.toFixed(4)} unit=" Ω" color="#f59e0b" sub="Rm·Im/(I−Im)" />
          : <Readout label={L('Multiplier needed', 'आवश्यक मल्टीप्लायर')} value={mult.toFixed(0)} unit=" Ω" color="#8b5cf6" sub="V/Im − Rm" />}
        <Readout label={L('New range', 'नई रेंज')} value={range} unit={mode === 'ammeter' ? ' A' : ' V'} color="#16a34a" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 30 — Power triangle & power-factor correction
   ============================================================ */
export function PowerTriangleSim() {
  const L = useLang();
  const [pKw, setPkw] = useState(10);
  const [pf, setPf] = useState(0.7);
  const [capKvar, setCapKvar] = useState(0);
  const phi = Math.acos(pf);
  const qBefore = pKw * Math.tan(phi);
  const qAfter = Math.max(0, qBefore - capKvar);
  const sAfter = Math.sqrt(pKw * pKw + qAfter * qAfter);
  const pfAfter = pKw / sAfter;
  const iReduction = (1 - pf / pfAfter) * 100;

  return (
    <SimShell
      accent={THEMES.calc.accent} Icon={THEMES.calc.Icon}
      title={L('Power Factor & Correction', 'पावर फैक्टर व सुधार')}
      subtitle={L('Real power P stays fixed; a low power factor means a large reactive Q and apparent S. Adding capacitor kVAR shrinks Q and raises the power factor.',
        'वास्तविक शक्ति P स्थिर; कम पावर फैक्टर अर्थात बड़ा प्रतिघाती Q व आभासी S। कैपेसिटर kVAR जोड़ने से Q घटता व पावर फैक्टर बढ़ता है।')}
      controls={<div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Slider label={L('Real power P', 'वास्तविक शक्ति P')} value={pKw} min={1} max={50} unit=" kW" color={THEMES.calc.accent} onChange={setPkw} />
          <Slider label={L('Load power factor', 'लोड पावर फैक्टर')} value={pf} min={0.5} max={0.99} step={0.01} color="#ef4444" onChange={(v) => { setPf(v); setCapKvar(0); }} />
        </div>
        <Slider label={L('Correction capacitor', 'सुधार कैपेसिटर')} value={capKvar} min={0} max={Math.ceil(qBefore)} step={0.5} unit=" kVAR" color="#16a34a" onChange={setCapKvar} />
      </div>}
    >
      <SimCanvas height={200} running={false} draw={({ ctx, w, h, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 26);
        const ox = w * 0.12, oy = h * 0.86; const scale = Math.min((w * 0.76) / Math.max(pKw, 1), (h * 0.7) / Math.max(qBefore, 1));
        // before triangle (faint red)
        ctx.strokeStyle = 'rgba(239,68,68,0.5)'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + pKw * scale, oy); ctx.lineTo(ox + pKw * scale, oy - qBefore * scale); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
        // after triangle (solid green)
        ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + pKw * scale, oy); ctx.lineTo(ox + pKw * scale, oy - qAfter * scale); ctx.closePath(); ctx.stroke();
        // P axis
        ctx.fillStyle = THEMES.calc.accent; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(`P = ${pKw} kW`, ox + pKw * scale / 2, oy + 14);
        ctx.fillStyle = '#16a34a'; ctx.save(); ctx.translate(ox + pKw * scale + 14, oy - qAfter * scale / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(`Q`, 0, 0); ctx.restore();
        ctx.fillStyle = '#ef4444'; ctx.fillText('S', ox + pKw * scale / 2 - 14, oy - qBefore * scale / 2);
      }} />
      <div className="grid grid-cols-4 gap-2">
        <Readout label={L('Apparent S', 'आभासी S')} value={sAfter.toFixed(1)} unit=" kVA" color="#ef4444" />
        <Readout label={L('Reactive Q', 'प्रतिघाती Q')} value={qAfter.toFixed(1)} unit=" kVAR" color="#f59e0b" />
        <Readout label={L('New pf', 'नया pf')} value={pfAfter.toFixed(2)} color="#16a34a" sub={`${pf.toFixed(2)} → ${pfAfter.toFixed(2)}`} />
        <Readout label={L('Current cut', 'धारा कमी')} value={iReduction.toFixed(0)} unit=" %" color="#3b82f6" />
      </div>
    </SimShell>
  );
}
