import { MotorCatalogEntry } from '@/types';

/**
 * UC10: Starting-Point Gain Calculator
 * 
 * Based on cascade P-PI control theory (universal servo tuning approach):
 *   Position loop → Speed loop → Current loop
 * 
 * Calculates starting-point gains based on:
 *   - Total inertia: Jtotal = JM + JL
 *   - Motor torque constant: Kt (from catalog)
 *   - Desired speed loop bandwidth: ωv (rad/s)
 * 
 * References:
 *   - Omron Technical Guide for Servomotor Selection
 *   - Mitsubishi MR-J series tuning manual
 *   - Yaskawa Sigma-7 tuning guide
 */

export interface GainResult {
  // Generic gain values
  speedLoopGain: number;      // Kv (rad/s) or equivalent
  speedIntegralTime: number;  // Tvi (ms)
  positionLoopGain: number;   // Kp (1/s)
  
  // Context
  totalInertia: number;       // Jtotal = JM + JL (kg·m²)
  inertiaRatio: number;       // JL / JM
  torqueConstant: number;     // Kt (N·m/A)
  speedBandwidth: number;     // ωv chosen (rad/s)
  
  // Warnings
  warnings: string[];
}

/**
 * Select appropriate speed loop bandwidth based on inertia ratio
 * Rule of thumb from servo tuning literature:
 *   JL/JM < 5:    ωv = 100-150 rad/s (light load)
 *   JL/JM 5-15:   ωv = 50-100 rad/s (medium load)
 *   JL/JM > 15:   ωv = 20-50 rad/s (heavy load, consider gear reduction)
 */
function selectSpeedBandwidth(inertiaRatio: number): number {
  if (inertiaRatio < 5) return 120;      // Light load - aggressive
  if (inertiaRatio < 10) return 80;      // Medium load
  if (inertiaRatio < 15) return 60;      // Medium-heavy
  if (inertiaRatio < 30) return 40;      // Heavy load
  return 30;                              // Very heavy - conservative
}

/**
 * Calculate starting-point gains for a servo motor application
 */
export function calculateGains(
  motorInertia: number,
  loadInertia: number,
  torqueConstant: number,
  customBandwidth?: number
): GainResult {
  const warnings: string[] = [];
  const JM = motorInertia;
  const JL = loadInertia;
  const Jtotal = JM + JL;
  const inertiaRatio = JM > 0 ? JL / JM : Infinity;
  const Kt = torqueConstant || 0.5; // Default if not available

  // Select speed loop bandwidth
  const omegaV = customBandwidth || selectSpeedBandwidth(inertiaRatio);

  // === Speed Loop Gain (Kv) ===
  // Kv = ωv × Jtotal / Kt
  const speedLoopGain = (omegaV * Jtotal) / Kt;

  // === Speed Loop Integral Time (Tvi) ===
  // Tvi = k × (Jtotal / (Kv × Kt))
  // k = damping constant (2-4 for damping ratio ~0.7-1.0)
  const dampingK = 3.0; // Moderate damping
  const speedIntegralTime = dampingK * (Jtotal / (speedLoopGain * Kt)) * 1000; // Convert to ms

  // === Position Loop Gain (Kp) ===
  // Kp = ωv / 4 to ωv / 6 (position bandwidth < speed bandwidth for cascade stability)
  const positionLoopGain = omegaV / 5; // Middle of recommended range

  // Warnings
  if (torqueConstant === 0 || torqueConstant === undefined) {
    warnings.push('Kt tidak tersedia dari katalog — gunakan nilai default 0.5 N·m/A');
  }
  if (inertiaRatio > 15) {
    warnings.push(`Rasio inersia tinggi (${inertiaRatio.toFixed(1)}) — gain mungkin perlu tuning lebih hati-hati`);
  }
  if (inertiaRatio > 30) {
    warnings.push('Rasio inersia sangat tinggi — pertimbangkan gear reduction sebelum tuning');
  }

  return {
    speedLoopGain,
    speedIntegralTime,
    positionLoopGain,
    totalInertia: Jtotal,
    inertiaRatio,
    torqueConstant: Kt,
    speedBandwidth: omegaV,
    warnings
  };
}
