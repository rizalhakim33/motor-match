'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function RollFeedDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect width="500" height="300" fill="#F8FAFC" rx="12"/>
      
      {/* Frame */}
      <rect x="40" y="225" width="420" height="8" fill="#CBD5E1" rx="2"/>
      <rect x="110" y="80" width="6" height="145" fill="#CBD5E1" rx="2"/>
      <rect x="384" y="80" width="6" height="145" fill="#CBD5E1" rx="2"/>

      {/* Roll A driver Dra + MrollA */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Dra')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="150" cy="145" r="42" fill={isHl('Dra') ? '#3B82F6' : '#CBD5E1'} stroke={strokeHl('Dra')} strokeWidth={isHl('Dra') ? 2.5 : 1.2}/>
        <circle cx="150" cy="145" r="10" fill="#334155"/>
        <circle cx="150" cy="145" r="4" fill="white"/>
        <text x="150" y="148" textAnchor="middle" className="fill-white text-[10px] font-bold">Dra</text>
        {/* diameter line */}
        <line x1="108" y1="188" x2="192" y2="188" stroke={strokeHl('Dra')} strokeWidth="1"/>
        <line x1="108" y1="185" x2="108" y2="191" stroke={strokeHl('Dra')} strokeWidth="1"/>
        <line x1="192" y1="185" x2="192" y2="191" stroke={strokeHl('Dra')} strokeWidth="1"/>
        <text x="150" y="202" textAnchor="middle" className={`text-[10px] ${lbl('Dra')}`}>Dra (mm)</text>
        {/* MrollA */}
        <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('MrollA')} onMouseLeave={() => onParamHover?.(null)}>
          <text x="150" y="218" textAnchor="middle" className={`text-[10px] ${isHl('MrollA') ? 'fill-primary-600 font-bold' : 'fill-surface-500'}`}>MrollA</text>
        </g>
      </g>

      {/* Roll B idle Drb + MrollB */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Drb')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="350" cy="145" r="42" fill={isHl('Drb') ? '#3B82F6' : '#E2E8F0'} stroke={strokeHl('Drb')} strokeWidth={isHl('Drb') ? 2.5 : 1.2}/>
        <circle cx="350" cy="145" r="10" fill="#64748B"/>
        <circle cx="350" cy="145" r="4" fill="white"/>
        <text x="350" y="148" textAnchor="middle" className="fill-surface-700 text-[10px] font-bold">Drb</text>
        <line x1="308" y1="188" x2="392" y2="188" stroke={strokeHl('Drb')} strokeWidth="1"/>
        <line x1="308" y1="185" x2="308" y2="191" stroke={strokeHl('Drb')} strokeWidth="1"/>
        <line x1="392" y1="185" x2="392" y2="191" stroke={strokeHl('Drb')} strokeWidth="1"/>
        <text x="350" y="202" textAnchor="middle" className={`text-[10px] ${lbl('Drb')}`}>Drb (mm)</text>
        <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('MrollB')} onMouseLeave={() => onParamHover?.(null)}>
          <text x="350" y="218" textAnchor="middle" className={`text-[10px] ${isHl('MrollB') ? 'fill-primary-600 font-bold' : 'fill-surface-500'}`}>MrollB</text>
        </g>
      </g>

      {/* Material pinched */}
      <rect x="148" y="138" width="204" height="10" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" rx="2"/>
      {/* thickness indicator */}
      <line x1="250" y1="128" x2="250" y2="138" stroke="#D97706" strokeWidth="1"/>
      <text x="250" y="122" textAnchor="middle" className="fill-amber-700 text-[10px]">Material</text>
      {/* nip point highlight */}
      <circle cx="250" cy="143" r="6" fill="none" stroke={isHl('μ') ? '#2563EB' : '#F59E0B'} strokeWidth="1" strokeDasharray="2,2"/>

      {/* Clamping force Fn */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Fn')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="150" y1="90" x2="150" y2="60" stroke={strokeHl('Fn')} strokeWidth="2"/>
        <polygon points="145,60 150,48 155,60" fill={strokeHl('Fn')}/>
        <text x="170" y="56" className={`text-xs ${lbl('Fn')}`}>Fn (N)</text>
        {/* pressure arrow bottom */}
        <line x1="150" y1="200" x2="150" y2="225" stroke={strokeHl('Fn')} strokeWidth="1" opacity="0.6"/>
        <polygon points="145,225 150,233 155,225" fill={strokeHl('Fn')} opacity="0.6"/>
      </g>

      {/* μ between roll and material */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="250" y="168" textAnchor="middle" className={`text-xs ${lbl('μ')}`}>μ</text>
        <line x1="230" y1="170" x2="270" y2="170" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="250" cy="170" r="14" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* Motor to Dra */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="60" y="220" width="70" height="36" fill="#334155" rx="4"/>
        <text x="95" y="242" textAnchor="middle" className="fill-white text-[10px]">MOTOR</text>
      </g>
      <path d="M 95 220 L 95 195 L 120 195 L 120 175" fill="none" stroke="#64748B" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="120" cy="170" r="3" fill="#64748B"/>

      {/* Motion arrow */}
      <g>
        <line x1="370" y1="145" x2="430" y2="145" stroke="#334155" strokeWidth="1.5"/>
        <polygon points="430,141 442,145 430,149" fill="#334155"/>
        <text x="400" y="135" textAnchor="middle" className="fill-surface-600 text-[10px]">Feed</text>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Roll Feed — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">Dra/Drb=⌀ roll, Fn=jepit, μ=friksi roll-material, MrollA/B=massa roll</text>
      </g>
    </svg>
  );
}
