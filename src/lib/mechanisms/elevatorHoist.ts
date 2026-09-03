import { MechanismProfile, SizingResult } from '@/types';

const GRAVITY = 9.8; // m/s²

export function calculateElevatorHoist(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.9; // Hoist efficiency
  const tA = profile.accelerationTime || 0.5;
  
  // Extract parameters
  const D = params.drumDiameter || 200; // Drum diameter in mm
  const M1 = params.counterweightMass || 500; // Counterweight mass in kg
  const M2 = params.loadMass || 1000; // Load mass in kg
  const F = params.externalForce || 0; // Additional external force in N
  const μ = params.frictionCoefficient || 0.02; // Friction coefficient (cable/drum)
  const Mdrum = params.drumMass || 100; // Drum mass in kg (optional)
  
  // Net force (gravity load minus counterweight, plus friction, plus external)
  // Fnet = (M2 - M1)·g + Ffriksi + F
  // Friction force estimate: μ × (M1 + M2) × g
  const F_friction = μ * (M1 + M2) * GRAVITY;
  const Fnet = (M2 - M1) * GRAVITY + F_friction + F;
  
  // Load torque (side load)
  // TW = Fnet × (D/2) × 10⁻³ (D in mm, convert to m)
  const TW = Fnet * (D / 2) * 1e-3;
  
  // Reflected torque to motor side
  // TL = TW × G/η
  const TL = (TW * G) / η;
  
  // Inertia (drum + both masses suspended on cable)
  // JW = D²(M1 + M2) / 4 × 10⁻⁶ + Jdrum
  // D in mm, so ×10⁻⁶ for kg·m²
  let JW = D * D * (M1 + M2) / 4 * 1e-6;
  
  // Add drum inertia if provided (approximate as solid cylinder)
  // Jdrum = (1/2) × Mdrum × (D/2)² × 10⁻⁶
  if (Mdrum > 0) {
    const Jdrum = 0.5 * Mdrum * Math.pow(D / 2, 2) * 1e-6;
    JW += Jdrum; // Include drum inertia in total
  }
  
  // Reflected inertia to motor side
  // JL = G² × JW
  const JL = G * G * JW;
  
  // Calculate motor speed (rpm)
  // For elevator: V = π·D·N/60 => N = 60V/(π·D)
  // V input is in mm/s, convert to m/s for calculation
  const V = profile.speedRequired / 1000; // mm/s → m/s
  const N = (60 * V) / (Math.PI * D * 1e-3); // rpm
  
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
    recommendedType: 'servo', // Elevator/hoist needs servo with holding brake
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}