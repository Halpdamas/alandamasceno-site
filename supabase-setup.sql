-- Supabase Setup - Alan Damasceno Leads + Dashboard
-- Rodar uma vez no SQL Editor:
-- https://supabase.com/dashboard/project/qukcsvmtokjgldkatysp/sql/new

-- ===== LEADS =====
CREATE TABLE IF NOT EXISTS leads (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nome TEXT,
  finalidade TEXT,
  orcamento TEXT,
  pagamento TEXT,
  bairro TEXT,
  prazo TEXT,
  whatsapp TEXT,
  email TEXT,
  score INT DEFAULT 0,
  temperatura TEXT DEFAULT 'Frio'
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_leads" ON leads;
CREATE POLICY "anon_select_leads" ON leads FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_leads" ON leads;
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE TO anon USING (true);

DROP POLICY IF EXISTS "anon_delete_leads" ON leads;
CREATE POLICY "anon_delete_leads" ON leads FOR DELETE TO anon USING (true);

-- ===== DASHBOARD =====
CREATE TABLE IF NOT EXISTS dashboard (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  semana TEXT,
  leads INT DEFAULT 0,
  qualificados INT DEFAULT 0,
  visitas INT DEFAULT 0,
  propostas INT DEFAULT 0,
  fechamentos INT DEFAULT 0,
  comissao DECIMAL(10,2) DEFAULT 0,
  trafego DECIMAL(10,2) DEFAULT 0,
  tempo INT DEFAULT 7
);

ALTER TABLE dashboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_dashboard" ON dashboard;
CREATE POLICY "anon_insert_dashboard" ON dashboard FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_dashboard" ON dashboard;
CREATE POLICY "anon_select_dashboard" ON dashboard FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "anon_update_dashboard" ON dashboard;
CREATE POLICY "anon_update_dashboard" ON dashboard FOR UPDATE TO anon USING (true);

DROP POLICY IF EXISTS "anon_delete_dashboard" ON dashboard;
CREATE POLICY "anon_delete_dashboard" ON dashboard FOR DELETE TO anon USING (true);
