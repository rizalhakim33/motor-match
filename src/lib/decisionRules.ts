import { MechanismProfile, SizingResult, MechanismType } from '@/types';

type MotorRecommendation = {
  type: 'servo' | 'stepper' | 'induction';
  reason: string;
};

export function determineMotorType(
  profile: MechanismProfile, 
  sizingResult: SizingResult
): MotorRecommendation {
  const { mechanismType, needsPrecisePosition } = profile;
  const { rmsTorque, motorSpeed, requiredPower, loadInertia } = sizingResult;

  // Rule 1: Fan or Pump, no precision positioning needed → Induction + VFD
  if ((mechanismType === 'Fan' || mechanismType === 'Pump') && !needsPrecisePosition) {
    return {
      type: 'induction',
      reason: 'Continuous run, variable torque/speed without position feedback needed'
    };
  }

  // Rule 2: Conveyor/Cart, constant speed, no precise positioning → Induction + VFD
  if ((mechanismType === 'Conveyor (Belt)' || mechanismType === 'Cart') && !needsPrecisePosition) {
    return {
      type: 'induction',
      reason: 'Heavy loads, continuous cycle, lower cost solution'
    };
  }

  // Rule 3: Elevator/hoist → Servo with holding brake
  if (mechanismType === 'Elevator/hoist') {
    return {
      type: 'servo',
      reason: 'Requires holding torque when stopped — brake mandatory'
    };
  }

  // Rule 4: Stepper candidate — no precision, low torque, low speed, low cost priority
  // Stepper motors: max ~2.2 N·m, max ~1200 rpm effective, no feedback needed
  if (!needsPrecisePosition && 
      rmsTorque < 2.0 && 
      motorSpeed < 1200 && 
      requiredPower < 80) {
    return {
      type: 'stepper',
      reason: 'Low torque, low speed, no position feedback needed — stepper is cost-effective'
    };
  }

  // Rule 5: High precision positioning → Servo
  if (needsPrecisePosition) {
    return {
      type: 'servo',
      reason: 'Closed-loop control needed for precise positioning'
    };
  }

  // Rule 6: Default fallback → Servo
  return {
    type: 'servo',
    reason: 'Default recommendation — please review manually'
  };
}

export function getDecisionRulesSummary(): string[] {
  return [
    'Fan/Pump without precision → Induction + VFD',
    'Conveyor/Cart without precision → Induction + VFD',
    'Elevator/Hoist → Servo with holding brake',
    'Low torque (<2 N·m) + low speed (<1200 rpm) + no precision → Stepper (cost-effective)',
    'High precision positioning → Servo',
    'Default → Servo (review manually)'
  ];
}
