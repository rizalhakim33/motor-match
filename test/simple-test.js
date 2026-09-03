// Simple test for Ball Screw calculation
// This file can be run with: node --experimental-vm-modules test/simple-test.js

const GRAVITY = 9.8;

function calculateBallScrew(profile) {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.9;
  const tA = profile.accelerationTime || 0.2;
  
  const M = params.loadMass || 0;
  const P = params.lead || 10;
  const D = params.ballScrewDiameter || 20;
  const μ = params.frictionCoefficient || 0.1;
  const F = params.externalForce || 0;
  const JB = params.ballScrewInertia || (params.ballScrewMass ? 
    (params.ballScrewMass * D * D / 8) * 1e-6 : 0);
  
  const V = profile.speedRequired;
  const N = (60 * V) / (P * G);
  
  const TW_friction = μ * M * GRAVITY * (P / (2 * Math.PI)) * 1e-3;
  const TW_external = F * (P / (2 * Math.PI)) * 1e-3;
  const TW = TW_friction + TW_external;
  const TL = (TW * G) / η;
  
  const JW = M * Math.pow(P / (2 * Math.PI), 2) * 1e-6 + JB;
  const JL = G * G * JW;
  
  const placeholderMotorInertia = 1.23e-5;
  const inertiaRatio = JL / placeholderMotorInertia;
  
  const JM = placeholderMotorInertia;
  const TA = ((JM + JL) * (2 * Math.PI * N / (60 * tA))) / η;
  
  const T1 = TA + TL;
  const T2 = TL;
  const T3 = TL - TA;
  
  const t1 = tA;
  const t2 = profile.cycleTime - tA - (profile.decelerationTime || tA);
  const t3 = profile.decelerationTime || tA;
  const t4 = 0;
  
  const Trms = Math.sqrt(
    (T1 * T1 * t1 + T2 * T2 * t2 + T3 * T3 * t3) / (t1 + t2 + t3 + t4)
  );
  
  const omega = (2 * Math.PI * N) / 60;
  const requiredPower = TL * omega;
  
  return {
    rmsTorque: Trms,
    inertiaRatio,
    requiredPower,
    recommendedType: 'servo',
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: TA,
    peakTorque: T1,
    candidateMotors: []
  };
}

// Test case from documentation
const testProfile = {
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

const result = calculateBallScrew(testProfile);

console.log('Ball Screw Calculation Test Results:');
console.log('====================================');
console.log(`Motor Speed (N): ${result.motorSpeed.toFixed(0)} rpm (expected: 1800)`);
console.log(`Load Torque (TL): ${result.loadTorque.toExponential(3)} N·m`);
console.log(`Load Inertia (JL): ${result.loadInertia.toExponential(3)} kg·m²`);
console.log(`Acceleration Torque (TA): ${result.accelerationTorque.toFixed(4)} N·m`);
console.log(`Peak Torque (T1): ${result.peakTorque.toFixed(4)} N·m`);
console.log(`RMS Torque (Trms): ${result.rmsTorque.toFixed(4)} N·m`);
console.log(`Inertia Ratio: ${result.inertiaRatio.toFixed(1)}`);

// Validate against expected values
const expectedN = 1800;
const expectedJL = 1.63e-4;
const expectedTrms = 0.083;

console.log('\nValidation:');
console.log(`Speed check: ${Math.abs(result.motorSpeed - expectedN) < 1 ? 'PASS' : 'FAIL'}`);
console.log(`Inertia check: ${Math.abs(result.loadInertia - expectedJL) < 1e-5 ? 'PASS' : 'FAIL'}`);
console.log(`RMS Torque check: ${Math.abs(result.rmsTorque - expectedTrms) < 0.01 ? 'PASS' : 'FAIL'}`);