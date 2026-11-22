import {
  ShieldAlert, Cable, Zap, BatteryCharging, PlugZap, Sprout, Lightbulb, Gauge,
  Ruler, Home, Repeat2, PenTool, Calculator, Cog, Fan, RefreshCw, Radio, Waves,
  CircuitBoard, Cpu, SlidersHorizontal, Power, Sun, Network, ShieldCheck, Car,
  type LucideIcon,
} from 'lucide-react';

/* ============================================================
   Per-context colour system. Each module's simulation inherits
   a palette that matches its subject — safety reads as danger,
   earthing as ground/green, electronics as PCB-teal, and so on.
   One accent drives the header, the canvas highlights and the
   readouts, so every lab looks like part of one system.
   ============================================================ */

export interface SimTheme {
  key: string;
  accent: string;    // primary accent (hex)
  accent2: string;   // secondary accent (hex)
  Icon: LucideIcon;
  label: string;
}

export const THEMES: Record<string, SimTheme> = {
  safety:      { key: 'safety',      accent: '#dc2626', accent2: '#f59e0b', Icon: ShieldAlert,       label: 'Safety' },
  cable:       { key: 'cable',       accent: '#b45309', accent2: '#f59e0b', Icon: Cable,             label: 'Cables' },
  circuit:     { key: 'circuit',     accent: '#2563eb', accent2: '#06b6d4', Icon: Zap,               label: 'Circuits' },
  energy:      { key: 'energy',      accent: '#16a34a', accent2: '#f59e0b', Icon: BatteryCharging,   label: 'Energy' },
  wiring:      { key: 'wiring',      accent: '#4f46e5', accent2: '#8b5cf6', Icon: PlugZap,           label: 'Wiring' },
  earth:       { key: 'earth',       accent: '#15803d', accent2: '#a16207', Icon: Sprout,            label: 'Earthing' },
  light:       { key: 'light',       accent: '#d97706', accent2: '#f59e0b', Icon: Lightbulb,         label: 'Illumination' },
  meter:       { key: 'meter',       accent: '#0891b2', accent2: '#3b82f6', Icon: Gauge,             label: 'Instruments' },
  drawing:     { key: 'drawing',     accent: '#6366f1', accent2: '#0ea5e9', Icon: PenTool,           label: 'Drawing' },
  calc:        { key: 'calc',        accent: '#7c3aed', accent2: '#2563eb', Icon: Calculator,        label: 'Calculation' },
  appliance:   { key: 'appliance',   accent: '#0d9488', accent2: '#22c55e', Icon: Home,              label: 'Appliances' },
  transformer: { key: 'transformer', accent: '#9333ea', accent2: '#f59e0b', Icon: Repeat2,           label: 'Transformer' },
  dcmachine:   { key: 'dcmachine',   accent: '#1d4ed8', accent2: '#ef4444', Icon: Cog,               label: 'DC Machine' },
  acmotor:     { key: 'acmotor',     accent: '#0369a1', accent2: '#f59e0b', Icon: Fan,               label: 'AC Motor' },
  alternator:  { key: 'alternator',  accent: '#0e7490', accent2: '#22c55e', Icon: RefreshCw,         label: 'Alternator' },
  sync:        { key: 'sync',        accent: '#2563eb', accent2: '#eab308', Icon: Radio,             label: 'Synchronising' },
  winding:     { key: 'winding',     accent: '#7c3aed', accent2: '#06b6d4', Icon: Waves,             label: 'Winding' },
  electronics: { key: 'electronics', accent: '#0d9488', accent2: '#22c55e', Icon: CircuitBoard,      label: 'Electronics' },
  control:     { key: 'control',     accent: '#ea580c', accent2: '#eab308', Icon: Cpu,               label: 'Control' },
  drive:       { key: 'drive',       accent: '#7c3aed', accent2: '#06b6d4', Icon: SlidersHorizontal, label: 'Drives' },
  inverter:    { key: 'inverter',    accent: '#0891b2', accent2: '#22c55e', Icon: Power,             label: 'Inverter' },
  solar:       { key: 'solar',       accent: '#ea580c', accent2: '#0ea5e9', Icon: Sun,               label: 'Solar' },
  grid:        { key: 'grid',        accent: '#4338ca', accent2: '#f59e0b', Icon: Network,           label: 'Distribution' },
  protection:  { key: 'protection',  accent: '#b91c1c', accent2: '#f59e0b', Icon: ShieldCheck,       label: 'Protection' },
  ev:          { key: 'ev',          accent: '#059669', accent2: '#0ea5e9', Icon: Car,               label: 'EV Charging' },
};

/** Lighten/darken + alpha helper for hex colours on canvas or CSS. */
export function withAlpha(hex: string, a: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
