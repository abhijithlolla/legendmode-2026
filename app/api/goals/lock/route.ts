'use server';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { goalId, lockDurationMinutes = 30 } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || !goalId) {
      return NextResponse.json(
        { error: 'Missing token or goalId' },
        { status: 400 }
      );
    }

    // Verify JWT token and get user ID
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;
    const lockUntil = new Date(Date.now() + lockDurationMinutes * 60000);

    // Check if already locked
    const { data: existingLock } = await supabase
      .from('goal_edit_locks')
      .select('*')
      .eq('user_id', userId)
      .eq('goal_id', goalId)
      .single();

    if (existingLock && new Date(existingLock.lock_until) > new Date()) {
      return NextResponse.json(
        { error: 'Goal is already locked', lockUntil: existingLock.lock_until },
        { status: 409 }
      );
    }

    // Create or update lock
    const { data, error } = await supabase
      .from('goal_edit_locks')
      .upsert(
        {
          user_id: userId,
          goal_id: goalId,
          lock_until: lockUntil,
          locked_by: userId,
        },
        { onConflict: 'user_id,goal_id' }
      )
      .select()
      .single();

    if (error) throw error;

    // Log to audit log
    await supabase.from('goal_audit_log').insert({
      user_id: userId,
      action: 'lock',
      entity_type: 'goal',
      entity_id: goalId,
      details: { lock_until: lockUntil, duration_minutes: lockDurationMinutes },
    });

    return NextResponse.json({ success: true, lock: data });
  } catch (error) {
    console.error('Lock goal error:', error);
    return NextResponse.json(
      { error: 'Failed to lock goal' },
      { status: 500 }
    );
  }
}
