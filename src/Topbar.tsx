import { useEffect, useRef, useState } from 'react';
import { Icons } from './icons';
import { Button } from './primitives';
import type { Notification } from './types';

interface TopbarProps {
  crumb: string;
  onLogout: () => void;
  notifications?: Notification[];
  onOpenSidebar?: () => void;
}

export const Topbar = ({ crumb, onLogout, notifications = [], onOpenSidebar }: TopbarProps) => {
  const [openNotif, setOpenNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openNotif) return;
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setOpenNotif(false);
    };
    setTimeout(() => document.addEventListener('click', onClick), 0);
    return () => document.removeEventListener('click', onClick);
  }, [openNotif]);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="topbar">
      <button className="tb-hamburger" onClick={onOpenSidebar} aria-label="Abrir menu">
        <Icons.Menu size={16} />
      </button>
      <div className="tb-crumbs">
        <span>Real Vila Mariana FC</span>
        <span className="sep">/</span>
        <span className="here">{crumb}</span>
      </div>
      <div className="tb-spacer"></div>
      <div className="tb-search">
        <Icons.Search size={14} />
        <input placeholder="Buscar participante, lançamento..." />
        <kbd>⌘K</kbd>
      </div>
      <div ref={notifRef} style={{ position: 'relative' }}>
        <button className="tb-iconbtn" onClick={() => setOpenNotif((v) => !v)} aria-label="Notificações">
          <Icons.Bell size={16} />
          {unread > 0 && <span className="dot-badge"></span>}
        </button>
        {openNotif && (
          <div className="notif-popover">
            <div className="head">
              <span>Avisos</span>
              <span style={{ fontSize: 11, color: 'var(--ink-500)', fontWeight: 500 }}>{unread} novos</span>
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--ink-500)', fontSize: 13 }}>
                Caixa vazia. Tudo em ordem.
              </div>
            ) : (
              notifications.map((n, i) => {
                const Ic = n.icon || Icons.Bell;
                return (
                  <div key={i} className="item">
                    <div className={`ic ${n.kind || 'warn'}`}><Ic size={14} /></div>
                    <div className="body">
                      <div>{n.title}</div>
                      <div className="when">{n.sub}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <Button variant="ghost" size="sm" icon={Icons.Logout} onClick={onLogout}>Sair</Button>
    </header>
  );
};
