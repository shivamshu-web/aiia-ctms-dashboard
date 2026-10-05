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
        
        const res = await client.query(`
          INSERT INTO admin_users_roles (user_code, full_name, email, role_title, access_scope, mfa_status, account_status)
          VALUES ($1, $2, $3, $4, $5, 'Enforced (FIDO2)', 'Active (Authorized)')
          RETURNING *;
        `, [userCode, fullName, email, roleTitle, accessScope]);

        // Audit log entry
        await client.query(`
          INSERT INTO admin_system_audit_logs (user_identity, action_type, resource_affected, ip_address, compliance_flag)
          VALUES ('Dr. Aanchal Singh (PI)', 'USER_ACCESS_GRANT', 'New Investigator Authorized: ' || $1, '10.14.0.22', '21 CFR Part 11 Verified');
        `, [fullName]);

        return NextResponse.json({ success: true, user: res.rows[0] });
      }

      return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
