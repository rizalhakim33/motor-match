import { MechanismProfile, SizingResult } from '@/types';

export function calculateFan(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.85; // Fan efficiency
  const tA = profile.accelerationTime || 2; // Fans typically have longer acceleration
  
  // Extract parameters
  const Q = params.flowRate || 1; // m³/s
  const Jf = params.fanInertia || 0.1; // kg·m²
  
  // For fan, torque follows affinity law: TL ∝ ω²
  // We'll estimate based on typical fan power curve
  // P_fan ∝ ω³, so TL = P/ω ∝ ω²
  
  // Motor speed (rpm) - fan speed
  const N = profile.speedRequired;
  const omega = (2 * Math.PI * N) / 60;
  
  // Estimate fan torque at rated speed
  // For simplicity, we'll use a typical fan power estimation
  // In real implementation, this would come from fan performance curve
  const estimatedFanPower = 1000 * Math.pow(Q, 2); // Very rough estimation in Watts
  const TL = estimatedFanPower / omega; // N·m
  
  // Reflected inertia to motor side
  // JL = Jf / G² (Jf is on load side, reflected through gear ratio)
  const JL = Jf / (G * G);
  
  // NOTE: inertiaRatio and accelerationTorque (TA) are temporarily disabled
  // They require real motor inertia (JM) from motor catalog, not placeholder values.
  // Will be re-enabled in Phase 2 after motor catalog (UC5) is implemented.
  // For now, Trms is simplified to constant-speed phase only (T2 = TL).
  
  // Simplified RMS Torque (constant speed phase only)
  const Trms = TL;
  
  // Required power
  const requiredPower = TL * omega;
  
  return {
    rmsTorque: Trms,
    inertiaRatio: 0, // Disabled — requires real JM from motor catalog
    requiredPower,
    recommendedType: 'induction', // Default for fan
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}