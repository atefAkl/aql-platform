# Sprint 1 — Platform Core
## Engineering Specification & Acceptance Contract

**Status:** ACTIVE  
**Sprint:** Sprint 1  
**Project:** AQL Platform  
**Repository:** atefAkl/aql-platform  
**Branch:** main  
**Owner:** Product Owner / Lead Developer  
**Implementation Agent:** Antigravity  

---

# 1. Purpose

This document is the authoritative execution and acceptance specification for Sprint 1.

The objective is to implement and verify the Platform Core required to support the first business application module.

Sprint 1 is NOT considered complete because files exist or because a limited number of tests pass.

Sprint 1 is complete only when all mandatory requirements in this document are implemented, verified, tested, and supported by evidence.

---

# 2. Authority & Decision Hierarchy

Antigravity MUST follow the following authority hierarchy:

1. Approved Architecture Decision Records (ADR)
2. `architecture.md`
3. This Sprint Acceptance Specification
4. Existing project contracts and standards
5. Implementation details chosen by Antigravity

Antigravity MUST NOT override or reinterpret an approved architectural decision.

If an implementation requirement conflicts with an approved ADR or Architecture document:

- STOP implementation of the conflicting part.
- Report the conflict.
- Explain the conflict.
- Propose alternatives.
- WAIT for Product Owner / Lead Developer approval.

Do NOT silently change architecture.

---

# 3. Approved Architectural Decisions

The following decisions are already approved and MUST be treated as frozen for Sprint 1.

## ADR-001 — Technology Stack

### Backend
- PHP 8.3+
- Laravel
- Domain-Driven Modular Architecture

### Web Application
- React
- TypeScript
- Inertia.js
- Tailwind CSS
- Shadcn UI

### External APIs
`routes/api.php` is reserved for future external REST APIs.
The web application MUST use Inertia.js.
Do NOT introduce a separate SPA API architecture for the web application.

### Infrastructure
- PostgreSQL 16+
- Redis for cache and queues
- Local filesystem during development
- MinIO / S3-compatible storage for production

---

# 4. ADR-002 — Multi-Tenancy

The approved tenancy model is:

## Database Per Tenant

There are two database levels:

### Landlord Database
Central database containing platform-level tenant information.
Required core entities:
- tenants
- domains
- subscriptions

### Tenant Database
Each tenant has an independent PostgreSQL database.
Example: `tenant_acme`
Tenant-specific data MUST NOT be stored in another tenant's database.

The approved tenancy package is: `stancl/tenancy`

Tenant context MUST be explicitly initialized before tenant-specific operations are executed.

---

# 5. ADR-003 — Authentication & Authorization

## 5.1 Web Authentication
The web application uses:
- Laravel Sanctum
- Stateful Cookie / Session Authentication
- HTTP-only session cookies
- CSRF protection

This applies to: `Inertia + React`

## 5.2 External API Authentication
External APIs will use:
- Laravel Sanctum Personal Access Tokens
- Stateless Bearer Authentication

This is future-ready infrastructure and does not require external client portals in Sprint 1.

---

# 6. Authorization Model

The authorization model is:

## Permission-Centric Authorization

Atomic permissions are the actual authorization units.
Examples:
- `users.view`
- `users.create`
- `users.edit`
- `users.permissions`
- `expenses.view`
- `expenses.create`
- `expenses.edit`
- `expenses.delete`
- `expenses.approve`

Permissions MAY be assigned directly to users.
Role Templates are optional convenience mechanisms.
Roles MUST NOT replace the underlying permission model.

Effective authorization may therefore be:
`Direct User Permission OR Role Template Permission`

---

# 7. Sprint 1 Objective

Sprint 1 must produce a working Platform Core capable of:
1. Creating a tenant.
2. Provisioning its independent database.
3. Applying tenant migrations.
4. Creating the initial tenant administrator.
5. Creating the platform permission catalog.
6. Creating role templates.
7. Assigning permissions.
8. Authenticating users.
9. Maintaining tenant context.
10. Preventing accidental tenant cross-access.
11. Recording important security-sensitive operations.
12. Providing the basic Inertia + React application shell.
13. Managing tenant users.
14. Managing direct permissions.
15. Displaying audit records.
16. Passing automated acceptance tests.

---

# 8. Required Components

The following components are required.

## 8.1 Tenant Provisioning
Required service: `TenantProvisioningService`

Responsibilities:
- Create landlord tenant record.
- Create domain mapping.
- Create tenant database.
- Run tenant migrations.
- Initialize tenant context.
- Create required base tenant data.
- Create initial administrator.
- Create required permissions.
- Create role templates.
- Assign initial administrator permissions.

Provisioning MUST be deterministic and repeatable where applicable.

---

# 9. Tenant Isolation Contract

Tenant isolation is a SECURITY REQUIREMENT.
The system MUST guarantee:

Tenant A -> Database A (Users, Permissions, Audit Logs)
Tenant B -> Database B (Users, Permissions, Audit Logs)

A request operating under Tenant A MUST NOT read or modify Tenant B data.
Tests MUST explicitly verify this behavior.

---

# 10. Tenant Resolution

Tenant context MUST NOT be selected arbitrarily.
The implementation MUST define a deterministic tenant-resolution mechanism based on the approved tenancy architecture.

The system MUST NOT silently select "the first active tenant" as a fallback for an authenticated or unauthenticated request.
If no valid tenant can be resolved: return an appropriate error or redirect to tenant selection; do NOT initialize an arbitrary tenant.

Any exception to this rule requires explicit architectural approval.

---

# 11. Authentication Contract

The following scenarios MUST work:
- Valid Login: Valid Tenant + Valid User + Valid Password = Authenticated Session
- Invalid Password: Must be rejected.
- Unknown User: Must be rejected.
- Session Regeneration: Successful login MUST regenerate the session.
- Logout: Logout MUST invalidate the session, regenerate CSRF token, terminate authentication, record the security-sensitive logout event.

---

# 12. Tenant-Aware Authentication

Authentication MUST NOT require scanning every tenant database to discover where a user belongs unless this behavior is explicitly approved as part of the architecture.

Tenant identification and user authentication must have a deterministic strategy.

---

# 13. Authorization Contract

The platform MUST provide a central mechanism for checking permissions.
Example: `$user->hasPermission('expenses.create');` or an equivalent centralized authorization mechanism.

Authorization checks MUST NOT be duplicated manually throughout controllers.
Unauthorized users MUST receive a consistent denial response.

The following must be tested:
- authorized user can access permitted operation;
- unauthorized user is denied;
- direct permission works;
- role-template permission works;
- revoked permission stops working.

---

# 14. Role Template Contract

Role Templates are convenience mechanisms (admin, accountant, staff).
A role contains a collection of permissions.
Changing a user's direct permissions MUST NOT unintentionally modify the role template itself.

---

# 15. Audit Contract

Audit logging is selective. The system MUST NOT blindly log every CRUD operation.
Audit records MUST belong to the correct tenant context.
Cross-tenant audit visibility MUST NOT be possible.

Required events:
- `AUTH_LOGIN`
- `AUTH_LOGOUT`
- `TENANT_PROVISIONED`
- `USER_CREATED`
- `PERMISSIONS_UPDATED`

---

# 16. Definition of Done & Acceptance Criteria

Sprint 1 is DONE when all mandatory test suites pass cleanly and evidence is documented.
