# PRD — Sistema Digital para Corretores de Imóveis

> **Produto:** Mini-site + Captura de Leads com IA + Dashboard de Decisão
> **Cliente piloto:** Alan Damasceno (CRECI 27671) — Fortaleza-CE
> **Versão:** 1.0
> **Data:** Julho 2026

---

## 1. Visão Geral

Sistema digital completo para corretores de imóveis autônomos que precisam de presença online profissional sem depender de agências ou plataformas caras. O corretor ganha um mini-site, um funil de captura com qualificação automática de leads, e um dashboard que indica o momento certo de escalar a operação.

### Público-alvo

- Corretores de imóveis autônomos (PF / MEI)
- Foco: médio/alto padrão e pré-lançamentos
- Região: Fortaleza-CE (adaptável para qualquer cidade)
- Perfil tech: baixo — precisa de algo que funcione sem configurar nada

---

## 2. Arquitetura do Sistema

```
┌──────────────────────────────────────────────────┐
│                 GitHub Pages                      │
│  halpdamas.github.io/alan-damasceno              │
│  (redirect com hash routing: #lead, #dash)        │
└──────────────┬───────────────────────────────────┘
               │ redirect
               ▼
┌──────────────────────────────────────────────────┐
│              Vercel (alandamasceno-site)          │
│  vercel.json: rewrites → .html files             │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Mini-site│  │ Captura  │  │  Dashboard      │  │
│  │  alan-   │  │ chatbot  │  │  decisão +      │  │
│  │ damasceno│  │ + scoring│  │  exportação     │  │
│  └──────────┘  └──────────┘  └────────────────┘  │
└──────────────┬───────────────────────────────────┘
               │ REST API (fetch)
               ▼
┌──────────────────────────────────────────────────┐
│              Supabase (PostgreSQL)                │
│  tabelas: leads, dashboard                       │
│  RLS: anon insert/select/update/delete           │
└──────────────────────────────────────────────────┘
```

### Fluxo de dados

```
Lead acessa captura → preenche perguntas
    → fetch POST /rest/v1/leads (Supabase)
    → Dashboard lê GET /rest/v1/leads + /rest/v1/dashboard
    → Dashboard mescla dados automaticamente
    → Exporta PDF/Excel com dados completos
```

---

## 3. Funcionalidades

### 3.1 Mini-site (`alan-damasceno.html`)
- Hero com foto, nome, CRECI, cidade
- Sobre o corretor
- 3 serviços: Compra & Venda, Pré-Lançamentos, Regularização (parceiro IMIBRA)
- Cartão digital com QR Code e botão "Salvar Contato" (vCard)
- Links: WhatsApp, Instagram, E-mail
- Meta tags Open Graph (preview WhatsApp/Facebook)
- Responsivo (mobile-first)

### 3.2 Captura de Leads (`captura.html`)
- Chatbot com 8 perguntas: nome, finalidade, orçamento, pagamento, bairro, prazo, WhatsApp, e-mail
- Scoring automático 0-100 baseado nas respostas
- Classificação: Quente (70+), Morno (45-69), Frio (<45)
- Botão "Falar com Alan" já no início (antes de responder)
- Contadores: leads hoje, taxa de qualificação
- Salva direto no Supabase via REST API

### 3.3 Dashboard de Decisão (`dashboard-decisao.html`)
- 7 indicadores-gatilho com meta e status (OK/Atenção/Abaixo)
- Veredito: "Pronto para escalar?" com barra de progresso
- Formulário para registrar semana: leads, qualificados, visitas, propostas, fechamentos, comissão, tráfego, tempo
- Tabela histórica com evolução semanal
- Gráfico (Chart.js): leads qualificados vs visitas
- Tabela de leads com perfil (edição inline), WhatsApp/E-mail, exclusão
- Painel de perfil do lead (bottom sheet no mobile)
- Regras de decisão (quando escalar)
- Exportar Excel (3 abas: Dashboard, Indicadores, Leads)
- Exportar PDF (A4 landscape, layout forçado desktop)
- Badge "☁️ Nuvem ativa" indicando conexão com Supabase

### 3.4 Integrações
- **Supabase:** banco PostgreSQL com API REST direta (anon key)
- **Google Sheets:** [LEGADO] Apps Script (não usar — mantido como referência)
- **WhatsApp Business App:** [MANUAL] configurar mensagem de ausência com link da captura
- **GitHub Pages:** redirect com hash routing (#lead, #dash) para compatibilidade WhatsApp

---

## 4. Setup para Novo Corretor

### 4.1 Repositório
```bash
# Clonar o template
git clone https://github.com/Halpdamas/alandamasceno-site.git novo-corretor
cd novo-corretor

# Alterar remote
git remote set-url origin https://github.com/SEU_USUARIO/novo-corretor.git

# Configurar Vercel (conectar repositório, deploy automático)
```

### 4.2 Supabase
```bash
# 1. Criar conta em https://supabase.com
# 2. Novo projeto
# 3. Pegar Project URL e Anon Key
# 4. Rodar supabase-setup.sql no SQL Editor
# 5. Colar credenciais em captura.html e dashboard-decisao.html
```

### 4.3 Personalização
| Arquivo | O que alterar |
|---|---|
| `alan-damasceno.html` | Nome, foto, CRECI, texto, WhatsApp, Instagram, cores |
| `captura.html` | WhatsApp, cores, perguntas (se necessário) |
| `dashboard-decisao.html` | WhatsApp, cores, metas (se necessário) |
| `assets/alan-foto.png` | Foto do corretor |
| `assets/alan-damasceno.vcf` | Dados de contato |
| `vercel.json` | Nada (genérico) |
| `supabase-setup.sql` | Nada (genérico) |

### 4.4 Cores (CSS custom properties)
```css
--primary: #1B2B4B;   /* Azul escuro */
--accent: #D4A017;    /* Dourado */
--bg: #F8F9FA;        /* Fundo claro */
```

### 4.5 Deploy
```bash
git add -A
git commit -m "personaliza para [NOME CORRETOR]"
git push origin main
# Vercel deploy automático
```

### 4.6 GitHub Pages (opcional — necessário para WhatsApp)
```bash
# Criar repo separado: SEU_USUARIO/nome-corretor
# index.html com redirect + hash routing
# Habilitar GitHub Pages (Settings → Pages → branch: master)
```

---

## 5. Análise de Erros e Lições Aprendidas

### 🔴 Erro 1: Múltiplos hops de redirect
**O que aconteceu:** O fluxo era: `github.io#lead` → Vercel `/lead` → Vercel rewrite → `lead.html` → JS redirect → `captura.html`
**Por que foi ruim:** Lento, frágil, difícil de debugar, cada hop pode falhar.
**O que fazer:** Usar um único redirect. O ideal é GitHub Pages com hash routing que vai direto para o HTML correto no Vercel. Melhor ainda: comprar domínio próprio e eliminar o GitHub Pages.
**Alternativa ideal:** Comprar domínio `.com.br` (~R$ 40/ano) e apontar DNS para Vercel. Um link só, sem redirect.

### 🔴 Erro 2: Remote apontando para repositório errado
**O que aconteceu:** O `origin` estava configurado para `clarity-finance-2` em vez de `alandamasceno-site`.
**Por que foi ruim:** `git push` falhava, confusão sobre onde o código estava, perda de tempo debugando.
**O que fazer:** Verificar `git remote -v` antes de qualquer push. Padronizar nome do remote como `origin`.

### 🔴 Erro 3: Branches main vs master desalinhadas
**O que aconteceu:** O repositório foi criado com `master`, o Vercel configurado para `master`, mas depois o desenvolvimento continuou em `main`.
**Por que foi ruim:** Toda alteração precisava ser sincronizada manualmente (`git push origin main:master`).
**O que fazer:** Desde o início: `git branch -M main` e configurar Vercel para branch `main`. Nunca ter duas branches de produção.

### 🔴 Erro 4: vercel.json sobrescrito por push errado
**O que aconteceu:** Ao forçar push de `main` para `master`, uma versão antiga do `vercel.json` (do projeto anterior `clarity2.html`) substituiu a versão correta, quebrando as rotas `/dash` e `/lead`.
**Por que foi ruim:** 404 silencioso, usuário descobriu o erro, perda de confiança.
**O que fazer:** Testar todas as rotas após cada deploy. Manter `vercel.json` versionado com cuidado. Usar CI para validar.

### 🔴 Erro 5: .gitignore listando arquivos do projeto
**O que aconteceu:** O `.gitignore` continha `alan-damasceno.html`, `dashboard-decisao.html`, etc. — os arquivos principais do projeto.
**Por que foi ruim:** Conceitualmente errado (gitignore é para ignorar, não para incluir). Se alguém clonasse o repo e desse `git add .`, os arquivos não seriam adicionados.
**O que fazer:** `.gitignore` deve conter apenas: `node_modules/`, `.env`, `*.log`, `dist/`, arquivos de sistema (`Thumbs.db`, `.DS_Store`).

### 🔴 Erro 6: Scripts de debug commitados no repo
**O que aconteceu:** 4 scripts Python (`check_file.py`, `check_script_tag.py`, `deep_scan.py`, `fix_apostrophes.py`) foram commitados.
**Por que foi ruim:** Polui o repositório, confunde outros desenvolvedores, aumenta o tamanho do clone.
**O que fazer:** Nunca commitar scripts de debug/exploração. Usar `.gitignore` com `*.py` se não fizer parte do projeto, ou deletar antes do commit.

### 🔴 Erro 7: Google Sheets antes do Supabase
**O que aconteceu:** Primeiro foi implementado com Google Sheets + Apps Script (no-cors, frágil), depois migrado para Supabase.
**Por que foi ruim:** Duplicação de esforço, código legado no repo, confusão sobre qual backend usar.
**O que fazer:** Escolher o backend antes de codificar. Supabase é superior em todos os aspectos: REST API direta, RLS, tempo real, sem limite de CORS, sem precisar de Apps Script.

### 🟡 Erro 8: WhatsApp .vercel.app não clicável (descoberta tardia)
**O que aconteceu:** Gastou-se tempo com TinyURL, redirect 308, páginas HTML diretas, até descobrir que o problema era o domínio `.vercel.app` não ser reconhecido como link clicável pelo WhatsApp mobile do usuário.
**O que fazer:** Testar no dispositivo-alvo desde o primeiro dia. Se o público usa WhatsApp mobile, testar o link no WhatsApp mobile antes de qualquer outra coisa.

### 🟡 Erro 9: Sem documentação até o final
**O que aconteceu:** README e PRD foram criados apenas no final do projeto.
**Por que foi ruim:** Dificuldade de onboarding, decisões arquiteturais não registradas, dificuldade de replicar.
**O que fazer:** Criar README na primeira semana. Manter PRD vivo durante o desenvolvimento.

### ✅ Acertos que devem ser repetidos

- **Hash routing no GitHub Pages** — solução elegante para contornar a limitação do WhatsApp sem comprar domínio
- **Clone + CSS forçado para PDF** — resolve o problema de capturar página completa em diferentes viewports
- **Supabase REST API direta** — sem SDK, sem dependência, fetch puro. Simples e eficaz.
- **Mobile-first CSS** — dashboard responsivo com tabelas que viram cards no celular
- **Score de qualificação** — algoritmo simples (pesos por resposta) que funciona sem IA pesada
- **Exportação client-side** — SheetJS + html2pdf rodam no navegador, zero server

---

## 6. Roadmap de Melhorias

### Prioridade alta
- [ ] **Domínio próprio** (`alandamasceno.com.br`) — elimina dependência de GitHub Pages e problema do WhatsApp
- [ ] **Template engine** — criar um gerador que recebe dados do corretor (JSON) e gera os 3 HTMLs automaticamente

### Prioridade média
- [ ] **Notificação de lead** — integração com Telegram ou e-mail quando novo lead chegar
- [ ] **Automação WhatsApp** — Tidio ou WATI para chatbot direto no WhatsApp (sem link)
- [ ] **Múltiplos corretores** — Supabase com RLS por `corretor_id` para um único deploy servir N corretores

### Prioridade baixa
- [ ] **Página de vendas** para o produto (landing para corretores comprarem o combo)
- [ ] **Tema customizável** via CSS variables (o corretor escolhe as cores)
- [ ] **Modo escuro** no dashboard
- [ ] **Importar leads** de CSV/XLSX

---

## 7. Modelo de Negócio

### Preço sugerido por corretor
| Item | Valor |
|---|---|
| Setup (personalização + deploy) | R$ 600 |
| Mensalidade (suporte + ajustes) | R$ 50 |
| **Total primeiro mês** | **R$ 650** |
| **Mensalidade a partir do 2º mês** | **R$ 50** |

### Comissão por indicação
- 20% sobre o setup (R$ 120 por venda) para quem indicar
- 10% sobre a mensalidade (R$ 5/mês recorrente)

### Estrutura de custos por corretor
| Item | Custo |
|---|---|
| Vercel (Hobby) | R$ 0 |
| Supabase (Free) | R$ 0 |
| Domínio .com.br | ~R$ 40/ano |
| GitHub Pages | R$ 0 |
| **Total** | **~R$ 3,33/mês** |

---

## 8. Passo a Passo de Desenvolvimento (do zero, sem erros)

Este é o roteiro para construir o sistema **do início** para um novo corretor, aplicando todas as lições aprendidas.

### Fase 0 — Planejamento (30 min)

- [ ] Definir o público: corretor autônomo (PF/MEI), cidade, segmento
- [ ] Coletar assets: foto (quadrada, 500x500px), WhatsApp, Instagram, CRECI, cores da marca
- [ ] Decidir stack ANTES de codificar:
  ```json
  Frontend: HTML + CSS + JS vanilla
  Gráficos: Chart.js
  Exportação: SheetJS + html2pdf
  Banco: Supabase (PostgreSQL) — NUNCA Google Sheets
  Hospedagem: Vercel + (opcional) GitHub Pages para WhatsApp
  Domínio ideal: .com.br próprio (~R$ 40/ano)
  ```
- [ ] Definir arquitetura de routing:
  ```
  Domínio próprio → Vercel → HTML direto
  ├── /          → mini-site
  ├── /lead      → captura  
  └── /dash      → dashboard
  ```
- [ ] Criar repositório GitHub com branch `main`

### Fase 1 — Mini-site (1-2h)

- [ ] Criar `alan-damasceno.html` com:
  - Meta tags OG (title, description, image, url — apontando para o domínio final)
  - Google Fonts (Inter)
  - CSS variables para as cores da marca
  - Hero: foto, nome, CRECI, cidade, WhatsApp
  - Seção "Sobre"
  - Serviços (cards)
  - Cartão digital com QR Code (api.qrserver.com) + vCard
  - Footer com links
- [ ] Criar `assets/alan-damasceno.vcf` com dados de contato
- [ ] **Testar responsivo** no celular e WhatsApp

### Fase 2 — Supabase (1h)

- [ ] Criar conta em [supabase.com](https://supabase.com)
- [ ] Novo projeto
- [ ] Pegar Project URL + Anon Key (Settings → API)
- [ ] Rodar `supabase-setup.sql` no SQL Editor — cria tabelas `leads` e `dashboard` com RLS anon

### Fase 3 — Captura de Leads (2-3h)

- [ ] Criar `captura.html` com:
  - Chatbot com perguntas (definir quais campos capturar)
  - Score map (pesos por resposta)
  - Classificação: Quente/Morno/Frio
  - Botão "Falar com [Nome]" no topo (WhatsApp direto)
  - Salvar no Supabase via REST API:
    ```js
    fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ nome, finalidade, orcamento, ... })
    })
    ```
  - Contadores: leads hoje, taxa de qualificação (lendo do Supabase)
  - **NÃO** usar Google Sheets
  - **NÃO** exibir JSON/raw data na interface
- [ ] **Testar:** preencher formulário → verificar se aparece no Supabase Table Editor

### Fase 4 — Dashboard de Decisão (3-4h)

- [ ] Criar `dashboard-decisao.html` com:
  - Hero com badge de conexão (☁️ Nuvem ativa / 💾 Local)
  - Card de veredito com barra de progresso (0-7 indicadores)
  - Grid de 7 indicadores-gatilho (cada um: label, valor, meta, status)
  - Formulário "Registrar Semana" (8 campos numéricos)
  - Botões: Registrar Semana, Limpar Histórico
  - Tabela de histórico semanal (com dados mesclados dos leads)
  - Gráfico Chart.js (leads qualificados vs visitas)
  - Tabela de leads (com perfil, edição, exclusão, WhatsApp/E-mail inline)
  - Regras de decisão (cards no mobile, tabela no desktop)
  - Exportar Excel (3 abas: Dashboard, Indicadores, Leads)
  - Exportar PDF (clone com CSS forçado desktop + A4 landscape)
  - Ler do Supabase via REST API:
    ```js
    fetch(`${SUPABASE_URL}/rest/v1/leads?select=*&order=created_at.desc`, { headers: supabaseHeaders() })
    fetch(`${SUPABASE_URL}/rest/v1/dashboard?select=*&order=semana.asc`, { headers: supabaseHeaders() })
    ```
  - Salvar dashboard no Supabase via POST
  - **Toda operação (registrar, editar, excluir lead) → Supabase** (nunca localStorage)
- [ ] **Testar:** registrar semana → recarregar → dados persistem

### Fase 5 — Routing e Deploy (1h)

- [ ] Criar `vercel.json` com rewrites:
  ```json
  { "source": "/", "destination": "/alan-damasceno.html" },
  { "source": "/lead", "destination": "/lead.html" },
  { "source": "/dash", "destination": "/dash.html" }
  ```
- [ ] Criar `lead.html` (redirect JS para captura.html) e `dash.html` (redirect JS para dashboard-decisao.html)
- [ ] Conectar repositório ao Vercel (branch: `main`)
- [ ] **Testar TODAS as rotas:**
  ```bash
  curl -I https://alandamasceno-site.vercel.app     # → 200
  curl -I https://alandamasceno-site.vercel.app/lead # → 200
  curl -I https://alandamasceno-site.vercel.app/dash # → 200
  ```

### Fase 6 — Compatibilidade WhatsApp (1h) — SE NECESSÁRIO

**Se o corretor NÃO tiver domínio próprio (usa .vercel.app):**
- [ ] Criar repositório GitHub separado (ex: `halpdamas/alan-damasceno`)
- [ ] Criar `index.html` com redirect + hash routing:
  ```js
  var h = location.hash.replace('#','');
  var map = { lead:'/lead', dash:'/dash' };
  var url = 'https://SEU_SITE.vercel.app' + (map[h] || '');
  window.location.href = url;
  ```
- [ ] Habilitar GitHub Pages (Settings → Pages → branch: master)
- [ ] **Testar no WhatsApp mobile:**
  ```
  https://halpdamas.github.io/alan-damasceno
  https://halpdamas.github.io/alan-damasceno#lead
  https://halpdamas.github.io/alan-damasceno#dash
  ```

**Solução definitiva:** comprar domínio próprio e apontar DNS para Vercel — elimina o redirect e funciona em qualquer lugar.

### Fase 7 — Documentação e Finalização (1h)

- [ ] Criar `README.md` com links, stack, setup rápido
- [ ] Criar `PRD.md` com documentação completa
- [ ] Limpar: deletar scripts de debug, arquivos legados, `.gitignore` correto
- [ ] Verificar `.gitignore`:
  ```
  node_modules/
  .env
  *.log
  Thumbs.db
  .DS_Store
  ```
- [ ] Último commit → push → testar tudo de novo
- [ ] **Entregar para o corretor:**
  - 3 links (site, captura, dashboard)
  - Instruções do WhatsApp Business App (mensagem de ausência)
  - Instruções de como enviar os links no Status do WhatsApp

### Fase 8 — Pós-entrega

- [ ] Monitorar se os leads estão chegando no Supabase
- [ ] Ajustar metas do dashboard conforme o corretor usa
- [ ] Oferecer upgrade: chatbot WhatsApp direto (Tidio ~R$ 120/mês)
- [ ] Oferecer domínio próprio (cobrar à parte ou incluso)

---

## 9. Checklist de Replicação

### Pré-requisitos
- [ ] Conta GitHub
- [ ] Conta Vercel (gratuita)
- [ ] Conta Supabase (gratuita)
- [ ] Foto do corretor (quadrada, boa qualidade)
- [ ] Número de WhatsApp
- [ ] Instagram (opcional)
- [ ] CRECI
- [ ] Cores da marca

### Setup (1-2 horas)
- [ ] Clonar repositório template
- [ ] Criar projeto Supabase e rodar SQL
- [ ] Colar credenciais Supabase nos HTMLs
- [ ] Personalizar HTMLs (foto, nome, WhatsApp, texto)
- [ ] Gerar vCard com dados do corretor
- [ ] Fazer deploy no Vercel
- [ ] Testar todas as rotas no navegador
- [ ] Testar todos os links no WhatsApp mobile
- [ ] [Opcional] Criar GitHub Pages para redirect
- [ ] [Opcional] Comprar domínio próprio
- [ ] Configurar WhatsApp Business App

### Checklist técnico pós-deploy
- [ ] `alandamasceno-site.vercel.app` → 200
- [ ] `alandamasceno-site.vercel.app/lead` → 200
- [ ] `alandamasceno-site.vercel.app/dash` → 200
- [ ] Captura salva lead no Supabase
- [ ] Dashboard carrega leads do Supabase
- [ ] Dashboard registra semana no Supabase
- [ ] Exportar Excel baixa com 3 abas
- [ ] Exportar PDF gera página completa
- [ ] QR Code no mini-site leva ao link certo
- [ ] vCard baixa corretamente
- [ ] Meta tags OG mostram preview no WhatsApp
- [ ] Botão "Falar com Alan" na captura funciona
- [ ] Perfil do lead abre com todos os dados
- [ ] Edição de lead salva no Supabase
- [ ] Exclusão de lead remove no Supabase

---

## 10. Contato

**Produto desenvolvido para:** Alan Damasceno — CRECI 27671
**Instagram:** @alanpdamasceno
**WhatsApp:** +55 85 98963-3522
**Repositório:** github.com/Halpdamas/alandamasceno-site
**Deploy:** alandamasceno-site.vercel.app
