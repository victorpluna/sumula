import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Icons } from './icons';

// ---- Button ----
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'lg';
  icon?: React.ComponentType<{ size?: number }>;
  iconRight?: React.ComponentType<{ size?: number }>;
}

export const Button = ({ variant = 'primary', size, icon: IconC, iconRight: IconR, children, className = '', ...rest }: ButtonProps) => {
  const classes = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`.trim();
  return (
    <button className={classes} {...rest}>
      {IconC ? <IconC size={16} /> : null}
      {children}
      {IconR ? <IconR size={16} /> : null}
    </button>
  );
};

// ---- Field ----
interface FieldProps {
  label?: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
}

export const Field = ({ label, help, error, children }: FieldProps) => (
  <label className="field">
    {label ? <span className="field-label">{label}</span> : null}
    {children}
    {error ? <span className="field-error">{error}</span> : help ? <span className="field-help">{help}</span> : null}
  </label>
);

// ---- Input ----
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = ({ className = '', error = false, ...rest }: InputProps) => (
  <input className={`input ${error ? 'error' : ''} ${className}`.trim()} {...rest} />
);

// ---- MoneyInput ----
interface MoneyInputProps {
  value: string;
  onChange?: (val: string) => void;
  autoFocus?: boolean;
  error?: boolean;
}

export const MoneyInput = ({ value, onChange, autoFocus, error = false }: MoneyInputProps) => (
  <div className="input-group" style={error ? { borderColor: 'var(--debit-500)' } : undefined}>
    <span className="prefix">R$</span>
    <input value={value} onChange={(e) => onChange?.(e.target.value)} autoFocus={autoFocus} placeholder="0,00" />
  </div>
);

// ---- Select ----
export const Select = ({ children, className = '', ...rest }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode; className?: string }) => (
  <select className={`input ${className}`.trim()} {...rest}>{children}</select>
);

// ---- Pill ----
interface PillProps {
  kind: string;
  celebrate?: boolean;
  children: React.ReactNode;
}

export const Pill = ({ kind, celebrate = false, children }: PillProps) => (
  <span className={`pill ${kind} ${celebrate ? 'celebrate' : ''}`}>
    <span className="dot"></span>{children}
  </span>
);

// ---- Money formatting ----
export const fmtMoney = (v: number | string): string => {
  const n = typeof v === 'number' ? v : Number(v || 0);
  return Math.abs(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface MoneyProps {
  value: number | string;
  kind?: 'credit' | 'debit' | 'auto';
  sign?: boolean;
  color?: boolean;
}

export const Money = ({ value, kind, sign = false, color = true }: MoneyProps) => {
  const v = typeof value === 'number' ? value : Number(value || 0);
  const isCredit = kind === 'credit' || (kind === 'auto' && v > 0);
  const isDebit = kind === 'debit' || (kind === 'auto' && v < 0);
  const cls = !color ? '' : isCredit ? 'money-credit' : isDebit ? 'money-debit' : '';
  const prefix = sign ? (isCredit ? '+' : isDebit ? '−' : '') : '';
  return (
    <span className={cls} style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
      {prefix}R$ {fmtMoney(v)}
    </span>
  );
};

// ---- Avatar ----
interface AvatarProps {
  name: string;
  size?: number;
  kind?: 'campo' | 'ouro' | 'paper';
}

export const Avatar = ({ name, size = 28, kind = 'campo' }: AvatarProps) => {
  const initials = (name || '?').split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
  const palettes = {
    campo: { bg: 'var(--campo-100)', fg: 'var(--campo-700)' },
    ouro:  { bg: 'var(--ouro-100)',  fg: 'var(--ouro-700)'  },
    paper: { bg: 'var(--paper-200)', fg: 'var(--ink-700)'   },
  };
  const p = palettes[kind];
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, background: p.bg, color: p.fg, fontSize: Math.round(size * 0.4) }}
    >
      {initials}
    </span>
  );
};

// ---- Modal ----
interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}

export const Modal = ({ open, onClose, title, subtitle, children, footer, wide = false }: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`} onClick={(e) => e.stopPropagation()}>
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

// ---- Confirm ----
interface ConfirmProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  body?: string;
  danger?: boolean;
  confirmLabel?: string;
}

export const Confirm = ({ open, onClose, onConfirm, title, body, danger = false, confirmLabel = 'Confirmar' }: ConfirmProps) => {
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
          <Button variant={danger ? 'danger' : 'primary'} onClick={() => { onConfirm?.(); onClose?.(); }}>{confirmLabel}</Button>
        </>
      }
    />
  );
};

// ---- StatCard ----
interface StatCardProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  brand?: boolean;
  danger?: boolean;
  trend?: React.ReactNode;
}

export const StatCard = ({ label, value, sub, brand, danger, trend }: StatCardProps) => (
  <div className={`stat-card ${brand ? 'brand' : ''} ${danger ? 'danger' : ''}`}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {sub ? <div className="stat-sub">{trend && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{trend}</span>}{sub}</div> : null}
  </div>
);

// ---- EmptyState ----
interface EmptyStateProps {
  icon?: React.ComponentType<{ size?: number }>;
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: IconC, title, body, action }: EmptyStateProps) => (
  <div className="empty">
    <div className="icon-circle">{IconC ? <IconC size={22} /> : null}</div>
    <h4>{title}</h4>
    {body ? <p>{body}</p> : null}
    {action ? <div style={{ marginTop: 12 }}>{action}</div> : null}
  </div>
);

// ---- Toast system ----
interface ToastData {
  id: number;
  title: string;
  sub?: string;
  kind?: 'success' | 'error';
  icon?: React.ComponentType<{ size?: number }>;
  duration?: number;
}

type PushToast = (t: Omit<ToastData, 'id'>) => void;

const ToastCtx = createContext<PushToast | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const push = useCallback<PushToast>((t) => {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { id, ...t }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), t.duration || 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => {
          const Ic = t.icon || Icons.Check;
          return (
            <div key={t.id} className={`toast ${t.kind || ''}`}>
              <div className="toast-icon"><Ic size={16} /></div>
              <div className="toast-body">
                <div className="toast-title">{t.title}</div>
                {t.sub ? <div className="toast-sub">{t.sub}</div> : null}
              </div>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};
