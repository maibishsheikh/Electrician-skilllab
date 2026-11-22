import { useState, useCallback, useRef, useEffect } from 'react';
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
const COLS = 18;
const ROWS = 12;
const SVG_W = COLS * GRID_SIZE;
const SVG_H = ROWS * GRID_SIZE;

interface PlacedComponent {
  id: string;
  type: ComponentType;
  col: number;
  row: number;
  orientation: 'h' | 'v';
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

interface DragState {
  compId: string;
  offsetX: number;
  offsetY: number;
  startCol: number;
  startRow: number;
}

const TOOLBOX_ITEMS: { type: ComponentType; icon: string; labelKey: string; defaultValue: number; color: string }[] = [
  { type: 'battery', icon: '🔋', labelKey: 'sim.battery', defaultValue: 12, color: '#ef4444' },
  { type: 'resistor', icon: '⊗', labelKey: 'sim.resistor', defaultValue: 100, color: '#8b5cf6' },
  { type: 'lamp', icon: '💡', labelKey: 'sim.lamp', defaultValue: 60, color: '#f59e0b' },
  { type: 'switch', icon: '⏻', labelKey: 'sim.switch', defaultValue: 1, color: '#10b981' },
  { type: 'fuse', icon: '⎓', labelKey: 'sim.fuse', defaultValue: 5, color: '#ec4899' },
  { type: 'ammeter', icon: '🅰', labelKey: 'sim.ammeter', defaultValue: 0, color: '#06b6d4' },
];

/** Get the two terminal positions of a component in grid coordinates */
function getTerminals(comp: PlacedComponent): { a: { col: number; row: number }; b: { col: number; row: number } } {
  if (comp.orientation === 'h') {
    return { a: { col: comp.col, row: comp.row }, b: { col: comp.col + 2, row: comp.row } };
  }
  return { a: { col: comp.col, row: comp.row }, b: { col: comp.col, row: comp.row + 2 } };
}

function componentSymbol(type: ComponentType, orientation: 'h' | 'v', value: number, isSelected: boolean, isBlown: boolean): JSX.Element {
  const isH = orientation === 'h';
  const w = isH ? GRID_SIZE * 2 : GRID_SIZE;
  const h = isH ? GRID_SIZE : GRID_SIZE * 2;
  const strokeColor = isBlown ? '#ef4444' : isSelected ? '#3b82f6' : 'currentColor';
  const strokeW = isSelected ? 2.5 : 2;

  switch (type) {
    case 'battery':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.3} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
          <line x1={w * 0.3} y1={h * 0.15} x2={w * 0.3} y2={h * 0.85} stroke={strokeColor} strokeWidth="3" />
          <line x1={w * 0.45} y1={h * 0.3} x2={w * 0.45} y2={h * 0.7} stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w * 0.55} y1={h * 0.15} x2={w * 0.55} y2={h * 0.85} stroke={strokeColor} strokeWidth="3" />
          <line x1={w * 0.7} y1={h * 0.3} x2={w * 0.7} y2={h * 0.7} stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w * 0.7} y1={h / 2} x2={w} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
          <text x={w * 0.25} y={h * 0.08} fontSize="9" textAnchor="middle" fill="#ef4444" fontWeight="bold">+</text>
          <text x={w * 0.75} y={h * 0.08} fontSize="9" textAnchor="middle" fill="#3b82f6" fontWeight="bold">−</text>
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.3} stroke={strokeColor} strokeWidth={strokeW} />
          <line x1={w * 0.15} y1={h * 0.3} x2={w * 0.85} y2={h * 0.3} stroke={strokeColor} strokeWidth="3" />
          <line x1={w * 0.3} y1={h * 0.45} x2={w * 0.7} y2={h * 0.45} stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w * 0.15} y1={h * 0.55} x2={w * 0.85} y2={h * 0.55} stroke={strokeColor} strokeWidth="3" />
          <line x1={w * 0.3} y1={h * 0.7} x2={w * 0.7} y2={h * 0.7} stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w / 2} y1={h * 0.7} x2={w / 2} y2={h} stroke={strokeColor} strokeWidth={strokeW} />
          <text x={w * 0.08} y={h * 0.33} fontSize="9" textAnchor="middle" fill="#ef4444" fontWeight="bold">+</text>
          <text x={w * 0.08} y={h * 0.73} fontSize="9" textAnchor="middle" fill="#3b82f6" fontWeight="bold">−</text>
        </g>
      );

    case 'resistor':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.2} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
          <polyline
            points={`${w * 0.2},${h / 2} ${w * 0.27},${h * 0.2} ${w * 0.37},${h * 0.8} ${w * 0.47},${h * 0.2} ${w * 0.57},${h * 0.8} ${w * 0.67},${h * 0.2} ${w * 0.73},${h / 2} ${w * 0.8},${h / 2}`}
            fill="none" stroke={strokeColor} strokeWidth={strokeW}
          />
          <line x1={w * 0.8} y1={h / 2} x2={w} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.2} stroke={strokeColor} strokeWidth={strokeW} />
          <polyline
            points={`${w / 2},${h * 0.2} ${w * 0.2},${h * 0.27} ${w * 0.8},${h * 0.37} ${w * 0.2},${h * 0.47} ${w * 0.8},${h * 0.57} ${w * 0.2},${h * 0.67} ${w / 2},${h * 0.73} ${w / 2},${h * 0.8}`}
            fill="none" stroke={strokeColor} strokeWidth={strokeW}
          />
          <line x1={w / 2} y1={h * 0.8} x2={w / 2} y2={h} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );

    case 'lamp':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.3} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx={w / 2} cy={h / 2} r={h * 0.32} fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1={w * 0.35} y1={h * 0.35} x2={w * 0.65} y2={h * 0.65} stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w * 0.65} y1={h * 0.35} x2={w * 0.35} y2={h * 0.65} stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w * 0.7} y1={h / 2} x2={w} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.3} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx={w / 2} cy={h / 2} r={w * 0.32} fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <line x1={w * 0.35} y1={h * 0.35} x2={w * 0.65} y2={h * 0.65} stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w * 0.65} y1={h * 0.35} x2={w * 0.35} y2={h * 0.65} stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w / 2} y1={h * 0.7} x2={w / 2} y2={h} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );

    case 'switch':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.3} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx={w * 0.3} cy={h / 2} r="4" fill={strokeColor} />
          {value === 1 ? (
            <line x1={w * 0.3} y1={h / 2} x2={w * 0.7} y2={h / 2} stroke="#10b981" strokeWidth="3" />
          ) : (
            <line x1={w * 0.3} y1={h / 2} x2={w * 0.65} y2={h * 0.15} stroke={strokeColor} strokeWidth="2.5" />
          )}
          <circle cx={w * 0.7} cy={h / 2} r="4" fill={strokeColor} />
          <line x1={w * 0.7} y1={h / 2} x2={w} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.3} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx={w / 2} cy={h * 0.3} r="4" fill={strokeColor} />
          {value === 1 ? (
            <line x1={w / 2} y1={h * 0.3} x2={w / 2} y2={h * 0.7} stroke="#10b981" strokeWidth="3" />
          ) : (
            <line x1={w / 2} y1={h * 0.3} x2={w * 0.15} y2={h * 0.65} stroke={strokeColor} strokeWidth="2.5" />
          )}
          <circle cx={w / 2} cy={h * 0.7} r="4" fill={strokeColor} />
          <line x1={w / 2} y1={h * 0.7} x2={w / 2} y2={h} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );

    case 'fuse':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.25} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x={w * 0.25} y={h * 0.25} width={w * 0.5} height={h * 0.5} rx="4" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w * 0.35} y1={h / 2} x2={w * 0.65} y2={h / 2} stroke={strokeColor} strokeWidth="1" strokeDasharray="3,2" />
          <line x1={w * 0.75} y1={h / 2} x2={w} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.25} stroke={strokeColor} strokeWidth={strokeW} />
          <rect x={w * 0.25} y={h * 0.25} width={w * 0.5} height={h * 0.5} rx="4" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          <line x1={w / 2} y1={h * 0.35} x2={w / 2} y2={h * 0.65} stroke={strokeColor} strokeWidth="1" strokeDasharray="3,2" />
          <line x1={w / 2} y1={h * 0.75} x2={w / 2} y2={h} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );

    case 'ammeter':
      return isH ? (
        <g>
          <line x1="0" y1={h / 2} x2={w * 0.3} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx={w / 2} cy={h / 2} r={h * 0.32} fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <text x={w / 2} y={h / 2 + 5} fontSize="12" textAnchor="middle" fontWeight="bold" fill={strokeColor}>A</text>
          <line x1={w * 0.7} y1={h / 2} x2={w} y2={h / 2} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      ) : (
        <g>
          <line x1={w / 2} y1="0" x2={w / 2} y2={h * 0.3} stroke={strokeColor} strokeWidth={strokeW} />
          <circle cx={w / 2} cy={h / 2} r={w * 0.32} fill="none" stroke={strokeColor} strokeWidth={strokeW} />
          <text x={w / 2} y={h / 2 + 5} fontSize="12" textAnchor="middle" fontWeight="bold" fill={strokeColor}>A</text>
          <line x1={w / 2} y1={h * 0.7} x2={w / 2} y2={h} stroke={strokeColor} strokeWidth={strokeW} />
        </g>
      );

    default:
      return <></>;
  }
}

// Preset circuits
const PRESETS = {
  series: {
    name: 'Series Circuit',
    nameHi: 'श्रेणी परिपथ',
    components: [
      { id: 'b1', type: 'battery' as ComponentType, col: 2, row: 3, orientation: 'h' as const, value: 12, label: '12V Battery' },
      { id: 'r1', type: 'resistor' as ComponentType, col: 6, row: 3, orientation: 'h' as const, value: 100, label: 'R1 100Ω' },
      { id: 'r2', type: 'resistor' as ComponentType, col: 10, row: 3, orientation: 'h' as const, value: 200, label: 'R2 200Ω' },
      { id: 'l1', type: 'lamp' as ComponentType, col: 6, row: 7, orientation: 'h' as const, value: 60, label: 'Lamp 60Ω' },
    ],
    wires: [
      { id: 'w1', startCol: 4, startRow: 3, endCol: 6, endRow: 3 },
      { id: 'w2', startCol: 8, startRow: 3, endCol: 10, endRow: 3 },
      { id: 'w3', startCol: 12, startRow: 3, endCol: 12, endRow: 7 },
      { id: 'w4', startCol: 12, startRow: 7, endCol: 8, endRow: 7 },
      { id: 'w5', startCol: 6, startRow: 7, endCol: 2, endRow: 7 },
      { id: 'w6', startCol: 2, startRow: 7, endCol: 2, endRow: 3 },
    ],
  },
  parallel: {
    name: 'Parallel Circuit',
    nameHi: 'समानांतर परिपथ',
    components: [
      { id: 'b1', type: 'battery' as ComponentType, col: 2, row: 4, orientation: 'v' as const, value: 9, label: '9V Battery' },
      { id: 'r1', type: 'resistor' as ComponentType, col: 7, row: 3, orientation: 'v' as const, value: 100, label: 'R1 100Ω' },
      { id: 'r2', type: 'resistor' as ComponentType, col: 11, row: 3, orientation: 'v' as const, value: 200, label: 'R2 200Ω' },
    ],
    wires: [
      { id: 'w1', startCol: 2, startRow: 4, endCol: 2, endRow: 3 },
      { id: 'w2', startCol: 2, startRow: 3, endCol: 7, endRow: 3 },
      { id: 'w3', startCol: 7, startRow: 3, endCol: 11, endRow: 3 },
      { id: 'w4', startCol: 2, startRow: 6, endCol: 2, endRow: 7 },
      { id: 'w5', startCol: 2, startRow: 7, endCol: 7, endRow: 7 },
      { id: 'w6', startCol: 7, startRow: 5, endCol: 7, endRow: 7 },
      { id: 'w7', startCol: 7, startRow: 7, endCol: 11, endRow: 7 },
      { id: 'w8', startCol: 11, startRow: 5, endCol: 11, endRow: 7 },
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
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [ghostPos, setGhostPos] = useState<{ col: number; row: number } | null>(null);
  const [toolboxDrag, setToolboxDrag] = useState<ComponentType | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Convert mouse/touch event to grid coordinates
  const eventToGrid = useCallback((e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent): { col: number; row: number } | null => {
    if (!svgRef.current) return null;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX ?? (e as TouchEvent).changedTouches[0]?.clientX ?? 0 : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY ?? (e as TouchEvent).changedTouches[0]?.clientY ?? 0 : (e as MouseEvent).clientY;
    const scaleX = SVG_W / rect.width;
    const scaleY = SVG_H / rect.height;
    const svgX = (clientX - rect.left) * scaleX;
    const svgY = (clientY - rect.top) * scaleY;
    const col = Math.round(svgX / GRID_SIZE);
    const row = Math.round(svgY / GRID_SIZE);
    return { col: Math.max(0, Math.min(COLS, col)), row: Math.max(0, Math.min(ROWS, row)) };
  }, []);

  // Drag from toolbox — start
  const handleToolboxDragStart = useCallback((type: ComponentType) => {
    setToolboxDrag(type);
    setSelectedTool(type);
  }, []);

  // SVG mouse move — update ghost / drag position
  const handleSvgMouseMove = useCallback((e: React.MouseEvent) => {
    const grid = eventToGrid(e);
    if (!grid) return;

    if (dragState) {
      setGhostPos(grid);
    } else if (toolboxDrag || (selectedTool !== 'select' && selectedTool !== 'delete' && selectedTool !== 'wire')) {
      setGhostPos(grid);
    }
  }, [eventToGrid, dragState, toolboxDrag, selectedTool]);

  // SVG mouse up — finish drag
  const handleSvgMouseUp = useCallback((e: React.MouseEvent) => {
    const grid = eventToGrid(e);
    if (!grid) return;

    // Finish toolbox drag
    if (toolboxDrag) {
      const toolItem = TOOLBOX_ITEMS.find((ti) => ti.type === toolboxDrag);
      if (toolItem) {
        const newComp: PlacedComponent = {
          id: `${toolboxDrag}_${Date.now()}`,
          type: toolboxDrag,
          col: grid.col,
          row: grid.row,
          orientation: 'h',
          value: toolItem.defaultValue,
          label: `${t(toolItem.labelKey)}`,
        };
        setComponents((prev) => [...prev, newComp]);
        setSelectedComponent(newComp.id);
      }
      setToolboxDrag(null);
      setGhostPos(null);
      setSelectedTool('select');
      return;
    }

    // Finish component drag (reposition)
    if (dragState) {
      setComponents((prev) =>
        prev.map((c) =>
          c.id === dragState.compId ? { ...c, col: grid.col, row: grid.row } : c
        )
      );
      setDragState(null);
      setGhostPos(null);
      return;
    }
  }, [eventToGrid, toolboxDrag, dragState, t]);

  // Grid click handler
  const handleGridClick = useCallback((col: number, row: number) => {
    if (dragState || toolboxDrag) return;

    if (selectedTool === 'select') {
      // Check if clicking on a component
      const clicked = components.find((c) => {
        const terms = getTerminals(c);
        const minCol = Math.min(terms.a.col, terms.b.col);
        const maxCol = Math.max(terms.a.col, terms.b.col);
        const minRow = Math.min(terms.a.row, terms.b.row);
        const maxRow = Math.max(terms.a.row, terms.b.row);
        return col >= minCol && col <= maxCol && row >= minRow && row <= maxRow;
      });
      setSelectedComponent(clicked?.id ?? null);
      return;
    }

    if (selectedTool === 'delete') {
      // Delete component at position
      setComponents((prev) => prev.filter((c) => {
        const terms = getTerminals(c);
        const minCol = Math.min(terms.a.col, terms.b.col);
        const maxCol = Math.max(terms.a.col, terms.b.col);
        const minRow = Math.min(terms.a.row, terms.b.row);
        const maxRow = Math.max(terms.a.row, terms.b.row);
        return !(col >= minCol && col <= maxCol && row >= minRow && row <= maxRow);
      }));
      // Also delete wires touching this point
      setWires((prev) => prev.filter((w) =>
        !((w.startCol === col && w.startRow === row) || (w.endCol === col && w.endRow === row))
      ));
      return;
    }

    if (selectedTool === 'wire') {
      if (!wireStart) {
        setWireStart({ col, row });
      } else {
        // Only allow horizontal or vertical wires
        const endCol = Math.abs(col - wireStart.col) >= Math.abs(row - wireStart.row) ? col : wireStart.col;
        const endRow = Math.abs(col - wireStart.col) >= Math.abs(row - wireStart.row) ? wireStart.row : row;
        if (endCol !== wireStart.col || endRow !== wireStart.row) {
          setWires((prev) => [
            ...prev,
            {
              id: `wire_${Date.now()}`,
              startCol: wireStart.col,
              startRow: wireStart.row,
              endCol,
              endRow,
            },
          ]);
        }
        setWireStart(null);
      }
      return;
    }

    // Place component from toolbar click
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
    setSelectedComponent(newComp.id);
  }, [selectedTool, wireStart, components, dragState, toolboxDrag, t]);

  // Start dragging an existing component
  const handleComponentDragStart = useCallback((e: React.MouseEvent, compId: string) => {
    if (selectedTool !== 'select') return;
    e.stopPropagation();
    const comp = components.find((c) => c.id === compId);
    if (!comp) return;
    setSelectedComponent(compId);
    setDragState({
      compId,
      offsetX: 0,
      offsetY: 0,
      startCol: comp.col,
      startRow: comp.row,
    });
  }, [selectedTool, components]);

  // Build circuit and solve
  const runSimulation = useCallback(() => {
    if (components.length === 0) return;

    const nodeMap = new Map<string, number>();
    let nextNode = 1;
    const getNodeKey = (col: number, row: number) => `${col},${row}`;

    const getOrCreateNode = (col: number, row: number) => {
      const key = getNodeKey(col, row);
      if (!nodeMap.has(key)) {
        nodeMap.set(key, nextNode++);
      }
      return nodeMap.get(key)!;
    };

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

    const groundTerms = getTerminals(firstBattery);
    nodeMap.set(getNodeKey(groundTerms.b.col, groundTerms.b.row), 0);

    const circuitComponents: CircuitComponent[] = [];

    for (const comp of components) {
      const terms = getTerminals(comp);
      const nodeA = getOrCreateNode(terms.a.col, terms.a.row);
      const nodeB = getOrCreateNode(terms.b.col, terms.b.row);
      circuitComponents.push({
        id: comp.id,
        type: comp.type,
        nodeA,
        nodeB,
        value: comp.value,
        label: comp.label,
      });
    }

    // Union-Find for wire connectivity
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
        if (rb === 0) parent.set(ra, rb);
        else parent.set(rb, ra);
      }
    };

    for (const wire of wires) {
      const nodeA = getOrCreateNode(wire.startCol, wire.startRow);
      const nodeB = getOrCreateNode(wire.endCol, wire.endRow);
      union(nodeA, nodeB);
    }

    const uniqueRoots = new Set<number>();
    for (const comp of circuitComponents) {
      comp.nodeA = find(comp.nodeA);
      comp.nodeB = find(comp.nodeB);
      uniqueRoots.add(comp.nodeA);
      uniqueRoots.add(comp.nodeB);
    }

    const rootToCompact = new Map<number, number>();
    const groundRoot = find(0);
    rootToCompact.set(groundRoot, 0);
    let compactId = 1;
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
    if (!solution.error) addXP(10);
  }, [components, wires, language, addXP]);

  const loadPreset = (preset: keyof typeof PRESETS) => {
    const p = PRESETS[preset];
    setComponents(p.components);
    setWires(p.wires);
    setResult(null);
    setIsSimulating(false);
    setSelectedComponent(null);
  };

  const clearCircuit = () => {
    setComponents([]);
    setWires([]);
    setResult(null);
    setIsSimulating(false);
    setSelectedComponent(null);
    setWireStart(null);
  };

  const toggleSwitch = (id: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id && c.type === 'switch' ? { ...c, value: c.value === 1 ? 0 : 1 } : c))
    );
    if (isSimulating) setTimeout(runSimulation, 50);
  };

  const updateComponentValue = (id: string, value: number) => {
    setComponents((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)));
  };

  const rotateComponent = (id: string) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, orientation: c.orientation === 'h' ? 'v' : 'h' } : c))
    );
  };

  const deleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponent === id) setSelectedComponent(null);
  };

  // Cancel any drag on mouse leave
  const handleSvgMouseLeave = useCallback(() => {
    if (toolboxDrag) {
      setToolboxDrag(null);
      setGhostPos(null);
      setSelectedTool('select');
    }
    if (dragState) {
      // Revert position
      setDragState(null);
      setGhostPos(null);
    }
  }, [toolboxDrag, dragState]);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{t('labs.circuitSim')}</h1>
          <p className="text-xs text-slate-500">{language === 'hi' ? 'DC सर्किट बनाएं — ड्रैग, ड्रॉप, कनेक्ट और सिमुलेट करें' : 'Build DC circuits — drag, drop, connect & simulate'}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => loadPreset('series')} className="btn-secondary text-xs px-3 py-1.5">
            {language === 'hi' ? '📋 श्रेणी' : '📋 Series'}
          </button>
          <button onClick={() => loadPreset('parallel')} className="btn-secondary text-xs px-3 py-1.5">
            {language === 'hi' ? '📋 समानांतर' : '📋 Parallel'}
          </button>
          <button onClick={clearCircuit} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
            🗑 {t('sim.clear')}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-4">
        {/* Main canvas area */}
        <div className="card p-3 space-y-3">
          {/* Component palette — drag from here */}
          <div className="flex flex-wrap gap-2 p-2.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-surface-dark-2 dark:to-surface-dark rounded-xl">
            <button
              onClick={() => { setSelectedTool('select'); setToolboxDrag(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTool === 'select' ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'
              }`}
            >
              👆 {language === 'hi' ? 'चुनें' : 'Select'}
            </button>

            {TOOLBOX_ITEMS.map((item) => (
              <button
                key={item.type}
                onMouseDown={() => handleToolboxDragStart(item.type)}
                onClick={() => setSelectedTool(item.type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-grab active:cursor-grabbing ${
                  selectedTool === item.type ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'
                }`}
                title={language === 'hi' ? 'ड्रैग करके ग्रिड पर रखें' : 'Drag onto the grid to place'}
              >
                {item.icon} {t(item.labelKey)}
              </button>
            ))}

            <button
              onClick={() => { setSelectedTool('wire'); setToolboxDrag(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTool === 'wire' ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25' : 'bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'
              }`}
            >
              ➖ {t('sim.wire')}
            </button>

            <button
              onClick={() => { setSelectedTool('delete'); setToolboxDrag(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTool === 'delete' ? 'bg-red-500 text-white shadow-md' : 'bg-white dark:bg-surface-dark hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm'
              }`}
            >
              ✕ {language === 'hi' ? 'हटाएं' : 'Delete'}
            </button>

            <div className="flex-1" />

            <button
              onClick={runSimulation}
              className="btn-primary text-xs px-5 py-1.5 flex items-center gap-1.5 shadow-md shadow-brand-500/25"
            >
              ▶ {t('sim.run')}
            </button>
          </div>

          {/* SVG Canvas */}
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SVG_W} ${SVG_H}`}
            className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-surface-dark select-none"
            style={{ minHeight: 340, cursor: dragState || toolboxDrag ? 'grabbing' : selectedTool === 'wire' ? 'crosshair' : selectedTool === 'delete' ? 'not-allowed' : selectedTool !== 'select' ? 'copy' : 'default' }}
            onMouseMove={handleSvgMouseMove}
            onMouseUp={handleSvgMouseUp}
            onMouseLeave={handleSvgMouseLeave}
          >
            {/* Background grid dots */}
            {Array.from({ length: ROWS + 1 }, (_, r) =>
              Array.from({ length: COLS + 1 }, (_, c) => (
                <circle
                  key={`dot-${c}-${r}`}
                  cx={c * GRID_SIZE}
                  cy={r * GRID_SIZE}
                  r="1.5"
                  className="fill-slate-200 dark:fill-slate-700"
                />
              ))
            )}

            {/* Click targets — invisible rects over each grid point */}
            {Array.from({ length: ROWS + 1 }, (_, r) =>
              Array.from({ length: COLS + 1 }, (_, c) => (
                <rect
                  key={`target-${c}-${r}`}
                  x={c * GRID_SIZE - GRID_SIZE / 2}
                  y={r * GRID_SIZE - GRID_SIZE / 2}
                  width={GRID_SIZE}
                  height={GRID_SIZE}
                  fill="transparent"
                  onClick={() => handleGridClick(c, r)}
                />
              ))
            )}

            {/* Wires */}
            {wires.map((wire) => (
              <g key={wire.id}>
                <line
                  x1={wire.startCol * GRID_SIZE}
                  y1={wire.startRow * GRID_SIZE}
                  x2={wire.endCol * GRID_SIZE}
                  y2={wire.endRow * GRID_SIZE}
                  stroke={isSimulating ? '#3b82f6' : '#64748b'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={isSimulating ? 'current-animated' : ''}
                />
                {/* Junction dots */}
                <circle cx={wire.startCol * GRID_SIZE} cy={wire.startRow * GRID_SIZE} r="3" fill={isSimulating ? '#3b82f6' : '#64748b'} />
                <circle cx={wire.endCol * GRID_SIZE} cy={wire.endRow * GRID_SIZE} r="3" fill={isSimulating ? '#3b82f6' : '#64748b'} />
              </g>
            ))}

            {/* Wire-drawing preview */}
            {wireStart && (
              <>
                <circle
                  cx={wireStart.col * GRID_SIZE}
                  cy={wireStart.row * GRID_SIZE}
                  r="6"
                  className="fill-brand-500 animate-pulse"
                  opacity="0.7"
                />
                <text
                  x={wireStart.col * GRID_SIZE}
                  y={wireStart.row * GRID_SIZE - 10}
                  fontSize="9"
                  textAnchor="middle"
                  className="fill-brand-500"
                >
                  {language === 'hi' ? 'अंत बिंदु चुनें' : 'Click end point'}
                </text>
              </>
            )}

            {/* Ghost preview of component being placed/dragged */}
            {ghostPos && (toolboxDrag || dragState) && (
              <g
                transform={`translate(${ghostPos.col * GRID_SIZE}, ${ghostPos.row * GRID_SIZE})`}
                opacity="0.4"
              >
                {toolboxDrag && componentSymbol(toolboxDrag, 'h', TOOLBOX_ITEMS.find(t => t.type === toolboxDrag)?.defaultValue ?? 0, false, false)}
                {dragState && (() => {
                  const comp = components.find(c => c.id === dragState.compId);
                  if (!comp) return null;
                  return componentSymbol(comp.type, comp.orientation, comp.value, false, false);
                })()}
              </g>
            )}

            {/* Placed components */}
            {components.map((comp) => {
              const isSelected = selectedComponent === comp.id;
              const isBlown = result?.fuseBlown.has(comp.id) ?? false;
              const current = result?.branchCurrents.get(comp.id) ?? 0;
              const isDragging = dragState?.compId === comp.id;

              return (
                <g
                  key={comp.id}
                  transform={`translate(${(isDragging && ghostPos ? ghostPos.col : comp.col) * GRID_SIZE}, ${(isDragging && ghostPos ? ghostPos.row : comp.row) * GRID_SIZE})`}
                  className="text-slate-700 dark:text-slate-300"
                  style={{ cursor: selectedTool === 'select' ? 'grab' : 'pointer', opacity: isDragging ? 0.5 : 1 }}
                  onMouseDown={(e) => handleComponentDragStart(e, comp.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedTool === 'select') {
                      setSelectedComponent(comp.id);
                    } else if (selectedTool === 'delete') {
                      deleteComponent(comp.id);
                    }
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (comp.type === 'switch') toggleSwitch(comp.id);
                    else rotateComponent(comp.id);
                  }}
                >
                  {/* Selection highlight */}
                  {isSelected && (
                    <rect
                      x={-4}
                      y={-4}
                      width={(comp.orientation === 'h' ? GRID_SIZE * 2 : GRID_SIZE) + 8}
                      height={(comp.orientation === 'h' ? GRID_SIZE : GRID_SIZE * 2) + 8}
                      rx="6"
                      fill="rgba(59,130,246,0.08)"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="4,3"
                    />
                  )}

                  {/* Terminal dots */}
                  {(() => {
                    const terms = getTerminals({ ...comp, col: 0, row: 0 });
                    return (
                      <>
                        <circle cx={terms.a.col * GRID_SIZE} cy={terms.a.row * GRID_SIZE} r="4" fill="#3b82f6" opacity="0.6" />
                        <circle cx={terms.b.col * GRID_SIZE} cy={terms.b.row * GRID_SIZE} r="4" fill="#3b82f6" opacity="0.6" />
                      </>
                    );
                  })()}

                  {componentSymbol(comp.type, comp.orientation, comp.value, isSelected, isBlown)}

                  {/* Value label */}
                  <text
                    x={comp.orientation === 'h' ? GRID_SIZE : GRID_SIZE * 0.7 + 14}
                    y={comp.orientation === 'h' ? -8 : GRID_SIZE}
                    fontSize="9"
                    textAnchor="middle"
                    fontWeight="600"
                    className="fill-slate-500 dark:fill-slate-400"
                  >
                    {comp.type === 'battery' ? `${comp.value}V` :
                     comp.type === 'resistor' || comp.type === 'lamp' ? formatResistance(comp.value) :
                     comp.type === 'fuse' ? `${comp.value}A` :
                     comp.type === 'switch' ? (comp.value === 1 ? (language === 'hi' ? 'बंद' : 'ON') : (language === 'hi' ? 'खुला' : 'OFF')) :
                     ''}
                  </text>

                  {/* Current reading */}
                  {isSimulating && Math.abs(current) > 0.0001 && (
                    <text
                      x={comp.orientation === 'h' ? GRID_SIZE : -18}
                      y={comp.orientation === 'h' ? (GRID_SIZE + 14) : GRID_SIZE}
                      fontSize="8"
                      textAnchor="middle"
                      className="fill-brand-600 dark:fill-brand-400"
                      fontFamily="monospace"
                    >
                      {formatCurrent(current)}
                    </text>
                  )}

                  {/* Blown fuse indicator */}
                  {isBlown && (
                    <text
                      x={comp.orientation === 'h' ? GRID_SIZE : GRID_SIZE / 2}
                      y={comp.orientation === 'h' ? GRID_SIZE / 2 + 4 : GRID_SIZE}
                      fontSize="16"
                      textAnchor="middle"
                    >
                      💥
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interaction hints */}
          <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 px-1">
            <span>👆 {language === 'hi' ? 'क्लिक = चुनें' : 'Click = Select'}</span>
            <span>🖱️ {language === 'hi' ? 'ड्रैग = स्थानांतरित करें' : 'Drag = Move'}</span>
            <span>🔄 {language === 'hi' ? 'डबल-क्लिक = घुमाएं/टॉगल' : 'Double-click = Rotate/Toggle'}</span>
            <span>➖ {language === 'hi' ? 'वायर: 2 बिंदुओं पर क्लिक करें' : 'Wire: click 2 grid points'}</span>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Simulation Results */}
          {result && (
            <div className={`card p-4 border-l-4 ${result.error ? 'border-l-red-500' : 'border-l-green-500'}`}>
              <h3 className="font-semibold text-sm mb-2">
                {result.error ? '❌' : '✅'} {t('sim.results')}
              </h3>
              {result.error ? (
                <p className="text-xs text-red-600 dark:text-red-400">{result.error}</p>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{language === 'hi' ? 'नोड वोल्टेज:' : 'Node Voltages:'}</span>
                    <div className="mt-1 space-y-0.5 font-mono bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-2">
                      {result.nodeVoltages.map((v, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="text-slate-500">N{i}{i === 0 ? ' (GND)' : ''}</span>
                          <span className="text-brand-600 dark:text-brand-400 font-semibold">{formatVoltage(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{language === 'hi' ? 'धारा:' : 'Currents:'}</span>
                    <div className="mt-1 space-y-0.5 font-mono bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-2">
                      {components.map((comp) => {
                        const current = result.branchCurrents.get(comp.id) ?? 0;
                        return (
                          <div key={comp.id} className="flex justify-between">
                            <span className="truncate mr-2 text-slate-500">{comp.label || comp.id}</span>
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">{formatCurrent(current)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{language === 'hi' ? 'शक्ति:' : 'Power:'}</span>
                    <div className="mt-1 space-y-0.5 font-mono bg-slate-50 dark:bg-surface-dark-2 rounded-lg p-2">
                      {components.filter(c => c.type !== 'wire' && c.type !== 'switch').map((comp) => {
                        const power = result.componentPower.get(comp.id) ?? 0;
                        return (
                          <div key={comp.id} className="flex justify-between">
                            <span className="truncate mr-2 text-slate-500">{comp.label || comp.id}</span>
                            <span className="text-green-600 dark:text-green-400 font-semibold">{formatPower(power)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {result.fuseBlown.size > 0 && (
                    <p className="text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                      ⚠️ {language === 'hi' ? 'फ्यूज उड़ गया!' : 'Fuse blown!'} ({result.fuseBlown.size})
                    </p>
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
              <div className="card p-4 border-l-4 border-l-brand-500">
                <h3 className="font-semibold text-sm mb-3">{language === 'hi' ? '⚙️ गुण' : '⚙️ Properties'}</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{language === 'hi' ? 'प्रकार:' : 'Type:'}</span>
                    <span className="font-medium">{t(`sim.${comp.type}`)}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">{comp.orientation === 'h' ? '↔' : '↕'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{language === 'hi' ? 'स्थिति:' : 'Position:'}</span>
                    <span className="font-mono">({comp.col}, {comp.row})</span>
                  </div>
                  {(comp.type === 'resistor' || comp.type === 'lamp') && (
                    <div>
                      <label className="text-slate-500 block mb-1">{language === 'hi' ? 'प्रतिरोध (Ω)' : 'Resistance (Ω)'}</label>
                      <input
                        type="number"
                        value={comp.value}
                        onChange={(e) => updateComponentValue(comp.id, Number(e.target.value) || 1)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-sm"
                        min="1"
                      />
                    </div>
                  )}
                  {comp.type === 'battery' && (
                    <div>
                      <label className="text-slate-500 block mb-1">{language === 'hi' ? 'वोल्टेज (V)' : 'Voltage (V)'}</label>
                      <input
                        type="number"
                        value={comp.value}
                        onChange={(e) => updateComponentValue(comp.id, Number(e.target.value) || 1)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-sm"
                        min="0.5"
                        step="0.5"
                      />
                    </div>
                  )}
                  {comp.type === 'fuse' && (
                    <div>
                      <label className="text-slate-500 block mb-1">{language === 'hi' ? 'रेटिंग (A)' : 'Rating (A)'}</label>
                      <input
                        type="number"
                        value={comp.value}
                        onChange={(e) => updateComponentValue(comp.id, Number(e.target.value) || 1)}
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark text-sm"
                        min="0.5"
                        step="0.5"
                      />
                    </div>
                  )}
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => rotateComponent(comp.id)} className="flex-1 btn-secondary text-xs px-3 py-1.5 rounded-lg">
                      🔄 {language === 'hi' ? 'घुमाएं' : 'Rotate'}
                    </button>
                    {comp.type === 'switch' && (
                      <button onClick={() => toggleSwitch(comp.id)} className="flex-1 btn-secondary text-xs px-3 py-1.5 rounded-lg">
                        ⏻ {comp.value === 1 ? (language === 'hi' ? 'खोलें' : 'Open') : (language === 'hi' ? 'बंद करें' : 'Close')}
                      </button>
                    )}
                    <button onClick={() => deleteComponent(comp.id)} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Help card */}
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-2">💡 {language === 'hi' ? 'सहायता' : 'Quick Guide'}</h3>
            <ul className="text-xs text-slate-500 space-y-1.5">
              <li>🔧 {language === 'hi' ? 'टूलबार से कॉम्पोनेंट ड्रैग करके ग्रिड पर रखें' : 'Drag components from toolbar onto the grid'}</li>
              <li>🖱️ {language === 'hi' ? 'ग्रिड पर ड्रैग करके स्थानांतरित करें' : 'Drag placed components to reposition'}</li>
              <li>🔄 {language === 'hi' ? 'डबल-क्लिक करके घुमाएं (स्विच टॉगल होगा)' : 'Double-click to rotate (toggles switches)'}</li>
              <li>➖ {language === 'hi' ? 'वायर मोड: दो ग्रिड बिंदुओं पर क्लिक करें' : 'Wire mode: click two grid points to connect'}</li>
              <li>▶ {language === 'hi' ? '"चलाएं" दबाकर सिमुलेशन शुरू करें' : 'Press "Run" to simulate the circuit'}</li>
              <li className="text-brand-600 dark:text-brand-400 font-medium pt-1">
                💡 {language === 'hi' ? 'प्रीसेट सर्किट से शुरू करें!' : 'Start with a preset circuit!'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
