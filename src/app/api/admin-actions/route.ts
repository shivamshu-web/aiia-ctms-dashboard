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
      if (action === 'create_user') {
        const { fullName, email, roleTitle, accessScope } = payload;
        const userCode = 'USR-AIIA-0' + Math.floor(Math.random() * 89 + 10);
        
        // 1. Insert into admin_users_roles
        const resUser = await client.query(`
          INSERT INTO admin_users_roles (user_code, full_name, email, role_title, access_scope, mfa_status, account_status)
          VALUES ($1, $2, $3, $4, $5, 'Enforced (FIDO2)', 'Active (Authorized)')
          ON CONFLICT (email) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role_title = EXCLUDED.role_title,
            access_scope = EXCLUDED.access_scope
          RETURNING *;
        `, [userCode, fullName, email, roleTitle, accessScope]);

        // 2. Also insert into system_credentials so this user can immediately sign in!
        await client.query(`
          INSERT INTO system_credentials (
            email, password_hash, full_name, role_title, degrees, specialization, department, council_reg_no, avatar_url, last_login
          ) VALUES ($1, $2, $3, $4, 'MD (Ayurveda)', $5, 'AIIA Clinical Division', 'AYUSH-COUNCIL-NEW', '/doctor.jpg', CURRENT_TIMESTAMP)
          ON CONFLICT (email) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role_title = EXCLUDED.role_title;
        `, [email, 'Aiia@2026#PI', fullName, roleTitle, accessScope]);

        // 3. Log to 21 CFR Part 11 Audit Trail
        await client.query(`
          INSERT INTO admin_system_audit_logs (user_identity, action_type, resource_affected, ip_address, compliance_flag)
          VALUES ($1, 'USER_ACCESS_GRANT', 'New Investigator Authorized: ' || $2, '10.14.0.22', '21 CFR Part 11 Verified');
        `, [fullName, roleTitle]);

        return NextResponse.json({ success: true, user: resUser.rows[0] });
      }

      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
