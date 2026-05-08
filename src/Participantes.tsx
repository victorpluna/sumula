import { useState } from 'react';
import { Icons } from './icons';
import { Avatar, Button, Confirm, EmptyState, Field, Input, Modal, Money, MoneyInput, Pill, useToast } from './primitives';
import type { AppData, Participante } from './types';

interface ParticipantesProps {
  data: AppData;
  onAdd: (data: { nome: string; valorMensal: number }) => void;
  onUpdate: (id: string, patch: { nome: string; valorMensal: number }) => void;
  onToggleStatus: (id: string) => void;
}

export const Participantes = ({ data, onAdd, onUpdate, onToggleStatus }: ParticipantesProps) => {
  const toast = useToast();
  const [filter, setFilter] = useState('ativos');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Participante | null>(null);
  const [confirm, setConfirm] = useState<{ title: string; body: string; confirmLabel: string; danger: boolean; action: () => void } | null>(null);
  const [form, setForm] = useState({ nome: '', valor: '120,00' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const list = data.participantes.filter((p) => {
    if (filter === 'ativos' && !p.ativo) return false;
    if (filter === 'inativos' && p.ativo) return false;
    if (search && !p.nome.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const open = (p: Participante | null) => {
    if (p) {
      setEditing(p);
      setForm({ nome: p.nome, valor: p.valorMensal.toFixed(2).replace('.', ',') });
    } else {
      setEditing(null);
      setForm({ nome: '', valor: '120,00' });
    }
    setErrors({});
    setModal(true);
  };

  const submit = () => {
    const errs: Record<string, string> = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório.';
    const valor = Number(form.valor.replace(/\./g, '').replace(',', '.'));
    if (!valor || valor <= 0) errs.valor = 'Valor inválido.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editing) {
      onUpdate(editing.id, { nome: form.nome.trim(), valorMensal: valor });
      toast({ title: 'Participante atualizado.', sub: form.nome.trim(), kind: 'success', icon: Icons.CheckCircle });
    } else {
      onAdd({ nome: form.nome.trim(), valorMensal: valor });
      toast({ title: 'Participante cadastrado.', sub: `${form.nome.trim()} entrou no time.`, kind: 'success', icon: Icons.User });
    }
    setModal(false);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Participantes</h1>
          <p className="subtitle">{data.participantes.filter((p) => p.ativo).length} ativos · {data.participantes.length} no total</p>
        </div>
        <div className="actions">
          <Button variant="secondary" icon={Icons.Download}>Exportar lista</Button>
          <Button icon={Icons.Plus} onClick={() => open(null)}>Cadastrar participante</Button>
        </div>
      </div>

      <div className="filters">
        <div className="input-group" style={{ minWidth: 280 }}>
          <span className="prefix" style={{ borderRight: 'none' }}><Icons.Search size={14} /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome..." style={{ fontFamily: 'var(--font-sans)' }} />
        </div>
        <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ minWidth: 140 }}>
          <option value="todos">Todos</option>
          <option value="ativos">Ativos</option>
          <option value="inativos">Inativos</option>
        </select>
        <span style={{ flex: 1 }}></span>
        <span className="count">{list.length} {list.length === 1 ? 'participante' : 'participantes'}</span>
      </div>

      <div className="table-wrap">
        <table className="t">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Cód.</th>
              <th>Nome</th>
              <th>Status</th>
              <th>Em aberto</th>
              <th className="num">Mensalidade</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
              const pend = data.movs.filter((m) => m.participanteId === p.id && (m.status === 'pendente' || m.status === 'vencido'));
              const venc = pend.some((m) => m.status === 'vencido');
              return (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-500)' }}>{p.codigo.toString().padStart(3, '0')}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar name={p.nome} />
                      <span style={{ fontWeight: 500 }}>{p.nome}</span>
                    </div>
                  </td>
                  <td><Pill kind={p.ativo ? 'ativo' : 'inativo'}>{p.ativo ? 'Ativo' : 'Inativo'}</Pill></td>
                  <td>
                    {pend.length > 0
                      ? <Pill kind={venc ? 'vencido' : 'pendente'}>{pend.length} cobrança{pend.length !== 1 ? 's' : ''}</Pill>
                      : <span style={{ color: 'var(--ink-400)', fontSize: 13 }}>—</span>}
                  </td>
                  <td className="num"><Money value={p.valorMensal} color={false} /></td>
                  <td>
                    <div className="row-actions">
                      <Button variant="ghost" size="sm" className="btn-icon" onClick={() => open(p)} title="Editar"><Icons.Edit size={14} /></Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="btn-icon"
                        onClick={() => {
                          setConfirm({
                            title: p.ativo ? 'Desativar participante?' : 'Reativar participante?',
                            body: p.ativo
                              ? `${p.nome} não vai gerar cobranças nos próximos meses. O histórico fica preservado.`
                              : `${p.nome} volta a receber cobranças mensais.`,
                            confirmLabel: p.ativo ? 'Desativar' : 'Reativar',
                            danger: p.ativo,
                            action: () => {
                              onToggleStatus(p.id);
                              toast({ title: p.ativo ? 'Participante desativado.' : 'Participante reativado.', sub: p.nome, kind: 'success', icon: p.ativo ? Icons.X : Icons.CheckCircle });
                            },
                          });
                        }}
                        title={p.ativo ? 'Desativar' : 'Reativar'}
                      >
                        {p.ativo ? <Icons.X size={14} /> : <Icons.Check size={14} />}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && (
          <EmptyState
            icon={Icons.Users}
            title="Nenhum participante por aqui."
            body={search ? 'Tente outro termo na busca.' : 'Comece adicionando os mensalistas do seu time.'}
            action={!search ? <Button size="sm" icon={Icons.Plus} onClick={() => open(null)}>Cadastrar participante</Button> : undefined}
          />
        )}
      </div>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Editar participante' : 'Novo participante'}
        subtitle={editing ? 'Atualize os dados do mensalista.' : 'Adicione um mensalista ao grupo.'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={submit}>{editing ? 'Salvar' : 'Cadastrar'}</Button>
          </>
        }
      >
        <Field label="Nome completo" error={errors.nome}>
          <Input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            placeholder="Ex: João Marcelo Souza"
            error={!!errors.nome}
            autoFocus
          />
        </Field>
        <Field label="Mensalidade" help="Valor padrão das cobranças mensais. Pode ser ajustado por lançamento." error={errors.valor}>
          <MoneyInput value={form.valor} onChange={(v) => setForm({ ...form, valor: v })} error={!!errors.valor} />
        </Field>
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
