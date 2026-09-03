import { 
  calculateRackPinion, 
  calculateSprocketChain, 
  calculateRollFeed, 
  calculateCart, 
  calculateLinearServo, 
  calculateGenericLinear, 
  calculateRotaryTable, 
  calculatePump, 
  calculateElevatorHoist 
} from '../src/lib/mechanisms/index.js';
import { MechanismProfile } from '../src/types/index.js';

console.log('=== TESTING NEW MECHANISMS ===\n');

// Test 1: Rack and Pinion
console.log('--- RACK & PINION ---');
const rackProfile: MechanismProfile = {
  group: 'Linear Motion',
  mechanismType: 'Rack and Pinion',
  speedRequired: 1, // m/s
  cycleTime: 1,
  needsPrecisePosition: true,
  mechanismParams: {
    pinionDiameter: 50, // mm
    loadMass: 100, // kg
    pullForce: 500, // N
    tiltAngle: 0,
    frictionCoefficient: 0.1
  },
  accelerationTime: 0.2,
  decelerationTime: 0.2,
  gearRatio: 1,
  efficiency: 0.95
};
const rackResult = calculateRackPinion(rackProfile);
console.log(`N: ${rackResult.motorSpeed.toFixed(0)} rpm`);
console.log(`TL: ${rackResult.loadTorque.toExponential(3)} N·m`);
console.log(`JL: ${rackResult.loadInertia.toExponential(3)} kg·m²`);
console.log(`Trms: ${rackResult.rmsTorque.toExponential(3)} N·m`);
console.log(`Power: ${rackResult.requiredPower.toFixed(1)} W`);

// Test 2: Sprocket & Chain
console.log('\n--- SPROCKET & CHAIN ---');
const sprocketProfile: MechanismProfile = {
  group: 'Linear Motion',
  mechanismType: 'Sprocket & Chain',
  speedRequired: 1, // m/s
  cycleTime: 1,
  needsPrecisePosition: false,
  mechanismParams: {
    sprocketDiameter: 80, // mm
    loadMass: 200, // kg
    chainPullForce: 1000, // N
    tiltAngle: 0,
    frictionCoefficient: 0.4
  },
  accelerationTime: 0.5,
  decelerationTime: 0.5,
  gearRatio: 1,
  efficiency: 0.95
};
const sprocketResult = calculateSprocketChain(sprocketProfile);
console.log(`N: ${sprocketResult.motorSpeed.toFixed(0)} rpm`);
console.log(`TL: ${sprocketResult.loadTorque.toExponential(3)} N·m`);
console.log(`JL: ${sprocketResult.loadInertia.toExponential(3)} kg·m²`);
console.log(`Trms: ${sprocketResult.rmsTorque.toExponential(3)} N·m`);
console.log(`Power: ${sprocketResult.requiredPower.toFixed(1)} W`);

// Test 3: Roll Feed
console.log('\n--- ROLL FEED ---');
const rollFeedProfile: MechanismProfile = {
  group: 'Linear Motion',
  mechanismType: 'Roll Feed',
  speedRequired: 1, // m/s
  cycleTime: 1,
  needsPrecisePosition: true,
  mechanismParams: {
    rollerDiameterA: 100, // mm
    rollerDiameterB: 100, // mm
    clampingForce: 5000, // N
    frictionCoefficient: 0.3,
    rollerMassA: 15, // kg
    rollerMassB: 15 // kg
  },
  accelerationTime: 0.2,
  decelerationTime: 0.2,
  gearRatio: 1,
  efficiency: 0.95
};
const rollFeedResult = calculateRollFeed(rollFeedProfile);
console.log(`N: ${rollFeedResult.motorSpeed.toFixed(0)} rpm`);
console.log(`TL: ${rollFeedResult.loadTorque.toExponential(3)} N·m`);
console.log(`JL: ${rollFeedResult.loadInertia.toExponential(3)} kg·m²`);
console.log(`Trms: ${rollFeedResult.rmsTorque.toExponential(3)} N·m`);
console.log(`Power: ${rollFeedResult.requiredPower.toFixed(1)} W`);

// Test 4: Cart
console.log('\n--- CART ---');
const cartProfile: MechanismProfile = {
  group: 'Linear Motion',
  mechanismType: 'Cart',
  speedRequired: 1, // m/s
  cycleTime: 10,
  needsPrecisePosition: false,
  mechanismParams: {
    wheelDiameter: 0.3, // m
    cartWeight: 200, // kg
    loadWeight: 500, // kg
    tiltAngle: 0,
    frictionCoefficient: 0.02
  },
  accelerationTime: 0.5,
  decelerationTime: 0.5,
  gearRatio: 1,
  efficiency: 0.95
};
const cartResult = calculateCart(cartProfile);
console.log(`N: ${cartResult.motorSpeed.toFixed(0)} rpm`);
console.log(`TL: ${cartResult.loadTorque.toExponential(3)} N·m`);
console.log(`JL: ${cartResult.loadInertia.toExponential(3)} kg·m²`);
console.log(`Trms: ${cartResult.rmsTorque.toExponential(3)} N·m`);
console.log(`Power: ${cartResult.requiredPower.toFixed(1)} W`);

// Test 5: Linear Servo
console.log('\n--- LINEAR SERVO ---');
const linearServoProfile: MechanismProfile = {
  group: 'Linear Motion',
  mechanismType: 'Linear Servo',
  speedRequired: 2, // m/s
  cycleTime: 2,
  needsPrecisePosition: true,
  mechanismParams: {
    frictionForce: 100, // N
    cuttingForce: 500, // N
    travelerWeight: 50, // kg
    tiltAngle: 0,
    frictionCoefficient: 0.1
  },
  accelerationTime: 0.1,
  decelerationTime: 0.1,
  gearRatio: 1,
  efficiency: 0.95
};
const linearServoResult = calculateLinearServo(linearServoProfile);
console.log(`N: ${linearServoResult.motorSpeed.toFixed(0)} rpm (equiv)`);
console.log(`TL: ${linearServoResult.loadTorque.toExponential(3)} N·m (equiv)`);
console.log(`JL: ${linearServoResult.loadInertia.toExponential(3)} kg·m² (equiv)`);
console.log(`Trms: ${linearServoResult.rmsTorque.toExponential(3)} N·m (equiv)`);
console.log(`Power: ${linearServoResult.requiredPower.toFixed(1)} W`);

// Test 6: Generic Linear
console.log('\n--- GENERIC LINEAR ---');
const genericLinearProfile: MechanismProfile = {
  group: 'Linear Motion',
  mechanismType: 'Generic (linear)',
  speedRequired: 1, // m/s
  cycleTime: 1,
  needsPrecisePosition: true,
  mechanismParams: {
    cuttingForce: 200, // N
    linearSpeed: 1, // m/s
    loadWeight: 50, // kg
    effectiveRadius: 0.02, // m
    tiltAngle: 0,
    frictionCoefficient: 0.1
  },
  accelerationTime: 0.2,
  decelerationTime: 0.2,
  gearRatio: 1,
  efficiency: 0.9
};
const genericLinearResult = calculateGenericLinear(genericLinearProfile);
console.log(`N: ${genericLinearResult.motorSpeed.toFixed(0)} rpm`);
console.log(`TL: ${genericLinearResult.loadTorque.toExponential(3)} N·m`);
console.log(`JL: ${genericLinearResult.loadInertia.toExponential(3)} kg·m²`);
console.log(`Trms: ${genericLinearResult.rmsTorque.toExponential(3)} N·m`);
console.log(`Power: ${genericLinearResult.requiredPower.toFixed(1)} W`);

// Test 7: Rotary Table
console.log('\n--- ROTARY TABLE ---');
const rotaryTableProfile: MechanismProfile = {
  group: 'Rotary Indexing',
  mechanismType: 'Rotary Table',
  speedRequired: 60, // rpm
  cycleTime: 5,
  needsPrecisePosition: true,
  mechanismParams: {
    tableDiameter: 0.5, // m
    loadRadius: 0.2, // m
    loadMass: 50, // kg
    tableMass: 100, // kg
    tiltAngle: 0,
    frictionCoefficient: 0.01
  },
  accelerationTime: 0.2,
  decelerationTime: 0.2,
  gearRatio: 10, // 10:1 reduction
  efficiency: 0.9
};
const rotaryTableResult = calculateRotaryTable(rotaryTableProfile);
console.log(`N: ${rotaryTableResult.motorSpeed.toFixed(0)} rpm`);
console.log(`TL: ${rotaryTableResult.loadTorque.toExponential(3)} N·m`);
console.log(`JL: ${rotaryTableResult.loadInertia.toExponential(3)} kg·m²`);
console.log(`Trms: ${rotaryTableResult.rmsTorque.toExponential(3)} N·m`);
console.log(`Power: ${rotaryTableResult.requiredPower.toFixed(1)} W`);

// Test 8: Pump (Centrifugal)
console.log('\n--- PUMP (CENTRIFUGAL) ---');
const pumpProfile: MechanismProfile = {
  group: 'Rotary Continuous',
  mechanismType: 'Pump',
  speedRequired: 1500, // rpm
  cycleTime: 3600,
  needsPrecisePosition: false,
  mechanismParams: {
    flowRate: 0.05, // m³/s
    pumpInertia: 0.05, // kg·m²
    pumpType: 'centrifugal'
  },
  accelerationTime: 2,
  decelerationTime: 2,
  gearRatio: 1,
  efficiency: 0.85
};
const pumpResult = calculatePump(pumpProfile);
console.log(`N: ${pumpResult.motorSpeed.toFixed(0)} rpm`);
console.log(`TL: ${pumpResult.loadTorque.toExponential(3)} N·m`);
console.log(`JL: ${pumpResult.loadInertia.toExponential(3)} kg·m²`);
console.log(`Trms: ${pumpResult.rmsTorque.toExponential(3)} N·m`);
console.log(`Power: ${pumpResult.requiredPower.toFixed(1)} W`);

// Test 9: Elevator/Hoist
console.log('\n--- ELEVATOR/HOIST ---');
const elevatorProfile: MechanismProfile = {
  group: 'Vertical/Hoisting',
  mechanismType: 'Elevator/hoist',
  speedRequired: 2, // m/s
  cycleTime: 30,
  needsPrecisePosition: true,
  mechanismParams: {
    drumDiameter: 300, // mm
    counterweightMass: 800, // kg
    loadMass: 1000, // kg
    externalForce: 0,
    frictionCoefficient: 0.02,
    drumMass: 150 // kg
  },
  accelerationTime: 0.5,
  decelerationTime: 0.5,
  gearRatio: 20, // 20:1 reduction
  efficiency: 0.9
};
const elevatorResult = calculateElevatorHoist(elevatorProfile);
console.log(`N: ${elevatorResult.motorSpeed.toFixed(0)} rpm`);
console.log(`TL: ${elevatorResult.loadTorque.toExponential(3)} N·m`);
console.log(`JL: ${elevatorResult.loadInertia.toExponential(3)} kg·m²`);
console.log(`Trms: ${elevatorResult.rmsTorque.toExponential(3)} N·m`);
console.log(`Power: ${elevatorResult.requiredPower.toFixed(1)} W`);

console.log('\n=== ALL MECHANISM TESTS COMPLETED ===');