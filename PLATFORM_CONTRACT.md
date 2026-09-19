# AQL Platform --- Platform Contract

**Status:** DRAFT --- Living Contract\
**Project:** AQL Platform\
**Purpose:** Permanent operational and architectural contract between
the Platform and Business Applications / Modules\
**Owner:** Product Owner / Lead Developer\
**Implementation Agent:** Antigravity

> This document consolidates the enduring rules extracted from Sprint 1,
> Sprint 2, and Sprint 3 contracts. Sprint-specific implementation
> tasks, test inventories, and Definition-of-Done checklists remain
> execution documents and are not duplicated here unless they define a
> permanent platform guarantee.

------------------------------------------------------------------------

## 1. Purpose

`PLATFORM_CONTRACT.md` defines what the AQL Platform guarantees to
Applications / Modules and what Applications / Modules may expect from,
and must respect toward, the Platform.

It is a **living contract**. It evolves as architectural decisions are
approved and as new platform capabilities are introduced.

It does not replace: - Architecture Decision Records (ADR) -
`architecture.md` - Sprint execution / acceptance contracts -
Implementation code

### Governing relationship

``` text
ARCHITECTURE DECISIONS
        ↓ WHY
architecture.md
        ↓ HOW / STRUCTURE
PLATFORM_CONTRACT.md
        ↓ WHAT IS GUARANTEED
SPRINT CONTRACT
        ↓ WHAT WE BUILD NOW
CODE
```

------------------------------------------------------------------------

# 2. Contract Authority

The authority hierarchy is:

1.  Approved ADRs
2.  `architecture.md`
3.  `PLATFORM_CONTRACT.md`
4.  Current Sprint Contract
5.  Existing engineering standards
6.  Implementation details

An implementation agent MUST NOT silently override an approved
architectural decision or this contract.

If implementation exposes a genuine conflict: 1. Stop the affected work.
2. Document the conflict. 3. Explain the impact. 4. Propose alternatives
when useful. 5. Wait for Product Owner / Lead Developer decision.

Architectural change is a human decision, not an implementation detail.

------------------------------------------------------------------------

# 3. Platform Boundary

AQL Platform provides the reusable operating foundation on which
independent Business Applications / Modules run.

The Platform owns cross-application capabilities such as:

-   Platform Identity
-   Tenant management and lifecycle metadata
-   Tenant resolution and context
-   Authentication boundaries
-   Platform authorization
-   Subscription / entitlement metadata
-   Module registration and availability
-   Shared configuration capabilities
-   Audit capabilities
-   Notifications and other approved shared services
-   Infrastructure contracts required by applications

The Platform does **not** own the business rules of an individual
Application / Module.

------------------------------------------------------------------------

# 4. Platform Context vs Tenant Context

There are two distinct operational contexts.

## 4.1 Platform Context

Platform context operates against the Landlord / Platform data boundary.

It contains platform-level information such as:

-   Platform Users
-   Tenants
-   Domains
-   Subscriptions / entitlement metadata
-   Module registry
-   Platform-level audit and lifecycle metadata

Platform Users administer the Platform but do not receive direct access
to Tenant Business Data through the Platform Administration boundary.

## 4.2 Tenant Context

Tenant context operates against exactly one resolved Tenant.

Tenant-specific business data belongs to that Tenant's independent
database.

``` text
Platform
   │
   ├── Landlord DB
   │
   ├── Tenant A → Tenant DB A
   ├── Tenant B → Tenant DB B
   └── Tenant C → Tenant DB C
```

A Tenant request MUST have a deterministic Tenant Context before
tenant-specific operations execute.

------------------------------------------------------------------------

# 5. Multi-Tenancy Contract

The approved model is **Database Per Tenant**.

## Landlord Database

The Landlord Database stores platform-level metadata, including:

-   tenants
-   domains
-   subscriptions
-   module registry / availability metadata
-   Platform Identity
-   other approved platform metadata

## Tenant Database

Every Tenant has an independent PostgreSQL database.

Tenant business data MUST remain inside its Tenant boundary.

A request operating under Tenant A MUST NOT read or modify Tenant B
data.

The implementation uses `stancl/tenancy` for tenancy infrastructure.

------------------------------------------------------------------------

# 6. Identity Contract

## 6.1 Platform Identity

Platform Identity is separate from Tenant Identity.

Platform authentication MUST query only the Platform / Landlord identity
store.

Platform Users authenticate into Platform Administration.

## 6.2 Tenant Identity

Tenant Users belong to a resolved Tenant and are stored in that Tenant's
database.

Tenant authentication MUST query only the resolved Tenant database.

## 6.3 Same Email

The same email address MAY exist:

-   as a Platform User;
-   as a Tenant User in Tenant A;
-   as a Tenant User in Tenant B.

Email is therefore NOT a Tenant discovery mechanism.

## 6.4 Forbidden Identity Behavior

The Platform MUST NOT:

-   scan all Tenant databases to discover a user;
-   infer Tenant from email;
-   merge Platform and Tenant identities;
-   allow Tenant authentication to enter Platform Administration;
-   allow Platform authentication to become Tenant authentication.

------------------------------------------------------------------------

# 7. Authentication Contract

## Web Application

The web application uses:

-   Laravel Sanctum
-   Stateful Cookie / Session Authentication
-   HTTP-only session cookies
-   CSRF protection
-   Inertia + React

## External APIs

`routes/api.php` is reserved for external REST APIs.

Future external/mobile clients may use stateless Bearer Authentication
through Laravel Sanctum Personal Access Tokens.

The existence of API authentication infrastructure does not create a
requirement for external portals in the current MVP.

------------------------------------------------------------------------

# 8. Tenant Resolution Contract

Tenant Account and Tenant User are different concepts.

The Platform MUST identify the intended Tenant before looking for a
Tenant User.

## Primary rule

The Tenant domain / request context identifies the intended Tenant.

Example:

``` text
abc.aql-platform.com
        ↓
Resolve Tenant ABC
        ↓
Validate Tenant Context
        ↓
Resolve requested resource
        ↓
Validate subscription / module availability when required
        ↓
Resolve Tenant User when authentication is required
        ↓
Authorize operation
        ↓
Execute requested URI
```

## Requirements

-   Tenant resolution MUST be deterministic.
-   The system MUST NOT select the first active Tenant as a fallback.
-   Session state MUST NOT be the authoritative source for identifying
    the Tenant.
-   A client-supplied Tenant identifier MUST NOT override the authorized
    Tenant Context.
-   Invalid or unknown Tenant domains MUST NOT resolve to an arbitrary
    Tenant.
-   The originally requested URI SHOULD be preserved through
    authentication.
-   Successful authentication MUST NOT always redirect to a generic
    dashboard when the original request can be resumed.

## Public Requests

If the requested resource is explicitly public and requires neither
authentication nor authorization, user lookup and permission lookup are
not required.

------------------------------------------------------------------------

# 9. Tenant Lifecycle Contract

The onboarding lifecycle is:

``` text
Registration
    │
    │ Initial Data
    │ Email / Phone / Unique Name / Company Name / ...
    ↓
Approval
    │
    ├── Create Tenant
    ├── Create / Reserve Subdomain
    └── Send Activation Link
            ↓
        Activation
            ↓
      Data Collection
            ↓
        PROVISIONING
            │
            ├── Database
            ├── Migrations
            ├── Base Data
            └── Initial Admin
            ↓
       Active Tenant
```

### Important distinction

A Tenant record is created at **Approval**.

However, the Tenant is not an **Active / ready operational Tenant**
until Activation, Data Collection, and successful Provisioning have
completed.

Registration Request and Tenant Provisioning are separate lifecycle
operations.

------------------------------------------------------------------------

# 10. Tenant Operational States

Operational state is distinct from authentication state.

At minimum the model supports:

-   **Active**
-   **Suspended**
-   **Archived**

### Active

Normal Tenant operations are permitted subject to subscription and
authorization.

### Suspended

Suspension does not inherently mean that authentication must fail.

Permitted and blocked operations are determined by the applicable
Platform / Module policies.

### Archived

Tenant data is retained.

Archiving does not automatically mean deletion.

Deletion and retention rules are separate policies and require explicit
architectural decisions.

------------------------------------------------------------------------

# 11. Subscription and Module Availability Contract

The Platform determines whether a Module is available to a Tenant.

Conceptual flow:

``` text
Tenant
  ↓
Subscription / Enablement
  ↓
Module Availability
  ↓
Module Runtime
```

Inside the Module:

``` text
Authenticated User
  ↓
Module Authorization
  ↓
Operation
```

## Platform responsibility

The Platform MUST be able to answer:

``` text
Is Module X available for Tenant Y?
```

If the requested Module is not available, the request MUST be rejected
before Module business execution.

## Separation of concerns

Subscription / entitlement is not the same as User Permission.

The Platform determines **availability**.

The Module determines **what an authorized Tenant User may do inside the
Module**.

The Platform MUST NOT maintain a duplicate per-route User Permission
matrix for every Module.

------------------------------------------------------------------------

# 12. Authorization Contract

Authorization is permission-centric.

Atomic permissions are the actual authorization units.

Examples:

``` text
users.view
users.create
users.edit
users.permissions

expenses.view
expenses.create
expenses.edit
expenses.delete
expenses.approve
```

Permissions MAY be assigned directly to Users.

Role Templates are optional convenience mechanisms.

Roles MUST NOT replace the underlying permission model.

A conceptual effective authorization may therefore be:

``` text
Direct User Permission
        OR
Role Template Permission
```

Module-specific authorization remains owned by the Module.

------------------------------------------------------------------------

# 13. Module Ownership Contract

Each Business Application / Module is an independent application.

A Module owns its own:

-   Controllers
-   Models
-   Requests
-   Services
-   Migrations
-   Routes
-   Policies / authorization rules
-   Business logic
-   Business data
-   Module-specific configuration
-   Module-specific roles and permissions where required
-   UI and application components

The Platform provides the environment and shared capabilities required
by the Module.

The Platform MUST NOT absorb Module business rules into Platform Core
merely to simplify integration.

------------------------------------------------------------------------

# 14. Module Metadata / Manifest Contract

The Platform receives **Module Metadata**, not ownership of the Module's
business logic.

Each Module MUST expose sufficient metadata for Platform registration.

Minimum conceptual metadata:

-   module key / identifier
-   name
-   version
-   capabilities / features
-   dependencies where applicable
-   installation / provisioning metadata
-   lifecycle status

The metadata contract MUST remain separate from Module Business Logic.

The exact long-term Manifest schema may evolve through future
architectural decisions.

------------------------------------------------------------------------

# 15. Module Installation Contract

Module installation is a Platform lifecycle operation.

Conceptually:

``` text
Module Package
     ↓
Validate Manifest
     ↓
Register Module
     ↓
Provision Module
     ↓
Complete Integration
     ↓
Ready
```

Installation establishes the Module as a known Platform component.

Installation is distinct from enabling the Module for a particular
Tenant.

------------------------------------------------------------------------

# 16. Tenant Module Enablement Contract

A Module may be installed on the Platform without being available to
every Tenant.

Tenant availability is governed by Platform subscription / entitlement
metadata.

Therefore:

``` text
Installed Module
      +
Tenant Subscription / Enablement
      ↓
Module Available to Tenant
```

A Tenant cannot execute a Module merely because the Module exists on the
Platform.

------------------------------------------------------------------------

# 17. Module Provisioning Contract

Module provisioning places all components belonging to the Module in
their proper Platform-managed locations and establishes the resources
required for the Module to operate.

Provisioning MUST respect Module ownership.

Minimum lifecycle:

``` text
Validate Manifest
      ↓
Register
      ↓
Provision
      ↓
Complete Integration
      ↓
Ready
```

Provisioning MUST be observable as a lifecycle operation.

A minimal or test Module MAY be used to verify the lifecycle before a
full production package loader exists.

------------------------------------------------------------------------

# 18. Provisioning Rollback / Compensation Contract

Rollback is the reverse / compensating operation for a failed
provisioning process.

If provisioning fails before completion:

``` text
Provisioning Failure
        ↓
Rollback / Compensation
        ↓
Previous Valid State
```

Rollback MUST clean up partial registrations, metadata, resources, or
other changes created by the failed provisioning attempt, to the extent
supported by the operation.

Because Module resources may span different persistence or
infrastructure boundaries, rollback is treated as **compensation**, not
as a claim that every operation belongs to one database transaction.

A failed Module MUST NOT be left falsely marked as `Ready`.

------------------------------------------------------------------------

# 19. Module Deprovisioning Contract

Deprovisioning is different from Rollback.

### Rollback

``` text
Failed installation/provisioning
→ return to previous valid state
```

### Deprovisioning

``` text
Previously installed Module
→ intentional removal / uninstallation
```

Deprovisioning MUST NOT automatically delete Tenant Business Data.

Business-data retention / deletion is a separate policy and requires
explicit definition.

------------------------------------------------------------------------

# 20. Module Data Ownership Contract

Module Business Data belongs to the Module within the resolved Tenant
boundary.

The Platform owns Platform metadata.

The Module owns its business data.

Conceptually:

``` text
LANDLORD / PLATFORM
    └── Platform Metadata

TENANT DB
    └── Module Business Data
```

The Platform MUST NOT create duplicate business-data stores merely to
monitor or operate a Module.

------------------------------------------------------------------------

# 21. Module Integration Contract

Modules integrate with the Platform and with other Modules through
explicit contracts.

## Forbidden

``` text
Module A
   └── direct DB access → Module B
```

## Required conceptual model

``` text
Module A
   ↓
API / Integration Contract
   ↓
Platform or Module B
```

A Module MUST NOT depend directly on another Module's database schema.

Integration contracts should expose stable business-facing capabilities
rather than internal database structures.

Advanced event-bus and integration-governance mechanisms remain future
capabilities unless separately approved.

------------------------------------------------------------------------

# 22. Configuration Contract

Configuration has distinct ownership scopes.

At minimum, the Platform may own configuration that is genuinely
platform-wide.

Tenant-specific configuration belongs to the Tenant context.

Module-specific configuration belongs to the Module.

A Module MUST NOT require Platform Core to store its internal business
configuration unless the configuration is explicitly part of a shared
Platform capability.

------------------------------------------------------------------------

# 23. Audit Contract

Auditability is a platform requirement.

Security-sensitive and lifecycle-sensitive operations SHOULD be
auditable.

Examples include:

-   authentication events
-   logout
-   Tenant provisioning
-   user creation
-   permission changes
-   lifecycle transitions
-   module installation / provisioning
-   module rollback
-   module deprovisioning

Audit visibility MUST respect context boundaries.

A Tenant User MUST NOT gain access to another Tenant's audit data.

Platform audit data and Tenant business audit data must not be conflated
merely because both are called "audit".

------------------------------------------------------------------------

# 24. Route and Request Context Contract

Routes must respect their context boundary.

Conceptually:

``` text
Platform Routes
    ↓
Platform Context

Tenant Routes
    ↓
Tenant Context
```

Tenant routes MUST be protected by deterministic Tenant initialization.

Platform routes MUST remain outside the Tenant authentication boundary.

A requested Tenant URI should remain the intended target through login
whenever the user is authorized to access it.

------------------------------------------------------------------------

# 25. Security and Isolation Rules

The following are non-negotiable security rules:

1.  No global Tenant database scan to discover a User.
2.  No email-based Tenant discovery.
3.  No arbitrary Tenant fallback.
4.  Session state is not authoritative for Tenant identity.
5.  Client-provided Tenant identifiers cannot override resolved context.
6.  Platform Identity and Tenant Identity remain separate.
7.  Platform Users do not receive direct Tenant Business Data access
    through Platform Administration.
8.  Tenant Users cannot authenticate into Platform Administration.
9.  A Tenant request cannot operate without valid Tenant Context.
10. A Module cannot execute for a Tenant when the Module is unavailable.
11. Module User authorization remains inside the Module.
12. Modules cannot directly couple to other Module databases.
13. Failed provisioning must trigger verified compensation.
14. Deprovisioning must not implicitly delete business data.

------------------------------------------------------------------------

# 26. Platform Responsibilities

The Platform is responsible for:

-   Platform Identity
-   Tenant records and domain mapping
-   deterministic Tenant resolution
-   Tenant lifecycle metadata
-   Tenant operational state
-   subscription / entitlement metadata
-   Module registration
-   Module availability
-   Platform-level authorization
-   shared Platform services
-   approved audit capabilities
-   lifecycle governance
-   infrastructure contracts
-   enforcing Platform / Tenant boundaries

The Platform is not responsible for implementing individual Module
business rules.

------------------------------------------------------------------------

# 27. Module Responsibilities

Each Module is responsible for:

-   its business domain
-   business rules
-   controllers
-   models
-   requests
-   services
-   routes
-   migrations
-   business data
-   module-specific authorization
-   module-specific roles / permissions
-   UI and application behavior
-   exposing required metadata
-   participating correctly in installation / provisioning lifecycle
-   exposing integration contracts where approved

------------------------------------------------------------------------

# 28. Forbidden Coupling

The following are prohibited unless a future ADR explicitly changes the
rule:

-   direct Module-to-Module database access
-   Platform ownership of Module business rules
-   global Tenant User discovery
-   email-based Tenant resolution
-   Platform authentication used as Module authorization
-   merged Platform/Tenant identities
-   implicit deletion of business data during deprovisioning
-   speculative microservices
-   billing/payment infrastructure without approval
-   external portals as part of the current MVP without approval
-   event-bus architecture without approval
-   duplicate authorization matrices maintained by Platform Core

------------------------------------------------------------------------

# 29. Evolution and Versioning

This document is continuously updated.

A change to this contract MUST be traceable to an approved architectural
decision or an explicitly approved Product Owner / Lead Developer
decision.

When a contract changes:

1.  Identify the affected rule.
2.  Record the reason.
3.  Update the contract.
4.  Review affected architecture documentation.
5.  Update the relevant Sprint Contract.
6.  Update implementation and tests.
7.  Preserve compatibility where required.

Historical Sprint contracts should not silently become contradictory
sources of truth. When a permanent architectural rule changes, the
living Platform Contract and relevant ADR / architecture documentation
become the authoritative references.

------------------------------------------------------------------------

# 30. Contract Verification

Every permanent contract rule that can be verified automatically SHOULD
have an automated test.

Verification should cover, as applicable:

-   Tenant resolution
-   Tenant isolation
-   Platform / Tenant identity isolation
-   subscription / Module availability
-   User status
-   Module authorization
-   Module registration
-   Module provisioning
-   provisioning rollback / compensation
-   deprovisioning
-   requested URI preservation
-   regression of previously accepted Platform behavior

A passing test suite alone does not prove architectural compliance; the
implementation must also be reviewed against the contract and approved
ADRs.

------------------------------------------------------------------------

# 31. Relationship with Sprint Contracts

Sprint Contracts answer:

> What are we implementing and accepting in this Sprint?

This document answers:

> What does the Platform permanently guarantee and what boundaries must
> Applications / Modules respect?

Therefore:

-   Sprint 1 contract → historical execution / acceptance record for
    Platform Core.
-   Sprint 2 contract → historical execution / acceptance record for
    onboarding and initial Tenant provisioning.
-   Sprint 3 contract → execution / acceptance record for architecture
    hardening and Gate 1.
-   `PLATFORM_CONTRACT.md` → continuously maintained permanent contract.

Sprint-specific checklists, implementation reports, changed-file lists,
and test counts remain in their respective Sprint documents.

------------------------------------------------------------------------

# 32. Current Architectural Baseline

The following principles are currently treated as the baseline for
implementation:

``` text
Platform
   │
   ├── Platform Identity
   ├── Tenant Lifecycle
   ├── Tenant Resolution
   ├── Subscription / Entitlement
   ├── Module Registry
   ├── Shared Services
   └── Platform Administration
          │
          ├───────────────┐
          ↓               ↓
     Tenant A          Tenant B
     DB A              DB B
       │                 │
       ├── Module X      ├── Module X
       ├── Module Y      └── Module Z
       └── Business Data
```

The core boundary is:

``` text
PLATFORM OWNS
────────────────────────────────
Identity boundaries
Tenant context
Lifecycle
Subscriptions
Module metadata
Module availability
Shared platform capabilities
Platform governance
────────────────────────────────

MODULE OWNS
────────────────────────────────
Business logic
Business data
Controllers
Models
Requests
Services
Migrations
Routes
Module authorization
Module UI
Module-specific behavior
────────────────────────────────
```

------------------------------------------------------------------------

# 33. Current Onboarding Baseline

The current approved lifecycle is:

``` text
Registration
    ↓
Approval
    ↓
Create Tenant + Reserve Subdomain
    ↓
Activation Link
    ↓
Activation
    ↓
Data Collection
    ↓
Tenant Provisioning
    ├── Database
    ├── Migrations
    ├── Base Data
    └── Initial Admin
    ↓
Active Tenant
```

This replaces the older Sprint-2 implementation assumption in which
public onboarding immediately created and provisioned the complete
Tenant environment.

The older rule is retained only as historical Sprint context; it is not
the current Platform Contract.

------------------------------------------------------------------------

# 34. Change Log

## v0.1 --- Initial Consolidation

**Date:** 2026-09-18

Initial living contract created by consolidating the enduring platform
rules from:

-   Sprint 1 Platform Core Acceptance Contract
-   Sprint 2 Onboarding Acceptance Contract
-   Sprint 3 Architecture Hardening Execution Contract

and incorporating the subsequently approved Tenant lifecycle and Module
ownership/provisioning decisions.

### Key baseline decisions captured

-   Separate Platform Identity and Tenant Identity.
-   Tenant resolution before Tenant User discovery.
-   No cross-Tenant User scanning.
-   Database Per Tenant.
-   Tenant lifecycle: Registration → Approval → Activation → Data
    Collection → Provisioning → Active.
-   Tenant and subdomain creation at Approval.
-   Subscription / Module availability separated from User
    authorization.
-   Modules are independent applications.
-   Modules own controllers, models, requests, migrations, routes,
    business logic and business data.
-   Platform receives Module metadata / manifest.
-   Module installation, provisioning, rollback, and deprovisioning are
    distinct lifecycle concepts.
-   Rollback is compensating recovery for failed provisioning.
-   Deprovisioning does not implicitly delete business data.
-   Module-to-Module direct database coupling is forbidden.

------------------------------------------------------------------------

# 35. Review Status

**Document status: DRAFT**

This document is ready for Product Owner / Lead Developer review.

No implementation agent should treat a newly introduced rule in this
draft as an approved architectural decision until the document and/or
the corresponding architectural decision has been explicitly approved.
