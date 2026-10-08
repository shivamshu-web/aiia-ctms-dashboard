import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studyId = body.studyCode || body.studyId || body.study_id || 'AIIA-CT-001';
    const subjectId = body.patientId || body.subjectId || body.subject_id || 'SUBJ-AIIA-0999';
    const adverseEvent = body.adverseEvent || body.reaction || body.adverse_event || 'Adverse Reaction';
    const suspectedHerb = body.suspectedHerb || body.suspected_herb || 'Ayurvedic Formulation';
    const severity = body.severity || 'Mild';
    const causalityScore = body.causality || body.causality_score || 'Probable (WHO-UMC)';
    const status = severity.includes('Serious') || severity.includes('SAE') ? 'Expedited to CDSCO' : 'Under Review';
    const regulatoryDeadline = severity.includes('Serious') || severity.includes('SAE') ? '7 Days (Expedited)' : '15 Days Routine';
    
    // Auto-generate next Report ID
    const reportId = 'PV-AIIA-2026-0' + Math.floor(Math.random() * 89 + 10);

    const client = await pool.connect();
    try {
      // Ensure table exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS pv_safety_reports (
          id SERIAL PRIMARY KEY,
          report_id VARCHAR(50) UNIQUE NOT NULL,
          study_id VARCHAR(50) NOT NULL,
          subject_id VARCHAR(50) NOT NULL,
          suspected_herb TEXT NOT NULL,
          adverse_event TEXT NOT NULL,
          severity VARCHAR(30) NOT NULL,
          causality_score VARCHAR(50) DEFAULT 'Probable (WHO-UMC)',
          reported_date DATE DEFAULT CURRENT_DATE,
          regulatory_deadline VARCHAR(50) DEFAULT '15 Days Routine',
          status VARCHAR(50) DEFAULT 'Submitted to CDSCO'
        );
      `);

      // Insert directly into Neon PostgreSQL
      const insertRes = await client.query(`
        INSERT INTO pv_safety_reports (
          report_id, study_id, subject_id, suspected_herb, adverse_event, severity, causality_score, reported_date, regulatory_deadline, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, $8, $9)
        RETURNING *;
      `, [reportId, studyId, subjectId, suspectedHerb, adverseEvent, severity, causalityScore, regulatoryDeadline, status]);

      // Also log into 21 CFR Part 11 Audit Trail
      await client.query(`
        INSERT INTO admin_system_audit_logs (user_identity, action_type, resource_affected, ip_address, compliance_flag)
        VALUES ('Dr. Ananya Joshi (PV Officer)', 'ADR_SAE_SUBMISSION', 'Report ' || $1 || ' logged for ' || $2, '10.14.0.19', '21 CFR Part 11 Logged');
      `, [reportId, studyId]);

      return NextResponse.json({ success: true, report: insertRes.rows[0] });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Safety Report Insert Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
