import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = ({ size = 22, ...rest }: P) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...rest,
});

export const SearchIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </svg>
);

export const HeartIcon = ({ filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(p)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
  </svg>
);

export const BagIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c1.2-3.6 4-5.2 7.5-5.2s6.3 1.6 7.5 5.2" />
  </svg>
);

/** Points "back" in reading direction (flips in RTL). */
export const BackIcon = (p: P) => (
  <svg {...base(p)} className={`rtl:-scale-x-100 ${p.className ?? ""}`}>
    <path d="M19 12H5m6-6-6 6 6 6" />
  </svg>
);

export const ChevronIcon = (p: P) => (
  <svg {...base(p)} className={`rtl:-scale-x-100 ${p.className ?? ""}`}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const ShareIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 15V4m-4 4 4-4 4 4" />
    <path d="M6 12v7h12v-7" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const GlobeIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.5 3.5 5.3 3.5 8.5s-1.1 6-3.5 8.5c-2.4-2.5-3.5-5.3-3.5-8.5S9.6 6 12 3.5Z" />
  </svg>
);

export const TruckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.6" />
    <circle cx="17" cy="17.5" r="1.6" />
  </svg>
);

export const ShieldIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5 5 6v5.5c0 4.2 2.8 7.2 7 9 4.2-1.8 7-4.8 7-9V6l-7-2.5Z" />
    <path d="m9 12 2.2 2.2L15 10.3" />
  </svg>
);
export const RefreshIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 8a7.5 7.5 0 0 0-13-1.5M5 4v3.2h3.2M5 16a7.5 7.5 0 0 0 13 1.5M19 20v-3.2h-3.2" />
  </svg>
);
export const HeadsetIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 13v-1.5a7.5 7.5 0 0 1 15 0V13" />
    <rect x="3.5" y="12.5" width="3.5" height="5.5" rx="1.5" />
    <rect x="17" y="12.5" width="3.5" height="5.5" rx="1.5" />
    <path d="M18.5 18c0 1.4-1.6 2.5-4 2.5" />
  </svg>
);
export const CardIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.2" />
    <path d="M3 10h18M7 15h3" />
  </svg>
);
export const GiftIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
    <path d="M12 9v11M3.5 13h17M12 9c-2.8 0-4.5-1-4.5-2.6S9.2 4 12 7c2.8-3 4.5-1.6 4.5-.6S14.8 9 12 9Z" />
  </svg>
);
export const StarIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="m12 4 2.4 5 5.4.7-4 3.7 1 5.4L12 16.2 7.2 18.8l1-5.4-4-3.7 5.4-.7L12 4Z" />
  </svg>
);
