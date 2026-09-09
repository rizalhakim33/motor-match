'use client';

import { useState } from 'react';
import { WizardState, MechanismGroup, MechanismType, MechanismProfile, MotorCatalogEntry } from '@/types';
import { getMechanismGroups, getMechanismParameters, calculateSizing, getMechanismGroupForType } from '@/lib/calculationEngine';
import { findCandidateMotors } from '@/lib/motorCatalog';
import Image from 'next/image';
import { Settings, FileText, BarChart3, Check } from 'lucide-react';
import StepMechanism from './StepMechanism';
import StepParameters from './StepParameters';
import StepResult from './StepResult';

const initialWizardState: WizardState = {
  currentStep: 1,
  mechanismGroup: null,
  mechanismType: null,
  parameters: {
    group: 'Linear Motion',
    mechanismType: 'Ball Screw',
    speedRequired: 0,
    cycleTime: 1,
    needsPrecisePosition: false,
    mechanismParams: {},
    accelerationTime: 0.2,
    decelerationTime: 0.2,
    gearRatio: 1,
    efficiency: 0.9
  },
  result: null,
  showMotorCatalog: false,
  comparedMotors: []
};

const steps = [
  { number: 1, label: 'Mekanisme', icon: Settings },
  { number: 2, label: 'Parameter', icon: FileText },
  { number: 3, label: 'Hasil', icon: BarChart3 }
];

export default function MotorWizard() {
  const [state, setState] = useState<WizardState>(initialWizardState);
  
  const mechanismGroups = getMechanismGroups();
  
  const handleGroupSelect = (group: MechanismGroup) => {
    setState(prev => ({
      ...prev,
      mechanismGroup: group,
      mechanismType: null,
      parameters: {
        ...prev.parameters,
        group
      }
    }));
  };
  
  const handleMechanismSelect = (mechanism: MechanismType) => {
    const group = getMechanismGroupForType(mechanism) || prevGroupFallback(mechanism);
    setState(prev => ({
      ...prev,
      mechanismGroup: group,
      mechanismType: mechanism,
      currentStep: 2,
      parameters: {
        ...prev.parameters,
        group: group || prev.parameters.group,
        mechanismType: mechanism
      }
    }));
  };

  function prevGroupFallback(m: MechanismType): MechanismGroup | null {
    // fallback if helper returns null (should not happen)
    const g = getMechanismGroups().find(x => (x.mechanisms as readonly string[]).includes(m));
    return g ? g.name : null;
  }
  
  const handleParametersSubmit = (params: Partial<MechanismProfile>) => {
    const updatedParams = {
      ...state.parameters,
      ...params
    };
    
    const result = calculateSizing(updatedParams);
    
    setState(prev => ({
      ...prev,
      parameters: updatedParams,
      result,
      currentStep: 3
    }));
  };
  
  const handleBack = () => {
    setState(prev => ({
      ...prev,
      currentStep: Math.max(1, prev.currentStep - 1)
    }));
  };
  
  const handleReset = () => {
    setState(initialWizardState);
  };

  const handleAddToCompare = (motor: MotorCatalogEntry) => {
    setState(prev => {
      if (prev.comparedMotors.length >= 3) return prev;
      if (prev.comparedMotors.some(m => m.id === motor.id)) return prev;
      return { ...prev, comparedMotors: [...prev.comparedMotors, motor] };
    });
  };

  const handleRemoveFromCompare = (motorId: string) => {
    setState(prev => ({
      ...prev,
      comparedMotors: prev.comparedMotors.filter(m => m.id !== motorId)
    }));
  };

  const handleClearCompare = () => {
    setState(prev => ({ ...prev, comparedMotors: [] }));
  };

  const handleMotorTypeChange = (newType: 'servo' | 'stepper' | 'induction') => {
    setState(prev => {
      if (!prev.result) return prev;
      const candidates = findCandidateMotors(prev.result, newType, 10);
      const updatedResult = {
        ...prev.result,
        recommendedType: newType,
        candidateMotors: candidates.map(c => c.motor)
      };
      return { ...prev, result: updatedResult, comparedMotors: [] };
    });
  };
  
  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Image src="/logo.png" alt="MotorMatch" width={32} height={32} className="w-8 h-8 rounded-xl object-contain flex-shrink-0 bg-white shadow-sm border border-surface-200" />
            <span className="font-bold text-surface-900 tracking-tight">MotorMatch</span>
            <span className="hidden sm:inline text-xs text-surface-400 border-l border-surface-200 pl-2.5 ml-1 truncate">Motor Selection & Sizing</span>
          </div>
          {/* Compact Stepper in top-bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center gap-1.5 sm:gap-2">
                <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
                  state.currentStep === step.number
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : state.currentStep > step.number
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-surface-50 text-surface-400 border-surface-200'
                }`}>
                  {state.currentStep > step.number ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <step.icon className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.number}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block h-px w-6 ${state.currentStep > step.number ? 'bg-primary-300' : 'bg-surface-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Main Content */}
      <main className="bg-white rounded-2xl shadow-soft border border-surface-200/70 p-5 md:p-6">
        {state.currentStep === 1 && (
          <StepMechanism
            groups={mechanismGroups}
            selectedGroup={state.mechanismGroup}
            selectedMechanism={state.mechanismType}
            onGroupSelect={handleGroupSelect}
            onMechanismSelect={handleMechanismSelect}
          />
        )}
        
        {state.currentStep === 2 && state.mechanismType && (
          <StepParameters
            mechanismType={state.mechanismType}
            mechanismGroup={state.mechanismGroup}
            parameters={getMechanismParameters(state.mechanismType)}
            onSubmit={handleParametersSubmit}
            onBack={handleBack}
          />
        )}
        
        {state.currentStep === 3 && state.result && (
          <StepResult
            result={state.result}
            mechanismType={state.mechanismType!}
            cycleTime={state.parameters.cycleTime}
            accelerationTime={state.parameters.accelerationTime || 0.2}
            decelerationTime={state.parameters.decelerationTime || 0.2}
            efficiency={state.parameters.efficiency || 0.9}
            comparedMotors={state.comparedMotors}
            onAddToCompare={handleAddToCompare}
            onRemoveFromCompare={handleRemoveFromCompare}
            onClearCompare={handleClearCompare}
            onMotorTypeChange={handleMotorTypeChange}
            onBack={handleBack}
            onReset={handleReset}
          />
        )}
      </main>
      </div>
    </div>
  );
}
