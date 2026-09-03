'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function CartDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect width="500" height="300" fill="#F8FAFC" rx="12"/>
      {/* Rail with sleepers */}
      <rect x="30" y="205" width="440" height="6" fill="#64748B" rx="2"/>
      {[50,100,150,200,250,300,350,400,450].map(x => (
        <rect key={x} x={x-8} y="211" width="16" height="8" fill="#94A3B8" rx="1"/>
      ))}
      {/* incline guide */}
      <line x1="30" y1="205" x2="470" y2="205" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4,3"/>

      {/* Cart body */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Wl')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="170" y="125" width="110" height="55" fill={isHl('Wl') ? '#3B82F6' : '#CBD5E1'} stroke={strokeHl('Wl')} strokeWidth={isHl('Wl') ? 2 : 1} rx="6"/>
        <rect x="175" y="130" width="100" height="20" fill="white" opacity="0.85" rx="3"/>
        <text x="225" y="144" textAnchor="middle" className={`text-xs font-bold ${isHl('Wl') ? 'fill-primary-600' : 'fill-surface-700'}`}>CART</text>
        <text x="225" y="170" textAnchor="middle" className={`text-[10px] ${lbl('Wl')}`}>Wl (kg)</text>
      </g>

      {/* Cart weight Wcart — chassis */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Wcart')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="165" y="178" width="120" height="12" fill={isHl('Wcart') ? '#3B82F6' : '#94A3B8'} stroke={strokeHl('Wcart')} strokeWidth={isHl('Wcart') ? 1.5 : 1} rx="2"/>
        <text x="225" y="120" textAnchor="middle" className={`text-xs ${lbl('Wcart')}`}>Wcart (kg)</text>
        <line x1="165" y1="115" x2="285" y2="115" stroke={strokeHl('Wcart')} strokeWidth="1" strokeDasharray="3,2"/>
        <line x1="165" y1="112" x2="165" y2="118" stroke={strokeHl('Wcart')} strokeWidth="1"/>
        <line x1="285" y1="112" x2="285" y2="118" stroke={strokeHl('Wcart')} strokeWidth="1"/>
      </g>

      {/* Wheels Dwh */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Dwh')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="190" cy="205" r="16" fill={isHl('Dwh') ? '#3B82F6' : 'white'} stroke={strokeHl('Dwh')} strokeWidth={isHl('Dwh') ? 2.5 : 1.5}/>
        <circle cx="190" cy="205" r="6" fill="#475569"/>
        <circle cx="190" cy="205" r="2" fill="white"/>
        <circle cx="260" cy="205" r="16" fill={isHl('Dwh') ? '#3B82F6' : 'white'} stroke={strokeHl('Dwh')} strokeWidth={isHl('Dwh') ? 2.5 : 1.5}/>
        <circle cx="260" cy="205" r="6" fill="#475569"/>
        <circle cx="260" cy="205" r="2" fill="white"/>
        {/* diameter dimension */}
        <line x1="174" y1="228" x2="206" y2="228" stroke={strokeHl('Dwh')} strokeWidth="1"/>
        <line x1="174" y1="225" x2="174" y2="231" stroke={strokeHl('Dwh')} strokeWidth="1"/>
        <line x1="206" y1="225" x2="206" y2="231" stroke={strokeHl('Dwh')} strokeWidth="1"/>
        <text x="190" y="242" textAnchor="middle" className={`text-[10px] ${lbl('Dwh')}`}>Dwh (m)</text>
        {/* ground contact μ */}
        <line x1="182" y1="221" x2="198" y2="221" stroke={isHl('μ') ? '#2563EB' : '#F59E0B'} strokeWidth="1.5" strokeDasharray="2,2"/>
      </g>

      {/* μ rolling */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="225" y="258" textAnchor="middle" className={`text-xs ${lbl('μ')}`}>μ (rolling)</text>
        <line x1="200" y1="260" x2="250" y2="260" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="225" cy="260" r="18" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      {/* θ tilt */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('θ')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="30" y1="205" x2="90" y2="205" stroke={strokeHl('θ')} strokeWidth="1"/>
        <line x1="30" y1="205" x2="85" y2="188" stroke={strokeHl('θ')} strokeWidth="1"/>
        <path d="M 48 205 A 18 18 0 0 0 62 193" fill="none" stroke={strokeHl('θ')} strokeWidth="1.5"/>
        <text x="36" y="185" className={`text-xs ${lbl('θ')}`}>θ</text>
      </g>

      {/* Motor + cable */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="50" y="145" width="62" height="36" fill="#334155" rx="4"/>
        <text x="81" y="167" textAnchor="middle" className="fill-white text-[10px]">MOTOR</text>
      </g>
      <line x1="112" y1="163" x2="170" y2="163" stroke="#64748B" strokeWidth="2" strokeDasharray="6,3"/>
      <polygon points="170,159 182,163 170,167" fill="#64748B"/>

      {/* motion */}
      <line x1="300" y1="155" x2="360" y2="155" stroke="#334155" strokeWidth="1.5"/>
      <polygon points="360,151 372,155 360,159" fill="#334155"/>
      <text x="330" y="148" textAnchor="middle" className="fill-surface-600 text-[10px]">Gerak</text>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Cart — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">Dwh=⌀ roda, Wcart=bobot cart, Wl=beban, μ=rolling, θ=inklinasi rel</text>
      </g>
    </svg>
  );
}
