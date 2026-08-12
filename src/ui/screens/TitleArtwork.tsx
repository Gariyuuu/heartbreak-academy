import { useMemo } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
}

interface WindowDef {
  x: number;
  y: number;
  w: number;
  h: number;
  lit: boolean;
}

function useStars(count: number): Star[] {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: Math.random() * 1600,
        y: Math.random() * 460,
        r: 0.6 + Math.random() * 1.6,
        opacity: 0.25 + Math.random() * 0.65,
      })),
    [count],
  );
}

function mirror(windows: WindowDef[]): WindowDef[] {
  return windows.map((w) => ({ ...w, x: 1600 - w.x - w.w }));
}

const leftWingWindows: WindowDef[] = [
  { x: 460, y: 560, w: 26, h: 42, lit: true },
  { x: 540, y: 560, w: 26, h: 42, lit: false },
  { x: 460, y: 626, w: 26, h: 42, lit: false },
  { x: 540, y: 626, w: 26, h: 42, lit: true },
  { x: 460, y: 692, w: 26, h: 42, lit: true },
  { x: 540, y: 692, w: 26, h: 42, lit: false },
];
const rightWingWindows = mirror(leftWingWindows).map((w, i) => ({
  ...w,
  lit: [true, true, false, true, false, true][i],
}));

const leftTowerWindows: WindowDef[] = [
  { x: 288, y: 610, w: 22, h: 34, lit: true },
  { x: 288, y: 672, w: 22, h: 34, lit: false },
];
const rightTowerWindows = mirror(leftTowerWindows).map((w, i) => ({
  ...w,
  lit: [false, true][i],
}));

const centralWindows: WindowDef[] = [
  { x: 726, y: 580, w: 22, h: 32, lit: true },
  { x: 852, y: 580, w: 22, h: 32, lit: true },
];

function Window({ x, y, w, h, lit }: WindowDef) {
  const cx = x + w / 2;
  return (
    <g>
      {lit && (
        <rect
          x={x - 6}
          y={y - 6}
          width={w + 12}
          height={h + 12}
          rx={w / 2 + 6}
          fill="#ffcf6b"
          opacity={0.35}
          style={{ filter: "blur(5px)" }}
        />
      )}
      <path
        d={`M ${x} ${y + h} L ${x} ${y + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2} L ${x + w} ${y + h} Z`}
        fill={lit ? "#ffd98a" : "#0c0814"}
        stroke={lit ? "#ffedbb" : "rgba(201,188,216,0.25)"}
        strokeWidth={1}
        opacity={lit ? 0.95 : 0.85}
      />
      <line x1={cx} y1={y + w / 2} x2={cx} y2={y + h} stroke={lit ? "#7a5a1e" : "#2a2038"} strokeWidth={1} opacity={0.5} />
    </g>
  );
}

export function TitleArtwork() {
  const stars = useStars(55);

  return (
    <svg
      className="title-artwork"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Heartbreak Academy at night, moonlit gothic towers behind a wrought-iron gate"
    >
      <defs>
        <radialGradient id="hba-moon" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#fff8e0" />
          <stop offset="55%" stopColor="#ffe680" />
          <stop offset="100%" stopColor="#ffb24d" />
        </radialGradient>
        <linearGradient id="hba-building" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#251a38" />
          <stop offset="100%" stopColor="#120c1b" />
        </linearGradient>
        <linearGradient id="hba-path" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a98fae" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#a98fae" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      <g>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff6ea" opacity={s.opacity} />
        ))}
      </g>

      <circle cx={1260} cy={130} r={120} fill="#ffe066" opacity={0.16} style={{ filter: "blur(20px)" }} />
      <circle cx={1260} cy={130} r={56} fill="url(#hba-moon)" />
      <circle cx={1274} cy={114} r={9} fill="#ffb24d" opacity={0.35} />
      <circle cx={1246} cy={150} r={5} fill="#ffb24d" opacity={0.3} />
      <circle cx={1260} cy={130} r={56} fill="none" stroke="#fff6ea" strokeOpacity={0.25} strokeWidth={1} />

      <path d="M0,660 Q260,600 560,634 T1100,610 T1600,640 L1600,900 L0,900 Z" fill="#0f0a17" opacity={0.75} />

      <g fill="url(#hba-building)" stroke="#3a2b52" strokeWidth={1.5} strokeOpacity={0.5}>
        <rect x={700} y={560} width={200} height={340} />
        <polygon points="700,560 800,420 900,560" />

        <rect x={430} y={520} width={300} height={380} />
        <polygon points="430,520 580,432 730,520" />
        <rect x={870} y={520} width={300} height={380} />
        <polygon points="870,520 1020,432 1170,520" />

        <rect x={250} y={560} width={120} height={340} />
        <polygon points="250,560 310,478 370,560" />
        <rect x={1230} y={560} width={120} height={340} />
        <polygon points="1230,560 1290,478 1350,560" />
      </g>

      <g stroke="#3a2b52" strokeOpacity={0.5} strokeWidth={1}>
        <line x1={478} y1={520} x2={478} y2={900} />
        <line x1={730} y1={432} x2={730} y2={900} />
        <line x1={870} y1={432} x2={870} y2={900} />
        <line x1={1122} y1={520} x2={1122} y2={900} />
      </g>

      <circle cx={800} cy={456} r={4} fill="#ffe066" opacity={0.7} style={{ filter: "blur(1px)" }} />

      <g>
        <circle cx={800} cy={655} r={52} fill="#ff6ea6" opacity={0.08} />
        <circle cx={800} cy={655} r={52} fill="none" stroke="#ff9dc2" strokeOpacity={0.4} strokeWidth={1.5} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={800}
              y1={655}
              x2={800 + Math.cos(a) * 52}
              y2={655 + Math.sin(a) * 52}
              stroke="#ff9dc2"
              strokeOpacity={0.3}
              strokeWidth={1}
            />
          );
        })}
        <circle cx={800} cy={655} r={10} fill="#ffe066" opacity={0.5} style={{ filter: "blur(3px)" }} />
      </g>

      {[
        ...leftWingWindows,
        ...rightWingWindows,
        ...leftTowerWindows,
        ...rightTowerWindows,
        ...centralWindows,
      ].map((w, i) => (
        <Window key={i} {...w} />
      ))}

      <polygon points="742,900 858,900 826,610 774,610" fill="url(#hba-path)" />

      <g opacity={0.92}>
        <path d="M800,860 Q790,838 800,822 Q810,838 800,860 Z" fill="#0c0814" />
        <circle cx={800} cy={812} r={9} fill="#0c0814" />
        <path d="M793,860 Q800,868 807,860 L804,872 L796,872 Z" fill="#0c0814" />
        <path d="M791,835 Q784,850 788,862" fill="none" stroke="#ffe066" strokeOpacity={0.18} strokeWidth={1.5} />
      </g>

      <g fill="#0a0712">
        {Array.from({ length: 25 }, (_, i) => {
          const x = 40 + i * 62;
          if (x > 720 && x < 880) return null;
          return <rect key={i} x={x} y={780} width={6} height={120} />;
        })}
        <rect x={30} y={748} width={16} height={152} />
        <circle cx={38} cy={742} r={9} fill="#ffe066" opacity={0.4} style={{ filter: "blur(2px)" }} />
        <rect x={1554} y={748} width={16} height={152} />
        <circle cx={1562} cy={742} r={9} fill="#ffe066" opacity={0.4} style={{ filter: "blur(2px)" }} />
        <rect x={0} y={888} width={1600} height={12} />
      </g>
    </svg>
  );
}
