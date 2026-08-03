# Database Schema Reference — Friendli Tripz

## Supabase Postgres Architecture

### Key Tables & Relations

1. **`admin_profiles`**
   - `id` (uuid, PK, references `auth.users`)
   - `full_name` (text, required)
   - `role` (text, ENUM: `owner`, `admin`, `operations`, `sales`, `support`, `finance`, `marketing`, `viewer`)
   - `department_id` (uuid, FK `departments.id`)
   - `is_active` (boolean, default `true`)

2. **`enquiries`**
   - `id` (uuid, PK)
   - `reference` (text, unique)
   - `name`, `phone`, `email` (text)
   - `destination` (text)
   - `traveller_count` (integer)
   - `status` (text: `new`, `contacted`, `converted`, `lost`)
   - `assigned_to` (uuid, FK `admin_profiles.id`)

3. **`admin_activity_logs`** (Immutable Audit Trail)
   - `id` (uuid, PK)
   - `admin_id` (uuid, FK `admin_profiles.id`)
   - `action` (text)
   - `details` (jsonb)
   - `created_at` (timestamptz)
