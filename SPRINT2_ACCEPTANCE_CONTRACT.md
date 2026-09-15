# Sprint 2 — Platform Onboarding & First Tenant
## Engineering Specification & Acceptance Contract

**Status:** ACTIVE  
**Sprint:** Sprint 2  
**Project:** AQL Platform  
**Repository:** atefAkl/aql-platform  
**Branch:** main  
**Owner:** Product Owner / Lead Developer  
**Implementation Agent:** Antigravity  

---

# 1. Purpose

This document is the authoritative execution and acceptance specification for Sprint 2.

The objective is to implement and verify the Platform Onboarding lifecycle from a Zero-State / Fresh Platform (No Tenants) to registering the first tenant via UI, provisioning its isolated environment, and entering the Platform Shell as Administrator.

Sprint 2 does NOT depend on Demo Data, Seeded Tenants, or Seeded Users.

---

# 2. Scope

### In Scope
1. Public Onboarding Entry Point (`GET /onboarding` or `GET /register-tenant`).
2. Registration form (Organization Name, Tenant Slug, Administrator Name, Administrator Email, Password, Password Confirmation).
3. Server-side validation and database-level duplicate slug/domain protection.
4. Tenant Provisioning via `TenantProvisioningService` (Landlord DB record, Domain mapping, Tenant DB, Tenant Migrations, Base permissions catalog, Initial Admin User, `TENANT_PROVISIONED` audit record).
5. Automatic authenticated session creation upon onboarding success and immediate redirect to Platform Shell (`/users`).
6. Transactional safety & failure handling (rollback on provisioning errors).
7. Guidance from `/login` to `/onboarding` when zero tenants exist.
8. Complete Automated Acceptance Tests (Tests 1 through 12).
9. End-to-end Manual Acceptance Scenario verification.

---

# 3. Required Test Cases (Tests 1 - 12)

1. **Test 1 — Fresh Platform Has No Tenant**: Verify `Tenant::count() === 0` initially.
2. **Test 2 — First Tenant Can Be Created**: POST `/onboarding` request creates `Tenant` and `Domain` in Landlord DB.
3. **Test 3 — Tenant Database Is Provisioned**: Tenant DB contains required tables (`users`, `permissions`, `user_permissions`, `roles`, `audit_logs`).
4. **Test 4 — Initial Administrator Is Created**: Admin user created in Tenant DB, hashed password, correct email & name.
5. **Test 5 — Administrator Has Required Permissions**: Admin possesses effective permissions (`users.view`, `expenses.view`, `audit.view`, etc.).
6. **Test 6 — Registration Creates Authenticated Tenant Session**: POST `/onboarding` establishes session & immediate access to `/users`.
7. **Test 7 — No Tenant Means No Arbitrary Tenant Selection**: Unauthenticated requests without tenant context redirect to login/onboarding without selecting `$firstTenant`.
8. **Test 8 — Duplicate Slug Is Rejected**: Submitting duplicate tenant slug returns validation error & prevents duplicate DB creation.
9. **Test 9 — Failed Provisioning Does Not Report Success**: Provisioning exception triggers safe failure response & no broken session.
10. **Test 10 — Tenant Isolation**: Admin A cannot access or query Tenant B data (403 HTTP denial).
11. **Test 11 — Audit Is Created**: `TENANT_PROVISIONED` audit event recorded in Tenant audit trail.
12. **Test 12 — Password Never Appears in Audit**: Passwords & sensitive credentials excluded from audit logs & serialized data.

---

# 4. Final Delivery Report Format (Section 7)

Antigravity will issue `SPRINT 2 — FINAL ACCEPTANCE REPORT` upon satisfying all contract requirements with empirical evidence.
