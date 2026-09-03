import { MechanismProfile, SizingResult } from '@/types';

const GRAVITY = 9.8; // m/s²

export function calculateCart(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.95; // Wheel efficiency
  const tA = profile.accelerationTime || 0.5;
  
  // Extract parameters
  const Dwh = params.wheelDiameter || 0.2; // Wheel diameter in m
  const Wcart = params.cartWeight || 50; // Cart weight in kg
  const Wl = params.loadWeight || 100; // Load weight in kg
  const θ = (params.tiltAngle || 0) * Math.PI / 180; // Convert to radians
  const μ_roll = params.frictionCoefficient || 0.02; // Rolling friction coefficient
  
  // Calculate total force
  // F = (Wl + Wcart)·g·(sinθ + μ_roll·cosθ)
  const F_total = (Wl + Wcart) * GRAVITY * (Math.sin(θ) + μ_roll * Math.cos(θ));
  
  // Calculate load torque (side load)
  // TL = (F × Dwh/2) / η
  const TL = (F_total * (Dwh / 2)) / η;
  
  // Calculate load inertia (reflected to motor side)
  // JL' = (Wl + Wcart) × (Dwh/2)² / G²
  const JL = (Wl + Wcart) * Math.pow(Dwh / 2, 2) / (G * G);
  
  // Calculate motor speed (rpm)
  // For cart: V = π·Dwh·N/60 => N = 60V/(π·Dwh)
  // V input is in mm/s, convert to m/s for calculation
  const V = profile.speedRequired / 1000; // mm/s → m/s
  const N = (60 * V) / (Math.PI * Dwh); // rpm
  
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
    recommendedType: 'induction', // Default for cart (like conveyor)
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}