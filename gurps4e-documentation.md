# GURPS 4e Web — Documentação Unificada

> Esta documentação cobre dois contextos relacionados:
> 1. **GCS Desktop** — o aplicativo original de Richard A. Wilkes (`richardwilkes/gcs`), que é a referência de regras, formatos de arquivo e comportamento esperado.
> 2. **gurps4e Web SPA** — a aplicação web que você está construindo, que consome os mesmos arquivos `.gcs`, implementa as mesmas regras e adiciona autenticação, grupos, tempo real e fluxo de aprovação de fichas.

---

## Índice

1. [Sobre o GCS Desktop (referência)](#1-sobre-o-gcs-desktop-referência)
2. [Formato de Arquivo `.gcs` v5](#2-formato-de-arquivo-gcs-v5)
3. [Configurações de Ficha (Sheet Settings)](#3-configurações-de-ficha-sheet-settings)
4. [Regras GURPS implementadas](#4-regras-gurps-implementadas)
5. [Arquitetura da SPA Web](#5-arquitetura-da-spa-web)
6. [Banco de Dados — Schema PostgreSQL](#6-banco-de-dados--schema-postgresql)
7. [Permissões (RLS)](#7-permissões-rls)
8. [Fluxos Principais](#8-fluxos-principais)
9. [Estrutura de Arquivos — `gurps4e/`](#9-estrutura-de-arquivos--gurps4e)
10. [Rotas da Aplicação](#10-rotas-da-aplicação)
11. [Interface — Abas da Ficha](#11-interface--abas-da-ficha)
12. [Fases de Implementação](#12-fases-de-implementação)
13. [Critérios de Conclusão (DoD)](#13-critérios-de-conclusão-dod)
14. [Traceability](#14-traceability)

---

## 1. Sobre o GCS Desktop (referência)

O **GURPS Character Sheet (GCS)** é um aplicativo desktop gratuito e de código aberto criado por Richard A. Wilkes para criar e gerenciar personagens de GURPS Quarta Edição. Ele roda nativamente em macOS, Windows e Linux e implementa a totalidade das regras GURPS 4e — de atributos básicos e contagem de pontos a traits, skills, magias, armas e equipamentos.

### O que o GCS desktop faz

O GCS é construído em torno de um fluxo de trabalho baseado em bibliotecas. O usuário mantém bibliotecas reutilizáveis de traits, skills, magias e equipamentos e arrasta entradas dessas bibliotecas para fichas de personagem. Toda alteração recalcula instantaneamente totais de pontos, atributos derivados, níveis de encumbrance e níveis de habilidade de armas.

Capacidades principais:

- **Criação de personagens** — Fichas GURPS 4e completas com rastreamento automático de pontos, atributos derivados e aplicação de regras.
- **Traits, skills, magias e equipamentos** — Suporte completo a vantagens, desvantagens, quirks, skills, magias, armas e encumbrance.
- **Gerenciamento de bibliotecas** — Organização de bibliotecas reutilizáveis com sincronização via repositórios GitHub.
- **Exportação PDF e HTML** — Fichas prontas para impressão em PDF ou HTML, com suporte a templates customizados.
- **Scripting JavaScript** — Expressões inline para pré-requisitos customizados, modificadores condicionais e valores calculados.
- **Arquivos de campanha** — Agrupamento de fichas com configurações compartilhadas de sheet settings, definições de atributos e tipo de corpo.

### Licenciamento

O GCS é licenciado sob a Mozilla Public License 2.0 e é gratuito para download. GURPS é uma marca registrada da Steve Jackson Games; suas regras e arte são protegidas por copyright. O GCS foi criado por Richard A. Wilkes e lançado sob as permissões da Steve Jackson Games Online Policy.

> **Relação com a SPA web:** A SPA `gurps4e/` não substitui o GCS desktop. Ela é uma interface web que lê e escreve os mesmos arquivos `.gcs` e implementa as mesmas regras, adicionando fluxos colaborativos que o GCS desktop não possui (autenticação, grupos, tempo real, aprovação de fichas).

---

## 2. Formato de Arquivo `.gcs` v5

### Visão geral

Todos os arquivos de dados do GCS são JSON puro, com ordenação determinística de chaves e indentação por tab. O campo `version` (inteiro) no topo de cada arquivo indica o formato. **A versão atual é 5.**

```json
{
  "version": 5,
  "rows": [
    ...
  ]
}
```

Regras de compatibilidade:
- Arquivos com versão menor que **2** não podem ser carregados — é necessário abri-los em uma versão mais antiga do GCS e re-salvar antes de atualizar.
- Arquivos com versão maior do que a suportada pela release atual também não podem ser carregados — o GCS solicita atualização do aplicativo.

### Extensões de arquivo relevantes para a SPA

| Extensão | Conteúdo | Relevância para a SPA |
|---|---|---|
| `.gcs` | Ficha de personagem completa | **Principal** — importada e exportada pela SPA |
| `.gct` | Template de personagem | Referência para criação de novos personagens |
| `.adq` | Lista de traits (vantagens/desvantagens/quirks) | Biblioteca de referência |
| `.skl` | Lista de skills | Biblioteca de referência |
| `.spl` | Lista de magias | Biblioteca de referência |
| `.eqp` | Lista de equipamentos | Biblioteca de referência |
| `.sheet` | Configurações de ficha | Importável para aplicar sheet settings |

### Estrutura interna do `.gcs`

Um arquivo `.gcs` representa a entidade `Entity` no GCS. Os campos principais são:

```json
{
  "version": 5,
  "id": "uuid",
  "created_date": "2024-01-01",
  "modified_date": "2024-01-15",
  "profile": {
    "name": "Amanda Birnstead",
    "age": "25",
    "birthday": "March 3",
    "eyes": "Brown",
    "hair": "Black",
    "skin": "Light",
    "handedness": "Right",
    "height": "5'7\"",
    "weight": "140 lb",
    "player_name": "Player Name",
    "title": "",
    "organization": "",
    "religion": "",
    "tech_level": "8",
    "portrait": "<base64>"
  },
  "settings": { ... },
  "attributes": [ ... ],
  "traits": [ ... ],
  "skills": [ ... ],
  "spells": [ ... ],
  "carried_equipment": [ ... ],
  "other_equipment": [ ... ],
  "notes": [ ... ],
  "total_points": 150,
  "points_record": [ ... ]
}
```

### Regra de round-trip

A SPA deve garantir que importar um `.gcs` e re-exportá-lo resulte em um arquivo idêntico ao original, com a única diferença permitida sendo o campo `modified_date`. Qualquer outra divergência é um bug.

---

## 3. Configurações de Ficha (Sheet Settings)

As sheet settings controlam como uma ficha de personagem é exibida, impressa e calculada. Elas existem em dois níveis:

- **Sheet settings globais** — padrões aplicados a todo novo personagem.
- **Sheet settings por personagem** — cada ficha pode sobrescrever qualquer configuração global.

No GCS desktop, acessadas via **Edit → Sheet Settings** (global) ou **Sheet → Sheet Settings** (por personagem). Na SPA web, expostas como painel de configurações dentro do editor de ficha.

### Configurações de página

| Configuração | Descrição |
|---|---|
| **Tamanho do papel** | Tamanho físico da página (Letter, A4, Legal, etc.) |
| **Orientação** | Retrato ou paisagem |
| **Margens** | Larguras superior, inferior, esquerda e direita |

### Layout de blocos

A ficha é dividida em blocos nomeados (Traits, Skills, Magias, Equipamentos, etc.). O **Block Layout** determina quais blocos aparecem e em qual ordem. Alterar o layout dispara uma reconstrução completa da visualização da ficha.

### Unidades

| Configuração | Padrão | Descrição |
|---|---|---|
| **Unidade de comprimento padrão** | Pés e Polegadas | Unidade para exibição e entrada de comprimento/altura |
| **Unidade de peso padrão** | Libras | Unidade para exibição e entrada de peso |

### Progressão de dano

A configuração **Damage progression** controla como os valores de dano Thrust (thr) e Swing (sw) escalam com ST.

| Opção | Fonte |
|---|---|
| Basic Set | Progressão padrão do GURPS Basic Set |
| Knowing Your Own Strength | Pyramid 3/83, páginas 16–19 |
| No School Grognard Damage | Blog No School Grognard |
| Thrust = Swing-2 | Esquema alternativo da comunidade |
| Swing = Thrust+2 | House rule de Kevin Smyth |
| T Bone's New Damage for ST (opção 1) | T Bone's Games Diner |
| T Bone's New Damage for ST (opção 1, limpa) | T Bone's Games Diner |
| T Bone's New Damage for ST (opção 2) | T Bone's Games Diner |
| T Bone's New Damage for ST (opção 2, limpa) | T Bone's Games Diner |
| Phoenix Flame D3 | House rule da comunidade usando d3s |

> **Na SPA:** a progressão de dano padrão é **Basic Set**. Cada personagem pode sobrescrever via suas próprias sheet settings persistidas em `characters.gcs_data.settings`.

### Opções de exibição

Cada opção aceita um dos quatro modos de exibição:

| Modo | Comportamento |
|---|---|
| `not_shown` | O texto é ocultado completamente |
| `inline` | O texto aparece diretamente na linha da ficha |
| `tooltip` | O texto aparece em tooltip ao passar o mouse |
| `inline_and_tooltip` | O texto aparece tanto inline quanto no tooltip |

| Configuração | Padrão | O que controla |
|---|---|---|
| **User description display** | Tooltip | Onde a descrição escrita pelo usuário é exibida |
| **Modifiers display** | Inline | Onde os nomes dos modificadores ativos são exibidos |
| **Notes display** | Inline | Onde o campo de notas é exibido nas linhas de lista |
| **Skill level adj display** | Tooltip | Onde os ajustes de nível de skill são exibidos |

### Regras opcionais de GURPS

**Multiplicative modifiers** (`UseMultiplicativeModifiers`)
Quando habilitado, modificadores percentuais de traits são multiplicados entre si em vez de somados. Implementa a regra opcional do GURPS Basic Set, p. B102.

**Modifying dice + adds** (`UseModifyingDicePlusAdds`)
Quando habilitado, dano de armas que seria expresso como adição fixa (ex: thr+4) é convertido para um número equivalente de dados extras. Também acessível em scripts como `entity.extraDiceFromModifiers`.

**Half-stat defaults** (`UseHalfStatDefaults`)
Quando habilitado, o uso sem treinamento de uma skill retorna metade do atributo controlador em vez do atributo menos uma penalidade. Implementa a regra opcional do GURPS Basic Set.

### Visibilidade de colunas e ajustes

#### Exibição de ajustes

| Configuração | Padrão | Descrição |
|---|---|---|
| **Show trait modifier adj** | Off | Mostra o ajuste de custo em pontos dos modificadores de trait ativos |
| **Show equipment modifier adj** | Off | Mostra o ajuste de custo dos modificadores de equipamento ativos |
| **Show spell adj** | On | Mostra a coluna de ajuste de custo na lista de magias |
| **Show all weapons** | Off | Quando off, lista apenas armas de itens equipados; quando on, inclui todos os itens carregados |

#### Ocultação de colunas

| Configuração | Padrão | Descrição |
|---|---|---|
| **Hide TL column** | Off | Remove a coluna Tech Level das listas de traits e equipamentos |
| **Hide LC column** | Off | Remove a coluna Legality Class das listas de equipamentos |
| **Hide page reference column** | Off | Remove a coluna de referência de página (livro/página) de todas as listas |
| **Hide source mismatch** | Off | Suprime avisos quando o conteúdo de um item de biblioteca mudou desde que foi adicionado à ficha |

### Rodapé

| Configuração | Padrão | Descrição |
|---|---|---|
| **Use title in footer** | Off | Quando habilitado, o campo de título do personagem é impresso no rodapé em vez do nome do jogador |

### Totais de pontos

| Configuração | Padrão | Descrição |
|---|---|---|
| **Exclude unspent points from total** | Off | Quando habilitado, pontos não alocados não são contados no total exibido |

### Colunas de dano adicionais

| Configuração | Padrão | Descrição |
|---|---|---|
| **Show Lifting ST damage** | Off | Adiciona coluna de dano baseada em Lifting ST em vez de ST de ataque |
| **Show IQ-based damage** | Off | Adiciona coluna de dano escalado por IQ para certos tipos de criaturas |

---

## 4. Regras GURPS implementadas

Esta seção descreve as regras que o motor (`engine/`) da SPA deve implementar, com valores idênticos ao GCS desktop. **Nenhuma regra pode ser alterada.**

### Atributos primários

| Atributo | Custo por nível | Padrão |
|---|---|---|
| ST (Strength) | 10 pts | 10 |
| DX (Dexterity) | 20 pts | 10 |
| IQ (Intelligence) | 20 pts | 10 |
| HT (Health) | 10 pts | 10 |

### Atributos secundários (derivados)

```
HP      = ST                 (custo: 2 pts/nível)
FP      = HT                 (custo: 3 pts/nível)
Will    = IQ                 (custo: 5 pts/nível)
Per     = IQ                 (custo: 5 pts/nível)
Speed   = (DX + HT) / 4      (custo: 5 pts por 0.25)
Move    = floor(Speed)       (custo: 5 pts/nível)
Dodge   = floor(Speed) + 3   (sem custo direto)
BL      = ST² / 5 lbs        (sem custo direto)
```

### Curva de perícias

| Pontos gastos | Fácil (E) | Médio (A) | Difícil (H) | Muito Difícil (VH) |
|---|---|---|---|---|
| 1 | attr+0 | attr-1 | attr-2 | attr-3 |
| 2 | attr+1 | attr+0 | attr-1 | attr-2 |
| 4 | attr+2 | attr+1 | attr+0 | attr-1 |
| 8 | attr+3 | attr+2 | attr+1 | attr+0 |
| +4 pts | +1 nível (todas as dificuldades) |

**Exemplo de verificação:** Diplomacy (IQ/H) com 2 pts → IQ-1

### Expression Evaluator

O motor resolve expressões de atributos sem usar `eval` nativo. Suporta:

| Expressão | Resultado esperado |
|---|---|
| `"10"` | 10 |
| `"$iq"` | Valor atual de IQ |
| `"($dx + $ht) / 4"` | Basic Speed |
| `"Math.floor($basic_speed)"` | Basic Move |
| `"Math.round(-$hp * 5)"` | Threshold de HP |

A resolução usa ordenação topológica para garantir que atributos que dependem de outros sejam calculados na ordem correta.

### Dano Thrust/Swing

Calculado pelo `damageCalculator.ts` com suporte às progressões listadas na seção 3. O padrão é **Basic Set**:

| ST | Thrust | Swing |
|---|---|---|
| 1 | 1d-6 | 1d-5 |
| 7 | 1d-3 | 1d-1 |
| 10 | 1d-2 | 1d |
| 11 | 1d-1 | 1d+1 |
| 15 | 1d+1 | 2d-1 |

### Encumbrance

| Nível | Limite de peso | Penalidade Move | Penalidade Dodge |
|---|---|---|---|
| None (0) | BL | 0 | 0 |
| Light (1) | 2×BL | -1 | -1 |
| Medium (2) | 3×BL | -2 | -2 |
| Heavy (3) | 6×BL | -3 | -3 |
| Extra-Heavy (4) | 10×BL | -4 | -4 |

---

## 5. Arquitetura da SPA Web

```
┌─────────────────────────────────────────────────────┐
│               Frontend — gurps4e/                   │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │  Páginas │  │ Zustand  │  │  TanStack Query   │ │
│  │    &     │  │ (edição  │  │  (dados servidor) │ │
│  │Componentes│  │  local)  │  │                   │ │
│  └──────────┘  └──────────┘  └───────────────────┘ │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │           Supabase Realtime                  │   │
│  │        (subscrições WebSocket)               │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          │
              ┌───────────▼───────────┐
              │        Supabase       │
              │                       │
              │  ┌─────────────────┐  │
              │  │  Auth           │  │
              │  │ (email/senha)   │  │
              │  └─────────────────┘  │
              │  ┌─────────────────┐  │
              │  │  PostgreSQL     │  │
              │  │  (fichas,       │  │
              │  │  grupos,        │  │
              │  │  membros)       │  │
              │  └─────────────────┘  │
              │  ┌─────────────────┐  │
              │  │  Realtime       │  │
              │  │ (Postgres       │  │
              │  │  Changes)       │  │
              │  └─────────────────┘  │
              │  ┌─────────────────┐  │
              │  │  Edge Functions │  │
              │  │ (e-mail de      │  │
              │  │  convite)       │  │
              │  └─────────────────┘  │
              └───────────────────────┘
```

### Stack tecnológico

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Estilo | Tailwind CSS (`darkMode: 'class'`) |
| Auth + DB + Realtime | Supabase (PostgreSQL + Auth + Realtime + Edge Functions) |
| State local (ficha) | Zustand |
| State servidor | TanStack Query (React Query) |
| Validação schema | Zod |
| Roteamento | React Router v6 |
| Ícones | lucide-react |
| Testes | Vitest + React Testing Library |

---

## 6. Banco de Dados — Schema PostgreSQL

### Diagrama de entidades

```
profiles
  id (PK, uuid)
  username (UK, text, 3-24 chars, [a-zA-Z0-9_-])
  display_name (text)
  avatar_url (text)
  created_at (timestamptz)

characters
  id (PK, uuid)
  owner_id (FK → profiles.id)
  name (text)
  gcs_data (jsonb)          ← conteúdo completo do .gcs v5
  created_at (timestamptz)
  updated_at (timestamptz)

groups
  id (PK, uuid)
  name (text)
  description (text)
  created_by (FK → profiles.id)
  created_at (timestamptz)

group_members
  id (PK, uuid)
  group_id (FK → groups.id)
  user_id (FK → profiles.id)
  role (text)               ← 'gm' | 'player'
  status (text)             ← 'invited' | 'active'
  invited_by (FK → profiles.id)
  joined_at (timestamptz)

group_invites
  id (PK, uuid)
  group_id (FK → groups.id)
  invited_email (text)
  invited_by (FK → profiles.id)
  token (UK, text)
  status (text)             ← 'pending' | 'accepted' | 'expired'
  created_at (timestamptz)

group_characters
  id (PK, uuid)
  group_id (FK → groups.id)
  character_id (FK → characters.id)
  owner_id (FK → profiles.id)
  working_data (jsonb)      ← cópia de trabalho dentro do grupo
  status (text)             ← 'pending' | 'accepted' | 'rejected'
  submitted_at (timestamptz)
  reviewed_at (timestamptz)
  reviewed_by (FK → profiles.id)

character_edits
  id (PK, uuid)
  group_character_id (FK → group_characters.id)
  editor_id (FK → profiles.id)
  editor_role (text)        ← 'gm' | 'player'
  previous_data (jsonb)
  new_data (jsonb)
  reversion_proposed (boolean)
  reversion_status (text)   ← 'pending' | 'approved' | 'rejected'
  created_at (timestamptz)
```

### Relacionamentos

```
profiles ──< characters (um usuário possui várias fichas)
profiles ──< group_members (um usuário participa de vários grupos)
groups ──< group_members (um grupo tem vários membros)
groups ──< group_characters (um grupo contém várias fichas)
characters ──< group_characters (uma ficha-base → N grupos)
group_characters ──< character_edits (histórico de edições)
```

> **Nota importante:** `group_characters.working_data` é a **cópia de trabalho** da ficha dentro do grupo. Ela pode divergir de `characters.gcs_data` (a ficha-base do jogador) após edições do mestre. O mestre sempre edita `working_data`; a ficha original do jogador não é alterada.

### Migration: `001_profiles.sql`

```sql
CREATE TABLE profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username     TEXT UNIQUE NOT NULL
               CHECK (username ~ '^[a-zA-Z0-9_-]{3,24}$'),
  display_name TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca case-insensitive
CREATE UNIQUE INDEX profiles_username_lower_idx
  ON profiles (LOWER(username));
```

### Identificador de usuário: `username`

O usuário **escolhe** seu próprio identificador durante o cadastro. Regras de validação:

| Regra | Detalhe |
|---|---|
| Tamanho | 3–24 caracteres |
| Caracteres permitidos | Letras (a-z, A-Z), números, underscore `_`, hífen `-` |
| Busca | Case-insensitive (`LOWER(username) = LOWER($input)`) |
| Unicidade | Constraint `UNIQUE` no banco + index por lowercase |
| Imutabilidade | Bloqueado após o cadastro |

O username é exibido na UI com prefixo `@` (apenas visual, o `@` não faz parte do valor armazenado). Exemplo: `@ArpoRJ`.

---

## 7. Permissões (RLS)

| Tabela | Quem pode ler | Quem pode escrever |
|---|---|---|
| `profiles` | Todos os usuários autenticados | Próprio perfil |
| `characters` | Dono + GMs com ficha aceita no grupo | Dono + GM (via `working_data` em `group_characters`) |
| `groups` | Membros do grupo | GM do grupo |
| `group_members` | Membros do mesmo grupo | GM (inserir/alterar papel); próprio usuário (aceitar convite) |
| `group_invites` | GM do grupo | GM do grupo |
| `group_characters` | Dono + todos os membros do grupo | Dono (submeter/retirar); GM (aceitar/rejeitar + editar `working_data`) |
| `character_edits` | Dono + GM do grupo | Dono + GM (inserir); GM (aprovar/rejeitar reversão) |

---

## 8. Fluxos Principais

### 8.1 — Cadastro e username

```
Passo 1: E-mail + senha
Passo 2: Escolher username
  → Validação de formato (regex, tamanho) — client-side imediato
  → Verificação de disponibilidade — query Supabase com debounce ≤ 500ms
  → Feedback: "✓ ArpoRJ está disponível" | "✗ já em uso"
Passo 3: Nome de exibição (opcional)
→ Trigger SQL insere em profiles com username escolhido
```

### 8.2 — Convite para Grupo

```
Via username:
  GM → digita "ArpoRJ" (case-insensitive)
       → SELECT * FROM profiles WHERE LOWER(username) = LOWER($input)
       → Exibe card "ArpoRJ — João Silva" [Convidar]
       → Insere em group_members (status: 'invited')

Via e-mail:
  GM → digita e-mail do convidado
       → Edge Function envia e-mail com token único
       → Convidado clica em /invite/:token
       → Se não cadastrado → cria conta → aceita convite
       → Se já cadastrado → faz login → aceita convite
       → group_members passa de 'invited' para 'active'
```

### 8.3 — Submissão e Aprovação de Ficha

```
Jogador → escolhe ficha existente ou cria nova
        → submete ao grupo (group_characters, status: 'pending')
        → GM recebe notificação visual

GM → aceita  → status: 'accepted', working_data = gcs_data do momento
   → rejeita → status: 'rejected' (com motivo opcional)

Após aceite:
  → Realtime ativo entre GM e jogador
  → GM pode editar working_data em tempo real
```

### 8.4 — Edições em Tempo Real e Reversão

```
GM edita campo na ficha aceita
  → Salva em character_edits (editor_role: 'gm', previous_data, new_data)
  → Realtime: jogador vê mudança ao vivo sem recarregar página

Jogador propõe reversão de uma edição do GM
  → character_edits (reversion_proposed: true, reversion_status: 'pending')
  → GM recebe notificação

GM aprova reversão
  → working_data volta ao previous_data da edição
  → reversion_status: 'approved'
  → Jogador vê mudança ao vivo

GM rejeita reversão
  → reversion_status: 'rejected'
  → Mudança do GM é mantida
```

---

## 9. Estrutura de Arquivos — `gurps4e/`

```
gurps4e/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   ├── 001_profiles.sql
│   │   ├── 002_characters.sql
│   │   ├── 003_groups.sql
│   │   ├── 004_group_characters.sql
│   │   └── 005_character_edits.sql
│   └── functions/
│       └── send-invite/
│           └── index.ts           # Edge Function: envia e-mail de convite
│
└── src/
    ├── main.tsx
    ├── App.tsx                    # React Router + providers
    ├── styles/globals.css
    │
    ├── lib/
    │   ├── supabase.ts            # Cliente Supabase
    │   ├── auth.ts                # Helpers de autenticação
    │   └── realtime.ts            # Helpers de subscrição Realtime
    │
    ├── types/
    │   ├── gcs.ts                 # Schema .gcs v5 completo
    │   ├── database.ts            # Tipos gerados (supabase gen types typescript)
    │   └── app.ts                 # Tipos de domínio da aplicação
    │
    ├── engine/                    # Motor de regras GURPS (funções puras)
    │   ├── expressionEvaluator.ts # Avalia "$iq", "($dx+$ht)/4" sem eval
    │   ├── attributeResolver.ts   # Topological sort + resolução de atributos
    │   ├── pointCalculator.ts     # Custo total por seção
    │   ├── skillCalculator.ts     # Curva de pontos/nível por dificuldade
    │   ├── damageCalculator.ts    # Thrust/Swing (todas as progressões)
    │   ├── encumbranceCalculator.ts
    │   ├── traitCalculator.ts
    │   ├── equipmentCalculator.ts
    │   └── index.ts               # recalcAll() — orquestrador
    │
    ├── io/
    │   ├── gcsParser.ts           # JSON → valida version === 5
    │   ├── gcsNormalizer.ts       # Raw JSON → modelo interno
    │   ├── gcsSerializer.ts       # Modelo interno → .gcs JSON v5
    │   └── fileUtils.ts           # FileReader + Blob download
    │
    ├── store/
    │   ├── characterStore.ts      # Zustand: dados da ficha + actions
    │   └── appStore.ts            # Zustand: tema, aba ativa, sidebar
    │
    ├── hooks/
    │   ├── useAuth.ts             # Sessão, login, logout, username
    │   ├── useCharacter.ts
    │   ├── useGroup.ts
    │   ├── useGroupCharacter.ts   # Ficha dentro de grupo + realtime
    │   └── useFileImportExport.ts
    │
    ├── pages/
    │   ├── Landing.tsx            # Login / apresentação
    │   ├── Register.tsx           # Cadastro com escolha de username
    │   ├── Dashboard.tsx          # Minhas fichas + meus grupos
    │   ├── CharacterEdit.tsx      # Editor completo da ficha
    │   ├── GroupList.tsx
    │   ├── GroupDetail.tsx        # Membros + fichas do grupo
    │   ├── GmView.tsx             # Vista do mestre (fichas aceitas)
    │   └── InviteAccept.tsx       # /invite/:token
    │
    └── components/
        ├── layout/
        │   ├── AppShell.tsx
        │   ├── TopBar.tsx
        │   ├── TabNav.tsx
        │   └── MobileDrawer.tsx   # Hamburger → drawer (mobile)
        │
        ├── auth/
        │   ├── LoginForm.tsx
        │   ├── RegisterForm.tsx   # Campo username + validação em tempo real
        │   └── UserBadge.tsx      # Exibe "@username"
        │
        ├── dashboard/
        │   ├── CharacterCard.tsx
        │   └── GroupCard.tsx
        │
        ├── groups/
        │   ├── GroupForm.tsx
        │   ├── MemberList.tsx
        │   ├── InviteDialog.tsx   # Busca por @username ou e-mail
        │   ├── CharacterSubmit.tsx
        │   └── RevertProposal.tsx # Jogador propõe reversão
        │
        ├── gm/
        │   ├── PendingCharacters.tsx
        │   ├── CharacterReview.tsx
        │   └── RevertApproval.tsx
        │
        └── features/              # Abas da ficha
            ├── identity/
            ├── attributes/
            ├── points/
            ├── combat/
            ├── traits/
            ├── skills/
            ├── spells/
            ├── equipment/
            └── notes/
```

---

## 10. Rotas da Aplicação

| Rota | Página | Quem acessa |
|---|---|---|
| `/` | Landing (login/cadastro) | Público |
| `/dashboard` | Minhas fichas + grupos | Autenticado |
| `/characters/new` | Criar ficha | Autenticado |
| `/characters/:id` | Editar ficha | Dono |
| `/groups` | Lista de grupos | Autenticado |
| `/groups/new` | Criar grupo | Autenticado |
| `/groups/:id` | Detalhe do grupo | Membro |
| `/groups/:id/gm` | Vista do mestre | GM do grupo |
| `/invite/:token` | Aceitar convite por e-mail | Público |

---

## 11. Interface — Abas da Ficha

O editor de ficha segue a mesma organização de blocos do GCS desktop, adaptada para uma SPA com navegação por abas.

| Aba | Conteúdo |
|---|---|
| **Identidade** | Nome, retrato (base64), dados físicos (altura, peso, idade, olhos, cabelo, pele), jogador, TL, organização, pontos totais |
| **Atributos** | ST/DX/IQ/HT editáveis; HP/FP/Will/Per/Speed/Move/Dodge/BL calculados automaticamente; HP e FP atuais (pools) |
| **Pontos** | Resumo de pontos por seção: atributos, vantagens, desvantagens, skills, magias, não alocados, total |
| **Combate** | Nível de encumbrance, Thrust/Swing pela ST, Hit Locations, lista de armas corpo-a-corpo e à distância |
| **Traits** | Vantagens e desvantagens com modificadores, níveis, custo calculado; suporte a estrutura em árvore (containers) |
| **Perícias** | Lista de skills com pontos editáveis → nível calculado automaticamente pela curva de dificuldade |
| **Magias** | Idem perícias, com colunas adicionais de college, custo de mana e tempo de conjuração |
| **Equipamento** | Carregado (afeta encumbrance) vs. Outro (não afeta); peso total; custo total; containers aninhados |
| **Notas** | Texto livre em Markdown ou plain text |

### Responsividade

- **Desktop (≥ 768px):** abas no topo da página, layout em colunas.
- **Mobile (< 768px):** hamburger menu → drawer lateral com navegação entre abas.
- **Dark/Light mode:** toggle global via `appStore`, persistido em `localStorage`.

---

## 12. Fases de Implementação

### Fase 1 — Scaffolding (CONCLUÍDO)

Criar `gurps4e/` com Vite + React + TypeScript + Tailwind + React Router + TanStack Query + Zustand + Zod + `@supabase/supabase-js`.

**Verificação:** `npm run dev` abre; estrutura de pastas validada.

### Fase 2 — Prototipação de Telas (Mockups) (EM ANDAMENTO)

Criar todas as interfaces da aplicação utilizando dados mockados e navegação funcional. O objetivo é validar a UX e o fluxo de navegação antes de plugar o backend.
- **Mock Auth:** Permitir entrada na aplicação sem banco de dados real.
- **Navegação:** Todas as rotas de `/dashboard`, `/characters/:id`, `/groups/:id`, etc., funcionando.
- **Design Premium:** Aplicação do sistema de design via **Stitch** para garantir estética vibrante e moderna.

### Fase 3 — Banco de Dados + RLS

Escrever todas as migrations em `supabase/migrations/`. Configurar todas as policies RLS. Gerar tipos TypeScript via `supabase gen types typescript`.

### Fase 4 — Autenticação Real + Username

Integração com Supabase Auth e fluxo de escolha de username único.

### Fase 5 — Tipos + I/O (`.gcs`)

Definir todos os tipos TypeScript do schema `.gcs` v5 em `types/gcs.ts`. Implementar parser, normalizer, serializer e `fileUtils.ts`.

### Fase 6 — Motor de Regras GURPS

Implementar todos os módulos em `engine/` com testes unitários (Vitest). Implementar `recalcAll()` como orquestrador.

### Fase 7 — Integração de Fichas (CRUD Real)

Salvar/carregar fichas em `characters` via TanStack Query, removendo os mocks da Fase 2.

### Fase 8 — Sistema de Grupos Real

Substituição dos mocks de grupos pela integração real com as tabelas `groups`, `group_members` e `group_invites`.

### Fase 9 — Tempo Real e Edição pelo Mestre

`GmView` funcional com Supabase Realtime para edições ao vivo e fluxo de reversão.


**Verificação:** GM edita HP → jogador vê mudança sem recarregar página.

### Fase 10 — Proposta de Reversão

`RevertProposal` para jogadores abrirem histórico de edições e propor reversão de uma entrada do GM. `RevertApproval` para GM aprovar (volta ao `previous_data`) ou rejeitar.

**Verificação:** ciclo completo proposta → aprovação → reversão visível ao vivo.

### Fase 11 — UI da Ficha (Abas)

Implementar todas as abas: Identidade, Atributos, Pontos, Combate, Traits, Perícias, Magias, Equipamento, Notas. Layout responsivo. Dark/Light mode toggle.

**Verificação:** criar personagem do zero; preencher todas as seções; pontos conferem com cálculo manual.

### Fase 12 — Polimento

A11y (aria-labels, navegação por teclado), estados de loading/erro em todas as operações de rede, feedback visual (toasts, badges para GM), PWA manifest + service worker.

**Verificação:** Lighthouse a11y ≥ 90; funciona offline para edição local.

---

## 13. Critérios de Conclusão (DoD)

| Critério | Verificação |
|---|---|
| Round-trip `.gcs` v5 sem perda | Diff vazio exceto `modified_date` |
| Cálculos corretos | Testes unitários passando; valores batem com `calc` do arquivo original |
| Auth + username único | Dois usuários com mesmo username → erro claro; feedback ≤ 500ms |
| Fichas persistidas no banco | Criar, editar, recarregar → dados intactos |
| Convite por username | Busca `@ArpoRJ` case-insensitive → membro adicionado |
| Convite por e-mail | E-mail enviado → link → conta criada → membro ativo |
| Submissão/aprovação | Fluxo pending → accepted → rejected funciona |
| Mesma ficha em vários grupos | Um `characters` → N `group_characters` |
| Tempo real GM ↔ Jogador | Edição do GM aparece sem recarregar |
| Proposta de reversão | Ciclo completo funciona |
| Regras GURPS intactas | Nenhuma alteração em custos de pontos ou fórmulas |
| Responsivo | Funciona em 320px (mobile) e 1440px (desktop) |
| Build estático | `npm run build` gera assets servíveis sem backend |

---

## 14. Traceability

| Fase | Arquivos-alvo | Verificação |
|---|---|---|
| 1 | `package.json`, `vite.config.ts`, `supabase/config.toml` | Build + dev server + supabase local |
| 2 | `supabase/migrations/`, `types/database.ts` | Migrations sem erro; RLS testada |
| 3 | `lib/auth.ts`, `hooks/useAuth.ts`, `pages/Landing.tsx`, `pages/Register.tsx`, `components/auth/RegisterForm.tsx` | Login → username único gerado; busca case-insensitive |
| 4 | `types/gcs.ts`, `io/` | Round-trip `.gcs` |
| 5 | `engine/` | Vitest — valores conferidos contra `calc` dos `.gcs` do repo |
| 6 | `store/`, `pages/Dashboard.tsx`, `pages/CharacterEdit.tsx` | CRUD fichas; recalc automático |
| 7 | `pages/GroupDetail.tsx`, `components/groups/` | Convites por username e e-mail |
| 8 | `components/groups/CharacterSubmit.tsx`, `components/gm/` | Submissão e aprovação |
| 9 | `pages/GmView.tsx`, `lib/realtime.ts` | Edição GM → jogador vê ao vivo |
| 10 | `components/groups/RevertProposal.tsx`, `components/gm/RevertApproval.tsx` | Reversão aprovada |
| 11 | `components/features/` | Ficha completa editável; todos os cálculos corretos |
| 12 | Toda a app | A11y, responsividade, PWA |

---

*Documentação gerada em abril de 2026. Referência externa: [GCS Desktop Docs](https://www.mintlify.com/richardwilkes/gcs/introduction) · [Repositório GCS](https://github.com/richardwilkes/gcs)*
