import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: 600,
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
      color: '#000',
      boxShadow: '0 0 0 1px rgba(0, 212, 255, 0.3), 0 4px 20px rgba(0, 212, 255, 0.3)',
    },
    secondary: {
      background: '#111111',
      color: '#ededed',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    danger: {
      background: 'linear-gradient(180deg, #ff4444 0%, #cc3333 100%)',
      color: '#fff',
      boxShadow: '0 4px 20px rgba(255, 68, 68, 0.25)',
    },
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...variantStyles[variant],
        ...(props.disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};
