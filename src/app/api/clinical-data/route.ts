import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initSchema(client: any) {
  // 1. Create Tables
  await client.query(`
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

    CREATE TABLE IF NOT EXISTS protocol_approvals (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) REFERENCES clinical_studies(study_id) ON DELETE CASCADE,
      version VARCHAR(20) DEFAULT 'v1.0',
      iec_committee VARCHAR(150) DEFAULT 'AIIA Institutional Ethics Committee',
      iec_date DATE DEFAULT CURRENT_DATE,
      status VARCHAR(50) DEFAULT 'Approved',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

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

    CREATE TABLE IF NOT EXISTS study_milestones (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) NOT NULL,
      protocol_name TEXT NOT NULL,
      phase VARCHAR(50) NOT NULL,
      progress_pct INT DEFAULT 0,
      stage_details TEXT,
      target_lpo_date VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS trial_closeout_checklist (
      id SERIAL PRIMARY KEY,
      step_name TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      audit_details TEXT
    );

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

    CREATE TABLE IF NOT EXISTS pv_meddra_whodrug (
      id SERIAL PRIMARY KEY,
      soc_term TEXT NOT NULL,
      pt_term TEXT NOT NULL,
      meddra_code VARCHAR(50) NOT NULL,
      asu_botanical_name TEXT NOT NULL,
      whodrug_id VARCHAR(50) NOT NULL,
      active_phytochemical TEXT NOT NULL
    );

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

    CREATE TABLE IF NOT EXISTS compliance_ctri (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) NOT NULL,
      ctri_reg_no VARCHAR(100) UNIQUE NOT NULL,
      who_ictrp_synced VARCHAR(20) DEFAULT 'Yes (Live)',
      reg_date DATE NOT NULL,
      next_annual_update_due DATE NOT NULL,
      primary_sponsor TEXT NOT NULL,
      recruitment_status VARCHAR(50) DEFAULT 'Open to Recruitment',
      verification_status VARCHAR(50) DEFAULT 'CTRI Verified'
    );

    CREATE TABLE IF NOT EXISTS compliance_gcp_icmr (
      id SERIAL PRIMARY KEY,
      rule_domain TEXT NOT NULL,
      guideline_ref VARCHAR(100) NOT NULL,
      requirement_summary TEXT NOT NULL,
      compliance_score INT NOT NULL,
      last_audit_date DATE NOT NULL,
      status VARCHAR(50) DEFAULT 'Fully Compliant'
    );

    CREATE TABLE IF NOT EXISTS compliance_ndct_rules (
      id SERIAL PRIMARY KEY,
      rule_section VARCHAR(50) NOT NULL,
      form_type VARCHAR(50) NOT NULL,
      clause_title TEXT NOT NULL,
      regulatory_authority VARCHAR(100) DEFAULT 'CDSCO / DCGI',
      applicability TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'Statutory Approved'
    );

    CREATE TABLE IF NOT EXISTS compliance_audits (
      id SERIAL PRIMARY KEY,
      audit_code VARCHAR(50) UNIQUE NOT NULL,
      inspecting_body TEXT NOT NULL,
      site_audited TEXT NOT NULL,
      audit_type VARCHAR(100) NOT NULL,
      audit_date DATE NOT NULL,
      findings_count INT DEFAULT 0,
      capa_status VARCHAR(50) DEFAULT 'CAPA Closed'
    );

    CREATE TABLE IF NOT EXISTS interop_cdisc_datasets (
      id SERIAL PRIMARY KEY,
      domain_code VARCHAR(20) NOT NULL,
      domain_name TEXT NOT NULL,
      standard_type VARCHAR(30) DEFAULT 'SDTM v3.4',
      total_records INT NOT NULL,
      validation_status VARCHAR(50) DEFAULT '100% CDISC Compliant',
      export_format VARCHAR(30) DEFAULT 'SAS Transport (XPT)',
      define_xml_status VARCHAR(50) DEFAULT 'Define-XML v2.1 Verified'
    );

    CREATE TABLE IF NOT EXISTS interop_fhir_endpoints (
      id SERIAL PRIMARY KEY,
      resource_type VARCHAR(50) NOT NULL,
      endpoint_path TEXT NOT NULL,
      fhir_version VARCHAR(20) DEFAULT 'R4 (v4.0.1)',
      http_methods VARCHAR(50) DEFAULT 'GET, POST, PUT',
      sync_frequency VARCHAR(50) DEFAULT 'Real-Time Webhook',
      records_synced INT NOT NULL,
      health_status VARCHAR(50) DEFAULT 'Connected (200 OK)'
    );

    CREATE TABLE IF NOT EXISTS interop_abdm_registry (
      id SERIAL PRIMARY KEY,
      subject_id VARCHAR(50) NOT NULL,
      abha_number VARCHAR(50) NOT NULL,
      abha_address VARCHAR(100) NOT NULL,
      hip_facility_id VARCHAR(50) DEFAULT 'IN0710001004 (AIIA New Delhi)',
      consent_artefact_id VARCHAR(100) NOT NULL,
      gateway_sync_status VARCHAR(50) DEFAULT 'ABDM Gateway Synced',
      linked_date DATE DEFAULT CURRENT_DATE
    );
  `);

  // 2. Individual Safe Seed Check (Har table ka apna count check)

  // CDISC SEED CHECK
  const cdiscCnt = await client.query('SELECT count(*) FROM interop_cdisc_datasets');
  if (parseInt(cdiscCnt.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO interop_cdisc_datasets (domain_code, domain_name, standard_type, total_records, validation_status, export_format, define_xml_status) VALUES
      ('DM', 'Demographics & Prakriti Phenotype', 'SDTM v3.4', 1085, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('AE', 'Adverse Events & ADR Matrix', 'SDTM v3.4', 38, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('LB', 'Laboratory Biomarkers (AyurBio)', 'SDTM v3.4', 4210, '99.8% Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('EX', 'Exposure to Investigational Herbal Drug', 'SDTM v3.4', 2140, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('ADSL', 'Subject-Level Analysis Dataset', 'ADaM v1.3', 1085, '100% Validated', 'SAS Transport (XPT v5)', 'Analysis Ready'),
      ('DS', 'Disposition of Subjects', 'SDTM v3.4', 1085, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('MH', 'Medical History & Prior Morbidities', 'SDTM v3.4', 890, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed');
    `);
  }

  // FHIR SEED CHECK
  const fhirCnt = await client.query('SELECT count(*) FROM interop_fhir_endpoints');
  if (parseInt(fhirCnt.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO interop_fhir_endpoints (resource_type, endpoint_path, fhir_version, http_methods, sync_frequency, records_synced, health_status) VALUES
      ('ResearchStudy', '/fhir/R4/ResearchStudy', 'R4 (v4.0.1)', 'GET, POST', 'Continuous Webhook', 5, 'Connected (200 OK)'),
      ('ResearchSubject', '/fhir/R4/ResearchSubject', 'R4 (v4.0.1)', 'GET, POST, PUT', 'Continuous Webhook', 985, 'Connected (200 OK)'),
      ('Observation', '/fhir/R4/Observation?category=laboratory', 'R4 (v4.0.1)', 'GET, POST', 'Batch Sync (Hourly)', 4210, 'Connected (200 OK)'),
      ('Condition', '/fhir/R4/Condition?code=ICD-11', 'R4 (v4.0.1)', 'GET', 'Real-time', 1240, 'Connected (200 OK)'),
      ('MedicationStatement', '/fhir/R4/MedicationStatement', 'R4 (v4.0.1)', 'GET, POST', 'Daily Reconciliation', 2140, 'Connected (200 OK)');
    `);
  }

  // ABDM SEED CHECK
  const abdmCnt = await client.query('SELECT count(*) FROM interop_abdm_registry');
  if (parseInt(abdmCnt.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO interop_abdm_registry (subject_id, abha_number, abha_address, hip_facility_id, consent_artefact_id, gateway_sync_status, linked_date) VALUES
      ('SUBJ-AIIA-0101', '91-4821-3940-1284', 'patient0101@sbx', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90412', 'ABDM Gateway Synced', '2026-05-12'),
      ('SUBJ-AIIA-0102', '91-2391-4890-5912', 'rajesh.sharma@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90413', 'ABDM Gateway Synced', '2026-05-24'),
      ('SUBJ-AIIA-0205', '91-8841-0294-8192', 'meena.gupta@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90414', 'ABDM Gateway Synced', '2026-06-03'),
      ('SUBJ-AIIA-0310', '91-5519-3910-4819', 'sunil.kumar@sbx', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90415', 'ABDM Gateway Synced', '2026-07-15'),
      ('SUBJ-AIIA-0402', '91-9923-4819-2041', 'anita.devi@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90416', 'ABDM Gateway Synced', '2026-08-02'),
      ('SUBJ-AIIA-0405', '91-7712-9901-4412', 'vikram.singh@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90417', 'ABDM Gateway Synced', '2026-08-19');
    `);
  }

  // CTRI SEED CHECK
  const ctriCnt = await client.query('SELECT count(*) FROM compliance_ctri');
  if (parseInt(ctriCnt.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO compliance_ctri (study_id, ctri_reg_no, who_ictrp_synced, reg_date, next_annual_update_due, primary_sponsor, recruitment_status, verification_status) VALUES
      ('AIIA-CT-001', 'CTRI/2025/03/048912', 'Yes (Live)', '2025-03-14', '2027-03-14', 'All India Institute of Ayurveda, New Delhi', 'Open to Recruitment', 'CTRI Verified'),
      ('AIIA-CT-002', 'CTRI/2025/08/059124', 'Yes (Live)', '2025-08-02', '2027-08-02', 'Ministry of Ayush / AIIA Research Fund', 'Open to Recruitment', 'CTRI Verified'),
      ('AIIA-CT-003', 'CTRI/2025/05/051280', 'Yes (Live)', '2025-05-18', '2026-11-18', 'AIIA Collaborative Research Consortium', 'Temporarily Suspended', 'Audit Flag'),
      ('AIIA-CT-004', 'CTRI/2025/09/061299', 'Yes (Live)', '2025-09-10', '2027-09-10', 'National Medicinal Plants Board (NMPB)', 'Open to Recruitment', 'CTRI Verified'),
      ('AIIA-CT-005', 'CTRI/2026/01/072111', 'Pending Push', '2026-01-22', '2027-01-22', 'All India Institute of Ayurveda', 'Not Yet Recruiting', 'Provisional Cleared');
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

      // PV
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

      // COMPLIANCE
      if (tab === 'ctri' || tab === 'all') {
        const res = await client.query('SELECT * FROM compliance_ctri ORDER BY id ASC');
        data.ctriList = res.rows;
      }
      if (tab === 'gcp' || tab === 'all') {
        const res = await client.query('SELECT * FROM compliance_gcp_icmr ORDER BY id ASC');
        data.gcpList = res.rows;
      }
      if (tab === 'ndct' || tab === 'all') {
        const res = await client.query('SELECT * FROM compliance_ndct_rules ORDER BY id ASC');
        data.ndctList = res.rows;
      }
      if (tab === 'audit' || tab === 'all') {
        const res = await client.query('SELECT * FROM compliance_audits ORDER BY id ASC');
        data.auditList = res.rows;
      }

      // DATA & INTEROPERABILITY (Direct Neon Queries)
      if (tab === 'cdisc' || tab === 'all') {
        const res = await client.query('SELECT * FROM interop_cdisc_datasets ORDER BY id ASC');
        data.cdiscList = res.rows;
      }
      if (tab === 'fhir' || tab === 'all') {
        const res = await client.query('SELECT * FROM interop_fhir_endpoints ORDER BY id ASC');
        data.fhirList = res.rows;
      }
      if (tab === 'abdm' || tab === 'all') {
        const res = await client.query('SELECT * FROM interop_abdm_registry ORDER BY id ASC');
        data.abdmList = res.rows;
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
