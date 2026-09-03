import { MechanismProfile, SizingResult } from '@/types';

const GRAVITY = 9.8; // m/s²

export function calculateLinearServo(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  // Linear servo is direct drive - no gear ratio
  const G = 1;
  const η = profile.efficiency || 0.95; // Linear motor efficiency
  const tA = profile.accelerationTime || 0.1;
  
  // Extract parameters
  const Ff = params.frictionForce || 0; // Friction force in N
  const Fc = params.cuttingForce || 0; // Cutting/process force in N
  const Wt = params.travelerWeight || 10; // Traveler weight in kg
  const θ = (params.tiltAngle || 0) * Math.PI / 180; // Tilt angle
  const μ = params.frictionCoefficient || 0.1; // Friction coefficient
  
  // Total force (linear motor works in force domain)
  // F = Ff + Fc + Wt·g·μ (horizontal, gravity ignored unless tilted)
  // If tilted: F = Ff + Fc + Wt·g·(sinθ + μ·cosθ)
  const F_total = Ff + Fc + Wt * GRAVITY * (Math.sin(θ) + μ * Math.cos(θ));
  
  // Effective mass being moved (traveler + motor forcer)
  // Note: mforcer would come from motor catalog in Phase 2
  const mforcer = 2; // kg - placeholder for motor forcer mass
  const meff = Wt + mforcer;
  
  // For linear servo, we work in force (N) and velocity (m/s) directly
  // But SizingResult expects torque/rpm, so we use equivalent with effective radius = 1m
  // This is a conceptual mapping for the sizing engine
  const r_equiv = 1; // Equivalent radius for force-to-torque conversion (1m)
  
  // Equivalent torque at "motor" (forcer)
  const TL = (F_total * r_equiv) / η; // N·m (equivalent)
  
  // Equivalent inertia at "motor"
  // JL' = meff × r_equiv² / G²
  const JL = meff * r_equiv * r_equiv / (G * G);
  
  // Linear speed
  // V input is in mm/s, convert to m/s for calculation
  const V = profile.speedRequired / 1000; // mm/s → m/s
  
  // Equivalent motor speed (rpm) for force/velocity profile
  // V = 2π·r_equiv·N/60 => N = 60V/(2π·r_equiv)
  const N = (60 * V) / (2 * Math.PI * r_equiv); // rpm (equivalent)
  
  // NOTE: inertiaRatio and accelerationTorque (TA) are temporarily disabled
  // They require real motor inertia (JM) from motor catalog, not placeholder values.
  // Will be re-enabled in Phase 2 after motor catalog (UC5) is implemented.
  // For now, Trms is simplified to constant-speed phase only (T2 = TL).
  
  // Simplified RMS Torque (constant speed phase only)
  const Trms = TL;
  
  // Required power
  const omega = (2 * Math.PI * N) / 60;
  const requiredPower = TL * omega; // This equals F_total * V (linear power)
  
  return {
    rmsTorque: Trms,
    inertiaRatio: 0, // Disabled — requires real JM from motor catalog
    requiredPower,
    recommendedType: 'servo', // Linear servo is always servo
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}