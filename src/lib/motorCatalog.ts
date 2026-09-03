import { MotorCatalogEntry, MotorMatchResult, SizingResult } from '@/types';

// Type for JSON motor data files (each has a `motors` array)
// JSON may have `null` for optional fields, so we use a looser type
interface MotorDataFile {
  brand: string;
  series: string;
  motorType: string;
  voltage: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  motors: Record<string, any>[];
}

// Import motor data files
import mitsubishiData from '@/data/motors/mitsubishi-servo.json';
import deltaData from '@/data/motors/delta-servo.json';
import yaskawaData from '@/data/motors/yaskawa-servo.json';
import invtData from '@/data/motors/invt-servo.json';
import baumullerData from '@/data/motors/baumuller-servo.json';
import panasonicData from '@/data/motors/panasonic-servo.json';
import houleData from '@/data/motors/houle-servo.json';
import omronData from '@/data/motors/omron-servo.json';
import inovanceData from '@/data/motors/inovance-servo.json';
import siemensData from '@/data/motors/siemens-servo.json';
import orientalStepperData from '@/data/motors/oriental-stepper.json';
import leadshineStepperData from '@/data/motors/leadshine-stepper.json';
import moonsStepperData from '@/data/motors/moons-stepper.json';
import sanyoStepperData from '@/data/motors/sanyo-stepper.json';
import inductionData from '@/data/motors/induction-motors.json';
import vfdData from '@/data/motors/vfd-catalog.json';

// Convert raw JSON motor data to MotorCatalogEntry (null → undefined for optional fields)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCatalogEntries(raw: Record<string, any>[]): MotorCatalogEntry[] {
  return raw.map(m => {
    const entry: MotorCatalogEntry = {
      id: m.id,
      brand: m.brand,
      series: m.series,
      model: m.model,
      motorType: m.motorType,
      voltage: m.voltage,
      ratedPower: m.ratedPower,
      ratedTorque: m.ratedTorque,
      maxTorque: m.maxTorque,
      ratedSpeed: m.ratedSpeed,
      maxSpeed: m.maxSpeed,
      rotorInertia: m.rotorInertia,
      weight: m.weight,
      shaftDiameter: m.shaftDiameter,
      brakeAvailable: m.brakeAvailable,
      costTier: m.costTier,
      availability: m.availability,
    };
    if (m.torqueConstant != null) entry.torqueConstant = m.torqueConstant;
    if (m.electricalTimeConstant != null) entry.electricalTimeConstant = m.electricalTimeConstant;
    if (m.mechanicalTimeConstant != null) entry.mechanicalTimeConstant = m.mechanicalTimeConstant;
    if (m.inertiaClass != null) entry.inertiaClass = m.inertiaClass;
    if (m.frameSize != null) entry.frameSize = m.frameSize;
    if (m.bodyLength != null) entry.bodyLength = m.bodyLength;
    if (m.shaftExtension != null) entry.shaftExtension = m.shaftExtension;
    if (m.keyWidth != null) entry.keyWidth = m.keyWidth;
    if (m.keyLength != null) entry.keyLength = m.keyLength;
    if (m.keyway != null) entry.keyway = m.keyway;
    if (m.poleCount != null) entry.poleCount = m.poleCount;
    if (m.frequency != null) entry.frequency = m.frequency;
    if (m.maxMotorPower != null) entry.maxMotorPower = m.maxMotorPower;
    if (m.overloadPercent != null) entry.overloadPercent = m.overloadPercent;
    if (m.overloadDuration != null) entry.overloadDuration = m.overloadDuration;
    if (m.freqRangeMin != null) entry.freqRangeMin = m.freqRangeMin;
    if (m.freqRangeMax != null) entry.freqRangeMax = m.freqRangeMax;
    if (m.speedTorqueCurve != null) entry.speedTorqueCurve = m.speedTorqueCurve;
    return entry;
  });
}

// Flatten servo/stepper motors from JSON data into a single array
const allMotors: MotorCatalogEntry[] = [
  ...toCatalogEntries((mitsubishiData as MotorDataFile).motors),
  ...toCatalogEntries((deltaData as MotorDataFile).motors),
  ...toCatalogEntries((yaskawaData as MotorDataFile).motors),
  ...toCatalogEntries((invtData as MotorDataFile).motors),
  ...toCatalogEntries((baumullerData as MotorDataFile).motors),
  ...toCatalogEntries((panasonicData as MotorDataFile).motors),
  ...toCatalogEntries((houleData as MotorDataFile).motors),
  ...toCatalogEntries((omronData as MotorDataFile).motors),
  ...toCatalogEntries((inovanceData as MotorDataFile).motors),
  ...toCatalogEntries((siemensData as MotorDataFile).motors),
  ...toCatalogEntries((orientalStepperData as MotorDataFile).motors),
  ...toCatalogEntries((leadshineStepperData as MotorDataFile).motors),
  ...toCatalogEntries((moonsStepperData as MotorDataFile).motors),
  ...toCatalogEntries((sanyoStepperData as MotorDataFile).motors),
];

// Induction motors and VFDs stored separately
const inductionMotors: MotorCatalogEntry[] = toCatalogEntries((inductionData as MotorDataFile).motors);
const vfdCatalog: MotorCatalogEntry[] = toCatalogEntries((vfdData as MotorDataFile).motors);

/**
 * Get all available motors in the catalog
 */
export function getAllMotors(): MotorCatalogEntry[] {
  return allMotors;
}

/**
 * Get motors filtered by type
 */
export function getMotorsByType(type: 'servo' | 'stepper' | 'induction'): MotorCatalogEntry[] {
  if (type === 'induction') {
    return inductionMotors;
  }
  return allMotors.filter(m => m.motorType === type);
}

/**
 * Get all VFDs in the catalog
 */
export function getVFDCatalog(): MotorCatalogEntry[] {
  return vfdCatalog;
}

/**
 * Get motors filtered by brand
 */
export function getMotorsByBrand(brand: string): MotorCatalogEntry[] {
  return allMotors.filter(m => m.brand === brand);
}

/**
 * Get all unique brands in the catalog
 */
export function getAvailableBrands(): string[] {
  return [...new Set(allMotors.map(m => m.brand))];
}

/**
 * Find candidate motors that match sizing requirements.
 * 
 * Matching criteria:
 * 1. ratedTorque >= Trms × torqueSafetyFactor (default 1.2)
 * 2. maxTorque >= Tpeak (if peak torque is known)
 * 3. ratedSpeed >= N_required
 * 4. For stepper: torque at speed must be sufficient (stepper torque drops with speed)
 * 
 * @param sizingResult - The sizing calculation result
 * @param motorTypeFilter - Optional: filter to specific motor type
 * @param maxResults - Maximum number of results to return
 */
export function findCandidateMotors(
  sizingResult: SizingResult,
  motorTypeFilter?: 'servo' | 'stepper' | 'induction',
  maxResults: number = 10
): MotorMatchResult[] {
  const { rmsTorque, loadInertia, motorSpeed, requiredPower, peakTorque, recommendedType } = sizingResult;
  
  // Use recommended type if no filter specified
  const filterType = motorTypeFilter || recommendedType;
  
  // For induction motors, use simplified matching (no inertia ratio requirement)
  if (filterType === 'induction') {
    return findInductionCandidates(sizingResult, maxResults);
  }
  
  // Filter motors by type (servo/stepper)
  let candidates = allMotors.filter(m => m.motorType === filterType);
  
  // If no candidates of recommended type, try all types
  if (candidates.length === 0) {
    candidates = [...allMotors];
  }
  
  // Score each candidate
  const results: MotorMatchResult[] = candidates.map(motor => {
    const warnings: string[] = [];
    
    // 1. Torque margin: Trated / Trms
    // For stepper, use rated torque (which is the holding torque at standstill)
    // Stepper torque drops significantly with speed, so we apply a derating factor
    let effectiveRatedTorque = motor.ratedTorque;
    if (motor.motorType === 'stepper') {
      // Stepper motors lose ~50% torque at 1000rpm, ~70% at 2000rpm
      // Apply derating based on required speed
      const speedRatio = motorSpeed / motor.maxSpeed;
      const deratingFactor = Math.max(0.3, 1 - speedRatio * 0.7);
      effectiveRatedTorque = motor.ratedTorque * deratingFactor;
      if (speedRatio > 0.5) {
        warnings.push('Kecepatan tinggi untuk motor stepper — torsi berkurang signifikan');
      }
    }
    
    const torqueMargin = rmsTorque > 0 ? effectiveRatedTorque / rmsTorque : Infinity;
    
    // 2. Inertia ratio: JL / JM — dynamic threshold per inertiaClass
    const inertiaRatio = motor.rotorInertia > 0 ? loadInertia / motor.rotorInertia : Infinity;
    const inertiaClass = motor.inertiaClass;
    // infer from series if not explicitly set
    let maxInertiaRatio = 15; // default Low
    if (inertiaClass === 'High') maxInertiaRatio = 30;
    else if (inertiaClass === 'Medium') maxInertiaRatio = 20;
    else if (inertiaClass === 'Low') maxInertiaRatio = 15;
    else {
      // auto-detect for motors without inertiaClass: high-inertia models often have 'High' in series or large frame
      const series = (motor.series || '').toLowerCase();
      const model = (motor.model || '').toLowerCase();
      if (series.includes('high') || model.includes('high') || series.includes('hg-sr') || series.includes('hg-jr') || series.includes('1fl6 high') || series.includes('ms1h3') || series.includes('h3') || motor.frameSize === 130 || motor.frameSize === 180) {
        maxInertiaRatio = 30;
      } else if (series.includes('medium') || series.includes('hg-mr') || series.includes('mdmf') || series.includes('ms1h2')) {
        maxInertiaRatio = 20;
      }
    }
    // stepper is stricter (stepper loses torque with inertia)
    if (motor.motorType === 'stepper') maxInertiaRatio = Math.min(maxInertiaRatio, 7);
    
    // 3. Power margin: Prated / Prequired
    const powerMargin = requiredPower > 0 ? motor.ratedPower / requiredPower : Infinity;
    
    // 4. Speed check
    const speedFits = motor.ratedSpeed >= motorSpeed;
    
    // 5. Peak torque check (if available)
    const peakTorqueFits = peakTorque > 0 ? motor.maxTorque >= peakTorque : true;
    
    // Calculate fitsCriteria — dynamic inertia threshold, allow oversized torque (just warn, don't hide for torque upper bound)
    const fitsCriteria = torqueMargin >= 1.0 && inertiaRatio <= maxInertiaRatio && powerMargin >= 1.0 && speedFits && peakTorqueFits;
    
    // Warnings — tiered by dynamic threshold
    if (torqueMargin < 1.2) {
      warnings.push(`Torsi margin rendah (${torqueMargin.toFixed(2)}x) — minimal 1.2x disarankan`);
    }
    if (torqueMargin > 3.0) {
      warnings.push(`Motor cukup besar (${torqueMargin.toFixed(1)}x margin) — pastikan sesuai aplikasi`);
    }
    if (torqueMargin > 5.0) {
      warnings.push(`Motor terlalu besar (${torqueMargin.toFixed(1)}x margin) — pertimbangkan yang lebih kecil`);
    }
    if (inertiaRatio > maxInertiaRatio) {
      warnings.push(`Rasio inersia ${inertiaRatio.toFixed(1)} melebihi batas ${maxInertiaRatio} untuk ${inertiaClass || 'Low'} — perlu gear reduction atau pilih motor High inertia`);
    } else if (inertiaRatio > maxInertiaRatio * 0.7) {
      warnings.push(`Rasio inersia tinggi (${inertiaRatio.toFixed(1)}/${maxInertiaRatio}) — pertimbangkan gear reduction`);
    }
    if (powerMargin < 1.0) {
      warnings.push('Daya motor tidak mencukupi');
    }
    if (!speedFits) {
      warnings.push('Kecepatan motor tidak mencukupi');
    }
    
    // Calculate overall score (0-100) — strict ratio 1 ideal
    let score = 0;
    
    // Torque fit (0-30 points)
    if (torqueMargin >= 1.2 && torqueMargin <= 2.0) {
      score += 30;
    } else if (torqueMargin >= 1.0 && torqueMargin < 1.2) {
      score += 20;
    } else if (torqueMargin > 2.0 && torqueMargin <= 3.0) {
      score += 22;
    } else if (torqueMargin > 3.0 && torqueMargin <= 4.0) {
      score += 15;
    } else if (torqueMargin > 4.0 && torqueMargin <= 5.0) {
      score += 8;
    } else if (torqueMargin > 5.0) {
      score += 2;
    }
    
    // Inertia ratio — 1-3 flat ideal (agak luas, sesuai request 1-3)
    let inertiaScore = 0;
    if (inertiaRatio >= 0.8 && inertiaRatio <= 3) {
      inertiaScore = 30; // 1,2,3 sama ideal
    } else if (inertiaRatio < 0.8 && inertiaRatio >= 0.3) {
      inertiaScore = 15;
    } else if (inertiaRatio < 0.3) {
      inertiaScore = 5;
    } else if (inertiaRatio <= maxInertiaRatio) {
      inertiaScore = 25 - (inertiaRatio - 3) * (25 / Math.max(1, maxInertiaRatio - 3));
      inertiaScore = Math.max(0, inertiaScore);
    }
    score += inertiaScore;
    
    // Power efficiency (0-15 points)
    // Best: rated power just above required (no waste)
    if (powerMargin >= 1.0 && powerMargin <= 1.5) {
      score += 15; // Optimal
    } else if (powerMargin > 1.5 && powerMargin <= 2.5) {
      score += 10; // Acceptable
    } else if (powerMargin > 2.5) {
      score += 3; // Oversized
    }
    
    // Speed match (0-10 points)
    if (speedFits) {
      score += 10;
    }
    
    // Peak torque (0-10 points)
    if (peakTorqueFits) {
      score += 10;
    }
    
    // Cost bonus (0-5 points)
    // Budget motors get bonus
    if (motor.costTier === 1) score += 5;
    else if (motor.costTier === 2) score += 3;
    
    // Availability bonus (0-5 points)
    if (motor.availability === 'local') score += 5;
    else if (motor.availability === 'regional') score += 3;
    
    score = Math.max(0, Math.min(100, score));
    
    return {
      motor,
      score: Math.round(score),
      torqueMargin,
      inertiaRatio,
      powerMargin,
      fitsCriteria,
      warnings
    };
  });
  
  // Filter handling differs per type
  if (filterType === 'stepper') {
    // Stepper: tampilkan dengan warning (jangan hide total) — beda dari servo strict
    const fitting = results.filter(r => r.fitsCriteria).sort((a, b) => b.score - a.score);
    const nonFitting = results.filter(r => !r.fitsCriteria).sort((a, b) => b.score - a.score);
    // Add warning for non-fitting stepper
    nonFitting.forEach(r => {
      if (!r.warnings.some(w => w.includes('Rasio inersia'))) {
        r.warnings.push(`Rasio inersia ${r.inertiaRatio.toFixed(1)} tinggi — tampil dengan warning, pertimbangkan gear reduction`);
      }
    });
    const combined = [...fitting, ...nonFitting];
    // best per brand from combined, but fitting first
    const bestPerBrand = new Map<string, MotorMatchResult>();
    for (const r of combined) {
      if (!bestPerBrand.has(r.motor.brand)) bestPerBrand.set(r.motor.brand, r);
    }
    return Array.from(bestPerBrand.values()).sort((a, b) => {
      if (a.fitsCriteria !== b.fitsCriteria) return a.fitsCriteria ? -1 : 1;
      return b.score - a.score;
    }).slice(0, maxResults);
  }

  // Servo: 2/brand + ratio 1-3 — jamin semua brand muncul (tidak muter2)
  const fitting = results.filter(r => r.fitsCriteria);
  const nonFitting = results.filter(r => !r.fitsCriteria);
  if (fitting.length === 0) {
    const bestNonFitting = new Map<string, MotorMatchResult>();
    for (const r of results.sort((a,b)=> b.score - a.score)) if (!bestNonFitting.has(r.motor.brand)) bestNonFitting.set(r.motor.brand, r);
    return Array.from(bestNonFitting.values()).slice(0, maxResults);
  }
  fitting.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Math.abs(a.inertiaRatio - 1) - Math.abs(b.inertiaRatio - 1);
  });
  const firstPerBrand = new Map<string, MotorMatchResult>();
  for (const r of fitting) if (!firstPerBrand.has(r.motor.brand)) firstPerBrand.set(r.motor.brand, r);
  const firstList = Array.from(firstPerBrand.values()).sort((a,b)=> b.score - a.score || Math.abs(a.inertiaRatio-1)-Math.abs(b.inertiaRatio-1));
  // tambahkan brand yang belum muncul (Houle dll) dari non-fitting sebelum ambil 2/brand
  const presentAfterFirst = new Set(firstList.map(r=>r.motor.brand));
  const missingBrands = new Map<string, MotorMatchResult>();
  for (const r of nonFitting.sort((a,b)=> b.score - a.score)) {
    if (!presentAfterFirst.has(r.motor.brand) && !missingBrands.has(r.motor.brand)) {
      r.warnings.push('Tidak ada motor brand ini yang memenuhi ratio 1-3 — tampil best dengan warning');
      missingBrands.set(r.motor.brand, r);
    }
  }
  const missingList = Array.from(missingBrands.values());
  const remaining = fitting.filter(r => !firstList.includes(r));
  const secondPerBrand = new Map<string, MotorMatchResult>();
  for (const r of remaining) if (!secondPerBrand.has(r.motor.brand) && firstPerBrand.has(r.motor.brand)) secondPerBrand.set(r.motor.brand, r);
  const secondList = Array.from(secondPerBrand.values()).sort((a,b)=> b.score - a.score || Math.abs(a.inertiaRatio-1)-Math.abs(b.inertiaRatio-1));
  const combined = [...firstList, ...missingList, ...secondList];
  return combined.slice(0, maxResults);
}

/**
 * Find induction motor candidates with VFD matching.
 * Simplified matching: power-based, no inertia ratio requirement.
 */
function findInductionCandidates(
  sizingResult: SizingResult,
  maxResults: number
): MotorMatchResult[] {
  const { rmsTorque, loadInertia, motorSpeed, requiredPower, peakTorque } = sizingResult;
  
  const results: MotorMatchResult[] = inductionMotors.map(motor => {
    const warnings: string[] = [];
    
    // 1. Torque margin
    const torqueMargin = rmsTorque > 0 ? motor.ratedTorque / rmsTorque : Infinity;
    
    // 2. Inertia ratio (for reference only, not used in fitsCriteria for induction)
    const inertiaRatio = motor.rotorInertia > 0 ? loadInertia / motor.rotorInertia : Infinity;
    
    // 3. Power margin
    const powerMargin = requiredPower > 0 ? motor.ratedPower / requiredPower : Infinity;
    
    // 4. Speed check - VFD-aware: use VFD freqRange to allow overspeed
    const vfdForSpeed = matchVFD(motor);
    const baseFreq = motor.frequency || 50;
    const maxFreq = vfdForSpeed?.freqRangeMax || baseFreq;
    const effectiveMaxSpeed = motor.ratedSpeed * (maxFreq / baseFreq);
    const effectiveMaxSpeed2 = motor.maxSpeed ? Math.max(motor.maxSpeed, effectiveMaxSpeed) : effectiveMaxSpeed;
    const speedFits = effectiveMaxSpeed2 >= motorSpeed;
    const isVfdOverspeed = speedFits && motor.ratedSpeed < motorSpeed;
    
    // 5. Peak torque check
    const peakTorqueFits = peakTorque > 0 ? motor.maxTorque >= peakTorque : true;
    
    // Induction fitsCriteria: simpler than servo (no inertia ratio requirement), all poles shown if power/torque ok — allow oversized
    const fitsCriteria = torqueMargin >= 1.0 && powerMargin >= 1.0 && speedFits && peakTorqueFits;
    
    // Warnings
    if (torqueMargin < 1.2) {
      warnings.push(`Torsi margin rendah (${torqueMargin.toFixed(2)}x)`);
    }
    if (torqueMargin > 3.0) {
      warnings.push(`Motor cukup besar (${torqueMargin.toFixed(1)}x margin)`);
    }
    if (powerMargin > 2.0) {
      warnings.push(`Daya motor cukup besar (${powerMargin.toFixed(1)}x) — pertimbangkan yang lebih kecil`);
    }
    if (!speedFits) {
      warnings.push('Kecepatan motor tidak mencukupi');
    }
    if (isVfdOverspeed) {
      warnings.push(`Kecepatan via VFD overspeed (${motor.ratedSpeed}→${effectiveMaxSpeed2.toFixed(0)} rpm, ${baseFreq}→${maxFreq}Hz) — cek torsi drop`);
    }
    // Show pole info for all induction
    warnings.push(`Pole ${motor.poleCount || '-'}P ${motor.frequency || 50}Hz — ${motor.ratedSpeed} rpm (VFD max ${effectiveMaxSpeed2.toFixed(0)} rpm)`);
    
    // Score (0-100) - индукция: power 30 + torque 25 + inertia 25 + speed 15 + cost 15 — ratio 1-3 flat
    let score = 0;
    
    // Power fit (0-30 points)
    if (powerMargin >= 1.0 && powerMargin <= 1.3) {
      score += 30;
    } else if (powerMargin > 1.3 && powerMargin <= 1.5) {
      score += 22;
    } else if (powerMargin > 1.5 && powerMargin <= 2.0) {
      score += 12;
    } else if (powerMargin > 2.0) {
      score += 3;
    }
    
    // Torque fit (0-25 points)
    if (torqueMargin >= 1.2 && torqueMargin <= 2.0) {
      score += 25;
    } else if (torqueMargin >= 1.0 && torqueMargin < 1.2) {
      score += 15;
    } else if (torqueMargin > 2.0 && torqueMargin <= 3.0) {
      score += 12;
    } else if (torqueMargin > 3.0) {
      score += 3;
    }

    // Inertia ratio 1-3 flat (0-25 points) — induksi juga 1-3 ideal
    let inertiaScore = 0;
    const maxInertiaInd = 15;
    if (inertiaRatio >= 0.8 && inertiaRatio <= 3) inertiaScore = 25;
    else if (inertiaRatio < 0.8 && inertiaRatio >= 0.3) inertiaScore = 12;
    else if (inertiaRatio < 0.3) inertiaScore = 3;
    else if (inertiaRatio <= maxInertiaInd) inertiaScore = 25 - (inertiaRatio - 3) * (25 / (maxInertiaInd - 3));
    score += Math.max(0, inertiaScore);
    
    // Speed fit (0-15 points)
    if (speedFits) {
      score += 15;
    }
    
    // Cost tier bonus (0-15 points) - induction motors are all budget
    if (motor.costTier === 1) score += 15;
    
    score = Math.max(0, Math.min(100, score));
    
    return {
      motor,
      score: Math.round(score),
      torqueMargin,
      inertiaRatio,
      powerMargin,
      fitsCriteria,
      warnings
    };
  });
  
  // Sort: fitsCriteria first, then by score descending
  results.sort((a, b) => {
    if (a.fitsCriteria !== b.fitsCriteria) {
      return a.fitsCriteria ? -1 : 1;
    }
    return b.score - a.score;
  });
  
  // Induction: 2 motor/pole + ratio 1-3 — bener2 fitsCriteria, per pole 2 best
  const fittingMotors = results.filter(r => r.fitsCriteria).sort((a,b)=> b.score - a.score);
  if (fittingMotors.length === 0) return [];
  const bestPerPole2 = new Map<number, MotorMatchResult[]>();
  for (const r of fittingMotors) {
    const pole = r.motor.poleCount || 0;
    const arr = bestPerPole2.get(pole) || [];
    if (arr.length < 2) arr.push(r); // 2 per pole
    bestPerPole2.set(pole, arr);
  }
  const poleBest2 = Array.from(bestPerPole2.values()).flat().sort((a,b)=> b.score - a.score);
  if (poleBest2.length >= maxResults) return poleBest2.slice(0, maxResults);
  // if not enough (e.g., only 2 pole types), fill with remaining fitting
  const remaining = fittingMotors.filter(r => !poleBest2.includes(r));
  return [...poleBest2, ...remaining].slice(0, maxResults);
}

/**
 * Match a VFD to an induction motor based on power rating
 */
export function matchVFD(motor: MotorCatalogEntry): MotorCatalogEntry | null {
  // Find smallest VFD that can handle the motor power
  const sortedVFDs = [...vfdCatalog].sort((a, b) => a.ratedPower - b.ratedPower);
  return sortedVFDs.find(vfd => vfd.ratedPower >= motor.ratedPower) || null;
}

/**
 * Get a summary of the motor catalog for display
 */
export function getCatalogSummary(): {
  totalMotors: number;
  brands: { brand: string; count: number; types: string[] }[];
  types: { type: string; count: number }[];
} {
  const brandMap = new Map<string, { count: number; types: Set<string> }>();
  const typeMap = new Map<string, number>();
  
  for (const motor of allMotors) {
    // Brand stats
    const brandEntry = brandMap.get(motor.brand) || { count: 0, types: new Set() };
    brandEntry.count++;
    brandEntry.types.add(motor.motorType);
    brandMap.set(motor.brand, brandEntry);
    
    // Type stats
    typeMap.set(motor.motorType, (typeMap.get(motor.motorType) || 0) + 1);
  }
  
  return {
    totalMotors: allMotors.length,
    brands: Array.from(brandMap.entries()).map(([brand, data]) => ({
      brand,
      count: data.count,
      types: Array.from(data.types)
    })),
    types: Array.from(typeMap.entries()).map(([type, count]) => ({
      type,
      count
    }))
  };
}
