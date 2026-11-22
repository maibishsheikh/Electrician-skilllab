import { useState } from 'react';
import {
  SimCanvas, SimShell, Slider, Segmented, Readout, Toggle, useLang, palette, drawGrid, roundRect,
} from './primitives';

/* ============================================================
   MODULE 4 — Battery pack builder (series / parallel)
   ============================================================ */
export function BatteryPackSim() {
  const L = useLang();
  const [series, setSeries] = useState(3);
  const [parallel, setParallel] = useState(2);
  const [charging, setCharging] = useState(false);
  const [soc, setSoc] = useState(60);
  const cellV = 3.6, cellAh = 2.5;
  const packV = series * cellV;
  const packAh = parallel * cellAh;
  const energy = packV * packAh;

  return (
    <SimShell
      title={L('Battery Pack Builder', 'बैटरी पैक बिल्डर')}
      subtitle={L('Series cells add voltage; parallel strings add capacity. Build a pack and watch it charge/discharge.',
        'श्रेणी सेल वोल्टेज बढ़ाते हैं; समानांतर स्ट्रिंग क्षमता बढ़ाते हैं। पैक बनाएं और चार्ज/डिस्चार्ज देखें।')}
      controls={<div className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <Slider label={L('Cells in series', 'श्रेणी में सेल')} value={series} min={1} max={6} unit="S" color="#ef4444" onChange={setSeries} />
          <Slider label={L('Strings in parallel', 'समानांतर स्ट्रिंग')} value={parallel} min={1} max={4} unit="P" color="#3b82f6" onChange={setParallel} />
        </div>
        <div className="flex items-center gap-4">
          <Toggle label={charging ? L('Charging', 'चार्जिंग') : L('Discharging', 'डिस्चार्जिंग')} checked={charging} onChange={setCharging} />
          <Slider label={L('State of charge', 'चार्ज स्तर')} value={soc} min={0} max={100} unit="%" color="#22c55e" onChange={setSoc} />
        </div>
      </div>}
    >
      <SimCanvas height={170} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        const gw = 30, gh = 44, gapX = 14, gapY = 12;
        const totalW = series * gw + (series - 1) * gapX;
        const totalH = parallel * gh + (parallel - 1) * gapY;
        const ox = (w - totalW) / 2, oy = (h - totalH) / 2;
        for (let pIdx = 0; pIdx < parallel; pIdx++) {
          for (let sIdx = 0; sIdx < series; sIdx++) {
            const x = ox + sIdx * (gw + gapX), y = oy + pIdx * (gh + gapY);
            ctx.fillStyle = dark ? '#334155' : '#e2e8f0'; roundRect(ctx, x, y, gw, gh, 4); ctx.fill();
            // fill level = soc
            const fillH = (gh - 6) * (soc / 100);
            const grd = ctx.createLinearGradient(0, y, 0, y + gh);
            grd.addColorStop(0, '#22c55e'); grd.addColorStop(1, '#16a34a');
            ctx.fillStyle = grd; roundRect(ctx, x + 3, y + gh - 3 - fillH, gw - 6, fillH, 2); ctx.fill();
            // terminal
            ctx.fillStyle = p.live; roundRect(ctx, x + gw / 2 - 4, y - 3, 8, 4, 1); ctx.fill();
            ctx.strokeStyle = p.axis; ctx.lineWidth = 1; roundRect(ctx, x, y, gw, gh, 4); ctx.stroke();
          }
        }
        // flow arrows between series cells (animated)
        ctx.fillStyle = charging ? '#3b82f6' : '#f59e0b';
        const dir = charging ? -1 : 1;
        for (let k = 0; k < 6; k++) {
          const ph = ((t * 0.8 + k / 6) % 1);
          const x = ox + ph * totalW; const y = oy - 10;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - dir * 6, y - 3); ctx.lineTo(x - dir * 6, y + 3); ctx.closePath(); ctx.fill();
        }
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Pack voltage', 'पैक वोल्टेज')} value={packV.toFixed(1)} unit=" V" color="#ef4444" sub={`${series}×${cellV}V`} />
        <Readout label={L('Capacity', 'क्षमता')} value={packAh.toFixed(1)} unit=" Ah" color="#3b82f6" sub={`${parallel}×${cellAh}Ah`} />
        <Readout label={L('Energy', 'ऊर्जा')} value={energy.toFixed(0)} unit=" Wh" color="#22c55e" sub="V×Ah" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 25 / 4 — Solar cell I–V and P–V curve
   ============================================================ */
export function SolarCurveSim() {
  const L = useLang();
  const [irr, setIrr] = useState(800);   // W/m²
  const [temp, setTemp] = useState(25);  // °C
  const Isc = 8 * (irr / 1000);
  const Voc = 22 - 0.08 * (temp - 25);
  const curve = (v: number) => Math.max(0, Isc * (1 - Math.exp((v - Voc) / (0.055 * Voc))));
  // find MPP
  let mpp = { v: 0, i: 0, p: 0 };
  for (let v = 0; v <= Voc; v += Voc / 200) { const i = curve(v); const pw = v * i; if (pw > mpp.p) mpp = { v, i, p: pw }; }

  return (
    <SimShell
      title={L('Solar Panel I–V / P–V Curve', 'सोलर पैनल I–V / P–V वक्र')}
      subtitle={L('More sunlight lifts current; higher temperature lowers voltage. The knee is the Maximum Power Point.',
        'अधिक धूप धारा बढ़ाती है; अधिक तापमान वोल्टेज घटाता है। घुटना अधिकतम पावर बिंदु है।')}
      controls={<div className="grid sm:grid-cols-2 gap-3">
        <Slider label={L('Irradiance', 'विकिरण')} value={irr} min={100} max={1000} step={50} unit=" W/m²" color="#f59e0b" onChange={setIrr} />
        <Slider label={L('Cell temperature', 'सेल तापमान')} value={temp} min={10} max={70} unit=" °C" color="#ef4444" onChange={setTemp} />
      </div>}
    >
      <SimCanvas height={200} running={false} draw={({ ctx, w, h, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        const m = 30; const plotW = w - 2 * m, plotH = h - 2 * m;
        const X = (v: number) => m + (v / Voc) * plotW;
        const Yi = (i: number) => m + plotH - (i / 9) * plotH;
        const Yp = (pw: number) => m + plotH - (pw / 140) * plotH;
        // axes
        ctx.strokeStyle = p.axis; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(m, m); ctx.lineTo(m, m + plotH); ctx.lineTo(m + plotW, m + plotH); ctx.stroke();
        // I-V curve
        ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5; ctx.beginPath();
        for (let v = 0; v <= Voc; v += Voc / 120) { const x = X(v), y = Yi(curve(v)); v === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
        // P-V curve
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath();
        for (let v = 0; v <= Voc; v += Voc / 120) { const x = X(v), y = Yp(v * curve(v)); v === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke(); ctx.setLineDash([]);
        // MPP marker
        ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(X(mpp.v), Yi(mpp.i), 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(34,197,94,0.5)'; ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(X(mpp.v), Yi(mpp.i)); ctx.lineTo(X(mpp.v), m + plotH); ctx.stroke(); ctx.setLineDash([]);
        // labels
        ctx.fillStyle = '#3b82f6'; ctx.font = '9px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('I–V', m + 6, m + 10);
        ctx.fillStyle = '#f59e0b'; ctx.fillText('P–V', m + 36, m + 10);
        ctx.fillStyle = p.sub; ctx.textAlign = 'right'; ctx.fillText('V →', m + plotW, m + plotH + 14);
      }} />
      <div className="grid grid-cols-4 gap-2">
        <Readout label="Isc" value={Isc.toFixed(1)} unit=" A" color="#3b82f6" />
        <Readout label="Voc" value={Voc.toFixed(1)} unit=" V" color="#ef4444" />
        <Readout label="Pmax" value={mpp.p.toFixed(0)} unit=" W" color="#22c55e" sub={`@${mpp.v.toFixed(1)}V`} />
        <Readout label="MPP I" value={mpp.i.toFixed(1)} unit=" A" color="#f59e0b" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 7 — Illumination & inverse-square law
   ============================================================ */
export function IlluminationSim() {
  const L = useLang();
  const [lumens, setLumens] = useState(1200);
  const [height, setHeight] = useState(2.5);
  const beamHalf = 35 * Math.PI / 180;
  const omega = 2 * Math.PI * (1 - Math.cos(beamHalf)); // sr
  const intensity = lumens / omega;                      // cd
  const lux = intensity / (height * height);             // E = I/d²
  const radius = height * Math.tan(beamHalf);
  const ok = lux >= 300;

  return (
    <SimShell
      title={L('Illumination — Inverse Square Law', 'प्रकाश — व्युत्क्रम वर्ग नियम')}
      subtitle={L('Lux on the floor = luminous intensity ÷ distance². Doubling the height quarters the light.',
        'फर्श पर लक्स = ज्योति तीव्रता ÷ दूरी²। ऊंचाई दोगुनी करने पर प्रकाश चौथाई हो जाता है।')}
      controls={<div className="grid sm:grid-cols-2 gap-3">
        <Slider label={L('Lamp output', 'लैंप आउटपुट')} value={lumens} min={200} max={4000} step={100} unit=" lm" color="#eab308" onChange={setLumens} />
        <Slider label={L('Mounting height', 'माउंटिंग ऊंचाई')} value={height} min={1} max={6} step={0.1} unit=" m" color="#3b82f6" onChange={setHeight} />
      </div>}
    >
      <SimCanvas height={190} running draw={({ ctx, w, h, dark }) => {
        const p = palette(dark);
        drawGrid(ctx, w, h, dark, 26);
        const cx = w / 2, lampY = 22, floorY = h - 20;
        const pxPerM = (floorY - lampY) / 6;
        const lampH = lampY + height * pxPerM;
        // light cone
        const rPx = radius * pxPerM * 1.4;
        const grd = ctx.createLinearGradient(0, lampH, 0, floorY);
        const a = Math.min(0.85, lux / 600);
        grd.addColorStop(0, `rgba(250,204,21,${a})`); grd.addColorStop(1, 'rgba(250,204,21,0.03)');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.moveTo(cx, lampH); ctx.lineTo(cx - rPx, floorY); ctx.lineTo(cx + rPx, floorY); ctx.closePath(); ctx.fill();
        // lamp
        ctx.fillStyle = '#eab308'; ctx.beginPath(); ctx.arc(cx, lampH, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(250,204,21,0.3)'; ctx.beginPath(); ctx.arc(cx, lampH, 14, 0, Math.PI * 2); ctx.fill();
        // height line
        ctx.strokeStyle = p.sub; ctx.setLineDash([3, 3]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx - rPx - 14, lampH); ctx.lineTo(cx - rPx - 14, floorY); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = p.text; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.save();
        ctx.translate(cx - rPx - 20, (lampH + floorY) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(`${height.toFixed(1)} m`, 0, 0); ctx.restore();
        // floor
        ctx.strokeStyle = p.axis; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(10, floorY); ctx.lineTo(w - 10, floorY); ctx.stroke();
        // lux meter patch
        ctx.fillStyle = ok ? '#22c55e' : '#f59e0b'; roundRect(ctx, cx - 26, floorY + 2, 52, 14, 3); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 9px monospace'; ctx.fillText(`${lux.toFixed(0)} lx`, cx, floorY + 12);
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Illuminance', 'प्रदीप्ति')} value={lux.toFixed(0)} unit=" lux" color={ok ? '#22c55e' : '#f59e0b'} sub={ok ? L('✓ good for work', '✓ कार्य हेतु ठीक') : L('too dim (<300)', 'बहुत मंद (<300)')} />
        <Readout label={L('Intensity', 'तीव्रता')} value={intensity.toFixed(0)} unit=" cd" color="#eab308" sub="lm/Ω" />
        <Readout label={L('Lit radius', 'प्रकाशित त्रिज्या')} value={radius.toFixed(1)} unit=" m" color="#3b82f6" />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 10 — Appliance energy & electricity bill
   ============================================================ */
const APPLIANCES = [
  { en: 'LED bulb', hi: 'LED बल्ब', w: 9, icon: '💡' },
  { en: 'Ceiling fan', hi: 'पंखा', w: 75, icon: '🌀' },
  { en: 'Refrigerator', hi: 'फ्रिज', w: 150, icon: '🧊' },
  { en: 'Air conditioner', hi: 'एयर कंडीशनर', w: 1500, icon: '❄️' },
  { en: 'Geyser', hi: 'गीजर', w: 2000, icon: '🚿' },
  { en: 'TV', hi: 'टीवी', w: 100, icon: '📺' },
];
export function EnergyBillSim() {
  const L = useLang();
  const [hours, setHours] = useState<number[]>([6, 10, 24, 4, 1, 5]);
  const [tariff, setTariff] = useState(7);
  const daily = APPLIANCES.reduce((s, a, i) => s + (a.w * hours[i]) / 1000, 0);
  const monthly = daily * 30;
  const bill = monthly * tariff;

  return (
    <SimShell
      title={L('Energy Meter & Bill Estimator', 'ऊर्जा मीटर एवं बिल अनुमानक')}
      subtitle={L('Units (kWh) = Power(kW) × hours. Adjust daily usage and tariff to see the monthly bill.',
        'यूनिट (kWh) = शक्ति(kW) × घंटे। दैनिक उपयोग व टैरिफ बदलकर मासिक बिल देखें।')}
      controls={<Slider label={L('Tariff', 'टैरिफ')} value={tariff} min={3} max={12} step={0.5} unit=" ₹/unit" color="#22c55e" onChange={setTariff} />}
    >
      <div className="space-y-2">
        {APPLIANCES.map((a, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-lg w-6 text-center">{a.icon}</span>
            <span className="text-xs font-medium w-24 flex-shrink-0">{L(a.en, a.hi)}</span>
            <span className="text-[10px] text-slate-400 w-12">{a.w}W</span>
            <input type="range" min={0} max={24} value={hours[i]}
              onChange={(e) => { const nx = [...hours]; nx[i] = parseInt(e.target.value); setHours(nx); }}
              className="flex-1 h-1.5 accent-brand-500" />
            <span className="text-xs font-mono w-14 text-right">{hours[i]}h · {((a.w * hours[i]) / 1000).toFixed(1)}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Per day', 'प्रति दिन')} value={daily.toFixed(1)} unit=" kWh" color="#3b82f6" />
        <Readout label={L('Per month', 'प्रति माह')} value={monthly.toFixed(0)} unit=" units" color="#8b5cf6" />
        <Readout label={L('Monthly bill', 'मासिक बिल')} value={`₹${bill.toFixed(0)}`} color="#22c55e" sub={`@₹${tariff}/unit`} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 26 — Cable voltage-drop calculator
   ============================================================ */
export function VoltageDropSim() {
  const L = useLang();
  const [len, setLen] = useState(40);
  const [area, setArea] = useState(2.5);
  const [current, setCurrent] = useState(16);
  const rho = 0.0172;                      // copper Ω·mm²/m
  const R = (2 * rho * len) / area;        // go+return
  const drop = current * R;
  const pct = (drop / 230) * 100;
  const ok = pct <= 3;

  return (
    <SimShell
      title={L('Cable Voltage Drop', 'केबल वोल्टेज ड्रॉप')}
      subtitle={L('Long thin cables lose voltage. IS code limit is ~3%. Size the conductor so the load still gets its volts.',
        'लंबी पतली केबल वोल्टेज खोती है। IS कोड सीमा ~3% है। चालक इतना बड़ा चुनें कि लोड को वोल्टेज मिले।')}
      controls={<div className="grid sm:grid-cols-3 gap-3">
        <Slider label={L('Length', 'लंबाई')} value={len} min={5} max={120} step={5} unit=" m" color="#3b82f6" onChange={setLen} />
        <Slider label={L('Conductor', 'चालक')} value={area} min={1} max={16} step={0.5} unit=" mm²" color="#8b5cf6" onChange={setArea} />
        <Slider label={L('Load current', 'लोड धारा')} value={current} min={1} max={63} unit=" A" color="#f59e0b" onChange={setCurrent} />
      </div>}
    >
      <SimCanvas height={120} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 24);
        const y = h / 2; const x0 = 40, x1 = w - 46;
        // cable thickness ~ area
        ctx.strokeStyle = ok ? '#22c55e' : '#ef4444'; ctx.lineWidth = Math.max(3, area); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
        // source & load
        ctx.fillStyle = p.live; roundRect(ctx, 8, y - 18, 30, 36, 5); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.fillText('230V', 23, y + 3);
        ctx.fillStyle = ok ? '#22c55e' : '#f59e0b'; roundRect(ctx, w - 42, y - 18, 34, 36, 5); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillText(`${(230 - drop).toFixed(0)}V`, w - 25, y + 3);
        // electrons
        ctx.fillStyle = '#fde047';
        for (let k = 0; k < 8; k++) { const ph = ((t * (0.4 + current / 40) + k / 8) % 1); const x = x0 + (x1 - x0) * ph; ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill(); }
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Cable resistance', 'केबल प्रतिरोध')} value={R.toFixed(3)} unit=" Ω" color="#8b5cf6" sub="2ρL/A" />
        <Readout label={L('Voltage drop', 'वोल्टेज ड्रॉप')} value={drop.toFixed(1)} unit=" V" color="#f59e0b" />
        <Readout label={L('Drop %', 'ड्रॉप %')} value={pct.toFixed(1)} unit=" %" color={ok ? '#22c55e' : '#ef4444'} sub={ok ? L('✓ within limit', '✓ सीमा में') : L('✗ exceeds 3%', '✗ 3% से अधिक')} />
      </div>
    </SimShell>
  );
}

/* ============================================================
   MODULE 28 — EV charging time & SoC
   ============================================================ */
export function EVChargingSim() {
  const L = useLang();
  const [batt, setBatt] = useState(40);
  const [mode, setMode] = useState<'ac3' | 'ac7' | 'dc25' | 'dc50'>('ac7');
  const [start, setStart] = useState(20);
  const kw = { ac3: 3.3, ac7: 7.4, dc25: 25, dc50: 50 }[mode];
  const target = 80;
  const energy = batt * (target - start) / 100;
  const hours = energy / kw;

  return (
    <SimShell
      title={L('EV Charging Time', 'EV चार्जिंग समय')}
      subtitle={L('Charge time = energy needed ÷ charger power. DC fast chargers fill 20→80% far quicker than AC.',
        'चार्ज समय = आवश्यक ऊर्जा ÷ चार्जर शक्ति। DC फास्ट चार्जर 20→80% AC से बहुत तेज भरते हैं।')}
      controls={<div className="space-y-3">
        <Segmented value={mode} onChange={setMode} options={[
          { value: 'ac3', label: 'AC 3.3kW' }, { value: 'ac7', label: 'AC 7.4kW' },
          { value: 'dc25', label: 'DC 25kW' }, { value: 'dc50', label: 'DC 50kW' },
        ]} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Slider label={L('Battery size', 'बैटरी आकार')} value={batt} min={10} max={100} step={5} unit=" kWh" color="#8b5cf6" onChange={setBatt} />
          <Slider label={L('Start SoC', 'प्रारंभिक SoC')} value={start} min={0} max={70} step={5} unit=" %" color="#f59e0b" onChange={setStart} />
        </div>
      </div>}
    >
      <SimCanvas height={120} running draw={({ ctx, w, h, t, dark }) => {
        const p = palette(dark); drawGrid(ctx, w, h, dark, 24);
        // battery outline
        const bx = 30, by = 30, bw = w - 90, bh = h - 60;
        ctx.strokeStyle = p.axis; ctx.lineWidth = 3; roundRect(ctx, bx, by, bw, bh, 8); ctx.stroke();
        ctx.fillStyle = p.axis; roundRect(ctx, bx + bw, by + bh / 2 - 8, 8, 16, 2); ctx.fill();
        // animated charge sweeping from start to target
        const sweep = start + (target - start) * (0.5 + 0.5 * Math.sin(t * 1.2));
        const fillW = (bw - 8) * (sweep / 100);
        const grd = ctx.createLinearGradient(bx, 0, bx + bw, 0);
        grd.addColorStop(0, '#22c55e'); grd.addColorStop(1, '#4ade80');
        ctx.fillStyle = grd; roundRect(ctx, bx + 4, by + 4, Math.max(0, fillW), bh - 8, 5); ctx.fill();
        // target marker
        ctx.strokeStyle = '#ef4444'; ctx.setLineDash([4, 3]); ctx.beginPath();
        ctx.moveTo(bx + 4 + (bw - 8) * (target / 100), by); ctx.lineTo(bx + 4 + (bw - 8) * (target / 100), by + bh); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = p.text; ctx.font = 'bold 13px monospace'; ctx.textAlign = 'center';
        ctx.fillText(`${sweep.toFixed(0)}%`, bx + bw / 2, by + bh / 2 + 4);
        ctx.fillStyle = mode.startsWith('dc') ? '#ef4444' : '#3b82f6'; ctx.font = '9px sans-serif';
        ctx.fillText(mode.startsWith('dc') ? L('DC fast', 'DC फास्ट') : L('AC slow', 'AC धीमा'), bx + bw / 2, by - 6);
      }} />
      <div className="grid grid-cols-3 gap-2">
        <Readout label={L('Charger', 'चार्जर')} value={kw} unit=" kW" color={mode.startsWith('dc') ? '#ef4444' : '#3b82f6'} />
        <Readout label={L('Energy 20→80', 'ऊर्जा 20→80')} value={energy.toFixed(1)} unit=" kWh" color="#8b5cf6" />
        <Readout label={L('Charge time', 'चार्ज समय')} value={hours < 1 ? `${(hours * 60).toFixed(0)} min` : `${hours.toFixed(1)} h`} color="#22c55e" />
      </div>
    </SimShell>
  );
}
