'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function RackPinionDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';
  const fillHl = (p: string) => isHl(p) ? '#3B82F6' : '#CBD5E1';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect width="500" height="300" fill="#F8FAFC" rx="12"/>
      {/* Base + guide */}
      <rect x="30" y="225" width="440" height="8" fill="#CBD5E1" rx="2"/>
      <rect x="160" y="215" width="280" height="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="2"/>
      {/* linear guide rollers */}
      <circle cx="200" cy="225" r="4" fill="#94A3B8"/><circle cx="400" cy="225" r="4" fill="#94A3B8"/>
      
      {/* Motor */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="50" y="130" width="70" height="70" fill="#334155" rx="4"/>
        <rect x="55" y="135" width="60" height="60" fill="#475569" rx="2"/>
        <text x="85" y="172" textAnchor="middle" className="fill-white text-xs font-medium">MOTOR</text>
      </g>
      {/* Shaft */}
      <line x1="120" y1="165" x2="145" y2="165" stroke="#64748B" strokeWidth="4" strokeLinecap="round"/>
      
      {/* Pinion - D */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('D')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="170" cy="165" r="28" fill={fillHl('D')} stroke={strokeHl('D')} strokeWidth={isHl('D') ? 2.5 : 1.5}/>
        {/* involute-like teeth */}
        {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
          const rad = a*Math.PI/180;
          return <line key={a} x1={170+20*Math.cos(rad)} y1={165+20*Math.sin(rad)} x2={170+31*Math.cos(rad)} y2={165+31*Math.sin(rad)} stroke="#475569" strokeWidth="2" strokeLinecap="round"/>
        })}
        <circle cx="170" cy="165" r="8" fill="#334155"/>
        {/* pitch circle */}
        <circle cx="170" cy="165" r="25" fill="none" stroke={isHl('D') ? '#2563EB' : '#64748B'} strokeWidth="1" strokeDasharray="3,3"/>
        {/* D dimension across pitch circle */}
        <line x1="145" y1="210" x2="195" y2="210" stroke={strokeHl('D')} strokeWidth="1"/>
        <line x1="145" y1="207" x2="145" y2="213" stroke={strokeHl('D')} strokeWidth="1"/>
        <line x1="195" y1="207" x2="195" y2="213" stroke={strokeHl('D')} strokeWidth="1"/>
        <text x="170" y="207" textAnchor="middle" className={`text-[10px] ${lbl('D')}`}>D</text>
      </g>

      {/* Rack - meshing with pinion */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('F')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="195" y="144" width="250" height="26" fill={isHl('F') ? '#3B82F6' : '#E2E8F0'} stroke={strokeHl('F')} strokeWidth={isHl('F') ? 1.5 : 1} rx="2"/>
        {/* rack teeth meshing upward - precise */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <path key={i} d={`M ${204+i*18} 170 L ${208+i*18} 160 L ${212+i*18} 160 L ${216+i*18} 170 Z`} fill="#475569"/>
        ))}
        {/* engagement highlight */}
        <rect x="192" y="148" width="18" height="18" fill="none" stroke={isHl('D') ? '#2563EB' : 'transparent'} strokeWidth="1" rx="1" strokeDasharray="2,2"/>
      </g>

      {/* Load M on rack */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('M')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="280" y="95" width="90" height="45" fill={isHl('M') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('M')} strokeWidth={isHl('M') ? 2 : 1} rx="4"/>
        <text x="325" y="118" textAnchor="middle" className="fill-white text-xs font-medium">LOAD</text>
        <text x="325" y="131" textAnchor="middle" className="fill-white text-[10px]">M (kg)</text>
        {/* bracket to rack */}
        <rect x="315" y="140" width="20" height="6" fill={isHl('M') ? '#3B82F6' : '#94A3B8'}/>
      </g>

      {/* Pull force F */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('F')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="370" y1="118" x2="450" y2="118" stroke={strokeHl('F')} strokeWidth="2"/>
        <polygon points="450,113 465,118 450,123" fill={strokeHl('F')}/>
        <text x="418" y="108" textAnchor="middle" className={`text-xs ${lbl('F')}`}>F (N)</text>
      </g>

      {/* μ friction between rack and guide */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="290" y1="176" x2="360" y2="176" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <text x="325" y="188" textAnchor="middle" className={`text-xs ${lbl('μ')}`}>μ</text>
        <circle cx="325" cy="177" r="12" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* θ tilt */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('θ')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="30" y1="225" x2="100" y2="225" stroke={strokeHl('θ')} strokeWidth="1"/>
        <line x1="30" y1="225" x2="95" y2="205" stroke={strokeHl('θ')} strokeWidth="1"/>
        <path d="M 62 225 A 20 20 0 0 0 62 215" fill="none" stroke={strokeHl('θ')} strokeWidth="1.5"/>
        <text x="68" y="223" className={`text-xs ${lbl('θ')}`}>θ</text>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Rack &amp; Pinion — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">D=pinion pitch ⌀, gigi rack presisi mesh, μ=friksi guide, θ=kemiringan</text>
      </g>
      <text x="170" y="240" textAnchor="middle" className={`text-[10px] ${lbl('D')}`}>D = Diameter Pinion (mm)</text>
    </svg>
  );
}
