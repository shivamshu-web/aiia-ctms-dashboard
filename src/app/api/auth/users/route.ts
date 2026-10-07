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
      // Query authorized investigators directly from Neon PostgreSQL
      const res = await client.query(`
        SELECT 
          u.user_code,
          u.full_name,
          u.email,
          u.role_title,
          u.access_scope,
          COALESCE(c.degrees, 'MD (Ayurveda)') as degrees,
          COALESCE(c.specialization, 'Clinical Trials') as specialization,
          COALESCE(c.department, 'AIIA New Delhi') as department,
          COALESCE(c.council_reg_no, 'AYUSH-VERIFIED') as council_reg_no,
          COALESCE(c.avatar_url, '/doctor.jpg') as avatar_url,
          COALESCE(c.password_hash, 'Aiia@2026#PI') as default_pass
        FROM admin_users_roles u
        LEFT JOIN system_credentials c ON LOWER(u.email) = LOWER(c.email)
        WHERE u.account_status LIKE '%Active%'
        ORDER BY u.id ASC;
      `);

      return NextResponse.json({ success: true, users: res.rows });
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
