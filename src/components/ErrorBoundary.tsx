import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
  error: string;
}

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-sm text-foreground/50 mb-2">页面加载失败</p>
          <p className="text-xs text-foreground/20 mb-4">{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="liquid-glass rounded-full px-6 py-3 text-sm font-medium"
          >
            刷新页面
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
