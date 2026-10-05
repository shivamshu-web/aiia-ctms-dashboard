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

    -- 5. Monitoring Logs
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

    -- 6. eCRF Queries
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

    -- 7. Milestones
    CREATE TABLE IF NOT EXISTS study_milestones (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) NOT NULL,
      protocol_name TEXT NOT NULL,
      phase VARCHAR(50) NOT NULL,
      progress_pct INT DEFAULT 0,
      stage_details TEXT,
      target_lpo_date VARCHAR(50)
    );

    -- 8. Closeout Checklist
    CREATE TABLE IF NOT EXISTS trial_closeout_checklist (
      id SERIAL PRIMARY KEY,
      step_name TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      audit_details TEXT
    );

    -- 9. PV: ADR / SAE Reports (NPvCC)
    CREATE TABLE IF NOT EXISTS pv_safety_reports (
      id SERIAL PRIMARY KEY,
      report_id VARCHAR(50) UNIQUE NOT NULL,
      study_id VARCHAR(50) NOT NULL,
      subject_id VARCHAR(50) NOT NULL,
      suspected_herb TEXT NOT NULL,
      adverse_event TEXT NOT NULL,
      severity VARCHAR(30) NOT NULL,
      causality_score VARCHAR(50) DEFAULT 'Probable / Likely',
      reported_date DATE DEFAULT CURRENT_DATE,
      regulatory_deadline VARCHAR(50) DEFAULT '7 Days (Expedited)',
      status VARCHAR(50) DEFAULT 'Submitted to CDSCO'
    );

    -- 10. PV: Safety Signals
    CREATE TABLE IF NOT EXISTS pv_safety_signals (
      id SERIAL PRIMARY KEY,
      signal_id VARCHAR(50) UNIQUE NOT NULL,
      formulation_name TEXT NOT NULL,
      adverse_event_term TEXT NOT NULL,
      prr_score NUMERIC(5,2) NOT NULL,
      ror_score NUMERIC(5,2) NOT NULL,
      case_count INT NOT NULL,
      signal_status VARCHAR(50) DEFAULT 'Validated',
      action_taken TEXT
    );

    -- 11. PV: MedDRA / WHODrug Dictionary Mapping
    CREATE TABLE IF NOT EXISTS pv_meddra_whodrug (
      id SERIAL PRIMARY KEY,
      soc_term TEXT NOT NULL,
      pt_term TEXT NOT NULL,
      meddra_code VARCHAR(50) NOT NULL,
      asu_botanical_name TEXT NOT NULL,
      whodrug_id VARCHAR(50) NOT NULL,
      active_phytochemical TEXT NOT NULL
    );

    -- 12. PV: Periodic Safety Reports (PSUR/PBRER)
    CREATE TABLE IF NOT EXISTS pv_periodic_reports (
      id SERIAL PRIMARY KEY,
      report_code VARCHAR(50) UNIQUE NOT NULL,
      title TEXT NOT NULL,
      reporting_period VARCHAR(100) NOT NULL,
      total_exposure_subjects INT NOT NULL,
      total_ae_recorded INT NOT NULL,
      benefit_risk_conclusion VARCHAR(100) DEFAULT 'Favourable Benefit-Risk',
      submission_status VARCHAR(50) DEFAULT 'Approved by NPvCC'
    );
  `);

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

      -- SEED PHARMACOVIGILANCE
      INSERT INTO pv_safety_reports (report_id, study_id, subject_id, suspected_herb, adverse_event, severity, causality_score, reported_date, regulatory_deadline, status) VALUES
      ('PV-AIIA-2026-001', 'AIIA-CT-001', 'SUBJ-AIIA-0104', 'Nishamalaki Vati (Amalaki component)', 'Transient Mild Gastric Hyperacidity (Amlapitta)', 'Mild', 'Probable (WHO-UMC)', '2026-09-24', '15 Days Routine', 'Submitted to CDSCO'),
      ('PV-AIIA-2026-002', 'AIIA-CT-002', 'SUBJ-AIIA-0211', 'Guduchi Swarasa Extract', 'Mild Pruritic Skin Rash (Kandu)', 'Moderate', 'Possible (Naranjo Score 4)', '2026-09-27', '15 Days Routine', 'Under Review'),
      ('PV-AIIA-2026-003', 'AIIA-CT-003', 'SUBJ-AIIA-0318', 'Withania somnifera Extract', 'Sudden Somnolence / Sedation', 'Mild', 'Probable (WHO-UMC)', '2026-09-29', '15 Days Routine', 'Submitted to CDSCO'),
      ('PV-AIIA-2026-004', 'AIIA-CT-002', 'SUBJ-AIIA-0229', 'Adjuvant Formulation Admixture', 'Acute Hepatobiliary Enzyme Elevation (ALT > 3x)', 'Serious (SAE)', 'Unlikely / Concomitant Chemo', '2026-09-30', '7 Days (Expedited)', 'Expedited Expedited');

      INSERT INTO pv_safety_signals (signal_id, formulation_name, adverse_event_term, prr_score, ror_score, case_count, signal_status, action_taken) VALUES
      ('SIG-AY-01', 'Nishamalaki Vati', 'Epigastric Discomfort / Dyspepsia', 2.34, 2.45, 12, 'Validated Low-Risk', 'Labeling guidance: Administer strictly post-prandial'),
      ('SIG-AY-02', 'Standardized Ashwagandha', 'Transient Drowsiness / Daytime Lethargy', 3.12, 3.28, 9, 'Active Monitoring', 'Dose timing shifted to bedtime administration'),
      ('SIG-AY-03', 'Guggulu Formulations', 'Mild Diarrhea / Loose Stools', 1.88, 1.94, 6, 'Under Evaluation', 'Hydration advisory added to patient information sheet');

      INSERT INTO pv_meddra_whodrug (soc_term, pt_term, meddra_code, asu_botanical_name, whodrug_id, active_phytochemical) VALUES
      ('Gastrointestinal disorders', 'Dyspepsia / Acid regurgitation', '10013946', 'Phyllanthus emblica (Amalaki)', 'WHO-D-09412', 'Ascorbic acid, Gallic acid, Ellagitannins'),
      ('Skin and subcutaneous tissue', 'Pruritus / Rash', '10037087', 'Tinospora cordifolia (Guduchi)', 'WHO-D-07812', 'Tinosporaside, Berberine, Giloin'),
      ('Nervous system disorders', 'Somnolence / Sedation', '10041349', 'Withania somnifera (Ashwagandha)', 'WHO-D-03194', 'Withaferin A, Withanolide D'),
      ('Hepatobiliary disorders', 'Alanine aminotransferase increased', '10001551', 'Curcuma longa (Haridra)', 'WHO-D-05511', 'Curcuminoids, Turmerone');

      INSERT INTO pv_periodic_reports (report_code, title, reporting_period, total_exposure_subjects, total_ae_recorded, benefit_risk_conclusion, submission_status) VALUES
      ('PSUR-2026-H1', 'Periodic Safety Update Report: Nishamalaki Protocol', '01 Jan 2026 - 30 Jun 2026', 412, 14, 'Favourable Benefit-Risk', 'Approved by NPvCC'),
      ('PSUR-2026-H2', 'Periodic Safety Update Report: Rasayana Oncology Adjuvant', '01 Apr 2026 - 30 Sep 2026', 248, 8, 'Favourable Benefit-Risk', 'Submitted to CDSCO'),
      ('PBRER-2026-Q3', 'Periodic Benefit-Risk Evaluation Report: Ashwagandha Extract', '01 Jul 2026 - 30 Sep 2026', 196, 5, 'Acceptable Safety Margin', 'Approved by NPvCC');
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

      // PHARMACOVIGILANCE TABS
      if (tab === 'safety-reporting' || tab === 'all') {
        const res = await client.query('SELECT * FROM pv_safety_reports ORDER BY id ASC');
        data.pvReports = res.rows;
      }
      if (tab === 'signal-detection' || tab === 'all') {
        const res = await client.query('SELECT * FROM pv_safety_signals ORDER BY id ASC');
        data.pvSignals = res.rows;
      }
      if (tab === 'meddra' || tab === 'all') {
        const res = await client.query('SELECT * FROM pv_meddra_whodrug ORDER BY id ASC');
        data.meddraList = res.rows;
      }
      if (tab === 'pv-reports' || tab === 'all') {
        const res = await client.query('SELECT * FROM pv_periodic_reports ORDER BY id ASC');
        data.periodicReports = res.rows;
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
