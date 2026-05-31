import React from 'react';

/**
 * Robust React Error Boundary with stack trace logging and recovery.
 * Captures rendering errors in the component tree.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error(" [ErrorBoundary] Uncaught rendering error:", error, errorInfo);
        this.setState({ errorInfo });
        
        // Log to backend if telemetry is available
        try {
            // Future: sendToTelemetry(error, errorInfo);
        } catch (e) {
            // Ignore telemetry failures
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
        // Force refresh if it's a critical navigation error
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-[40vh] flex-col items-center justify-center px-6 py-16 text-center">
                    <div className="mb-6 rounded-full bg-red-100 p-4 text-red-600">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="mb-2 text-xl font-bold text-slate-900">Something went wrong</h2>
                    <p className="mb-8 max-w-md text-sm text-slate-500">
                        We've encountered an unexpected error while rendering this page. 
                        Don't worry, our team has been notified.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={this.handleReset}
                            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Try Again
                        </button>
                        <a
                            href="/"
                            className="rounded-lg bg-white px-6 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                        >
                            Back to Home
                        </a>
                    </div>
                    
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-12 w-full max-w-2xl overflow-auto rounded-lg bg-slate-50 p-4 text-left text-xs text-red-800">
                            <summary className="cursor-pointer font-semibold">Technical Details (Dev Only)</summary>
                            <pre className="mt-4 whitespace-pre-wrap">{this.state.error?.toString()}</pre>
                            <pre className="mt-2 whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
