'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function ElevatorHoistDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 310" className="w-full h-auto">
      <rect width="500" height="310" fill="#F8FAFC" rx="12"/>
      
      {/* Top beam */}
      <rect x="40" y="38" width="400" height="10" fill="#CBD5E1" rx="2"/>
      {/* Side guides */}
      <rect x="40" y="48" width="8" height="180" fill="#CBD5E1" rx="2"/>
      <rect x="432" y="48" width="8" height="180" fill="#CBD5E1" rx="2"/>
      {/* guide rails dashed */}
      <line x1="80" y1="48" x2="80" y2="220" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3"/>
      <line x1="350" y1="48" x2="350" y2="220" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4,3"/>

      {/* Drum D + Mdrum */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('D')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="240" cy="68" r="28" fill={isHl('D') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('D')} strokeWidth={isHl('D') ? 2.5 : 1.5}/>
        <circle cx="240" cy="68" r="8" fill="#334155"/>
        <text x="240" y="72" textAnchor="middle" className="fill-white text-[10px] font-bold">D</text>
        {/* diameter */}
        <line x1="212" y1="102" x2="268" y2="102" stroke={strokeHl('D')} strokeWidth="1"/>
        <line x1="212" y1="99" x2="212" y2="105" stroke={strokeHl('D')} strokeWidth="1"/>
        <line x1="268" y1="99" x2="268" y2="105" stroke={strokeHl('D')} strokeWidth="1"/>
        <text x="240" y="114" textAnchor="middle" className={`text-[10px] ${lbl('D')}`}>D (mm)</text>
        {/* Mdrum */}
        <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Mdrum')} onMouseLeave={() => onParamHover?.(null)}>
          <text x="240" y="48" textAnchor="middle" className={`text-[10px] ${isHl('Mdrum') ? 'fill-primary-600 font-bold' : 'fill-surface-500'}`}>Mdrum</text>
        </g>
      </g>

      {/* Cable to load M2 */}
      <line x1="268" y1="68" x2="350" y2="68" stroke="#475569" strokeWidth="2"/>
      <line x1="350" y1="68" x2="350" y2="110" stroke="#475569" strokeWidth="2"/>
      {/* sheave */}
      <circle cx="350" cy="68" r="4" fill="#475569"/>
      
      {/* Load M2 */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('M2')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="320" y="110" width="60" height="55" fill={isHl('M2') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('M2')} strokeWidth={isHl('M2') ? 2 : 1} rx="6"/>
        <rect x="325" y="115" width="50" height="24" fill="white" opacity="0.92" rx="3"/>
        <text x="350" y="131" textAnchor="middle" className={`text-xs font-bold ${isHl('M2') ? 'fill-primary-600' : 'fill-surface-700'}`}>M2</text>
        <text x="350" y="155" textAnchor="middle" className="fill-white text-[10px]">beban (kg)</text>
      </g>

      {/* Cable to counterweight M1 */}
      <line x1="212" y1="68" x2="80" y2="68" stroke="#475569" strokeWidth="2"/>
      <line x1="80" y1="68" x2="80" y2="110" stroke="#475569" strokeWidth="2"/>
      <circle cx="80" cy="68" r="4" fill="#475569"/>

      {/* Counterweight M1 */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('M1')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="50" y="110" width="60" height="55" fill={isHl('M1') ? '#DBEAFE' : 'white'} stroke={isHl('M1') ? '#2563EB' : '#94A3B8'} strokeWidth={isHl('M1') ? 2 : 1.2} rx="6"/>
        <rect x="55" y="115" width="50" height="24" fill={isHl('M1') ? '#3B82F6' : '#E2E8F0'} rx="3"/>
        <text x="80" y="131" textAnchor="middle" className={`text-xs font-bold ${isHl('M1') ? 'fill-white' : 'fill-surface-700'}`}>M1</text>
        <text x="80" y="155" textAnchor="middle" className={`text-[10px] ${isHl('M1') ? 'fill-primary-600' : 'fill-surface-500'}`}>counterwt (kg)</text>
      </g>

      {/* Motor */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="285" y="48" width="52" height="28" fill="#334155" rx="4"/>
        <text x="311" y="66" textAnchor="middle" className="fill-white text-[9px]">MOTOR</text>
      </g>
      <line x1="285" y1="62" x2="268" y2="62" stroke="#64748B" strokeWidth="3" strokeLinecap="round"/>

      {/* External force F */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('F')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="350" y1="185" x2="350" y2="215" stroke={strokeHl('F')} strokeWidth="2"/>
        <polygon points="347,215 350,227 353,215" fill={strokeHl('F')}/>
        <text x="368" y="202" className={`text-xs ${lbl('F')}`}>F (N)</text>
        <line x1="320" y1="175" x2="380" y2="175" stroke={strokeHl('F')} strokeWidth="0.7" strokeDasharray="2,2"/>
      </g>

      {/* μ friction guide */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="405" y="150" className={`text-xs ${lbl('μ')}`}>μ</text>
        <line x1="385" y1="120" x2="385" y2="170" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="390" cy="145" r="12" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* Holding annotation */}
      <rect x="120" y="235" width="240" height="22" rx="11" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1"/>
      <text x="240" y="250" textAnchor="middle" className="fill-amber-700 text-[10px]">Holding: Thold = (M2-M1)·g·D/2 /η — brake wajib</text>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Elevator / Hoist — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">D=⌀ drum, M1=counterweight, M2=beban, F=eksternal, Mdrum=massa drum, μ=friksi</text>
      </g>
    </svg>
  );
}
