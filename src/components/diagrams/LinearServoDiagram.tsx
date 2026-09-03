'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function LinearServoDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect width="500" height="300" fill="#F8FAFC" rx="12"/>
      {/* Base + magnet track */}
      <rect x="40" y="210" width="420" height="8" fill="#CBD5E1" rx="2"/>
      <rect x="60" y="195" width="380" height="12" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="2"/>
      {/* magnet poles */}
      {[70,95,120,145,170,195,220,245,270,295,320,345,370,395,420].map(x => (
        <rect key={x} x={x} y="197" width="10" height="8" fill={x%50===20 ? '#EF4444' : '#3B82F6'} rx="1"/>
      ))}

      {/* Stator / Linear motor */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="50" y="135" width="110" height="50" fill="#334155" rx="4"/>
        <rect x="55" y="140" width="100" height="40" fill="#475569" rx="2"/>
        <text x="105" y="158" textAnchor="middle" className="fill-white text-[10px] font-medium">STATOR</text>
        <text x="105" y="170" textAnchor="middle" className="fill-white text-[8px]">LINEAR MOTOR</text>
      </g>

      {/* Traveler / Forcer Wt */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Wt')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="175" y="115" width="80" height="75" fill={isHl('Wt') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('Wt')} strokeWidth={isHl('Wt') ? 2 : 1} rx="6"/>
        <rect x="180" y="120" width="70" height="30" fill="white" opacity="0.92" rx="4"/>
        <text x="215" y="138" textAnchor="middle" className={`text-xs font-bold ${isHl('Wt') ? 'fill-primary-600' : 'fill-surface-700'}`}>FORCER</text>
        <text x="215" y="168" textAnchor="middle" className="fill-white text-[10px] font-medium">Wt (kg)</text>
        <text x="215" y="180" textAnchor="middle" className="fill-white text-[8px]">traveler</text>
      </g>

      {/* Air gap */}
      <line x1="175" y1="190" x2="255" y2="190" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2"/>
      <text x="215" y="204" textAnchor="middle" className="fill-amber-700 text-[8px]">air gap</text>

      {/* Friction Ff */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Ff')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="255" y1="150" x2="310" y2="150" stroke={strokeHl('Ff')} strokeWidth="2"/>
        <polygon points="310,146 325,150 310,154" fill={strokeHl('Ff')}/>
        <text x="332" y="148" className={`text-xs ${lbl('Ff')}`}>Ff (N)</text>
        <text x="332" y="158" className="fill-surface-400 text-[8px]">friksi</text>
      </g>

      {/* Cutting Fc */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Fc')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="255" y1="170" x2="310" y2="170" stroke={isHl('Fc') ? '#DC2626' : '#94A3B8'} strokeWidth="2"/>
        <polygon points="310,166 325,170 310,174" fill={isHl('Fc') ? '#DC2626' : '#94A3B8'}/>
        <text x="332" y="174" className={`text-xs ${lbl('Fc')}`}>Fc (N)</text>
        <text x="332" y="184" className="fill-surface-400 text-[8px]">cutting</text>
      </g>

      {/* V speed */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('V')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="300" y1="115" x2="380" y2="115" stroke={strokeHl('V')} strokeWidth="2"/>
        <polygon points="380,111 395,115 380,119" fill={strokeHl('V')}/>
        <text x="340" y="106" textAnchor="middle" className={`text-xs ${lbl('V')}`}>V (m/s)</text>
      </g>

      {/* μ */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="215" y="218" textAnchor="middle" className={`text-xs ${lbl('μ')}`}>μ</text>
        <line x1="190" y1="220" x2="240" y2="220" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="215" cy="220" r="12" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Linear Servo (direct-drive) — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">Wt=traveler, Ff=friksi, Fc=cutting, V=kecepatan, μ=friksi guide — tanpa gear, gaya langsung</text>
      </g>
    </svg>
  );
}
