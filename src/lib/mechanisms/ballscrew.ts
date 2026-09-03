import { MechanismProfile, SizingResult } from '@/types';

const GRAVITY = 9.8; // m/s²

export function calculateBallScrew(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.9; // Default ballscrew efficiency
  const tA = profile.accelerationTime || 0.2; // Default acceleration time
  
  // Extract parameters with defaults
  const M = params.loadMass || 0; // kg
  const P = params.lead || 10; // mm
  const D = params.ballScrewDiameter || 20; // mm
  const μ = params.frictionCoefficient || 0.1;
  const F = params.externalForce || 0; // N
  const JB = params.ballScrewInertia || (params.ballScrewMass ? 
    (params.ballScrewMass * D * D / 8) * 1e-6 : 0); // kg·m²
  
  // Calculate speed (rpm) from linear speed
  // V = N * P / 60 => N = 60V/P (V in mm/s, P in mm)
  const V = profile.speedRequired; // This should be in mm/s for ball screw
  const N = (60 * V) / (P * G); // rpm
  
  // Calculate load torque (TW) - friction component
  // TW_friksi = μMg × (P/2π) × 10⁻³ (N·m)
  const TW_friction = μ * M * GRAVITY * (P / (2 * Math.PI)) * 1e-3;
  
  // Calculate load torque - external force component
  // TW_eksternal = F × (P/2π) × 10⁻³ (N·m)
  const TW_external = F * (P / (2 * Math.PI)) * 1e-3;
  
  // Total load torque (side load)
  const TW = TW_friction + TW_external;
  
  // Reflected torque to motor side
  // TL = TW × G/η
  const TL = (TW * G) / η;
  
  // Calculate load inertia (side load)
  // JW = M × (P/2π)² × 10⁻⁶ + JB (kg·m²)
  const JW = M * Math.pow(P / (2 * Math.PI), 2) * 1e-6 + JB;
  
  // Reflected inertia to motor side
  // JL = G² × JW
  const JL = G * G * JW;
  
  // NOTE: inertiaRatio and accelerationTorque (TA) are temporarily disabled
  // They require real motor inertia (JM) from motor catalog, not placeholder values.
  // Will be re-enabled in Phase 2 after motor catalog (UC5) is implemented.
  // For now, Trms is simplified to constant-speed phase only (T2 = TL).
  
  // Simplified RMS Torque (constant speed phase only)
  const Trms = TL;
  
  // Required power
  // P = TL × ω, where ω = 2πN/60
  const omega = (2 * Math.PI * N) / 60;
  const requiredPower = TL * omega;
  
  return {
    rmsTorque: Trms,
    inertiaRatio: 0, // Disabled — requires real JM from motor catalog
    requiredPower,
    recommendedType: 'servo', // Will be determined by decision rules
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}