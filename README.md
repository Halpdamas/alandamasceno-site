# Alan Damasceno | Imóveis Fortaleza - CE

Sistema digital completo para corretores de imóveis autônomos: mini-site profissional, captura de leads com IA qualificadora, dashboard de decisão com indicadores-gatilho e armazenamento em nuvem (Supabase).

## Links

| Página | Link |
|---|---|
| Mini-site | `halpdamas.github.io/alan-damasceno` |
| Captura de leads | `halpdamas.github.io/alan-damasceno#lead` |
| Dashboard | `halpdamas.github.io/alan-damasceno#dash` |
| Deploy (Vercel) | `alandamasceno-site.vercel.app` |

## Stack

- **Frontend:** HTML + CSS + JS puro (vanilla)
- **Gráficos:** Chart.js 4.5.1
- **Exportação:** SheetJS (xlsx) + html2pdf.js
- **Banco:** Supabase (PostgreSQL) via REST API
- **Hospedagem:** Vercel (app) + GitHub Pages (redirect)
- **Domínio:** GitHub Pages (`github.io` para compatibilidade WhatsApp)

## Estrutura

```
├── alan-damasceno.html          # Mini-site principal
├── captura.html                 # Chatbot de qualificação de leads
├── dashboard-decisao.html       # Dashboard com indicadores, gráficos, exportação
├── alan.html / lead.html / dash.html  # Redirecionadores (páginas HTML diretas)
├── vercel.json                  # Configuração de deploys e rewrites
├── supabase-setup.sql           # Schema do banco (rodar no SQL Editor do Supabase)
├── assets/
│   ├── alan-foto.png            # Foto do perfil
│   └── alan-damasceno.vcf       # vCard para salvar contato
└── GoogleSheets_AppsScript.gs  # [Legado] Script para Google Sheets (não usar mais)
```

## Setup

1. Criar projeto no [Supabase](https://supabase.com)
2. Rodar `supabase-setup.sql` no SQL Editor
3. Copiar as credenciais (URL + Anon Key) para `captura.html` e `dashboard-decisao.html`
4. Fazer deploy no Vercel conectado ao repositório GitHub

## PRD completo

Veja [PRD.md](./PRD.md) para documentação completa do produto, análise de erros e guia de replicação.
