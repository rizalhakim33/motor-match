'use client';

interface FanDiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function FanDiagram({ 
  highlightedParam, 
  onParamHover 
}: FanDiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect x="0" y="0" width="500" height="300" fill="#F8FAFC" rx="12"/>
      
      {/* Duct */}
      <rect x="40" y="110" width="420" height="80" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="8"/>
      <rect x="40" y="118" width="420" height="4" fill="#CBD5E1" opacity="0.6"/>
      <rect x="40" y="178" width="420" height="4" fill="#CBD5E1" opacity="0.6"/>

      {/* Motor */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('motor')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <rect x="55" y="125" width="80" height="50" fill="#334155" rx="6"/>
        <rect x="60" y="130" width="70" height="40" fill="#475569" rx="3"/>
        <text x="95" y="154" textAnchor="middle" className="fill-white text-[10px] font-medium">MOTOR</text>
      </g>

      {/* Shaft */}
      <rect x="135" y="143" width="35" height="14" fill="#64748B" rx="2"/>

      {/* Fan housing / shroud */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('Jf')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <circle cx="250" cy="150" r="58" fill="white" stroke={strokeHl('Jf')} strokeWidth={isHl('Jf') ? 2.5 : 1.5}/>
        <circle cx="250" cy="150" r="54" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1"/>
      </g>

      {/* Fan hub + blades - precise axial fan */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('Jf')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        {/* hub */}
        <circle cx="250" cy="150" r="16" fill={isHl('Jf') ? '#3B82F6' : '#475569'} stroke={isHl('Jf') ? '#2563EB' : '#334155'} strokeWidth="1"/>
        <text x="250" y="154" textAnchor="middle" className="fill-white text-[8px] font-bold">Jf</text>
        {/* 5 blades - more precise shape */}
        {[0,72,144,216,288].map((a,i) => {
          const rad = a*Math.PI/180;
          const tipX = 250 + 48*Math.cos(rad);
          const tipY = 150 + 48*Math.sin(rad);
          const midX = 250 + 30*Math.cos((a+12)*Math.PI/180);
          const midY = 150 + 30*Math.sin((a+12)*Math.PI/180);
          const baseX1 = 250 + 18*Math.cos((a-10)*Math.PI/180);
          const baseY1 = 150 + 18*Math.sin((a-10)*Math.PI/180);
          const baseX2 = 250 + 18*Math.cos((a+10)*Math.PI/180);
          const baseY2 = 150 + 18*Math.sin((a+10)*Math.PI/180);
          return <path key={i} d={`M ${baseX1} ${baseY1} L ${tipX} ${tipY} Q ${midX} ${midY} ${baseX2} ${baseY2} Z`} fill={isHl('Jf') ? '#60A5FA' : '#94A3B8'} stroke={isHl('Jf') ? '#2563EB' : '#64748B'} strokeWidth="1"/>
        })}
      </g>

      {/* Rotation arrow */}
      <g>
        <path d="M 250 78 Q 285 78 285 105" fill="none" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
        <polygon points="282,102 290,115 276,108" fill="#64748B"/>
        <text x="292" y="88" className="fill-surface-500 text-[8px]">ω</text>
      </g>

      {/* Airflow Q */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('Q')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        {/* inlet arrow */}
        <line x1="45" y1="85" x2="95" y2="85" stroke={strokeHl('Q')} strokeWidth="1.5" strokeDasharray="4,2"/>
        <polygon points="95,81 108,85 95,89" fill={strokeHl('Q')}/>
        <text x="60" y="78" className={`text-[10px] ${lbl('Q')}`}>inlet</text>
        {/* outlet arrows */}
        {[0,1,2].map(i => (
          <g key={i}>
            <line x1={340+i*28} y1={120+i*12} x2={390+i*28} y2={120+i*12} stroke={strokeHl('Q')} strokeWidth="1.5" strokeDasharray="4,2"/>
            <polygon points={`${390+i*28},${116+i*12} ${402+i*28},${120+i*12} ${390+i*28},${124+i*12}`} fill={strokeHl('Q')}/>
          </g>
        ))}
        <text x="430" y="98" className={`text-xs ${lbl('Q')}`}>Q (m³/s)</text>
        <text x="250" y="238" textAnchor="middle" className={`text-xs ${lbl('Q')}`}>Q = Flow Rate (m³/s)</text>
        <circle cx="250" cy="235" r={isHl('Q') ? 20 : 0} fill="transparent" stroke={isHl('Q') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* Jf label */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('Jf')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <text x="250" y="262" textAnchor="middle" className={`text-xs ${lbl('Jf')}`}>
          Jf = Fan Inertia (kg·m²)
        </text>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Fan — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">TL ∝ ω² (affinity), JL=Jf — Q dari kurva fan, bukan first-principle</text>
      </g>
    </svg>
  );
}
