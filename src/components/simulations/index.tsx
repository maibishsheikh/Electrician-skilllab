import { ComponentType } from 'react';
import { ShockSim, OhmsLawSim, SeriesParallelSim, WheatstoneSim, ACWaveformSim } from './basics';
import { BatteryPackSim, SolarCurveSim, IlluminationSim, EnergyBillSim, VoltageDropSim, EVChargingSim } from './power';
import { TransformerSim, ThreePhaseSim, RMFSim, DCMotorSim, AlternatorSim, StarDeltaSim } from './machines';
import { RectifierSim, PWMSim, InverterSim, MCBTripSim, LadderLogicSim } from './electronics';
import { WiringSwitchSim, SymbolMatchSim } from './wiring';

/**
 * Every DGT learning outcome (module) is mapped to a hands-on, interactive
 * simulation that teaches its core idea — no passive instructions.
 * Some sims serve two closely-related modules (e.g. DC machine build & maintain).
 */
export const moduleSimulations: Record<number, ComponentType> = {
  1: ShockSim,            // Workshop Readiness & Safety
  2: VoltageDropSim,      // Wire Joints & Cable Testing (conductor resistance)
  3: OhmsLawSim,          // Electrical & Magnetic Circuits
  4: BatteryPackSim,      // Batteries & Solar Cells
  5: WiringSwitchSim,     // Wiring Systems
  6: WheatstoneSim,       // Earthing (measuring an unknown resistance)
  7: IlluminationSim,     // Electrical Illumination
  8: ACWaveformSim,       // Measuring Instruments (RMS vs peak)
  9: WheatstoneSim,       // Instrument Calibration (null method)
  10: EnergyBillSim,      // Domestic Appliances
  11: TransformerSim,     // Transformers
  12: SymbolMatchSim,     // Engineering Drawing
  13: SeriesParallelSim,  // Workshop Calculation & Science
  14: DCMotorSim,         // DC Machine Commissioning
  15: DCMotorSim,         // DC Machine Maintenance
  16: RMFSim,             // AC Motor Performance
  17: StarDeltaSim,       // AC Motor Maintenance (starters)
  18: AlternatorSim,      // Alternator & MG Set
  19: ThreePhaseSim,      // Parallel Operation (synchronising)
  20: RMFSim,             // Motor Winding (field from windings)
  21: RectifierSim,       // Electronics
  22: LadderLogicSim,     // Control Cabinets
  23: PWMSim,             // AC/DC Speed Control
  24: InverterSim,        // Inverter, UPS & Charger
  25: SolarCurveSim,      // Solar Installation
  26: VoltageDropSim,     // Power Distribution
  27: MCBTripSim,         // Relays & Circuit Breakers
  28: EVChargingSim,      // EV Charging Stations
  29: SymbolMatchSim,     // Engineering Drawing (Y2)
  30: SeriesParallelSim,  // Workshop Calc & Science (Y2)
};

export function getModuleSimulation(id: number): ComponentType | null {
  return moduleSimulations[id] ?? null;
}
