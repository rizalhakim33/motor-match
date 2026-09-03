import { MechanismProfile, SizingResult } from '@/types';

const GRAVITY = 9.8; // m/s²

export function calculateConveyor(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.95; // Belt efficiency
  const tA = profile.accelerationTime || 0.5;
  
  // Extract parameters
  const D1 = params.rollerDiameter || 100; // Driver roller diameter in mm
  const D2 = params.idleRollerDiameter || D1; // Idle roller diameter in mm
  const M1 = params.driverRollerMass || 5; // Driver roller mass in kg
  const M2 = params.idleRollerMass || 5; // Idle roller mass in kg
  const M3 = params.loadMass || 50; // Load mass in kg
  const M4 = params.beltMass || 10; // Belt mass in kg
  const θ = (params.tiltAngle || 0) * Math.PI / 180; // Convert to radians
  const μ = params.frictionCoefficient || 0.4; // Belt friction coefficient
  
  // Calculate total force
  // F_total = M3·g·(sinθ + μcosθ) for inclined conveyor
  const F_total = M3 * GRAVITY * (Math.sin(θ) + μ * Math.cos(θ));
  
  // Calculate load torque (side load)
  // TW = F_total × (D1/2) × 10⁻³ (N·m)
  const TW = F_total * (D1 / 2) * 1e-3;
  
  // Reflected torque to motor side
  // TL = TW × G/η
  const TL = (TW * G) / η;
  
  // Calculate load inertia (side load)
  // JW = (M1·D1²)/8 + (M2·D2²)/8 + (M3·D1²)/4 + (M4·D1²)/4 (×10⁻⁶, kg·m²)
  const JW = (
    (M1 * D1 * D1) / 8 + 
    (M2 * D2 * D2) / 8 + 
    (M3 * D1 * D1) / 4 + 
    (M4 * D1 * D1) / 4
  ) * 1e-6;
  
  // Reflected inertia to motor side
  // JL = G² × JW
  const JL = G * G * JW;
  
  // Calculate motor speed (rpm)
  // For conveyor: V = π·D1·N/60 => N = 60V/(π·D1)
  // V input is in mm/s, convert to m/s for calculation
  const V = profile.speedRequired / 1000; // mm/s → m/s
  const N = (60 * V) / (Math.PI * D1 * 1e-3); // rpm
  
  // NOTE: inertiaRatio and accelerationTorque (TA) are temporarily disabled
  // They require real motor inertia (JM) from motor catalog, not placeholder values.
  // Will be re-enabled in Phase 2 after motor catalog (UC5) is implemented.
  // For now, Trms is simplified to constant-speed phase only (T2 = TL).
  
  // Simplified RMS Torque (constant speed phase only)
  const Trms = TL;
  
  // Required power
  const omega = (2 * Math.PI * N) / 60;
  const requiredPower = TL * omega;
  
  return {
    rmsTorque: Trms,
    inertiaRatio: 0, // Disabled — requires real JM from motor catalog
    requiredPower,
    recommendedType: 'induction', // Default for conveyor
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}