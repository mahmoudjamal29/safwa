'use client'

// DON'T TRANSLATE THIS FILE

import { Component, type ErrorInfo, type ReactNode } from 'react'

import { env } from '@/lib/env'

const DEFAULT_ERROR_BOUNDARY_MESSAGES = {
  componentStack: 'Component Stack:',
  errorMessage: 'Error Message:',
  fallbackDescription:
    'An unexpected error occurred. Please refresh the page or contact support if the problem persists.',
  reloadPage: 'Reload Page',
  somethingWentWrong: 'Something went wrong',
  stackTrace: 'Stack Trace:'
} as const

interface ErrorBoundaryMessages {
  componentStack: string
  errorMessage: string
  fallbackDescription: string
  reloadPage: string
  somethingWentWrong: string
  stackTrace: string
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  messages?: ErrorBoundaryMessages
}

interface ErrorBoundaryState {
  error: Error | null
  errorInfo: ErrorInfo | null
}

class InternalErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details, especially when dev mode is enabled
    if (env.NEXT_PUBLIC_DEV_MODE) {
      console.error('ErrorBoundary caught an error:', {
        componentStack: errorInfo.componentStack,
        error,
        errorInfo,
        errorMessage: error.message,
        errorStack: error.stack
      })
    } else {
      // In production, log sanitized error info
      console.error('ErrorBoundary caught an error:', {
        errorMessage: error.message,
        errorName: error.name
      })
    }

    this.setState({
      error,
      errorInfo
    })

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo)
  }

  render() {
    if (this.state.error) {
      const messages: ErrorBoundaryMessages =
        this.props.messages ?? DEFAULT_ERROR_BOUNDARY_MESSAGES

      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-red-800">
              {messages.somethingWentWrong}
            </h2>
            {env.NEXT_PUBLIC_DEV_MODE && this.state.error ? (
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-red-900">
                    {messages.errorMessage}
                  </p>
                  <pre className="mt-1 overflow-auto rounded bg-red-100 p-2 text-sm text-red-800">
                    {this.state.error.message}
                  </pre>
                </div>
                {this.state.error.stack && (
                  <div>
                    <p className="font-medium text-red-900">
                      {messages.stackTrace}
                    </p>
                    <pre className="mt-1 max-h-64 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                      {this.state.error.stack}
                    </pre>
                  </div>
                )}
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <p className="font-medium text-red-900">
                      {messages.componentStack}
                    </p>
                    <pre className="mt-1 max-h-64 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-red-700">{messages.fallbackDescription}</p>
            )}
            <button
              className="mt-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              onClick={() => {
                this.setState({ error: null, errorInfo: null })
                window.location.reload()
              }}
              type="button"
            >
              {messages.reloadPage}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <InternalErrorBoundary
      fallback={fallback}
      messages={DEFAULT_ERROR_BOUNDARY_MESSAGES}
    >
      {children}
    </InternalErrorBoundary>
  )
}
