import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const patients = await db.patient.findMany({ take: 20 });
    return NextResponse.json(patients);
  } catch (err) {
    return NextResponse.json([]);
  }
}
