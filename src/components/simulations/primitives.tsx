import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/context/store';
import type { LucideIcon } from 'lucide-react';
import { withAlpha } from './theme';

/* ============================================================
   Shared helpers & UI primitives for interactive simulations.
   Canvas / CSS / HTML only — NO SVG (per design requirement).
   ============================================================ */

/** Returns true when the app is in dark mode, reacting to live changes. */
export function useDarkMode() {
  const [dark, setDark] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setDark(el.classList.contains('dark')));
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/** Bilingual string picker tied to the store's current language. */
export function useLang() {
  const { language } = useAppStore();
  return useCallback((en: string, hi: string) => (language === 'hi' ? hi : en), [language]);
}

/** requestAnimationFrame loop. `fn` receives elapsed seconds and dt. Pause via `running`. */
export function useRaf(fn: (t: number, dt: number) => void, running = true) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let start = performance.now();
    let last = start;
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      fnRef.current(t, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

export interface SimCtx {
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  t: number;
  dark: boolean;
}

/**
 * Responsive, high-DPI canvas. The `draw` callback is called every frame with a
 * logical (CSS-pixel) coordinate space already scaled for devicePixelRatio.
 */
export function SimCanvas({
  draw,
  height = 240,
  running = true,
  className = '',
  onPointer,
}: {
  draw: (c: SimCtx) => void;
  height?: number;
  running?: boolean;
  className?: string;
  onPointer?: (x: number, y: number, kind: 'down' | 'move' | 'up', w: number, h: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: height });
  const dark = useDarkMode();
  const drawRef = useRef(draw);
  drawRef.current = draw;

  // Render a single frame with the latest draw closure.
  const renderFrame = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    if (w === 0) return;
    ctx.clearRect(0, 0, w, h);
    drawRef.current({ ctx, w, h, t, dark });
  }, [dark]);

  // Resize to container width (and redraw once for static sims).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const resize = () => {
      const w = parent.clientWidth;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${height}px`;
      const ctx = canvas.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w, h: height };
      renderFrame(0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [height, renderFrame]);

  // Redraw once on every re-render (covers control changes for static sims).
  useEffect(() => { if (!running) renderFrame(0); });

  useRaf((t) => renderFrame(t), running);

  const handle = (e: React.PointerEvent, kind: 'down' | 'move' | 'up') => {
    if (!onPointer) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    onPointer(e.clientX - rect.left, e.clientY - rect.top, kind, sizeRef.current.w, sizeRef.current.h);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`w-full rounded-xl touch-none ${className}`}
      onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); handle(e, 'down'); }}
      onPointerMove={(e) => handle(e, 'move')}
      onPointerUp={(e) => handle(e, 'up')}
    />
  );
}

/* ---------- Palette helpers for canvas drawing ---------- */
export const palette = (dark: boolean) => ({
  bg: dark ? '#0f172a' : '#f8fafc',
  panel: dark ? '#1e293b' : '#ffffff',
  grid: dark ? 'rgba(71,85,105,0.35)' : 'rgba(148,163,184,0.30)',
  axis: dark ? '#64748b' : '#94a3b8',
  text: dark ? '#e2e8f0' : '#334155',
  sub: dark ? '#94a3b8' : '#64748b',
  live: '#ef4444',
  neutral: '#3b82f6',
  earth: '#22c55e',
  warn: '#f59e0b',
  brand: '#3b82f6',
  violet: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
});

/** Draw a soft background + grid into a canvas rect. */
export function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, dark: boolean, step = 24) {
  const p = palette(dark);
  ctx.fillStyle = dark ? 'rgba(15,23,42,0.6)' : 'rgba(241,245,249,0.7)';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = p.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = step; x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let y = step; y < h; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();
}

/* ---------- Form controls ---------- */

export function Slider({
  label, value, min, max, step = 1, unit = '', onChange, color = '#3b82f6',
}: {
  label: string; value: number; min: number; max: number; step?: number;
  unit?: string; onChange: (v: number) => void; color?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded" style={{ color, background: `${color}1a` }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-brand-500"
        style={{ accentColor: color }}
      />
    </label>
  );
}

export function Segmented<T extends string | number>({
  options, value, onChange,
}: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 p-1 rounded-lg bg-slate-100 dark:bg-surface-dark-2">
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            value === o.value
              ? 'bg-white dark:bg-surface-dark-0 text-brand-600 dark:text-brand-300 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
    >
      <span className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </span>
      {label}
    </button>
  );
}

export function Readout({ label, value, unit = '', color = '#3b82f6', sub }: {
  label: string; value: string | number; unit?: string; color?: string; sub?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 bg-white dark:bg-surface-dark-1">
      <p className="text-[10px] uppercase tracking-wide text-slate-400 font-medium">{label}</p>
      <p className="text-lg font-bold font-mono leading-tight" style={{ color }}>
        {value}<span className="text-xs ml-0.5 opacity-70">{unit}</span>
      </p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/** Standard wrapper so every simulation looks like one system. Themed by `accent`. */
export function SimShell({ title, subtitle, children, controls, accent = '#2563eb', Icon }: {
  title: string; subtitle?: string; children: React.ReactNode; controls?: React.ReactNode;
  accent?: string; Icon?: LucideIcon;
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden bg-white dark:bg-surface-dark-1 shadow-sm"
      style={{ borderColor: withAlpha(accent, 0.25) }}
    >
      <div
        className="px-4 py-3 border-b flex items-start gap-3"
        style={{ borderColor: withAlpha(accent, 0.18), background: `linear-gradient(90deg, ${withAlpha(accent, 0.12)}, transparent)` }}
      >
        {Icon && (
          <span
            className="flex-shrink-0 grid place-items-center w-9 h-9 rounded-xl"
            style={{ background: withAlpha(accent, 0.15), color: accent }}
          >
            <Icon size={18} strokeWidth={2.2} />
          </span>
        )}
        <div className="min-w-0">
          <h3 className="font-bold text-sm leading-tight" style={{ color: accent }}>{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-4 space-y-4">
        {children}
        {controls && <div className="space-y-3 pt-1">{controls}</div>}
      </div>
    </div>
  );
}

/** Rounded-rect helper for canvas. */
export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
