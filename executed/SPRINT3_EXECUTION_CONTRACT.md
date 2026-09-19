# AQL Platform --- Sprint 3 Execution Contract

**Status:** Draft for Execution Approval\
**Gate:** Gate 1 --- Architecture Decisions Implementation\
**Date:** 2026-09-18\
**Repository:** `atefAkl/aql-platform`\
**Target Branch:** `main`

## 1. Purpose

Sprint 3 implements the architectural decisions approved and documented
for Gate 1.

The objective is to move the current codebase from the existing
partial/session-based tenant behavior to the approved Platform/Tenant
architecture without introducing unrelated features.

This Sprint is an **architecture-hardening and foundation sprint**, not
a Business Module feature sprint.

## 2. Governing Decisions

The implementation MUST comply with:

-   ADR-009 --- Deterministic Tenant Resolution & Data Isolation
-   ADR-010 --- Platform Administration Boundary & Identity Isolation
-   ADR-011 --- Modules as Independent Applications
-   ADR-012 --- Module Integration via API Contracts
-   ADR-013 --- Tenant Registration & Lifecycle
-   ADR-014 --- Tenant Operational States & Module Policies
-   ADR-021 --- Tenant Request Resolution & Access Context
-   ADR-022 --- Module Ownership & Platform Boundary
-   ADR-023 --- Module Provisioning & Rollback
-   ADR-024 --- Module Deprovisioning

The Architecture Blueprint is the architectural reference.
Implementation details MUST NOT redefine or contradict these decisions.

## 3. Non-Goals

Sprint 3 MUST NOT implement:

-   Billing
-   Payment Processing
-   Commercial pricing
-   Advanced Plan/Entitlement governance
-   Event Bus
-   Microservices
-   API Gateway
-   Cross-module direct database access
-   Arbitrary impersonation
-   A second business authorization system inside the Platform
-   Business logic for Expenses/CRM/Inventory/etc. as part of the
    Platform core

The exact production-grade Module Package format and
filesystem/deployment mechanism may remain minimal where the approved
architecture intentionally defers them.

## 4. Workstream A --- Deterministic Tenant Request Resolution

### Objective

Every Tenant request must enter the correct Tenant Context based on the
request's Tenant identity.

### Requirements

1.  Tenant domains must be resolved through the established tenancy
    mechanism.
2.  Tenant context MUST NOT be discovered by searching Tenant databases
    for an email.
3.  A session value MUST NOT be the authoritative source for determining
    which Tenant the request belongs to.
4.  Tenant-specific routes MUST execute inside the Tenant
    routing/context boundary.
5.  Central Platform routes MUST remain outside Tenant context.
6.  Invalid/unregistered tenant domains MUST NOT initialize an arbitrary
    Tenant.
7.  Existing valid Tenant isolation behavior MUST remain intact.

### Requested URI

If a protected request arrives at `/controller/action/{uuid}` and
authentication is required, the original requested URI MUST be preserved
and restored after successful authentication.

A successful authentication MUST NOT always redirect to Dashboard.

Dashboard is the default destination only when there is no specific
intended resource.

## 5. Workstream B --- Separate Platform Identity

### Objective

Platform Administration and Tenant Platform MUST use separate identities
and security contexts.

### Platform request flow

`Platform Domain → Platform Context → Landlord DB → Platform User → Platform Authorization → Platform Administration`

### Tenant request flow

`Tenant Domain → Tenant Context → Tenant DB → Tenant User → Module Authorization`

### Requirements

1.  Introduce a dedicated Platform Identity model/store if not already
    present.
2.  Platform authentication MUST query only the Landlord/Platform
    identity store.
3.  Tenant authentication MUST query only the resolved Tenant database.
4.  The same email MAY exist as a Platform User and/or Tenant User in
    multiple Tenants.
5.  Authentication MUST NOT use a global Tenant Database scan to
    discover a user.
6.  Platform Users MUST NOT gain direct access to Tenant Business Data
    through this implementation.
7.  Tenant Users MUST NOT authenticate into Platform Administration
    through the Tenant authentication flow.

The exact Laravel guard/provider naming is an implementation detail,
provided the resulting security boundary is equivalent to the approved
architecture.

## 6. Workstream C --- Tenant Operational Validation

For a protected Tenant request, the implementation must distinguish:

### Tenant Context

-   Tenant exists.
-   Domain belongs to Tenant.
-   Tenant is in a valid operational state.

### Subscription / Module Availability

-   Tenant has the required subscription/enablement for the requested
    Module.

### Tenant User

-   User exists in the resolved Tenant database.
-   User is active.
-   Suspended/inactive users cannot perform protected operations.

### Authorization

-   The Module's own authorization mechanism determines whether the
    authenticated User may execute the operation.

These concerns MUST NOT be collapsed into a single generic check.

## 7. Workstream D --- Module Availability

### Objective

The Platform must determine whether a requested Module is available to
the resolved Tenant.

The Platform does NOT determine individual User permissions inside the
Module.

### Required conceptual flow

`Tenant → Subscription → Module Availability → Module Runtime`

Inside the Module:

`Authenticated User → Module Authorization → Operation`

### Requirements

1.  Module identity/registration metadata belongs to Platform metadata.
2.  Tenant subscription/enablement metadata belongs to the
    Landlord/Platform data boundary.
3.  Module Business Data remains inside the Tenant context.
4.  The Platform must be able to answer:
    `Is Module X available for Tenant Y?`
5.  If a requested Module is not available, the request MUST be rejected
    before Module business execution.
6.  If a resource is Public and does not require authentication, no User
    Permission lookup is required.
7.  The Platform MUST NOT maintain a duplicate per-route user permission
    matrix.

The exact long-term Manifest schema remains deferred.

Sprint 3 should establish only the minimum metadata contract required to
prove Module registration and availability behavior.

## 8. Workstream E --- Module Metadata / Manifest

Each Module must expose metadata sufficient for Platform registration.

At minimum, the implementation must support:

-   module key/identifier;
-   name;
-   version;
-   capabilities/features;
-   dependencies where applicable;
-   installation/provisioning metadata;
-   lifecycle status.

The metadata contract MUST remain separate from Module Business Logic.

Do not hard-code Expenses business rules into Platform Core merely to
demonstrate the contract.

## 9. Workstream F --- Module Provisioning

Implement a controlled Platform-level Module Provisioning lifecycle.

Minimum conceptual lifecycle:

`Validate Manifest → Register Module → Provision → Complete Integration → Ready`

Provisioning MUST be observable as a lifecycle operation.

The implementation MAY use a minimal/test Module fixture to prove the
lifecycle if a complete production package loader is intentionally
deferred.

The Provisioning mechanism must not violate Module ownership.

## 10. Workstream G --- Provisioning Rollback / Compensation

If Module Provisioning fails before completion:

`Provisioning Failure → Rollback / Compensation → Previous Valid State`

### Requirements

1.  Partial registrations must be cleaned up.
2.  Partial metadata must be reversible.
3.  Partial Module resources must be removed where reversal is
    supported.
4.  Failed provisioning must not leave a Module falsely marked as
    Ready/Installed.
5.  Rollback must be implemented as a compensating lifecycle where a
    single DB transaction cannot cover all operations.
6.  Rollback must itself be testable.

The existing Tenant Provisioning compensation logic MUST NOT be confused
with Module Provisioning Rollback. They are related patterns but
separate lifecycle responsibilities.

## 11. Workstream H --- Module Deprovisioning

Implement the distinction:

`Failed Provisioning → Rollback`

`Installed Module → Deprovisioning / Uninstallation`

### Requirements

1.  Deprovisioning is an explicit lifecycle operation.
2.  Deprovisioning must not automatically delete Module Business Data.
3.  Module removal state must be distinguishable from provisioning
    failure.
4.  Data Retention / Data Deletion remains a separate future policy.
5.  The Platform must not silently destroy Tenant Business Data during
    Module removal.

## 12. Workstream I --- Existing Route Migration

Current Tenant application routes that are still registered in the
central `web.php` boundary MUST be reviewed and moved into the
appropriate Tenant route boundary where required by the approved
architecture.

The implementation MUST preserve existing behavior while enforcing
Tenant Context.

Do not introduce duplicate routes.

Do not break central onboarding or Platform routes.

## 13. Authorization Boundary

### Platform

-   Tenant Resolution
-   Tenant Context
-   Subscription / Module Availability
-   Platform Authorization
-   Module Registry
-   Module Lifecycle Governance

### Module

-   Controllers
-   Models
-   Requests
-   Services
-   Policies
-   Routes
-   Business Logic
-   Business Data
-   Module-specific Roles/Permissions/Policies

The Platform MUST NOT create a second authorization layer that replaces
Module authorization.

## 14. Testing Contract

Sprint 3 is NOT complete until automated tests prove the architecture.

### Tenant isolation

1.  Tenant A request resolves only Tenant A.
2.  Tenant B request resolves only Tenant B.
3.  Tenant A user cannot access Tenant B by changing a session value.
4.  Tenant A user cannot authenticate by causing a search across Tenant
    databases.
5.  Same email existing in Tenant A and Tenant B remains unambiguous
    because Tenant context is resolved first.

### Platform isolation

6.  Platform login searches only Platform/Landlord identity data.
7.  Tenant login does not authenticate against Platform users.
8.  Tenant users cannot enter Platform Administration routes.
9.  Platform users do not receive Tenant Business Data through Platform
    Administration.

### Requested URI

10. Protected request preserves intended URI.
11. Successful authentication returns the user to the intended
    authorized URI.
12. Root Tenant entry without an intended URI may go to Tenant
    Dashboard.

### User status

13. Active Tenant User can authenticate.
14. Suspended/inactive Tenant User cannot perform protected operations.

### Subscription / Module Availability

15. Enabled Module is available to the entitled Tenant.
16. Non-enabled Module is rejected before Module execution.
17. One Tenant's Module enablement does not affect another Tenant.

### Authorization

18. Module route protected by `auth` requires authentication.
19. Module route protected by role/permission/policy remains governed by
    the Module.
20. Removing a permission prevents the protected operation.
21. Public route does not perform unnecessary User Permission lookup.

### Provisioning

22. Successful Module Provisioning results in Registered/Installed/Ready
    state.
23. Failure during Provisioning triggers Rollback/Compensation.
24. Rollback removes partial state.
25. Failed Module is not left in a Ready state.
26. Deprovisioning an installed Module is distinct from Rollback.
27. Deprovisioning does not automatically delete Business Data.

## 15. Regression Requirement

All existing tests from Sprint 1 and Sprint 2 MUST continue to pass
unless a test explicitly asserts behavior that contradicts an approved
Gate 1 decision.

If an existing test conflicts with the approved architecture, the test
MUST be updated together with a clear explanation in the implementation
report.

No unrelated regression or refactoring is allowed.

## 16. Implementation Rules for Antigravity

Antigravity MUST:

1.  Read the current repository architecture/documentation before
    modifying code.
2.  Follow the approved ADR hierarchy.
3.  Prefer Laravel-native patterns.
4.  Use existing services/components where they remain architecturally
    valid.
5.  Avoid speculative abstractions.
6.  Avoid introducing Microservices or unnecessary infrastructure.
7.  Keep Module business logic outside Platform Core.
8.  Add automated tests for every architectural behavior introduced.
9.  Run formatting/static checks/tests appropriate to the changed code.
10. Report changed files and architectural rationale.
11. Report any deferred implementation detail rather than silently
    inventing an architectural rule.
12. Stop and report if an implementation choice would require changing
    an accepted ADR.

## 17. Forbidden Changes

Antigravity MUST NOT:

-   silently modify an accepted ADR;
-   silently modify the Architecture Blueprint;
-   reintroduce global Tenant User discovery;
-   use User email as Tenant resolution;
-   use session `tenant_id` as authoritative Tenant resolution;
-   give Platform Users direct Tenant Business Data access;
-   merge Platform Identity and Tenant Identity;
-   create direct Module-to-Module database access;
-   create Platform-level business authorization for Module internals;
-   delete Module Business Data as an implicit side effect of
    Deprovisioning;
-   add Billing/Payment/Event Bus/Microservices unless separately
    approved.

## 18. Deliverables

Sprint 3 implementation must produce:

1.  Code implementing Gate 1 decisions.
2.  Database migrations required by the implementation.
3.  Automated tests covering the acceptance contract.
4.  Minimal Module Metadata / Manifest contract.
5.  Module Registry / Availability mechanism.
6.  Module Provisioning lifecycle.
7.  Provisioning Rollback / Compensation.
8.  Module Deprovisioning lifecycle.
9.  Updated route/context handling.
10. Separate Platform/Tenant authentication boundaries.
11. Implementation verification report.
12. List of changed files.
13. List of deferred items and reasons.

## 19. Definition of Done

Gate 1 remains OPEN until all of the following are true:

-   [ ] Tenant Context is deterministic.
-   [ ] No cross-tenant User discovery remains.
-   [ ] Platform Identity is separate from Tenant Identity.
-   [ ] Platform authentication uses Landlord/Platform identity only.
-   [ ] Tenant authentication uses the resolved Tenant only.
-   [ ] Requested URI preservation works.
-   [ ] Subscription/Module Availability is enforced.
-   [ ] Module owns its internal Authorization.
-   [ ] Module Metadata / Manifest is registered.
-   [ ] Module Provisioning works.
-   [ ] Provisioning failure triggers verified Rollback/Compensation.
-   [ ] Deprovisioning is distinct from Rollback.
-   [ ] Deprovisioning does not implicitly delete Business Data.
-   [ ] Tenant isolation tests pass.
-   [ ] Platform/Tenant identity isolation tests pass.
-   [ ] Module availability tests pass.
-   [ ] Provisioning/Rollback/Deprovisioning tests pass.
-   [ ] Sprint 1 + Sprint 2 regression suite passes.
-   [ ] Code quality checks pass.
-   [ ] No accepted ADR has been violated.

Only after all items are verified may the architecture gate be marked:

**GATE 1 --- CLOSED**

## 20. Final Implementation Principle

This Sprint translates the approved architecture into code.

It does not redesign the architecture during implementation.

The governing sequence is:

`Approved Decision → Implementation → Automated Verification → Evidence → Gate Closure`

If implementation reveals a genuine architectural conflict, stop the
affected work, document the conflict, and return it for architectural
decision before proceeding.
