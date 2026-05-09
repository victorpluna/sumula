import React, { useState } from 'react';
import { Icons } from './icons';
import { Button, Field, Input } from './primitives';

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [mode, setMode] = useState<'login' | 'recover'>('login');
  const [email, setEmail] = useState('carlos@realvilamariana.com');
  const [password, setPassword] = useState('realvila2025');
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha pra entrar.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 600);
  };

  return (
    <div className="login-layout">
      {/* Left — form */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px 32px', background: 'var(--paper-100)' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <img src="/assets/logo-mark.svg" alt="" style={{ width: 40, height: 40, borderRadius: 11 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28, letterSpacing: '-0.025em', color: 'var(--ink-900)', position: 'relative' }}>
              súmula
              <span style={{ position: 'absolute', top: 4, left: 9, width: 4, height: 4, borderRadius: '50%', background: 'var(--ouro-500)' }}></span>
            </span>
          </div>

          {mode === 'login' ? (
            <>
              <h1 style={{ marginBottom: 6 }}>Bom te ver de volta.</h1>
              <p style={{ color: 'var(--ink-500)', marginBottom: 28, fontSize: 14 }}>Entra na sua conta de administrador.</p>

              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field label="E-mail">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@time.com.br" />
                </Field>
                <Field label="Senha">
                  <div style={{ position: 'relative' }}>
                    <Input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: 40 }} />
                    <button
                      type="button"
                      onClick={() => setShow(!show)}
                      style={{ position: 'absolute', right: 8, top: 7, background: 'transparent', border: 'none', color: 'var(--ink-500)', cursor: 'pointer', padding: 6 }}
                      aria-label={show ? 'Esconder senha' : 'Mostrar senha'}
                    >
                      {show ? <Icons.EyeOff size={16} /> : <Icons.Eye size={16} />}
                    </button>
                  </div>
                </Field>
                {error && (
                  <div style={{ background: 'var(--debit-50)', color: 'var(--debit-700)', padding: '10px 12px', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icons.AlertCircle size={14} />{error}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setMode('recover')}
                  style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--brand)', fontSize: 13, fontWeight: 500, padding: 0, cursor: 'pointer' }}
                >
                  Esqueci a senha
                </button>
                <Button type="submit" size="lg" disabled={loading} style={{ marginTop: 8 }}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-soft)', fontSize: 12, color: 'var(--ink-500)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--ink-700)' }}>Demo:</strong> qualquer credencial entra. Os dados são fictícios — Real Vila Mariana FC.
              </div>
            </>
          ) : (
            <>
              <h1 style={{ marginBottom: 6 }}>Recuperar acesso</h1>
              <p style={{ color: 'var(--ink-500)', marginBottom: 28, fontSize: 14 }}>
                {sent ? 'Pronto. Olha sua caixa de entrada.' : 'A gente te manda um link pra redefinir a senha.'}
              </p>

              {!sent ? (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Field label="E-mail cadastrado">
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
                  </Field>
                  <Button type="submit" size="lg" style={{ marginTop: 8 }}>Enviar link</Button>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    style={{ background: 'transparent', border: 'none', color: 'var(--ink-500)', fontSize: 13, cursor: 'pointer', marginTop: 4 }}
                  >
                    ← Voltar pro login
                  </button>
                </form>
              ) : (
                <div style={{ background: 'var(--credit-50)', color: 'var(--credit-700)', padding: 16, borderRadius: 12, fontSize: 14, lineHeight: 1.5, border: '1px solid var(--credit-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontWeight: 600 }}>
                    <Icons.CheckCircle size={16} />Link enviado.
                  </div>
                  Te mandamos um e-mail pra <strong>{email}</strong>. O link vence em 30 minutos.
                  <div style={{ marginTop: 16 }}>
                    <Button variant="secondary" size="sm" onClick={() => { setMode('login'); setSent(false); }}>Voltar pro login</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right — brand panel */}
      <div className="login-right-panel" style={{ background: 'var(--campo-700)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 56, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 0%, transparent 50%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.03) 100%)', backgroundSize: '100% 32px' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--campo-300)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Súmula · v1.0</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--campo-300)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>2025 · 2026</div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 60, lineHeight: 1.02, letterSpacing: '-0.035em', color: 'var(--paper-50)' }}>
            O caixa do<br />seu time,<br />
            <span style={{ color: 'var(--ouro-300)' }}>organizado.</span>
          </div>
          <p style={{ color: 'var(--campo-200)', marginTop: 28, fontSize: 17, lineHeight: 1.55, maxWidth: 440 }}>
            Mensalidades, despesas, prestação de contas. Sem planilha, sem cobrança chata no grupo do WhatsApp.
          </p>
        </div>
        <div style={{ position: 'relative', display: 'flex', gap: 40, color: 'var(--campo-200)', fontSize: 13, paddingTop: 24, borderTop: '1px solid var(--campo-600)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--paper-50)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em' }}>+1.200</div>
            times no Brasil
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--paper-50)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em' }}>R$ 2,1mi</div>
            movimentados em 2025
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--paper-50)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em' }}>4,9★</div>
            avaliação dos tesoureiros
          </div>
        </div>
      </div>
    </div>
  );
};
