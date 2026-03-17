# Smart Commit Command

Automates staging changes and generating commit messages following the conventional-commits.mdc rule.

## Usage

Simply ask: "commit my changes", "smart commit", or "stage and commit" and I will:

1. **Check for user-provided context** - If you provided context/purpose, prioritize it for analysis
2. **Check what's changed** - Review git status (staged and unstaged)
3. **Route based on staging status**:
   - **If staged changes exist**: Generate conventional commit on staged changes only
   - **If no staged changes**: Run @commit-workflow.mdc process on unstaged changes
4. **Analyze the changes** - Understand what was modified and analysis the changes deeply and figure out the purpose of it, using user context to inform the analysis
5. **Stage files** (only if no staged changes) - Ask which files to stage (or stage all)
6. **Generate commit message** - Following @conventional-commits.mdc, informed by user context
7. **Get approval** - Show you the message before committing

### Providing Context/Purpose

You can provide context about the purpose of your changes to get a more accurate commit message:

- "commit my changes - I fixed the RTL spacing issues in the riders form"
- "smart commit - added parent assignment functionality to riders"
- "stage and commit - refactored the tenant tabs to use standard tabs pattern"

**User-provided context is ALWAYS prioritized** over automatic analysis. The context helps understand:

- The actual purpose/intent behind the changes
- The problem being solved
- The feature being added or fixed
- The refactoring goal

## Automatic Behavior

When you say:

- "commit my changes"
- "smart commit"
- "stage and commit"
- "generate commit message"
- "commit"
- Or provide context: "commit my changes - [your context/purpose]"

I will automatically:

- ✅ **Check for user-provided context/purpose first** - If provided, prioritize it for analysis
- ✅ Check git status to determine if there are staged changes
- ✅ **If staged changes exist**: Run conventional commit on staged changes only, informed by user context
- ✅ **If no staged changes**: Run @commit-workflow.mdc process on unstaged changes, informed by user context
- ✅ Analyze file paths for scope extraction
- ✅ Determine commit type (feat, fix, refactor, etc.) - **prioritizing user context if provided**
- ✅ Generate proper scope using `{main_feature}/{sub_feature}` pattern
- ✅ Create imperative description that reflects user context if provided
- ✅ Include appropriate emoji
- ✅ Request approval before committing

## Workflow Steps

1. **Check for User-Provided Context/Purpose**
   - **PRIORITY**: If user provided context/purpose in their request, extract and prioritize it
   - User context takes precedence over automatic analysis
   - Use user context to understand the intent and purpose of changes
   - Examples of user context:
     - "fixed RTL spacing issues" → informs that this is a `fix` for RTL styling
     - "added parent assignment" → informs that this is a `feat` for new functionality
     - "refactored to use standard pattern" → informs that this is a `refactor` for code improvement

2. **Check Git Status**
   - Run `git status` to see all changes
   - **Determine if staged changes exist**
   - Identify modified, added, and deleted files (both staged and unstaged)

3. **Route Based on Staging Status**

   **If staged changes exist:**
   - Analyze **only staged changes** using @conventional-commits.mdc rule
   - **If user context provided**: Use it to understand the purpose and inform the analysis
   - Extract scope from file paths following the pattern `app/(app)/{main_feature}/_{main_feature}/{sub_feature}/`
   - Determine commit type based on:
     - **User context (PRIORITY)** - If user mentioned "fix", "feat", "refactor", etc., use that
     - **Automatic analysis** - If no user context, infer from changes:
       - New functionality → `feat`
       - Bug fixes → `fix`
       - Code restructuring → `refactor`
       - Documentation → `docs`
       - Tests → `test`
       - Dependencies/config → `chore`
       - Performance → `perf`
       - Styling → `style`
       - Cursor rules changes → `chore(rules)`
   - Generate imperative description (50 chars or less, but prioritize clarity when user context is provided) that reflects user context if provided
   - **When user context is provided**: Create more descriptive messages that clearly explain what was fixed/changed, even if slightly longer than 50 chars
   - **When no user context**: Keep descriptions concise and under 50 chars
   - Include appropriate emoji
   - Present commit message and request approval
   - Execute commit on staged changes only

   **If no staged changes exist:**
   - Follow @commit-workflow.mdc process:
     - **If user context provided**: Use it to understand the purpose and inform the analysis
     - Analyze unstaged changes using @change-analysis.mdc
     - **Prioritize user context** when categorizing changes by type and scope
     - Group related files together based on user context if provided
     - Identify dependencies between changes
     - Assess impact and breaking changes
     - Plan logical commit groups informed by user context
     - Present commit plan to user for approval
     - Stage files based on approved plan
     - Generate commit messages following @conventional-commits.mdc, informed by user context
     - Execute commits after approval

4. **Generate Clear Descriptions (When User Context Provided)**
   - **If user provided context**: Generate descriptive messages that clearly explain each fix/change
   - Use specific action verbs: "fix default tab selection", "make phone optional", "add RTL support", "enable default permissions"
   - List multiple fixes clearly: "fix default tabs, make phone optional, add RTL support, enable default permissions"
   - Prioritize clarity over strict 50-char limit when user context is provided (aim for 50-70 chars for clarity)
   - **If no user context**: Keep descriptions concise and under 50 chars as per conventional commits rule

5. **Present Commit Message**
   - Show the generated commit message following format: `<emoji> <type>(<scope>): <description>`
   - Show which files will be committed
   - Request user approval before committing

6. **Execute Commit** (after approval)
   - Run `git commit -m "<generated message>"` with user approval
   - Confirm commit was successful

## Scope Extraction Rules

- Extract `main_feature` from: `app/(app)/{main_feature}/`
- Extract `sub_feature` from: `_{main_feature}/{sub_feature}/`
- Format: `{main_feature}/{sub_feature}`

### Examples

- `app/(app)/tenants/_tenants/forms/` → `tenants/forms`
- `app/(app)/drivers/_drivers/tables/` → `drivers/tables`
- `query/tenants/tenants-mutations.ts` → `tenants/mutations`
- `.cursor/rules/conventional-commits.mdc` → `rules/conventional-commits` (type: chore)

## Example Workflows

### Example 1: Without User Context

**You**: "smart commit"

**Me**:

```
Checking git status...
Found 3 modified files:
- app/(app)/tenants/_tenants/tables/tenant-table.tsx
- query/tenants/tenants-query.ts
- components/data-table/data-table.tsx

Analyzing changes...
- Added export functionality to tenants table
- Scope: tenants/tables
- Type: feat

Generated commit message:
✨ feat(tenants/tables): add export functionality

Stage all files and commit with this message? (y/n)
```

**You**: "yes"

**Me**: Committing... Done! ✅

### Example 2: With User Context (Prioritized)

**You**: "smart commit - I fixed the RTL spacing issues in the riders form by replacing pl-_ and pr-_ classes with ps-_ and pe-_"

**Me**:

```
Checking git status...
Found 4 modified files:
- app/(app)/riders/_riders/form-options/riders-form-options.ts
- app/(app)/riders/_riders/form-options/parents-form-options.ts
- app/(app)/riders/_riders/columns/parents-columns.tsx
- app/(app)/riders/[rider_id]/page.tsx

Analyzing changes with your context...
User context: Fixed RTL spacing issues by replacing physical padding classes with logical ones
- Replaced pl-*/pr-* with ps-*/pe-* classes for RTL support
- Scope: riders/forms
- Type: fix (based on your context: "fixed")

Generated commit message:
🐛 fix(riders/forms): replace physical padding with logical for RTL

Stage all files and commit with this message? (y/n)
```

**You**: "yes"

**Me**: Committing... Done! ✅

### Example 3: User Context Informs Refactoring

**You**: "commit my changes - refactored tenant tabs to use the standard tabs pattern from the rules"

**Me**:

```
Checking git status...
Found 1 modified file:
- app/(app)/tenants/_tenants/tabs/tenant-tabs.tsx

Analyzing changes with your context...
User context: Refactored to use standard tabs pattern
- Updated tabs implementation to follow standard pattern
- Scope: tenants/tabs
- Type: refactor (based on your context: "refactored")

Generated commit message:
♻️ refactor(tenants/tabs): use standard tabs pattern

Stage all files and commit with this message? (y/n)
```

### Example 4: User Context with Multiple Fixes (Clear Description)

**You**: "commit my changes - fixed default tab in riders page, made phone optional in parents form, fixed RTL compatibility in parents columns, and enabled default permissions in riders form"

**Me**:

```
Checking git status...
Found 5 modified files:
- app/(app)/riders/[rider_id]/page.tsx
- app/(app)/riders/_riders/form-options/parents-form-options.ts
- app/(app)/riders/_riders/columns/parents-columns.tsx
- app/(app)/riders/_riders/form-options/riders-form-options.ts
- app/(app)/tenants/_tenants/tabs/tenant-tabs.tsx

Analyzing changes with your context...
User context: Multiple fixes across riders and tenants
- Fixed default tab selection in riders page and tenant tabs
- Made phone field optional in parents form (was incorrectly required)
- Added RTL support for email/phone icons in parents columns
- Enabled default trip request permissions in riders form
- Scope: riders (primary), tenants (secondary)
- Type: fix (based on your context: "fixed")

Generated commit message:
🐛 fix(riders): fix default tabs, make phone optional, add RTL support, enable default permissions

Stage all files and commit with this message? (y/n)
```

**Note**: When user context is provided with multiple fixes, the description is more descriptive (slightly longer than 50 chars) to clearly explain all changes.

## Multiple Unrelated Changes

If multiple unrelated changes are detected, I will suggest splitting them into separate commits:

```
Found 5 modified files across different features...

Suggesting separate commits:

**Commit 1: ✨ feat(tenants/tables): add export button**
- app/(app)/tenants/_tenants/tables/tenant-table.tsx
- query/tenants/tenants-query.ts

**Commit 2: ✨ feat(drivers/forms): update driver form validation**
- app/(app)/drivers/_drivers/forms/driver-form.tsx

**Commit 3: 🔧 chore(rules): update conventional commits rule**
- .cursor/rules/conventional-commits.mdc

Proceed with these 3 commits? (y/n)
```

## Important Notes

- **PRIORITY: User-provided context/purpose** - If user provides context about the purpose of changes, ALWAYS prioritize it over automatic analysis
  - User context helps understand the actual intent and purpose
  - Use user context to determine commit type, scope, and description
  - User context should inform how changes are analyzed and grouped
- **ALWAYS check for user-provided context first** - Before analyzing changes, check if user mentioned purpose/context
- **ALWAYS check for staged changes** - If staged changes exist, commit only those using conventional commit format
- **If no staged changes** - Follow @commit-workflow.mdc process for analyzing and grouping unstaged changes
- ALWAYS request user approval before executing git commit
- Approval prompts must always use explicit `"(y/n)"` pattern and accept only `y` or `n` responses
- ALWAYS follow the @conventional-commits.mdc rule format
- ALWAYS use specific scopes (not generic ones)
- For cursor rules changes, ALWAYS use `chore(rules)` type
- Keep descriptions imperative, lowercase, and under 50 characters
- If multiple unrelated changes exist, suggest splitting into multiple commits
- Use @change-analysis.mdc for grouping related files logically, informed by user context if provided
