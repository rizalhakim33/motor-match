import { GainResult } from './gainCalculator';

export interface BrandGain {
  brand: string;
  series: string;
  speedGainName: string;
  speedGainValue: string;
  integralTimeName: string;
  integralTimeValue: string;
  positionGainName: string;
  positionGainValue: string;
}

/**
 * Convert generic gain values to brand-specific parameter names and formats.
 * Each servo brand has its own naming convention for tuning parameters.
 */
export function toBrandDialects(gain: GainResult, motorBrand: string, motorSeries: string): BrandGain[] {
  const dialects: BrandGain[] = [];

  const kv = gain.speedLoopGain;
  const tvi = gain.speedIntegralTime;
  const kp = gain.positionLoopGain;

  const brandLower = motorBrand.toLowerCase();

  // Baumüller
  if (brandLower.includes('baumuller') || brandLower.includes('baumüller')) {
    dialects.push({
      brand: 'Baumüller',
      series: motorSeries,
      speedGainName: 'Kv (Speed Gain)',
      speedGainValue: `${kv.toFixed(2)} rad/s`,
      integralTimeName: 'Tn (Integral Time)',
      integralTimeValue: `${tvi.toFixed(1)} ms`,
      positionGainName: 'Kp (Position Gain)',
      positionGainValue: `${kp.toFixed(2)} 1/s`,
    });
  }

  // Mitsubishi
  if (brandLower.includes('mitsubishi')) {
    dialects.push({
      brand: 'Mitsubishi',
      series: motorSeries,
      speedGainName: 'Speed Gain 1 (PB)',
      speedGainValue: `${kv.toFixed(2)} rad/s`,
      integralTimeName: 'Speed Integral Compensation',
      integralTimeValue: `${tvi.toFixed(1)} ms`,
      positionGainName: 'Position Loop Gain (PA)',
      positionGainValue: `${kp.toFixed(2)} rad/s`,
    });
  }

  // Yaskawa
  if (brandLower.includes('yaskawa')) {
    dialects.push({
      brand: 'Yaskawa',
      series: motorSeries,
      speedGainName: 'Speed Loop Gain (PG2)',
      speedGainValue: `${kv.toFixed(2)} 1/s`,
      integralTimeName: 'Speed Loop Integral Time (TI)',
      integralTimeValue: `${tvi.toFixed(1)} ms`,
      positionGainName: 'Position Loop Gain (PG1)',
      positionGainValue: `${kp.toFixed(2)} 1/s`,
    });
  }

  // Delta
  if (brandLower.includes('delta')) {
    dialects.push({
      brand: 'Delta',
      series: motorSeries,
      speedGainName: 'Velocity Loop Gain (KV)',
      speedGainValue: `${(kv / (2 * Math.PI)).toFixed(2)} Hz`,
      integralTimeName: 'Velocity Integral Time (TI)',
      integralTimeValue: `${tvi.toFixed(1)} ms`,
      positionGainName: 'Position Loop Gain (KP)',
      positionGainValue: `${(kp / (2 * Math.PI)).toFixed(2)} Hz`,
    });
  }

  // Panasonic
  if (brandLower.includes('panasonic')) {
    dialects.push({
      brand: 'Panasonic',
      series: motorSeries,
      speedGainName: 'Speed Loop Gain (VGN)',
      speedGainValue: `${kv.toFixed(2)} rad/s`,
      integralTimeName: 'Speed Loop Integral Time (VGI)',
      integralTimeValue: `${tvi.toFixed(1)} ms`,
      positionGainName: 'Position Loop Gain (PGN)',
      positionGainValue: `${kp.toFixed(2)} 1/s`,
    });
  }

  // Omron
  if (brandLower.includes('omron')) {
    dialects.push({
      brand: 'Omron',
      series: motorSeries,
      speedGainName: 'Speed Loop Gain (Stiffness)',
      speedGainValue: `${kv.toFixed(2)} rad/s`,
      integralTimeName: 'Speed Loop Integral (Stiffness)',
      integralTimeValue: `${tvi.toFixed(1)} ms`,
      positionGainName: 'Position Loop Gain',
      positionGainValue: `${kp.toFixed(2)} 1/s`,
    });
  }

  // INVT / Oriental / Leadshine / Moons / Sanyo / Houle / Inovance / Siemens
  // Generic dialect for other brands
  if (dialects.length === 0) {
    dialects.push({
      brand: motorBrand,
      series: motorSeries,
      speedGainName: 'Speed Gain (Kv)',
      speedGainValue: `${kv.toFixed(2)} rad/s`,
      integralTimeName: 'Integral Time (Tvi)',
      integralTimeValue: `${tvi.toFixed(1)} ms`,
      positionGainName: 'Position Gain (Kp)',
      positionGainValue: `${kp.toFixed(2)} 1/s`,
    });
  }

  return dialects;
}

/**
 * Get brand dialects for all supported servo brands (used in testing).
 */
export function getAllBrandDialects(gain: GainResult): BrandGain[] {
  const allBrands = [
    { brand: 'Baumüller', series: 'BM5000' },
    { brand: 'Mitsubishi', series: 'HG-KR' },
    { brand: 'Yaskawa', series: 'Sigma-7' },
    { brand: 'Delta', series: 'ASDA-B3' },
    { brand: 'Panasonic', series: 'MINAS A6' },
    { brand: 'Omron', series: '1S' },
    { brand: 'Generic', series: 'Servo' },
  ];
  return allBrands.flatMap(b => toBrandDialects(gain, b.brand, b.series));
}
