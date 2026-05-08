import type { AppData } from './types';

export const seedData = (): AppData => {
  const participantes = [
    { id: 'p1',  codigo: 1,  nome: 'Rafael Maciel',       valorMensal: 120, ativo: true  },
    { id: 'p2',  codigo: 2,  nome: 'Lucas Andrade',       valorMensal: 120, ativo: true  },
    { id: 'p3',  codigo: 3,  nome: 'Bruno Vasconcellos',  valorMensal: 120, ativo: true  },
    { id: 'p4',  codigo: 4,  nome: 'Diego Patrício',      valorMensal: 120, ativo: true  },
    { id: 'p5',  codigo: 5,  nome: 'Felipe Tanaka',       valorMensal: 120, ativo: true  },
    { id: 'p6',  codigo: 6,  nome: 'Gustavo Mendonça',    valorMensal: 120, ativo: true  },
    { id: 'p7',  codigo: 7,  nome: 'Henrique Salim',      valorMensal: 120, ativo: true  },
    { id: 'p8',  codigo: 8,  nome: 'Igor Fontana',        valorMensal: 120, ativo: true  },
    { id: 'p9',  codigo: 9,  nome: 'João Marcelo Souza',  valorMensal: 120, ativo: true  },
    { id: 'p10', codigo: 10, nome: 'Kauã Ribeiro',        valorMensal: 100, ativo: true  },
    { id: 'p11', codigo: 11, nome: 'Leandro Batista',     valorMensal: 120, ativo: true  },
    { id: 'p12', codigo: 12, nome: 'Marcos Camargo',      valorMensal: 120, ativo: true  },
    { id: 'p13', codigo: 13, nome: 'Nícolas Pereira',     valorMensal: 120, ativo: true  },
    { id: 'p14', codigo: 14, nome: 'Otávio Rocha',        valorMensal: 120, ativo: true  },
    { id: 'p15', codigo: 15, nome: 'Paulo Henrique',      valorMensal: 120, ativo: true  },
    { id: 'p16', codigo: 16, nome: 'Renan Diniz',         valorMensal: 140, ativo: true  },
    { id: 'p17', codigo: 17, nome: 'Tiago Albuquerque',   valorMensal: 120, ativo: true  },
    { id: 'p18', codigo: 18, nome: 'Vinícius Caldas',     valorMensal: 120, ativo: false },
  ];

  const categorias = [
    { id: 'c1', codigo: 1, descricao: 'Mensalidade',           tipo: 'credit' as const, ativo: true },
    { id: 'c2', codigo: 2, descricao: 'Patrocínio',             tipo: 'credit' as const, ativo: true },
    { id: 'c3', codigo: 3, descricao: 'Venda de uniformes',    tipo: 'credit' as const, ativo: true },
    { id: 'c4', codigo: 4, descricao: 'Aluguel da quadra',     tipo: 'debit'  as const, ativo: true },
    { id: 'c5', codigo: 5, descricao: 'Arbitragem',             tipo: 'debit'  as const, ativo: true },
    { id: 'c6', codigo: 6, descricao: 'Bolas e materiais',     tipo: 'debit'  as const, ativo: true },
    { id: 'c7', codigo: 7, descricao: 'Uniformes (compra)',    tipo: 'debit'  as const, ativo: true },
    { id: 'c8', codigo: 8, descricao: 'Inscrição em campeonato', tipo: 'debit' as const, ativo: true },
  ];

  const movs: AppData['movs'] = [];
  let codigo = 1001;

  // November mensalidades
  participantes.filter((p) => p.ativo).forEach((p, i) => {
    let status: 'pago' | 'pendente' | 'vencido';
    let dataPagamento: string | null;
    if (i < 12) { status = 'pago'; dataPagamento = `${5 + (i % 10)}/11/2025`.padStart(10, '0'); }
    else if (i < 14) { status = 'pendente'; dataPagamento = null; }
    else { status = 'vencido'; dataPagamento = null; }
    movs.push({
      id: `m-mens-${p.id}-nov`,
      codigo: codigo++,
      categoriaId: 'c1',
      participanteId: p.id,
      tipo: 'credit',
      valor: p.valorMensal,
      vencimento: '10/11/2025',
      dataPagamento,
      status,
      obs: '',
    });
  });

  // Patrocínio
  movs.push({ id: 'm-pat-nov', codigo: codigo++, categoriaId: 'c2', participanteId: null, tipo: 'credit', valor: 600, vencimento: '05/11/2025', dataPagamento: '05/11/2025', status: 'pago', obs: 'Loja do João — outubro' });

  // Despesas Novembro
  movs.push({ id: 'm-quadra-nov', codigo: codigo++, categoriaId: 'c4', participanteId: null, tipo: 'debit', valor: 480, vencimento: '08/11/2025', dataPagamento: '08/11/2025', status: 'pago', obs: 'Quadra do Brejo — 4 sessões' });
  movs.push({ id: 'm-arb-nov', codigo: codigo++, categoriaId: 'c5', participanteId: null, tipo: 'debit', valor: 180, vencimento: '12/11/2025', dataPagamento: '12/11/2025', status: 'pago', obs: 'Árbitro Sérgio' });
  movs.push({ id: 'm-bola-nov', codigo: codigo++, categoriaId: 'c6', participanteId: null, tipo: 'debit', valor: 80, vencimento: '20/11/2025', dataPagamento: null, status: 'pendente', obs: 'Reposição — 2 bolas' });

  // Outubro (paid)
  participantes.filter((p) => p.ativo).slice(0, 16).forEach((p) => {
    movs.push({ id: `m-mens-${p.id}-out`, codigo: codigo++, categoriaId: 'c1', participanteId: p.id, tipo: 'credit', valor: p.valorMensal, vencimento: '10/10/2025', dataPagamento: `${5 + (p.codigo % 12)}/10/2025`.padStart(10, '0'), status: 'pago', obs: '' });
  });
  movs.push({ id: 'm-quadra-out', codigo: codigo++, categoriaId: 'c4', participanteId: null, tipo: 'debit', valor: 460, vencimento: '08/10/2025', dataPagamento: '08/10/2025', status: 'pago', obs: '' });
  movs.push({ id: 'm-arb-out', codigo: codigo++, categoriaId: 'c5', participanteId: null, tipo: 'debit', valor: 200, vencimento: '12/10/2025', dataPagamento: '12/10/2025', status: 'pago', obs: '' });

  return { participantes, categorias, movs };
};
