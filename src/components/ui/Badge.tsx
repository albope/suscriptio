import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info';
}

export const Badge = ({ children, variant = 'info' }: BadgeProps) => {
  const variantStyles: Record<string, React.CSSProperties> = {
    success: {
      background: 'rgba(0, 255, 148, 0.1)',
      color: '#00ff94',
      border: '1px solid rgba(0, 255, 148, 0.2)',
    },
    danger: {
      background: 'rgba(255, 68, 68, 0.1)',
      color: '#ff6b6b',
      border: '1px solid rgba(255, 68, 68, 0.2)',
    },
    warning: {
      background: 'rgba(255, 187, 0, 0.1)',
      color: '#ffbb00',
      border: '1px solid rgba(255, 187, 0, 0.2)',
    },
    info: {
      background: 'rgba(0, 212, 255, 0.1)',
      color: '#00d4ff',
      border: '1px solid rgba(0, 212, 255, 0.2)',
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '5px 10px',
        fontSize: '11px',
        fontWeight: 600,
        borderRadius: '6px',
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
};
