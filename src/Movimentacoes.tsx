import React, { useEffect, useState } from 'react';
import { Icons } from './icons';
import { Button, Confirm, EmptyState, Field, Input, Modal, Money, MoneyInput, Pill, fmtMoney, useToast } from './primitives';
import type { AppData, Movimentacao } from './types';

interface MovimentacoesProps {
  data: AppData;
  onMarkPaid: (id: string) => void;
  onAdd: (mov: { categoriaId: string; participanteId: string | null; valor: number; vencimento: string; obs: string }) => void;
  onDelete: (id: string) => void;
  autoOpen?: boolean;
  onAutoOpenConsumed?: () => void;
}

export const Movimentacoes = ({ data, onMarkPaid, onAdd, onDelete, autoOpen = false, onAutoOpenConsumed }: MovimentacoesProps) => {
  const toast = useToast();
  const [situacao, setSituacao] = useState('todos');
  const [tipo, setTipo] = useState('todos');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [detail, setDetail] = useState<Movimentacao | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; body: string; danger: boolean; confirmLabel: string; action: () => void } | null>(null);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [form, setForm] = useState({
    categoriaId: data.categorias[0]?.id ?? '',
    participanteId: '',
    valor: '120,00',
    vencimento: '20/11/2025',
    obs: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (autoOpen) {
      setModal(true);
      onAutoOpenConsumed?.();
    }
  }, [autoOpen, onAutoOpenConsumed]);

  const list = data.movs.filter((m) => {
    if (situacao !== 'todos' && m.status !== situacao) return false;
    if (tipo !== 'todos' && m.tipo !== tipo) return false;
    if (search) {
      const cat = data.categorias.find((c) => c.id === m.categoriaId);
      const part = data.participantes.find((p) => p.id === m.participanteId);
      const hay = `${cat?.descricao || ''} ${part?.nome || ''} ${m.codigo}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const totalRec = list.filter((m) => m.tipo === 'credit').reduce((s, m) => s + m.valor, 0);
  const totalDes = list.filter((m) => m.tipo === 'debit').reduce((s, m) => s + m.valor, 0);

  const submit = () => {
    const errs: Record<string, string> = {};
    const valor = Number(form.valor.replace(/\./g, '').replace(',', '.'));
    if (!form.categoriaId) errs.categoriaId = 'Escolha uma categoria.';
    if (!valor || valor <= 0) errs.valor = 'Valor inválido.';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.vencimento)) errs.vencimento = 'Formato dd/mm/aaaa.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const cat = data.categorias.find((c) => c.id === form.categoriaId);
    const part = data.participantes.find((p) => p.id === form.participanteId);
    onAdd({
      categoriaId: form.categoriaId,
      participanteId: form.participanteId || null,
      valor,
      vencimento: form.vencimento,
      obs: form.obs,
    });
    toast({
      title: 'Movimentação lançada.',
      sub: `${cat?.descricao}${part ? ` · ${part.nome}` : ''} · R$ ${fmtMoney(valor)}`,
      kind: 'success',
      icon: Icons.Receipt,
    });
    setModal(false);
    setErrors({});
    setForm({ categoriaId: data.categorias[0]?.id ?? '', participanteId: '', valor: '120,00', vencimento: '20/11/2025', obs: '' });
  };

  const markPaid = (id: string) => {
    const m = data.movs.find((x) => x.id === id);
    if (!m) return;
    onMarkPaid(id);
    setFlashId(id);
    setTimeout(() => setFlashId(null), 1200);
    const cat = data.categorias.find((c) => c.id === m.categoriaId);
    const part = data.participantes.find((p) => p.id === m.participanteId);
    toast({
      title: 'Pagamento registrado.',
      sub: `${cat?.descricao}${part ? ` · ${part.nome}` : ''} · R$ ${fmtMoney(m.valor)}`,
      kind: 'success',
      icon: Icons.CheckCircle,
    });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Movimentações</h1>
          <p className="subtitle">Toda entrada e saída do caixa, em ordem.</p>
        </div>
        <div className="actions">
          <Button variant="secondary" icon={Icons.Download}>Exportar</Button>
          <Button icon={Icons.Plus} onClick={() => setModal(true)}>Nova movimentação</Button>
        </div>
      </div>

      <div className="filters">
        <div className="input-group" style={{ minWidth: 260 }}>
          <span className="prefix" style={{ borderRight: 'none' }}><Icons.Search size={14} /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar lançamento, código..." style={{ fontFamily: 'var(--font-sans)' }} />
        </div>
        <select className="input" value={situacao} onChange={(e) => setSituacao(e.target.value)}>
          <option value="todos">Todos os status</option>
          <option value="pago">Pagos</option>
          <option value="pendente">Pendentes</option>
          <option value="vencido">Vencidos</option>
        </select>
        <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="todos">Todos os tipos</option>
          <option value="credit">Receitas</option>
          <option value="debit">Despesas</option>
        </select>
        <span style={{ flex: 1 }}></span>
        <span className="count">{list.length} {list.length === 1 ? 'lançamento' : 'lançamentos'} · +R$ {fmtMoney(totalRec)} / −R$ {fmtMoney(totalDes)}</span>
      </div>

      <div className="table-wrap">
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 70 }}>Cód.</th>
              <th>Descrição</th>
              <th>Vencimento</th>
              <th>Status</th>
              <th className="num">Valor</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((m) => {
              const cat = data.categorias.find((c) => c.id === m.categoriaId);
              const part = data.participantes.find((p) => p.id === m.participanteId);
              return (
                <tr key={m.id} className={flashId === m.id ? 'row-flash' : ''}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>{m.codigo.toString().padStart(4, '0')}</td>
                  <td>
                    <button
                      onClick={() => setDetail(m)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                    >
                      <span className={`badge ${m.tipo}`}>{m.tipo === 'credit' ? 'REC' : 'DESP'}</span>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--ink-900)' }}>{cat?.descricao}</div>
                        {part ? <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{part.nome}</div> : null}
                      </div>
                    </button>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: m.status === 'vencido' ? 'var(--overdue-700)' : 'var(--ink-700)' }}>{m.vencimento}</td>
                  <td>
                    <Pill kind={m.status} celebrate={flashId === m.id}>
                      {m.status === 'pago' ? 'Pago' : m.status === 'pendente' ? 'Pendente' : 'Vencido'}
                    </Pill>
                  </td>
                  <td className="num"><Money value={m.valor} kind={m.tipo} sign /></td>
                  <td>
                    <div className="row-actions">
                      {m.status !== 'pago' ? (
                        <Button variant="secondary" size="sm" icon={Icons.Check} onClick={() => markPaid(m.id)}>Pagar</Button>
                      ) : (
                        <span style={{ color: 'var(--ink-400)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{m.dataPagamento}</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && (
          <EmptyState
            icon={Icons.Wallet}
            title="Sem movimentações."
            body={search || situacao !== 'todos' || tipo !== 'todos' ? 'Nenhum lançamento bate com os filtros.' : 'O caixa do mês começa zerado.'}
            action={<Button size="sm" icon={Icons.Plus} onClick={() => setModal(true)}>Nova movimentação</Button>}
          />
        )}
      </div>

      {/* Nova movimentação modal */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Nova movimentação"
        subtitle="Lance uma entrada ou saída do caixa."
        wide
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={submit}>Lançar</Button>
          </>
        }
      >
        <Field label="Categoria" error={errors.categoriaId}>
          <select className="input" value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })}>
            <optgroup label="Receitas">
              {data.categorias.filter((c) => c.tipo === 'credit').map((c) => (
                <option key={c.id} value={c.id}>{c.descricao}</option>
              ))}
            </optgroup>
            <optgroup label="Despesas">
              {data.categorias.filter((c) => c.tipo === 'debit').map((c) => (
                <option key={c.id} value={c.id}>{c.descricao}</option>
              ))}
            </optgroup>
          </select>
        </Field>
        <Field label="Participante" help="Opcional — só preencha se a movimentação for de um membro específico.">
          <select className="input" value={form.participanteId} onChange={(e) => setForm({ ...form, participanteId: e.target.value })}>
            <option value="">— Nenhum (movimentação do grupo) —</option>
            {data.participantes.filter((p) => p.ativo).map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Valor" error={errors.valor}>
            <MoneyInput value={form.valor} onChange={(v) => setForm({ ...form, valor: v })} error={!!errors.valor} />
          </Field>
          <Field label="Vencimento" error={errors.vencimento}>
            <Input className="money" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} placeholder="dd/mm/aaaa" error={!!errors.vencimento} />
          </Field>
        </div>
        <Field label="Observação">
          <Input value={form.obs} onChange={(e) => setForm({ ...form, obs: e.target.value })} placeholder="Opcional" />
        </Field>
      </Modal>

      {/* Detalhe modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title="Detalhe da movimentação"
        subtitle={detail ? `Código ${detail.codigo.toString().padStart(4, '0')}` : ''}
        footer={
          <>
            {detail?.status !== 'pago' && (
              <Button variant="ghost" className="left" icon={Icons.Trash} onClick={() => {
                setConfirm({
                  title: 'Excluir movimentação?',
                  body: 'Essa ação não pode ser desfeita.',
                  danger: true,
                  confirmLabel: 'Excluir',
                  action: () => { onDelete(detail!.id); setDetail(null); toast({ title: 'Movimentação excluída.', kind: 'success', icon: Icons.Trash }); },
                });
              }}>Excluir</Button>
            )}
            {detail?.status !== 'pago' && (
              <Button icon={Icons.Check} onClick={() => { markPaid(detail!.id); setDetail(null); }}>Marcar como pago</Button>
            )}
            <Button variant={detail?.status === 'pago' ? 'primary' : 'secondary'} onClick={() => setDetail(null)}>Fechar</Button>
          </>
        }
      >
        {detail && (() => {
          const cat = data.categorias.find((c) => c.id === detail.categoriaId);
          const part = data.participantes.find((p) => p.id === detail.participanteId);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: 'var(--paper-200)', borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--ink-500)' }}>Valor</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 6, color: detail.tipo === 'credit' ? 'var(--credit-700)' : 'var(--debit-700)' }}>
                  {detail.tipo === 'credit' ? '+' : '−'}R$ {fmtMoney(detail.valor)}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Pill kind={detail.status}>{detail.status === 'pago' ? 'Pago' : detail.status === 'pendente' ? 'Pendente' : 'Vencido'}</Pill>
                </div>
              </div>
              <DetailRow label="Categoria" value={cat?.descricao} />
              <DetailRow label="Participante" value={part?.nome || <span className="dim">Movimentação do grupo</span>} />
              <DetailRow label="Vencimento" value={detail.vencimento} mono />
              <DetailRow label="Pagamento" value={detail.dataPagamento || <span className="dim">—</span>} mono />
              {detail.obs && <DetailRow label="Observação" value={detail.obs} />}
            </div>
          );
        })()}
      </Modal>

      <Confirm
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.title}
        body={confirm?.body}
        confirmLabel={confirm?.confirmLabel}
        danger={confirm?.danger}
        onConfirm={() => confirm?.action?.()}
      />
    </>
  );
};

const DetailRow = ({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--border-soft)' }}>
    <span style={{ fontSize: 12, color: 'var(--ink-500)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 500, fontFamily: mono ? 'var(--font-mono)' : undefined }}>{value}</span>
  </div>
);
