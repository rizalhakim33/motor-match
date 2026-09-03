import { SizingResult, MotorCatalogEntry, FullSizingResult } from '@/types';

/**
 * Calculate full sizing result using real motor inertia (JM) from catalog.
 * 
 * This re-enables the 4-phase RMS torque calculation:
 *   Phase 1 (accel):  T1 = TL + TA,  duration = tA
 *   Phase 2 (const):  T2 = TL,       duration = tC
 *   Phase 3 (decel):  T3 = TL - TA,  duration = tD
 *   Phase 4 (dwell):  T4 = 0,        duration = tDwell
 * 
 * Where:
 *   TA = (JM + JL) × α / η   (acceleration torque at motor shaft)
 *   α  = ω / tA               (angular acceleration)
 *   ω  = 2π × N / 60          (angular velocity at rated speed)
 * 
 * Trms = sqrt( (T1²×t1 + T2²×t2 + T3²×t3 + T4²×t4) / T_total )
 */

const MAX_RECOMMENDED_INERTIA_RATIO = 15;

export function calculateFullSizing(
  sizingResult: SizingResult,
  motor: MotorCatalogEntry,
  cycleTime: number,
  accelerationTime: number = 0.2,
  decelerationTime: number = 0.2,
  efficiency: number = 0.9
): FullSizingResult {
  const { loadTorque: TL, loadInertia: JL, motorSpeed: N } = sizingResult;
  const JM = motor.rotorInertia;

  // Angular velocity at rated speed (rad/s)
  const omega = (2 * Math.PI * N) / 60;

  // Actual inertia ratio
  const actualInertiaRatio = JM > 0 ? JL / JM : Infinity;

  // Angular acceleration (rad/s²)
  // α = ω / tA (accelerate from 0 to rated speed in tA seconds)
  const alpha = accelerationTime > 0 ? omega / accelerationTime : 0;

  // Acceleration torque at motor shaft
  // TA = (JM + JL) × α / η
  // Note: η applies to the load-side torque component
  // Simplified: TA = JM × α + JL × α / η
  const actualAccelerationTorque = JM * alpha + (JL * alpha) / efficiency;

  // Peak torque during acceleration phase
  // Tpeak = TL + TA
  const actualPeakTorque = TL + actualAccelerationTorque;

  // Deceleration torque (braking)
  // During deceleration, motor needs to brake: T_brake = TL - TA_decel
  // TA_decel uses the same magnitude but opposite direction
  const tA_decel = decelerationTime > 0 ? decelerationTime : accelerationTime;
  const alpha_decel = omega / tA_decel;
  const TA_decel = JM * alpha_decel + (JL * alpha_decel) / efficiency;
  const T_decel = TL - TA_decel; // Can be negative (regenerative braking)

  // Phase durations
  const t1 = accelerationTime; // Accel phase
  const t3 = decelerationTime; // Decel phase
  const t4 = Math.max(0, cycleTime - t1 - t3); // Dwell/idle time
  const t2 = Math.max(0, cycleTime - t1 - t3 - t4); // Constant speed phase
  // If cycleTime is too short for accel+decel, distribute proportionally
  const totalMotion = t1 + t2 + t3;

  // 4-phase RMS Torque calculation
  // Trms = sqrt( (T1²×t1 + T2²×t2 + T3²×t3 + T4²×t4) / T_total )
  const T1 = TL + actualAccelerationTorque; // Accel phase torque
  const T2 = TL;                             // Constant speed torque
  const T3 = T_decel;                        // Decel phase torque (can be negative)
  const T4 = 0;                              // Dwell (no torque needed)

  const T_total = t1 + t2 + t3 + t4;
  
  let actualRmsTorque: number;
  if (T_total > 0) {
    actualRmsTorque = Math.sqrt(
      (T1 * T1 * t1 + T2 * T2 * t2 + T3 * T3 * t3 + T4 * T4 * t4) / T_total
    );
  } else {
    // Fallback: constant speed only
    actualRmsTorque = TL;
  }

  // Feasibility checks
  const dutyCycleSatisfied = motor.ratedTorque > 0 ? actualRmsTorque <= motor.ratedTorque : true;
  const peakTorqueSatisfied = motor.maxTorque > 0 ? actualPeakTorque <= motor.maxTorque : true;
  const inertiaRatioSatisfied = actualInertiaRatio <= MAX_RECOMMENDED_INERTIA_RATIO;

  // Gear ratio recommendation (if inertia ratio too high)
  let recommendedGearRatio: number | undefined;
  let gearRatioReason: string | undefined;

  if (actualInertiaRatio > MAX_RECOMMENDED_INERTIA_RATIO) {
    // Recommend gear ratio to bring inertia ratio below threshold
    // With gear ratio G: JL_reflected = JL / G², so need G² >= JL / (JM × targetRatio)
    const targetRatio = 15; // Aim for ratio of 15
    const requiredG = Math.sqrt(JL / (JM * targetRatio));
    recommendedGearRatio = Math.ceil(requiredG * 10) / 10; // Round up to 1 decimal
    gearRatioReason = `Rasio inersia ${actualInertiaRatio.toFixed(1)} melebihi batas ${MAX_RECOMMENDED_INERTIA_RATIO}. Gunakan gear reduction ${recommendedGearRatio}:1 untuk bring ratio ke ${targetRatio}.`;
  }

  return {
    actualInertiaRatio,
    actualAccelerationTorque,
    actualPeakTorque,
    actualRmsTorque,
    dutyCycleSatisfied,
    peakTorqueSatisfied,
    inertiaRatioSatisfied,
    recommendedGearRatio,
    gearRatioReason
  };
}

/**
 * Get a human-readable summary of the full sizing result
 */
export function getFullSizingSummary(
  full: FullSizingResult,
  motor: MotorCatalogEntry
): string[] {
  const lines: string[] = [];

  lines.push(`Rasio Inersia (JL/JM): ${full.actualInertiaRatio.toFixed(1)} (max ${MAX_RECOMMENDED_INERTIA_RATIO})`);
  lines.push(`Torsi Akselerasi (TA): ${full.actualAccelerationTorque.toFixed(4)} N·m`);
  lines.push(`Peak Torque: ${full.actualPeakTorque.toFixed(4)} N·m (max ${motor.maxTorque} N·m)`);
  lines.push(`RMS Torque: ${full.actualRmsTorque.toFixed(4)} N·m (rated ${motor.ratedTorque} N·m)`);

  if (!full.dutyCycleSatisfied) {
    lines.push(`⚠️ RMS torque melebihi rated torque motor!`);
  }
  if (!full.peakTorqueSatisfied) {
    lines.push(`⚠️ Peak torque melebihi max torque motor!`);
  }
  if (!full.inertiaRatioSatisfied) {
    lines.push(`⚠️ Rasio inersia terlalu tinggi — pertimbangkan gear reduction`);
  }

  if (full.recommendedGearRatio) {
    lines.push(`💡 Rekomendasi: Gunakan gear ratio ${full.recommendedGearRatio}:1`);
  }

  return lines;
}
