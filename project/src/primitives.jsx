// Súmula primitives — buttons, fields, pills, money, modals, toast, confirm.

const Button = ({ variant = "primary", size, icon: IconC, iconRight: IconR, children, className = "", ...rest }) => {
  const classes = `btn btn-${variant} ${size ? `btn-${size}` : ""} ${className}`.trim();
  return (
    <button className={classes} {...rest}>
      {IconC ? <IconC /> : null}
      {children}
      {IconR ? <IconR /> : null}
    </button>
  );
};

const Field = ({ label, help, error, children }) => (
  <label className="field">
    {label ? <span className="field-label">{label}</span> : null}
    {children}
    {error ? <span className="field-error">{error}</span> : help ? <span className="field-help">{help}</span> : null}
  </label>
);

const Input = ({ className = "", error = false, ...rest }) => (
  <input className={`input ${error ? "error" : ""} ${className}`.trim()} {...rest}/>
);

const MoneyInput = ({ value, onChange, autoFocus, error = false }) => (
  <div className="input-group" style={error ? { borderColor: "var(--debit-500)" } : undefined}>
    <span className="prefix">R$</span>
    <input value={value} onChange={(e) => onChange?.(e.target.value)} autoFocus={autoFocus} placeholder="0,00"/>
  </div>
);

const Select = ({ children, className = "", ...rest }) => (
  <select className={`input ${className}`.trim()} {...rest}>{children}</select>
);

const Pill = ({ kind, celebrate = false, children }) => (
  <span className={`pill ${kind} ${celebrate ? "celebrate" : ""}`}>
    <span className="dot"></span>{children}
  </span>
);

const fmtMoney = (v) => {
  const n = typeof v === "number" ? v : Number(v || 0);
  return Math.abs(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Money = ({ value, kind, sign = false, color = true }) => {
  const v = typeof value === "number" ? value : Number(value || 0);
  const isCredit = kind === "credit" || (kind === "auto" && v > 0);
  const isDebit = kind === "debit" || (kind === "auto" && v < 0);
  const cls = !color ? "" : isCredit ? "money-credit" : isDebit ? "money-debit" : "";
  const prefix = sign ? (isCredit ? "+" : isDebit ? "−" : "") : "";
  return (
    <span className={cls} style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>
      {prefix}R$ {fmtMoney(v)}
    </span>
  );
};

const Avatar = ({ name, size = 28, kind = "campo" }) => {
  const initials = (name || "?").split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
  const palettes = {
    campo: { bg: "var(--campo-100)", fg: "var(--campo-700)" },
    ouro: { bg: "var(--ouro-100)", fg: "var(--ouro-700)" },
    paper: { bg: "var(--paper-200)", fg: "var(--ink-700)" },
  };
  const p = palettes[kind] || palettes.campo;
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: p.bg,
        color: p.fg,
        fontSize: Math.round(size * 0.4),
      }}
    >
      {initials}
    </span>
  );
};

const Modal = ({ open, onClose, title, subtitle, children, footer, wide = false }) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${wide ? "modal-wide" : ""}`} onClick={(e) => e.stopPropagation()}>
        {(title || subtitle) ? (
          <div className="modal-header">
            {title ? <h2>{title}</h2> : null}
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
        ) : null}
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-foot">{footer}</div> : null}
      </div>
    </div>
  );
};

const Confirm = ({ open, onClose, onConfirm, title, body, danger = false, confirmLabel = "Confirmar" }) => {
  if (!open) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={body}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm?.(); onClose?.(); }}>{confirmLabel}</Button>
        </>
      }
    />
  );
};

const StatCard = ({ label, value, sub, brand, danger, trend }) => (
  <div className={`stat-card ${brand ? "brand" : ""} ${danger ? "danger" : ""}`}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub ? <div className="stat-sub">{trend && <span style={{ display: "inline-flex", alignItems: "center" }}>{trend}</span>}{sub}</div> : null}
  </div>
);

const EmptyState = ({ icon: IconC, title, body, action }) => (
  <div className="empty">
    <div className="icon-circle">{IconC ? <IconC size={22}/> : null}</div>
    <h4>{title}</h4>
    {body ? <p>{body}</p> : null}
    {action ? <div style={{ marginTop: 12 }}>{action}</div> : null}
  </div>
);

// ---------- Toast system ----------
const ToastCtx = React.createContext(null);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([]);

  const push = React.useCallback((t) => {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { id, ...t }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), t.duration || 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind || ""}`}>
            <div className="toast-icon">
              {t.icon ? <t.icon size={16}/> : <I.Check size={16}/>}
            </div>
            <div className="toast-body">
              <div className="toast-title">{t.title}</div>
              {t.sub ? <div className="toast-sub">{t.sub}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
};

const useToast = () => React.useContext(ToastCtx);

Object.assign(window, {
  Button,
  Field,
  Input,
  MoneyInput,
  Select,
  Pill,
  Money,
  fmtMoney,
  Avatar,
  Modal,
  Confirm,
  StatCard,
  EmptyState,
  ToastProvider,
  useToast,
});
