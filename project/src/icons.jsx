// Súmula icon set — Lucide-style stroke. 1.75 stroke. Inherits currentColor.

const Icon = ({ d, viewBox = "0 0 24 24", size = 18, ...rest }) => (
  <svg
    viewBox={viewBox}
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...rest}
  >
    {d}
  </svg>
);

const I = {
  Dashboard: (p) => <Icon {...p} d={<><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>}/>,
  Users: (p) => <Icon {...p} d={<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>}/>,
  User: (p) => <Icon {...p} d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}/>,
  Layers: (p) => <Icon {...p} d={<><path d="M2 9.5L12 4l10 5.5L12 15z"/><path d="M2 14.5L12 20l10-5.5"/></>}/>,
  Wallet: (p) => <Icon {...p} d={<><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1"/><path d="M3 10h18"/><path d="M16 14h5"/></>}/>,
  Chart: (p) => <Icon {...p} d={<><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></>}/>,
  Plus: (p) => <Icon {...p} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>}/>,
  Search: (p) => <Icon {...p} d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>}/>,
  Filter: (p) => <Icon {...p} d={<><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>}/>,
  Calendar: (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>}/>,
  CalendarCheck: (p) => <Icon {...p} d={<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/></>}/>,
  Check: (p) => <Icon {...p} d={<><polyline points="20 6 9 17 4 12"/></>}/>,
  CheckCircle: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 16 9"/></>}/>,
  X: (p) => <Icon {...p} d={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}/>,
  Trash: (p) => <Icon {...p} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1.5 14a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></>}/>,
  Edit: (p) => <Icon {...p} d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></>}/>,
  Download: (p) => <Icon {...p} d={<><path d="M19 14v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6"/><polyline points="9 11 12 14 15 11"/><line x1="12" y1="14" x2="12" y2="2"/></>}/>,
  TrendUp: (p) => <Icon {...p} d={<><polyline points="22 7 13.5 15.5 8.5 10.5 1 18"/><polyline points="16 7 22 7 22 13"/></>}/>,
  TrendDown: (p) => <Icon {...p} d={<><polyline points="22 17 13.5 8.5 8.5 13.5 1 6"/><polyline points="16 17 22 17 22 11"/></>}/>,
  Clock: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>}/>,
  Lock: (p) => <Icon {...p} d={<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>}/>,
  Mail: (p) => <Icon {...p} d={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}/>,
  Eye: (p) => <Icon {...p} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}/>,
  EyeOff: (p) => <Icon {...p} d={<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}/>,
  AlertCircle: (p) => <Icon {...p} d={<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}/>,
  AlertTriangle: (p) => <Icon {...p} d={<><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>}/>,
  Bell: (p) => <Icon {...p} d={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>}/>,
  ChevronRight: (p) => <Icon {...p} d={<polyline points="9 18 15 12 9 6"/>}/>,
  ChevronLeft: (p) => <Icon {...p} d={<polyline points="15 18 9 12 15 6"/>}/>,
  ChevronDown: (p) => <Icon {...p} d={<polyline points="6 9 12 15 18 9"/>}/>,
  ChevronUp: (p) => <Icon {...p} d={<polyline points="18 15 12 9 6 15"/>}/>,
  Logout: (p) => <Icon {...p} d={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>}/>,
  Whistle: (p) => <Icon {...p} d={<><path d="M3 12h6l3-3v6l-3-3"/><circle cx="14" cy="12" r="6"/><circle cx="14" cy="12" r="2"/></>}/>,
  Receipt: (p) => <Icon {...p} d={<><path d="M4 2h16v20l-4-2-4 2-4-2-4 2z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/></>}/>,
  PanelLeft: (p) => <Icon {...p} d={<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></>}/>,
  MoreH: (p) => <Icon {...p} d={<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>}/>,
  Copy: (p) => <Icon {...p} d={<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>}/>,
  Send: (p) => <Icon {...p} d={<><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>}/>,
  Print: (p) => <Icon {...p} d={<><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></>}/>,
  Trophy: (p) => <Icon {...p} d={<><path d="M6 9V3h12v6"/><path d="M6 9a3 3 0 0 1-3-3V5h3"/><path d="M18 9a3 3 0 0 0 3-3V5h-3"/><path d="M9 14l3 3 3-3"/><path d="M12 17v4"/><path d="M8 21h8"/></>}/>,
  Sparkle: (p) => <Icon {...p} d={<><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/></>}/>,
};

window.I = I;
window.Icon = Icon;
