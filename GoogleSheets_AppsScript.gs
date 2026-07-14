/**
 * Google Apps Script — Alan Damasceno Leads
 * 
 * COMO USAR:
 * 1. Crie uma planilha no Google Sheets
 * 2. Vá em Extensões → Apps Script
 * 3. Cole este código
 * 4. Implante → Novo deployment → Web app
 *    - Executar como: "Eu" (sua conta)
 *    - Quem tem acesso: "Qualquer pessoa"
 * 5. Copie a URL gerada e cole no lugar de SCRIPT_URL nos arquivos HTML
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Cria cabeçalho se estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Nome", "Finalidade", "Orcamento", "Pagamento",
        "Bairro", "Prazo", "WhatsApp", "Email", "Score", "Temperatura"
      ]);
    }
    
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      new Date().toISOString(),
      data.respostas.nome || "",
      data.respostas.finalidade || "",
      data.respostas.orcamento || "",
      data.respostas.pagamento || "",
      data.respostas.bairro || "",
      data.respostas.prazo || "",
      data.respostas.whatsapp || "",
      data.respostas.email || "",
      data.score || 0,
      data.temperatura || "Frio"
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    
    if (rows.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ leads: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = rows[0];
    const leads = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const respostas = {};
      headers.forEach((h, idx) => {
        if (h !== "Timestamp" && h !== "Score" && h !== "Temperatura") {
          respostas[h.toLowerCase()] = row[idx] || "";
        }
      });
      leads.push({
        data: row[0] || "",
        respostas: respostas,
        score: parseInt(row[9]) || 0,
        temperatura: row[10] || "Frio"
      });
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ leads }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ leads: [], error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
