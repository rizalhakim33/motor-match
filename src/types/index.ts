export type MechanismGroup = 'Linear Motion' | 'Rotary Indexing' | 'Rotary Continuous' | 'Vertical/Hoisting';

export type MechanismType = 
  | 'Ball Screw' 
  | 'Rack and Pinion' 
  | 'Roll Feed' 
  | 'Sprocket & Chain'
  | 'Conveyor (Belt)' 
  | 'Cart' 
  | 'Linear Servo' 
  | 'Generic (linear)'
  | 'Rotary Table'
  | 'Fan'
  | 'Pump'
  | 'Generic (rotary)'
  | 'Elevator/hoist';

export interface MechanismParams {
  // Ball Screw
  lead?: number; // Pb in mm
  tiltAngle?: number; // θ in degrees
  loadMass?: number; // M in kg
  externalForce?: number; // F in N
  ballScrewInertia?: number; // JB in kg·m²
  ballScrewDiameter?: number; // D in mm
  ballScrewMass?: number; // mass of screw in kg
  frictionCoefficient?: number; // μ
  
  // Rack and Pinion / Sprocket & Chain / Conveyor
  pinionRadius?: number; // D/2 in mm
  rollerDiameter?: number; // D1, D2 in mm
  idleRollerDiameter?: number; // D2 in mm
  driverRollerMass?: number; // M1 in kg
  idleRollerMass?: number; // M2 in kg
  beltMass?: number; // M4 in kg
  pullForce?: number; // F in N
  pinionDiameter?: number; // D in mm (for Rack & Pinion)
  sprocketDiameter?: number; // D in mm (for Sprocket & Chain)
  chainPullForce?: number; // F in N (for Sprocket & Chain)
  
  // Rotary Table
  tableDiameter?: number; // Dt in m
  loadRadius?: number; // R in m
  tableMass?: number; // Mtable in kg
  
  // Fan/Pump
  flowRate?: number; // Q in m³/s
  fanInertia?: number; // Jf in kg·m²
  pumpInertia?: number; // Jp in kg·m²
  pumpType?: string; // 'centrifugal' | 'displacement'
  pressureRise?: number; // ΔP in Pa
  displacement?: number; // Vdisp in m³/rev
  
  // Generic Rotary
  loadTorque?: number; // Tc in N·m
  loadInertia?: number; // JL in kg·m²
  
  // Elevator/Hoist
  drumDiameter?: number; // D in mm
  counterweightMass?: number; // M1 in kg
  loadWeight?: number; // M2 in kg
  drumMass?: number; // Mdrum in kg
  
  // Cart
  wheelDiameter?: number; // Dwh in m
  cartWidth?: number; // Wcart in m
  cartWeight?: number; // Wcart in kg
  
  // Linear Servo
  frictionForce?: number; // Ff in N
  cuttingForce?: number; // Fc in N
  travelerWeight?: number; // Wt in kg
  linearSpeed?: number; // V in m/s
  
  // Generic (linear)
  effectiveRadius?: number; // r_efektif in m
  
  // Roll Feed
  rollerDiameterA?: number; // Dra in mm
  rollerDiameterB?: number; // Drb in mm
  clampingForce?: number; // Fn in N
  rollerMassA?: number; // MrollA in kg
  rollerMassB?: number; // MrollB in kg
}

export interface MechanismProfile {
  group: MechanismGroup;
  mechanismType: MechanismType;
  speedRequired: number; // rpm for rotary, mm/s for linear motion
  cycleTime: number; // in seconds
  needsPrecisePosition: boolean;
  mechanismParams: MechanismParams;
  // Common parameters
  accelerationTime?: number; // tA in seconds
  decelerationTime?: number; // tD in seconds
  gearRatio?: number; // G (motor side / load side), 1 for direct drive
  efficiency?: number; // η (0-1)
}

// === Motor Catalog Types (Phase 2) ===

export type MotorCostTier = 1 | 2 | 3; // 1=budget, 2=mid, 3=premium
export type MotorAvailability = 'local' | 'regional' | 'import';
export type VoltageClass = '100V' | '200V' | '400V';

export interface MotorCatalogEntry {
  id: string;
  brand: string;            // "Mitsubishi", "Yaskawa", etc.
  series: string;           // "HG-KR", "Sigma-7", etc.
  model: string;            // "HG-KR13", "SGM7J-04A7A61"
  motorType: 'servo' | 'stepper' | 'induction';
  voltage: VoltageClass;
  
  // Core specs
  ratedPower: number;       // Watts
  ratedTorque: number;      // N·m
  maxTorque: number;        // N·m (momentary, usually 3x rated for servo)
  ratedSpeed: number;       // rpm
  maxSpeed: number;         // rpm
  
  // Inertia & dynamics
  rotorInertia: number;     // kg·m²
  inertiaClass?: 'Low' | 'Medium' | 'High'; // for dynamic ratio threshold (Low 15, Medium 20, High 30)
  frameSize?: number;       // mm flange size
  torqueConstant?: number;  // N·m/A (servo only)
  electricalTimeConstant?: number; // ms
  mechanicalTimeConstant?: number; // ms
  
  // Physical
  weight: number;           // kg
  shaftDiameter: number;    // mm
  bodyLength?: number;      // mm (motor body length without brake)
  shaftExtension?: number;  // mm (shaft extension length)
  keyWidth?: number;        // mm (key width)
  keyLength?: number;       // mm (key length)
  keyway?: string;          // e.g. "M6, depth 12"
  brakeAvailable: boolean;
  
  // Cost & availability (for recommendation engine)
  costTier: MotorCostTier;
  availability: MotorAvailability;
  
  // Optional: speed-torque curve data points
  speedTorqueCurve?: { speed: number; torque: number }[];

  // Induction motor specific (optional)
  poleCount?: number;        // 2, 4, or 6
  frequency?: number;        // 50 or 60 Hz

  // VFD specific (optional)
  maxMotorPower?: number;    // Watts - max motor power this VFD can drive
  overloadPercent?: number;  // e.g. 150 = 150% overload
  overloadDuration?: number; // seconds at overload
  freqRangeMin?: number;     // Hz
  freqRangeMax?: number;     // Hz
}

export interface MotorMatchResult {
  motor: MotorCatalogEntry;
  score: number;            // 0-100, higher is better
  torqueMargin: number;     // Trated / Trms (should be > 1.2)
  inertiaRatio: number;     // JL / JM
  powerMargin: number;      // Prated / Prequired (should be > 1.0)
  fitsCriteria: boolean;    // meets all minimum requirements
  warnings: string[];       // e.g. ["Inertia ratio > 15, consider gear reduction"]
}

export interface SizingResult {
  rmsTorque: number;        // Trms in N·m
  inertiaRatio: number;     // JL/JM
  requiredPower: number;    // in W
  recommendedType: 'servo' | 'stepper' | 'induction';
  recommendationReason: string;
  loadTorque: number;       // TL in N·m
  loadInertia: number;      // JL in kg·m²
  motorSpeed: number;       // N in rpm
  accelerationTorque: number; // TA in N·m
  peakTorque: number;       // T1 in N·m
  candidateMotors: MotorCatalogEntry[];
  selectedMotor?: MotorCatalogEntry; // user's choice
  fullSizing?: FullSizingResult;     // calculated with real JM
}

export interface FullSizingResult {
  // Calculated with real motor inertia (JM)
  actualInertiaRatio: number;  // JL / JM (from selected motor)
  actualAccelerationTorque: number; // TA = (JM + JL) × α / η
  actualPeakTorque: number;    // TL + TA (acceleration phase)
  actualRmsTorque: number;     // Full 4-phase RMS calculation
  dutyCycleSatisfied: boolean; // Trms < Trated
  peakTorqueSatisfied: boolean; // Tpeak < Tmax
  inertiaRatioSatisfied: boolean; // JL/JM < maxRecommended
  
  // Recommended gear ratio (if inertia ratio too high)
  recommendedGearRatio?: number;
  gearRatioReason?: string;
}


export interface GainResult {
  speedLoopGain: number;
  speedIntegralTime: number;
  positionLoopGain: number;
  totalInertia: number;
  inertiaRatio: number;
  torqueConstant: number;
  speedBandwidth: number;
  warnings: string[];
}

// === Article Types ===

export interface ArticleHeading {
  level: number;
  text: string;
  slug: string;
}

export interface ArticleMetadata {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  author?: string;
  readingTime?: number;
  headings?: ArticleHeading[];
}

export interface WizardState {
  currentStep: number;
  mechanismGroup: MechanismGroup | null;
  mechanismType: MechanismType | null;
  parameters: MechanismProfile;
  result: SizingResult | null;
  // Phase 2 additions
  selectedMotorId?: string | null;
  showMotorCatalog: boolean;
  // Phase 3 additions
  comparedMotors: MotorCatalogEntry[];
}
