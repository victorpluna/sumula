import { useState } from 'react';
import { Icons } from './icons';
import { Button, EmptyState, Field, Input, Modal, useToast } from './primitives';
import type { AppData, Categoria } from './types';

interface CategoriasProps {
  data: AppData;
  onAdd: (data: { descricao: string; tipo: 'credit' | 'debit' }) => void;
  onUpdate: (id: string, patch: { descricao: string; tipo: 'credit' | 'debit' }) => void;
}

export const Categorias = ({ data, onAdd, onUpdate }: CategoriasProps) => {
  const toast = useToast();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [form, setForm] = useState<{ descricao: string; tipo: 'credit' | 'debit' }>({ descricao: '', tipo: 'credit' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');

  const filter = (c: Categoria) => !search || c.descricao.toLowerCase().includes(search.toLowerCase());
  const creditos = data.categorias.filter((c) => c.tipo === 'credit').filter(filter);
  const debitos = data.categorias.filter((c) => c.tipo === 'debit').filter(filter);

  const open = (c: Categoria | null) => {
    if (c) {
      setEditing(c);
      setForm({ descricao: c.descricao, tipo: c.tipo });
    } else {
      setEditing(null);
      setForm({ descricao: '', tipo: 'credit' });
    }
    setErrors({});
    setModal(true);
  };

  const submit = () => {
    const errs: Record<string, string> = {};
    if (!form.descricao.trim()) errs.descricao = 'Descrição é obrigatória.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (editing) {
      onUpdate(editing.id, { descricao: form.descricao.trim(), tipo: form.tipo });
      toast({ title: 'Categoria atualizada.', sub: form.descricao.trim(), kind: 'success', icon: Icons.CheckCircle });
    } else {
      onAdd({ descricao: form.descricao.trim(), tipo: form.tipo });
      toast({ title: 'Categoria criada.', sub: `${form.descricao.trim()} (${form.tipo === 'credit' ? 'receita' : 'despesa'})`, kind: 'success', icon: Icons.Layers });
    }
    setModal(false);
  };

  const Section = ({ title, items, kind, hint }: { title: string; items: Categoria[]; kind: 'credit' | 'debit'; hint: string }) => (
    <div className="card card-pad-0">
      <div className="card-header">
        <div>
          <h3>{title}</h3>
          <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 2 }}>{hint}</div>
        </div>
        <span className="meta">{items.length} {items.length === 1 ? 'categoria' : 'categorias'}</span>
      </div>
      <div>
        {items.map((c, i) => {
          const used = data.movs.filter((m) => m.categoriaId === c.id).length;
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: i < items.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-500)', width: 36 }}>{c.codigo.toString().padStart(3, '0')}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: 'var(--ink-900)' }}>{c.descricao}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>
                  {used > 0 ? `${used} lançamento${used !== 1 ? 's' : ''} vinculado${used !== 1 ? 's' : ''}` : 'sem lançamentos'}
                </div>
              </div>
              <span className={`badge ${kind}`}>{kind === 'credit' ? 'RECEITA' : 'DESPESA'}</span>
              <Button variant="ghost" size="sm" className="btn-icon" onClick={() => open(c)} title="Editar"><Icons.Edit size={14} /></Button>
            </div>
          );
        })}
        {items.length === 0 && (
          <EmptyState
            icon={Icons.Layers}
            title={search ? 'Nenhuma categoria encontrada.' : `Sem categorias de ${kind === 'credit' ? 'receita' : 'despesa'}.`}
            body={search ? 'Tente outra busca.' : undefined}
          />
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Categorias</h1>
          <p className="subtitle">Os tipos de movimentação que aparecem nos lançamentos.</p>
        </div>
        <div className="actions">
          <Button icon={Icons.Plus} onClick={() => open(null)}>Nova categoria</Button>
        </div>
      </div>

      <div className="filters">
        <div className="input-group" style={{ minWidth: 280 }}>
          <span className="prefix" style={{ borderRight: 'none' }}><Icons.Search size={14} /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar categoria..." style={{ fontFamily: 'var(--font-sans)' }} />
        </div>
        <span style={{ flex: 1 }}></span>
        <span className="count">{data.categorias.length} categorias no total</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Section title="Receitas" items={creditos} kind="credit" hint="Mensalidades, patrocínios, vendas." />
        <Section title="Despesas" items={debitos} kind="debit" hint="Aluguel da quadra, arbitragem, uniformes." />
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Editar categoria' : 'Nova categoria'}
        subtitle={editing ? 'Atualize o tipo de movimentação.' : 'Crie um novo tipo de receita ou despesa.'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={submit}>{editing ? 'Salvar' : 'Criar'}</Button>
          </>
        }
      >
        <Field label="Descrição" error={errors.descricao}>
          <Input
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            placeholder="Ex: Aluguel da quadra"
            error={!!errors.descricao}
            autoFocus
          />
        </Field>
        <Field label="Tipo">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {([
              { v: 'credit' as const, label: 'Receita', help: 'entra no caixa' },
              { v: 'debit' as const, label: 'Despesa', help: 'sai do caixa' },
            ] as const).map((opt) => {
              const active = form.tipo === opt.v;
              return (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setForm({ ...form, tipo: opt.v })}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${active ? 'var(--campo-500)' : 'var(--border)'}`,
                    background: active ? 'var(--campo-50)' : 'var(--paper-0)',
                    color: active ? 'var(--campo-700)' : 'var(--ink-700)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: active ? 'var(--ring-focus)' : 'none',
                    transition: 'all var(--dur-fast)',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {opt.v === 'credit' ? <Icons.TrendUp size={14} /> : <Icons.TrendDown size={14} />}{opt.label}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{opt.help}</div>
                </button>
              );
            })}
          </div>
        </Field>
      </Modal>
    </>
  );
};
