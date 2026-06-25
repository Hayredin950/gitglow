
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing db.account...');
    const testAccount = await db.account.findFirst({
      where: { provider: 'github', providerAccountId: 'test' },
    });
    console.log('testAccount:', testAccount);
    return NextResponse.json({ success: true, testAccount });
  } catch (e) {
    console.error('Test error:', e);
    console.error('Error JSON:', JSON.stringify(e, null, 2));
    return NextResponse.json({ error: String(e), details: JSON.stringify(e, null, 2) }, { status: 500 });
  }
}
