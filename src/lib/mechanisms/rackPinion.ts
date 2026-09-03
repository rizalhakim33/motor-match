import { MechanismProfile, SizingResult } from '@/types';

const GRAVITY = 9.8; // m/s²

export function calculateRackPinion(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.95; // Rack & pinion efficiency
  const tA = profile.accelerationTime || 0.2;
  
  // Extract parameters
  const D = params.pinionDiameter || 20; // Pinion diameter in mm
  const M = params.loadMass || 0; // Load mass in kg
  const F = params.pullForce || 0; // Pull force in N
  const θ = (params.tiltAngle || 0) * Math.PI / 180; // Convert to radians
  const μ = params.frictionCoefficient || 0.1;
  
  // Calculate load torque (side load)
  // TW_eksternal = F × (D/2) × 10⁻³ (N·m)
  const TW_external = F * (D / 2) * 1e-3;
  
  // Torsi akibat gravitasi (jika miring/vertikal)
  // TW_gravitasi = M·g·cosθ × (D/2) × 10⁻³
  const TW_gravity = M * GRAVITY * Math.cos(θ) * (D / 2) * 1e-3;
  
  // Torsi gesekan
  // TW_friksi = μ × M × g × cosθ × (D/2) × 10⁻³
  const TW_friction = μ * M * GRAVITY * Math.cos(θ) * (D / 2) * 1e-3;
  
  // Total load torque (side load)
  const TW = TW_external + TW_gravity + TW_friction;
  
  // Reflected torque to motor side
  // TL = TW × G/η
  const TL = (TW * G) / η;
  
  // Calculate load inertia (side load)
  // JW = M × D² / 4 × 10⁻⁶ (kg·m²)
  const JW = M * D * D / 4 * 1e-6;
  
  // Reflected inertia to motor side
  // JL = G² × JW
  const JL = G * G * JW;
  
  // Calculate motor speed (rpm)
  // For rack & pinion: V = π·D·N/60 => N = 60V/(π·D)
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
    recommendedType: 'servo', // Default for rack & pinion
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}