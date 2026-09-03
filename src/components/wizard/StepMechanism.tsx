'use client';

import { useState, useMemo } from 'react';
import { LucideIcon, Settings, RotateCw, Repeat, ArrowUp, CircleDot, Target, Package, Link, Factory, ShoppingCart, Zap, Ruler, Wind, Droplets, Cog, ArrowUpFromLine, Search, X, Info } from 'lucide-react';
import { MechanismGroup, MechanismType } from '@/types';

interface StepMechanismProps {
  groups: { name: MechanismGroup; mechanisms: MechanismType[] }[];
  selectedGroup: MechanismGroup | null;
  selectedMechanism: MechanismType | null;
  onGroupSelect: (group: MechanismGroup) => void;
  onMechanismSelect: (mechanism: MechanismType) => void;
}

const groupIcons: Record<MechanismGroup, LucideIcon> = {
  'Linear Motion': Settings,
  'Rotary Indexing': RotateCw,
  'Rotary Continuous': Repeat,
  'Vertical/Hoisting': ArrowUp
};

const mechanismIcons: Record<MechanismType, LucideIcon> = {
  'Ball Screw': CircleDot,
  'Rack and Pinion': Target,
  'Roll Feed': Package,
  'Sprocket & Chain': Link,
  'Conveyor (Belt)': Factory,
  'Cart': ShoppingCart,
  'Linear Servo': Zap,
  'Generic (linear)': Ruler,
  'Rotary Table': RotateCw,
  'Fan': Wind,
  'Pump': Droplets,
  'Generic (rotary)': Cog,
  'Elevator/hoist': ArrowUpFromLine
};

export default function StepMechanism({
  groups,
  selectedMechanism,
  onGroupSelect,
  onMechanismSelect
}: StepMechanismProps) {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<MechanismGroup | 'All'>('All');

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter(g => activeGroup === 'All' || g.name === activeGroup)
      .map(g => ({
        ...g,
        mechanisms: g.mechanisms.filter(m => !q || m.toLowerCase().includes(q))
      }))
      .filter(g => g.mechanisms.length > 0);
  }, [groups, query, activeGroup]);

  const totalVisible = filteredGroups.reduce((acc, g) => acc + g.mechanisms.length, 0);

  const handleGroupPillClick = (group: MechanismGroup | 'All') => {
    setActiveGroup(group);
    if (group !== 'All') onGroupSelect(group as MechanismGroup);
  };

  return (
    <div className="animate-fade-in">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-surface-900 flex items-center gap-2">
            Pilih Jenis Mekanisme
            <span className="group relative inline-flex">
              <Info className="w-4 h-4 text-surface-400 cursor-help" />
              <span className="pointer-events-none absolute left-1/2 top-full z-10 hidden w-64 -translate-x-1/2 mt-2 rounded-lg border border-surface-200 bg-white p-3 text-xs leading-relaxed text-surface-600 shadow-medium group-hover:block">
                Pilih mekanisme sesuai aplikasi. Setiap mekanisme punya formula torsi & inersia berbeda (P/D dalam mm, konversi 10⁻³/10⁻⁶ sudah ditangani).
              </span>
            </span>
          </h2>
          <p className="text-sm text-surface-500 mt-1">
            Cari atau filter grup, lalu klik 1 mekanisme untuk lanjut.
          </p>
        </div>
        <div className="relative w-full sm:w-72 flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari: ball screw, conveyor..."
            className="w-full pl-9 pr-8 py-2.5 text-sm bg-white border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder:text-surface-400"
            aria-label="Cari mekanisme"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface-100 text-surface-400"
              aria-label="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Pill Filter */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-surface-100 rounded-full w-fit mb-6">
        {(['All', ...groups.map(g => g.name)] as const).map((g) => {
          const isActive = activeGroup === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => handleGroupPillClick(g as MechanismGroup | 'All')}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors border ${
                isActive
                  ? 'bg-white text-surface-900 shadow-sm border-surface-200'
                  : 'bg-transparent text-surface-500 border-transparent hover:text-surface-700 hover:bg-white/60'
              }`}
            >
              {g === 'All' ? 'Semua' : g}
            </button>
          );
        })}
      </div>

      {/* Grouped Grid — sedang density */}
      {filteredGroups.length > 0 ? (
        <div className="space-y-6">
          {filteredGroups.map((group) => {
            const GroupIcon = groupIcons[group.name];
            return (
              <section key={group.name}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-surface-100 text-surface-500 flex items-center justify-center">
                    <GroupIcon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-surface-500">
                    {group.name}
                  </h3>
                  <span className="text-xs text-surface-400">— {group.mechanisms.length}</span>
                  <div className="flex-1 h-px bg-surface-100 ml-2" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {group.mechanisms.map((mechanism) => {
                    const MechanismIcon = mechanismIcons[mechanism];
                    const isSelected = selectedMechanism === mechanism;
                    return (
                      <button
                        key={mechanism}
                        type="button"
                        onClick={() => onMechanismSelect(mechanism)}
                        className={`p-3 rounded-xl border-2 text-left flex items-start gap-2.5 transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 shadow-sm'
                            : 'border-surface-200 bg-white hover:border-primary-300 hover:shadow-soft'
                        }`}
                      >
                        <MechanismIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-primary-600' : 'text-surface-400'}`} />
                        <span className="text-sm font-medium text-surface-900 leading-tight">{mechanism}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-8 text-center">
          <p className="text-sm font-medium text-surface-700">Tidak ada mekanisme cocok untuk &quot;{query}&quot;</p>
          <p className="text-xs text-surface-500 mt-1">Coba kata kunci lain atau pilih &quot;Semua&quot;.</p>
          <button type="button" onClick={() => { setQuery(''); setActiveGroup('All'); }} className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
            Reset filter
          </button>
        </div>
      )}

      <p className="mt-6 text-xs text-surface-400 text-center">
        {totalVisible} mekanisme tersedia · klik untuk isi parameter
      </p>
    </div>
  );
}
