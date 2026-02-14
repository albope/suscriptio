-- Function to allow authenticated users to delete their own account
-- Uses SECURITY DEFINER to execute with elevated privileges
-- auth.uid() ensures users can only delete themselves
-- CASCADE on user_profiles and subscriptions handles related data

CREATE OR REPLACE FUNCTION delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION delete_own_account() TO authenticated;
-- Revoke from anon/public so unauthenticated users cannot call it
REVOKE EXECUTE ON FUNCTION delete_own_account() FROM anon, public;
