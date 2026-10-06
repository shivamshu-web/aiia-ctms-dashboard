import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Authorized clinical demo users
const AUTHORIZED_ACCOUNTS: Record<string, { pass: string; name: string; role: string }> = {
  'aanchal.singh@aiia.gov.in': {
    pass: 'Aiia@2026#PI',
    name: 'Dr. Aanchal Singh',
    role: 'Principal Investigator (PI)'
  },
  'sk.raman@aiia.gov.in': {
    pass: 'Cra@2026#Monitor',
    name: 'Dr. S. K. Raman',
    role: 'Lead CRA / Clinical Monitor'
  },
  'p.verma@aiia.gov.in': {
    pass: 'Data@2026#Manager',
    name: 'Pooja Verma',
    role: 'Clinical Data Manager'
  },
  'r.meena@cdsco.nic.in': {
    pass: 'Cdsco@2026#Auditor',
    name: 'Rajesh K. Meena',
    role: 'Regulatory Inspector (CDSCO)'
  }
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check credentials match
    const account = AUTHORIZED_ACCOUNTS[cleanEmail];
    if (!account || account.pass !== password) {
      return NextResponse.json({
        success: false,
        error: 'Invalid Institutional Credentials or Unauthorized Access.'
      }, { status: 401 });
    }

    // Attempt to persist session in Neon PostgreSQL (optional background logging)
    try {
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS system_credentials (
            id SERIAL PRIMARY KEY,
            email VARCHAR(120) UNIQUE NOT NULL,
            password_hash VARCHAR(100) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            role_title VARCHAR(80) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `);

        await client.query(`
          INSERT INTO system_credentials (email, password_hash, full_name, role_title)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (email) DO NOTHING;
        `, [cleanEmail, account.pass, account.name, account.role]);
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn("Neon auth table log skipped:", dbErr);
    }

    // Set secure auth response
    const response = NextResponse.json({
      success: true,
      user: {
        email: cleanEmail,
        fullName: account.name,
        roleTitle: account.role
      }
    });

    response.cookies.set('aiia_session', Buffer.from(JSON.stringify(account)).toString('base64'), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: 'lax'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
