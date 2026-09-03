const { calculateBallScrew } = require('./src/lib/mechanisms/ballscrew');

// Test case from documentation:
// M=5kg, P=10mm, D=20mm, massa screw=3kg, μ=0.1, direct-drive (G=1, η=1), V=300mm/s, tA=0.2s
const testProfile = {
  group: 'Linear Motion',
  mechanismType: 'Ball Screw',
  speedRequired: 300, // mm/s
  cycleTime: 1,
  needsPrecisePosition: false,
  mechanismParams: {
    loadMass: 5, // M = 5kg
    lead: 10, // P = 10mm
    ballScrewDiameter: 20, // D = 20mm
    ballScrewMass: 3, // massa screw = 3kg
    frictionCoefficient: 0.1, // μ = 0.1
    externalForce: 0 // no external force
  },
  accelerationTime: 0.2,
  decelerationTime: 0.2,
  gearRatio: 1, // G = 1 (direct-drive)
  efficiency: 1 // η = 1
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

// Validate against expected values from documentation
const expectedN = 1800; // rpm
const expectedJL = 1.63e-4; // kg·m²
const expectedTrms = 0.083; // N·m

console.log('\nValidation:');
console.log(`Speed check: ${Math.abs(result.motorSpeed - expectedN) < 1 ? 'PASS' : 'FAIL'}`);
console.log(`Inertia check: ${Math.abs(result.loadInertia - expectedJL) < 1e-5 ? 'PASS' : 'FAIL'}`);
console.log(`RMS Torque check: ${Math.abs(result.rmsTorque - expectedTrms) < 0.01 ? 'PASS' : 'FAIL'}`);