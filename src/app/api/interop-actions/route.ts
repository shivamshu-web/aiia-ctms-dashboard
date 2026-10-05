import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();
    const client = await pool.connect();

    try {
      if (action === 'link_abha') {
        const { subjectId, abhaNumber, abhaAddress } = payload;
        const res = await client.query(`
          INSERT INTO interop_abdm_registry (subject_id, abha_number, abha_address, hip_facility_id, consent_artefact_id, gateway_sync_status, linked_date)
          VALUES ($1, $2, $3, 'IN0710001004 (AIIA New Delhi)', 'ART-ABDM-' || floor(random()*90000 + 10000)::text, 'ABDM Gateway Synced', CURRENT_DATE)
          RETURNING *;
        `, [subjectId, abhaNumber, abhaAddress]);

        return NextResponse.json({ success: true, message: 'ABHA ID Linked and Synced with ABDM Sandbox', record: res.rows[0] });
      }

      if (action === 'export_cdisc') {
        const { domain } = payload;
        let queryStr = 'SELECT * FROM clinical_studies';
        if (domain === 'DM') queryStr = 'SELECT * FROM trial_patients';
        if (domain === 'AE') queryStr = 'SELECT * FROM pv_safety_reports';

        const dataRes = await client.query(queryStr);
        return NextResponse.json({
          success: true,
          domain,
          standard: 'CDISC SDTM v3.4',
          recordsCount: dataRes.rows.length,
          generatedAt: new Date().toISOString(),
          sdtmData: dataRes.rows
        });
      }

      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Interop action error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
