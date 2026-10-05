import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      // 1. CDISC
      await client.query(`
        INSERT INTO interop_cdisc_datasets (domain_code, domain_name, standard_type, total_records, validation_status, export_format, define_xml_status) VALUES
        ('DM', 'Demographics & Prakriti Phenotype', 'SDTM v3.4', 1085, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
        ('AE', 'Adverse Events & ADR Matrix', 'SDTM v3.4', 38, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
        ('LB', 'Laboratory Biomarkers (AyurBio)', 'SDTM v3.4', 4210, '99.8% Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
        ('EX', 'Exposure to Investigational Herbal Drug', 'SDTM v3.4', 2140, '100% CDISC Compliant', 'SAS Transport (XPT v5)', 'Define-XML v2.1 Passed'),
        ('ADSL', 'Subject-Level Analysis Dataset', 'ADaM v1.3', 1085, '100% Validated', 'SAS Transport (XPT v5)', 'Analysis Ready')
        ON CONFLICT DO NOTHING;
      `);

      // 2. FHIR
      await client.query(`
        INSERT INTO interop_fhir_endpoints (resource_type, endpoint_path, fhir_version, http_methods, sync_frequency, records_synced, health_status) VALUES
        ('ResearchStudy', '/fhir/R4/ResearchStudy', 'R4 (v4.0.1)', 'GET, POST', 'Continuous Webhook', 5, 'Connected (200 OK)'),
        ('ResearchSubject', '/fhir/R4/ResearchSubject', 'R4 (v4.0.1)', 'GET, POST, PUT', 'Continuous Webhook', 985, 'Connected (200 OK)'),
        ('Observation', '/fhir/R4/Observation?category=laboratory', 'R4 (v4.0.1)', 'GET, POST', 'Batch Sync (Hourly)', 4210, 'Connected (200 OK)'),
        ('Condition', '/fhir/R4/Condition?code=ICD-11', 'R4 (v4.0.1)', 'GET', 'Real-time', 1240, 'Connected (200 OK)')
        ON CONFLICT DO NOTHING;
      `);

      // 3. ABDM
      await client.query(`
        INSERT INTO interop_abdm_registry (subject_id, abha_number, abha_address, hip_facility_id, consent_artefact_id, gateway_sync_status, linked_date) VALUES
        ('SUBJ-AIIA-0101', '91-4821-3940-1284', 'patient0101@sbx', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90412', 'ABDM Gateway Synced', '2026-05-12'),
        ('SUBJ-AIIA-0102', '91-2391-4890-5912', 'rajesh.sharma@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90413', 'ABDM Gateway Synced', '2026-05-24'),
        ('SUBJ-AIIA-0205', '91-8841-0294-8192', 'meena.gupta@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90414', 'ABDM Gateway Synced', '2026-06-03'),
        ('SUBJ-AIIA-0310', '91-5519-3910-4819', 'sunil.kumar@sbx', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90415', 'ABDM Gateway Synced', '2026-07-15'),
        ('SUBJ-AIIA-0402', '91-9923-4819-2041', 'anita.devi@abdm', 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-2026-90416', 'ABDM Gateway Synced', '2026-08-02')
        ON CONFLICT DO NOTHING;
      `);

      return NextResponse.json({ success: true, message: 'Neon Interoperability tables populated successfully!' });
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
