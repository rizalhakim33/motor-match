'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface TorqueProfileChartProps {
  loadTorque: number;       // TL in N·m
  accelerationTorque: number; // TA in N·m
  motorSpeed: number;       // N in rpm
  accelerationTime: number; // tA in seconds
  decelerationTime: number; // tD in seconds
  cycleTime: number;        // total cycle time in seconds
  ratedTorque?: number;     // Motor rated torque (optional, for reference line)
  maxTorque?: number;       // Motor max torque (optional, for reference line)
}

interface DataPoint {
  time: number;
  torque: number;
  speed: number;
  phase: string;
}

/**
 * Generate 4-phase torque-speed-time profile data for visualization.
 * 
 * Phase 1 (accel):   T1 = TL + TA,  speed ramps from 0 to N
 * Phase 2 (const):   T2 = TL,       speed = N (constant)
 * Phase 3 (decel):   T3 = TL - TA,  speed ramps from N to 0
 * Phase 4 (dwell):   T4 = 0,        speed = 0
 */
function generateProfileData(
  loadTorque: number,
  accelerationTorque: number,
  motorSpeed: number,
  accelerationTime: number,
  decelerationTime: number,
  cycleTime: number
): DataPoint[] {
  const data: DataPoint[] = [];
  const tA = accelerationTime;
  const tD = decelerationTime;
  const tC = Math.max(0, cycleTime - tA - tD); // constant speed time

  const T1 = loadTorque + accelerationTorque;  // Accel phase
  const T2 = loadTorque;                        // Constant speed
  const T3 = loadTorque - accelerationTorque;   // Decel phase
  const T4 = 0;                                 // Dwell

  const steps = 50; // data points per phase
  const dt = cycleTime / (steps * 4 || 1);

  // Phase 1: Acceleration
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tA;
    const progress = i / steps;
    data.push({
      time: Math.round(t * 100) / 100,
      torque: T1,
      speed: Math.round(motorSpeed * progress * 10) / 10,
      phase: 'Akselerasi'
    });
  }

  // Phase 2: Constant speed
  for (let i = 1; i <= steps; i++) {
    const t = tA + (i / steps) * tC;
    data.push({
      time: Math.round(t * 100) / 100,
      torque: T2,
      speed: motorSpeed,
      phase: 'Konstan'
    });
  }

  // Phase 3: Deceleration
  for (let i = 1; i <= steps; i++) {
    const t = tA + tC + (i / steps) * tD;
    const progress = 1 - (i / steps);
    data.push({
      time: Math.round(t * 100) / 100,
      torque: T3,
      speed: Math.round(motorSpeed * progress * 10) / 10,
      phase: 'Dekelerasi'
    });
  }

  // Phase 4: Dwell (if any time left)
  const tDwell = cycleTime - tA - tC - tD;
  if (tDwell > 0) {
    data.push({
      time: Math.round((tA + tC + tD) * 100) / 100,
      torque: 0,
      speed: 0,
      phase: 'Dwell'
    });
    data.push({
      time: Math.round(cycleTime * 100) / 100,
      torque: 0,
      speed: 0,
      phase: 'Dwell'
    });
  }

  return data;
}

export default function TorqueProfileChart({
  loadTorque,
  accelerationTorque,
  motorSpeed,
  accelerationTime,
  decelerationTime,
  cycleTime,
  ratedTorque,
  maxTorque
}: TorqueProfileChartProps) {
  const data = generateProfileData(
    loadTorque, accelerationTorque, motorSpeed,
    accelerationTime, decelerationTime, cycleTime
  );

  const T1 = loadTorque + accelerationTorque;
  const T3 = loadTorque - accelerationTorque;
  const yMin = Math.min(T3, 0) * 1.2;
  const yMax = Math.max(T1, ratedTorque || 0, maxTorque || 0) * 1.3;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 mb-8 animate-in">
      <h3 className="text-lg font-semibold text-surface-900 mb-1">📈 Profil Torsi & Kecepatan</h3>
      <p className="text-xs text-surface-400 mb-4">4 fase siklus: Akselerasi → Konstan → Dekelerasi → Dwell</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Torque Profile */}
        <div>
          <h4 className="text-sm font-medium text-surface-600 mb-2">Torsi vs Waktu</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" type="number" domain={[0, cycleTime]} label={{ value: 'Waktu (s)', position: 'bottom', offset: -5, fontSize: 10 }} tick={{ fontSize: 10 }} />
              <YAxis domain={[yMin, yMax]} label={{ value: 'Torsi (N·m)', angle: -90, position: 'insideLeft', fontSize: 10 }} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(value) => [`${Number(value).toFixed(4)} N·m`, 'Torsi']}
                labelFormatter={(label) => `t = ${label}s`}
              />
              <Line type="stepAfter" dataKey="torque" stroke="#2563eb" strokeWidth={2} dot={false} name="Torsi" />
              {ratedTorque && <ReferenceLine y={ratedTorque} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Trated', position: 'right', fontSize: 9, fill: '#22c55e' }} />}
              {maxTorque && <ReferenceLine y={maxTorque} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Tmax', position: 'right', fontSize: 9, fill: '#ef4444' }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Speed Profile */}
        <div>
          <h4 className="text-sm font-medium text-surface-600 mb-2">Kecepatan vs Waktu</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="time" type="number" domain={[0, cycleTime]} label={{ value: 'Waktu (s)', position: 'bottom', offset: -5, fontSize: 10 }} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, motorSpeed * 1.1]} label={{ value: 'RPM', angle: -90, position: 'insideLeft', fontSize: 10 }} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
                formatter={(value) => [`${Number(value).toFixed(0)} rpm`, 'Kecepatan']}
                labelFormatter={(label) => `t = ${label}s`}
              />
              <Line type="linear" dataKey="speed" stroke="#f59e0b" strokeWidth={2} dot={false} name="Kecepatan" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Phase summary */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs">
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">Akselerasi: {accelerationTime}s (T={T1.toFixed(4)} N·m)</span>
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">Konstan: {(cycleTime - accelerationTime - decelerationTime).toFixed(2)}s (T={loadTorque.toFixed(4)} N·m)</span>
        <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700">Dekelerasi: {decelerationTime}s (T={T3.toFixed(4)} N·m)</span>
      </div>
    </div>
  );
}
