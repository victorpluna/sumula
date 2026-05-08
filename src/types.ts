export type Participante = {
  id: string;
  codigo: number;
  nome: string;
  valorMensal: number;
  ativo: boolean;
};

export type Categoria = {
  id: string;
  codigo: number;
  descricao: string;
  tipo: 'credit' | 'debit';
  ativo: boolean;
};

export type Movimentacao = {
  id: string;
  codigo: number;
  categoriaId: string;
  participanteId: string | null;
  tipo: 'credit' | 'debit';
  valor: number;
  vencimento: string;
  dataPagamento: string | null;
  status: 'pago' | 'pendente' | 'vencido';
  obs: string;
};

export type AppData = {
  participantes: Participante[];
  categorias: Categoria[];
  movs: Movimentacao[];
};

export type Page = 'dashboard' | 'participantes' | 'movimentacoes' | 'categorias' | 'relatorios';

export type Notification = {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  sub: string;
  read: boolean;
  kind?: 'warn' | 'crit' | 'ok';
};

export type Tweaks = {
  sidebarCollapsed: boolean;
  dashboardLayout: 'cards' | 'list';
  showGramadoPattern: boolean;
  accentTone: string;
};

import React from 'react';
