'use client';

interface BallScrewDiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function BallScrewDiagram({ 
  highlightedParam, 
  onParamHover 
}: BallScrewDiagramProps) {
  const hl = (p: string) => highlightedParam === p ? 'fill-primary-500 stroke-primary-600 stroke-2' : 'fill-surface-300 stroke-surface-400 stroke-1';
  const lbl = (p: string) => highlightedParam === p ? 'fill-primary-600 font-bold' : 'fill-surface-600';
  const strokeHl = (p: string) => highlightedParam === p ? '#2563EB' : '#94A3B8';
  const isHl = (p: string) => highlightedParam === p;

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect x="0" y="0" width="500" height="300" fill="#F8FAFC" rx="12"/>
      
      {/* Base + guide rail */}
      <rect x="30" y="225" width="440" height="10" fill="#CBD5E1" rx="3"/>
      <rect x="30" y="235" width="440" height="4" fill="#94A3B8" rx="2"/>
      {/* Linear guide */}
      <rect x="175" y="218" width="180" height="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="1"/>
      
      {/* Motor */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('motor')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <rect x="50" y="135" width="70" height="70" fill="#334155" rx="4"/>
        <rect x="55" y="140" width="60" height="60" fill="#475569" rx="2"/>
        <text x="85" y="178" textAnchor="middle" className="fill-white text-xs font-medium">MOTOR</text>
        <rect x="120" y="160" width="30" height="18" fill="#64748B" rx="1"/>
      </g>

      {/* Coupling */}
      <rect x="150" y="158" width="25" height="22" fill="#94A3B8" rx="2"/>
      <line x1="155" y1="162" x2="170" y2="176" stroke="#64748B" strokeWidth="1"/>
      <line x1="170" y1="162" x2="155" y2="176" stroke="#64748B" strokeWidth="1"/>

      {/* Ball screw shaft - D */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('D')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <rect x="175" y="164" width="180" height="14" fill={isHl('D') ? '#3B82F6' : '#CBD5E1'} stroke={strokeHl('D')} strokeWidth={isHl('D') ? 2 : 1} rx="7"/>
        {/* thread */}
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
          <line key={i} x1={185+i*15} y1="164" x2={190+i*15} y2="178" stroke="#475569" strokeWidth="1" opacity="0.7"/>
        ))}
        {/* D diameter dimension - vertical */}
        <line x1="268" y1="148" x2="268" y2="164" stroke={strokeHl('D')} strokeWidth="1" strokeDasharray="3,2"/>
        <line x1="268" y1="178" x2="268" y2="194" stroke={strokeHl('D')} strokeWidth="1" strokeDasharray="3,2"/>
        <line x1="263" y1="148" x2="273" y2="148" stroke={strokeHl('D')} strokeWidth="1"/>
        <line x1="263" y1="194" x2="273" y2="194" stroke={strokeHl('D')} strokeWidth="1"/>
        <text x="282" y="175" className={`text-[10px] ${lbl('D')}`}>D</text>
      </g>

      {/* M_screw annotation - screw mass */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('M_screw')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="265" y="145" textAnchor="middle" className={`text-[10px] ${lbl('M_screw')}`}>M_screw</text>
      </g>

      {/* Nut - P (lead) */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('P')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <rect x="355" y="152" width="40" height="38" fill={isHl('P') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('P')} strokeWidth={isHl('P') ? 2 : 1} rx="3"/>
        <rect x="360" y="157" width="30" height="28" fill="white" opacity="0.9" rx="2"/>
        <text x="375" y="175" textAnchor="middle" className={`text-[10px] font-bold ${isHl('P') ? 'fill-primary-600' : 'fill-surface-700'}`}>NUT</text>
      </g>

      {/* Load - M */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('M')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <rect x="340" y="85" width="70" height="50" fill={isHl('M') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('M')} strokeWidth={isHl('M') ? 2 : 1} rx="4"/>
        <text x="375" y="112" textAnchor="middle" className="fill-white text-xs font-medium">LOAD</text>
        <text x="375" y="125" textAnchor="middle" className="fill-white text-[10px]">M (kg)</text>
        {/* load sits on nut via bracket */}
        <rect x="368" y="135" width="14" height="17" fill={isHl('M') ? '#3B82F6' : '#94A3B8'} opacity="0.8"/>
      </g>

      {/* External force F */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('F')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <line x1="410" y1="108" x2="460" y2="108" stroke={strokeHl('F')} strokeWidth="2" markerEnd={isHl('F') ? 'url(#arrowF-bs)' : undefined}/>
        <polygon points="460,103 475,108 460,113" fill={strokeHl('F')}/>
        <text x="430" y="98" textAnchor="middle" className={`text-xs ${lbl('F')}`}>F (N)</text>
      </g>

      {/* μ - friction between nut and screw / guide */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="310" y="212" textAnchor="middle" className={`text-xs ${lbl('μ')}`}>μ</text>
        <line x1="295" y1="214" x2="325" y2="214" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="310" cy="214" r="10" fill="transparent" stroke={strokeHl('μ')} strokeWidth={isHl('μ') ? 1.5 : 0} opacity="0.5"/>
      </g>

      {/* P lead dimension */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('P')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <line x1="180" y1="198" x2="190" y2="198" stroke={strokeHl('P')} strokeWidth="1" strokeDasharray="4,2"/>
        <line x1="180" y1="193" x2="180" y2="203" stroke={strokeHl('P')} strokeWidth="1"/>
        <line x1="190" y1="193" x2="190" y2="203" stroke={strokeHl('P')} strokeWidth="1"/>
        <text x="195" y="215" textAnchor="middle" className={`text-xs ${lbl('P')}`}>P = Lead (mm)</text>
      </g>

      {/* θ tilt */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('θ')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <line x1="30" y1="225" x2="110" y2="225" stroke={strokeHl('θ')} strokeWidth="1"/>
        <line x1="30" y1="225" x2="105" y2="205" stroke={strokeHl('θ')} strokeWidth="1"/>
        <path d="M 72 225 A 20 20 0 0 0 72 213" fill="none" stroke={strokeHl('θ')} strokeWidth="1.5"/>
        <text x="80" y="222" className={`text-xs ${lbl('θ')}`}>θ</text>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Ball Screw — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">D=diameter, P=lead, M=beban, M_screw=massa screw, μ=friksi, F=gaya luar</text>
      </g>
    </svg>
  );
}
