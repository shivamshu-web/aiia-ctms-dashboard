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

    -- 9. PV: Safety Reports
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

    -- 11. PV: MedDRA / WHODrug
    CREATE TABLE IF NOT EXISTS pv_meddra_whodrug (
      id SERIAL PRIMARY KEY,
      soc_term TEXT NOT NULL,
      pt_term TEXT NOT NULL,
      meddra_code VARCHAR(50) NOT NULL,
      asu_botanical_name TEXT NOT NULL,
      whodrug_id VARCHAR(50) NOT NULL,
      active_phytochemical TEXT NOT NULL
    );

    -- 12. PV: Periodic Reports
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

    -- 14. Compliance: GCP & ICMR
    CREATE TABLE IF NOT EXISTS compliance_gcp_icmr (
      id SERIAL PRIMARY KEY,
      rule_domain TEXT NOT NULL,
      guideline_ref VARCHAR(100) NOT NULL,
      requirement_summary TEXT NOT NULL,
      compliance_score INT NOT NULL,
      last_audit_date DATE NOT NULL,
      status VARCHAR(50) DEFAULT 'Fully Compliant'
    );

    -- 15. Compliance: NDCT Rules
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

    -- 17. INTEROPERABILITY: CDISC Datasets
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

    -- 18. INTEROPERABILITY: HL7 FHIR Endpoints
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

    -- 19. INTEROPERABILITY: ABDM Network Registry
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

      INSERT INTO compliance_ctri (study_id, ctri_reg_no, who_ictrp_synced, reg_date, next_annual_update_due, primary_sponsor, recruitment_status, verification_status) VALUES
      ('AIIA-CT-001', 'CTRI/2025/03/048912', 'Yes (Live)', '2025-03-14', '2027-03-14', 'All India Institute of Ayurveda, New Delhi', 'Open to Recruitment', 'CTRI Verified'),
      ('AIIA-CT-002', 'CTRI/2025/08/059124', 'Yes (Live)', '2025-08-02', '2027-08-02', 'Ministry of Ayush / AIIA Research Fund', 'Open to Recruitment', 'CTRI Verified'),
      ('AIIA-CT-003', 'CTRI/2025/05/051280', 'Yes (Live)', '2025-05-18', '2026-11-18', 'AIIA Collaborative Research Consortium', 'Temporarily Suspended', 'Audit Flag'),
      ('AIIA-CT-004', 'CTRI/2025/09/061299', 'Yes (Live)', '2025-09-10', '2027-09-10', 'National Medicinal Plants Board (NMPB)', 'Open to Recruitment', 'CTRI Verified'),
      ('AIIA-CT-005', 'CTRI/2026/01/072111', 'Pending Push', '2026-01-22', '2027-01-22', 'All India Institute of Ayurveda', 'Not Yet Recruiting', 'Provisional Cleared');

      INSERT INTO compliance_gcp_icmr (rule_domain, guideline_ref, requirement_summary, compliance_score, last_audit_date, status) VALUES
      ('Ethics Committee Registration', 'GCP-ASU Sec 3.2 & ICMR 2017', 'Registration with Central Licensing Authority / CDSCO (Form CT-02)', 100, '2026-08-15', 'Fully Compliant'),
      ('Informed Consent & AV Recording', 'NDCT Rule 25 & ICMR Guidelines', 'Audio-visual recording of informed consent process for vulnerable subjects', 98, '2026-09-20', 'Fully Compliant'),
      ('Investigator Qualifications', 'GCP-ASU Sec 4.1', 'Documented MD/MS (Ayurveda) qualifications with valid GCP-ASU certification', 100, '2026-07-10', 'Fully Compliant'),
      ('Subject Compensation for Injury', 'NDCT Rule 39 to 42', 'Institutional insurance & medical management assurance for trial-related SAEs', 96, '2026-09-01', 'Fully Compliant');

      INSERT INTO compliance_ndct_rules (rule_section, form_type, clause_title, regulatory_authority, applicability, status) VALUES
      ('Chapter V, Rule 22', 'Form CT-06', 'Permission to conduct clinical trial of new phytopharmaceutical / ASU drug', 'CDSCO / DCGI', 'Phase II & Phase III Clinical Trials', 'Statutory Approved'),
      ('Chapter III, Rule 8', 'Form CT-02', 'Registration and renewal of Institutional Ethics Committee', 'CDSCO Ethics Cell', 'AIIA Apex Institutional Ethics Committee', 'Valid up to 2028'),
      ('Chapter VI, Rule 31', 'Form CT-18', 'Inspection of clinical trial premises, sponsor site, and medical facilities', 'Central Licensing Authority', 'Annual Regulatory Oversight', 'Inspection Ready'),
      ('Chapter VIII, Rule 39', 'Form CT-SAE', 'Mandatory 14-day SAE compensation adjudication protocol', 'Expert Committee / CDSCO', 'All Registered Clinical Subjects', 'Policy Active');

      INSERT INTO compliance_audits (audit_code, inspecting_body, site_audited, audit_type, audit_date, findings_count, capa_status) VALUES
      ('AUD-2026-01', 'CDSCO North Zone Inspectorate', 'AIIA Apex Centre, New Delhi', 'Routine GCP Regulatory Inspection', '2026-08-10', 0, 'No Observations (Clear)'),
      ('AUD-2026-02', 'Ministry of Ayush Quality Assurance Cell', 'NIA Hospital, Jaipur', 'AYUSH GCP Protocol Adherence Audit', '2026-09-04', 1, 'CAPA Verified & Closed'),
      ('AUD-2026-03', 'Independent Quality Auditor (Third-Party)', 'IMS BHU Varanasi Site', 'Trial Master File (TMF) & eCRF Audit', '2026-09-18', 2, 'CAPA Under Implementation');

      -- SEED DATA & INTEROPERABILITY
      INSERT INTO interop_cdisc_datasets (domain_code, domain_name, standard_type, total_records, validation_status, export_format, define_xml_status) VALUES
      ('DM', 'Demographics & Prakriti Profile', 'SDTM v3.4', 1085, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('AE', 'Adverse Events & ADR Matrix', 'SDTM v3.4', 38, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('LB', 'Laboratory Biomarkers (AyurBio)', 'SDTM v3.4', 4210, '99.8% Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('EX', 'Exposure to Investigational Herbal Drug', 'SDTM v3.4', 2140, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
      ('ADSL', 'Subject-Level Analysis Dataset', 'ADaM v1.3', 1085, '100% Validated', 'SAS Transport (XPT v5)', 'Analysis Ready');

      INSERT INTO interop_fhir_endpoints (resource_type, endpoint_path, fhir_version, http_methods, sync_frequency, records_synced, health_status) VALUES
      ('ResearchStudy', '/fhir/R4/ResearchStudy', 'R4 (v4.0.1)', 'GET, POST', 'Continuous Webhook', 5, 'Connected (200 OK)'),
      ('ResearchSubject', '/fhir/R4/ResearchSubject', 'R4 (v4.0.1)', 'GET, POST, PUT', 'Continuous Webhook', 985, 'Connected (200 OK)'),
      ('Observation', '/fhir/R4/Observation?category=laboratory', 'R4 (v4.0.1)', 'GET, POST', 'Batch Sync (Hourly)', 4210, 'Connected (200 OK)'),
      ('Condition', '/fhir/R4/Condition?code=ICD-11', 'R4 (v4.0.1)', 'GET', 'Real-time', 1240, 'Connected (200 OK)');

      INSERT INTO interop_abdm_registry (subject_id, abha_number, abha_address, hip_facility_id, consent_artefact_id, gateway_sync_status, linked_date) VALUES
      ('SUBJ-AIIA-0101', '91-4821-3940-1284', 'patient0101@sbx', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90412', 'ABDM Gateway Synced', '2026-05-12'),
      ('SUBJ-AIIA-0102', '91-2391-4890-5912', 'rajesh.sharma@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90413', 'ABDM Gateway Synced', '2026-05-24'),
      ('SUBJ-AIIA-0205', '91-8841-0294-8192', 'meena.gupta@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90414', 'ABDM Gateway Synced', '2026-06-03'),
      ('SUBJ-AIIA-0310', '91-5519-3910-4819', 'sunil.kumar@sbx', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90415', 'ABDM Gateway Synced', '2026-07-15'),
      ('SUBJ-AIIA-0402', '91-9923-4819-2041', 'anita.devi@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90416', 'ABDM Gateway Synced', '2026-08-02');
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

      return NextResponse.json({ success: true, source: 'neon_postgres', data });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Neon DB Query Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
