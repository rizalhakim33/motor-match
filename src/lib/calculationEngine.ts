import { MechanismProfile, SizingResult, MechanismType } from '@/types';
import { calculateBallScrew } from './mechanisms/ballscrew';
import { calculateConveyor } from './mechanisms/conveyor';
import { calculateGenericRotary } from './mechanisms/genericRotary';
import { calculateFan } from './mechanisms/fan';
import { calculateRackPinion } from './mechanisms/rackPinion';
import { calculateSprocketChain } from './mechanisms/sprocketChain';
import { calculateRollFeed } from './mechanisms/rollFeed';
import { calculateCart } from './mechanisms/cart';
import { calculateLinearServo } from './mechanisms/linearServo';
import { calculateGenericLinear } from './mechanisms/genericLinear';
import { calculateRotaryTable } from './mechanisms/rotaryTable';
import { calculatePump } from './mechanisms/pump';
import { calculateElevatorHoist } from './mechanisms/elevatorHoist';
import { determineMotorType } from './decisionRules';
import { findCandidateMotors } from './motorCatalog';

export function calculateSizing(profile: MechanismProfile): SizingResult {
  let result: SizingResult;
  
  switch (profile.mechanismType) {
    case 'Ball Screw':
      result = calculateBallScrew(profile);
      break;
    case 'Conveyor (Belt)':
      result = calculateConveyor(profile);
      break;
    case 'Generic (rotary)':
      result = calculateGenericRotary(profile);
      break;
    case 'Fan':
      result = calculateFan(profile);
      break;
    case 'Rack and Pinion':
      result = calculateRackPinion(profile);
      break;
    case 'Sprocket & Chain':
      result = calculateSprocketChain(profile);
      break;
    case 'Roll Feed':
      result = calculateRollFeed(profile);
      break;
    case 'Cart':
      result = calculateCart(profile);
      break;
    case 'Linear Servo':
      result = calculateLinearServo(profile);
      break;
    case 'Generic (linear)':
      result = calculateGenericLinear(profile);
      break;
    case 'Rotary Table':
      result = calculateRotaryTable(profile);
      break;
    case 'Pump':
      result = calculatePump(profile);
      break;
    case 'Elevator/hoist':
      result = calculateElevatorHoist(profile);
      break;
    default:
      // For mechanisms not yet implemented, use generic rotary as fallback
      result = calculateGenericRotary(profile);
      break;
  }
  
  // Apply decision rules to determine motor type
  const recommendation = determineMotorType(profile, result);
  result.recommendedType = recommendation.type;
  result.recommendationReason = recommendation.reason;
  
  // Phase 2: Auto-find candidate motors — 2 per brand/pole biar luas tapi semua brand tetap muncul
  const maxForType = recommendation.type === 'induction' ? 12 : 16;
  const candidates = findCandidateMotors(result, recommendation.type, maxForType);
  result.candidateMotors = candidates.map(c => c.motor);
  
  return result;
}

export function getMechanismGroups() {
  return [
    {
      name: 'Linear Motion' as const,
      mechanisms: [
        'Ball Screw',
        'Rack and Pinion',
        'Roll Feed',
        'Sprocket & Chain',
        'Conveyor (Belt)',
        'Cart',
        'Linear Servo',
        'Generic (linear)'
      ] as MechanismType[]
    },
    {
      name: 'Rotary Indexing' as const,
      mechanisms: ['Rotary Table'] as MechanismType[]
    },
    {
      name: 'Rotary Continuous' as const,
      mechanisms: ['Fan', 'Pump', 'Generic (rotary)'] as MechanismType[]
    },
    {
      name: 'Vertical/Hoisting' as const,
      mechanisms: ['Elevator/hoist'] as MechanismType[]
    }
  ];
}

export const LINEAR_TYPES: MechanismType[] = ['Ball Screw','Rack and Pinion','Roll Feed','Sprocket & Chain','Conveyor (Belt)','Cart','Linear Servo','Generic (linear)'];
export const ELEVATOR_TYPES: MechanismType[] = ['Elevator/hoist'];
export function isLinearMechanism(type: MechanismType) { return LINEAR_TYPES.includes(type); }
export function isElevatorMechanism(type: MechanismType) { return ELEVATOR_TYPES.includes(type); }
export function getMechanismGroupForType(mechanismType: MechanismType) {
  for (const g of getMechanismGroups()) if ((g.mechanisms as readonly string[]).includes(mechanismType)) return g.name;
  return null;
}

export function getMechanismParameters(mechanismType: MechanismType) {
  const parameters: Record<MechanismType, { name: string; symbol: string; unit: string; required: boolean }[]> = {
    'Ball Screw': [
      { name: 'Lead', symbol: 'P', unit: 'mm', required: true },
      { name: 'Load Mass', symbol: 'M', unit: 'kg', required: true },
      { name: 'Ball Screw Diameter', symbol: 'D', unit: 'mm', required: true },
      { name: 'Ball Screw Mass', symbol: 'M_screw', unit: 'kg', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false },
      { name: 'External Force', symbol: 'F', unit: 'N', required: false },
      { name: 'Tilt Angle', symbol: 'θ', unit: '°', required: false }
    ],
    'Conveyor (Belt)': [
      { name: 'Driver Roller Diameter', symbol: 'D1', unit: 'mm', required: true },
      { name: 'Idle Roller Diameter', symbol: 'D2', unit: 'mm', required: false },
      { name: 'Driver Roller Mass', symbol: 'M1', unit: 'kg', required: true },
      { name: 'Idle Roller Mass', symbol: 'M2', unit: 'kg', required: false },
      { name: 'Load Mass', symbol: 'M3', unit: 'kg', required: true },
      { name: 'Belt Mass', symbol: 'M4', unit: 'kg', required: false },
      { name: 'Tilt Angle', symbol: 'θ', unit: '°', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false }
    ],
    'Generic (rotary)': [
      { name: 'Load Torque', symbol: 'Tc', unit: 'N·m', required: true },
      { name: 'Load Inertia', symbol: 'Jl', unit: 'kg·m²', required: true }
    ],
    'Fan': [
      { name: 'Flow Rate', symbol: 'Q', unit: 'm³/s', required: true },
      { name: 'Fan Inertia', symbol: 'Jf', unit: 'kg·m²', required: true }
    ],
    'Rack and Pinion': [
      { name: 'Pinion Diameter', symbol: 'D', unit: 'mm', required: true },
      { name: 'Load Mass', symbol: 'M', unit: 'kg', required: true },
      { name: 'Pull Force', symbol: 'F', unit: 'N', required: true },
      { name: 'Tilt Angle', symbol: 'θ', unit: '°', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false }
    ],
    'Sprocket & Chain': [
      { name: 'Sprocket Diameter', symbol: 'D', unit: 'mm', required: true },
      { name: 'Chain Pull Force', symbol: 'F', unit: 'N', required: true },
      { name: 'Load Mass', symbol: 'M', unit: 'kg', required: true },
      { name: 'Tilt Angle', symbol: 'θ', unit: '°', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false }
    ],
    'Roll Feed': [
      { name: 'Roll Diameter A', symbol: 'Dra', unit: 'mm', required: true },
      { name: 'Roll Diameter B', symbol: 'Drb', unit: 'mm', required: true },
      { name: 'Clamping Force', symbol: 'Fn', unit: 'N', required: true },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false },
      { name: 'Roller Mass A', symbol: 'MrollA', unit: 'kg', required: false },
      { name: 'Roller Mass B', symbol: 'MrollB', unit: 'kg', required: false }
    ],
    'Cart': [
      { name: 'Wheel Diameter', symbol: 'Dwh', unit: 'm', required: true },
      { name: 'Cart Weight', symbol: 'Wcart', unit: 'kg', required: true },
      { name: 'Load Weight', symbol: 'Wl', unit: 'kg', required: true },
      { name: 'Tilt Angle', symbol: 'θ', unit: '°', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false }
    ],
    'Linear Servo': [
      { name: 'Friction Force', symbol: 'Ff', unit: 'N', required: true },
      { name: 'Cutting Force', symbol: 'Fc', unit: 'N', required: true },
      { name: 'Traveler Weight', symbol: 'Wt', unit: 'kg', required: true },
      { name: 'Linear Speed', symbol: 'V', unit: 'm/s', required: true },
      { name: 'Tilt Angle', symbol: 'θ', unit: '°', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false }
    ],
    'Generic (linear)': [
      { name: 'Force', symbol: 'Fc', unit: 'N', required: true },
      { name: 'Speed', symbol: 'V', unit: 'm/s', required: true },
      { name: 'Load Weight', symbol: 'Wl', unit: 'kg', required: true },
      { name: 'Effective Radius', symbol: 'r', unit: 'm', required: true },
      { name: 'Tilt Angle', symbol: 'θ', unit: '°', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false }
    ],
    'Rotary Table': [
      { name: 'Table Diameter', symbol: 'Dt', unit: 'm', required: true },
      { name: 'Load Radius', symbol: 'R', unit: 'm', required: true },
      { name: 'Load Mass', symbol: 'Wl', unit: 'kg', required: true },
      { name: 'Table Mass', symbol: 'Mtable', unit: 'kg', required: false },
      { name: 'Tilt Angle', symbol: 'θ', unit: '°', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false }
    ],
    'Pump': [
      { name: 'Flow Rate', symbol: 'Q', unit: 'm³/s', required: true },
      { name: 'Pump Inertia', symbol: 'Jp', unit: 'kg·m²', required: true },
      { name: 'Pump Type', symbol: 'pumpType', unit: '', required: false },
      { name: 'Pressure Rise', symbol: 'deltaP', unit: 'Pa', required: false },
      { name: 'Displacement', symbol: 'displacement', unit: 'm³/rev', required: false }
    ],
    'Elevator/hoist': [
      { name: 'Drum Diameter', symbol: 'D', unit: 'mm', required: true },
      { name: 'Counterweight Mass', symbol: 'M1', unit: 'kg', required: true },
      { name: 'Load Mass', symbol: 'M2', unit: 'kg', required: true },
      { name: 'External Force', symbol: 'F', unit: 'N', required: false },
      { name: 'Friction Coefficient', symbol: 'μ', unit: '', required: false },
      { name: 'Drum Mass', symbol: 'Mdrum', unit: 'kg', required: false }
    ]
  };
  
  return parameters[mechanismType] || [];
}