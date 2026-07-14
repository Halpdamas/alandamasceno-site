# Integração com Google Sheets — Alan Damasceno

Siga estes passos para salvar os leads na nuvem (acessível de qualquer lugar).

---

## Passo 1 — Criar a planilha

1. Acesse [sheets.new](https://sheets.new) (cria uma planilha nova)
2. Renomeie para **"Leads Alan Damasceno"**
3. Deixe a primeira linha em branco (o script preenche automaticamente)

---

## Passo 2 — Criar o Apps Script

1. No Google Sheets, vá em **Extensões → Apps Script**
2. Apague o código padrão e **cole** o conteúdo do arquivo `GoogleSheets_AppsScript.gs`
3. Clique em **Salvar** (ícone de disquete) e dê o nome **"LeadsAPI"**
4. Clique em **"Implantar" → "Novo deployment"**
5. Em "Tipo", escolha **"Web app"**
6. Preencha:
   - **Descrição:** "API Leads Alan Damasceno"
   - **Executar como:** "Eu" (sua conta)
   - **Quem tem acesso:** "Qualquer pessoa"
7. Clique em **"Implantar"**
8. **Autorize** o aplicativo (sua conta Google)
9. **Copie a URL gerada** (algo como `https://script.google.com/macros/s/abc123/exec`)

---

## Passo 3 — Colar a URL nos arquivos

1. Abra o arquivo **`captura.html`**
2. Localize a linha: `// const SCRIPT_URL = "https://script.google.com/macros/s/SEU_ID_AQUI/exec";`
3. **Remova o `//`** do início e cole a URL copiada
4. Faça o **mesmo** no arquivo **`dashboard-decisao.html`**

---

## Passo 4 — Publicar

No terminal:

```powershell
cd "C:\Users\halui\OneDrive\Documentos\New OpenCode Project"
git add -A
git commit -m "ativa integracao com Google Sheets"
git push
```

Pronto — o Vercel atualiza sozinho.

---

## Como testar

1. Acesse a captura: https://alandamasceno-site.vercel.app/captura.html
2. Preencha os dados de um lead
3. Volte ao Google Sheets e veja se a linha apareceu
4. No dashboard, o badge "☁️ Nuvem ativa" confirma que está conectado

---

## Dica

Os dados ficam salvos **tanto na nuvem quanto no navegador**. Se a internet cair, o lead fica salvo no localStorage e sincroniza quando voltar.
