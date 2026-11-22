import { ComponentType } from 'react';
import { SafetySim } from './safety';
import { OhmsLawSim, SeriesParallelSim, WheatstoneSim, ACWaveformSim } from './basics';
import { BatteryPackSim, SolarCurveSim, IlluminationSim, EnergyBillSim, VoltageDropSim, EVChargingSim } from './power';
import { CableTestSim, EarthResistanceSim, MeterRangeSim, PowerTriangleSim } from './testing';
import {
  TransformerSim, RMFSim, DCMotorSim, AlternatorSim, StarDeltaSim,
  DCGeneratorSim, SynchroscopeSim, MotorWindingSim,
} from './machines';
import { RectifierSim, PWMSim, InverterSim, MCBTripSim, LadderLogicSim } from './electronics';
import { WiringSwitchSim, SymbolMatchSim, ControlSymbolMatchSim } from './wiring';

/**
 * Every one of the 30 DGT learning outcomes now has its OWN dedicated,
 * interactive simulation that teaches that module's core skill.
 */
export const moduleSimulations: Record<number, ComponentType> = {
  1: SafetySim,               // Workshop Readiness & Safety
  2: CableTestSim,            // Wire Joints & Cable Testing — megger/IR
  3: OhmsLawSim,              // Electrical & Magnetic Circuits
  4: BatteryPackSim,          // Batteries & Solar Cells
  5: WiringSwitchSim,         // Wiring Systems
  6: EarthResistanceSim,      // Earthing — electrode resistance
  7: IlluminationSim,         // Electrical Illumination
  8: MeterRangeSim,           // Measuring Instruments — range extension
  9: WheatstoneSim,           // Instrument Calibration — null method
  10: EnergyBillSim,          // Domestic Appliances
  11: TransformerSim,         // Transformers
  12: SymbolMatchSim,         // Engineering Drawing — basic symbols
  13: SeriesParallelSim,      // Workshop Calculation & Science
  14: DCGeneratorSim,         // DC Machine Commissioning — EMF build-up
  15: DCMotorSim,             // DC Machine Maintenance — back-EMF/speed
  16: RMFSim,                 // AC Motor Performance — rotating field
  17: StarDeltaSim,           // AC Motor Maintenance — starters
  18: AlternatorSim,          // Alternator & MG Set — frequency
  19: SynchroscopeSim,        // Parallel Operation — synchronising
  20: MotorWindingSim,        // Motor Winding — lap/wave
  21: RectifierSim,           // Electronics — rectifier
  22: LadderLogicSim,         // Control Cabinets — DOL logic
  23: PWMSim,                 // AC/DC Speed Control — PWM
  24: InverterSim,            // Inverter, UPS & Charger
  25: SolarCurveSim,          // Solar Installation — I-V/P-V
  26: VoltageDropSim,         // Power Distribution — voltage drop
  27: MCBTripSim,             // Relays & Circuit Breakers — trip curve
  28: EVChargingSim,          // EV Charging Stations
  29: ControlSymbolMatchSim,  // Engineering Drawing (Y2) — control symbols
  30: PowerTriangleSim,       // Workshop Calc & Science (Y2) — power factor
};

/** Modules sharing a theme-appropriate secondary sim can still reach AC fundamentals. */
export { ACWaveformSim };

export function getModuleSimulation(id: number): ComponentType | null {
  return moduleSimulations[id] ?? null;
}
