# Integração com Google Sheets — Alan Damasceno

Siga estes passos **uma única vez** para que os dados fiquem salvos na nuvem e o Alan possa acessar o dashboard de **qualquer dispositivo** (celular, tablet, PC).

---

## ⚙️ Passo 1 — Criar a planilha

1. Acesse [sheets.new](https://sheets.new)
2. Renomeie a planilha para **"Leads Alan Damasceno"**
3. Não precisa criar abas — o script cria automaticamente

---

## 🤖 Passo 2 — Criar o Apps Script

1. Com a planilha aberta, vá em **Extensões → Apps Script**
2. **Apague** o código padrão
3. Abra o arquivo `GoogleSheets_AppsScript.gs` (está na pasta do projeto), copie todo o conteúdo e cole no Apps Script
4. Clique em **Salvar** (ícone de disquete) e nomeie como **"LeadsAPI"**
5. Clique em **"Implantar" → "Novo deployment"**
6. Configure:
   - **Tipo:** Web app
   - **Descrição:** "API Leads Alan Damasceno"
   - **Executar como:** "Eu" (sua conta) ✓
   - **Quem tem acesso:** "Qualquer pessoa" ✓
7. Clique em **"Implantar"**
8. Na tela de autorização, clique em **"Permitir"**
9. **Copie a URL gerada** (tipo `https://script.google.com/macros/s/abc123/exec`)

---

## 🔗 Passo 3 — Colar a URL nos arquivos

### No arquivo `captura.html`:

1. Abra `captura.html` na pasta do projeto
2. Localize esta linha (perto do `SCORE_MAP`):
   ```javascript
   // const SCRIPT_URL = "https://script.google.com/macros/s/SEU_ID_AQUI/exec";
   ```
3. **Apague o `//`** e cole a URL que copiou:
   ```javascript
   const SCRIPT_URL = "https://script.google.com/macros/s/abc123/exec";
   ```

### No arquivo `dashboard-decisao.html`:

1. Abra `dashboard-decisao.html`
2. Localize a linha igual (perto do `getLeads()`):
   ```javascript
   // const SCRIPT_URL = "https://script.google.com/macros/s/SEU_ID_AQUI/exec";
   ```
3. Faça o mesmo: remova `//` e cole a URL

---

## 🚀 Passo 4 — Publicar

No terminal do projeto:

```powershell
cd "C:\Users\halui\OneDrive\Documentos\New OpenCode Project"
git add -A
git commit -m "ativa nuvem com Google Sheets"
git push
```

O Vercel atualiza sozinho em 1 minuto.

---

## ✅ Como testar se funcionou

1. Abra a captura: [alandamasceno-site.vercel.app/captura.html](https://alandamasceno-site.vercel.app/captura.html)
2. Preencha como se fosse um cliente
3. Abra o **Google Sheets** — a aba "Leads" vai ter os dados
4. Abra o dashboard: [alandamasceno-site.vercel.app/dashboard-decisao.html](https://alandamasceno-site.vercel.app/dashboard-decisao.html)
5. No topo aparece o badge **"☁️ Nuvem ativa"**

---

## 📱 Agora funciona de qualquer lugar

| O quê | Antes | Depois |
|---|---|---|
| Leads capturados | Só no PC | Google Sheets (qualquer dispositivo) |
| Dashboard semanal | Só no PC | Google Sheets (qualquer dispositivo) |
| Acessar de casa | Não dava | Abre no celular, tablet, qualquer PC |
| Perder dados | Se formatar o PC, perdia | Tudo na nuvem |

---

## ⚡ Dica rápida

Para o Alan registrar a semana no dashboard:
1. Abre o link do dashboard **no celular**
2. Preenche os campos do formulário
3. Clica em **"+ Registrar Semana"**
4. Os dados vão pro Google Sheets e aparecem em qualquer lugar

**Só precisa configurar uma vez.** Depois é só usar.
