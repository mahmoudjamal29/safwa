## Translate Selected Tab (i18n)

Translate the **currently open file/tab** using:

- `@.cursor/rules/styling/i18n-translation.mdc`

## Usage

Say one of:

- "translate this file"
- "translate the selected tab"
- "i18n this tab"
- "apply i18n to this form/table"

## Workflow

1. **Identify feature + context**
- Determine the feature namespace from the active file path.
- Follow the business vocabulary from `@.cursor/rules/styling/i18n-translation.mdc`.
- For legacy names (like `tenant`), translate by real business meaning (usually company/customer), not by old naming.

2. **Extract user-facing strings from active file only**
- Include labels, placeholders, headings, buttons, table headers, dialogs, empty states, helper text, validation text.
- Ignore internal/debug/technical strings.

3. **Map keys to correct namespaces**
- `enums.*` for enum labels (single source of truth)
- `common.*` for global shared UI text
- `components.*` for reusable component text
- `tables.columns.*` for shared table column labels
- `layout.*` for navigation/header/breadcrumb text
- `{feature}.*` for feature-specific copy

4. **Update translation JSON files**
- Edit matching files in:
  - `lib/i18n/en/{feature}.json`
  - `lib/i18n/ar/{feature}.json`
- Keep file structures identical between `en` and `ar`.
- Keep required root wrapper (for example: `{ "vendors": { ... } }`).
- Use consistent MSA Arabic and domain terms from the rule glossary.

5. **Wire translations in the selected tab**
- Replace hard-coded strings with `useTranslations(...)`.
- Type translation callbacks with `Translations<NestedKey>`.
- Never use `(key: string) => string`.
- For enums, use `enums.*` and enum values as keys (for example: ``tStatus(`${status}`)``).

6. **Handle new feature translation files (if created)**
- If this work creates a new feature translation file:
  - add both `en` and `ar` files
  - import and spread them in `lib/i18n/messages.ts`

7. **Validate + regenerate types (Bun only)**
- Run:
  - `bun t:validate`
  - `bun t:generate`
- Fix issues and re-run until validation passes.

8. **Quick locale/RTL check**
- If app is already running:
  - verify English copy
  - switch to Arabic
  - verify Arabic wording + RTL layout behavior

After these steps, the active tab is localized using the current project architecture and business terminology.
