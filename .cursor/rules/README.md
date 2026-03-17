# Cursor Rules System

This directory contains Cursor rules tailored to the EDGE Admin Dashboard project's established patterns. All rules are organized by category for easy navigation and maintenance.

## Directory Structure

```
.cursor/rules/
├── README.md                    # This file - Master index
├── _common/                     # Shared content used by multiple rules
│   ├── code-comments.mdc        # Code commenting standards
│   ├── context7-docs.mdc        # Context7 MCP requirements
│   ├── nextjs-devtools.mdc      # Next.js DevTools MCP requirements
│   └── version-checking.mdc     # Version checking requirements
├── core/                        # Core application rules
│   ├── master-guide.mdc         # Application overview & tech stack
│   ├── cursor_rules.mdc         # Rule formatting standards
│   └── self_improve.mdc         # Rule improvement guidelines
├── data-layer/                  # Data fetching patterns
│   ├── react-query.mdc          # TanStack Query patterns
│   └── api-integration.mdc      # Backend API integration workflow
├── ui-components/               # UI component patterns
│   ├── data-table.mdc           # TanStack Table patterns
│   ├── tanstack-form.mdc        # TanStack Form patterns
│   ├── shadcn.mdc               # shadcn/ui component reference
│   └── standard-tabs.mdc        # Tabs component patterns
├── feature-development/         # Feature creation patterns
│   ├── feature-structure.mdc    # Feature folder structure
│   ├── create-new-page.mdc      # Page creation patterns
│   └── permissions-system.mdc   # RBAC permissions
├── styling/                     # Styling and i18n
│   ├── styling-guide.mdc        # CSS, layout, RTL patterns
│   └── i18n-translation.mdc     # Internationalization (when requested)
├── workflow/                    # Git and workflow rules
│   ├── commit-workflow.mdc      # Git commit process
│   ├── conventional-commits.mdc # Commit message format
│   ├── change-analysis.mdc      # File change analysis
│   └── generate-pr-description.mdc          # PR description generation
└── meta/                        # Meta rules
    └── refactor-prompts.mdc     # Taskmaster PRD templates
```

## Shared Rules (\_common/)

These rules are referenced by other rules and provide shared standards:

- **[code-comments.mdc](_common/code-comments.mdc)** - Code commenting standards applied across all code
- **[context7-docs.mdc](_common/context7-docs.mdc)** - MANDATORY Context7 MCP documentation lookup requirements
- **[version-checking.mdc](_common/version-checking.mdc)** - Version checking requirements before using Context7 MCP
- **[nextjs-devtools.mdc](_common/nextjs-devtools.mdc)** - Next.js DevTools MCP requirements for feature development

## Core Rules

Essential rules that provide application context and meta guidance:

- **[master-guide.mdc](core/master-guide.mdc)** - Comprehensive application overview: architecture, tech stack, patterns, and development guide
- **[cursor_rules.mdc](core/cursor_rules.mdc)** - Meta guidance for rule style and format
- **[self_improve.mdc](core/self_improve.mdc)** - Guidelines for continuously improving Cursor rules

## Data Layer Rules

Rules for data fetching, API integration, and query management:

- **[react-query.mdc](data-layer/react-query.mdc)** - Standardized TanStack Query patterns (queries, mutations, endpoints, types)
  - Query options via `queryOptions`
  - Mutation patterns with meta-driven invalidation
  - QueryClient configuration
  - Server component patterns
- **[api-integration.mdc](data-layer/api-integration.mdc)** - Comprehensive workflow for extracting backend types and generating frontend query files
  - Backend type extraction
  - Endpoint mapping
  - Type generation

## UI Component Rules

Rules for building UI components and forms:

- **[data-table.mdc](ui-components/data-table.mdc)** - Complete pattern for building data tables with TanStack Table
  - Column definitions and header components
  - Table wiring with useDataTable hook
  - Query management and permission handling
  - Table page structure and topbar integration
- **[tanstack-form.mdc](ui-components/tanstack-form.mdc)** - Comprehensive guide for TanStack Form
  - Form initialization with useAppForm
  - Field composition with withForm HOC
  - Validation with Zod schemas
  - Error handling and API validation
  - Integration with React Query mutations
- **[shadcn.mdc](ui-components/shadcn.mdc)** - Reference guide for shadcn/ui component library
  - Component documentation links
  - Usage patterns
  - ⚠️ DO NOT install new components (customizations would be overwritten)
- **[standard-tabs.mdc](ui-components/standard-tabs.mdc)** - Standard Shadcn Tabs pattern with data-driven triggers and panels
  - Permission-based tab visibility
  - URL state synchronization
  - Table integration patterns

## Feature Development Rules

Rules for creating and organizing features:

- **[feature-structure.mdc](feature-development/feature-structure.mdc)** - Comprehensive guide for creating feature folder structures
  - Standardized folder organization and naming conventions
  - Component patterns and integration with queries, forms, tables
  - Routing patterns and URL conventions
  - Multi-resource feature patterns
- **[create-new-page.mdc](feature-development/create-new-page.mdc)** - Standard structure and patterns for creating new pages
  - PageHeader component usage
  - Form integration patterns
  - Content layout structure
  - Server/Client component patterns
- **[permissions-system.mdc](feature-development/permissions-system.mdc)** - RBAC patterns for routes, components, and actions
  - Route protection (server-side)
  - Component-level permissions
  - Action-level permissions
  - Permission checking patterns
  - Navigation filtering

## Styling Rules

Rules for styling, layout, and internationalization:

- **[styling-guide.mdc](styling/styling-guide.mdc)** - Comprehensive styling guide
  - CSS variables and dark mode support
  - HTML structure best practices
  - SEO considerations
  - Layout patterns and spacing
  - Responsive design and RTL support
  - Component styling patterns
- **[i18n-translation.mdc](styling/i18n-translation.mdc)** - Internationalization and translation workflow
  - Translation patterns and namespace structure
  - Arabic translation standards
  - Feature-by-feature migration strategy
  - ⚠️ Only applies when translation/localization is explicitly requested

## Workflow Rules

Rules for Git workflows and code analysis:

- **[commit-workflow.mdc](workflow/commit-workflow.mdc)** - Comprehensive workflow for git commits
  - Change analysis and categorization
  - Logical grouping
  - User approval process
- **[conventional-commits.mdc](workflow/conventional-commits.mdc)** - Conventional Commits specification with emoji support
  - Commit message format
  - Commit types and emojis
  - Scope guidelines
- **[change-analysis.mdc](workflow/change-analysis.mdc)** - Methodology for analyzing file changes
  - Grouping related modifications
  - Dependency mapping
  - Impact assessment
- **[generate-pr-description.mdc](workflow/pr-analysis.mdc)** - PR analysis workflow
  - Structured PR descriptions
  - Change categorization
  - Test steps

## Meta Rules

Meta rules for tooling and templates:

- **[refactor-prompts.mdc](meta/refactor-prompts.mdc)** - Ensures .txt prompt refactors follow Taskmaster PRD templates

## Quick Reference

### Creating a New Feature

1. **Start here:** [feature-structure.mdc](feature-development/feature-structure.mdc)
2. **Query layer:** [react-query.mdc](data-layer/react-query.mdc)
3. **Tables:** [data-table.mdc](ui-components/data-table.mdc)
4. **Forms:** [tanstack-form.mdc](ui-components/tanstack-form.mdc)
5. **Pages:** [create-new-page.mdc](feature-development/create-new-page.mdc)
6. **Permissions:** [permissions-system.mdc](feature-development/permissions-system.mdc)
7. **Styling:** [styling-guide.mdc](styling/styling-guide.mdc)

### Common Workflows

**Create a new feature:**

1. Structure: Use [feature-structure.mdc](feature-development/feature-structure.mdc)
2. Queries: Use [react-query.mdc](data-layer/react-query.mdc)
3. Tables: Use [data-table.mdc](ui-components/data-table.mdc)
4. Forms: Use [tanstack-form.mdc](ui-components/tanstack-form.mdc)
5. Pages: Use [create-new-page.mdc](feature-development/create-new-page.mdc)
6. Permissions: Use [permissions-system.mdc](feature-development/permissions-system.mdc)

**Style components:**

- Use [styling-guide.mdc](styling/styling-guide.mdc) for CSS variables, dark mode, and layout patterns

**Query & Data Fetching:**

- Use [react-query.mdc](data-layer/react-query.mdc) for standardized query patterns

**Form Development:**

- Use [tanstack-form.mdc](ui-components/tanstack-form.mdc) for form patterns and validation

## Rule Dependencies

Rules are designed to work together:

- **feature-structure** → References `data-table`, `tanstack-form`, `react-query`, `permissions-system`
- **data-table** → Requires `react-query` for data fetching
- **tanstack-form** → Integrates with `react-query` for mutations
- **create-new-page** → Uses patterns from `tanstack-form` and `styling-guide`
- **permissions-system** → Works with all feature rules for access control

## Cross-Rule Expectations

When working with features, ensure consistency across all rules:

- ✅ **Place all files per feature-structure** — Follow the standardized folder organization
- ✅ **Fetch data via react-query** — Use `queryOptions` and `useQuery` hooks (never inline fetch)
- ✅ **Wire tables using data-table** — Use columns + `useDataTable` hook
- ✅ **Build forms with tanstack-form** — Use `useAppForm` and submit via mutations
- ✅ **Guard UI via permissions-system** — Protect buttons, row actions, and routes
- ✅ **Style with styling-guide** — Use CSS variables for dark mode compatibility
- ✅ **Create pages with create-new-page** — Use PageHeader and standard layout patterns

## References

- **Tenants feature patterns:** See `.taskmaster/docs/tenants-patterns.md` for concrete examples
- **Official documentation:** Use Context7 MCP tools for library-specific documentation (see [context7-docs.mdc](_common/context7-docs.mdc))
- **Query client:** `query-client/endpoints.ts` and `query-client/query.d.ts`
- **Form components:** `components/form/` directory
- **Data table components:** `components/data-table/` directory

## Maintenance

- **Rule updates:** See [self_improve.mdc](core/self_improve.mdc) for guidelines on improving rules
- **Rule format:** See [cursor_rules.mdc](core/cursor_rules.mdc) for formatting standards
- **Shared content:** Always use `_common/` rules instead of duplicating content

## Rule Status

All rules are actively maintained and based on the tenants feature implementation. When patterns evolve, rules are updated following the [self_improve.mdc](core/self_improve.mdc) guidelines.
