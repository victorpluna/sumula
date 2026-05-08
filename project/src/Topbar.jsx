// Topbar — breadcrumbs, search, notifications, user menu.

const Topbar = ({ crumb, onLogout, notifications = [] }) => {
  const [openNotif, setOpenNotif] = React.useState(false);
  const notifRef = React.useRef(null);

  React.useEffect(() => {
    if (!openNotif) return;
    const onClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setOpenNotif(false);
    };
    setTimeout(() => document.addEventListener("click", onClick), 0);
    return () => document.removeEventListener("click", onClick);
  }, [openNotif]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="topbar">
      <div className="tb-crumbs">
        <span>Real Vila Mariana FC</span>
        <span className="sep">/</span>
        <span className="here">{crumb}</span>
      </div>
      <div className="tb-spacer"></div>
      <div className="tb-search">
        <I.Search size={14}/>
        <input placeholder="Buscar participante, lançamento..." />
        <kbd>⌘K</kbd>
      </div>
      <div ref={notifRef} style={{ position: "relative" }}>
        <button className="tb-iconbtn" onClick={() => setOpenNotif((v) => !v)} aria-label="Notificações">
          <I.Bell size={16}/>
          {unread > 0 && <span className="dot-badge"></span>}
        </button>
        {openNotif && (
          <div className="notif-popover">
            <div className="head">
              <span>Avisos</span>
              <span style={{ fontSize: 11, color: "var(--ink-500)", fontWeight: 500 }}>{unread} novos</span>
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--ink-500)", fontSize: 13 }}>
                Caixa vazia. Tudo em ordem.
              </div>
            ) : (
              notifications.map((n, i) => {
                const Ic = n.icon || I.Bell;
                return (
                  <div key={i} className="item">
                    <div className={`ic ${n.kind || "warn"}`}><Ic size={14}/></div>
                    <div className="body">
                      <div>{n.text}</div>
                      <div className="when">{n.when}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <Button variant="ghost" size="sm" icon={I.Logout} onClick={onLogout}>Sair</Button>
    </header>
  );
};

window.Topbar = Topbar;
