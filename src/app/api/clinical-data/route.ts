import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Auto-initialize Schema in Neon if not exists
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

    -- 2. Protocols & IEC Approvals
    CREATE TABLE IF NOT EXISTS protocol_approvals (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) REFERENCES clinical_studies(study_id) ON DELETE CASCADE,
      version VARCHAR(20) DEFAULT 'v1.0',
      iec_committee VARCHAR(150) DEFAULT 'AIIA Institutional Ethics Committee',
      iec_date DATE DEFAULT CURRENT_DATE,
      status VARCHAR(50) DEFAULT 'Approved',
      dossier_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Multi-centric Clinical Sites
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

    -- 4. Patients Registry
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

    -- 5. Visits & Monitoring
    CREATE TABLE IF NOT EXISTS site_visits (
      id SERIAL PRIMARY KEY,
      visit_name VARCHAR(100) NOT NULL,
      description TEXT,
      completion_status VARCHAR(50) DEFAULT 'Completed',
      scheduled_date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. Milestones
    CREATE TABLE IF NOT EXISTS study_milestones (
      id SERIAL PRIMARY KEY,
      study_id VARCHAR(50) REFERENCES clinical_studies(study_id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      progress_pct INT DEFAULT 0,
      milestone_tag VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default data only once if clinical_studies is empty
  const count = await client.query('SELECT count(*) FROM clinical_studies');
  if (parseInt(count.rows[0].count, 10) === 0) {
    await client.query(`
      INSERT INTO clinical_studies (study_id, title, phase, sites_count, enrolled, target, status, ctri_number, therapeutic_area, herbal_formulation, pi_name) VALUES
      ('AIIA-CT-001', 'Clinical Evaluation of Nishamalaki in Type 2 Diabetes Mellitus', 'Phase III', 5, 312, 400, 'Ongoing', 'CTRI/2025/03/048912', 'Metabolic Disorders / Endocrinology', 'Nishamalaki Vati (Haridra + Amalaki)', 'Dr. Aanchal Singh'),
      ('AIIA-CT-002', 'Evaluation of Ayurvedic Rasayana in Post-Chemotherapy Quality of Life', 'Phase II', 4, 248, 300, 'Ongoing', 'CTRI/2025/08/059124', 'Integrative Oncology & Palliative Care', 'Chyawanprash Awaleha + Guduchi Swarasa', 'Dr. Aanchal Singh'),
      ('AIIA-CT-003', 'Evaluation of Standardized Ashwagandha in Chronic Fatigue Syndrome', 'Phase III', 6, 196, 250, 'On Hold', 'CTRI/2025/05/051280', 'Neuro-Immunology & Stress Adaptation', 'Withania somnifera Extract (5% Withanolides)', 'Dr. Aanchal Singh'),
      ('AIIA-CT-004', 'Efficacy of Haridra & Guggulu in Osteoarthritis Management', 'Phase I', 3, 142, 200, 'Ongoing', 'CTRI/2025/09/061299', 'Rheumatology & Musculoskeletal Disorders', 'Yogaraj Guggulu + Curcumin 95%', 'Dr. Aanchal Singh'),
      ('AIIA-CT-005', 'Clinical Safety Assessment of Guduchi Formulations', 'Phase II', 5, 87, 150, 'Planning', 'CTRI/2026/01/072111', 'Immunology & Clinical Pharmacology', 'Guduchi Ghana Vati', 'Dr. Aanchal Singh');

      INSERT INTO protocol_approvals (study_id, version, iec_committee, iec_date, status) VALUES
      ('AIIA-CT-001', 'v2.1', 'AIIA Institutional Ethics Committee', '2025-01-15', 'Approved'),
      ('AIIA-CT-002', 'v1.4', 'AIIA Institutional Ethics Committee', '2025-07-28', 'Approved'),
      ('AIIA-CT-003', 'v1.2', 'AIIA Institutional Ethics Committee', '2025-02-12', 'Renewal Due'),
      ('AIIA-CT-004', 'v1.0', 'AIIA Institutional Ethics Committee', '2025-08-10', 'Approved'),
      ('AIIA-CT-005', 'v1.0', 'AIIA Institutional Ethics Committee', '2025-09-22', 'Under Review');

      INSERT INTO clinical_sites (site_code, institution_name, city, pi_name, enrolled, target, audit_status, next_monitoring_visit) VALUES
      ('SITE-01', 'All India Institute of Ayurveda (Apex Centre)', 'New Delhi', 'Dr. Aanchal Singh', 412, 450, 'GCP Cleared', '2026-10-12'),
      ('SITE-02', 'National Institute of Ayurveda (NIA)', 'Jaipur, Rajasthan', 'Dr. R. K. Sharma', 284, 350, 'GCP Cleared', '2026-10-18'),
      ('SITE-03', 'Faculty of Ayurveda, IMS, BHU', 'Varanasi, UP', 'Dr. V. N. Pandey', 195, 250, 'GCP Cleared', '2026-10-24'),
      ('SITE-04', 'IPGT&RA, Gujarat Ayurved University', 'Jamnagar, Gujarat', 'Dr. H. M. Chandola', 110, 150, 'GCP Cleared', '2026-10-29'),
      ('SITE-05', 'Ayurveda College & Hospital', 'Kottakkal, Kerala', 'Dr. K. Murali', 84, 100, 'Initiating', '2026-11-04');

      INSERT INTO trial_patients (subject_id, study_id, age, gender, prakriti, consent_date, stage, compliance_rate) VALUES
      ('SUBJ-AIIA-0101', 'AIIA-CT-001', 52, 'Female', 'Pitta-Kapha', '2026-05-12', 'Dosing (Week 12)', 99),
      ('SUBJ-AIIA-0102', 'AIIA-CT-001', 48, 'Male', 'Vata-Pitta', '2026-05-24', 'Dosing (Week 8)', 97),
      ('SUBJ-AIIA-0205', 'AIIA-CT-002', 61, 'Female', 'Vataja', '2026-06-03', 'Completed', 100),
      ('SUBJ-AIIA-0310', 'AIIA-CT-003', 39, 'Male', 'Kaphaja', '2026-07-15', 'Screened (Pre-Dose)', 95),
      ('SUBJ-AIIA-0402', 'AIIA-CT-004', 55, 'Male', 'Vata-Kapha', '2026-08-02', 'Dosing (Week 4)', 98);

      INSERT INTO study_milestones (study_id, title, progress_pct, milestone_tag) VALUES
      ('AIIA-CT-001', 'AIIA-CT-001 (Nishamalaki Diabetes Trial)', 78, 'FPI Complete • Interim Data Review'),
      ('AIIA-CT-002', 'AIIA-CT-002 (Rasayana Oncology Trial)', 82, 'Patient Randomization Completed'),
      ('AIIA-CT-003', 'AIIA-CT-003 (Ashwagandha Fatigue Trial)', 65, 'Ethics Committee Review Underway'),
      ('AIIA-CT-004', 'AIIA-CT-004 (Haridra & Guggulu Osteoarthritis)', 71, 'Site Monitoring Visit Cycle 2'),
      ('AIIA-CT-005', 'AIIA-CT-005 (Guduchi Pharmacokinetics)', 40, 'Site Initiation & Protocol Clearance');
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
        const studiesRes = await client.query('SELECT * FROM clinical_studies ORDER BY id ASC');
        data.studies = studiesRes.rows;
      }

      if (tab === 'protocols' || tab === 'all') {
        const protocolsRes = await client.query(`
          SELECT p.*, s.title as study_title, s.ctri_number 
          FROM protocol_approvals p
          JOIN clinical_studies s ON p.study_id = s.study_id
          ORDER BY p.id ASC
        `);
        data.protocols = protocolsRes.rows;
      }

      if (tab === 'sites' || tab === 'all') {
        const sitesRes = await client.query('SELECT * FROM clinical_sites ORDER BY id ASC');
        data.sites = sitesRes.rows;
      }

      if (tab === 'patients' || tab === 'all') {
        const patientsRes = await client.query(`
          SELECT p.*, s.title as study_title 
          FROM trial_patients p
          JOIN clinical_studies s ON p.study_id = s.study_id
          ORDER BY p.id ASC
        `);
        data.patients = patientsRes.rows;
      }

      if (tab === 'milestones' || tab === 'all') {
        const milestonesRes = await client.query('SELECT * FROM study_milestones ORDER BY id ASC');
        data.milestones = milestonesRes.rows;
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

// POST endpoint: Insert real records directly into Neon
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload } = body;
    const client = await pool.connect();

    try {
      await initSchema(client);

      if (action === 'create_study') {
        const { studyId, title, phase, sitesCount, target, ctriNumber, therapeuticArea, herbalFormulation } = payload;
        const insertRes = await client.query(`
          INSERT INTO clinical_studies (study_id, title, phase, sites_count, enrolled, target, status, ctri_number, therapeutic_area, herbal_formulation, pi_name)
          VALUES ($1, $2, $3, $4, 0, $5, 'Ongoing', $6, $7, $8, 'Dr. Aanchal Singh')
          RETURNING *;
        `, [studyId, title, phase, sitesCount || 1, target || 100, ctriNumber, therapeuticArea, herbalFormulation]);

        // Add default approval entry
        await client.query(`
          INSERT INTO protocol_approvals (study_id, version, status)
          VALUES ($1, 'v1.0', 'Approved');
        `, [studyId]);

        return NextResponse.json({ success: true, study: insertRes.rows[0] });
      }

      if (action === 'enroll_patient') {
        const { subjectId, studyId, age, gender, prakriti } = payload;
        const insertRes = await client.query(`
          INSERT INTO trial_patients (subject_id, study_id, age, gender, prakriti, stage, compliance_rate)
          VALUES ($1, $2, $3, $4, $5, 'Dosing', 100)
          RETURNING *;
        `, [subjectId, studyId, age, gender, prakriti]);

        // Increment study enrolled count
        await client.query(`
          UPDATE clinical_studies SET enrolled = enrolled + 1 WHERE study_id = $1;
        `, [studyId]);

        return NextResponse.json({ success: true, patient: insertRes.rows[0] });
      }

      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Neon Insert Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
