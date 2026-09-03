import { MechanismProfile, SizingResult } from '@/types';

const GRAVITY = 9.8; // m/s²

export function calculateGenericLinear(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.9;
  const tA = profile.accelerationTime || 0.2;
  
  // Extract parameters
  const Fc = params.cuttingForce || 0; // Force in N
  // V input is in mm/s from profile.speedRequired, convert to m/s
  const V = (profile.speedRequired || 1000) / 1000; // mm/s → m/s
  const Wl = params.loadWeight || 10; // Load weight in kg
  const r = params.effectiveRadius || 0.01; // Effective radius in m
  const θ = (params.tiltAngle || 0) * Math.PI / 180; // Tilt angle
  const μ = params.frictionCoefficient || 0.1; // Friction coefficient
  
  // Total force (including gravity component if tilted)
  const F_total = Fc + Wl * GRAVITY * (Math.sin(θ) + μ * Math.cos(θ));
  
  // Load torque (side load)
  // TL = (F_total × r) / η
  const TL = (F_total * r) / η;
  
  // Load inertia (reflected to motor side)
  // JL' = Wl × r² / G²
  const JL = Wl * r * r / (G * G);
  
  // Motor speed (rpm)
  // V = 2π·r·N/60 => N = 60V/(2π·r)
  const N = (60 * V) / (2 * Math.PI * r); // rpm
  
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
    recommendedType: 'servo', // Default for generic linear
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}