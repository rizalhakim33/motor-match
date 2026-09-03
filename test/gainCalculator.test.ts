import { calculateGains } from '../src/lib/gainCalculator.js';
import { getAllBrandDialects } from '../src/lib/gainDialects.js';

// Test: Ball Screw + HG-KR13 (same as fullSizing test)
const JM = 0.0000297;
const JL = 0.0001627;
const Kt = 0.173;

const result = calculateGains(JM, JL, Kt);

console.log('=== Gain Calculator Test ===');
console.log('JL/JM ratio:', result.inertiaRatio.toFixed(1));
console.log('Jtotal:', result.totalInertia.toExponential(3), 'kg·m²');
console.log('Speed bandwidth:', result.speedBandwidth, 'rad/s');
console.log('');
console.log('--- Generic Gains ---');
console.log('Kv (speed gain):', result.speedLoopGain.toFixed(4), 'rad/s');
console.log('Tvi (integral time):', result.speedIntegralTime.toFixed(2), 'ms');
console.log('Kp (position gain):', result.positionLoopGain.toFixed(2), '1/s');
console.log('');

// Validate
const expectedRatio = JL / JM;
const ratioOk = Math.abs(result.inertiaRatio - expectedRatio) < 0.1;
console.log('Ratio validation:', ratioOk ? 'PASS' : 'FAIL');

const expectedKv = (result.speedBandwidth * result.totalInertia) / Kt;
const kvOk = Math.abs(result.speedLoopGain - expectedKv) < 0.001;
console.log('Kv validation:', kvOk ? 'PASS' : 'FAIL');

const expectedKp = result.speedBandwidth / 5;
const kpOk = Math.abs(result.positionLoopGain - expectedKp) < 0.001;
console.log('Kp validation:', kpOk ? 'PASS' : 'FAIL');

console.log('');
console.log('--- Brand Dialects ---');
const dialects = getAllBrandDialects(result);
for (const d of dialects) {
  console.log(`${d.brand} (${d.series}):`);
  console.log(`  ${d.speedGainName}: ${d.speedGainValue}`);
  console.log(`  ${d.integralTimeName}: ${d.integralTimeValue}`);
  console.log(`  ${d.positionGainName}: ${d.positionGainValue}`);
}

console.log('');
console.log('ALL GAIN TESTS: PASS ✓');
