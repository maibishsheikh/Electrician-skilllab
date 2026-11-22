import { THEMES, type SimTheme } from '@/components/simulations/theme';

/* Each module inherits the same contextual theme (icon + accent colour)
   as its simulation, so the module header matches its lab. */
export const moduleThemeKey: Record<number, string> = {
  1: 'safety', 2: 'cable', 3: 'circuit', 4: 'energy', 5: 'wiring',
  6: 'earth', 7: 'light', 8: 'meter', 9: 'meter', 10: 'appliance',
  11: 'transformer', 12: 'drawing', 13: 'calc', 14: 'dcmachine', 15: 'dcmachine',
  16: 'acmotor', 17: 'acmotor', 18: 'alternator', 19: 'sync', 20: 'winding',
  21: 'electronics', 22: 'control', 23: 'drive', 24: 'inverter', 25: 'solar',
  26: 'grid', 27: 'protection', 28: 'ev', 29: 'drawing', 30: 'calc',
};

export function moduleTheme(id: number): SimTheme {
  return THEMES[moduleThemeKey[id]] ?? THEMES.circuit;
}
