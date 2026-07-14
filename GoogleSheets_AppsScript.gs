/**
 * Google Apps Script — Alan Damasceno Leads + Dashboard
 *
 * COMO USAR:
 * 1. Crie uma planilha no Google Sheets (ex: "Leads Alan Damasceno")
 * 2. Vá em Extensões → Apps Script
 * 3. Cole este código, salve e implante como Web App
 *    - Executar como: "Eu" ✓
 *    - Quem tem acesso: "Qualquer pessoa" ✓
 * 4. Copie a URL gerada e cole em captura.html e dashboard-decisao.html
 *
 * A planilha terá 2 abas (sheets):
 *   - "Leads" → respostas da captura
 *   - "Dashboard" → registros semanais do Alan
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // ---- LEADS (da captura) ----
    if (data.tipo === "lead") {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads")
                   || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");

      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "Timestamp", "Nome", "Finalidade", "Orcamento", "Pagamento",
          "Bairro", "Prazo", "WhatsApp", "Email", "Score", "Temperatura"
        ]);
      }

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

      return jsonRes({ success: true, tipo: "lead" });
    }

    // ---- DASHBOARD SEMANAL ----
    if (data.tipo === "dashboard") {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard")
                   || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Dashboard");

      if (sheet.getLastRow() === 0) {
        sheet.appendRow([
          "Semana", "Leads", "Qualificados", "Visitas", "Propostas",
          "Fechamentos", "Comissao", "Trafego", "Tempo"
        ]);
      }

      // Se tiver dados do form, salva
      if (data.semana) {
        // Verifica se ja existe registro para essa semana
        const existing = sheet.getDataRange().getValues();
        let found = -1;
        for (let i = 1; i < existing.length; i++) {
          if (existing[i][0] === data.semana) { found = i; break; }
        }

        const row = [
          data.semana, data.leads || 0, data.qualificados || 0,
          data.visitas || 0, data.propostas || 0, data.fechamentos || 0,
          data.comissao || 0, data.trafego || 0, data.tempo || 7
        ];

        if (found > 0) {
          // Atualiza linha existente
          sheet.getRange(found + 1, 1, 1, row.length).setValues([row]);
        } else {
          sheet.appendRow(row);
        }
      }

      // Retorna todos os registros do dashboard
      const rows = sheet.getDataRange().getValues();
      const registros = [];
      for (let i = 1; i < rows.length; i++) {
        registros.push({
          semana: rows[i][0] || "",
          leads: parseInt(rows[i][1]) || 0,
          qualificados: parseInt(rows[i][2]) || 0,
          visitas: parseInt(rows[i][3]) || 0,
          propostas: parseInt(rows[i][4]) || 0,
          fechamentos: parseInt(rows[i][5]) || 0,
          comissao: parseFloat(rows[i][6]) || 0,
          trafego: parseFloat(rows[i][7]) || 0,
          tempo: parseInt(rows[i][8]) || 7
        });
      }

      return jsonRes({ success: true, tipo: "dashboard", registros });
    }

    return jsonRes({ success: false, error: "tipo desconhecido" });

  } catch (err) {
    return jsonRes({ success: false, error: err.toString() });
  }
}

function doGet(e) {
  try {
    const tipo = e.parameter.tipo || "leads";
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ---- LEADS ----
    if (tipo === "leads") {
      const sheet = ss.getSheetByName("Leads");
      if (!sheet || sheet.getLastRow() <= 1) {
        return jsonRes({ leads: [] });
      }

      const rows = sheet.getDataRange().getValues();
      const headers = rows[0];
      const leads = [];

      for (let i = 1; i < rows.length; i++) {
        const respostas = {};
        headers.forEach((h, idx) => {
          if (h !== "Timestamp" && h !== "Score" && h !== "Temperatura") {
            respostas[h.toLowerCase()] = String(rows[i][idx] || "");
          }
        });
        leads.push({
          data: rows[i][0] || "",
          respostas: respostas,
          score: parseInt(rows[i][9]) || 0,
          temperatura: rows[i][10] || "Frio"
        });
      }

      return jsonRes({ leads });
    }

    // ---- DASHBOARD ----
    if (tipo === "dashboard") {
      const sheet = ss.getSheetByName("Dashboard");
      if (!sheet || sheet.getLastRow() <= 1) {
        return jsonRes({ registros: [] });
      }

      const rows = sheet.getDataRange().getValues();
      const registros = [];
      for (let i = 1; i < rows.length; i++) {
        registros.push({
          semana: rows[i][0] || "",
          leads: parseInt(rows[i][1]) || 0,
          qualificados: parseInt(rows[i][2]) || 0,
          visitas: parseInt(rows[i][3]) || 0,
          propostas: parseInt(rows[i][4]) || 0,
          fechamentos: parseInt(rows[i][5]) || 0,
          comissao: parseFloat(rows[i][6]) || 0,
          trafego: parseFloat(rows[i][7]) || 0,
          tempo: parseInt(rows[i][8]) || 7
        });
      }

      return jsonRes({ registros });
    }

    return jsonRes({ error: "tipo invalido" });

  } catch (err) {
    return jsonRes({ error: err.toString() });
  }
}

function jsonRes(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
