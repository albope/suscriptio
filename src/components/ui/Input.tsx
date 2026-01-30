import { InputHTMLAttributes, forwardRef, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#888888',
            }}
          >
            {label}
            {props.required && (
              <span aria-hidden="true" style={{ color: '#ff6b6b', marginLeft: '4px' }}>
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-required={props.required}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: error ? '1px solid #ff4444' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            fontSize: '14px',
            color: '#ededed',
            backgroundColor: '#111111',
            transition: 'all 0.15s ease',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#00d4ff';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 212, 255, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? '#ff4444' : 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          className={className}
          {...props}
        />
        {error && (
          <span id={errorId} role="alert" style={{ fontSize: '12px', color: '#ff6b6b' }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
