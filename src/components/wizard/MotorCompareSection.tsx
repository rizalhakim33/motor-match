'use client';

import { MotorCatalogEntry } from '@/types';
import { GitCompareArrows, Lightbulb, X, Check } from 'lucide-react';

interface MotorCompareSectionProps {
  comparedMotors: MotorCatalogEntry[];
  onRemoveMotor: (motorId: string) => void;
  onClearAll: () => void;
}

/**
 * Compare 2-3 motors side-by-side with highlighted differences.
 * Shows key specs in parallel columns, highlighting the better value in each row.
 */
export default function MotorCompareSection({ comparedMotors, onRemoveMotor, onClearAll }: MotorCompareSectionProps) {
  if (comparedMotors.length < 2) return null;

  // Determine best value per parameter (higher is better except weight)
  const getBest = (values: number[], higherIsBetter = true) => {
    if (higherIsBetter) {
      const max = Math.max(...values);
      return values.map(v => v === max);
    } else {
      const min = Math.min(...values);
      return values.map(v => v === min);
    }
  };

  const ratedTorques = comparedMotors.map(m => m.ratedTorque);
  const maxTorques = comparedMotors.map(m => m.maxTorque);
  const ratedSpeeds = comparedMotors.map(m => m.ratedSpeed);
  const powers = comparedMotors.map(m => m.ratedPower);
  const inertias = comparedMotors.map(m => m.rotorInertia);


  const bestTorque = getBest(ratedTorques);
  const bestMaxTorque = getBest(maxTorques);
  const bestSpeed = getBest(ratedSpeeds);
  const bestPower = getBest(powers);
  const bestInertia = getBest(inertias, false); // lower is better
  const bestWeight = getBest(comparedMotors.map(m => m.weight), false); // lower is better

  const fmt = (n: number, d = 4) => n.toFixed(d);
  const sci = (n: number) => Math.abs(n) < 0.001 || Math.abs(n) > 1000 ? n.toExponential(3) : n.toFixed(4);

  return (
    <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 mb-8 animate-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-surface-900 flex items-center gap-2">
            <GitCompareArrows className="w-5 h-5 text-purple-600" />
            Perbandingan Motor ({comparedMotors.length} terpilih)
          </h3>
          <p className="text-xs text-surface-400">Nilai terbaik per baris di-highlight hijau.</p>
        </div>
        <button onClick={onClearAll} className="text-xs text-surface-400 hover:text-red-500 transition-colors flex items-center gap-1">
          <X className="w-3 h-3" /> Hapus semua
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-surface-200">
              <th className="text-left py-3 px-3 text-surface-500 font-medium w-40">Parameter</th>
              {comparedMotors.map(m => (
                <th key={m.id} className="text-center py-3 px-3">
                  <div className="font-semibold text-surface-900">{m.brand}</div>
                  <div className="font-mono text-xs text-primary-600">{m.model}</div>
                  <button
                    onClick={() => onRemoveMotor(m.id)}
                    className="mt-1 text-xs text-surface-300 hover:text-red-500 transition-colors flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" /> hapus
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Power */}
            <SpecRow
              label="Daya (Watt)"
              values={comparedMotors.map(m => `${m.ratedPower}W`)}
              bestFlags={bestPower}
            />
            {/* Rated Torque */}
            <SpecRow
              label="Torsi Rated (N·m)"
              values={comparedMotors.map(m => fmt(m.ratedTorque))}
              bestFlags={bestTorque}
            />
            {/* Max Torque */}
            <SpecRow
              label="Torsi Max (N·m)"
              values={comparedMotors.map(m => fmt(m.maxTorque))}
              bestFlags={bestMaxTorque}
            />
            {/* Rated Speed */}
            <SpecRow
              label="Kecepatan Rated (rpm)"
              values={comparedMotors.map(m => `${m.ratedSpeed}`)}
              bestFlags={bestSpeed}
            />
            {/* Max Speed */}
            <SpecRow
              label="Kecepatan Max (rpm)"
              values={comparedMotors.map(m => `${m.maxSpeed}`)}
            />
            {/* Rotor Inertia */}
            <SpecRow
              label="Inersia Rotor (kg·m²)"
              values={comparedMotors.map(m => sci(m.rotorInertia))}
              bestFlags={bestInertia}
            />
            {/* Torque Constant */}
            <SpecRow
              label="Torsi Constant (N·m/A)"
              values={comparedMotors.map(m => m.torqueConstant ? fmt(m.torqueConstant) : '—')}
            />
            {/* Weight */}
            <SpecRow
              label="Berat (kg)"
              values={comparedMotors.map(m => `${m.weight}`)}
              bestFlags={bestWeight}
            />
            {/* Brake */}
            <SpecRow
              label="Brake"
              values={comparedMotors.map((m, i) => m.brakeAvailable ? <span key={i} className="flex items-center gap-1 justify-center"><Check className="w-3 h-3 text-green-600" /> Ya</span> : '— Tidak')}
            />
            {/* Cost Tier */}
            <SpecRow
              label="Cost Tier"
              values={comparedMotors.map(m => m.costTier === 1 ? 'Budget' : m.costTier === 2 ? 'Mid' : 'Premium')}
            />
            {/* Availability */}
            <SpecRow
              label="Ketersediaan"
              values={comparedMotors.map(m => m.availability === 'local' ? 'Lokal' : m.availability === 'regional' ? 'Regional' : 'Import')}
            />
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-surface-400 bg-surface-50 p-3 rounded-lg flex items-center gap-2">
        <Lightbulb className="w-4 h-4 flex-shrink-0" />
        Tips: Pilih motor berdasarkan kombinasi torsi margin (&gt;1.2× Trms), rasio inersia (1-15 ideal), dan ketersediaan di pasar lokal.
      </div>
    </div>
  );
}

function SpecRow({ label, values, bestFlags }: { label: string; values: (string | React.ReactNode)[]; bestFlags?: boolean[] }) {
  return (
    <tr className="border-b border-surface-100 hover:bg-surface-50 transition-colors">
      <td className="py-2.5 px-3 text-surface-600 text-xs font-medium">{label}</td>
      {values.map((val, i) => (
        <td
          key={i}
          className={`py-2.5 px-3 text-center font-mono text-xs ${
            bestFlags && bestFlags[i]
              ? 'bg-green-50 text-green-700 font-bold'
              : 'text-surface-800'
          }`}
        >
          {val}
        </td>
      ))}
    </tr>
  );
}
