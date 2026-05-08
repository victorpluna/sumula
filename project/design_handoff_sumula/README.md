# Handoff: Súmula — Sistema de Controle Financeiro para Grupos Esportivos

## Overview

Súmula é um sistema web de controle financeiro para grupos esportivos amadores (futebol de várzea, vôlei, basquete). Um administrador (tesoureiro do time) gerencia mensalistas, cadastra receitas/despesas, lança movimentações financeiras, registra pagamentos e acompanha um dashboard com saldo, inadimplência e fluxo mensal.

O nome **súmula** é o relatório oficial do árbitro — a fonte da verdade do que aconteceu em campo. Aqui carrega o duplo sentido: o registro oficial e transparente do dinheiro do time.

**Idioma do produto:** Português (Brasil). Moeda em `R$ 1.234,56`. Datas em `dd/mm/aaaa`.

---

## About the design files

Os arquivos neste pacote são **referências de design feitas em HTML** — protótipos clicáveis que demonstram a aparência e o comportamento pretendidos do produto. **Não são código de produção para copiar diretamente.**

A tarefa é **recriar esses designs no ambiente do codebase de destino** (React + TypeScript + Tailwind, conforme sugerido na spec, ou o framework que fizer mais sentido) usando os padrões, bibliotecas e convenções estabelecidos no projeto.

Caso ainda não exista um ambiente, a stack sugerida na spec é:

- **Frontend:** Next.js + TypeScript + TailwindCSS
- **Backend:** Node.js (Express ou NestJS)
- **DB:** PostgreSQL com Prisma ou Knex
- **Auth:** JWT (com opção AWS Cognito)

---

## Fidelity

**High-fidelity (hifi).** Os mockups são pixel-perfect com cores, tipografia, espaçamento e interações finais. O desenvolvedor deve recriar a UI com fidelidade visual usando as bibliotecas existentes do codebase. Tokens de design (cores, tipos, espaçamento) estão em `styles/tokens.css` e devem ser portados para o sistema de tokens do projeto (ex.: `tailwind.config.ts` ou CSS variables).

---

## Screens / Views

### 1. Login (`/login`)

**Purpose:** Autenticação do administrador.

**Layout:** Tela full-bleed em duas colunas (50/50 desktop):
- **Esquerda:** card com formulário, padding 64px, fundo `--paper-0`.
- **Direita:** painel decorativo com fundo `--campo-700` + pattern do gramado em SVG (listras horizontais alternadas), wordmark do produto e tagline "O caixa do seu time, organizado."

**Componentes:**
- Logo mark + wordmark "súmula" no topo do form.
- Campos: e-mail (input type=email), senha (input type=password com toggle "mostrar"). Bordas 1px `--border`, radius 10px, focus ring 3px `--ring-focus`.
- Checkbox "Manter conectado" + link "Esqueceu a senha?".
- Botão "Entrar" primary, full-width, 44px altura, bg `--brand` (`#1A4D2E`), texto `--paper-0`.
- Estado **modo recuperação:** form trocado por "Enviar link de recuperação"; após submit, exibe confirmação com link para voltar ao login.

**Validação:** e-mail obrigatório com formato válido; senha mínimo de 1 char (mock). Mensagem de erro em `--debit-500` abaixo do campo.

**Estados:**
- Loading no botão (600ms simulado) com spinner inline.
- Demo: e-mail pré-preenchido `carlos@realvilamariana.com`.

---

### 2. Dashboard (`/`)

**Purpose:** Visão financeira rápida do mês corrente.

**Layout:** Header da página + grid de KPIs + grid 2-col de blocos (gráfico + lista).

**Componentes:**

#### KPI cards (4 colunas)
- **Saldo do caixa** (card destaque com pattern do gramado opcional): valor em JetBrains Mono 48px, bold; subtítulo "atualizado agora"; bg `--brand-soft`, accent `--gold`.
- **Recebido no mês:** valor em verde `--credit-700`, sub "X pagamentos confirmados".
- **Em aberto:** valor em `--pending-700`, sub "X cobranças".
- **Despesas do mês:** valor em `--debit-700`, sub "X saídas".

Cada card: bg `--surface`, 1px border `--border`, radius 14px, shadow `--shadow-sm`, padding 20px.

#### Bloco gráfico (2 colunas)
- **Receitas × Despesas (últimos 6 meses):** gráfico de barras agrupadas em SVG. Eixo Y com gridlines suaves. Hover destaca o mês com tooltip mostrando valores.
- **Próximos vencimentos:** lista compacta dos 5 próximos, com avatar inicial, nome do mensalista, data em mono, valor à direita, status pill.

**Tweak:** layout do dashboard pode alternar entre **Cards** (KPIs grandes lado a lado) e **Lista** (linhas horizontais densas).

---

### 3. Participantes (`/participantes`)

**Purpose:** Cadastro e gestão dos mensalistas do grupo.

**Layout:** Header + barra de filtros + tabela.

**Componentes:**

#### Barra de filtros
- Input de busca com prefix-icon (lupa), placeholder "Buscar por nome...".
- Select status: Todos / Ativos / Inativos.
- Contador "X participantes" no canto direito.

#### Tabela
Colunas: Cód. (3 dígitos, mono) · Nome (avatar inicial + nome) · Status (pill) · Em aberto (pill ou "—") · Mensalidade (mono, right-align) · Ações (editar, ativar/desativar).

**Modal de cadastro/edição:**
- Campos: Nome (texto, autoFocus), Mensalidade (input com prefix `R$ `, máscara monetária BR).
- Validação: nome obrigatório, valor > 0.
- Botões: Cancelar (ghost), Cadastrar/Salvar (primary).

**Confirmação de desativação:** modal com texto "Excluir esse participante? Os pagamentos antigos continuam no histórico." Botões: Cancelar / Desativar (destrutivo).

**Toasts:** "Participante cadastrado." / "Participante atualizado." / "Participante desativado." — slide-in bottom-right com ícone, 3s duração.

---

### 4. Movimentações (`/movimentacoes`)

**Purpose:** Ledger principal — todas entradas e saídas.

**Layout:** Header + filtros (busca, período, status, tipo) + tabela + modais.

**Tabela:** Cód. (4 dígitos, mono) · Descrição (badge REC/DESP + categoria + nome do participante quando houver) · Vencimento (mono) · Status (pill: Pago / Pendente / Vencido) · Valor (mono, +/− com cor `--credit-700`/`--debit-700`) · Ação ("Pagar" se pendente; data do pagamento se pago).

**Status pills:**
- `Pago`: bg `--credit-50`, text `--credit-700`, dot `--credit-500`.
- `Pendente`: bg `--pending-50`, text `--pending-700`, dot `--pending-500`.
- `Vencido`: bg `--overdue-50`, text `--overdue-700`, dot `--overdue-500`.

**Modal "Nova movimentação":**
- Categoria (select com optgroups Receitas/Despesas).
- Participante (select opcional, "Nenhum (movimentação do grupo)" como default).
- Valor + Vencimento em duas colunas.
- Observação (input texto livre).
- Validação: categoria obrigatória, valor > 0, vencimento no formato `dd/mm/aaaa`.

**Modal de detalhe:** clique na descrição abre overlay com valor grande em mono, status pill, todos os campos em rows label/value. Ações: Excluir (ghost left, com confirm) / Marcar como pago / Fechar.

**Animação de pagamento:** ao marcar como pago, a row recebe um flash de bg `--credit-50` por 1200ms e a pill faz spring scale-up (`--ease-spring`, 280ms) — único uso de spring no produto.

---

### 5. Categorias (`/categorias`)

**Purpose:** Cadastro dos tipos de receita/despesa.

**Layout:** Header + busca + 2 cards lado a lado (Receitas / Despesas).

Cada card: header com título + contador, depois lista de linhas (código mono · descrição · contador "X lançamentos vinculados" · badge tipo · botão editar).

**Modal:** Descrição (texto) + Tipo (toggle group de 2 botões: Receita "entra no caixa" / Despesa "sai do caixa", com ícones trending up/down). Botão ativo: bg `--campo-50`, border `--campo-500`, text `--campo-700`, ring focus.

---

### 6. Relatórios (`/relatorios`)

**Purpose:** Prestação de contas em uma página.

**Layout:** Header + 4 abas:

#### Tab "Financeiro geral"
- 4 KPIs: Saldo acumulado (destaque), Total recebido, Total despesas, Em aberto (danger).
- Tabela "Resumo do período": linha de receitas (+, verde), linha de despesas (−, vermelho), linha de saldo (bold, bg `--paper-50`), com coluna "% do caixa".

#### Tab "Inadimplência"
- 3 KPIs: Em aberto, Mensalistas em dia, Taxa de adimplência (%).
- Tabela: avatar + nome · status pill · contador de cobranças · data mais antiga · total devido · botão "Extrato →" que navega para a aba de extrato com o participante selecionado.

#### Tab "Fluxo mensal"
- Tabela com colunas: Mês · Receitas · Despesas · Saldo do mês · Acumulado.
- Footer com totalização em bold + bg `--paper-50`.

#### Tab "Extrato por participante"
- Layout 2-col: lista lateral de mensalistas (260px, scroll) + área principal.
- Header do participante: avatar grande + nome + código + KPIs Pago/Em aberto.
- Tabela de histórico de pagamentos: Cód · Categoria · Vencimento · Pagamento · Status · Valor.

---

## Cross-cutting components

### Sidebar
- Largura: 240px (expanded), 64px (collapsed).
- Itens: Dashboard · Participantes · Movimentações · Categorias · Relatórios.
- Item ativo: bg `--brand-soft`, text `--brand`, indicador 3px à esquerda.
- Hover: bg `--paper-50`.
- Brand mark + wordmark no topo (wordmark some quando collapsed).
- Collapse toggle: chevron 12px no canto superior direito da sidebar (ou centralizado no estado collapsed).

### Topbar
- Altura: 64px, sticky top.
- Crumbs: nome do time ("Real Vila Mariana FC") + separador `/` + página atual.
- Sino de notificações: badge contador unread, dropdown com lista (ícone + título + sub + timestamp).
- Botão "Sair" ghost com ícone logout.

### Toast
- Posição: bottom-right, 16px de margem.
- Card branco, shadow `--shadow-lg`, border-left 4px na cor do tipo (success = `--credit-500`).
- Estrutura: ícone 18px + título bold + sub regular `--ink-500`. Auto-dismiss em 3s, fade+slide.

### Modal
- Backdrop: `rgba(14, 26, 20, 0.32)`, sem blur.
- Card: bg `--surface`, radius 20px, shadow `--shadow-lg`, max-width 480px (560px em modo `wide`).
- Header: título + subtítulo opcional, padding 24px.
- Body: padding 0 24px.
- Footer: padding 20px 24px, justify-end com gap 8px.
- Esc fecha. Click no backdrop fecha.

---

## Interactions & Behavior

- **Login:** `setTimeout` 600ms simula request → `onLogin()` → app shell com dashboard.
- **Logout:** topbar → volta para tela de login.
- **Navegação:** SPA via state (substituir por router real).
- **Marcar como pago:** atualiza status do mov + cria flash de row + dispara toast + atualiza saldo do dashboard (totais derivados).
- **Excluir mov / desativar participante:** confirm modal antes da ação.
- **Hover em rows:** bg `--paper-50`.
- **Focus:** sempre `box-shadow: var(--ring-focus)` (3px verde @22%). **Nunca** `outline: none` sem alternativa.

### Motion

| Token | Duração | Uso |
|---|---|---|
| `--dur-fast` | 120ms | hover, color transitions |
| `--dur` | 180ms | padrão |
| `--dur-slow` | 280ms | modais, accordions |
| `--ease-spring` | 280ms | **único uso:** pill ao marcar como pago |

---

## State Management

### Entidades

```ts
type Participante = {
  id: string; codigo: number; nome: string;
  valorMensal: number; ativo: boolean; createdAt: string;
};

type Categoria = {
  id: string; codigo: number; descricao: string;
  tipo: 'credit' | 'debit'; ativo: boolean; createdAt: string;
};

type Movimentacao = {
  id: string; codigo: number;
  categoriaId: string; participanteId: string | null;
  tipo: 'credit' | 'debit';
  valor: number;                    // em reais, decimal
  vencimento: string;               // dd/mm/aaaa
  dataPagamento: string | null;
  status: 'pago' | 'pendente' | 'vencido';
  obs: string;
};
```

### Regras de negócio

- Código de participante/categoria/movimentação deve ser **único** dentro do tipo.
- Participantes inativos **não geram cobranças futuras** (na rotina de geração mensal).
- Categoria não pode ser excluída se tiver movimentação vinculada — desabilitar/inativar como alternativa.
- `status === 'pago'` requer `dataPagamento` preenchido.
- `status === 'vencido'` é derivado: `vencimento < hoje && !dataPagamento`.

### Endpoints sugeridos

```
POST   /auth/login
POST   /auth/logout
POST   /auth/forgot-password

GET    /participantes?status=&search=
POST   /participantes
PATCH  /participantes/:id
DELETE /participantes/:id

GET    /categorias?tipo=
POST   /categorias
PATCH  /categorias/:id

GET    /movimentacoes?periodo=&status=&tipo=&participanteId=
POST   /movimentacoes
PATCH  /movimentacoes/:id           # marcar pago, editar
DELETE /movimentacoes/:id

GET    /relatorios/geral?periodo=
GET    /relatorios/inadimplencia
GET    /relatorios/fluxo
GET    /relatorios/extrato/:participanteId

GET    /dashboard?periodo=
```

---

## Design Tokens

### Cores

| Token | Hex | Uso |
|---|---|---|
| `--campo-900` | `#0E2E1B` | hover de brand |
| `--campo-700` | `#13402A` | brand-700 |
| `--campo-500` | `#1A4D2E` | **brand primário** |
| `--campo-50`  | `#E8F0EA` | brand-soft |
| `--paper-0`   | `#FFFFFF` | surfaces elevadas |
| `--paper-100` | `#F8F5EC` | **bg do app** |
| `--paper-200` | `#EFEADC` | sunken |
| `--paper-50`  | `#F1ECDD` | hover em paper |
| `--gold-500`  | `#C9A227` | accent (totais, paid stamps) |
| `--ink-900`   | `#0E1A14` | text primary |
| `--ink-700`   | `#2A3A30` | text secundário |
| `--ink-500`   | `#5C6B62` | text muted |
| `--ink-400`   | `#8A9690` | text disabled |
| `--border`    | `#E1DDCE` | bordas padrão |
| `--border-soft` | `#EAE5D5` | divisores em tabela |
| `--credit-500` | `#1F8A5B` | receita |
| `--credit-700` | `#155F3F` | receita escuro |
| `--credit-50`  | `#E5F2EC` | receita soft |
| `--debit-500`  | `#B23A3A` | despesa |
| `--debit-700`  | `#7E2828` | despesa escuro |
| `--debit-50`   | `#F4E5E5` | despesa soft |
| `--pending-500` | `#C49423` | pendente (mostarda) |
| `--pending-700` | `#8A6817` | pendente escuro |
| `--pending-50`  | `#F8EFD6` | pendente soft |
| `--overdue-500` | `#A93333` | vencido |
| `--overdue-700` | `#7A1F1F` | vencido escuro |

### Tipografia

| Família | Peso | Uso |
|---|---|---|
| **Bricolage Grotesque** (display, opsz 12-96) | 500/600/700 | h1, h2, hero numerals, wordmark |
| **Manrope** | 400/500/600/700 | body, UI, formulários, tabelas |
| **JetBrains Mono** | 400/500/600 | dinheiro, IDs, datas |

- `letter-spacing: -0.02em` em display sizes (32px+).
- `font-feature-settings: "tnum"` + `font-variant-numeric: tabular-nums` em todas as colunas de dinheiro.

### Spacing scale (4px base)

`0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96` px (`--space-0`..`--space-13`). A maior parte dos layouts usa `--space-5` (16) e `--space-7` (24).

### Radius

`6 / 10 / 14 / 20 / 28 / pill` — botões 10, cards 14, modais 20, status pills full.

### Shadows

```
--shadow-sm: 0 1px 2px rgba(14,26,20,0.04), 0 1px 1px rgba(14,26,20,0.03);
--shadow-md: 0 6px 16px -4px rgba(14,26,20,0.10);
--shadow-lg: 0 20px 40px -12px rgba(14,26,20,0.18);
--shadow-xl: 0 30px 60px -20px rgba(14,26,20,0.25);
--ring-focus: 0 0 0 3px rgba(26,77,46,0.22);
```

### Iconografia

- **Lucide** como sistema primário (CDN ou import). Stroke 1.75px, currentColor.
- Tamanhos: 14px micro, 18px UI, 20px headers, 24px hero.

---

## Assets

- `assets/logo-mark.svg` — monograma "s" em quadrado arredondado.
- `assets/logo-wordmark.svg` — wordmark "súmula".
- `assets/logo-wordmark-inverse.svg` — versão clara para fundos escuros.
- `assets/pattern-gramado.svg` — padrão de listras horizontais (gramado), uso decorativo no login e card de saldo.

Todos invented para o sistema — substituir por assets finais quando disponíveis.

---

## Files

```
Súmula.html                  # Entry point — abrir para ver o protótipo
src/App.jsx                  # Root, state, routing, seed data, tweaks
src/Login.jsx                # Tela de login + recuperação
src/Sidebar.jsx              # Navegação lateral (collapse incluído)
src/Topbar.jsx               # Crumbs + notificações + logout
src/Dashboard.jsx            # KPIs + gráfico + próximos vencimentos
src/Participantes.jsx        # Lista + modal cadastro/edição
src/Movimentacoes.jsx        # Ledger + modais nova/detalhe
src/Categorias.jsx           # Receitas + despesas em 2 colunas
src/Relatorios.jsx           # 4 abas de relatórios
src/primitives.jsx           # Button, Field, Input, Modal, Pill, etc.
src/icons.jsx                # Wrappers Lucide
styles/tokens.css            # Todas as design tokens em CSS variables
styles/app.css               # Layout shell, tabela, formulários, motion
spec/spec.md                 # Especificação original do produto (PT-BR)
```

A spec original em `spec/` cobre regras de negócio, fluxos básicos, esquema do banco e roadmap futuro.

---

## Próximos passos sugeridos para o desenvolvedor

1. Ler `spec/spec.md` (especificação completa do MVP).
2. Abrir `Súmula.html` em browser para ver o fluxo end-to-end.
3. Portar `styles/tokens.css` para o sistema de tokens do codebase (Tailwind config, theme provider, etc).
4. Implementar telas na ordem: Login → Dashboard → Participantes → Categorias → Movimentações → Relatórios.
5. Implementar geração mensal automática (item 7.3 da spec) como cron job.
6. Stack sugerida em `spec/spec.md` seção 10.
