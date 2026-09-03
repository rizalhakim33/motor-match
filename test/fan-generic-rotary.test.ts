import { calculateFan } from '../src/lib/mechanisms/fan.js';
import { calculateGenericRotary } from '../src/lib/mechanisms/genericRotary.js';
import { MechanismProfile } from '../src/types/index.js';

// ============================================
// TEST 1: Fan dengan G=1 (direct drive)
// ============================================
const fanProfileG1: MechanismProfile = {
  group: 'Rotary Continuous',
  mechanismType: 'Fan',
  speedRequired: 1500, // rpm
  cycleTime: 10,
  needsPrecisePosition: false,
  mechanismParams: {
    flowRate: 2, // m³/s
    fanInertia: 0.1 // kg·m²
  },
  accelerationTime: 2,
  decelerationTime: 2,
  gearRatio: 1,
  efficiency: 0.85
};

const resultFanG1 = calculateFan(fanProfileG1);

console.log('=== FAN TEST G=1 ===');
console.log(`JL = ${resultFanG1.loadInertia.toExponential(3)} kg·m²`);
console.log(`Expected JL = 0.1 (Jf / G² = 0.1 / 1)`);
console.log(`TL = ${resultFanG1.loadTorque.toFixed(4)} N·m`);
console.log(`N = ${resultFanG1.motorSpeed.toFixed(0)} rpm`);

const fanG1Pass = Math.abs(resultFanG1.loadInertia - 0.1) < 1e-10;
console.log(`Fan G=1 JL check: ${fanG1Pass ? 'PASS' : 'FAIL'}`);

// ============================================
// TEST 2: Fan dengan G=2 (rasio gear 2:1)
// ============================================
const fanProfileG2: MechanismProfile = {
  ...fanProfileG1,
  gearRatio: 2
};

const resultFanG2 = calculateFan(fanProfileG2);

console.log('\n=== FAN TEST G=2 ===');
console.log(`JL = ${resultFanG2.loadInertia.toExponential(3)} kg·m²`);
console.log(`Expected JL = 0.025 (Jf / G² = 0.1 / 4)`);
console.log(`TL = ${resultFanG2.loadTorque.toFixed(4)} N·m`);

const expectedJL_Fan_G2 = 0.1 / 4; // 0.025
const fanG2Pass = Math.abs(resultFanG2.loadInertia - expectedJL_Fan_G2) < 1e-10;
console.log(`Fan G=2 JL check: ${fanG2Pass ? 'PASS' : 'FAIL'}`);

// ============================================
// TEST 3: Fan dengan G=0.5 (reduksi 2:1)
// ============================================
const fanProfileG05: MechanismProfile = {
  ...fanProfileG1,
  gearRatio: 0.5
};

const resultFanG05 = calculateFan(fanProfileG05);

console.log('\n=== FAN TEST G=0.5 ===');
console.log(`JL = ${resultFanG05.loadInertia.toExponential(3)} kg·m²`);
console.log(`Expected JL = 0.4 (Jf / G² = 0.1 / 0.25)`);
console.log(`TL = ${resultFanG05.loadTorque.toFixed(4)} N·m`);

const expectedJL_Fan_G05 = 0.1 / 0.25; // 0.4
const fanG05Pass = Math.abs(resultFanG05.loadInertia - expectedJL_Fan_G05) < 1e-10;
console.log(`Fan G=0.5 JL check: ${fanG05Pass ? 'PASS' : 'FAIL'}`);

// ============================================
// TEST 4: Generic Rotary dengan G=1
// ============================================
const genericProfileG1: MechanismProfile = {
  group: 'Rotary Continuous',
  mechanismType: 'Generic (rotary)',
  speedRequired: 1000, // rpm
  cycleTime: 2,
  needsPrecisePosition: true,
  mechanismParams: {
    loadTorque: 5, // N·m
    loadInertia: 0.05 // kg·m²
  },
  accelerationTime: 0.2,
  decelerationTime: 0.2,
  gearRatio: 1,
  efficiency: 0.9
};

const resultGenericG1 = calculateGenericRotary(genericProfileG1);

console.log('\n=== GENERIC ROTARY TEST G=1 ===');
console.log(`JL = ${resultGenericG1.loadInertia.toExponential(3)} kg·m²`);
console.log(`Expected JL = 0.05 (Jl / G² = 0.05 / 1)`);
console.log(`TL = ${resultGenericG1.loadTorque.toFixed(4)} N·m`);

const genericG1Pass = Math.abs(resultGenericG1.loadInertia - 0.05) < 1e-10;
console.log(`Generic G=1 JL check: ${genericG1Pass ? 'PASS' : 'FAIL'}`);

// ============================================
// TEST 5: Generic Rotary dengan G=2
// ============================================
const genericProfileG2: MechanismProfile = {
  ...genericProfileG1,
  gearRatio: 2
};

const resultGenericG2 = calculateGenericRotary(genericProfileG2);

console.log('\n=== GENERIC ROTARY TEST G=2 ===');
console.log(`JL = ${resultGenericG2.loadInertia.toExponential(3)} kg·m²`);
console.log(`Expected JL = 0.0125 (Jl / G² = 0.05 / 4)`);
console.log(`TL = ${resultGenericG2.loadTorque.toFixed(4)} N·m`);

const expectedJL_Generic_G2 = 0.05 / 4; // 0.0125
const genericG2Pass = Math.abs(resultGenericG2.loadInertia - expectedJL_Generic_G2) < 1e-10;
console.log(`Generic G=2 JL check: ${genericG2Pass ? 'PASS' : 'FAIL'}`);

// ============================================
// TEST 6: Generic Rotary dengan G=0.5
// ============================================
const genericProfileG05: MechanismProfile = {
  ...genericProfileG1,
  gearRatio: 0.5
};

const resultGenericG05 = calculateGenericRotary(genericProfileG05);

console.log('\n=== GENERIC ROTARY TEST G=0.5 ===');
console.log(`JL = ${resultGenericG05.loadInertia.toExponential(3)} kg·m²`);
console.log(`Expected JL = 0.2 (Jl / G² = 0.05 / 0.25)`);
console.log(`TL = ${resultGenericG05.loadTorque.toFixed(4)} N·m`);

const expectedJL_Generic_G05 = 0.05 / 0.25; // 0.2
const genericG05Pass = Math.abs(resultGenericG05.loadInertia - expectedJL_Generic_G05) < 1e-10;
console.log(`Generic G=0.5 JL check: ${genericG05Pass ? 'PASS' : 'FAIL'}`);

// ============================================
// SUMMARY
// ============================================
console.log('\n========================================');
console.log('TEST SUMMARY');
console.log('========================================');
const allPass = fanG1Pass && fanG2Pass && fanG05Pass && genericG1Pass && genericG2Pass && genericG05Pass;
console.log(`Fan G=1:      ${fanG1Pass ? 'PASS' : 'FAIL'}`);
console.log(`Fan G=2:      ${fanG2Pass ? 'PASS' : 'FAIL'}`);
console.log(`Fan G=0.5:    ${fanG05Pass ? 'PASS' : 'FAIL'}`);
console.log(`Generic G=1:  ${genericG1Pass ? 'PASS' : 'FAIL'}`);
console.log(`Generic G=2:  ${genericG2Pass ? 'PASS' : 'FAIL'}`);
console.log(`Generic G=0.5: ${genericG05Pass ? 'PASS' : 'FAIL'}`);
console.log(`\nALL TESTS: ${allPass ? 'PASS ✓' : 'FAIL ✗'}`);
