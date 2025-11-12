# Supabase Client Examples (JS)

All examples use `@supabase/supabase-js@2`.

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>
```

## 1) Auth: Magic Link and Email/Password

```js
// Magic link sign-in
await supabase.auth.signInWithOtp({ email });

// Email + password sign-up/sign-in
await supabase.auth.signUp({ email, password });
await supabase.auth.signInWithPassword({ email, password });

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

## 2) Password Reset

```js
// Start reset flow (user enters email)
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://yourdomain/reset'
});

// On /reset page (after redirect)
await supabase.auth.updateUser({ password: newPassword });
```

## 3) Upsert Profile (full name / org / tz)

```js
const { data: { user } } = await supabase.auth.getUser();
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
await supabase.from('profiles').upsert({
  user_id: user.id,
  email: user.email,
  full_name: name,
  organization: org,
  tz
});
```

## 4) Register for a Session

```js
await supabase.from('registrations').insert({
  email,
  full_name: name,
  organization: org,
  role,
  session_id: 's1',
  session_start_utc: '2025-12-04T09:00:00Z',
  session_end_utc: '2025-12-04T11:00:00Z',
  tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  user_agent: navigator.userAgent
});
```

## 5) Begin Assessment (enforced by DB)

```js
const { data: { user } } = await supabase.auth.getUser();
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const { error } = await supabase.from('assessment_attempts').insert({
  user_id: user.id,
  email: user.email,
  full_name: name,          // collect from profile or prompt
  organization: org,        // optional
  tz
});
if (error) {
  // Database trigger returns a readable reason
  alert(error.message); // e.g., "Assessment start blocked: maximum attempts reached"
} else {
  // redirect to assessment app/URL
}
```

## 6) Mark Completion (server/service role only)

```js
import { createClient } from '@supabase/supabase-js';
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

await admin.from('assessment_attempts')
  .update({ status: 'pass', completed_at: new Date().toISOString() })
  .eq('id', attemptId);

// or fail
await admin.from('assessment_attempts')
  .update({ status: 'fail', completed_at: new Date().toISOString() })
  .eq('id', attemptId);
```

## 7) Check Eligibility (admin helper)

```sql
select * from can_start_assessment(
  '00000000-0000-0000-0000-000000000000', -- user_id
  'user@example.com',                    -- email
  'Ada Lovelace',                        -- full_name
  'SHE IS AI',                           -- organization
  now()
);
```

## 8) Admin Reports

```sql
-- Recent alerts for suspected duplicate identity
select * from identity_alerts order by created_at desc limit 50;

-- Attempts per identity
select identity_key, count(*),
       sum((status='pass')::int) as passes,
       sum((status='fail')::int) as fails
from assessment_attempts
group by identity_key
order by count(*) desc;
```
