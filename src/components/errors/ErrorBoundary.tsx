import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#ededed',
              marginBottom: '8px',
            }}
          >
            Algo salió mal
          </h2>

          <p
            style={{
              fontSize: '14px',
              color: '#888888',
              marginBottom: '24px',
              maxWidth: '400px',
            }}
          >
            Ha ocurrido un error inesperado. Puedes intentar recargar la página o volver a
            intentarlo.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
                color: '#000',
                fontWeight: 600,
                fontSize: '14px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Intentar de nuevo
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: '#888888',
                fontWeight: 500,
                fontSize: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Recargar página
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details
              style={{
                marginTop: '32px',
                textAlign: 'left',
                width: '100%',
                maxWidth: '600px',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  color: '#666666',
                  fontSize: '12px',
                  marginBottom: '8px',
                }}
              >
                Detalles del error (desarrollo)
              </summary>
              <pre
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  padding: '16px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '12px',
                  color: '#ef4444',
                }}
              >
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
