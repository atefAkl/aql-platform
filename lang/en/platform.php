<?php

return [
    'brand' => [
        'name' => 'AQL Platform',
        'desc' => 'Central Platform Management',
    ],
    'nav' => [
        'dashboard' => 'Main Dashboard',
        'requests' => 'Registration Requests',
        'tenants' => 'Tenant Accounts',
        'modules' => 'Add-on Modules',
        'changelog' => 'Changelog',
        'login' => 'Login',
        'onboarding' => 'New Tenant Onboarding',
        'logout' => 'Logout',
        'go_to_dashboard' => 'Go to Dashboard',
    ],
    'requests' => [
        'title' => 'Manage Registration Requests',
        'header_title' => 'Tenant Registration Requests',
        'header_subtitle' => 'View, manage, activate, or disable registration requests for the AQL Platform',

        'stats' => [
            'total' => 'Total Requests',
            'pending' => 'Pending Requests',
            'pending_subtext' => 'Awaiting management approval',
            'approved' => 'Awaiting Activation',
            'approved_subtext' => 'Activated, link sent',
            'completed' => 'Activated Tenants',
            'completed_subtext' => 'Provisioned & Operational',
            'rejected' => 'Rejected Requests',
            'rejected_subtext' => 'Permanently rejected',
        ],

        'tabs' => [
            'all' => 'All Requests',
            'pending' => 'Pending',
            'approved' => 'Awaiting Activation',
            'completed' => 'Completed',
            'rejected' => 'Rejected',
        ],

        'search_placeholder' => 'Search by Organization, Slug, or Email...',

        'table' => [
            'organization' => 'Organization',
            'slug' => 'Domain (Slug)',
            'admin' => 'Main Admin',
            'date' => 'Request Date',
            'status' => 'Status',
            'actions' => 'Actions',
            'empty' => 'No registration requests match the current search or filter.',
        ],

        'confirm' => [
            'approve_title' => 'Confirm Request Approval',
            'approve_message' => 'Are you sure you want to approve the registration request for (:name) and generate an activation link?',
            'approve_confirm' => 'Yes, Approve Request',

            'reject_title' => 'Confirm Request Rejection',
            'reject_message' => 'Do you really want to reject the registration request for (:name)? This action is final and cannot be undone.',
            'reject_confirm' => 'Yes, Reject Request',

            'delete_title' => 'Confirm Request Deletion',
            'delete_message' => 'Are you sure you want to delete the registration request for (:name)? The request and associated tenant record will be permanently deleted.',
            'delete_confirm' => 'Yes, Delete Request',
        ],

        'modal' => [
            'title' => 'Registration Request Details',
            'admin_name' => 'Main System Administrator',
            'admin_email' => 'Email Address',
            'slug' => 'Domain Identifier (Slug)',
            'date' => 'Date Submitted',
            'activation_link' => 'Tenant Activation Link',
            'close' => 'Close',
        ],
    ],
    'tenants' => [
        'title' => 'Manage Tenant Accounts',
        'header_title' => 'Tenant Accounts',
        'header_subtitle' => 'Manage the operational status of activated organizations (Active, Suspended, Archived) according to platform policies',

        'stats' => [
            'total' => 'Total Accounts',
            'active' => 'Active Tenants',
            'active_subtext' => 'Fully operational environment',
            'suspended' => 'Suspended (Read-Only)',
            'suspended_subtext' => 'Read-only, writes blocked',
            'archived' => 'Archived Tenants',
            'archived_subtext' => 'Data retention paused',
        ],

        'tabs' => [
            'all' => 'All Accounts',
            'active' => 'Active',
            'suspended' => 'Suspended',
            'archived' => 'Archived',
        ],

        'search_placeholder' => 'Search by Organization Name or Domain...',

        'table' => [
            'name' => 'Organization Name',
            'domain' => 'Primary Domain',
            'date' => 'Creation Date',
            'status' => 'Operational Status',
            'actions' => 'Lifecycle Actions',
            'empty' => 'No tenant accounts match the current search or filter.',
        ],

        'status' => [
            'active' => 'Active',
            'suspended' => 'Suspended',
            'archived' => 'Archived',
        ],

        'actions' => [
            'suspend_title' => 'Suspend (Read-Only Mode)',
            'restore_title' => 'Restore to Active',
            'archive_title' => 'Archive Tenant',
            'delete_title' => 'Permanently Delete Tenant',
        ],

        'confirm' => [
            'suspend_title' => 'Confirm Tenant Suspension',
            'suspend_message' => 'Are you sure you want to suspend (:name)? The tenant will switch to Read-Only mode and the platform will block any modifications.',
            'suspend_confirm' => 'Yes, Suspend',

            'archive_title' => 'Confirm Tenant Archival',
            'archive_message' => 'Do you want to archive (:name)? The account will be moved to historical storage.',
            'archive_confirm' => 'Yes, Archive',

            'restore_title' => 'Confirm Tenant Restoration',
            'restore_message' => 'Do you want to restore (:name) to an Active operational state?',
            'restore_confirm' => 'Yes, Restore',

            'delete_title' => 'Confirm Tenant Deletion',
            'delete_message' => 'Are you sure you want to permanently delete (:name)? This will completely erase all associated data, domains, and databases.',
            'delete_confirm' => 'Yes, Delete Permanently',
        ],
    ],
    'actions' => [
        'save' => 'Save',
        'cancel' => 'Cancel',
        'approve' => 'Approve & Activate',
        'reject' => 'Reject Request',
        'delete' => 'Delete',
        'view' => 'View Details',
        'suspend' => 'Suspend / Temporary Disable',
        'unsuspend' => 'Unsuspend',
        'restore' => 'Restore',
        'archive' => 'Archive',
    ],
    'status' => [
        'pending' => 'Pending',
        'approved' => 'Approved (Awaiting Activation)',
        'completed' => 'Completed',
        'rejected' => 'Rejected',
        'active' => 'Active',
        'suspended' => 'Suspended',
        'archived' => 'Archived',
        'unknown' => 'Unknown',
    ],
    'landing' => [
        'hero_badge' => 'Integrated Cloud Platform',
        'hero_title_1' => 'Manage Your Enterprise Smartly',
        'hero_title_2' => 'In a Secure, Isolated Environment',
        'hero_subtitle' => 'AQL Platform provides an independent and integrated workspace to manage your resources, employees, and financial reports efficiently and securely according to the highest standards.',

        'features_title' => 'Centralized Infrastructure',
        'features_subtitle' => 'For delivering Software as a Service (SaaS) and managing tenants with strong data isolation.',

        'feature_1_title' => 'Multi-Tenancy',
        'feature_1_desc' => 'Advanced infrastructure utilizing isolated databases for each tenant, ensuring maximum isolation, security, and privacy.',

        'feature_2_title' => 'Domain-Based Routing',
        'feature_2_desc' => 'Automated management of HTTP requests and routing to the correct tenant based on subdomain or custom domain.',

        'feature_3_title' => 'Identity & Authorization Isolation',
        'feature_3_desc' => 'Strict separation between central platform admins and operational tenant users, with precise authorization governance and audit logs.',

        'feature_4_title' => 'High Performance & Real-Time Interaction',
        'feature_4_desc' => 'Built using PHP 8.3, Laravel 11 with React 18, and Inertia.js v3 to provide ultra-fast responsiveness without SPA complexity.',

        'feature_5_title' => 'Domain Management & Account Activation',
        'feature_5_desc' => 'Structured lifecycle for registration requests, approval, individual activation links, and database provisioning.',

        'feature_6_title' => 'Operational State Management',
        'feature_6_desc' => 'Full support for controlling operational tenant states (active, suspended, read-only, archived, or deleted).',

        'arch_badge' => 'Approved Architecture',
        'arch_title' => 'Adherence to Documented Architectural Decisions',
        'arch_desc' => 'The platform is built on over 24 documented Architectural Decision Records (ADRs) ensuring real separation between registrations, the central registry, and operational environments.',

        'nav_features' => 'Platform Features',
        'nav_architecture' => 'Architecture',
        'nav_changelog' => 'Release Notes',

        'action_register' => 'Submit Your Organization Request Now',
        'action_changelog' => 'Browse Admin Changelog',

        'footer_rights' => 'All Rights Reserved © 2026 AQL Platform',
        'footer_new_register' => 'New Registration',
        'footer_login' => 'Login',
        'footer_changelog' => 'Changelog',
    ],
    'dashboard' => [
        'title' => 'Main Dashboard',
        'subtitle' => 'Welcome to the Central Platform Dashboard. You can manage registration requests, tenant accounts, and monitor system performance from here.',
    ],
    'language' => [
        'ar' => 'العربية',
        'en' => 'English',
        'switch' => 'Change Display Language',
    ],
    'login' => [
        'title' => 'Login (Platform Admin)',
        'header_title' => 'Platform Admin',
        'header_subtitle' => 'Landlord DB Authentication',
        'email_label' => 'Admin Email Address',
        'email_placeholder' => 'admin@platform.com',
        'password_label' => 'Password',
        'password_placeholder' => '••••••••',
        'show_password' => 'Show Password',
        'hide_password' => 'Hide Password',
        'submit' => 'Login to Platform',
        'submitting' => 'Verifying...',
        'new_tenant' => 'New Tenant?',
        'register_now' => 'Register your organization now',
    ],
    'changelog' => [
        'title' => 'Platform Releases & Changelog',
        'brand_name' => 'AQL Platform',
        'brand_subtitle' => 'Official Updates and Releases',
        'theme_toggle' => 'Toggle Theme',
        'register' => 'Register on Platform',

        'latest_release' => 'Latest Stable Release',
        'header_title' => 'Release Changelog',
        'header_desc' => 'Official, live documentation of all enhancements, architectural changes, new modules, and fixes released in the AQL Platform with each development sprint.',

        'current_release' => 'Current Release',
        'footer_text' => '© :year AQL Platform. All rights reserved — Robust and independent integrated infrastructure.',
    ],
];
