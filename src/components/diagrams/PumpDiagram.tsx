'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function PumpDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect width="500" height="300" fill="#F8FAFC" rx="12"/>
      
      {/* Pipe inlet */}
      <rect x="40" y="142" width="60" height="18" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1" rx="3"/>
      <rect x="30" y="146" width="20" height="10" fill="#60A5FA" rx="2"/>
      <text x="70" y="135" textAnchor="middle" className="fill-surface-500 text-[10px]">INLET</text>
      {/* inlet arrow */}
      <line x1="40" y1="125" x2="85" y2="125" stroke={strokeHl('Q')} strokeWidth="1.5" strokeDasharray="3,2"/>
      <polygon points="85,122 95,125 85,128" fill={strokeHl('Q')}/>
      <text x="62" y="118" className={`text-[10px] ${lbl('Q')}`}>Q</text>

      {/* Pump housing + impeller */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Jp')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="175" cy="150" r="52" fill={isHl('Jp') ? '#DBEAFE' : 'white'} stroke={strokeHl('Jp')} strokeWidth={isHl('Jp') ? 2.5 : 1.5}/>
        <circle cx="175" cy="150" r="46" fill="none" stroke="#E2E8F0" strokeWidth="1"/>
        {/* volute */}
        <path d="M 175 98 A 52 52 0 0 1 227 150" fill="none" stroke={strokeHl('Jp')} strokeWidth="2"/>
        <text x="175" y="156" textAnchor="middle" className={`text-xs font-bold ${isHl('Jp') ? 'fill-primary-600' : 'fill-surface-700'}`}>PUMP</text>
        <text x="175" y="170" textAnchor="middle" className={`text-[10px] ${lbl('Jp')}`}>Jp (kg·m²)</text>
      </g>
      {/* impeller vanes - precise */}
      {[0,60,120,180,240,300].map(a => {
        const rad=a*Math.PI/180;
        return <path key={a} d={`M ${175+10*Math.cos(rad)} ${150+10*Math.sin(rad)} Q ${175+22*Math.cos((a+20)*Math.PI/180)} ${150+22*Math.sin((a+20)*Math.PI/180)} ${175+38*Math.cos((a+25)*Math.PI/180)} ${150+38*Math.sin((a+25)*Math.PI/180)}`} fill="none" stroke={isHl('Jp') ? '#2563EB' : '#475569'} strokeWidth="2.5" strokeLinecap="round"/>
      })}
      <circle cx="175" cy="150" r="10" fill={isHl('Jp') ? '#3B82F6' : '#475569'}/>

      {/* Outlet pipe up */}
      <rect x="205" y="40" width="18" height="58" fill="#BFDBFE" stroke="#60A5FA" strokeWidth="1" rx="3"/>
      <rect x="201" y="30" width="26" height="14" fill="#60A5FA" rx="2"/>
      <text x="245" y="38" className="fill-surface-500 text-[10px]">OUTLET</text>
      {/* outlet arrow */}
      <line x1="214" y1="30" x2="214" y2="12" stroke={strokeHl('Q')} strokeWidth="1.5" strokeDasharray="3,2"/>
      <polygon points="211,12 214,2 217,12" fill={strokeHl('Q')}/>

      {/* Q label */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Q')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="300" y="72" className={`text-xs ${lbl('Q')}`}>Q (m³/s)</text>
        <circle cx="305" cy="72" r={isHl('Q') ? 18 : 0} fill="transparent" stroke={isHl('Q') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* Motor */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="285" y="135" width="70" height="36" fill="#334155" rx="4"/>
        <text x="320" y="157" textAnchor="middle" className="fill-white text-[10px]">MOTOR</text>
      </g>
      <line x1="227" y1="150" x2="285" y2="150" stroke="#64748B" strokeWidth="4" strokeLinecap="round"/>
      {/* coupling */}
      <rect x="250" y="142" width="16" height="16" fill="#94A3B8" rx="2"/>

      {/* deltaP */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('deltaP')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="240" y1="95" x2="285" y2="55" stroke={strokeHl('deltaP')} strokeWidth={isHl('deltaP') ? 2 : 1} strokeDasharray="2,2"/>
        <polygon points="285,50 290,62 280,60" fill={strokeHl('deltaP')}/>
        <text x="270" y="48" textAnchor="middle" className={`text-xs ${lbl('deltaP')}`}>ΔP (Pa)</text>
        <line x1="100" y1="165" x2="130" y2="165" stroke={strokeHl('deltaP')} strokeWidth="1" opacity="0.5"/>
        <text x="115" y="180" textAnchor="middle" className={`text-[8px] ${lbl('deltaP')}`}>P₁</text>
        <text x="230" y="24" textAnchor="middle" className={`text-[8px] ${lbl('deltaP')}`}>P₂</text>
      </g>

      {/* displacement */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('displacement')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="175" y="222" textAnchor="middle" className={`text-[10px] ${lbl('displacement')}`}>Vdisp (m³/rev)</text>
        <line x1="175" y1="202" x2="175" y2="215" stroke={strokeHl('displacement')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="175" cy="215" r={isHl('displacement') ? 22 : 0} fill="transparent" stroke={isHl('displacement') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* pumpType */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('pumpType')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="300" y="185" width="90" height="26" rx="13" fill={isHl('pumpType') ? '#DBEAFE' : 'white'} stroke={strokeHl('pumpType')} strokeWidth="1"/>
        <text x="345" y="202" textAnchor="middle" className={`text-[10px] ${lbl('pumpType')}`}>centrifugal / disp.</text>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Pump — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">Jp=inersia, Q=debit, ΔP=pressure rise, Vdisp=displacement — sentrifugal TL∝ω², displacement TL=ΔP·Vdisp/2π</text>
      </g>
    </svg>
  );
}
