'use client';

interface GenericRotaryDiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function GenericRotaryDiagram({ 
  highlightedParam, 
  onParamHover 
}: GenericRotaryDiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect x="0" y="0" width="500" height="300" fill="#F8FAFC" rx="12"/>
      
      {/* Motor */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('motor')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <rect x="55" y="115" width="90" height="70" fill="#334155" rx="6"/>
        <rect x="60" y="120" width="80" height="60" fill="#475569" rx="3"/>
        <text x="100" y="156" textAnchor="middle" className="fill-white text-xs font-medium">MOTOR</text>
      </g>

      {/* Shaft */}
      <rect x="145" y="143" width="45" height="14" fill="#64748B" rx="2"/>

      {/* Coupling with gear ratio G indication */}
      <g>
        <rect x="190" y="135" width="30" height="30" fill="#94A3B8" rx="3"/>
        <line x1="195" y1="140" x2="215" y2="160" stroke="#475569" strokeWidth="1.5"/>
        <line x1="215" y1="140" x2="195" y2="160" stroke="#475569" strokeWidth="1.5"/>
        <text x="205" y="180" textAnchor="middle" className="fill-surface-400 text-[8px]">G η</text>
      </g>

      {/* Load rotary Tc */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('Tc')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <circle cx="330" cy="150" r="52" fill={isHl('Tc') ? '#3B82F6' : '#CBD5E1'} stroke={strokeHl('Tc')} strokeWidth={isHl('Tc') ? 2.5 : 1.2}/>
        <circle cx="330" cy="150" r="6" fill="#334155"/>
        <text x="330" y="147" textAnchor="middle" className="fill-white text-xs font-bold">LOAD</text>
        <text x="330" y="160" textAnchor="middle" className="fill-white text-[10px]">(rotary)</text>
      </g>

      {/* Tc torque arrow */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('Tc')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <path 
          d="M 330 82 Q 380 82 380 118" 
          fill="none" 
          stroke={strokeHl('Tc')} 
          strokeWidth={isHl('Tc') ? 2.5 : 1.5}
          strokeLinecap="round"
        />
        <polygon 
          points="377,114 387,124 372,124" 
          fill={strokeHl('Tc')}
        />
        <text x="395" y="98" className={`text-xs ${lbl('Tc')}`}>Tc (N·m)</text>
      </g>

      {/* Jl inertia */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('Jl')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <circle cx="330" cy="150" r={isHl('Jl') ? 62 : 0} fill="transparent" stroke={isHl('Jl') ? '#2563EB' : 'transparent'} strokeWidth="1.5" strokeDasharray="4,3"/>
        <text x="330" y="228" textAnchor="middle" className={`text-xs ${lbl('Jl')}`}>
          Jl = Load Inertia (kg·m²)
        </text>
      </g>

      {/* Rotation arrow bottom */}
      <g>
        <path 
          d="M 330 210 Q 285 210 285 180" 
          fill="none" 
          stroke="#64748B" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polygon points="286,185 280,172 292,176" fill="#64748B"/>
        <text x="300" y="220" textAnchor="middle" className="fill-surface-500 text-[10px]">ω</text>
      </g>

      {/* Formula hint */}
      <rect x="60" y="235" width="380" height="22" rx="11" fill="white" stroke="#E2E8F0" strokeWidth="1"/>
      <text x="250" y="250" textAnchor="middle" className="fill-surface-500 text-[10px]">TL = Tc·G/η ,  JL = Jl·G² — langsung dari input torsi & inersia</text>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Generic Rotary — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">Fallback rotary: input Tc &amp; Jl langsung, direfleksikan via G/η</text>
      </g>
    </svg>
  );
}
