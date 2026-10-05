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

    -- 2. Protocols
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

    -- 8. Closeout
    CREATE TABLE IF NOT EXISTS trial_closeout_checklist (
      id SERIAL PRIMARY KEY,
      step_name TEXT NOT NULL,
      status VARCHAR(50) NOT NULL,
      audit_details TEXT
    );

    -- 9. PV: Safety
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

    -- 10. PV: Signals
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

    -- 11. PV: MedDRA
    CREATE TABLE IF NOT EXISTS pv_meddra_whodrug (
      id SERIAL PRIMARY KEY,
      soc_term TEXT NOT NULL,
      pt_term TEXT NOT NULL,
      meddra_code VARCHAR(50) NOT NULL,
      asu_botanical_name TEXT NOT NULL,
      whodrug_id VARCHAR(50) NOT NULL,
      active_phytochemical TEXT NOT NULL
    );

    -- 12. PV: Periodic
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

    -- 13. Compliance: CTRI
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

    -- 14. Compliance: GCP
    CREATE TABLE IF NOT EXISTS compliance_gcp_icmr (
      id SERIAL PRIMARY KEY,
      rule_domain TEXT NOT NULL,
      guideline_ref VARCHAR(100) NOT NULL,
      requirement_summary TEXT NOT NULL,
      compliance_score INT NOT NULL,
      last_audit_date DATE NOT NULL,
      status VARCHAR(50) DEFAULT 'Fully Compliant'
    );

    -- 15. Compliance: NDCT
    CREATE TABLE IF NOT EXISTS compliance_ndct_rules (
      id SERIAL PRIMARY KEY,
      rule_section VARCHAR(50) NOT NULL,
      form_type VARCHAR(50) NOT NULL,
      clause_title TEXT NOT NULL,
      regulatory_authority VARCHAR(100) DEFAULT 'CDSCO / DCGI',
      applicability TEXT NOT NULL,
      status VARCHAR(50) DEFAULT 'Statutory Approved'
    );

    -- 16. Compliance: Audits
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

    -- 17. Interoperability: CDISC
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

    -- 18. Interoperability: FHIR
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

    -- 19. Interoperability: ABDM
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

    -- 20. ADMINISTRATION: Users & Roles (RBAC 21 CFR Part 11)
    CREATE TABLE IF NOT EXISTS admin_users_roles (
      id SERIAL PRIMARY KEY,
      user_code VARCHAR(50) UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      role_title VARCHAR(80) NOT NULL,
      access_scope TEXT NOT NULL,
      mfa_status VARCHAR(20) DEFAULT 'Enforced (FIDO2)',
      account_status VARCHAR(30) DEFAULT 'Active (Authorized)',
      last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 21. ADMINISTRATION: System Settings & Audit Log
    CREATE TABLE IF NOT EXISTS admin_system_audit_logs (
      id SERIAL PRIMARY KEY,
      event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_identity VARCHAR(100) NOT NULL,
      action_type VARCHAR(50) NOT NULL,
      resource_affected TEXT NOT NULL,
      ip_address VARCHAR(50) DEFAULT '10.14.0.22 (AIIA VPN)',
      compliance_flag VARCHAR(50) DEFAULT '21 CFR Part 11 Verified'
    );
  `);

  // Auto-seed Administration tables if empty
  const userCnt = await client.query('SELECT count(*) FROM admin_users_roles');
  if (parseInt(userCnt.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO admin_users_roles (user_code, full_name, email, role_title, access_scope, mfa_status, account_status) VALUES
      ('USR-AIIA-001', 'Dr. Aanchal Singh', 'aanchal.singh@aiia.gov.in', 'Principal Investigator (PI)', 'All Protocols • E-Sign Approvals • DBL Signoff', 'Enforced (FIDO2)', 'Active (Authorized)'),
      ('USR-AIIA-002', 'Dr. S. K. Raman', 'sk.raman@aiia.gov.in', 'Lead CRA / Clinical Monitor', 'Visits & Monitoring • MVR Logs • Site Access', 'Enforced (SMS OTP)', 'Active (Authorized)'),
      ('USR-AIIA-003', 'Pooja Verma', 'p.verma@aiia.gov.in', 'Clinical Data Manager', 'eCRF Queries • Database Lock (DBL) • CDISC', 'Enforced (Authenticator)', 'Active (Authorized)'),
      ('USR-AIIA-004', 'Dr. Ananya Joshi', 'a.joshi@aiia.gov.in', 'Pharmacovigilance Officer (NPvCC)', 'ADR / SAE Reporting • PvPI Gateway • Signal Detection', 'Enforced (FIDO2)', 'Active (Authorized)'),
      ('USR-AIIA-005', 'Rajesh K. Meena', 'r.meena@cdsco.nic.in', 'Regulatory Inspector (CDSCO)', 'Read-Only Audit Trail • Dossier Inspection', 'Enforced (Gov.in PKI)', 'Active (Authorized)');

      INSERT INTO admin_system_audit_logs (user_identity, action_type, resource_affected, ip_address, compliance_flag) VALUES
      ('Dr. Aanchal Singh (PI)', 'ELECTRONIC_SIGNATURE', 'Protocol Dossier AIIA-CT-001 Approval', '10.14.0.22', '21 CFR Part 11 Verified'),
      ('Pooja Verma (Data Mgr)', 'DATABASE_QUERY_RESOLVE', 'eCRF Query QRY-0841 Closed', '10.14.0.38', 'Audit Trail Logged'),
      ('Dr. Ananya Joshi (PV)', 'ADR_EXPEDITED_SUBMIT', 'SAE Report PV-AIIA-2026-004 to CDSCO Portal', '10.14.0.19', 'PvPI Certified'),
      ('System Daemon (ABDM)', 'GATEWAY_HEALTH_CHECK', 'NHA Sandbox M1/M2/M3 Sync', '127.0.0.1', 'NHA Timestamp Verified'),
      ('Rajesh K. Meena (Inspector)', 'REGULATORY_AUDIT_INSPECT', 'Trial Master File (TMF) Export', '164.100.24.12', 'Immutable Record');
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

      // DATA & INTEROPERABILITY
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

      // ADMINISTRATION
      if (tab === 'users' || tab === 'all') {
        const res = await client.query('SELECT * FROM admin_users_roles ORDER BY id ASC');
        data.usersList = res.rows;
      }
      if (tab === 'settings' || tab === 'all') {
        const res = await client.query('SELECT * FROM admin_system_audit_logs ORDER BY id DESC LIMIT 15');
        data.auditLogs = res.rows;
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
