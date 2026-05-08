// Sidebar — left navigation. Supports collapsed state.

const Sidebar = ({ route, onNavigate, collapsed = false, onToggleCollapse, counts = {} }) => {
  const items = [
    { id: "dashboard",     label: "Dashboard",     icon: I.Dashboard },
    { id: "movimentacoes", label: "Movimentações", icon: I.Wallet,    count: counts.pendentes },
    { id: "participantes", label: "Participantes", icon: I.Users },
    { id: "categorias",    label: "Categorias",    icon: I.Layers },
    { id: "relatorios",    label: "Relatórios",    icon: I.Chart },
  ];
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sb-brand">
        <img src="assets/logo-mark.svg" alt=""/>
        <span className="name">súmula<span className="acute"></span></span>
        {!collapsed && (
          <button className="sb-collapse-toggle" onClick={onToggleCollapse} title="Recolher menu" aria-label="Recolher menu">
            <I.ChevronLeft size={12}/>
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
            className={`sb-item ${active ? "active" : ""}`}
            onClick={() => onNavigate(it.id)}
            title={collapsed ? it.label : undefined}
          >
            <Ico/>
            <span className="label">{it.label}</span>
            {it.count ? <span className="badge-count">{it.count}</span> : null}
          </button>
        );
      })}
      {collapsed && (
        <button
          className="sb-item"
          onClick={onToggleCollapse}
          style={{ marginTop: "auto", color: "var(--campo-300)" }}
          title="Expandir menu"
        >
          <I.ChevronRight/>
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
};

window.Sidebar = Sidebar;
