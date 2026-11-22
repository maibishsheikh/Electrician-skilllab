import {
  ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceDot, ReferenceLine, ReferenceArea,
} from 'recharts';
import { useDarkMode } from './primitives';

/* ============================================================
   Professional chart primitives (Recharts) shared by every
   graph-based simulation and lab — crisp axes, gridlines,
   tooltips, legends and gradient fills in one consistent system.
   ============================================================ */

export interface Series {
  key: string;
  name: string;
  color: string;
  dashed?: boolean;
  area?: boolean;
  width?: number;
  right?: boolean; // plot against the secondary (right) Y axis
}
export interface RefLine { axis: 'x' | 'y'; value: number; color?: string; label?: string; dashed?: boolean }
export interface RefDot { x: number; y: number; color?: string; label?: string }

export function ProLineChart({
  data, series, xKey = 'x', xLabel, yLabel, height = 230,
  xUnit = '', yUnit = '', xDomain, yDomain, refLines = [], refDots = [],
  refArea, legend = true, decimals = 0, yLabelRight, yUnitRight = '',
  xScale = 'linear', yScale = 'linear', xTicks, yTicks,
}: {
  data: Record<string, number>[];
  series: Series[];
  xKey?: string;
  xLabel?: string; yLabel?: string;
  height?: number; xUnit?: string; yUnit?: string;
  xDomain?: [number | 'auto' | 'dataMin' | 'dataMax', number | 'auto' | 'dataMin' | 'dataMax'];
  yDomain?: [number | 'auto' | 'dataMin' | 'dataMax', number | 'auto' | 'dataMin' | 'dataMax'];
  refLines?: RefLine[]; refDots?: RefDot[];
  refArea?: { x1: number; x2: number; color: string };
  legend?: boolean; decimals?: number;
  yLabelRight?: string; yUnitRight?: string;
  xScale?: 'linear' | 'log'; yScale?: 'linear' | 'log';
  xTicks?: number[]; yTicks?: number[];
}) {
  const hasRight = series.some((s) => s.right);
  const dark = useDarkMode();
  const axis = dark ? '#64748b' : '#94a3b8';
  const grid = dark ? 'rgba(71,85,105,0.25)' : 'rgba(148,163,184,0.22)';
  const text = dark ? '#cbd5e1' : '#475569';

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 16, bottom: xLabel ? 22 : 6, left: yLabel ? 10 : -6 }}>
          <defs>
            {series.filter((s) => s.area).map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey} type="number" scale={xScale} domain={xDomain ?? ['dataMin', 'dataMax']}
            allowDataOverflow={xScale === 'log'} ticks={xTicks}
            tick={{ fill: text, fontSize: 10 }} stroke={axis} tickLine={{ stroke: axis }}
            tickFormatter={(v) => `${Number(v).toFixed(decimals)}${xUnit}`}
            label={xLabel ? { value: xLabel, position: 'insideBottom', offset: -12, fill: text, fontSize: 11 } : undefined}
          />
          <YAxis
            yAxisId="left" type="number" scale={yScale} domain={yDomain ?? ['auto', 'auto']}
            allowDataOverflow={yScale === 'log'} ticks={yTicks}
            tick={{ fill: text, fontSize: 10 }} stroke={axis} tickLine={{ stroke: axis }}
            tickFormatter={(v) => `${Number(v) >= 1 ? Number(v).toFixed(decimals) : Number(v)}${yUnit}`}
            label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: text, fontSize: 11, style: { textAnchor: 'middle' } } : undefined}
          />
          {hasRight && (
            <YAxis
              yAxisId="right" orientation="right" type="number" domain={['auto', 'auto']}
              tick={{ fill: text, fontSize: 10 }} stroke={axis} tickLine={{ stroke: axis }}
              tickFormatter={(v) => `${Number(v).toFixed(decimals)}${yUnitRight}`}
              label={yLabelRight ? { value: yLabelRight, angle: 90, position: 'insideRight', fill: text, fontSize: 11, style: { textAnchor: 'middle' } } : undefined}
            />
          )}
          <Tooltip
            contentStyle={{
              background: dark ? '#1e293b' : '#ffffff', border: `1px solid ${grid}`,
              borderRadius: 10, fontSize: 11, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', color: text,
            }}
            labelFormatter={(v) => `${xLabel ?? 'x'}: ${Number(v).toFixed(decimals)}${xUnit}`}
            formatter={((val: unknown, name: unknown) => [`${Number(val).toFixed(2)}`, String(name)]) as never}
          />
          {legend && <Legend verticalAlign="top" align="right" height={22} wrapperStyle={{ fontSize: 11, color: text }} iconType="plainline" />}
          {refArea && <ReferenceArea yAxisId="left" x1={refArea.x1} x2={refArea.x2} fill={refArea.color} fillOpacity={0.12} />}
          {refLines.map((r, i) => (
            <ReferenceLine key={i} yAxisId="left" {...(r.axis === 'x' ? { x: r.value } : { y: r.value })}
              stroke={r.color ?? axis} strokeDasharray={r.dashed === false ? undefined : '4 3'}
              label={r.label ? { value: r.label, fill: r.color ?? text, fontSize: 10, position: 'insideTopRight' } : undefined} />
          ))}
          {series.map((s) => (
            s.area ? (
              <Area key={s.key} yAxisId={s.right ? 'right' : 'left'} type="monotone" dataKey={s.key} name={s.name} stroke={s.color}
                strokeWidth={s.width ?? 2.5} fill={`url(#grad-${s.key})`} dot={false}
                strokeDasharray={s.dashed ? '6 4' : undefined} isAnimationActive={false} />
            ) : (
              <Line key={s.key} yAxisId={s.right ? 'right' : 'left'} type="monotone" dataKey={s.key} name={s.name} stroke={s.color}
                strokeWidth={s.width ?? 2.5} dot={false}
                strokeDasharray={s.dashed ? '6 4' : undefined} isAnimationActive={false} />
            )
          ))}
          {refDots.map((d, i) => (
            <ReferenceDot key={i} yAxisId="left" x={d.x} y={d.y} r={5} fill={d.color ?? '#22c55e'} stroke="#fff" strokeWidth={1.5}
              label={d.label ? { value: d.label, fill: d.color ?? text, fontSize: 10, position: 'top' } : undefined} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
