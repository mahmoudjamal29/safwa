# Form System Documentation

This document provides comprehensive guidance for using the enhanced form system built with TanStack Form in the admin dashboard.

## Overview

The form system is built on top of TanStack Form and provides:

- Type-safe form handling
- Reusable form components
- Consistent validation patterns
- Clean form composition
- Multi-step form support

## Core Components

### 1. Form Hook (`useAppForm`)

The primary form initialization hook that provides pre-bound components and consistent form handling.

```typescript
import { useAppForm } from '@/components/form'

const form = useAppForm({
  defaultValues: {
    email: '',
    password: ''
  },
  validators: {
    onChange: z.object({
      email: z.string().email('Invalid email'),
      password: z.string().min(6, 'Password too short')
    })
  },
  onSubmit: async ({ value }) => {
    // Handle form submission
  }
})
```

### 2. Form Field Components

All form fields are pre-bound and available through `form.AppField`:

```typescript
<form.AppField name="email">
  {(field) => <field.Input placeholder="Email" />}
</form.AppField>

<form.AppField name="password">
  {(field) => <field.Password placeholder="Password" />}
</form.AppField>

<form.AppField name="phone">
  {(field) => <field.PhoneInput />}
</form.AppField>
```

### 3. Form Field Wrapper (`FormField`)

A reusable wrapper component for consistent form field layout:

```typescript
import { FormField } from '@/components/form'

<form.AppField name="name">
  {(field) => (
    <FormField
      label="Full Name"
      required
      validationErrors={validationErrors}
      errorKey="name"
    >
      <field.Input placeholder="Enter your name" />
    </FormField>
  )}
</form.AppField>
```

## Available Form Components

### Input Components

- `field.Input` - Text input with validation
- `field.Password` - Password input with show/hide toggle
- `field.PhoneInput` - International phone number input
- `field.TextArea` - Multi-line text input
- `field.OTP` - One-time password input
- `field.DateInput` - Date picker input
- `field.DatePicker` - Advanced date picker

### Selection Components

- `field.Select` - Dropdown selection
- `field.Combobox` - Autocomplete input
- `field.AutocompleteGrouped` - Grouped autocomplete
- `field.Checkbox` - Checkbox input
- `field.RadioButton` - Radio button input
- `field.Switch` - Toggle switch

### File Upload Components

- `field.FileUpload` - File upload input
- `field.SingleImageUpload` - Single image upload
- `field.MultiImagesUpload` - Multiple images upload

### Layout Components

- `field.Card` - Form section card
- `field.Button` - Form button

## Form Patterns

### 1. Basic Form

```typescript
import { useAppForm, FormField } from '@/components/form'
import { formSchemas } from '@/components/form/form-utils'

function BasicForm() {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: ''
    },
    validators: {
      onChange: formSchemas.login
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
    }
  })

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await form.handleSubmit()
    }}>
      <form.AppField name="name">
        {(field) => (
          <FormField label="Name" required>
            <field.Input placeholder="Enter your name" />
          </FormField>
        )}
      </form.AppField>

      <form.AppField name="email">
        {(field) => (
          <FormField label="Email" required>
            <field.Input type="email" placeholder="Enter your email" />
          </FormField>
        )}
      </form.AppField>

      <form.AppForm>
        <SubmitButton>Submit</SubmitButton>
      </form.AppForm>
    </form>
  )
}
```

### 2. Form with withForm HOC

For complex forms, use the `withForm` HOC for better organization:

```typescript
import { withForm } from '@/components/form'

const UserForm = withForm({
  defaultValues: {
    name: '',
    email: '',
    phone: ''
  },
  props: {
    user: undefined as User | undefined,
    validationErrors: {} as Record<string, string[]>
  },
  render: function Render({ form, user, validationErrors }) {
    return (
      <form onSubmit={async (e) => {
        e.preventDefault()
        await form.handleSubmit()
      }}>
        <form.AppField name="name">
          {(field) => (
            <FormField
              label="Name"
              required
              validationErrors={validationErrors}
              errorKey="name"
            >
              <field.Input placeholder="Enter name" />
            </FormField>
          )}
        </form.AppField>
        {/* More fields... */}
      </form>
    )
  }
})

// Usage
function UserFormPage() {
  const form = useAppForm({
    defaultValues: { name: '', email: '', phone: '' },
    onSubmit: async ({ value }) => {
      // Handle submission
    }
  })

  return (
    <UserForm
      form={form}
      user={user}
      validationErrors={validationErrors}
    />
  )
}
```

### 3. Multi-Step Form

For multi-step forms, use separate step components:

```typescript
// Step 1: Email
const EmailStep = ({ onNext }: { onNext: (email: string) => void }) => {
  const form = useAppForm({
    defaultValues: { email: '' },
    validators: {
      onChange: z.object({
        email: z.string().email('Invalid email')
      })
    },
    onSubmit: async ({ value }) => {
      onNext(value.email)
    }
  })

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await form.handleSubmit()
    }}>
      <form.AppField name="email">
        {(field) => (
          <FormField label="Email" required>
            <field.Input placeholder="Enter email" />
          </FormField>
        )}
      </form.AppField>
      <form.AppForm>
        <SubmitButton>Next</SubmitButton>
      </form.AppForm>
    </form>
  )
}

// Main multi-step component
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')

  if (currentStep === 'email') {
    return <EmailStep onNext={(email) => {
      setEmail(email)
      setCurrentStep('password')
    }} />
  }

  // Password step...
}
```

## Validation

### Built-in Validation Schemas

Use pre-defined validation schemas from `form-utils.ts`:

```typescript
import { formSchemas } from '@/components/form/form-utils'

const form = useAppForm({
  defaultValues: { email: '', password: '' },
  validators: {
    onChange: formSchemas.login
  }
})
```

### Custom Validation

```typescript
const form = useAppForm({
  defaultValues: { password: '', confirmPassword: '' },
  validators: {
    onChange: z
      .object({
        password: z.string().min(6),
        confirmPassword: z.string()
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword']
      })
  }
})
```

### Async Validation

```typescript
const form = useAppForm({
  validators: {
    onSubmitAsync: async ({ value }) => {
      const isValid = await validateOnServer(value)
      if (!isValid) {
        return {
          form: 'Invalid data',
          fields: {
            email: 'Email already exists'
          }
        }
      }
      return null
    }
  }
})
```

## Error Handling

### Server Validation Errors

```typescript
const mutationError = createAdminMutation.error
const validationErrors = mutationError?.response?.data?.errors || {}

<form.AppField name="email">
  {(field) => (
    <FormField
      label="Email"
      validationErrors={validationErrors}
      errorKey="email"
    >
      <field.Input />
    </FormField>
  )}
</form.AppField>
```

### Field-Level Error Display

```typescript
<form.AppField name="email">
  {(field) => (
    <div>
      <field.Input />
      {!field.state.meta.isValid && (
        <p className="text-red-500 text-sm">
          {field.state.meta.errors.join(', ')}
        </p>
      )}
    </div>
  )}
</form.AppField>
```

## Form State Management

### Accessing Form State

```typescript
const form = useAppForm({...})

// Subscribe to specific state
const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
const canSubmit = useStore(form.store, (state) => state.canSubmit)

// Or use Subscribe component
<form.Subscribe
  selector={(state) => [state.isSubmitting, state.canSubmit]}
  children={([isSubmitting, canSubmit]) => (
    <button disabled={!canSubmit || isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </button>
  )}
/>
```

### Form Reset

```typescript
// Reset to default values
form.reset()

// Reset with new values
form.reset({ name: 'New Name', email: 'new@email.com' })
```

## Best Practices

### 1. Always Use useAppForm

```typescript
// ✅ Good
const form = useAppForm({...})

// ❌ Avoid
const form = useForm({...})
```

### 2. Use FormField for Consistent Layout

```typescript
// ✅ Good
<FormField label="Name" required>
  <field.Input />
</FormField>

// ❌ Avoid
<div className="flex gap-6">
  <label>Name</label>
  <field.Input />
</div>
```

### 3. Handle Form Submission Properly

```typescript
// ✅ Good
<form onSubmit={async (e) => {
  e.preventDefault()
  e.stopPropagation()
  await form.handleSubmit()
}}>

// ❌ Avoid
<form onSubmit={form.handleSubmit}>
```

### 4. Use Pre-defined Validation Schemas

```typescript
// ✅ Good
import { formSchemas } from '@/components/form/form-utils'
validators: {
  onChange: formSchemas.login
}

// ❌ Avoid
validators: {
  onChange: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
}
```

### 5. Handle Loading States

```typescript
<form.Subscribe
  selector={(state) => state.isSubmitting}
  children={(isSubmitting) => (
    <SubmitButton disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : 'Submit'}
    </SubmitButton>
  )}
/>
```

## Examples

See the `examples/` directory for complete working examples:

- `admin-form-example.tsx` - Complex form with withForm HOC
- `multi-step-form-example.tsx` - Multi-step form pattern

## Migration Guide

### From React Hook Form

1. Replace `useForm` with `useAppForm`
2. Update field components to use `form.AppField`
3. Replace validation with Zod schemas
4. Update form submission handling

### From Custom Form Components

1. Wrap fields with `FormField` component
2. Use pre-bound form components
3. Implement consistent error handling
4. Use validation schemas from `form-utils.ts`

## Troubleshooting

### Common Issues

1. **PhoneInput not working**: Ensure `react-phone-number-input` is installed
2. **Validation not triggering**: Check that validators are properly configured
3. **Form not submitting**: Ensure `onSubmit` handler is provided
4. **Type errors**: Make sure to use proper TypeScript types from `form-utils.ts`

### Debug Tips

```typescript
// Log form state
console.log('Form state:', form.state)

// Log field state
console.log('Field state:', field.state)

// Check validation
console.log('Can submit:', form.state.canSubmit)
console.log('Errors:', form.state.errorMap)
```
