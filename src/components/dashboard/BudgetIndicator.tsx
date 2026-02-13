import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/calculations';

interface BudgetIndicatorProps {
  monthlySpend: number;
  monthlyBudget: number;
  preferredCurrency: string;
}

export const BudgetIndicator = ({ monthlySpend, monthlyBudget, preferredCurrency }: BudgetIndicatorProps) => {
  const { t } = useTranslation();

  const percentage = Math.min((monthlySpend / monthlyBudget) * 100, 150);
  const remaining = monthlyBudget - monthlySpend;
  const isOver = remaining < 0;

  const getBarColor = () => {
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 90) return '#f59e0b';
    if (percentage >= 70) return '#eab308';
    return '#22c55e';
  };

  const barColor = getBarColor();

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, rgba(17, 17, 17, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
        border: `1px solid ${isOver ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)'}`,
        boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.03) inset, 0 4px 24px -4px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${barColor}20, ${barColor}08)`,
            border: `1px solid ${barColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            style={{ width: '18px', height: '18px', color: barColor }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#ededed', marginBottom: '2px' }}>
            {t('budget.indicator')}
          </h3>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)' }}>
            {t('budget.of', { total: formatCurrency(monthlyBudget, preferredCurrency) })}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '18px', fontWeight: 700, color: barColor }}>
            {Math.round(percentage)}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: '8px',
          borderRadius: '4px',
          background: 'rgba(255, 255, 255, 0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${Math.min(percentage, 100)}%`,
            height: '100%',
            borderRadius: '4px',
            background: `linear-gradient(90deg, ${barColor}, ${barColor}cc)`,
            transition: 'width 0.5s ease, background 0.3s ease',
            boxShadow: `0 0 8px ${barColor}40`,
            ...(isOver ? { animation: 'pulse 2s infinite' } : {}),
          }}
        />
      </div>

      {/* Remaining/exceeded text */}
      <p
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: isOver ? '#ef4444' : 'rgba(255, 255, 255, 0.5)',
          marginTop: '10px',
        }}
      >
        {isOver
          ? t('budget.exceeded', { amount: formatCurrency(Math.abs(remaining), preferredCurrency) })
          : t('budget.remaining', { amount: formatCurrency(remaining, preferredCurrency) })}
      </p>
    </div>
  );
};
