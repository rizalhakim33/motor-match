import { MechanismProfile, SizingResult } from '@/types';

export function calculateRotaryTable(profile: MechanismProfile): SizingResult {
  const params = profile.mechanismParams;
  const G = profile.gearRatio || 1;
  const η = profile.efficiency || 0.9;
  const tA = profile.accelerationTime || 0.2;
  
  // Extract parameters
  const Dt = params.tableDiameter || 0.5; // Table diameter in m
  const R = params.loadRadius || 0.2; // Load radius in m
  const Wl = params.loadMass || 10; // Load mass in kg
  const Mtable = params.tableMass || 20; // Table mass in kg
  const θ = (params.tiltAngle || 0) * Math.PI / 180; // Tilt angle (for vertical axis, usually 0)
  const μ = params.frictionCoefficient || 0.01; // Bearing friction coefficient
  
  // Table inertia (solid cylinder approximation)
  // Jtable = (1/8) × Mtable × Dt²
  const Jtable = (1/8) * Mtable * Dt * Dt;
  
  // Load inertia at radius R
  // Jload = Wl × R²
  const Jload = Wl * R * R;
  
  // Total load inertia (side load)
  const JW = Jtable + Jload;
  
  // Reflected inertia to motor side
  // JL = JW / G²
  const JL = JW / (G * G);
  
  // Friction torque (at table side)
  // Tfriksi = μ × (Mtable + Wl) × g × R (approx)
  // For horizontal axis, gravity doesn't create torque, only bearing friction
  const TW_friction = μ * (Mtable + Wl) * 9.8 * R;
  
  // Reflected torque to motor side
  // TL = TW × G/η
  const TL = (TW_friction * G) / η;
  
  // Motor speed (rpm)
  // For rotary table, speedRequired is in rpm (indexing speed)
  const N = profile.speedRequired; // rpm
  
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
    recommendedType: 'servo', // Rotary table typically needs servo for positioning
    recommendationReason: '',
    loadTorque: TL,
    loadInertia: JL,
    motorSpeed: N,
    accelerationTorque: 0, // Disabled — requires real JM from motor catalog
    peakTorque: TL, // Simplified to TL (no TA component)
    candidateMotors: []
  };
}