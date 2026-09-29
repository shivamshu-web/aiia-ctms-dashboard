import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { convertToFHIRResearchStudy } from '@/lib/fhir-converter';

export async function GET() {
  try {
    const studies = await db.study.findMany({ take: 5 });
    const bundle = {
      resourceType: 'Bundle',
      type: 'collection',
      timestamp: new Date().toISOString(),
      entry: studies.map((s: any) => ({ resource: convertToFHIRResearchStudy(s) })),
    };
    return NextResponse.json(bundle);
  } catch (err) {
    return NextResponse.json({ resourceType: 'Bundle', entry: [] });
  }
}
