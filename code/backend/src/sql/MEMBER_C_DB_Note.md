# Database Implementation Guide
## Member C — Tracking & Notification Module

This note explains how the database tables for **Member C** are managed in the School Transport Vehicle Management System.

---

# 1. Database Method Used

Member C now follows the same database method used by the team:

```text
SQL schema files stored in the repository
```

The SQL files are located in:

```text
backend/src/sql/
```

Member C SQL files:

```text
journey_locations.sql
notifications.sql
student_boarding.sql
student_dropoff.sql
journey_events.sql
member_c_setup.sql
```

These files define the database structure for the Tracking and Notification module.

---

# 2. Tables Owned by Member C

Member C is responsible for these tables only:

| Table | Purpose |
|------|------|
| `journey_locations` | Stores realtime van GPS coordinates |
| `notifications` | Stores system notifications |
| `student_boarding` | Stores student pickup/boarding events |
| `student_dropoff` | Stores student drop-off events |
| `journey_events` | Stores journey lifecycle events |

Rule:

```text
Only Member C should modify these SQL files unless agreed by the team.
```

---

# 3. Table Purpose

## `journey_locations`
Stores driver location updates.

Important columns:

```text
driver_id
journey_id
latitude
longitude
recorded_at
```

Used by:

```text
tracking API
journey status API
map integration
socket realtime updates
```

---

## `notifications`
Stores notification history.

Important columns:

```text
journey_id
user_id
type
message
is_read
created_at
```

Used by:

```text
notification history API
unread notification count
mark as read
socket notification broadcast
```

---

## `student_boarding`
Stores boarding events.

Important columns:

```text
journey_id
student_id
driver_id
boarded_at
```

Used by:

```text
boarding API
journey status summaries
future attendance integration
```

---

## `student_dropoff`
Stores drop-off events.

Important columns:

```text
journey_id
student_id
driver_id
dropped_at
```

Used by:

```text
drop-off API
journey completion summaries
future parent safety confirmation
```

---

## `journey_events`
Stores lifecycle events.

Examples:

```text
pickup_started
arrived_school
journey_completed
```

Used by:

```text
journey events API
notification generation
admin dashboard summaries
```

---

# 4. Setup Procedure

To create Member C tables, run:

```bash
cd backend
psql -d school_van_db -f src/sql/member_c_setup.sql
```

This file runs all Member C schema files together.

Because the schema files use:

```sql
CREATE TABLE IF NOT EXISTS
```

the setup is safe even if the tables already exist.

---

# 5. Important Rules

## Rule 1 — Do not manually create tables in terminal anymore

Use SQL schema files in:

```text
backend/src/sql/
```

---

## Rule 2 — Commit SQL changes through Git

Example:

```bash
git add backend/src/sql/notifications.sql
git commit -m "feat: update notifications schema"
```

---

## Rule 3 — Do not modify other members' SQL files

Member C should not directly modify:

```text
drivers.sql
vehicles.sql
routes.sql
route_stops.sql
```

If integration requires changes, discuss with the responsible member first.

---

# 6. Dependencies on Other Members

## Member A
Tracking depends on authentication middleware and real JWT login flow.

Currently a temporary dev auth route is used.

---

## Member B
Tracking depends on valid `journeyId`, `studentId`, routes, and stop data.

Future integration will connect Member C tables with Member B route/journey data.

---

## Member D
Admin dashboards can use Member C tables for journey summaries and notification monitoring.

---

# 7. Future Improvements

Recommended future database improvements:

- add foreign keys when related tables are finalized
- connect `journey_id` to real journeys table
- connect `student_id` to real students table
- connect `user_id` to real parents/users table
- add indexes for future high-volume queries if needed

---

# 8. Summary

Member C database tables are now managed using the team SQL schema file method.

This ensures:

- consistent database structure
- version control support
- easier onboarding
- safer team collaboration
- fewer schema conflicts