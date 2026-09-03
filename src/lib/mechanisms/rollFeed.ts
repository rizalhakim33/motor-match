import { MechanismProfile, SizingResult } from '@/types';

const GRAVITY = 9.8; // m/s²

export function calculateRollFeed(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.95; // Roll feed efficiency
  const tA = profile.accelerationTime || 0.2;
  
  // Extract parameters
  const Dra = params.rollerDiameterA || 100; // Roll diameter A in mm
  const Drb = params.rollerDiameterB || 100; // Roll diameter B in mm
  const Fn = params.clampingForce || 0; // Clamping force in N
  const μ = params.frictionCoefficient || 0.3; // Friction coefficient between roll and material
  const MrollA = params.rollerMassA || 10; // Roll A mass in kg
  const MrollB = params.rollerMassB || 10; // Roll B mass in kg
  
  // Calculate load torque (side load)
  // TL = (Fn × μ × Dra/2) / η  (torque from roll friction on material)
  // Dra is in mm, convert to m: Dra/2 * 1e-3
  const TL = (Fn * μ * (Dra / 2) * 1e-3) / η;
  
  // Calculate load inertia (reflected to motor side)
  // JL' = (1/8) × mroll × (Dra² + Drb²) / G² (approx solid cylinder, converted through gear)
  // Convert Dra, Drb from mm to m: × 1e-3
  const Dra_m = Dra * 1e-3;
  const Drb_m = Drb * 1e-3;
  const J_rolls = (1/8) * (MrollA * Dra_m * Dra_m + MrollB * Drb_m * Drb_m);
  const JL = J_rolls / (G * G); // Reflected through gear ratio
  
  // Calculate motor speed (rpm)
  // For roll feed: V = π·Dra·N/60 => N = 60V/(π·Dra)
  // V input is in mm/s, convert to m/s for calculation
  const V = profile.speedRequired / 1000; // mm/s → m/s
  const N = (60 * V) / (Math.PI * Dra_m); // rpm
  
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
    recommendedType: 'servo', // Default for roll feed
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}