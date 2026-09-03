'use client';

import { useState, Fragment } from 'react';
import { FileDown, RefreshCw, GitCompareArrows, Plus, X, Zap, AlertTriangle, CheckCircle, Cpu, LayoutGrid, List } from 'lucide-react';
import { MechanismType, SizingResult, MotorCatalogEntry, FullSizingResult } from '@/types';
import { calculateFullSizing, getFullSizingSummary } from '@/lib/fullSizing';
import { matchVFD } from '@/lib/motorCatalog';
import { exportSizingPdf } from '@/lib/exportPdf';
import { calculateGains } from '@/lib/gainCalculator';
import { toBrandDialects } from '@/lib/gainDialects';
import { GainResult } from '@/types';
import TorqueProfileChart from '@/components/charts/TorqueProfileChart';
import MotorCompareSection from './MotorCompareSection';

interface StepResultProps {
  result: SizingResult;
  mechanismType: MechanismType;
  cycleTime: number;
  accelerationTime: number;
  decelerationTime: number;
  efficiency: number;
  comparedMotors: MotorCatalogEntry[];
  onAddToCompare: (motor: MotorCatalogEntry) => void;
  onRemoveFromCompare: (motorId: string) => void;
  onClearCompare: () => void;
  onMotorTypeChange: (type: 'servo' | 'stepper' | 'induction') => void;
  onBack: () => void;
  onReset: () => void;
}

const formatNumber = (value: number, digits = 3) =>
  Number.isFinite(value) ? value.toLocaleString('id-ID', { maximumFractionDigits: digits }) : '-';

const motorTypeLabels: Record<string, { label: string; color: string; bg: string }> = {
  servo: { label: 'Servo', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-300' },
  stepper: { label: 'Stepper', color: 'text-green-700', bg: 'bg-green-100 border-green-300' },
  induction: { label: 'Induksi + VFD', color: 'text-orange-700', bg: 'bg-orange-100 border-orange-300' },
};

export default function StepResult({
  result,
  mechanismType,
  cycleTime,
  accelerationTime,
  decelerationTime,
  efficiency,
  comparedMotors,
  onAddToCompare,
  onRemoveFromCompare,
  onClearCompare,
  onMotorTypeChange,
  onBack,
  onReset
}: StepResultProps) {
  const [selectedMotor, setSelectedMotor] = useState<MotorCatalogEntry | null>(null);
  const [fullSizing, setFullSizing] = useState<FullSizingResult | null>(null);
  const [gains, setGains] = useState<GainResult | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [expandedVFD, setExpandedVFD] = useState<string | null>(null);

  const recommendedMotor = result.candidateMotors[0];
  const isCompared = (motorId: string) => comparedMotors.some(m => m.id === motorId);

  const handleSelectMotor = (motor: MotorCatalogEntry) => {
    if (selectedMotor?.id === motor.id) {
      setSelectedMotor(null);
      setFullSizing(null);
      setGains(null);
      return;
    }
    setSelectedMotor(motor);
    const fs = calculateFullSizing(result, motor, cycleTime, accelerationTime, decelerationTime, efficiency);
    setFullSizing(fs);
    if (motor.motorType === 'servo') {
      const g = calculateGains(motor.rotorInertia, result.loadInertia, motor.torqueConstant || 0.5);
      setGains(g);
    } else {
      setGains(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-surface-900">Hasil Sizing Motor</h2>
          <p className="mt-1 text-sm text-surface-500">Rekomendasi untuk mekanisme {mechanismType}.</p>
        </div>
        <button type="button" onClick={() => {
          const motor = selectedMotor || recommendedMotor;
          const dialects = gains && motor ? toBrandDialects(gains, motor.brand, motor.series) : undefined;
          exportSizingPdf({ result, mechanismType, selectedMotor: motor, fullSizing: fullSizing || undefined, gains: gains || undefined, brandDialects: dialects });
        }} className="btn-secondary py-2.5">
          <span className="flex items-center gap-2"><FileDown className="h-4 w-4" />Unduh PDF</span>
        </button>
      </div>

      {/* Motor Type Selection - compact */}
      <section className="mb-5 rounded-2xl border border-surface-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 mb-2">Jenis Motor</p>
            <div className="flex flex-wrap gap-2">
              {(['servo', 'stepper', 'induction'] as const).map((type) => {
                const info = motorTypeLabels[type];
                const isActive = result.recommendedType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onMotorTypeChange(type)}
                    className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${
                      isActive
                        ? `${info.bg} ${info.color} border-current shadow-sm`
                        : 'bg-white text-surface-500 border-surface-200 hover:border-surface-300 hover:text-surface-700'
                    }`}
                  >
                    {info.label}
                    {isActive && <span className="ml-1 text-xs opacity-70">(Rekomendasi)</span>}
                  </button>
                );
              })}
            </div>
          </div>
          {result.recommendedType === 'servo' && (
            <div className="flex items-center gap-1.5 bg-surface-50 rounded-full p-1 border border-surface-200">
              <span className="text-xs text-surface-500 px-2 hidden sm:inline">Inertia:</span>
              <span className="text-[10px] font-semibold text-surface-400 px-1">Low 15</span>
              <span className="text-[10px] font-semibold text-surface-400">|</span>
              <span className="text-[10px] font-semibold text-surface-400 px-1">Med 20</span>
              <span className="text-[10px] font-semibold text-surface-400">|</span>
              <span className="text-[10px] font-semibold text-surface-400 px-1">High 30</span>
            </div>
          )}
        </div>
        <p className="mt-2.5 text-sm text-surface-500">{result.recommendationReason}</p>
        {result.candidateMotors.length === 0 && (
          <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
            Tidak ada servo yang memenuhi rasio inersia (Low 15 / Medium 20 / High 30). Coba pilih motor <span className="font-semibold">High inertia</span> atau gunakan <span className="font-semibold">gear reduction</span>.
          </div>
        )}
      </section>

      {/* Sticky summary */}
      <div className="sticky top-14 z-10 -mx-5 md:-mx-6 px-5 md:px-6 py-3 mb-5 bg-white/90 backdrop-blur border-y border-surface-200 flex flex-wrap gap-3">
        <StickyMetric label="RMS" value={formatNumber(result.rmsTorque)} unit="N·m" />
        <div className="w-px bg-surface-200 hidden sm:block" />
        <StickyMetric label="Peak" value={formatNumber(result.peakTorque)} unit="N·m" />
        <div className="w-px bg-surface-200 hidden sm:block" />
        <StickyMetric label="Speed" value={formatNumber(result.motorSpeed)} unit="rpm" />
        <div className="w-px bg-surface-200 hidden sm:block" />
        <StickyMetric label="Power" value={formatNumber(result.requiredPower)} unit="W" highlight />
      </div>

      {/* Torque & Speed Profile Chart */}
      <TorqueProfileChart
        loadTorque={result.loadTorque}
        accelerationTorque={result.accelerationTorque}
        motorSpeed={result.motorSpeed}
        accelerationTime={accelerationTime}
        decelerationTime={decelerationTime}
        cycleTime={cycleTime}
        ratedTorque={selectedMotor?.ratedTorque || recommendedMotor?.ratedTorque}
        maxTorque={selectedMotor?.maxTorque || recommendedMotor?.maxTorque}
      />

      {/* Motor Compare Section */}
      <MotorCompareSection
        comparedMotors={comparedMotors}
        onRemoveMotor={onRemoveFromCompare}
        onClearAll={onClearCompare}
      />

      {/* Full Sizing Panel */}
      {selectedMotor && fullSizing && (
        <FullSizingPanel motor={selectedMotor} result={result} fullSizing={fullSizing} />
      )}

      {/* Gain Calculator Panel */}
      {selectedMotor && gains && selectedMotor.motorType === 'servo' && (
        <GainPanel gains={gains} motor={selectedMotor} />
      )}

      <section className="mb-6 rounded-2xl border border-surface-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-surface-900 text-sm">Kandidat Motor</h3>
          <div className="flex items-center gap-2">
            {comparedMotors.length > 0 && (
              <span className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full flex items-center gap-1">
                <GitCompareArrows className="w-3 h-3" />
                {comparedMotors.length}/3 dipilih
              </span>
            )}
            <div className="flex bg-surface-100 rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors ${viewMode === 'list' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-400 hover:text-surface-600'}`}
                title="Tampilan List (cepat banding)"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('card')}
                className={`p-1.5 rounded-full transition-colors ${viewMode === 'card' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-400 hover:text-surface-600'}`}
                title="Tampilan Card"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-xs text-surface-500 mb-3">Klik baris untuk full sizing • <span className="font-medium text-primary-600">Pilih</span> = set primary, <span className="font-medium text-purple-600">Bandingkan</span> = compare (max 3)</p>
        {result.candidateMotors.length ? (
          <div className="overflow-x-auto -mx-4 px-4">
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {result.candidateMotors.map((motor) => {
                  const isSelected = selectedMotor?.id === motor.id;
                  const matchedVFD = result.recommendedType === 'induction' ? matchVFD(motor) : null;
                  const isVFDOpen = expandedVFD === motor.id;
                  return (
                    <div
                      key={motor.id}
                      onClick={() => handleSelectMotor(motor)}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${
                        isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-surface-200 hover:border-surface-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-surface-900 flex items-center gap-1.5"><Zap className={`w-3.5 h-3.5 ${motorTypeLabels[result.recommendedType]?.color || 'text-blue-600'}`} />{motor.brand} {motor.model}</span>
                        {isSelected && <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">Dipilih</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        <div><span className="text-surface-500">Daya:</span> <span className="font-medium">{motor.ratedPower >= 1000 ? `${(motor.ratedPower / 1000).toFixed(2)} kW` : `${motor.ratedPower} W`}</span></div>
                        <div><span className="text-surface-500">Torsi:</span> <span className="font-medium">{motor.ratedTorque} N·m</span></div>
                        <div><span className="text-surface-500">Speed:</span> <span className="font-medium">{motor.ratedSpeed} rpm</span></div>
                        <div><span className="text-surface-500">Max:</span> <span className="font-medium">{motor.maxTorque} N·m</span></div>
                      </div>
                      {matchedVFD && (
                        <div className="mt-2">
                          <button type="button" onClick={(e)=>{e.stopPropagation(); setExpandedVFD(isVFDOpen?null:motor.id);}} className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1">
                            <Cpu className="w-3 h-3" /> VFD {isVFDOpen ? '▲' : '▼'}
                          </button>
                          {isVFDOpen && (
                            <div className="mt-1.5 rounded-lg bg-surface-50 border border-surface-200 p-2.5 text-xs">
                              <p className="font-semibold text-surface-700">{matchedVFD.brand} {matchedVFD.model}</p>
                              <p className="text-surface-500">{(matchedVFD.ratedPower/1000).toFixed(2)} kW • {matchedVFD.overloadPercent}%/{matchedVFD.overloadDuration}s • {matchedVFD.freqRangeMin}-{matchedVFD.freqRangeMax} Hz</p>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-2.5 flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleSelectMotor(motor); }}
                          className={`flex-1 py-1.5 rounded-full text-xs font-medium border ${isSelected ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-surface-700 border-surface-200 hover:border-primary-300'}`}
                        >
                          {isSelected ? 'Terpilih' : 'Pilih'}
                        </button>
                        <button
                          type="button"
                                onClick={(e) => { e.stopPropagation(); if (isCompared(motor.id)) { onRemoveFromCompare(motor.id); } else { onAddToCompare(motor); } }}
                          disabled={!isCompared(motor.id) && comparedMotors.length >= 3}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border ${isCompared(motor.id) ? 'bg-purple-600 text-white border-purple-600' : comparedMotors.length>=3 ? 'bg-surface-100 text-surface-400 border-surface-200' : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'}`}
                        >
                          {isCompared(motor.id) ? <span className="flex items-center gap-1"><X className="w-3 h-3"/>Hapus</span> : <span className="flex items-center gap-1"><Plus className="w-3 h-3"/>Banding</span>}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-surface-200 text-surface-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="pb-2.5 pr-3 font-medium">Model</th>
                    <th className="pb-2.5 pr-3 font-medium">Daya</th>
                    <th className="pb-2.5 pr-3 font-medium">Torsi</th>
                    <th className="pb-2.5 pr-3 font-medium">Speed</th>
                    <th className="pb-2.5 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {result.candidateMotors.map((motor) => {
                    const isSelected = selectedMotor?.id === motor.id;
                    const matchedVFD = result.recommendedType === 'induction' ? matchVFD(motor) : null;
                    const isVFDOpen = expandedVFD === motor.id;
                    return (
                      <Fragment key={motor.id}>
                        <tr
                          onClick={() => handleSelectMotor(motor)}
                          className={`border-b border-surface-100 last:border-0 cursor-pointer transition-colors ${
                            isSelected ? 'bg-primary-50' : 'hover:bg-surface-50'
                          }`}
                        >
                          <td className="py-2.5 pr-3">
                            <span className="font-medium text-surface-900">{motor.brand} {motor.model}</span>
                            {isSelected && <span className="ml-2 text-xs bg-primary-600 text-white px-1.5 py-0.5 rounded-full">Pilih</span>}
                            {matchedVFD && (
                              <button type="button" onClick={(e)=>{e.stopPropagation(); setExpandedVFD(isVFDOpen?null:motor.id);}} className="ml-2 text-xs text-orange-600 hover:underline">VFD {isVFDOpen?'▲':'▼'}</button>
                            )}
                          </td>
                          <td className="py-2.5 pr-3 text-surface-700">{motor.ratedPower >= 1000 ? `${(motor.ratedPower / 1000).toFixed(2)} kW` : `${motor.ratedPower} W`}</td>
                          <td className="py-2.5 pr-3">{motor.ratedTorque} N·m</td>
                          <td className="py-2.5 pr-3">{motor.ratedSpeed} rpm</td>
                          <td className="py-2.5 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleSelectMotor(motor); }}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${isSelected ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-surface-700 border-surface-200 hover:border-primary-300'}`}
                              >
                                Pilih
                              </button>
                              <button
                                type="button"
                          onClick={(e) => { e.stopPropagation(); if (isCompared(motor.id)) { onRemoveFromCompare(motor.id); } else { onAddToCompare(motor); } }}
                                disabled={!isCompared(motor.id) && comparedMotors.length >= 3}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${isCompared(motor.id) ? 'bg-purple-600 text-white border-purple-600' : comparedMotors.length>=3 ? 'bg-surface-100 text-surface-400 border-surface-200' : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'}`}
                              >
                                {isCompared(motor.id) ? 'Hapus' : 'Banding'}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {matchedVFD && isVFDOpen && (
                          <tr key={`${motor.id}-vfd`} className="bg-orange-50/50">
                            <td colSpan={5} className="py-2 px-3 text-xs">
                              <span className="font-medium text-surface-700 flex items-center gap-1"><Cpu className="w-3 h-3 text-orange-600"/>{matchedVFD.brand} {matchedVFD.model}</span>
                              <span className="text-surface-500 ml-4">{(matchedVFD.ratedPower/1000).toFixed(2)} kW • Overload {matchedVFD.overloadPercent}%/{matchedVFD.overloadDuration}s • {matchedVFD.freqRangeMin}-{matchedVFD.freqRangeMax} Hz</span>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ) : <p className="mt-3 text-sm text-surface-500">Tidak ada kandidat katalog yang memenuhi kriteria saat ini.</p>}
      </section>

      <div className="flex justify-between gap-3">
        <button type="button" onClick={onBack} className="btn-secondary">Ubah Parameter</button>
        <button type="button" onClick={onReset} className="btn-primary">
          <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4" />Sizing Baru</span>
        </button>
      </div>
    </div>
  );
}

function StickyMetric({ label, value, unit, highlight }: { label: string; value: string; unit: string; highlight?: boolean }) {
  return (
    <div className={`flex-1 min-w-[80px] ${highlight ? 'text-primary-700' : 'text-surface-900'}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-surface-500">{label}</p>
      <p className="text-sm font-bold">{value} <span className="text-xs font-medium text-surface-500">{unit}</span></p>
    </div>
  );
}

function ResultMetric({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-surface-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-surface-900">{value} <span className="text-sm font-medium text-surface-500">{unit}</span></p>
    </div>
  );
}

function FullSizingPanel({ motor, result, fullSizing }: { motor: MotorCatalogEntry; result: SizingResult; fullSizing: FullSizingResult }) {
  const summary = getFullSizingSummary(fullSizing, motor);

  return (
    <div className="mb-8 rounded-2xl border-2 border-primary-200 bg-primary-50 p-6 animate-in">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-surface-900">Full Sizing: {motor.brand} {motor.model}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-4">
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Rasio Inersia (JL/JM)</p>
          <p className={`text-lg font-bold ${fullSizing.inertiaRatioSatisfied ? 'text-green-700' : 'text-red-600'}`}>
            {fullSizing.actualInertiaRatio.toFixed(1)}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Torsi Akselerasi (TA)</p>
          <p className="text-lg font-bold text-surface-900">{fullSizing.actualAccelerationTorque.toFixed(4)} N·m</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Peak Torque</p>
          <p className={`text-lg font-bold ${fullSizing.peakTorqueSatisfied ? 'text-green-700' : 'text-red-600'}`}>
            {fullSizing.actualPeakTorque.toFixed(4)} N·m
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">RMS Torque</p>
          <p className={`text-lg font-bold ${fullSizing.dutyCycleSatisfied ? 'text-green-700' : 'text-red-600'}`}>
            {fullSizing.actualRmsTorque.toFixed(4)} N·m
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Motor Rated Torque</p>
          <p className="text-lg font-bold text-surface-900">{motor.ratedTorque} N·m</p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Motor Max Torque</p>
          <p className="text-lg font-bold text-surface-900">{motor.maxTorque} N·m</p>
        </div>
      </div>

      {/* Status badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <StatusBadge ok={fullSizing.dutyCycleSatisfied} label="Duty Cycle" />
        <StatusBadge ok={fullSizing.peakTorqueSatisfied} label="Peak Torque" />
        <StatusBadge ok={fullSizing.inertiaRatioSatisfied} label="Inertia Ratio" />
      </div>

      {fullSizing.recommendedGearRatio && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          <AlertTriangle className="inline w-4 h-4 mr-1" />
          {fullSizing.gearRatioReason}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${
      ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {ok ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
      {label}: {ok ? 'OK' : 'FAIL'}
    </span>
  );
}

function GainPanel({ gains, motor }: { gains: GainResult; motor: MotorCatalogEntry }) {
  const dialects = toBrandDialects(gains, motor.brand, motor.series);
  return (
    <div className="mb-8 rounded-2xl border-2 border-purple-200 bg-purple-50 p-6 animate-in">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-surface-900">Starting-Point Gain (Servo)</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 mb-4">
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Speed Loop Gain (Kv)</p>
          <p className="text-lg font-bold text-surface-900">{gains.speedLoopGain.toFixed(2)} <span className="text-xs text-surface-500">rad/s</span></p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Integral Time (Tvi)</p>
          <p className="text-lg font-bold text-surface-900">{gains.speedIntegralTime.toFixed(1)} <span className="text-xs text-surface-500">ms</span></p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Position Gain (Kp)</p>
          <p className="text-lg font-bold text-surface-900">{gains.positionLoopGain.toFixed(2)} <span className="text-xs text-surface-500">1/s</span></p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Total Inertia (Jtotal)</p>
          <p className="text-lg font-bold text-surface-900">{gains.totalInertia.toExponential(2)} <span className="text-xs text-surface-500">kg·m²</span></p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Inertia Ratio (JL/JM)</p>
          <p className={`text-lg font-bold ${gains.inertiaRatio > 15 ? 'text-red-600' : gains.inertiaRatio > 5 ? 'text-amber-600' : 'text-green-700'}`}>
            {gains.inertiaRatio.toFixed(1)}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 border border-surface-200">
          <p className="text-xs text-surface-500">Speed Bandwidth (ωv)</p>
          <p className="text-lg font-bold text-surface-900">{gains.speedBandwidth} <span className="text-xs text-surface-500">rad/s</span></p>
        </div>
      </div>

      {/* Brand-specific dialects */}
      {dialects.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-surface-500 mb-2">Nilai per Merek</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {dialects.map((d) => (
              <div key={d.brand} className="rounded-lg bg-white border border-surface-200 p-3 text-xs">
                <p className="font-semibold text-surface-700">{d.brand} <span className="font-normal text-surface-400">{d.series}</span></p>
                <div className="mt-1.5 space-y-1 text-surface-600">
                  <p><span className="text-surface-400">{d.speedGainName}:</span> <span className="font-mono font-medium">{d.speedGainValue}</span></p>
                  <p><span className="text-surface-400">{d.integralTimeName}:</span> <span className="font-mono font-medium">{d.integralTimeValue}</span></p>
                  <p><span className="text-surface-400">{d.positionGainName}:</span> <span className="font-mono font-medium">{d.positionGainValue}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {gains.warnings.length > 0 && (
        <div className="mt-3 space-y-1">
          {gains.warnings.map((w, i) => (
            <div key={i} className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-800">
              <AlertTriangle className="inline w-3 h-3 mr-1" />{w}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-surface-400 bg-white/60 p-2 rounded-lg">
        Catatan: Nilai bersifat starting-point. Verifikasi dan fine-tuning tetap perlu dilakukan di lapangan.
      </div>
    </div>
  );
}
