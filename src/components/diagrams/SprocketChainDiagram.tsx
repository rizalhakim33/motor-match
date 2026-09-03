'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function SprocketChainDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#64748B';
  const fillHl = (p: string) => isHl(p) ? '#3B82F6' : '#CBD5E1';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect width="500" height="300" fill="#F8FAFC" rx="12"/>
      
      {/* Motor */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="70" y="215" width="65" height="38" fill="#334155" rx="4"/>
        <text x="102" y="238" textAnchor="middle" className="fill-white text-[10px]">MOTOR</text>
      </g>
      <line x1="102" y1="215" x2="102" y2="180" stroke="#64748B" strokeWidth="3" strokeLinecap="round"/>
      <line x1="102" y1="180" x2="120" y2="180" stroke="#64748B" strokeWidth="3"/>

      {/* Motor sprocket D */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('D')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="125" cy="145" r="30" fill={fillHl('D')} stroke={strokeHl('D')} strokeWidth={isHl('D') ? 2.5 : 1.5}/>
        {[0,60,120,180,240,300].map(a => (
          <circle key={a} cx={125+25*Math.cos(a*Math.PI/180)} cy={145+25*Math.sin(a*Math.PI/180)} r="5" fill="#475569" stroke="white" strokeWidth="0.5"/>
        ))}
        <circle cx="125" cy="145" r="8" fill="#334155"/>
        {/* pitch circle dashed */}
        <circle cx="125" cy="145" r="25" fill="none" stroke={isHl('D') ? '#2563EB' : '#475569'} strokeWidth="1" strokeDasharray="3,3"/>
        <text x="125" y="150" textAnchor="middle" className="fill-white text-[10px] font-bold">D</text>
        {/* D dimension */}
        <line x1="98" y1="185" x2="152" y2="185" stroke={strokeHl('D')} strokeWidth="1"/>
        <line x1="98" y1="182" x2="98" y2="188" stroke={strokeHl('D')} strokeWidth="1"/>
        <line x1="152" y1="182" x2="152" y2="188" stroke={strokeHl('D')} strokeWidth="1"/>
        <text x="125" y="198" textAnchor="middle" className={`text-[10px] ${lbl('D')}`}>D (mm)</text>
      </g>

      {/* Load sprocket + Load M */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('M')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="380" cy="145" r="42" fill={isHl('M') ? '#3B82F6' : '#E2E8F0'} stroke={isHl('M') ? '#2563EB' : '#94A3B8'} strokeWidth={isHl('M') ? 2 : 1.2}/>
        {[0,45,90,135,180,225,270,315].map(a => (
          <circle key={a} cx={380+36*Math.cos(a*Math.PI/180)} cy={145+36*Math.sin(a*Math.PI/180)} r="5" fill="#94A3B8" stroke="white" strokeWidth="0.5"/>
        ))}
        <circle cx="380" cy="145" r="10" fill="#64748B"/>
        <text x="380" y="130" textAnchor="middle" className={`text-xs font-bold ${isHl('M') ? 'fill-white' : 'fill-surface-700'}`}>LOAD</text>
        <text x="380" y="142" textAnchor="middle" className={`text-[10px] ${isHl('M') ? 'fill-white' : 'fill-surface-600'}`}>M (kg)</text>
      </g>

      {/* Chain - precise roller chain */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('F')} onMouseLeave={() => onParamHover?.(null)}>
        {/* top strand */}
        <g stroke={strokeHl('F')} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M 125 120 L 380 103"/>
        </g>
        {/* bottom strand */}
        <g stroke={strokeHl('F')} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M 125 170 L 380 187"/>
        </g>
        {/* chain links indication */}
        {[0,1,2,3,4,5,6].map(i => {
          const x = 150 + i*32;
          const yTop = 120 - ((380-125)*(0)/100) + ( (103-120)*(x-125)/(380-125) );
          return <rect key={i} x={x} y={yTop-3} width="14" height="6" rx="1.5" fill={isHl('F') ? '#2563EB' : '#475569'} opacity="0.9"/>
        })}
        {[0,1,2,3,4,5,6].map(i => {
          const x = 150 + i*32;
          const yBot = 170 + (187-170)*(x-125)/(380-125);
          return <rect key={i} x={x} y={yBot-3} width="14" height="6" rx="1.5" fill={isHl('F') ? '#2563EB' : '#475569'} opacity="0.9"/>
        })}
      </g>

      {/* Pull force F */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('F')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="400" y1="95" x2="450" y2="95" stroke={strokeHl('F')} strokeWidth="2"/>
        <polygon points="450,90 465,95 450,100" fill={strokeHl('F')}/>
        <text x="426" y="86" textAnchor="middle" className={`text-xs ${lbl('F')}`}>F (N)</text>
      </g>

      {/* μ chain friction */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="252" y="78" textAnchor="middle" className={`text-xs ${lbl('μ')}`}>μ≈0.4</text>
        <line x1="230" y1="82" x2="274" y2="82" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="252" cy="82" r="14" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* θ tilt */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('θ')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="50" y1="260" x2="110" y2="260" stroke={strokeHl('θ')} strokeWidth="1"/>
        <line x1="50" y1="260" x2="100" y2="245" stroke={strokeHl('θ')} strokeWidth="1"/>
        <path d="M 68 260 A 18 18 0 0 0 80 250" fill="none" stroke={strokeHl('θ')} strokeWidth="1.5"/>
        <text x="46" y="244" className={`text-xs ${lbl('θ')}`}>θ</text>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Sprocket &amp; Chain — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">D=sprocket pitch ⌀, F=chain pull, M=beban, μ=0.4 chain traverse</text>
      </g>
    </svg>
  );
}
