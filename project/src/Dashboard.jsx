// Dashboard — admin overview with cards or list layout.

const monthsBack = [
  { m: "jun", c: 1200, d: 480 },
  { m: "jul", c: 1280, d: 520 },
  { m: "ago", c: 1320, d: 560 },
  { m: "set", c: 1640, d: 720 },
  { m: "out", c: 1720, d: 660 },
  { m: "nov", c: 1840, d: 740 },
];

const Dashboard = ({ data, layout = "cards", onNavigate, onMarkPaid }) => {
  const recebido = data.movs.filter((m) => m.tipo === "credit" && m.status === "pago").reduce((s, m) => s + m.valor, 0);
  const pendente = data.movs.filter((m) => m.status === "pendente" || m.status === "vencido").reduce((s, m) => s + m.valor, 0);
  const despesas = data.movs.filter((m) => m.tipo === "debit" && m.status === "pago").reduce((s, m) => s + m.valor, 0);
  const saldo = recebido - despesas;
  const inadimplentes = new Set(
    data.movs.filter((m) => (m.status === "pendente" || m.status === "vencido") && m.participanteId).map((m) => m.participanteId)
  ).size;
  const proximos = data.movs
    .filter((m) => m.status === "pendente" || m.status === "vencido")
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento))
    .slice(0, 5);
  const ultimas = data.movs
    .filter((m) => m.status === "pago")
    .slice(-5)
    .reverse();

  const chartMax = Math.max(...monthsBack.map((c) => Math.max(c.c, c.d))) * 1.1;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Olá, Carlos.</h1>
          <p className="subtitle">Aqui está o caixa do Real Vila Mariana FC — novembro de 2025.</p>
        </div>
        <div className="actions">
          <Button variant="secondary" icon={I.Download}>Exportar mês</Button>
          <Button icon={I.Plus} onClick={() => onNavigate?.("movimentacoes", { newMov: true })}>Nova movimentação</Button>
        </div>
      </div>

      {layout === "cards" ? (
        <DashCardsLayout data={data} stats={{ recebido, pendente, despesas, saldo, inadimplentes }} chartMax={chartMax} proximos={proximos} ultimas={ultimas} onMarkPaid={onMarkPaid}/>
      ) : (
        <DashListLayout data={data} stats={{ recebido, pendente, despesas, saldo, inadimplentes }} chartMax={chartMax} proximos={proximos} ultimas={ultimas} onMarkPaid={onMarkPaid}/>
      )}
    </>
  );
};

// ----- CARDS LAYOUT -----
const DashCardsLayout = ({ data, stats, chartMax, proximos, ultimas, onMarkPaid }) => {
  const { recebido, pendente, despesas, saldo, inadimplentes } = stats;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        <StatCard
          brand
          label="Saldo do mês"
          value={<><span className="currency">R$</span>{fmtMoney(saldo)}</>}
          sub={<><I.TrendUp size={12}/>+12,4% vs. outubro</>}
        />
        <StatCard
          label="Recebido"
          value={<><span className="currency">R$</span>{fmtMoney(recebido)}</>}
          sub={`${data.movs.filter((m) => m.tipo === "credit" && m.status === "pago").length} entradas`}
        />
        <StatCard
          danger
          label="Pendente"
          value={<><span className="currency">R$</span>{fmtMoney(pendente)}</>}
          sub={`${inadimplentes} mensalista${inadimplentes !== 1 ? "s" : ""} em aberto`}
        />
        <StatCard
          label="Despesas"
          value={<><span className="currency">R$</span>{fmtMoney(despesas)}</>}
          sub={`${data.movs.filter((m) => m.tipo === "debit").length} lançamentos`}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, marginBottom: 16 }}>
        <ChartCard chartMax={chartMax}/>
        <ProximosCard items={proximos} data={data} onMarkPaid={onMarkPaid}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <UltimasCard items={ultimas} data={data}/>
        <InadimplentesCard data={data}/>
      </div>
    </>
  );
};

// ----- LIST LAYOUT (alt) -----
const DashListLayout = ({ data, stats, chartMax, proximos, ultimas, onMarkPaid }) => {
  const { recebido, pendente, despesas, saldo, inadimplentes } = stats;
  const totalIn = recebido + pendente;
  const total = recebido + despesas;

  return (
    <>
      <div className="hero-card">
        <div className="hero-grid">
          <div>
            <div className="hero-label">Saldo do mês · novembro</div>
            <div className="hero-num"><span className="currency">R$</span>{fmtMoney(saldo)}</div>
            <div className="hero-trend"><I.TrendUp size={14}/>+12,4% vs. outubro</div>
          </div>
          <div>
            <div className="hero-mini-label">Recebido</div>
            <div className="hero-mini-value">R$ {fmtMoney(recebido)}</div>
            <div className="hero-mini-sub">{Math.round((recebido / (totalIn || 1)) * 100)}% das mensalidades</div>
          </div>
          <div>
            <div className="hero-mini-label">Pendente</div>
            <div className="hero-mini-value" style={{ color: "var(--ouro-300)" }}>R$ {fmtMoney(pendente)}</div>
            <div className="hero-mini-sub">{inadimplentes} mensalista{inadimplentes !== 1 ? "s" : ""}</div>
          </div>
          <div>
            <div className="hero-mini-label">Despesas</div>
            <div className="hero-mini-value">R$ {fmtMoney(despesas)}</div>
            <div className="hero-mini-sub">{data.movs.filter((m) => m.tipo === "debit").length} saídas</div>
          </div>
        </div>
      </div>

      <div className="card card-pad-0" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h3>Distribuição do mês</h3>
          <span className="meta">novembro 2025</span>
        </div>
        <div>
          <div className="dash-list-row">
            <div>
              <div className="lr-label">Recebido</div>
              <div className="lr-sub">{data.movs.filter((m) => m.tipo === "credit" && m.status === "pago").length} entradas</div>
            </div>
            <div>
              <div className="lr-bar"><div className="lr-bar-fill" style={{ width: `${(recebido / total) * 100}%` }}></div></div>
            </div>
            <div className="lr-value money-credit" style={{ textAlign: "right" }}>+R$ {fmtMoney(recebido)}</div>
          </div>
          <div className="dash-list-row">
            <div>
              <div className="lr-label">Pendente</div>
              <div className="lr-sub">{inadimplentes} em aberto</div>
            </div>
            <div>
              <div className="lr-bar"><div className="lr-bar-fill pending" style={{ width: `${(pendente / total) * 100}%` }}></div></div>
            </div>
            <div className="lr-value" style={{ color: "var(--pending-700)", textAlign: "right" }}>R$ {fmtMoney(pendente)}</div>
          </div>
          <div className="dash-list-row">
            <div>
              <div className="lr-label">Despesas</div>
              <div className="lr-sub">{data.movs.filter((m) => m.tipo === "debit").length} saídas</div>
            </div>
            <div>
              <div className="lr-bar"><div className="lr-bar-fill debit" style={{ width: `${(despesas / total) * 100}%` }}></div></div>
            </div>
            <div className="lr-value money-debit" style={{ textAlign: "right" }}>−R$ {fmtMoney(despesas)}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        <ChartCard chartMax={chartMax}/>
        <ProximosCard items={proximos} data={data} onMarkPaid={onMarkPaid}/>
      </div>
    </>
  );
};

// ----- Sub-cards -----
const ChartCard = ({ chartMax }) => (
  <div className="card card-pad-0">
    <div className="card-header">
      <h3>Receitas × despesas</h3>
      <span className="meta">Últimos 6 meses</span>
    </div>
    <div className="card-body" style={{ paddingTop: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 200, padding: "0 4px" }}>
        {monthsBack.map((c) => (
          <div key={c.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 160 }}>
              <div title={`Receitas: R$ ${fmtMoney(c.c)}`} style={{ width: 18, height: `${(c.c / chartMax) * 160}px`, background: "var(--campo-500)", borderRadius: "4px 4px 0 0", transition: "height 280ms" }}/>
              <div title={`Despesas: R$ ${fmtMoney(c.d)}`} style={{ width: 18, height: `${(c.d / chartMax) * 160}px`, background: "var(--debit-500)", opacity: 0.9, borderRadius: "4px 4px 0 0", transition: "height 280ms" }}/>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.m}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border-soft)", fontSize: 12, color: "var(--ink-500)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, background: "var(--campo-500)", borderRadius: 2 }}/>Receitas</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 10, height: 10, background: "var(--debit-500)", opacity: 0.9, borderRadius: 2 }}/>Despesas</span>
        <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)" }}>Saldo médio: R$ 1.000,00</span>
      </div>
    </div>
  </div>
);

const ProximosCard = ({ items, data, onMarkPaid }) => (
  <div className="card card-pad-0">
    <div className="card-header">
      <h3>Próximos vencimentos</h3>
      <span className="meta">{items.length} em aberto</span>
    </div>
    <div>
      {items.map((m, i) => {
        const part = data.participantes.find((p) => p.id === m.participanteId);
        const cat = data.categorias.find((c) => c.id === m.categoriaId);
        return (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < items.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
            <Avatar name={part ? part.nome : (cat ? cat.descricao : "?")} kind={part ? "campo" : "paper"}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{part ? part.nome : cat?.descricao}</div>
              <div style={{ fontSize: 12, color: m.status === "vencido" ? "var(--overdue-700)" : "var(--ink-500)" }}>
                {cat?.descricao} · {m.status === "vencido" ? "venceu " : "vence "}{m.vencimento}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Money value={m.valor}/>
              <button className="btn-inline" onClick={() => onMarkPaid?.(m.id)} title="Marcar como pago">
                <I.Check/>
              </button>
            </div>
          </div>
        );
      })}
      {items.length === 0 && <EmptyState icon={I.CheckCircle} title="Tudo em dia." body="Nenhuma cobrança em aberto."/>}
    </div>
  </div>
);

const UltimasCard = ({ items, data }) => (
  <div className="card card-pad-0">
    <div className="card-header">
      <h3>Últimos pagamentos</h3>
      <span className="meta">{items.length} registrados</span>
    </div>
    <div>
      {items.map((m, i) => {
        const part = data.participantes.find((p) => p.id === m.participanteId);
        const cat = data.categorias.find((c) => c.id === m.categoriaId);
        return (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < items.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--credit-50)", color: "var(--credit-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <I.Check size={14}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{part ? part.nome : cat?.descricao}</div>
              <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{cat?.descricao} · pago {m.dataPagamento}</div>
            </div>
            <Money value={m.valor} kind={m.tipo} sign/>
          </div>
        );
      })}
    </div>
  </div>
);

const InadimplentesCard = ({ data }) => {
  const inadimplentes = data.participantes.filter((p) =>
    data.movs.some((m) => m.participanteId === p.id && (m.status === "pendente" || m.status === "vencido"))
  );
  return (
    <div className="card card-pad-0">
      <div className="card-header">
        <h3>Inadimplência</h3>
        <span className="meta">{inadimplentes.length} mensalista{inadimplentes.length !== 1 ? "s" : ""}</span>
      </div>
      <div>
        {inadimplentes.map((p, i) => {
          const items = data.movs.filter((m) => m.participanteId === p.id && (m.status === "pendente" || m.status === "vencido"));
          const total = items.reduce((s, m) => s + m.valor, 0);
          const venc = items.some((m) => m.status === "vencido");
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < inadimplentes.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
              <Avatar name={p.nome}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.nome}</div>
                <div style={{ fontSize: 12, color: "var(--ink-500)" }}>{items.length} cobrança{items.length !== 1 ? "s" : ""} · {venc ? "tem vencida" : "no prazo"}</div>
              </div>
              <Money value={total} kind="debit"/>
            </div>
          );
        })}
        {inadimplentes.length === 0 && <EmptyState icon={I.Trophy} title="Time inteiro em dia." body="Nenhum mensalista atrasado este mês."/>}
      </div>
    </div>
  );
};

window.Dashboard = Dashboard;
