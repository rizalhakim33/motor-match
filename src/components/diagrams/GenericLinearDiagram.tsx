'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function GenericLinearDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect width="500" height="300" fill="#F8FAFC" rx="12"/>
      
      {/* Motor */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="50" y="130" width="70" height="60" fill="#334155" rx="6"/>
        <rect x="55" y="135" width="60" height="50" fill="#475569" rx="3"/>
        <text x="85" y="168" textAnchor="middle" className="fill-white text-xs font-medium">MOTOR</text>
      </g>
      <line x1="120" y1="160" x2="150" y2="160" stroke="#64748B" strokeWidth="4" strokeLinecap="round"/>

      {/* Gearbox / transmission with effective radius r */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('r')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="175" cy="160" r="26" fill={isHl('r') ? '#3B82F6' : '#CBD5E1'} stroke={strokeHl('r')} strokeWidth={isHl('r') ? 2.5 : 1.2}/>
        <circle cx="175" cy="160" r="8" fill="#334155"/>
        <text x="175" y="164" textAnchor="middle" className="fill-white text-[8px] font-bold">r</text>
        {/* r dimension */}
        <line x1="175" y1="134" x2="201" y2="134" stroke={strokeHl('r')} strokeWidth="1"/>
        <line x1="175" y1="131" x2="175" y2="137" stroke={strokeHl('r')} strokeWidth="1"/>
        <line x1="201" y1="131" x2="201" y2="137" stroke={strokeHl('r')} strokeWidth="1"/>
        <line x1="175" y1="160" x2="201" y2="160" stroke={strokeHl('r')} strokeWidth="1" strokeDasharray="2,2"/>
        <text x="188" y="128" textAnchor="middle" className={`text-[10px] ${lbl('r')}`}>r</text>
        <text x="175" y="200" textAnchor="middle" className={`text-[10px] ${lbl('r')}`}>r efektif (m)</text>
      </g>

      {/* Belt/lead to load */}
      <line x1="201" y1="160" x2="240" y2="160" stroke="#64748B" strokeWidth="2" strokeDasharray="5,3"/>

      {/* Load */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Fc')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="240" y="120" width="90" height="80" fill={isHl('Fc') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('Fc')} strokeWidth={isHl('Fc') ? 2 : 1} rx="6"/>
        <rect x="245" y="125" width="80" height="30" fill="white" opacity="0.92" rx="4"/>
        <text x="285" y="144" textAnchor="middle" className={`text-xs font-bold ${isHl('Fc') ? 'fill-primary-600' : 'fill-surface-700'}`}>LOAD</text>
        <text x="285" y="172" textAnchor="middle" className="fill-white text-xs">Fc (N)</text>
        <text x="285" y="186" textAnchor="middle" className="fill-white text-[10px]">gaya</text>
      </g>

      {/* Base rail */}
      <rect x="200" y="210" width="200" height="6" fill="#CBD5E1" rx="2"/>
      <rect x="240" y="200" width="90" height="8" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="2"/>

      {/* V */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('V')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="330" y1="150" x2="400" y2="150" stroke={strokeHl('V')} strokeWidth="2"/>
        <polygon points="400,146 415,150 400,154" fill={strokeHl('V')}/>
        <text x="372" y="142" textAnchor="middle" className={`text-xs ${lbl('V')}`}>V (m/s)</text>
      </g>

      {/* Wl */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Wl')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="260" y="218" width="50" height="14" fill={isHl('Wl') ? '#3B82F6' : 'transparent'} rx="3"/>
        <text x="285" y="228" textAnchor="middle" className={`text-xs ${lbl('Wl')}`}>Wl (kg)</text>
      </g>

      {/* μ */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="285" y="212" textAnchor="middle" className={`text-xs ${lbl('μ')}`}>μ</text>
        <circle cx="285" cy="212" r="12" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* θ */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('θ')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="200" y1="210" x2="240" y2="210" stroke={strokeHl('θ')} strokeWidth="1"/>
        <line x1="200" y1="210" x2="230" y2="196" stroke={strokeHl('θ')} strokeWidth="1"/>
        <path d="M 214 210 A 14 14 0 0 0 224 200" fill="none" stroke={strokeHl('θ')} strokeWidth="1.2"/>
        <text x="200" y="194" className={`text-xs ${lbl('θ')}`}>θ</text>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Generic Linear — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">TL=Fc·r/η, JL=Wl·r² — r wajib (radius efektif transmisi), V=kecepatan</text>
      </g>
    </svg>
  );
}
