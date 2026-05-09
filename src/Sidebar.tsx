import { Icons } from './icons';
import type { Page } from './types';

interface SidebarProps {
  route: Page;
  onNavigate: (page: Page) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const items = [
  { id: 'dashboard'     as const, label: 'Dashboard',     icon: Icons.Dashboard },
  { id: 'movimentacoes' as const, label: 'Movimentações', icon: Icons.Wallet    },
  { id: 'participantes' as const, label: 'Participantes', icon: Icons.Users     },
  { id: 'categorias'   as const, label: 'Categorias',    icon: Icons.Layers    },
  { id: 'relatorios'   as const, label: 'Relatórios',    icon: Icons.Chart     },
];

export const Sidebar = ({ route, onNavigate, collapsed = false, onToggleCollapse, mobileOpen = false, onMobileClose }: SidebarProps) => (
  <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
    <div className="sb-brand">
      <img src="/assets/logo-mark.svg" alt="" />
      <span className="name">
        súmula
        <span className="acute"></span>
      </span>
      {!collapsed && (
        <button className="sb-collapse-toggle" onClick={onToggleCollapse} title="Recolher menu" aria-label="Recolher menu">
          <Icons.ChevronLeft size={12} />
        </button>
      )}
    </div>

    <div className="sb-section">Geral</div>

    {items.map((it) => {
      const Ico = it.icon;
      const active = route === it.id;
      return (
        <button
          key={it.id}
          className={`sb-item ${active ? 'active' : ''}`}
          onClick={() => { onNavigate(it.id); onMobileClose?.(); }}
          title={collapsed ? it.label : undefined}
        >
          <Ico />
          <span className="label">{it.label}</span>
        </button>
      );
    })}

    {collapsed && (
      <button
        className="sb-item"
        onClick={onToggleCollapse}
        style={{ marginTop: 'auto', color: 'var(--campo-300)' }}
        title="Expandir menu"
      >
        <Icons.ChevronRight />
      </button>
    )}

    <div className="sb-foot">
      <div className="sb-user">
        <div className="avatar-circle">CA</div>
        <div className="meta">
          <span>Real Vila Mariana</span>
          <span className="group">admin · Carlos A.</span>
        </div>
      </div>
    </div>
  </aside>
);
