import React from 'react'

type Props = { children: React.ReactNode }
type State = { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: any) {
    // Log to console — could be replaced with remote reporting
    console.error('Uncaught error in component tree:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">An unexpected error occurred. Check the browser console for details.</p>
            <pre className="text-sm whitespace-pre-wrap bg-gray-100 p-4 rounded">
              {String(this.state.error)}
            </pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
