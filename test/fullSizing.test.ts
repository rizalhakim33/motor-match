import { calculateBallScrew } from '../src/lib/mechanisms/ballscrew.js';
import { calculateFullSizing } from '../src/lib/fullSizing.js';
import { MechanismProfile, MotorCatalogEntry } from '../src/types/index.js';

// Test case: Ball Screw with M=5kg, P=10mm, D=20mm
const profile: MechanismProfile = {
  group: 'Linear Motion',
  mechanismType: 'Ball Screw',
  speedRequired: 300,
  cycleTime: 1,
  needsPrecisePosition: false,
  mechanismParams: {
    loadMass: 5,
    lead: 10,
    ballScrewDiameter: 20,
    ballScrewMass: 3,
    frictionCoefficient: 0.1,
    externalForce: 0
  },
  accelerationTime: 0.2,
  decelerationTime: 0.2,
  gearRatio: 1,
  efficiency: 1
};

// Motor: Mitsubishi HG-KR13 (100W, 0.318 N·m, JM=2.97e-5 kg·m²)
const motor: MotorCatalogEntry = {
  id: 'test-motor',
  brand: 'Mitsubishi',
  series: 'HG-KR',
  model: 'HG-KR13',
  motorType: 'servo',
  voltage: '200V',
  ratedPower: 100,
  ratedTorque: 0.318,
  maxTorque: 0.955,
  ratedSpeed: 3000,
  maxSpeed: 6000,
  rotorInertia: 0.0000297,
  weight: 0.55,
  shaftDiameter: 8,
  brakeAvailable: false,
  costTier: 3,
  availability: 'local'
};

const basicResult = calculateBallScrew(profile);
const fullResult = calculateFullSizing(basicResult, motor, 1, 0.2, 0.2, 1);

console.log('=== Full Sizing Test (Ball Screw + HG-KR13) ===');
console.log('TL:', basicResult.loadTorque.toFixed(6), 'N·m');
console.log('JL:', basicResult.loadInertia.toExponential(3), 'kg·m²');
console.log('N:', basicResult.motorSpeed, 'rpm');
console.log('');
console.log('--- Full Sizing Results ---');
console.log('JL/JM ratio:', fullResult.actualInertiaRatio.toFixed(1));
console.log('TA:', fullResult.actualAccelerationTorque.toFixed(4), 'N·m');
console.log('Peak torque:', fullResult.actualPeakTorque.toFixed(4), 'N·m');
console.log('RMS torque:', fullResult.actualRmsTorque.toFixed(4), 'N·m');
console.log('');
console.log('--- Feasibility ---');
console.log('Duty cycle OK:', fullResult.dutyCycleSatisfied, '(Trms < Trated)');
console.log('Peak torque OK:', fullResult.peakTorqueSatisfied, '(Tpeak < Tmax)');
console.log('Inertia ratio OK:', fullResult.inertiaRatioSatisfied, '(JL/JM < 30)');
if (fullResult.recommendedGearRatio) {
  console.log('Gear ratio recommendation:', fullResult.recommendedGearRatio, ':1');
}

// Validate: JL/JM should be approximately 13.2 (from documentation)
const expectedRatio = basicResult.loadInertia / motor.rotorInertia;
const ratioMatch = Math.abs(fullResult.actualInertiaRatio - expectedRatio) < 0.1;
console.log('');
console.log('JL/JM validation:', ratioMatch ? 'PASS' : 'FAIL', `(expected ${expectedRatio.toFixed(1)}, got ${fullResult.actualInertiaRatio.toFixed(1)})`);

// Validate: TA should be (JM + JL) * alpha, alpha = omega / tA
const omega = (2 * Math.PI * 1800) / 60; // actual motor speed, not rated
const expectedTA = motor.rotorInertia * (omega / 0.2) + basicResult.loadInertia * (omega / 0.2);
const taMatch = Math.abs(fullResult.actualAccelerationTorque - expectedTA) < 0.001;
console.log('TA validation:', taMatch ? 'PASS' : 'FAIL', `(expected ${expectedTA.toFixed(4)}, got ${fullResult.actualAccelerationTorque.toFixed(4)})`);

// Peak torque should be TL + TA
const expectedPeak = basicResult.loadTorque + fullResult.actualAccelerationTorque;
const peakMatch = Math.abs(fullResult.actualPeakTorque - expectedPeak) < 0.001;
console.log('Peak torque validation:', peakMatch ? 'PASS' : 'FAIL', `(expected ${expectedPeak.toFixed(4)}, got ${fullResult.actualPeakTorque.toFixed(4)})`);
