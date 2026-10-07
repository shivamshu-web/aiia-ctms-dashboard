import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
});

// Master 5 Authorized Personnel (Always Guaranteed)
const CORE_AUTHORIZED_USERS = [
  {
    user_code: 'USR-AIIA-001',
    full_name: 'Dr. Aanchal Singh',
    email: 'aanchal.singh@aiia.gov.in',
    role_title: 'Principal Investigator (PI)',
    access_scope: 'All Protocols • E-Sign Approvals • DBL Signoff',
    degrees: 'BAMS, MD (Kayachikitsa), PhD',
    specialization: 'Endocrinology, Metabolic Disorders & Clinical Rasayana',
    department: 'Department of Clinical Research, AIIA New Delhi',
    council_reg_no: 'DBCP/2018/AY-48912',
    avatar_url: '/doctor.jpg',
    default_pass: 'Aiia@2026#PI'
  },
  {
    user_code: 'USR-AIIA-002',
    full_name: 'Dr. S. K. Raman',
    email: 'sk.raman@aiia.gov.in',
    role_title: 'Lead CRA / Clinical Monitor',
    access_scope: 'Visits & Monitoring • MVR Logs • Site Access',
    degrees: 'MBBS, MD (Pharmacology), PGDCR',
    specialization: 'Clinical Monitoring, GCP-ASU & Protocol Quality Oversight',
    department: 'Centre for Good Clinical Practice, AIIA',
    council_reg_no: 'MCI/2012/MED-39014',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=250&auto=format&fit=crop&q=80',
    default_pass: 'Cra@2026#Monitor'
  },
  {
    user_code: 'USR-AIIA-003',
    full_name: 'Pooja Verma',
    email: 'p.verma@aiia.gov.in',
    role_title: 'Clinical Data Manager',
    access_scope: 'eCRF Queries • Database Lock (DBL) • CDISC',
    degrees: 'M.Sc (Biostatistics), CDISC Certified',
    specialization: 'eCRF Validation, CDISC SDTM/ADaM, Database Lock (DBL)',
    department: 'Division of Biostatistics & Data Operations, AIIA',
    council_reg_no: 'ISCR/DATA/2020/0912',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
    default_pass: 'Data@2026#Manager'
  },
  {
    user_code: 'USR-AIIA-004',
    full_name: 'Dr. Ananya Joshi',
    email: 'ananya.joshi@aiia.gov.in',
    role_title: 'Pharmacovigilance Officer (NPvCC)',
    access_scope: 'ADR / SAE Reporting • PvPI Gateway • Signal Detection',
    degrees: 'BAMS, MD (Dravyaguna Vigyana)',
    specialization: 'Herbal Safety Surveillance, WHO-UMC Causality & MedDRA',
    department: 'National Pharmacovigilance Centre for ASU Drugs (NPvCC)',
    council_reg_no: 'UPBC/2016/AY-77218',
    avatar_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=250&auto=format&fit=crop&q=80',
    default_pass: 'Pv@2026#Officer'
  },
  {
    user_code: 'USR-AIIA-005',
    full_name: 'Rajesh K. Meena',
    email: 'r.meena@cdsco.nic.in',
    role_title: 'Regulatory Inspector (CDSCO)',
    access_scope: 'Read-Only Audit Trail • Dossier Inspection',
    degrees: 'M.Pharm (Regulatory Affairs)',
    specialization: 'NDCT Rules 2019, GCP-ASU Inspections & 21 CFR Part 11',
    department: 'Central Drugs Standard Control Organisation (CDSCO), North Zone',
    council_reg_no: 'CDSCO/GOI/AUD-9022',
    avatar_url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=250&auto=format&fit=crop&q=80',
    default_pass: 'Cdsco@2026#Auditor'
  }
];

export async function GET() {
  let usersList = [...CORE_AUTHORIZED_USERS];

  try {
    const client = await pool.connect();
    try {
      // 1. Ensure table exists
      await client.query(`
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
      `);

      // 2. Insert all 5 into Neon if not present
      for (const u of CORE_AUTHORIZED_USERS) {
        await client.query(`
          INSERT INTO admin_users_roles (user_code, full_name, email, role_title, access_scope, mfa_status, account_status)
          VALUES ($1, $2, $3, $4, $5, 'Enforced (FIDO2)', 'Active (Authorized)')
          ON CONFLICT (email) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role_title = EXCLUDED.role_title,
            access_scope = EXCLUDED.access_scope;
        `, [u.user_code, u.full_name, u.email, u.role_title, u.access_scope]);
      }

      // 3. Query all users from DB
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
        ORDER BY u.id ASC;
      `);

      if (res.rows && res.rows.length >= 5) {
        usersList = res.rows;
      }
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.warn("Neon read note (using master 5):", err.message);
  }

  return NextResponse.json({ success: true, users: usersList });
}
