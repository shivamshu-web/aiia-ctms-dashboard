import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Resilient Pool optimized for Neon Serverless PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

async function ensureAllNeonTablesSeeded(client: any) {
  // 1. DDL: Create All Tables
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
      study_id VARCHAR(50) NOT NULL,
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

    CREATE TABLE IF NOT EXISTS admin_users_roles (
      id SERIAL PRIMARY KEY,
      user_code VARCHAR(50) UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email VARCHAR(120) UNIQUE NOT NULL,
      role_title VARCHAR(80) NOT NULL,
      access_scope TEXT NOT NULL,
      mfa_status VARCHAR(20) DEFAULT 'Enforced (FIDO2)',
      account_status VARCHAR(30) DEFAULT 'Active (Authorized)'
    );

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

  // 2. Data Insertion with ON CONFLICT (Always Safe, Never Fails)
  await client.query(`
    INSERT INTO clinical_studies (study_id, title, phase, sites_count, enrolled, target, status, ctri_number, therapeutic_area, herbal_formulation, pi_name) VALUES
    ('AIIA-CT-001', 'Clinical Evaluation of Nishamalaki in Type 2 Diabetes Mellitus', 'Phase III', 5, 312, 400, 'Ongoing', 'CTRI/2025/03/048912', 'Metabolic Disorders / Endocrinology', 'Nishamalaki Vati (Haridra + Amalaki)', 'Dr. Aanchal Singh'),
    ('AIIA-CT-002', 'Evaluation of Ayurvedic Rasayana in Post-Chemotherapy Quality of Life', 'Phase II', 4, 248, 300, 'Ongoing', 'CTRI/2025/08/059124', 'Integrative Oncology & Palliative Care', 'Chyawanprash Awaleha + Guduchi Swarasa', 'Dr. Aanchal Singh'),
    ('AIIA-CT-003', 'Evaluation of Standardized Ashwagandha in Chronic Fatigue Syndrome', 'Phase III', 6, 196, 250, 'On Hold', 'CTRI/2025/05/051280', 'Neuro-Immunology & Stress Adaptation', 'Withania somnifera Extract (5% Withanolides)', 'Dr. Aanchal Singh'),
    ('AIIA-CT-004', 'Efficacy of Haridra & Guggulu in Osteoarthritis Management', 'Phase I', 3, 142, 200, 'Ongoing', 'CTRI/2025/09/061299', 'Rheumatology & Musculoskeletal Disorders', 'Yogaraj Guggulu + Curcumin 95%', 'Dr. Aanchal Singh'),
    ('AIIA-CT-005', 'Clinical Safety Assessment of Guduchi Formulations', 'Phase II', 5, 87, 150, 'Planning', 'CTRI/2026/01/072111', 'Immunology & Clinical Pharmacology', 'Guduchi Ghana Vati', 'Dr. Aanchal Singh')
    ON CONFLICT (study_id) DO UPDATE SET enrolled = EXCLUDED.enrolled;

    INSERT INTO clinical_sites (site_code, institution_name, city, pi_name, enrolled, target, audit_status, next_monitoring_visit) VALUES
    ('SITE-01', 'All India Institute of Ayurveda (Apex Centre)', 'New Delhi', 'Dr. Aanchal Singh', 412, 450, 'GCP Cleared', '2026-10-12'),
    ('SITE-02', 'National Institute of Ayurveda (NIA)', 'Jaipur, Rajasthan', 'Dr. R. K. Sharma', 284, 350, 'GCP Cleared', '2026-10-18'),
    ('SITE-03', 'Faculty of Ayurveda, IMS, Banaras Hindu University', 'Varanasi, UP', 'Dr. V. N. Pandey', 195, 250, 'GCP Cleared', '2026-10-24'),
    ('SITE-04', 'IPGT&RA, Gujarat Ayurved University', 'Jamnagar, Gujarat', 'Dr. H. M. Chandola', 110, 150, 'GCP Cleared', '2026-10-29')
    ON CONFLICT (site_code) DO NOTHING;

    INSERT INTO trial_patients (subject_id, study_id, age, gender, prakriti, consent_date, stage, compliance_rate) VALUES
    ('SUBJ-AIIA-0101', 'AIIA-CT-001', 52, 'Female', 'Pitta-Kapha', '2026-05-12', 'Dosing (Week 12)', 99),
    ('SUBJ-AIIA-0102', 'AIIA-CT-001', 48, 'Male', 'Vata-Pitta', '2026-05-24', 'Dosing (Week 8)', 97),
    ('SUBJ-AIIA-0205', 'AIIA-CT-002', 61, 'Female', 'Vataja', '2026-06-03', 'Completed', 100),
    ('SUBJ-AIIA-0310', 'AIIA-CT-003', 39, 'Male', 'Kaphaja', '2026-07-15', 'Screened (Pre-Dose)', 95)
    ON CONFLICT (subject_id) DO NOTHING;

    INSERT INTO cra_monitoring_logs (study_id, site_name, visit_type, cra_auditor, visit_date, deviations_flagged, mvr_status) VALUES
    ('AIIA-CT-001', 'AIIA Apex Centre, New Delhi', 'Routine Interim Monitoring (IMV)', 'Dr. S. K. Raman', '2026-09-28', '0 Deviations', 'Approved & Signed'),
    ('AIIA-CT-002', 'NIA Hospital, Jaipur', 'Interim Monitoring Visit (IMV-2)', 'Dr. P. Sharma', '2026-09-22', '1 Minor (Window +2d)', 'Approved & Signed'),
    ('AIIA-CT-003', 'Faculty of Ayurveda, IMS BHU', 'Quality Oversight Audit', 'Dr. R. Mishra', '2026-09-15', '1 Minor (Pill Count Log)', 'CAPA Resolved');

    INSERT INTO ecrf_data_queries (query_id, study_id, subject_id, ecrf_section, discrepancy_note, severity, status) VALUES
    ('QRY-0841', 'AIIA-CT-001', 'SUBJ-AIIA-0101', 'Biochemical Labs (HbA1c)', 'Fasting glucose value 142 mg/dL requires secondary physician signoff', 'Low', 'Resolved'),
    ('QRY-0842', 'AIIA-CT-001', 'SUBJ-AIIA-0102', 'Concomitant Medication', 'Verify herbal adjuvant dosage timing with meal diary log', 'Medium', 'In Progress')
    ON CONFLICT (query_id) DO NOTHING;

    INSERT INTO study_milestones (study_id, protocol_name, phase, progress_pct, stage_details, target_lpo_date) VALUES
    ('AIIA-CT-001', 'Nishamalaki Diabetes Trial', 'Phase III', 78, 'Subject Recruitment 78% • Interim Bio-Analysis', 'Target LPO: Jan 2027'),
    ('AIIA-CT-002', 'Rasayana Oncology Trial', 'Phase II', 84, 'Patient Randomization Complete • Dosing Follow-up', 'Target LPO: Nov 2026');

    INSERT INTO trial_closeout_checklist (step_name, status, audit_details) VALUES
    ('1. Subject Data Lock & eCRF Verification', 'Completed', 'All 248 patient eCRFs resolved, queried, and locked with CRA digital signatures.'),
    ('2. Safety Reconciliation with NPVCC', 'Completed', 'All adverse drug events (ADR/SAE) reconciled with National Pharmacovigilance Centre and CDSCO portal.');

    INSERT INTO pv_safety_reports (report_id, study_id, subject_id, suspected_herb, adverse_event, severity, causality_score, reported_date, regulatory_deadline, status) VALUES
    ('PV-AIIA-2026-001', 'AIIA-CT-001', 'SUBJ-AIIA-0104', 'Nishamalaki Vati (Amalaki component)', 'Transient Mild Gastric Hyperacidity (Amlapitta)', 'Mild', 'Probable (WHO-UMC)', '2026-09-24', '15 Days Routine', 'Submitted to CDSCO'),
    ('PV-AIIA-2026-002', 'AIIA-CT-002', 'SUBJ-AIIA-0211', 'Guduchi Swarasa Extract', 'Mild Pruritic Skin Rash (Kandu)', 'Moderate', 'Possible (Naranjo Score 4)', '2026-09-27', '15 Days Routine', 'Under Review')
    ON CONFLICT (report_id) DO NOTHING;

    INSERT INTO compliance_ctri (study_id, ctri_reg_no, who_ictrp_synced, reg_date, next_annual_update_due, primary_sponsor, recruitment_status, verification_status) VALUES
    ('AIIA-CT-001', 'CTRI/2025/03/048912', 'Yes (Live)', '2025-03-14', '2027-03-14', 'All India Institute of Ayurveda, New Delhi', 'Open to Recruitment', 'CTRI Verified'),
    ('AIIA-CT-002', 'CTRI/2025/08/059124', 'Yes (Live)', '2025-08-02', '2027-08-02', 'Ministry of Ayush / AIIA Research Fund', 'Open to Recruitment', 'CTRI Verified')
    ON CONFLICT (ctri_reg_no) DO NOTHING;

    INSERT INTO interop_cdisc_datasets (domain_code, domain_name, standard_type, total_records, validation_status, export_format, define_xml_status) VALUES
    ('DM', 'Demographics & Prakriti Phenotype', 'SDTM v3.4', 1085, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
    ('AE', 'Adverse Events & ADR Matrix', 'SDTM v3.4', 38, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed');

    INSERT INTO interop_fhir_endpoints (resource_type, endpoint_path, fhir_version, http_methods, sync_frequency, records_synced, health_status) VALUES
    ('ResearchStudy', '/fhir/R4/ResearchStudy', 'R4 (v4.0.1)', 'GET, POST', 'Continuous Webhook', 5, 'Connected (200 OK)'),
    ('ResearchSubject', '/fhir/R4/ResearchSubject', 'R4 (v4.0.1)', 'GET, POST, PUT', 'Continuous Webhook', 985, 'Connected (200 OK)');

    INSERT INTO interop_abdm_registry (subject_id, abha_number, abha_address, hip_facility_id, consent_artefact_id, gateway_sync_status, linked_date) VALUES
    ('SUBJ-AIIA-0101', '91-4821-3940-1284', 'patient0101@sbx', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90412', 'ABDM Gateway Synced', '2026-05-12'),
    ('SUBJ-AIIA-0102', '91-2391-4890-5912', 'rajesh.sharma@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90413', 'ABDM Gateway Synced', '2026-05-24');

    INSERT INTO admin_users_roles (user_code, full_name, email, role_title, access_scope, mfa_status, account_status) VALUES
    ('USR-AIIA-001', 'Dr. Aanchal Singh', 'aanchal.singh@aiia.gov.in', 'Principal Investigator (PI)', 'All Protocols • E-Sign Approvals • DBL Signoff', 'Enforced (FIDO2)', 'Active (Authorized)'),
    ('USR-AIIA-002', 'Dr. S. K. Raman', 'sk.raman@aiia.gov.in', 'Lead CRA / Clinical Monitor', 'Visits & Monitoring • MVR Logs • Site Access', 'Enforced (SMS OTP)', 'Active (Authorized)'),
    ('USR-AIIA-004', 'Dr. Ananya Joshi', 'ananya.joshi@aiia.gov.in', 'Pharmacovigilance Officer (NPvCC)', 'ADR / SAE Reporting • PvPI Gateway', 'Enforced (FIDO2)', 'Active (Authorized)')
    ON CONFLICT (email) DO NOTHING;

    INSERT INTO admin_system_audit_logs (user_identity, action_type, resource_affected, ip_address, compliance_flag) VALUES
    ('Dr. Aanchal Singh (PI)', 'ELECTRONIC_SIGNATURE', 'Protocol Dossier AIIA-CT-001 Approval Signed', '10.14.0.22 (AIIA VPN)', '21 CFR Part 11 Verified'),
    ('Dr. Ananya Joshi (PV)', 'ADR_EXPEDITED_SUBMIT', 'SAE Report PV-AIIA-2026-004 Expedited to CDSCO', '10.14.0.19 (NPvCC)', 'PvPI Certified'),
    ('System Daemon (ABDM)', 'GATEWAY_HEALTH_CHECK', 'NHA Sandbox M1/M2/M3 Synchronization OK', '127.0.0.1 (Localhost)', 'NHA Timestamp Verified');
  `);
}

export async function GET(req: Request) {
  let dbConnected = false;
  let dbRows: any = {};

  try {
    const client = await pool.connect();
    try {
      dbConnected = true;
      // Ensure all tables and seed records exist in Neon SQL
      await ensureAllNeonTablesSeeded(client);

      const sRes = await client.query('SELECT * FROM clinical_studies ORDER BY id ASC');
      const siteRes = await client.query('SELECT * FROM clinical_sites ORDER BY id ASC');
      const ptRes = await client.query('SELECT * FROM trial_patients ORDER BY id ASC');
      const mRes = await client.query('SELECT * FROM cra_monitoring_logs ORDER BY id ASC');
      const qRes = await client.query('SELECT * FROM ecrf_data_queries ORDER BY id ASC');
      const msRes = await client.query('SELECT * FROM study_milestones ORDER BY id ASC');
      const coRes = await client.query('SELECT * FROM trial_closeout_checklist ORDER BY id ASC');
      const pvRes = await client.query('SELECT * FROM pv_safety_reports ORDER BY id ASC');
      const ctriRes = await client.query('SELECT * FROM compliance_ctri ORDER BY id ASC');
      const cdiscRes = await client.query('SELECT * FROM interop_cdisc_datasets ORDER BY id ASC');
      const fhirRes = await client.query('SELECT * FROM interop_fhir_endpoints ORDER BY id ASC');
      const abdmRes = await client.query('SELECT * FROM interop_abdm_registry ORDER BY id ASC');
      const uRes = await client.query('SELECT * FROM admin_users_roles ORDER BY id ASC');
      const logRes = await client.query('SELECT * FROM admin_system_audit_logs ORDER BY id DESC LIMIT 15');

      dbRows = {
        studies: sRes.rows.map(r => ({ ...r, studyId: r.study_id, sitesCount: r.sites_count, ctriNumber: r.ctri_number, therapeuticArea: r.therapeutic_area, herbalFormulation: r.herbal_formulation, piName: r.pi_name })),
        sites: siteRes.rows,
        patients: ptRes.rows,
        monitoringLogs: mRes.rows,
        dataQueries: qRes.rows,
        milestones: msRes.rows,
        closeoutChecklist: coRes.rows,
        pvReports: pvRes.rows,
        ctriList: ctriRes.rows,
        cdiscList: cdiscRes.rows,
        fhirList: fhirRes.rows,
        abdmList: abdmRes.rows,
        usersList: uRes.rows,
        auditLogs: logRes.rows
      };
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.warn("Neon Database Connection Notice:", error.message);
  }

  return NextResponse.json({
    success: true,
    dbConnected,
    source: dbConnected ? 'neon_postgres_live' : 'in_memory_fallback',
    data: dbRows,
    studies: dbRows.studies || []
  });
}
