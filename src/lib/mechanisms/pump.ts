import { MechanismProfile, SizingResult } from '@/types';

export function calculatePump(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.85; // Pump efficiency
  const tA = profile.accelerationTime || 2; // Pumps typically have longer acceleration
  
  // Extract parameters
  const Q = params.flowRate || 1; // m³/s
  const Jp = params.pumpInertia || 0.1; // kg·m²
  const pumpType = params.pumpType || 'centrifugal'; // 'centrifugal' or 'displacement'
  const deltaP = params.pressureRise || 1e5; // Pressure rise in Pa (for displacement pump)
  const Vdisp = params.displacement || 1e-4; // Displacement volume in m³/rev (for displacement pump)
  
  // Motor speed (rpm)
  const N = profile.speedRequired;
  const omega = (2 * Math.PI * N) / 60;
  
  let TL: number; // Load torque
  
  if (pumpType === 'centrifugal') {
    // For centrifugal pump: torque follows affinity law TL ∝ ω²
    // Estimate pump power at rated speed
    // P_pump ≈ ρ × g × Q × H (simplified), or use rough estimation
    // Here we use a rough estimation: P_pump ≈ 2000 × Q² (Watts)
    const estimatedPumpPower = 2000 * Math.pow(Q, 2);
    TL = estimatedPumpPower / omega;
  } else {
    // For displacement pump (piston/gear pump): torque relatively constant vs pressure
    // TL = (ΔP × Vdisp) / (2π × η)
    TL = (deltaP * Vdisp) / (2 * Math.PI * η);
  }
  
  // Reflected inertia to motor side
  // JL = Jp / G²
  const JL = Jp / (G * G);
  
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
    recommendedType: 'induction', // Default for pump (like fan)
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}