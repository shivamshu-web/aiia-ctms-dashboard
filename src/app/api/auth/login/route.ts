import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const ANANYA_AVATAR = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=250&auto=format&fit=crop&q=80';
const POOJA_AVATAR = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80';

const AUTHORIZED_INVESTIGATORS: Record<string, {
  pass: string;
  name: string;
  role: string;
  degrees: string;
  specialization: string;
  department: string;
  councilRegNo: string;
  avatarUrl: string;
}> = {
  'aanchal.singh@aiia.gov.in': {
    pass: 'Aiia@2026#PI',
    name: 'Dr. Aanchal Singh',
    role: 'Principal Investigator (PI)',
    degrees: 'BAMS, MD (Kayachikitsa), PhD (Ayurveda)',
    specialization: 'Endocrinology, Metabolic Disorders & Clinical Rasayana',
    department: 'Department of Clinical Research & Kayachikitsa, AIIA New Delhi',
    councilRegNo: 'DBCP/2018/AY-48912',
    avatarUrl: '/doctor.jpg'
  },
  'sk.raman@aiia.gov.in': {
    pass: 'Cra@2026#Monitor',
    name: 'Dr. S. K. Raman',
    role: 'Lead CRA / Clinical Monitor',
    degrees: 'MBBS, MD (Pharmacology), PGDCR (Clinical Trials)',
    specialization: 'Clinical Monitoring, GCP-ASU & Protocol Quality Oversight',
    department: 'Centre for Good Clinical Practice, AIIA',
    councilRegNo: 'MCI/2012/MED-39014',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=250&auto=format&fit=crop&q=80'
  },
  'p.verma@aiia.gov.in': {
    pass: 'Data@2026#Manager',
    name: 'Pooja Verma',
    role: 'Clinical Data Manager',
    degrees: 'M.Sc (Biostatistics), CDISC Certified Professional',
    specialization: 'eCRF Validation, CDISC SDTM/ADaM, Database Lock (DBL)',
    department: 'Division of Biostatistics & Data Operations, AIIA',
    councilRegNo: 'ISCR/DATA/2020/0912',
    avatarUrl: POOJA_AVATAR
  },
  'ananya.joshi@aiia.gov.in': {
    pass: 'Pv@2026#Officer',
    name: 'Dr. Ananya Joshi',
    role: 'Pharmacovigilance Officer (NPvCC)',
    degrees: 'BAMS, MD (Dravyaguna Vigyana)',
    specialization: 'Herbal Safety Surveillance, WHO-UMC Causality & MedDRA',
    department: 'National Pharmacovigilance Centre for ASU Drugs (NPvCC)',
    councilRegNo: 'UPBC/2016/AY-77218',
    avatarUrl: ANANYA_AVATAR
  },
  'r.meena@cdsco.nic.in': {
    pass: 'Cdsco@2026#Auditor',
    name: 'Rajesh K. Meena',
    role: 'Regulatory Inspector (CDSCO)',
    degrees: 'M.Pharm (Regulatory Affairs), ISO 9001 Lead Auditor',
    specialization: 'NDCT Rules 2019, GCP-ASU Inspections & 21 CFR Part 11',
    department: 'Central Drugs Standard Control Organisation (CDSCO), North Zone',
    councilRegNo: 'CDSCO/GOI/AUD-9022',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=250&auto=format&fit=crop&q=80'
  }
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const investigator = AUTHORIZED_INVESTIGATORS[cleanEmail];

    if (!investigator || investigator.pass !== password) {
      return NextResponse.json({
        success: false,
        error: 'Access Denied: Unrecognized medical credentials or unauthorized account.'
      }, { status: 401 });
    }

    try {
      const client = await pool.connect();
      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS system_credentials (
            id SERIAL PRIMARY KEY,
            email VARCHAR(120) UNIQUE NOT NULL,
            password_hash VARCHAR(100),
            full_name VARCHAR(100) NOT NULL,
            role_title VARCHAR(80) NOT NULL,
            degrees VARCHAR(150),
            specialization TEXT,
            department TEXT,
            council_reg_no VARCHAR(100),
            avatar_url TEXT,
            last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          INSERT INTO system_credentials (email, password_hash, full_name, role_title, degrees, specialization, department, council_reg_no, avatar_url, last_login)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
          ON CONFLICT (email) DO UPDATE SET
            password_hash = EXCLUDED.password_hash,
            full_name = EXCLUDED.full_name,
            role_title = EXCLUDED.role_title,
            degrees = EXCLUDED.degrees,
            specialization = EXCLUDED.specialization,
            department = EXCLUDED.department,
            council_reg_no = EXCLUDED.council_reg_no,
            avatar_url = EXCLUDED.avatar_url,
            last_login = CURRENT_TIMESTAMP;
        `, [
          cleanEmail,
          investigator.pass,
          investigator.name,
          investigator.role,
          investigator.degrees,
          investigator.specialization,
          investigator.department,
          investigator.councilRegNo,
          investigator.avatarUrl
        ]);
      } finally {
        client.release();
      }
    } catch (dbErr) {
      console.warn("Neon credentials sync notice:", dbErr);
    }

    const userPayload = {
      email: cleanEmail,
      fullName: investigator.name,
      roleTitle: investigator.role,
      degrees: investigator.degrees,
      specialization: investigator.specialization,
      department: investigator.department,
      councilRegNo: investigator.councilRegNo,
      avatarUrl: investigator.avatarUrl
    };

    const response = NextResponse.json({
      success: true,
      user: userPayload
    });

    response.cookies.set('aiia_session', Buffer.from(JSON.stringify(userPayload)).toString('base64'), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 12,
      sameSite: 'lax'
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
