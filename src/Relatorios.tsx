import { useState } from 'react';
import { Icons } from './icons';
import { Avatar, Button, EmptyState, Pill, StatCard, fmtMoney, Money } from './primitives';
import type { AppData } from './types';

interface RelatoriosProps {
  data: AppData;
}

export const Relatorios = ({ data }: RelatoriosProps) => {
  const [tab, setTab] = useState('geral');
  const [extratoId, setExtratoId] = useState<string | null>(null);

  const recebido = data.movs.filter((m) => m.tipo === 'credit' && m.status === 'pago').reduce((s, m) => s + m.valor, 0);
  const despesas = data.movs.filter((m) => m.tipo === 'debit' && m.status === 'pago').reduce((s, m) => s + m.valor, 0);
  const saldo = recebido - despesas;
  const pendente = data.movs.filter((m) => m.status === 'pendente' || m.status === 'vencido').reduce((s, m) => s + m.valor, 0);

  const inadimplentes = data.participantes.filter((p) =>
    data.movs.some((m) => m.participanteId === p.id && (m.status === 'pendente' || m.status === 'vencido'))
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Relatórios</h1>
          <p className="subtitle">A prestação de contas do time, em uma página.</p>
        </div>
        <div className="actions">
          <Button variant="secondary" icon={Icons.Print}>Imprimir</Button>
          <Button variant="secondary" icon={Icons.Download}>Baixar PDF</Button>
        </div>
      </div>

      <div className="tabs">
        {[
          { id: 'geral', label: 'Financeiro geral' },
          { id: 'inad', label: 'Inadimplência' },
          { id: 'fluxo', label: 'Fluxo mensal' },
          { id: 'extrato', label: 'Extrato por participante' },
        ].map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === 'geral' && <RelGeral recebido={recebido} despesas={despesas} saldo={saldo} pendente={pendente} data={data} />}
      {tab === 'inad' && <RelInadimplencia data={data} inadimplentes={inadimplentes} onExtrato={(id) => { setExtratoId(id); setTab('extrato'); }} />}
      {tab === 'fluxo' && <RelFluxo />}
      {tab === 'extrato' && <RelExtrato data={data} selectedId={extratoId} onSelect={setExtratoId} />}
    </>
  );
};

const RelGeral = ({ recebido, despesas, saldo, pendente, data }: { recebido: number; despesas: number; saldo: number; pendente: number; data: AppData }) => (
  <>
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
      <StatCard brand label="Saldo acumulado" value={<><span className="currency">R$</span>{fmtMoney(saldo)}</>} sub="Caixa atual" />
      <StatCard label="Total recebido" value={<><span className="currency">R$</span>{fmtMoney(recebido)}</>} sub="Acumulado em 2025" />
      <StatCard label="Total despesas" value={<><span className="currency">R$</span>{fmtMoney(despesas)}</>} sub={`${data.movs.filter((m) => m.tipo === 'debit').length} saídas`} />
      <StatCard danger label="Em aberto" value={<><span className="currency">R$</span>{fmtMoney(pendente)}</>} sub="Pendente + vencido" />
    </div>

    <div className="card card-pad-0">
      <div className="card-header">
        <h3>Resumo do período</h3>
        <span className="meta">Janeiro a novembro de 2025</span>
      </div>
      <table className="t">
        <thead>
          <tr>
            <th>Linha</th>
            <th className="num">Valor</th>
            <th className="num">% do caixa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Receitas operacionais</strong><div style={{ fontSize: 12, color: 'var(--ink-500)' }}>Mensalidades, patrocínios, vendas</div></td>
            <td className="num money-credit">+R$ {fmtMoney(recebido)}</td>
            <td className="num">100,0%</td>
          </tr>
          <tr>
            <td>(−) Despesas operacionais<div style={{ fontSize: 12, color: 'var(--ink-500)' }}>Quadra, arbitragem, materiais</div></td>
            <td className="num money-debit">−R$ {fmtMoney(despesas)}</td>
            <td className="num">{((despesas / recebido) * 100).toFixed(1)}%</td>
          </tr>
          <tr style={{ background: 'var(--paper-50)' }}>
            <td><strong>= Saldo do período</strong></td>
            <td className="num" style={{ fontWeight: 700, fontSize: 16 }}>R$ {fmtMoney(saldo)}</td>
            <td className="num"><strong>{((saldo / recebido) * 100).toFixed(1)}%</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
);

const RelInadimplencia = ({ data, inadimplentes, onExtrato }: { data: AppData; inadimplentes: AppData['participantes']; onExtrato: (id: string) => void }) => {
  const totalAberto = inadimplentes.reduce((s, p) => {
    const items = data.movs.filter((m) => m.participanteId === p.id && (m.status === 'pendente' || m.status === 'vencido'));
    return s + items.reduce((ss, m) => ss + m.valor, 0);
  }, 0);
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <StatCard label="Em aberto" danger value={<><span className="currency">R$</span>{fmtMoney(totalAberto)}</>} sub={`${inadimplentes.length} mensalistas`} />
        <StatCard label="Mensalistas em dia" value={String(data.participantes.filter((p) => p.ativo && !data.movs.some((m) => m.participanteId === p.id && (m.status === 'pendente' || m.status === 'vencido'))).length)} sub={`de ${data.participantes.filter((p) => p.ativo).length} ativos`} />
        <StatCard label="Taxa de adimplência" value={`${Math.round((1 - inadimplentes.length / Math.max(1, data.participantes.filter((p) => p.ativo).length)) * 100)}%`} sub="Mês corrente" />
      </div>

      <div className="table-wrap">
        <table className="t">
          <thead>
            <tr>
              <th>Participante</th>
              <th>Status</th>
              <th>Em aberto</th>
              <th>Mais antigo</th>
              <th className="num">Total devido</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {inadimplentes.map((p) => {
              const items = data.movs.filter((m) => m.participanteId === p.id && (m.status === 'pendente' || m.status === 'vencido'));
              const total = items.reduce((s, m) => s + m.valor, 0);
              const venc = items.some((m) => m.status === 'vencido');
              const oldest = [...items].sort((a, b) => a.vencimento.localeCompare(b.vencimento))[0];
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={p.nome} />
                      <span style={{ fontWeight: 500 }}>{p.nome}</span>
                    </div>
                  </td>
                  <td><Pill kind={venc ? 'vencido' : 'pendente'}>{venc ? 'Vencido' : 'Pendente'}</Pill></td>
                  <td>{items.length} cobrança{items.length !== 1 ? 's' : ''}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-700)' }}>{oldest?.vencimento}</td>
                  <td className="num money-debit">R$ {fmtMoney(total)}</td>
                  <td>
                    <Button variant="ghost" size="sm" iconRight={Icons.ChevronRight} onClick={() => onExtrato(p.id)}>Extrato</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {inadimplentes.length === 0 && <EmptyState icon={Icons.Trophy} title="Time inteiro em dia." body="Todos os mensalistas estão quites." />}
      </div>
    </>
  );
};

const RelFluxo = () => (
  <div className="card card-pad-0">
    <div className="card-header">
      <h3>Fluxo mensal — 2025</h3>
      <span className="meta">entradas e saídas mês a mês</span>
    </div>
    <table className="t">
      <thead>
        <tr>
          <th>Mês</th>
          <th className="num">Receitas</th>
          <th className="num">Despesas</th>
          <th className="num">Saldo do mês</th>
          <th className="num">Acumulado</th>
        </tr>
      </thead>
      <tbody>
        {(() => {
          const rows = [
            { m: 'Junho',    c: 1200, d: 480 },
            { m: 'Julho',    c: 1280, d: 520 },
            { m: 'Agosto',   c: 1320, d: 560 },
            { m: 'Setembro', c: 1640, d: 720 },
            { m: 'Outubro',  c: 1720, d: 660 },
            { m: 'Novembro', c: 1840, d: 740 },
          ];
          let acc = 0;
          return rows.map((r) => {
            const sal = r.c - r.d;
            acc += sal;
            return (
              <tr key={r.m}>
                <td style={{ fontWeight: 500 }}>{r.m}</td>
                <td className="num money-credit">+R$ {fmtMoney(r.c)}</td>
                <td className="num money-debit">−R$ {fmtMoney(r.d)}</td>
                <td className="num" style={{ fontWeight: 600 }}>R$ {fmtMoney(sal)}</td>
                <td className="num" style={{ color: 'var(--ink-500)' }}>R$ {fmtMoney(acc)}</td>
              </tr>
            );
          });
        })()}
      </tbody>
      <tfoot>
        <tr style={{ background: 'var(--paper-50)' }}>
          <td style={{ fontWeight: 700, padding: '14px 16px', borderTop: '1px solid var(--border)' }}>Total</td>
          <td className="num money-credit" style={{ fontWeight: 700, padding: '14px 16px', borderTop: '1px solid var(--border)' }}>+R$ 9.000,00</td>
          <td className="num money-debit" style={{ fontWeight: 700, padding: '14px 16px', borderTop: '1px solid var(--border)' }}>−R$ 3.680,00</td>
          <td className="num" style={{ fontWeight: 700, padding: '14px 16px', borderTop: '1px solid var(--border)' }}>R$ 5.320,00</td>
          <td style={{ borderTop: '1px solid var(--border)' }}></td>
        </tr>
      </tfoot>
    </table>
  </div>
);

const RelExtrato = ({ data, selectedId, onSelect }: { data: AppData; selectedId: string | null; onSelect: (id: string) => void }) => {
  const id = selectedId || data.participantes[0]?.id;
  const p = data.participantes.find((x) => x.id === id);
  const items = data.movs.filter((m) => m.participanteId === id);
  const pago = items.filter((m) => m.status === 'pago').reduce((s, m) => s + m.valor, 0);
  const aberto = items.filter((m) => m.status !== 'pago').reduce((s, m) => s + m.valor, 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
      <div className="card card-pad-0" style={{ alignSelf: 'start' }}>
        <div className="card-header"><h3>Mensalistas</h3></div>
        <div style={{ maxHeight: 480, overflowY: 'auto' }}>
          {data.participantes.map((part, i) => (
            <button
              key={part.id}
              onClick={() => onSelect(part.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 16px',
                background: id === part.id ? 'var(--campo-50)' : 'transparent',
                color: id === part.id ? 'var(--campo-700)' : 'var(--ink-900)',
                border: 'none',
                borderBottom: i < data.participantes.length - 1 ? '1px solid var(--border-soft)' : 'none',
                cursor: 'pointer',
                fontWeight: id === part.id ? 600 : 500,
                fontSize: 13,
                textAlign: 'left',
              }}
            >
              <Avatar name={part.nome} size={24} />
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{part.nome}</span>
              {id === part.id && <Icons.ChevronRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      <div>
        {p && (
          <>
            <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 20 }}>
              <Avatar name={p.nome} size={56} />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 22 }}>{p.nome}</h2>
                <div style={{ fontSize: 13, color: 'var(--ink-500)', marginTop: 2 }}>
                  Código {p.codigo.toString().padStart(3, '0')} · mensalidade R$ {fmtMoney(p.valorMensal)} · {p.ativo ? 'ativo' : 'inativo'}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Pago</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: 'var(--credit-700)' }}>R$ {fmtMoney(pago)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--ink-500)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Em aberto</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: aberto > 0 ? 'var(--pending-700)' : 'var(--ink-500)' }}>R$ {fmtMoney(aberto)}</div>
                </div>
              </div>
            </div>

            <div className="card card-pad-0">
              <div className="card-header">
                <h3>Histórico de pagamentos</h3>
                <span className="meta">{items.length} lançamentos</span>
              </div>
              <table className="t">
                <thead>
                  <tr>
                    <th>Cód.</th>
                    <th>Categoria</th>
                    <th>Vencimento</th>
                    <th>Pagamento</th>
                    <th>Status</th>
                    <th className="num">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((m) => {
                    const cat = data.categorias.find((c) => c.id === m.categoriaId);
                    return (
                      <tr key={m.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>{m.codigo.toString().padStart(4, '0')}</td>
                        <td>{cat?.descricao}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{m.vencimento}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: m.dataPagamento ? 'var(--ink-700)' : 'var(--ink-400)' }}>{m.dataPagamento || '—'}</td>
                        <td><Pill kind={m.status}>{m.status === 'pago' ? 'Pago' : m.status === 'pendente' ? 'Pendente' : 'Vencido'}</Pill></td>
                        <td className="num"><Money value={m.valor} kind={m.tipo} sign /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {items.length === 0 && <EmptyState icon={Icons.Receipt} title="Sem histórico." body="Esse mensalista ainda não tem lançamentos." />}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
