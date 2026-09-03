'use client';

interface ConveyorDiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function ConveyorDiagram({ 
  highlightedParam, 
  onParamHover 
}: ConveyorDiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 310" className="w-full h-auto">
      <rect x="0" y="0" width="500" height="310" fill="#F8FAFC" rx="12"/>
      
      {/* Frame */}
      <rect x="40" y="205" width="420" height="10" fill="#CBD5E1" rx="2"/>
      
      {/* Driver Roller D1 M1 */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('D1')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <circle cx="105" cy="160" r="36" fill={isHl('D1') ? '#3B82F6' : '#CBD5E1'} stroke={strokeHl('D1')} strokeWidth={isHl('D1') ? 2.5 : 1.2}/>
        <circle cx="105" cy="160" r="16" fill="#475569"/>
        <circle cx="105" cy="160" r="4" fill="white"/>
        <text x="105" y="164" textAnchor="middle" className="fill-white text-[10px] font-bold">D1</text>
        {/* diameter dimension */}
        <line x1="69" y1="200" x2="141" y2="200" stroke={strokeHl('D1')} strokeWidth="1"/>
        <line x1="69" y1="197" x2="69" y2="203" stroke={strokeHl('D1')} strokeWidth="1"/>
        <line x1="141" y1="197" x2="141" y2="203" stroke={strokeHl('D1')} strokeWidth="1"/>
        <text x="105" y="212" textAnchor="middle" className={`text-[10px] ${lbl('D1')}`}>D1</text>
        {/* M1 label */}
        <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('M1')} onMouseLeave={() => onParamHover?.(null)}>
          <text x="105" y="245" textAnchor="middle" className={`text-[10px] ${isHl('M1') ? 'fill-primary-600 font-bold' : 'fill-surface-500'}`}>M1</text>
        </g>
      </g>

      {/* Motor */}
      <g>
        <rect x="42" y="115" width="48" height="44" fill="#334155" rx="3"/>
        <text x="66" y="142" textAnchor="middle" className="fill-white text-[8px] font-medium">MOTOR</text>
        <line x1="90" y1="137" x2="73" y2="137" stroke="#64748B" strokeWidth="3" strokeLinecap="round"/>
        <line x1="73" y1="137" x2="73" y2="160" stroke="#64748B" strokeWidth="3"/>
      </g>

      {/* Belt Top M4 + Bottom */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('M4')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <rect x="105" y="120" width="295" height="10" fill={isHl('M4') ? '#3B82F6' : '#94A3B8'} rx="3"/>
        <rect x="105" y="120" width="295" height="10" fill="none" stroke={strokeHl('M4')} strokeWidth={isHl('M4') ? 1.5 : 0} rx="3"/>
        <text x="252" y="102" textAnchor="middle" className={`text-[10px] ${lbl('M4')}`}>Belt M4</text>
      </g>
      <rect x="105" y="196" width="295" height="10" fill={isHl('M4') ? '#60A5FA' : '#94A3B8'} rx="3" opacity={isHl('M4') ? 1 : 0.9}/>

      {/* Idle Roller D2 M2 */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('D2')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <circle cx="400" cy="160" r="34" fill={isHl('D2') ? '#3B82F6' : '#CBD5E1'} stroke={strokeHl('D2')} strokeWidth={isHl('D2') ? 2.5 : 1.2}/>
        <circle cx="400" cy="160" r="14" fill="#475569"/>
        <circle cx="400" cy="160" r="4" fill="white"/>
        <text x="400" y="164" textAnchor="middle" className="fill-white text-[10px] font-bold">D2</text>
        <line x1="366" y1="200" x2="434" y2="200" stroke={strokeHl('D2')} strokeWidth="1"/>
        <line x1="366" y1="197" x2="366" y2="203" stroke={strokeHl('D2')} strokeWidth="1"/>
        <line x1="434" y1="197" x2="434" y2="203" stroke={strokeHl('D2')} strokeWidth="1"/>
        <text x="400" y="212" textAnchor="middle" className={`text-[10px] ${lbl('D2')}`}>D2</text>
        <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('M2')} onMouseLeave={() => onParamHover?.(null)}>
          <text x="400" y="245" textAnchor="middle" className={`text-[10px] ${isHl('M2') ? 'fill-primary-600 font-bold' : 'fill-surface-500'}`}>M2</text>
        </g>
      </g>

      {/* Load M3 */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('M3')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <rect x="170" y="70" width="160" height="36" fill={isHl('M3') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('M3')} strokeWidth={isHl('M3') ? 2 : 1} rx="6"/>
        <rect x="175" y="75" width="150" height="26" fill="white" opacity="0.92" rx="4"/>
        <text x="250" y="92" textAnchor="middle" className={`text-xs font-bold ${isHl('M3') ? 'fill-primary-600' : 'fill-surface-700'}`}>LOAD M3</text>
        {/* contact shading */}
        <rect x="185" y="104" width="130" height="4" fill={isHl('M3') ? '#2563EB' : '#64748B'} opacity="0.5" rx="1"/>
      </g>

      {/* μ friction between load and belt */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="250" y="122" textAnchor="middle" className={`text-xs ${lbl('μ')}`}>μ ≈0.4</text>
        <line x1="220" y1="124" x2="280" y2="124" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="250" cy="124" r="18" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* θ tilt */}
      <g 
        className="cursor-pointer"
        onMouseEnter={() => onParamHover?.('θ')}
        onMouseLeave={() => onParamHover?.(null)}
      >
        <line x1="40" y1="218" x2="110" y2="218" stroke={strokeHl('θ')} strokeWidth="1"/>
        <line x1="40" y1="218" x2="95" y2="192" stroke={strokeHl('θ')} strokeWidth="1"/>
        <path d="M 58 218 Q 68 210 78 200" fill="none" stroke={strokeHl('θ')} strokeWidth="1.5"/>
        <text x="48" y="208" className={`text-xs ${lbl('θ')}`}>θ</text>
      </g>

      {/* Direction */}
      <g>
        <line x1="252" y1="144" x2="340" y2="144" stroke="#334155" strokeWidth="1.5"/>
        <polygon points="340,140 352,144 340,148" fill="#334155"/>
        <text x="296" y="138" textAnchor="middle" className="fill-surface-600 text-[10px]">Gerak</text>
      </g>

      {/* Legend */}
      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Conveyor Belt — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">D1/D2=⌀ roller, M1/M2=massa roller, M3=beban, M4=belt, μ=0.4, θ=kemiringan</text>
      </g>

      <g transform="translate(70, 262)"><text className={`text-[10px] ${lbl('M1')}`}>M1 driver</text></g>
      <g transform="translate(340, 262)"><text className={`text-[10px] ${lbl('M2')}`}>M2 idle</text></g>
    </svg>
  );
}
