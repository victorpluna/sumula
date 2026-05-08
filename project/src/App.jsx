// App — root component, state, routing.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "sidebarCollapsed": false,
  "dashboardLayout": "cards",
  "showGramadoPattern": true,
  "accentTone": "#1A4D2E"
}/*EDITMODE-END*/;

const seedData = () => {
  const participantes = [
    { id: "p1", codigo: 1,  nome: "Rafael Maciel",        valorMensal: 120, ativo: true },
    { id: "p2", codigo: 2,  nome: "Lucas Andrade",        valorMensal: 120, ativo: true },
    { id: "p3", codigo: 3,  nome: "Bruno Vasconcellos",   valorMensal: 120, ativo: true },
    { id: "p4", codigo: 4,  nome: "Diego Patrício",       valorMensal: 120, ativo: true },
    { id: "p5", codigo: 5,  nome: "Felipe Tanaka",        valorMensal: 120, ativo: true },
    { id: "p6", codigo: 6,  nome: "Gustavo Mendonça",     valorMensal: 120, ativo: true },
    { id: "p7", codigo: 7,  nome: "Henrique Salim",       valorMensal: 120, ativo: true },
    { id: "p8", codigo: 8,  nome: "Igor Fontana",         valorMensal: 120, ativo: true },
    { id: "p9", codigo: 9,  nome: "João Marcelo Souza",   valorMensal: 120, ativo: true },
    { id: "p10", codigo: 10, nome: "Kauã Ribeiro",        valorMensal: 100, ativo: true },
    { id: "p11", codigo: 11, nome: "Leandro Batista",     valorMensal: 120, ativo: true },
    { id: "p12", codigo: 12, nome: "Marcos Camargo",      valorMensal: 120, ativo: true },
    { id: "p13", codigo: 13, nome: "Nícolas Pereira",     valorMensal: 120, ativo: true },
    { id: "p14", codigo: 14, nome: "Otávio Rocha",        valorMensal: 120, ativo: true },
    { id: "p15", codigo: 15, nome: "Paulo Henrique",      valorMensal: 120, ativo: true },
    { id: "p16", codigo: 16, nome: "Renan Diniz",         valorMensal: 140, ativo: true },
    { id: "p17", codigo: 17, nome: "Tiago Albuquerque",   valorMensal: 120, ativo: true },
    { id: "p18", codigo: 18, nome: "Vinícius Caldas",     valorMensal: 120, ativo: false },
  ];
  const categorias = [
    { id: "c1", codigo: 1, descricao: "Mensalidade",      tipo: "credit", ativo: true },
    { id: "c2", codigo: 2, descricao: "Patrocínio",        tipo: "credit", ativo: true },
    { id: "c3", codigo: 3, descricao: "Venda de uniformes", tipo: "credit", ativo: true },
    { id: "c4", codigo: 4, descricao: "Aluguel da quadra",  tipo: "debit",  ativo: true },
    { id: "c5", codigo: 5, descricao: "Arbitragem",        tipo: "debit",  ativo: true },
    { id: "c6", codigo: 6, descricao: "Bolas e materiais",  tipo: "debit",  ativo: true },
    { id: "c7", codigo: 7, descricao: "Uniformes (compra)", tipo: "debit",  ativo: true },
    { id: "c8", codigo: 8, descricao: "Inscrição em campeonato", tipo: "debit", ativo: true },
  ];

  const movs = [];
  let codigo = 1001;
  // November mensalidades — most paid, a few pending, a couple overdue
  participantes.filter((p) => p.ativo).forEach((p, i) => {
    let status, dataPagamento;
    if (i < 12) { status = "pago"; dataPagamento = `${5 + (i % 10)}/11/2025`.padStart(10, "0"); }
    else if (i < 14) { status = "pendente"; dataPagamento = null; }
    else { status = "vencido"; dataPagamento = null; }
    movs.push({
      id: `m-mens-${p.id}-nov`,
      codigo: codigo++,
      categoriaId: "c1",
      participanteId: p.id,
      tipo: "credit",
      valor: p.valorMensal,
      vencimento: "10/11/2025",
      dataPagamento,
      status,
      obs: "",
    });
  });

  // Patrocínio + venda
  movs.push({ id: "m-pat-nov", codigo: codigo++, categoriaId: "c2", participanteId: null, tipo: "credit", valor: 600, vencimento: "05/11/2025", dataPagamento: "05/11/2025", status: "pago", obs: "Loja do João — outubro" });

  // Despesas Novembro
  movs.push({ id: "m-quadra-nov", codigo: codigo++, categoriaId: "c4", participanteId: null, tipo: "debit", valor: 480, vencimento: "08/11/2025", dataPagamento: "08/11/2025", status: "pago", obs: "Quadra do Brejo — 4 sessões" });
  movs.push({ id: "m-arb-nov", codigo: codigo++, categoriaId: "c5", participanteId: null, tipo: "debit", valor: 180, vencimento: "12/11/2025", dataPagamento: "12/11/2025", status: "pago", obs: "Árbitro Sérgio" });
  movs.push({ id: "m-bola-nov", codigo: codigo++, categoriaId: "c6", participanteId: null, tipo: "debit", valor: 80, vencimento: "20/11/2025", dataPagamento: null, status: "pendente", obs: "Reposição — 2 bolas" });

  // Outubro (paid)
  participantes.filter((p) => p.ativo).slice(0, 16).forEach((p) => {
    movs.push({ id: `m-mens-${p.id}-out`, codigo: codigo++, categoriaId: "c1", participanteId: p.id, tipo: "credit", valor: p.valorMensal, vencimento: "10/10/2025", dataPagamento: `${5 + (p.codigo % 12)}/10/2025`.padStart(10, "0"), status: "pago", obs: "" });
  });
  movs.push({ id: "m-quadra-out", codigo: codigo++, categoriaId: "c4", participanteId: null, tipo: "debit", valor: 460, vencimento: "08/10/2025", dataPagamento: "08/10/2025", status: "pago", obs: "" });
  movs.push({ id: "m-arb-out", codigo: codigo++, categoriaId: "c5", participanteId: null, tipo: "debit", valor: 200, vencimento: "12/10/2025", dataPagamento: "12/10/2025", status: "pago", obs: "" });

  return { participantes, categorias, movs };
};

const App = () => {
  const [authed, setAuthed] = React.useState(false);
  const [page, setPage] = React.useState("dashboard");
  const [data, setData] = React.useState(seedData);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [autoOpenMov, setAutoOpenMov] = React.useState(false);

  const goto = (p, opts = {}) => {
    setPage(p);
    if (opts.openNew && p === "movimentacoes") setAutoOpenMov(true);
  };

  // ---- mutations ----
  const addParticipante = (data2) => setData((d) => {
    const codigo = Math.max(0, ...d.participantes.map((p) => p.codigo)) + 1;
    return { ...d, participantes: [...d.participantes, { id: `p-${Date.now()}`, codigo, ativo: true, ...data2 }] };
  });
  const updateParticipante = (id, patch) => setData((d) => ({ ...d, participantes: d.participantes.map((p) => p.id === id ? { ...p, ...patch } : p) }));
  const toggleParticipante = (id) => setData((d) => ({ ...d, participantes: d.participantes.map((p) => p.id === id ? { ...p, ativo: !p.ativo } : p) }));

  const addCategoria = (data2) => setData((d) => {
    const codigo = Math.max(0, ...d.categorias.map((c) => c.codigo)) + 1;
    return { ...d, categorias: [...d.categorias, { id: `c-${Date.now()}`, codigo, ativo: true, ...data2 }] };
  });
  const updateCategoria = (id, patch) => setData((d) => ({ ...d, categorias: d.categorias.map((c) => c.id === id ? { ...c, ...patch } : c) }));

  const markPaid = (id) => setData((d) => ({
    ...d,
    movs: d.movs.map((m) => m.id === id ? { ...m, status: "pago", dataPagamento: "08/11/2025" } : m),
  }));
  const addMov = (mov) => setData((d) => {
    const cat = d.categorias.find((c) => c.id === mov.categoriaId);
    const codigo = Math.max(0, ...d.movs.map((m) => m.codigo)) + 1;
    return {
      ...d,
      movs: [
        {
          id: `m-${Date.now()}`,
          codigo,
          tipo: cat.tipo,
          status: "pendente",
          dataPagamento: null,
          ...mov,
        },
        ...d.movs,
      ],
    };
  });
  const deleteMov = (id) => setData((d) => ({ ...d, movs: d.movs.filter((m) => m.id !== id) }));

  if (!authed) {
    return (
      <ToastProvider>
        <Login onLogin={() => setAuthed(true)}/>
      </ToastProvider>
    );
  }

  const collapsed = !!tweaks.sidebarCollapsed;

  return (
    <ToastProvider>
      <div className={`app-shell ${collapsed ? "collapsed" : ""}`} data-accent={accentMap[tweaks.accentTone] || "campo"}>
        <Sidebar route={page} onNavigate={goto} collapsed={collapsed} onToggleCollapse={() => setTweak("sidebarCollapsed", !collapsed)}/>
        <div className="main">
          <Topbar
            crumb={crumbLabel(page)}
            onLogout={() => setAuthed(false)}
            notifications={[
              { icon: I.AlertCircle, title: "2 mensalidades vencidas hoje", sub: "Otávio Rocha · Paulo Henrique", read: false },
              { icon: I.Receipt, title: "Pagamento de Bruno Vasconcellos confirmado", sub: "há 12 minutos", read: false },
              { icon: I.Wallet, title: "Aluguel da quadra vence em 3 dias", sub: "R$ 480,00", read: true },
            ]}
          />
          <main className="content" data-screen-label={pageLabel(page)}>
            {page === "dashboard" && (
              <Dashboard data={data} onNav={goto} onMarkPaid={markPaid} layout={tweaks.dashboardLayout} showGramado={tweaks.showGramadoPattern}/>
            )}
            {page === "participantes" && (
              <Participantes data={data} onAdd={addParticipante} onUpdate={updateParticipante} onToggleStatus={toggleParticipante}/>
            )}
            {page === "movimentacoes" && (
              <Movimentacoes
                data={data}
                onMarkPaid={markPaid}
                onAdd={addMov}
                onDelete={deleteMov}
                autoOpen={autoOpenMov}
                onAutoOpenConsumed={() => setAutoOpenMov(false)}
              />
            )}
            {page === "categorias" && (
              <Categorias data={data} onAdd={addCategoria} onUpdate={updateCategoria}/>
            )}
            {page === "relatorios" && <Relatorios data={data}/>}
          </main>
        </div>
      </div>

      <SumulaTweaks tweaks={tweaks} setTweak={setTweak}/>
    </ToastProvider>
  );
};

const pageLabel = (p) => ({
  dashboard: "01 Dashboard",
  participantes: "02 Participantes",
  movimentacoes: "03 Movimentações",
  categorias: "04 Categorias",
  relatorios: "05 Relatórios",
}[p] || p);

const crumbLabel = (p) => ({
  dashboard: "Dashboard",
  participantes: "Participantes",
  movimentacoes: "Movimentações",
  categorias: "Categorias",
  relatorios: "Relatórios",
}[p] || p);

const SumulaTweaks = ({ tweaks, setTweak }) => (
  <TweaksPanel title="Tweaks">
    <TweakSection title="Layout">
      <TweakToggle label="Sidebar colapsado" value={!!tweaks.sidebarCollapsed} onChange={(v) => setTweak("sidebarCollapsed", v)} help="Reduz para 64px e mostra só os ícones."/>
      <TweakRadio
        label="Dashboard"
        value={tweaks.dashboardLayout}
        onChange={(v) => setTweak("dashboardLayout", v)}
        options={[{ value: "cards", label: "Cards" }, { value: "list", label: "Lista" }]}
        help="Cards = visão rápida. Lista = densidade contábil."
      />
    </TweakSection>
    <TweakSection title="Identidade">
      <TweakToggle label="Pattern do gramado" value={!!tweaks.showGramadoPattern} onChange={(v) => setTweak("showGramadoPattern", v)} help="Listras de campo no card de saldo."/>
      <TweakColor
        label="Acento"
        value={tweaks.accentTone}
        onChange={(v) => setTweak("accentTone", v)}
        options={["#1A4D2E", "#0E3A52", "#5C2E0E"]}
        help="Verde campo, azul institucional, marrom couro."
      />
    </TweakSection>
  </TweaksPanel>
);

const accentMap = {
  "#1A4D2E": "campo",
  "#0E3A52": "azul",
  "#5C2E0E": "couro",
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
