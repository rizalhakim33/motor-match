import { MechanismProfile, SizingResult } from '@/types';

export function calculateGenericRotary(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.9;
  const tA = profile.accelerationTime || 0.2;
  
  // Extract parameters
  const Tc = params.loadTorque || 0; // N·m (direct input)
  const Jl = params.loadInertia || 0; // kg·m² (direct input)
  
  // Reflected torque to motor side
  // TL = Tc / i² (but formula says TL = TW × G/η, assuming Tc is TW)
  const TL = (Tc * G) / η;
  
  // Reflected inertia to motor side
  // JL = Jl / G² (Jl is on load side, reflected through gear ratio)
  const JL = Jl / (G * G);
  
  // Motor speed (rpm)
  const N = profile.speedRequired;
  
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
    recommendedType: 'servo', // Default for generic rotary
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}