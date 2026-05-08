import React, { useCallback, useEffect, useRef, useState } from 'react';

// ---- useTweaks ----
export function useTweaks<T extends Record<string, unknown>>(defaults: T): [T, (key: keyof T, val: T[keyof T]) => void] {
  const [values, setValues] = useState<T>(defaults);
  const setTweak = useCallback((key: keyof T, val: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);
  return [values, setTweak];
}

// ---- TweaksPanel ----
interface TweaksPanelProps {
  title?: string;
  children: React.ReactNode;
}

export const TweaksPanel = ({ title = 'Tweaks', children }: TweaksPanelProps) => {
  const [open, setOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const t = (e?.data as { type?: string })?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <div
      ref={dragRef}
      style={{
        position: 'fixed',
        right: offsetRef.current.x,
        bottom: offsetRef.current.y,
        zIndex: 2147483646,
        width: 280,
        maxHeight: 'calc(100vh - 32px)',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(250,249,247,.88)',
        color: '#29261b',
        backdropFilter: 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: 'blur(24px) saturate(160%)',
        border: '.5px solid rgba(255,255,255,.6)',
        borderRadius: 14,
        boxShadow: '0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18)',
        font: '11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 8px 10px 14px', cursor: 'move', userSelect: 'none' }}
        onMouseDown={onDragStart}
      >
        <b style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.01em' }}>{title}</b>
        <button
          style={{ appearance: 'none', border: 0, background: 'transparent', color: 'rgba(41,38,27,.55)', width: 22, height: 22, borderRadius: 6, cursor: 'default', fontSize: 13, lineHeight: 1 }}
          aria-label="Close tweaks"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => { setOpen(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }}
        >✕</button>
      </div>
      <div style={{ padding: '2px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
};

// ---- TweakSection ----
export const TweakSection = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <>
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(41,38,27,.45)', paddingTop: 10 }}>{title}</div>
    {children}
  </>
);

// ---- TweakToggle ----
export const TweakToggle = ({ label, value, onChange, help }: { label: string; value: boolean; onChange: (v: boolean) => void; help?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
    <div>
      <div style={{ color: 'rgba(41,38,27,.72)', fontWeight: 500 }}>{label}</div>
      {help && <div style={{ fontSize: 10, color: 'rgba(41,38,27,.45)', marginTop: 2 }}>{help}</div>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={value}
      data-on={value ? '1' : '0'}
      onClick={() => onChange(!value)}
      style={{
        position: 'relative',
        width: 32,
        height: 18,
        border: 0,
        borderRadius: 999,
        background: value ? '#34c759' : 'rgba(0,0,0,.15)',
        transition: 'background .15s',
        cursor: 'default',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <i style={{
        position: 'absolute',
        top: 2,
        left: 2,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,.25)',
        transition: 'transform .15s',
        transform: value ? 'translateX(14px)' : 'translateX(0)',
        display: 'block',
      }} />
    </button>
  </div>
);

// ---- TweakRadio ----
interface TweakRadioOption {
  value: string;
  label: string;
}

export const TweakRadio = ({ label, value, options, onChange, help }: { label: string; value: string; options: TweakRadioOption[]; onChange: (v: string) => void; help?: string }) => {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ color: 'rgba(41,38,27,.72)', fontWeight: 500 }}>{label}</div>
      {help && <div style={{ fontSize: 10, color: 'rgba(41,38,27,.45)' }}>{help}</div>}
      <div role="radiogroup" style={{ position: 'relative', display: 'flex', padding: 2, borderRadius: 8, background: 'rgba(0,0,0,.06)', userSelect: 'none' }}>
        <div style={{
          position: 'absolute', top: 2, bottom: 2,
          left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
          width: `calc((100% - 4px) / ${n})`,
          borderRadius: 6,
          background: 'rgba(255,255,255,.9)',
          boxShadow: '0 1px 2px rgba(0,0,0,.12)',
          transition: 'left .15s cubic-bezier(.3,.7,.4,1)',
        }} />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
            style={{ appearance: 'none', position: 'relative', zIndex: 1, flex: 1, border: 0, background: 'transparent', color: 'inherit', font: 'inherit', fontWeight: 500, minHeight: 22, borderRadius: 6, cursor: 'default', padding: '4px 6px', lineHeight: 1.2 }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ---- TweakColor ----
export const TweakColor = ({ label, value, options, onChange, help }: { label: string; value: string; options: string[]; onChange: (v: string) => void; help?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <div style={{ color: 'rgba(41,38,27,.72)', fontWeight: 500 }}>{label}</div>
    {help && <div style={{ fontSize: 10, color: 'rgba(41,38,27,.45)' }}>{help}</div>}
    <div style={{ display: 'flex', gap: 6 }} role="radiogroup">
      {options.map((o) => {
        const on = o.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o)}
            style={{
              flex: 1,
              height: 46,
              padding: 0,
              border: 0,
              borderRadius: 6,
              overflow: 'hidden',
              cursor: 'default',
              background: o,
              boxShadow: on ? '0 0 0 1.5px rgba(0,0,0,.85),0 2px 6px rgba(0,0,0,.15)' : '0 0 0 .5px rgba(0,0,0,.12)',
              transition: 'box-shadow .12s',
            }}
          />
        );
      })}
    </div>
  </div>
);
