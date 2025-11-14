import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures this route is not cached

// 1. IMPORTANT: Paste your live test user's ID here
const TEST_USER_ID = 'YOUR_TEST_USER_ID_HERE';

export async function POST(request: Request) {
  // 2. Check for the secret key
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 3. Create an admin client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 4. 72-hour logic
  try {
    const { error } = await supabaseAdmin
      .from('content')
      .delete()
      .eq('author_id', TEST_USER_ID) // Only the test user's content
      .lt('created_at', `(now() - interval '72 hours')`); // Only if older than 72 hours

    if (error) throw error;
    return NextResponse.json({ message: 'Old test user content cleaned' });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
