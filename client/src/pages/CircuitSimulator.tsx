import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/context/store';
import {
  solveCircuit,
  formatVoltage,
  formatCurrent,
  formatResistance,
  formatPower,
  type CircuitComponent,
  type ComponentType,
  type SolverResult,
} from '@/utils/circuitSolver';

// Grid settings
const GRID_SIZE = 40;
const COLS = 16;
const ROWS = 10;

interface PlacedComponent {
  id: string;
  type: ComponentType;
  col: number;
  row: number;
  orientation: 'h' | 'v'; // horizontal or vertical
  value: number;
  label: string;
}

interface WireSegment {
  id: string;
  startCol: number;
  startRow: number;
  endCol: number;
  endRow: number;
}

const TOOLBOX_ITEMS: { type: ComponentType; icon: string; labelKey: string; defaultValue: number }[] = [
  { type: 'battery', icon: '🔋', labelKey: 'sim.battery', defaultValue: 12 },
  { type: 'resistor', icon: '⊗', labelKey: 'sim.resistor', defaultValue: 100 },
  { type: 'lamp', icon: '💡', labelKey: 'sim.lamp', defaultValue: 60 },
  { type: 'switch', icon: '⏻', labelKey: 'sim.switch', defaultValue: 1 },
  { type: 'fuse', icon: '⎓', labelKey: 'sim.fuse', defaultValue: 5 },
  { type: 'ammeter', icon: '🅰', labelKey: 'sim.ammeter', defaultValue: 0 },
];

function componentSymbol(type: ComponentType, orientation: 'h' | 'v', value: number): JSX.Element {
  const isH = orientation === 'h';
  const w = isH ? GRID_SIZE * 2 : GRID_SIZE;
  const h = isH ? GRID_SIZE : GRID_SIZE * 2;

  switch (type) {
    case 'battery':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.3} y2={h / 2} className="wire-path" />
          <line x1={w * 0.3} y1={h * 0.2} x2={w * 0.3} y2={h * 0.8} stroke="currentColor" strokeWidth="3" />
          <line x1={w * 0.45} y1={h * 0.35} x2={w * 0.45} y2={h * 0.65} stroke="currentColor" strokeWidth="1.5" />
          <line x1={w * 0.55} y1={h * 0.2} x2={w * 0.55} y2={h * 0.8} stroke="currentColor" strokeWidth="3" />
          <line x1={w * 0.7} y1={h * 0.35} x2={w * 0.7} y2={h * 0.65} stroke="currentColor" strokeWidth="1.5" />
          <line x1={w * 0.7} y1={h / 2} x2={w} y2={h / 2} className="wire-path" />
          <text x={w * 0.3} y={h * 0.1} fontSize="8" textAnchor="middle" fill="var(--text-primary, currentColor)">+</text>
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.3} className="wire-path" />
          <line x1={w * 0.2} y1={h * 0.3} x2={w * 0.8} y2={h * 0.3} stroke="currentColor" strokeWidth="3" />
          <line x1={w * 0.35} y1={h * 0.45} x2={w * 0.65} y2={h * 0.45} stroke="currentColor" strokeWidth="1.5" />
          <line x1={w * 0.2} y1={h * 0.55} x2={w * 0.8} y2={h * 0.55} stroke="currentColor" strokeWidth="3" />
          <line x1={w * 0.35} y1={h * 0.7} x2={w * 0.65} y2={h * 0.7} stroke="currentColor" strokeWidth="1.5" />
          <line x1={w / 2} y1={h * 0.7} x2={w / 2} y2={h} className="wire-path" />
        </g>
      );

    case 'resistor':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.2} y2={h / 2} className="wire-path" />
          <polyline
            points={`${w * 0.2},${h / 2} ${w * 0.27},${h * 0.25} ${w * 0.37},${h * 0.75} ${w * 0.47},${h * 0.25} ${w * 0.57},${h * 0.75} ${w * 0.67},${h * 0.25} ${w * 0.73},${h / 2} ${w * 0.8},${h / 2}`}
            fill="none" stroke="currentColor" strokeWidth="2"
          />
          <line x1={w * 0.8} y1={h / 2} x2={w} y2={h / 2} className="wire-path" />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.2} className="wire-path" />
          <polyline
            points={`${w / 2},${h * 0.2} ${w * 0.25},${h * 0.27} ${w * 0.75},${h * 0.37} ${w * 0.25},${h * 0.47} ${w * 0.75},${h * 0.57} ${w * 0.25},${h * 0.67} ${w / 2},${h * 0.73} ${w / 2},${h * 0.8}`}
            fill="none" stroke="currentColor" strokeWidth="2"
          />
          <line x1={w / 2} y1={h * 0.8} x2={w / 2} y2={h} className="wire-path" />
        </g>
      );

    case 'lamp':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.3} y2={h / 2} className="wire-path" />
          <circle cx={w / 2} cy={h / 2} r={h * 0.3} fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1={w * 0.35} y1={h * 0.35} x2={w * 0.65} y2={h * 0.65} stroke="currentColor" strokeWidth="1.5" />
          <line x1={w * 0.65} y1={h * 0.35} x2={w * 0.35} y2={h * 0.65} stroke="currentColor" strokeWidth="1.5" />
          <line x1={w * 0.7} y1={h / 2} x2={w} y2={h / 2} className="wire-path" />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.3} className="wire-path" />
          <circle cx={w / 2} cy={h / 2} r={w * 0.3} fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1={w * 0.35} y1={h * 0.35} x2={w * 0.65} y2={h * 0.65} stroke="currentColor" strokeWidth="1.5" />
          <line x1={w * 0.65} y1={h * 0.35} x2={w * 0.35} y2={h * 0.65} stroke="currentColor" strokeWidth="1.5" />
          <line x1={w / 2} y1={h * 0.7} x2={w / 2} y2={h} className="wire-path" />
        </g>
      );

    case 'switch':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.3} y2={h / 2} className="wire-path" />
          <circle cx={w * 0.3} cy={h / 2} r="3" fill="currentColor" />
          {value === 1 ? (
            <line x1={w * 0.3} y1={h / 2} x2={w * 0.7} y2={h / 2} stroke="currentColor" strokeWidth="2.5" />
          ) : (
            <line x1={w * 0.3} y1={h / 2} x2={w * 0.65} y2={h * 0.2} stroke="currentColor" strokeWidth="2.5" />
          )}
          <circle cx={w * 0.7} cy={h / 2} r="3" fill="currentColor" />
          <line x1={w * 0.7} y1={h / 2} x2={w} y2={h / 2} className="wire-path" />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.3} className="wire-path" />
          <circle cx={w / 2} cy={h * 0.3} r="3" fill="currentColor" />
          {value === 1 ? (
            <line x1={w / 2} y1={h * 0.3} x2={w / 2} y2={h * 0.7} stroke="currentColor" strokeWidth="2.5" />
          ) : (
            <line x1={w / 2} y1={h * 0.3} x2={w * 0.2} y2={h * 0.65} stroke="currentColor" strokeWidth="2.5" />
          )}
          <circle cx={w / 2} cy={h * 0.7} r="3" fill="currentColor" />
          <line x1={w / 2} y1={h * 0.7} x2={w / 2} y2={h} className="wire-path" />
        </g>
      );

    case 'fuse':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.25} y2={h / 2} className="wire-path" />
          <rect x={w * 0.25} y={h * 0.3} width={w * 0.5} height={h * 0.4} rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1={w * 0.35} y1={h / 2} x2={w * 0.65} y2={h / 2} stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={w * 0.75} y1={h / 2} x2={w} y2={h / 2} className="wire-path" />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.25} className="wire-path" />
          <rect x={w * 0.3} y={h * 0.25} width={w * 0.4} height={h * 0.5} rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1={w / 2} y1={h * 0.35} x2={w / 2} y2={h * 0.65} stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" />
          <line x1={w / 2} y1={h * 0.75} x2={w / 2} y2={h} className="wire-path" />
        </g>
      );

    case 'ammeter':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.3} y2={h / 2} className="wire-path" />
          <circle cx={w / 2} cy={h / 2} r={h * 0.3} fill="none" stroke="currentColor" strokeWidth="2" />
          <text x={w / 2} y={h / 2 + 4} fontSize="10" textAnchor="middle" fontWeight="bold" fill="currentColor">A</text>
          <line x1={w * 0.7} y1={h / 2} x2={w} y2={h / 2} className="wire-path" />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.3} className="wire-path" />
          <circle cx={w / 2} cy={h / 2} r={w * 0.3} fill="none" stroke="currentColor" strokeWidth="2" />
          <text x={w / 2} y={h / 2 + 4} fontSize="10" textAnchor="middle" fontWeight="bold" fill="currentColor">A</text>
          <line x1={w / 2} y1={h * 0.7} x2={w / 2} y2={h} className="wire-path" />
        </g>
      );

    default:
      return <></>;
  }
}

// Preset circuits for learning
const PRESETS = {
  series: {
    name: 'Series Circuit',
    nameHi: 'श्रेणी परिपथ',
    components: [
      { id: 'b1', type: 'battery' as ComponentType, col: 2, row: 2, orientation: 'h' as const, value: 12, label: '12V Battery' },
      { id: 'r1', type: 'resistor' as ComponentType, col: 6, row: 2, orientation: 'h' as const, value: 100, label: 'R1 100Ω' },
      { id: 'r2', type: 'resistor' as ComponentType, col: 10, row: 2, orientation: 'h' as const, value: 200, label: 'R2 200Ω' },
      { id: 'l1', type: 'lamp' as ComponentType, col: 6, row: 6, orientation: 'h' as const, value: 60, label: 'Lamp 60Ω' },
    ],
    wires: [
      { id: 'w1', startCol: 4, startRow: 2, endCol: 6, endRow: 2 },
      { id: 'w2', startCol: 8, startRow: 2, endCol: 10, endRow: 2 },
      { id: 'w3', startCol: 12, startRow: 2, endCol: 12, endRow: 6 },
      { id: 'w4', startCol: 12, startRow: 6, endCol: 8, endRow: 6 },
      { id: 'w5', startCol: 6, startRow: 6, endCol: 2, endRow: 6 },
      { id: 'w6', startCol: 2, startRow: 6, endCol: 2, endRow: 2 },
    ],
  },
  parallel: {
    name: 'Parallel Circuit',
    nameHi: 'समानांतर परिपथ',
    components: [
      { id: 'b1', type: 'battery' as ComponentType, col: 2, row: 3, orientation: 'v' as const, value: 9, label: '9V Battery' },
      { id: 'r1', type: 'resistor' as ComponentType, col: 7, row: 2, orientation: 'v' as const, value: 100, label: 'R1 100Ω' },
      { id: 'r2', type: 'resistor' as ComponentType, col: 11, row: 2, orientation: 'v' as const, value: 200, label: 'R2 200Ω' },
    ],
    wires: [
      { id: 'w1', startCol: 2, startRow: 3, endCol: 2, endRow: 2 },
      { id: 'w2', startCol: 2, startRow: 2, endCol: 7, endRow: 2 },
      { id: 'w3', startCol: 7, startRow: 2, endCol: 11, endRow: 2 },
      { id: 'w4', startCol: 2, startRow: 5, endCol: 2, endRow: 6 },
      { id: 'w5', startCol: 2, startRow: 6, endCol: 7, endRow: 6 },
      { id: 'w6', startCol: 7, startRow: 4, endCol: 7, endRow: 6 },
      { id: 'w7', startCol: 7, startRow: 6, endCol: 11, endRow: 6 },
      { id: 'w8', startCol: 11, startRow: 4, endCol: 11, endRow: 6 },
    ],
  },
};

export default function CircuitSimulator() {
  const { t } = useTranslation();
  const { language, addXP } = useAppStore();
  const [components, setComponents] = useState<PlacedComponent[]>([]);
  const [wires, setWires] = useState<WireSegment[]>([]);
  const [selectedTool, setSelectedTool] = useState<ComponentType | 'wire' | 'select' | 'delete'>('select');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [result, setResult] = useState<SolverResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [wireStart, setWireStart] = useState<{ col: number; row: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Build circuit from placed components and wires, then solve
  const runSimulation = useCallback(() => {
    if (components.length === 0) return;

    // Build connectivity graph using grid positions
    // Each grid intersection is a potential node
    const nodeMap = new Map<string, number>();
    let nextNode = 1; // 0 is ground
    const getNodeKey = (col: number, row: number) => `${col},${row}`;

    const getOrCreateNode = (col: number, row: number) => {
      const key = getNodeKey(col, row);
      if (!nodeMap.has(key)) {
        nodeMap.set(key, nextNode++);
      }
      return nodeMap.get(key)!;
    };

    // Set node 0 as ground at the negative terminal of first battery
    const firstBattery = components.find(c => c.type === 'battery');
    if (!firstBattery) {
      setResult({
        nodeVoltages: [],
        branchCurrents: new Map(),
        componentPower: new Map(),
        error: language === 'hi' ? 'कृपया कम से कम एक बैटरी जोड़ें' : 'Please add at least one battery',
        fuseBlown: new Set(),
      });
      return;
    }

    // Ground the negative terminal of first battery
    const groundCol = firstBattery.orientation === 'h' ? firstBattery.col : firstBattery.col;
    const groundRow = firstBattery.orientation === 'h' ? firstBattery.row : firstBattery.row + 2;
    nodeMap.set(getNodeKey(groundCol, groundRow), 0);

    // Create nodes for component terminals
    const circuitComponents: CircuitComponent[] = [];

    for (const comp of components) {
      let nodeACol: number, nodeARow: number, nodeBCol: number, nodeBRow: number;

      if (comp.orientation === 'h') {
        nodeACol = comp.col;
        nodeARow = comp.row;
        nodeBCol = comp.col + 2;
        nodeBRow = comp.row;
      } else {
        nodeACol = comp.col;
        nodeARow = comp.row;
        nodeBCol = comp.col;
        nodeBRow = comp.row + 2;
      }

      const nodeA = getOrCreateNode(nodeACol, nodeARow);
      const nodeB = getOrCreateNode(nodeBCol, nodeBRow);

      circuitComponents.push({
        id: comp.id,
        type: comp.type,
        nodeA,
        nodeB,
        value: comp.value,
        label: comp.label,
      });
    }

    // Add wires as near-zero resistance connections
    // But first, merge nodes connected by wires (Union-Find)
    const parent = new Map<number, number>();
    const find = (x: number): number => {
      if (!parent.has(x)) parent.set(x, x);
      if (parent.get(x) !== x) parent.set(x, find(parent.get(x)!));
      return parent.get(x)!;
    };
    const union = (a: number, b: number) => {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) {
        // Prefer keeping node 0 (ground) as root
        if (rb === 0) parent.set(ra, rb);
        else parent.set(rb, ra);
      }
    };

    for (const wire of wires) {
      const nodeA = getOrCreateNode(wire.startCol, wire.startRow);
      const nodeB = getOrCreateNode(wire.endCol, wire.endRow);
      union(nodeA, nodeB);
    }

    // Remap all component nodes through union-find
    const uniqueRoots = new Set<number>();
    for (const comp of circuitComponents) {
      comp.nodeA = find(comp.nodeA);
      comp.nodeB = find(comp.nodeB);
      uniqueRoots.add(comp.nodeA);
      uniqueRoots.add(comp.nodeB);
    }

    // Compact node IDs
    const rootToCompact = new Map<number, number>();
    let compactId = 0;
    // Ensure ground (root of 0) maps to 0
    const groundRoot = find(0);
    rootToCompact.set(groundRoot, 0);
    compactId = 1;

    for (const root of uniqueRoots) {
      if (!rootToCompact.has(root)) {
        rootToCompact.set(root, compactId++);
      }
    }

    for (const comp of circuitComponents) {
      comp.nodeA = rootToCompact.get(comp.nodeA) ?? comp.nodeA;
      comp.nodeB = rootToCompact.get(comp.nodeB) ?? comp.nodeB;
    }

    const totalNodes = compactId;
    const solution = solveCircuit(totalNodes, circuitComponents);
    setResult(solution);
    setIsSimulating(true);

    if (!solution.error) {
      addXP(10);
    }
  }, [components, wires, language, addXP]);

  const handleGridClick = (col: number, row: number) => {
    if (selectedTool === 'select') return;

    if (selectedTool === 'delete') {
      setComponents((prev) => prev.filter((c) => !(c.col === col && c.row === row)));
      return;
    }

    if (selectedTool === 'wire') {
      if (!wireStart) {
        setWireStart({ col, row });
      } else {
        setWires((prev) => [
          ...prev,
          {
            id: `wire_${Date.now()}`,
            startCol: wireStart.col,
            startRow: wireStart.row,
            endCol: col,
            endRow: row,
          },
        ]);
        setWireStart(null);
      }
      return;
    }

    // Place component
    const toolItem = TOOLBOX_ITEMS.find((ti) => ti.type === selectedTool);
    if (!toolItem) return;

    const newComp: PlacedComponent = {
      id: `${selectedTool}_${Date.now()}`,
      type: selectedTool,
      col,
      row,
      orientation: 'h',
      value: toolItem.defaultValue,
      label: `${t(toolItem.labelKey)}`,
    };
    setComponents((prev) => [...prev, newComp]);
  };

  const loadPreset = (preset: keyof typeof PRESETS) => {
    const p = PRESETS[preset];
    setComponents(p.components);
    setWires(p.wires);
    setResult(null);
    setIsSimulating(false);
  };

  const clearCircuit = () => {
    setComponents([]);
    setWires([]);
    setResult(null);
    setIsSimulating(false);
    setSelectedComponent(null);
  };

  const toggleSwitch = (id: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id && c.type === 'switch' ? { ...c, value: c.value === 1 ? 0 : 1 } : c))
    );
    if (isSimulating) {
      setTimeout(runSimulation, 50);
    }
  };

  const updateComponentValue = (id: string, value: number) => {
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
  };

  const rotateComponent = (id: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, orientation: c.orientation === 'h' ? 'v' : 'h' } : c))
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{t('labs.circuitSim')}</h1>
          <p className="text-xs text-slate-500">{language === 'hi' ? 'DC सर्किट बनाएं और सिमुलेट करें' : 'Build and simulate DC circuits'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => loadPreset('series')} className="btn-secondary text-xs px-3 py-1.5">
            {language === 'hi' ? 'श्रेणी' : 'Series'}
          </button>
          <button onClick={() => loadPreset('parallel')} className="btn-secondary text-xs px-3 py-1.5">
            {language === 'hi' ? 'समानांतर' : 'Parallel'}
          </button>
          <button onClick={clearCircuit} className="btn-danger text-xs px-3 py-1.5">
            {t('sim.clear')}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        {/* Canvas */}
        <div className="card p-2 overflow-auto">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-1 mb-2 p-2 bg-slate-50 dark:bg-surface-dark-2 rounded-lg">
            <button
              onClick={() => setSelectedTool('select')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedTool === 'select' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              👆 {language === 'hi' ? 'चुनें' : 'Select'}
            </button>
            {TOOLBOX_ITEMS.map((item) => (
              <button
                key={item.type}
                onClick={() => setSelectedTool(item.type)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  selectedTool === item.type ? 'bg-brand-500 text-white' : 'bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {item.icon} {t(item.labelKey)}
              </button>
            ))}
            <button
              onClick={() => setSelectedTool('wire')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedTool === 'wire' ? 'bg-brand-500 text-white' : 'bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              ➖ {t('sim.wire')}
            </button>
            <button
              onClick={() => setSelectedTool('delete')}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                selectedTool === 'delete' ? 'bg-red-500 text-white' : 'bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              🗑 {language === 'hi' ? 'हटाएं' : 'Delete'}
            </button>
            <div className="flex-1" />
            <button
              onClick={runSimulation}
              className="btn-primary text-xs px-4 py-1.5 flex items-center gap-1"
            >
              ▶ {t('sim.run')}
            </button>
          </div>

          {/* SVG Grid */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${COLS * GRID_SIZE} ${ROWS * GRID_SIZE}`}
            className="w-full border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-surface-dark"
            style={{ minHeight: 300 }}
          >
            {/* Grid dots */}
            {Array.from({ length: ROWS + 1 }, (_, r) =>
              Array.from({ length: COLS + 1 }, (_, c) => (
                <circle
                  key={`dot-${c}-${r}`}
                  cx={c * GRID_SIZE}
                  cy={r * GRID_SIZE}
                  r="1.5"
                  className="fill-slate-300 dark:fill-slate-600"
                />
              ))
            )}

            {/* Click targets */}
            {Array.from({ length: ROWS + 1 }, (_, r) =>
              Array.from({ length: COLS + 1 }, (_, c) => (
                <rect
                  key={`target-${c}-${r}`}
                  x={c * GRID_SIZE - GRID_SIZE / 2}
                  y={r * GRID_SIZE - GRID_SIZE / 2}
                  width={GRID_SIZE}
                  height={GRID_SIZE}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => handleGridClick(c, r)}
                />
              ))
            )}

            {/* Wires */}
            {wires.map((wire) => (
              <line
                key={wire.id}
                x1={wire.startCol * GRID_SIZE}
                y1={wire.startRow * GRID_SIZE}
                x2={wire.endCol * GRID_SIZE}
                y2={wire.endRow * GRID_SIZE}
                className={`wire-path ${isSimulating ? 'current-animated' : ''}`}
              />
            ))}

            {/* Wire start indicator */}
            {wireStart && (
              <circle
                cx={wireStart.col * GRID_SIZE}
                cy={wireStart.row * GRID_SIZE}
                r="5"
                className="fill-brand-500 animate-pulse"
              />
            )}

            {/* Components */}
            {components.map((comp) => {
              const current = result?.branchCurrents.get(comp.id) ?? 0;
              const isBlown = result?.fuseBlown.has(comp.id);
              return (
                <g
                  key={comp.id}
                  transform={`translate(${comp.col * GRID_SIZE}, ${comp.row * GRID_SIZE})`}
                  className={`cursor-pointer transition-colors ${
                    selectedComponent === comp.id ? 'text-brand-500' : 'text-slate-700 dark:text-slate-300'
                  } ${isBlown ? 'text-red-500' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedTool === 'select') {
                      setSelectedComponent(comp.id);
                      if (comp.type === 'switch') toggleSwitch(comp.id);
                    }
                    if (selectedTool === 'delete') {
                      setComponents((prev) => prev.filter((c) => c.id !== comp.id));
                    }
                  }}
                >
                  {componentSymbol(comp.type, comp.orientation, comp.value)}
                  {/* Value label */}
                  <text
                    x={comp.orientation === 'h' ? GRID_SIZE : GRID_SIZE * 0.7 + 10}
                    y={comp.orientation === 'h' ? -5 : GRID_SIZE}
                    fontSize="9"
                    textAnchor="middle"
                    className="fill-slate-500 dark:fill-slate-400"
                  >
                    {comp.type === 'battery' ? `${comp.value}V` :
                     comp.type === 'resistor' || comp.type === 'lamp' ? formatResistance(comp.value) :
                     comp.type === 'fuse' ? `${comp.value}A` :
                     comp.type === 'switch' ? (comp.value === 1 ? (language === 'hi' ? 'बंद' : 'ON') : (language === 'hi' ? 'खुला' : 'OFF')) :
                     ''}
                  </text>
                  {/* Current reading when simulating */}
                  {isSimulating && Math.abs(current) > 0.0001 && (
                    <text
                      x={comp.orientation === 'h' ? GRID_SIZE : -15}
                      y={comp.orientation === 'h' ? (comp.orientation === 'h' ? GRID_SIZE + 12 : GRID_SIZE * 2 + 12) : GRID_SIZE}
                      fontSize="8"
                      textAnchor="middle"
                      className="fill-brand-600 dark:fill-brand-400 font-mono"
                    >
                      {formatCurrent(current)}
                    </text>
                  )}
                  {/* Blown fuse indicator */}
                  {isBlown && (
                    <text
                      x={comp.orientation === 'h' ? GRID_SIZE : GRID_SIZE / 2}
                      y={comp.orientation === 'h' ? GRID_SIZE / 2 + 3 : GRID_SIZE}
                      fontSize="14"
                      textAnchor="middle"
                    >
                      💥
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Properties Panel */}
        <div className="space-y-4">
          {/* Results */}
          {result && (
            <div className={`card p-4 ${result.error ? 'border-red-300 dark:border-red-700' : 'border-green-300 dark:border-green-700'}`}>
              <h3 className="font-semibold text-sm mb-2">
                {result.error ? '❌' : '✅'} {t('sim.results')}
              </h3>
              {result.error ? (
                <p className="text-xs text-red-600 dark:text-red-400">{result.error}</p>
              ) : (
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">{language === 'hi' ? 'नोड वोल्टेज:' : 'Node Voltages:'}</span>
                    <div className="mt-1 space-y-0.5 font-mono">
                      {result.nodeVoltages.map((v, i) => (
                        <div key={i} className="flex justify-between">
                          <span>N{i}{i === 0 ? ' (GND)' : ''}</span>
                          <span className="text-brand-600 dark:text-brand-400">{formatVoltage(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-700" />
                  <div>
                    <span className="font-medium">{language === 'hi' ? 'धारा:' : 'Currents:'}</span>
                    <div className="mt-1 space-y-0.5 font-mono">
                      {components.map((comp) => {
                        const current = result.branchCurrents.get(comp.id) ?? 0;
                        return (
                          <div key={comp.id} className="flex justify-between">
                            <span className="truncate mr-2">{comp.label || comp.id}</span>
                            <span className="text-amber-600 dark:text-amber-400">{formatCurrent(current)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <hr className="border-slate-200 dark:border-slate-700" />
                  <div>
                    <span className="font-medium">{language === 'hi' ? 'शक्ति:' : 'Power:'}</span>
                    <div className="mt-1 space-y-0.5 font-mono">
                      {components.filter(c => c.type !== 'wire' && c.type !== 'switch').map((comp) => {
                        const power = result.componentPower.get(comp.id) ?? 0;
                        return (
                          <div key={comp.id} className="flex justify-between">
                            <span className="truncate mr-2">{comp.label || comp.id}</span>
                            <span className="text-green-600 dark:text-green-400">{formatPower(power)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {result.fuseBlown.size > 0 && (
                    <>
                      <hr className="border-slate-200 dark:border-slate-700" />
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        ⚠️ {language === 'hi' ? 'फ्यूज उड़ गया!' : 'Fuse blown!'} ({result.fuseBlown.size})
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Selected component properties */}
          {selectedComponent && (() => {
            const comp = components.find((c) => c.id === selectedComponent);
            if (!comp) return null;
            return (
              <div className="card p-4">
                <h3 className="font-semibold text-sm mb-3">{language === 'hi' ? 'गुण' : 'Properties'}</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-500">{language === 'hi' ? 'प्रकार' : 'Type'}</label>
                    <p className="font-medium">{t(`sim.${comp.type}`)}</p>
                  </div>
                  {(comp.type === 'resistor' || comp.type === 'lamp') && (
                    <div>
                      <label className="text-slate-500">{language === 'hi' ? 'प्रतिरोध (Ω)' : 'Resistance (Ω)'}</label>
                      <input
                        type="number"
                        value={comp.value}
                        onChange={(e) => updateComponentValue(comp.id, Number(e.target.value) || 1)}
                        className="input-field mt-1"
                        min="1"
                      />
                    </div>
                  )}
                  {comp.type === 'battery' && (
                    <div>
                      <label className="text-slate-500">{language === 'hi' ? 'वोल्टेज (V)' : 'Voltage (V)'}</label>
                      <input
                        type="number"
                        value={comp.value}
                        onChange={(e) => updateComponentValue(comp.id, Number(e.target.value) || 1)}
                        className="input-field mt-1"
                        min="0.5"
                        step="0.5"
                      />
                    </div>
                  )}
                  {comp.type === 'fuse' && (
                    <div>
                      <label className="text-slate-500">{language === 'hi' ? 'रेटिंग (A)' : 'Rating (A)'}</label>
                      <input
                        type="number"
                        value={comp.value}
                        onChange={(e) => updateComponentValue(comp.id, Number(e.target.value) || 1)}
                        className="input-field mt-1"
                        min="0.5"
                        step="0.5"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => rotateComponent(comp.id)} className="btn-secondary text-xs px-3 py-1">
                      🔄 {language === 'hi' ? 'घुमाएं' : 'Rotate'}
                    </button>
                    <button
                      onClick={() => {
                        setComponents((prev) => prev.filter((c) => c.id !== comp.id));
                        setSelectedComponent(null);
                      }}
                      className="btn-danger text-xs px-3 py-1"
                    >
                      🗑 {language === 'hi' ? 'हटाएं' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Help */}
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-2">💡 {language === 'hi' ? 'सहायता' : 'Help'}</h3>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>1. {language === 'hi' ? 'टूलबार से कॉम्पोनेंट चुनें' : 'Select component from toolbar'}</li>
              <li>2. {language === 'hi' ? 'ग्रिड पर क्लिक करके रखें' : 'Click on grid to place it'}</li>
              <li>3. {language === 'hi' ? 'वायर से कनेक्ट करें' : 'Connect with wires'}</li>
              <li>4. {language === 'hi' ? '"चलाएं" दबाएं' : 'Press "Run" to simulate'}</li>
              <li className="text-brand-600 dark:text-brand-400">
                {language === 'hi' ? 'प्रीसेट सर्किट आज़माएं →' : 'Try preset circuits →'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
