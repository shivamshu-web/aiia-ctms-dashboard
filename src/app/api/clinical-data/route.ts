import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initSchema(client: any) {
  await client.query(`
    -- 1. Studies
    CREATE TABLE IF NOT EXISTS clinical_studies (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      phase VARCHAR(50) NOT NULL,
      sites_count INT DEFAULT 1,
      enrolled INT DEFAULT 0,
      target INT DEFAULT 100,
      status VARCHAR(50) DEFAULT 'Ongoing',
      ctri_number VARCHAR(100),
      therapeutic_area TEXT,
      herbal_formulation TEXT,
      pi_name VARCHAR(100) DEFAULT 'Dr. Aanchal Singh',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Protocols & IEC
    CREATE TABLE IF NOT EXISTS protocol_approvals (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) REFERENCES clinical_studies(study_id) ON DELETE CASCADE,
      version VARCHAR(20) DEFAULT 'v1.0',
      iec_committee VARCHAR(150) DEFAULT 'AIIA Institutional Ethics Committee',
      iec_date DATE DEFAULT CURRENT_DATE,
      status VARCHAR(50) DEFAULT 'Approved',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Sites
    CREATE TABLE IF NOT EXISTS clinical_sites (
      id SERIAL PRIMARY KEY,
      site_code VARCHAR(50) UNIQUE NOT NULL,
      institution_name TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      pi_name VARCHAR(100) NOT NULL,
      enrolled INT DEFAULT 0,
      target INT DEFAULT 100,
      audit_status VARCHAR(50) DEFAULT 'GCP Cleared',
      next_monitoring_visit DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 4. Patients
    CREATE TABLE IF NOT EXISTS trial_patients (
      id SERIAL PRIMARY KEY,
      subject_id VARCHAR(50) UNIQUE NOT NULL,
      study_id VARCHAR(50) REFERENCES clinical_studies(study_id) ON DELETE CASCADE,
      age INT NOT NULL,
      gender VARCHAR(20) NOT NULL,
      prakriti VARCHAR(50),
      consent_date DATE DEFAULT CURRENT_DATE,
      stage VARCHAR(50) DEFAULT 'Dosing',
      compliance_rate INT DEFAULT 98,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. REAL Monitoring Visits Logs
    CREATE TABLE IF NOT EXISTS cra_monitoring_logs (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) NOT NULL,
      site_name TEXT NOT NULL,
      visit_type VARCHAR(100) NOT NULL,
      cra_auditor VARCHAR(100) NOT NULL,
      visit_date DATE DEFAULT CURRENT_DATE,
      deviations_flagged VARCHAR(100) DEFAULT '0 Deviations',
      mvr_status VARCHAR(50) DEFAULT 'Approved & Signed'
    );

    -- 6. REAL eCRF Data Queries
    CREATE TABLE IF NOT EXISTS ecrf_data_queries (
      id SERIAL PRIMARY KEY,
      query_id VARCHAR(50) UNIQUE NOT NULL,
      study_id VARCHAR(50) NOT NULL,
      subject_id VARCHAR(50) NOT NULL,
      ecrf_section VARCHAR(100) NOT NULL,
      discrepancy_note TEXT NOT NULL,
      severity VARCHAR(20) DEFAULT 'Low',
      status VARCHAR(50) DEFAULT 'Resolved'
    );

    -- 7. REAL Study Milestones
    CREATE TABLE IF NOT EXISTS study_milestones (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) NOT NULL,
      protocol_name TEXT NOT NULL,
      phase VARCHAR(50) NOT NULL,
      progress_pct INT DEFAULT 0,
      stage_details TEXT,
      target_lpo_date VARCHAR(50)
    );

    -- 8. REAL Close-Out Workflow Checklist
    CREATE TABLE IF NOT EXISTS trial_closeout_checklist (
      id SERIAL PRIMARY KEY,
      step_name TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      audit_details TEXT
    );
  `);

  // Initial Seed for fresh Neon databases
  const count = await client.query('SELECT count(*) FROM clinical_studies');
  if (parseInt(count.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO clinical_studies (study_id, title, phase, sites_count, enrolled, target, status, ctri_number, therapeutic_area, herbal_formulation, pi_name) VALUES
      ('AIIA-CT-001', 'Clinical Evaluation of Nishamalaki in Type 2 Diabetes Mellitus', 'Phase III', 5, 312, 400, 'Ongoing', 'CTRI/2025/03/048912', 'Metabolic Disorders / Endocrinology', 'Nishamalaki Vati (Haridra + Amalaki)', 'Dr. Aanchal Singh'),
      ('AIIA-CT-002', 'Evaluation of Ayurvedic Rasayana in Post-Chemotherapy Quality of Life', 'Phase II', 4, 248, 300, 'Ongoing', 'CTRI/2025/08/059124', 'Integrative Oncology & Palliative Care', 'Chyawanprash Awaleha + Guduchi Swarasa', 'Dr. Aanchal Singh'),
      ('AIIA-CT-003', 'Evaluation of Standardized Ashwagandha in Chronic Fatigue Syndrome', 'Phase III', 6, 196, 250, 'On Hold', 'CTRI/2025/05/051280', 'Neuro-Immunology & Stress Adaptation', 'Withania somnifera Extract (5% Withanolides)', 'Dr. Aanchal Singh'),
      ('AIIA-CT-004', 'Efficacy of Haridra & Guggulu in Osteoarthritis Management', 'Phase I', 3, 142, 200, 'Ongoing', 'CTRI/2025/09/061299', 'Rheumatology & Musculoskeletal Disorders', 'Yogaraj Guggulu + Curcumin 95%', 'Dr. Aanchal Singh'),
      ('AIIA-CT-005', 'Clinical Safety Assessment of Guduchi Formulations', 'Phase II', 5, 87, 150, 'Planning', 'CTRI/2026/01/072111', 'Immunology & Clinical Pharmacology', 'Guduchi Ghana Vati', 'Dr. Aanchal Singh');

      INSERT INTO cra_monitoring_logs (study_id, site_name, visit_type, cra_auditor, visit_date, deviations_flagged, mvr_status) VALUES
      ('AIIA-CT-001', 'AIIA Apex Centre, New Delhi', 'Routine Interim Monitoring (IMV)', 'Dr. S. K. Raman', '2026-09-28', '0 Deviations', 'Approved & Signed'),
      ('AIIA-CT-002', 'NIA Hospital, Jaipur', 'Interim Monitoring Visit (IMV-2)', 'Dr. P. Sharma', '2026-09-22', '1 Minor (Window +2d)', 'Approved & Signed'),
      ('AIIA-CT-003', 'Faculty of Ayurveda, IMS BHU', 'Quality Oversight Audit', 'Dr. R. Mishra', '2026-09-15', '1 Minor (Pill Count Log)', 'CAPA Resolved'),
      ('AIIA-CT-004', 'IPGT&RA, Gujarat University', 'Site Initiation Visit (SIV)', 'Dr. M. Patel', '2026-09-08', '0 Deviations', 'Approved & Signed');

      INSERT INTO ecrf_data_queries (query_id, study_id, subject_id, ecrf_section, discrepancy_note, severity, status) VALUES
      ('QRY-0841', 'AIIA-CT-001', 'SUBJ-AIIA-0101', 'Biochemical Labs (HbA1c)', 'Fasting glucose value 142 mg/dL requires secondary physician signoff', 'Low', 'Resolved'),
      ('QRY-0842', 'AIIA-CT-001', 'SUBJ-AIIA-0102', 'Concomitant Medication', 'Verify herbal adjuvant dosage timing with meal diary log', 'Medium', 'In Progress'),
      ('QRY-0843', 'AIIA-CT-002', 'SUBJ-AIIA-0205', 'Prakriti Assessment', 'Reconfirm Pitta sub-score calculation verification', 'Low', 'Resolved'),
      ('QRY-0844', 'AIIA-CT-003', 'SUBJ-AIIA-0310', 'Inclusion Criteria', 'Baseline Fatigue Severity Scale score confirmation', 'High', 'Investigator Review');

      INSERT INTO study_milestones (study_id, protocol_name, phase, progress_pct, stage_details, target_lpo_date) VALUES
      ('AIIA-CT-001', 'Nishamalaki Diabetes Trial', 'Phase III', 78, 'Subject Recruitment 78% • Interim Bio-Analysis', 'Target LPO: Jan 2027'),
      ('AIIA-CT-002', 'Rasayana Oncology Trial', 'Phase II', 84, 'Patient Randomization Complete • Dosing Follow-up', 'Target LPO: Nov 2026'),
      ('AIIA-CT-003', 'Ashwagandha Fatigue Trial', 'Phase III', 65, 'Mid-term IEC Audit • Secondary Endpoint Testing', 'Target LPO: Mar 2027'),
      ('AIIA-CT-004', 'Haridra & Guggulu Osteoarthritis', 'Phase I', 72, 'Dose Escalation Complete • Pharmacokinetic Curve', 'Target LPO: Dec 2026'),
      ('AIIA-CT-005', 'Guduchi Formulations Trial', 'Phase II', 40, 'Site Initiation Visits (SIV) • Screening Cohort', 'Target LPO: May 2027');

      INSERT INTO trial_closeout_checklist (step_name, status, audit_details) VALUES
      ('1. Subject Data Lock & eCRF Verification', 'Completed', 'All 248 patient eCRFs resolved, queried, and locked with CRA digital signatures.'),
      ('2. Safety Reconciliation with NPVCC', 'Completed', 'All adverse drug events (ADR/SAE) reconciled with National Pharmacovigilance Centre and CDSCO portal.'),
      ('3. Investigational Ayurvedic Medicine Reconciliation', 'Completed', 'Pharmacy logs, dispensed bottles, returned packets, and destruction certificates fully accounted.'),
      ('4. Site Close-Out Visits (COV) & Investigator Signatures', 'In Progress (90%)', 'AIIA New Delhi and NIA Jaipur COV visits completed. BHU close-out scheduled for next week.'),
      ('5. Clinical Study Report (CSR) & CTRI Result Disclosure', 'Draft Ready', 'ICH E3 structured CSR drafting underway for submission to Ministry of Ayush.');
    `);
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tab = searchParams.get('tab') || 'study-management';

  try {
    const client = await pool.connect();
    try {
      await initSchema(client);
      let data: any = {};

      if (tab === 'study-management' || tab === 'all') {
        const res = await client.query('SELECT * FROM clinical_studies ORDER BY id ASC');
        data.studies = res.rows;
      }
      if (tab === 'protocols' || tab === 'all') {
        const res = await client.query(`
          SELECT p.*, s.title as study_title, s.ctri_number 
          FROM protocol_approvals p
          JOIN clinical_studies s ON p.study_id = s.study_id
          ORDER BY p.id ASC
        `);
        data.protocols = res.rows;
      }
      if (tab === 'sites' || tab === 'all') {
        const res = await client.query('SELECT * FROM clinical_sites ORDER BY id ASC');
        data.sites = res.rows;
      }
      if (tab === 'patients' || tab === 'all') {
        const res = await client.query(`
          SELECT p.*, s.title as study_title 
          FROM trial_patients p
          JOIN clinical_studies s ON p.study_id = s.study_id
          ORDER BY p.id ASC
        `);
        data.patients = res.rows;
      }
      if (tab === 'visits' || tab === 'all') {
        const res = await client.query('SELECT * FROM cra_monitoring_logs ORDER BY id ASC');
        data.monitoringLogs = res.rows;
      }
      if (tab === 'data-mgmt' || tab === 'all') {
        const res = await client.query('SELECT * FROM ecrf_data_queries ORDER BY id ASC');
        data.dataQueries = res.rows;
      }
      if (tab === 'milestones' || tab === 'all') {
        const res = await client.query('SELECT * FROM study_milestones ORDER BY id ASC');
        data.milestones = res.rows;
      }
      if (tab === 'closeout' || tab === 'all') {
        const res = await client.query('SELECT * FROM trial_closeout_checklist ORDER BY id ASC');
        data.closeoutChecklist = res.rows;
      }

      return NextResponse.json({ success: true, source: 'neon_postgres', data });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Neon DB Query Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
