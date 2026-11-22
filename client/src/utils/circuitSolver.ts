/**
 * Deterministic DC Circuit Solver using Modified Nodal Analysis (MNA)
 * Solves for node voltages and branch currents in DC resistive networks
 */

export type ComponentType = 'battery' | 'resistor' | 'lamp' | 'switch' | 'wire' | 'ammeter' | 'fuse' | 'ground';

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  nodeA: number; // node index
  nodeB: number; // node index
  value: number; // resistance (ohm), voltage (V), current rating (A)
  label?: string;
}

export interface CircuitNode {
  id: number;
  x: number;
  y: number;
  voltage?: number;
}

export interface SolverResult {
  nodeVoltages: number[];
  branchCurrents: Map<string, number>;
  componentPower: Map<string, number>;
  error?: string;
  fuseBlown: Set<string>;
}

/**
 * Gaussian elimination with partial pivoting for solving Ax = b
 */
function gaussianSolve(A: number[][], b: number[]): number[] | null {
  const n = A.length;
  // Augment matrix
  const aug: number[][] = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    // Partial pivoting
    let maxRow = col;
    let maxVal = Math.abs(aug[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > maxVal) {
        maxVal = Math.abs(aug[row][col]);
        maxRow = row;
      }
    }
    if (maxVal < 1e-12) return null; // Singular matrix

    // Swap rows
    if (maxRow !== col) {
      [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];
    }

    // Eliminate below
    for (let row = col + 1; row < n; row++) {
      const factor = aug[row][col] / aug[col][col];
      for (let j = col; j <= n; j++) {
        aug[row][j] -= factor * aug[col][j];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let row = n - 1; row >= 0; row--) {
    if (Math.abs(aug[row][row]) < 1e-12) return null;
    x[row] = aug[row][n];
    for (let col = row + 1; col < n; col++) {
      x[row] -= aug[row][col] * x[col];
    }
    x[row] /= aug[row][row];
  }

  return x;
}

/**
 * Solve a DC circuit using Modified Nodal Analysis
 * Node 0 is always ground (reference node, V=0)
 *
 * MNA stamps:
 * - Resistor between nodes i,j with R:
 *     G[i][i] += 1/R, G[j][j] += 1/R, G[i][j] -= 1/R, G[j][i] -= 1/R
 * - Voltage source (battery) between nodes i (+) and j (-) with voltage V:
 *     Adds an extra variable (current through source)
 *     Row for the extra variable: V[i] - V[j] = V
 *     KCL at node i: adds +I_source, at node j: adds -I_source
 */
export function solveCircuit(
  nodeCount: number,
  components: CircuitComponent[]
): SolverResult {
  const fuseBlown = new Set<string>();

  // Find switches that are open — they break the circuit
  const openSwitches = components.filter(c => c.type === 'switch' && c.value === 0);

  // Count voltage sources for MNA expansion
  const voltageSources = components.filter(c => c.type === 'battery');
  const vsCount = voltageSources.length;

  // Matrix size: (nodeCount - 1) for voltages (node 0 is ground) + vsCount for source currents
  const n = nodeCount - 1 + vsCount;

  if (n === 0) {
    return {
      nodeVoltages: [0],
      branchCurrents: new Map(),
      componentPower: new Map(),
      fuseBlown,
    };
  }

  // Initialize matrices
  const G: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  const rhs: number[] = new Array(n).fill(0);

  // Helper to map node id to matrix index (node 0 → ground, not in matrix)
  const idx = (node: number) => node - 1;

  // Stamp resistive elements (resistor, lamp, fuse with resistance, wire ≈ 0.001Ω)
  for (const comp of components) {
    // Skip open switches
    if (comp.type === 'switch' && comp.value === 0) continue;

    let resistance: number;

    switch (comp.type) {
      case 'resistor':
      case 'lamp':
        resistance = comp.value > 0 ? comp.value : 1e-3;
        break;
      case 'fuse':
        resistance = 0.01; // near-zero resistance
        break;
      case 'wire':
      case 'switch': // closed switch
      case 'ammeter':
        resistance = 1e-3; // near-zero
        break;
      case 'battery':
      case 'ground':
        continue; // handled separately
      default:
        continue;
    }

    const g = 1 / resistance;
    const a = comp.nodeA;
    const b = comp.nodeB;

    if (a !== 0) G[idx(a)][idx(a)] += g;
    if (b !== 0) G[idx(b)][idx(b)] += g;
    if (a !== 0 && b !== 0) {
      G[idx(a)][idx(b)] -= g;
      G[idx(b)][idx(a)] -= g;
    }
  }

  // Stamp voltage sources
  for (let v = 0; v < vsCount; v++) {
    const vs = voltageSources[v];
    const matIdx = nodeCount - 1 + v; // matrix row/col for this source current
    const a = vs.nodeA; // positive terminal
    const b = vs.nodeB; // negative terminal

    // KCL stamp: current leaves node a, enters node b
    if (a !== 0) G[idx(a)][matIdx] += 1;
    if (b !== 0) G[idx(b)][matIdx] -= 1;

    // Voltage constraint: V_a - V_b = vs.value
    if (a !== 0) G[matIdx][idx(a)] += 1;
    if (b !== 0) G[matIdx][idx(b)] -= 1;
    rhs[matIdx] = vs.value;
  }

  // Solve
  const solution = gaussianSolve(G, rhs);

  if (!solution) {
    return {
      nodeVoltages: new Array(nodeCount).fill(0),
      branchCurrents: new Map(),
      componentPower: new Map(),
      error: 'Circuit has no unique solution. Check for open circuits or conflicting voltage sources.',
      fuseBlown,
    };
  }

  // Extract node voltages (node 0 = 0V ground)
  const nodeVoltages = [0, ...solution.slice(0, nodeCount - 1)];

  // Calculate branch currents and power
  const branchCurrents = new Map<string, number>();
  const componentPower = new Map<string, number>();

  for (const comp of components) {
    if (comp.type === 'switch' && comp.value === 0) {
      branchCurrents.set(comp.id, 0);
      componentPower.set(comp.id, 0);
      continue;
    }
    if (comp.type === 'ground') continue;

    const va = nodeVoltages[comp.nodeA] ?? 0;
    const vb = nodeVoltages[comp.nodeB] ?? 0;
    let current = 0;

    if (comp.type === 'battery') {
      // Current from MNA solution
      const vsIdx = voltageSources.indexOf(comp);
      current = solution[nodeCount - 1 + vsIdx];
    } else {
      let resistance: number;
      switch (comp.type) {
        case 'resistor':
        case 'lamp':
          resistance = comp.value > 0 ? comp.value : 1e-3;
          break;
        case 'fuse':
          resistance = 0.01;
          break;
        default:
          resistance = 1e-3;
      }
      current = (va - vb) / resistance;
    }

    branchCurrents.set(comp.id, current);

    // Power: P = V * I for sources, P = I²R for resistors
    if (comp.type === 'battery') {
      componentPower.set(comp.id, comp.value * Math.abs(current));
    } else {
      componentPower.set(comp.id, (va - vb) * current);
    }

    // Check fuses
    if (comp.type === 'fuse' && Math.abs(current) > comp.value) {
      fuseBlown.add(comp.id);
    }
  }

  return { nodeVoltages, branchCurrents, componentPower, fuseBlown };
}

// Utility: format values with units
export function formatVoltage(v: number): string {
  if (Math.abs(v) < 0.001) return '0 V';
  if (Math.abs(v) < 1) return `${(v * 1000).toFixed(1)} mV`;
  return `${v.toFixed(2)} V`;
}

export function formatCurrent(i: number): string {
  const absI = Math.abs(i);
  if (absI < 0.001) return '0 A';
  if (absI < 1) return `${(i * 1000).toFixed(1)} mA`;
  return `${i.toFixed(3)} A`;
}

export function formatResistance(r: number): string {
  if (r >= 1e6) return `${(r / 1e6).toFixed(1)} MΩ`;
  if (r >= 1e3) return `${(r / 1e3).toFixed(1)} kΩ`;
  return `${r.toFixed(0)} Ω`;
}

export function formatPower(p: number): string {
  const absP = Math.abs(p);
  if (absP < 0.001) return '0 W';
  if (absP < 1) return `${(p * 1000).toFixed(1)} mW`;
  return `${p.toFixed(2)} W`;
}
