import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface GoalEditLock {
  id: string;
  user_id: string;
  goal_id: string;
  locked_at: string;
  lock_until: string;
  locked_by: string;
}

export interface GoalEdit {
  id: string;
  user_id: string;
  goal_id: string;
  old_value: any;
  new_value: any;
  change_type: 'create' | 'update' | 'delete';
  edited_at: string;
  edited_by: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: any;
  timestamp: string;
}

/**
 * Lock a goal for editing (prevents concurrent modifications)
 * @param userId User ID
 * @param goalId Goal ID to lock
 * @param lockDurationMinutes Duration for lock (default 30 minutes)
 * @returns Lock record or error
 */
export async function lockGoal(
  userId: string,
  goalId: string,
  lockDurationMinutes = 30
): Promise<GoalEditLock | null> {
  const lockUntil = new Date(Date.now() + lockDurationMinutes * 60000);

  // Check existing locks
  const { data: existingLock } = await supabase
    .from('goal_edit_locks')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .single();

  if (existingLock && new Date(existingLock.lock_until) > new Date()) {
    throw new Error('Goal is already locked');
  }

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
  return data;
}

/**
 * Check if a goal is currently locked
 * @param userId User ID
 * @param goalId Goal ID to check
 * @returns Lock record if locked, null otherwise
 */
export async function isGoalLocked(
  userId: string,
  goalId: string
): Promise<GoalEditLock | null> {
  const { data } = await supabase
    .from('goal_edit_locks')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .single();

  if (data && new Date(data.lock_until) > new Date()) {
    return data;
  }
  return null;
}

/**
 * Unlock a goal for editing
 * @param userId User ID
 * @param goalId Goal ID to unlock
 * @returns Success status
 */
export async function unlockGoal(
  userId: string,
  goalId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('goal_edit_locks')
    .delete()
    .eq('user_id', userId)
    .eq('goal_id', goalId);

  if (error) throw error;

  // Log unlock action
  await logAuditEvent(userId, 'unlock', 'goal', goalId, {});
  return true;
}

/**
 * Record a goal edit with audit trail
 * @param userId User ID
 * @param goalId Goal ID
 * @param oldValue Previous value
 * @param newValue New value
 * @param changeType Type of change
 * @returns Edit record
 */
export async function recordGoalEdit(
  userId: string,
  goalId: string,
  oldValue: any,
  newValue: any,
  changeType: 'create' | 'update' | 'delete' = 'update'
): Promise<GoalEdit> {
  // Check if goal is locked
  const lock = await isGoalLocked(userId, goalId);
  if (lock) {
    throw new Error('Goal is locked until ' + lock.lock_until);
  }

  // Record the edit
  const { data: editData, error: editError } = await supabase
    .from('goal_edits')
    .insert({
      user_id: userId,
      goal_id: goalId,
      old_value: oldValue,
      new_value: newValue,
      change_type: changeType,
      edited_by: userId,
    })
    .select()
    .single();

  if (editError) throw editError;

  // Log to audit log
  await logAuditEvent(userId, changeType, 'goal', goalId, {
    old_value: oldValue,
    new_value: newValue,
    edit_id: editData?.id,
  });

  return editData;
}

/**
 * Log an audit event
 * @param userId User ID
 * @param action Action performed
 * @param entityType Type of entity (goal, day_entry, etc.)
 * @param entityId ID of the entity
 * @param details Additional details
 */
export async function logAuditEvent(
  userId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: any
): Promise<AuditLog> {
  const { data, error } = await supabase
    .from('goal_audit_log')
    .insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get edit history for a goal
 * @param userId User ID
 * @param goalId Goal ID
 * @returns Array of edits
 */
export async function getGoalEditHistory(
  userId: string,
  goalId: string
): Promise<GoalEdit[]> {
  const { data, error } = await supabase
    .from('goal_edits')
    .select('*')
    .eq('user_id', userId)
    .eq('goal_id', goalId)
    .order('edited_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get audit log for a goal
 * @param userId User ID
 * @param goalId Goal ID
 * @param limit Number of records to fetch
 * @returns Array of audit logs
 */
export async function getGoalAuditLog(
  userId: string,
  goalId: string,
  limit = 50
): Promise<AuditLog[]> {
  const { data, error } = await supabase
    .from('goal_audit_log')
    .select('*')
    .eq('user_id', userId)
    .eq('entity_id', goalId)
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
