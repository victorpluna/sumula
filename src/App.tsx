import { useState } from 'react';
import { Icons } from './icons';
import { ToastProvider } from './primitives';
import { TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakColor, useTweaks } from './TweaksPanel';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { Participantes } from './Participantes';
import { Movimentacoes } from './Movimentacoes';
import { Categorias } from './Categorias';
import { Relatorios } from './Relatorios';
import { seedData } from './seed';
import type { AppData, Categoria, Movimentacao, Page, Participante, Tweaks } from './types';

const TWEAK_DEFAULTS: Tweaks = {
  sidebarCollapsed: false,
  dashboardLayout: 'cards',
  showGramadoPattern: true,
  accentTone: '#1A4D2E',
};

const accentMap: Record<string, string> = {
  '#1A4D2E': 'campo',
  '#0E3A52': 'azul',
  '#5C2E0E': 'couro',
};

const crumbLabel: Record<Page, string> = {
  dashboard: 'Dashboard',
  participantes: 'Participantes',
  movimentacoes: 'Movimentações',
  categorias: 'Categorias',
  relatorios: 'Relatórios',
};

const App = () => {
  const [authed, setAuthed] = useState(false);
  const [page, setPage] = useState<Page>('dashboard');
  const [data, setData] = useState<AppData>(seedData);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [autoOpenMov, setAutoOpenMov] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const goto = (p: Page, opts: { openNew?: boolean } = {}) => {
    setPage(p);
    if (opts.openNew && p === 'movimentacoes') setAutoOpenMov(true);
  };

  // mutations
  const addParticipante = (d: { nome: string; valorMensal: number }) => setData((prev) => {
    const codigo = Math.max(0, ...prev.participantes.map((p) => p.codigo)) + 1;
    const novo: Participante = { id: `p-${Date.now()}`, codigo, ativo: true, ...d };
    return { ...prev, participantes: [...prev.participantes, novo] };
  });

  const updateParticipante = (id: string, patch: { nome: string; valorMensal: number }) =>
    setData((prev) => ({ ...prev, participantes: prev.participantes.map((p) => p.id === id ? { ...p, ...patch } : p) }));

  const toggleParticipante = (id: string) =>
    setData((prev) => ({ ...prev, participantes: prev.participantes.map((p) => p.id === id ? { ...p, ativo: !p.ativo } : p) }));

  const addCategoria = (d: { descricao: string; tipo: 'credit' | 'debit' }) => setData((prev) => {
    const codigo = Math.max(0, ...prev.categorias.map((c) => c.codigo)) + 1;
    const nova: Categoria = { id: `c-${Date.now()}`, codigo, ativo: true, ...d };
    return { ...prev, categorias: [...prev.categorias, nova] };
  });

  const updateCategoria = (id: string, patch: { descricao: string; tipo: 'credit' | 'debit' }) =>
    setData((prev) => ({ ...prev, categorias: prev.categorias.map((c) => c.id === id ? { ...c, ...patch } : c) }));

  const markPaid = (id: string) => setData((prev) => ({
    ...prev,
    movs: prev.movs.map((m) => m.id === id ? { ...m, status: 'pago' as const, dataPagamento: '08/11/2025' } : m),
  }));

  const addMov = (mov: { categoriaId: string; participanteId: string | null; valor: number; vencimento: string; obs: string }) =>
    setData((prev) => {
      const cat = prev.categorias.find((c) => c.id === mov.categoriaId);
      const codigo = Math.max(0, ...prev.movs.map((m) => m.codigo)) + 1;
      const nova: Movimentacao = {
        id: `m-${Date.now()}`,
        codigo,
        tipo: cat?.tipo ?? 'credit',
        status: 'pendente',
        dataPagamento: null,
        ...mov,
      };
      return { ...prev, movs: [nova, ...prev.movs] };
    });

  const deleteMov = (id: string) =>
    setData((prev) => ({ ...prev, movs: prev.movs.filter((m) => m.id !== id) }));

  if (!authed) {
    return (
      <ToastProvider>
        <Login onLogin={() => setAuthed(true)} />
      </ToastProvider>
    );
  }

  const collapsed = !!tweaks.sidebarCollapsed;

  return (
    <ToastProvider>
      <div className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`app-shell ${collapsed ? 'collapsed' : ''}`} data-accent={accentMap[tweaks.accentTone] || 'campo'}>
        <Sidebar
          route={page}
          onNavigate={goto}
          collapsed={collapsed}
          onToggleCollapse={() => setTweak('sidebarCollapsed', !collapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="app-main">
          <Topbar
            crumb={crumbLabel[page]}
            onLogout={() => setAuthed(false)}
            onOpenSidebar={() => setMobileOpen(true)}
            notifications={[
              { icon: Icons.AlertCircle, title: '2 mensalidades vencidas hoje', sub: 'Otávio Rocha · Paulo Henrique', read: false },
              { icon: Icons.Receipt, title: 'Pagamento de Bruno Vasconcellos confirmado', sub: 'há 12 minutos', read: false },
              { icon: Icons.Wallet, title: 'Aluguel da quadra vence em 3 dias', sub: 'R$ 480,00', read: true },
            ]}
          />
          <main className="app-content">
            {page === 'dashboard' && (
              <Dashboard data={data} onNav={goto} onMarkPaid={markPaid} layout={tweaks.dashboardLayout} />
            )}
            {page === 'participantes' && (
              <Participantes data={data} onAdd={addParticipante} onUpdate={updateParticipante} onToggleStatus={toggleParticipante} />
            )}
            {page === 'movimentacoes' && (
              <Movimentacoes
                data={data}
                onMarkPaid={markPaid}
                onAdd={addMov}
                onDelete={deleteMov}
                autoOpen={autoOpenMov}
                onAutoOpenConsumed={() => setAutoOpenMov(false)}
              />
            )}
            {page === 'categorias' && (
              <Categorias data={data} onAdd={addCategoria} onUpdate={updateCategoria} />
            )}
            {page === 'relatorios' && <Relatorios data={data} />}
          </main>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Layout">
          <TweakToggle
            label="Sidebar colapsado"
            value={!!tweaks.sidebarCollapsed}
            onChange={(v) => setTweak('sidebarCollapsed', v)}
            help="Reduz para 64px e mostra só os ícones."
          />
          <TweakRadio
            label="Dashboard"
            value={tweaks.dashboardLayout}
            onChange={(v) => setTweak('dashboardLayout', v as 'cards' | 'list')}
            options={[{ value: 'cards', label: 'Cards' }, { value: 'list', label: 'Lista' }]}
            help="Cards = visão rápida. Lista = densidade contábil."
          />
        </TweakSection>
        <TweakSection title="Identidade">
          <TweakToggle
            label="Pattern do gramado"
            value={!!tweaks.showGramadoPattern}
            onChange={(v) => setTweak('showGramadoPattern', v)}
            help="Listras de campo no card de saldo."
          />
          <TweakColor
            label="Acento"
            value={tweaks.accentTone}
            onChange={(v) => setTweak('accentTone', v)}
            options={['#1A4D2E', '#0E3A52', '#5C2E0E']}
            help="Verde campo, azul institucional, marrom couro."
          />
        </TweakSection>
      </TweaksPanel>
    </ToastProvider>
  );
};

export default App;
