import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-8">
          <div className="max-w-md w-full bg-glass/5 border border-glass/10 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4 text-red-500">System Interruption</h2>
            <p className="text-muted-foreground mb-6">A critical error occurred in the generative bridge. The component tree has been safely isolated.</p>
            <pre className="bg-glass-inverse/50 p-4 rounded-lg overflow-auto text-xs font-mono mb-6 text-red-400">
              {this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold"
            >
              Reload Generative Stream
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

