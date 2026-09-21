# Final Execution Plan (Tenant Lifecycle)

**Status:** APPROVED FOR IMPLEMENTATION (Pending START Command)

## 1. Architectural Decisions Applied

- **Q1 (Tenant Before Provisioning):** The `tenants` table `status` column will be made `nullable`. A value of `NULL` is strictly documented as a **Pre-Operational Condition**, *not* a Lifecycle State. It mathematically represents that the Tenant Record exists, but its Operational Lifecycle has not yet begun.
- **Q2 (Provisioning Failure & Retry):** Provisioning is a Process with a Compensation mechanism. If it fails, the Tenant DB and domains are dropped (Compensation), but the Tenant Record remains in the Landlord DB, and the Request remains `APPROVED`. This allows the same request to retry Activation.

---

## 2. Subscription Request Lifecycle

1. **Transitions:**
   - `PENDING -> REJECTED` (terminal, one-way).
   - `PENDING -> APPROVED` (creates Tenant record).
   - `APPROVED -> COMPLETED` (terminal, upon successful provisioning).
2. **RegistrationRequestController:**
   - **`approve()`:** 
     - Update request status to `approved`.
     - Create the `Tenant` record in Landlord DB with `status = NULL`.
     - Use `Tenant::withoutEvents()` to guarantee no Tenant DB or migrations are triggered at this stage.
   - **`reject()` (Replaces `suspend`):** 
     - Strict one-way transition: `PENDING -> REJECTED`.
   - **`destroy()`:** 
     - Block deletion. Throw an exception or return an error ensuring immutability.

---

## 3. Onboarding & Provisioning Process

1. **TenantProvisioningService:**
   - **No New Tenant Creation:** Fetch the existing Tenant created during `Approval`.
   - **Idempotency & Event Dispatch:** Programmatically execute `CreateDatabase` and `MigrateDatabase` to prevent double-provisioning issues.
   - **Compensation on Failure:** 
     - If provisioning fails, drop the Tenant Database and delete linked domains.
     - **Keep the Landlord Tenant Record intact.**
     - The Request remains `APPROVED`, enabling a Retry.
2. **ActivationController (Consistency Check & Transaction):**
   - **Provisioning Execution:** First, execute the Provisioning Process (and Compensation if it fails) *outside* the Landlord transaction.
   - **Landlord Transaction (Success Only):** ONLY after provisioning succeeds completely, open a Landlord Database Transaction to atomically apply:
     - `Tenant->status = 'active'`
     - `Request->status = 'completed'`
   - This ensures `Provisioning Success -> Tenant ACTIVE -> Request COMPLETED` always commits together.

---

## 4. Tenant Operational Lifecycle

1. **Strict Allowed States:** `ACTIVE`, `SUSPENDED`, `ARCHIVED`.
2. **Platform Admin Tools:**
   - Explicit named commands/routes for Admin to transition tenants:
     - `SuspendTenantCommand`: `ACTIVE -> SUSPENDED`
     - `ArchiveTenantCommand`: `SUSPENDED -> ARCHIVED`
     - `RestoreTenantCommand`: `SUSPENDED -> ACTIVE` / `ARCHIVED -> ACTIVE`
3. **SUSPENDED Logic (Write-blocker):**
   - Remove `EnsureTenantIsActive` (which incorrectly blocks Auth and relies on `provisioned`).
   - Create `PreventTenantWritesIfSuspended` middleware.
   - If `tenant()->status === 'suspended'`, block all HTTP verbs (`POST/PUT/PATCH/DELETE`) on Business Logic routes (returning HTTP 403), while allowing `GET` (Reads) and Auth.

---

## 5. Automated Verification (Tests)

Specific tests will be added/updated to verify:
1. **Approval without DB:** Verify `PENDING -> APPROVED` creates a `NULL` status tenant and explicitly verifies that **no Tenant DB is created**.
2. **Provisioning Failure & Retry:** Verify that a failure during provisioning drops the partial Tenant DB, keeps the Tenant Record as `NULL`, keeps the Request as `APPROVED`, and allows a successful retry afterwards.
3. **Completion Transaction:** Verify Successful Provisioning applies `ACTIVE` and `COMPLETED` transactionally.
4. **Archived & Suspended States:** 
   - Verify `SUSPENDED` allows GET but blocks POST.
   - Verify `ARCHIVED` behavior based on admin actions.
5. **Immutability:** Delete fails for COMPLETED/REJECTED.
