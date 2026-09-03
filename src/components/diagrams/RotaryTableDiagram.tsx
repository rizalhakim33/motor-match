'use client';

interface DiagramProps {
  highlightedParam?: string | null;
  onParamHover?: (param: string | null) => void;
}

export default function RotaryTableDiagram({ highlightedParam, onParamHover }: DiagramProps) {
  const isHl = (p: string) => highlightedParam === p;
  const strokeHl = (p: string) => isHl(p) ? '#2563EB' : '#94A3B8';
  const lbl = (p: string) => isHl(p) ? 'fill-primary-600 font-bold' : 'fill-surface-600';

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto">
      <rect width="500" height="300" fill="#F8FAFC" rx="12"/>
      
      {/* Bearing */}
      <rect x="220" y="225" width="60" height="10" fill="#CBD5E1" rx="3"/>
      <rect x="230" y="215" width="40" height="12" fill="#94A3B8" rx="2"/>

      {/* Table Dt */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Dt')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="250" cy="135" r="78" fill={isHl('Dt') ? '#3B82F6' : '#CBD5E1'} stroke={strokeHl('Dt')} strokeWidth={isHl('Dt') ? 2.5 : 1.2}/>
        <circle cx="250" cy="135" r="74" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
        {/* graduations */}
        {[0,45,90,135,180,225,270,315].map(a => {
          const rad=a*Math.PI/180;
          return <line key={a} x1={250+70*Math.cos(rad)} y1={135+70*Math.sin(rad)} x2={250+78*Math.cos(rad)} y2={135+78*Math.sin(rad)} stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
        })}
        <text x="250" y="140" textAnchor="middle" className="fill-white text-xs font-bold">TABLE</text>
        <text x="250" y="152" textAnchor="middle" className="fill-white text-[10px]">Dt (m)</text>
        {/* diameter dimension */}
        <line x1="172" y1="65" x2="328" y2="65" stroke={strokeHl('Dt')} strokeWidth="1"/>
        <line x1="172" y1="62" x2="172" y2="68" stroke={strokeHl('Dt')} strokeWidth="1"/>
        <line x1="328" y1="62" x2="328" y2="68" stroke={strokeHl('Dt')} strokeWidth="1"/>
        <line x1="172" y1="135" x2="172" y2="70" stroke={strokeHl('Dt')} strokeWidth="0.7" strokeDasharray="2,2"/>
        <line x1="328" y1="135" x2="328" y2="70" stroke={strokeHl('Dt')} strokeWidth="0.7" strokeDasharray="2,2"/>
        <text x="250" y="58" textAnchor="middle" className={`text-[10px] ${lbl('Dt')}`}>Dt</text>
      </g>

      {/* Mtable */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Mtable')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="250" cy="135" r="4" fill={isHl('Mtable') ? '#2563EB' : '#475569'}/>
        <text x="250" y="228" textAnchor="middle" className={`text-[10px] ${isHl('Mtable') ? 'fill-primary-600 font-bold' : 'fill-surface-500'}`}>Mtable (kg)</text>
      </g>

      {/* Load Wl at radius R */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('R')} onMouseLeave={() => onParamHover?.(null)}>
        <circle cx="315" cy="95" r="20" fill={isHl('Wl') ? '#3B82F6' : '#F59E0B'} stroke={isHl('Wl') ? '#2563EB' : '#D97706'} strokeWidth={isHl('Wl') ? 2 : 1.5}/>
        <text x="315" y="92" textAnchor="middle" className="fill-white text-[10px] font-bold">Wl</text>
        <text x="315" y="102" textAnchor="middle" className="fill-white text-[8px]">(kg)</text>
      </g>
      {/* R line */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('R')} onMouseLeave={() => onParamHover?.(null)}>
        <line x1="250" y1="135" x2="315" y2="95" stroke={strokeHl('R')} strokeWidth={isHl('R') ? 2 : 1.5} strokeDasharray={isHl('R') ? '0' : '4,2'}/>
        <circle cx="282" cy="115" r="8" fill="white" stroke={strokeHl('R')} strokeWidth="1"/>
        <text x="282" y="118" textAnchor="middle" className={`text-xs ${lbl('R')}`}>R</text>
      </g>
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('Wl')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="340" y="84" className={`text-[10px] ${lbl('Wl')}`}>Wl</text>
      </g>

      {/* Motor */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('motor')} onMouseLeave={() => onParamHover?.(null)}>
        <rect x="222" y="248" width="56" height="30" fill="#334155" rx="4"/>
        <text x="250" y="267" textAnchor="middle" className="fill-white text-[10px]">MOTOR</text>
      </g>
      <line x1="250" y1="213" x2="250" y2="248" stroke="#64748B" strokeWidth="4" strokeLinecap="round"/>
      {/* gear ratio i */}
      <text x="262" y="238" className="fill-surface-400 text-[8px]">i</text>

      {/* rotation arrow */}
      <path d="M 318 190 A 70 70 0 0 1 182 190" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="0"/>
      <polygon points="182,185 170,190 182,195" fill="#2563EB"/>
      <text x="250" y="205" textAnchor="middle" className="fill-primary-600 text-[10px]">indexing</text>

      {/* μ bearing */}
      <g className="cursor-pointer" onMouseEnter={() => onParamHover?.('μ')} onMouseLeave={() => onParamHover?.(null)}>
        <text x="380" y="150" className={`text-xs ${lbl('μ')}`}>μ</text>
        <line x1="330" y1="148" x2="375" y2="148" stroke={strokeHl('μ')} strokeWidth="1" strokeDasharray="2,2"/>
        <circle cx="355" cy="148" r="10" fill="transparent" stroke={isHl('μ') ? '#2563EB' : 'transparent'} strokeWidth="1.2"/>
      </g>

      <g transform="translate(16, 22)">
        <text className="fill-surface-700 text-xs font-semibold">Rotary Table (top view) — presisi</text>
        <text y="14" className="fill-surface-500 text-[10px]">Dt=⌀ meja, R=jari-jari beban, Wl=beban, Mtable=massa meja, Jtable=1/8·Mtable·Dt²</text>
      </g>
    </svg>
  );
}
