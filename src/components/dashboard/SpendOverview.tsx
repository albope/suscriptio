import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/calculations';

interface SpendOverviewProps {
  monthlySpend: number;
  yearlySpend: number;
}

export const SpendOverview = ({ monthlySpend, yearlySpend }: SpendOverviewProps) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Monthly Spend Card */}
      <div
        className="card-glow-cyan"
        style={{
          padding: '28px',
          borderRadius: '16px',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#00d4ff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('dashboard.monthlySpend')}
            </p>
            <h3 className="text-glow-cyan" style={{ fontSize: '36px', fontWeight: 700, color: '#ededed', marginBottom: '8px' }}>
              {formatCurrency(monthlySpend, '€')}
            </h3>
            <p style={{ fontSize: '13px', color: '#666666' }}>
              Gasto mensual actual
            </p>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#00d4ff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: '20px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #00d4ff, #00a8cc)', borderRadius: '2px', boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)' }} />
        </div>
      </div>

      {/* Yearly Spend Card */}
      <div
        className="card-glow-purple"
        style={{
          padding: '28px',
          borderRadius: '16px',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#a855f7', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('dashboard.yearlySpend')}
            </p>
            <h3 className="text-glow-purple" style={{ fontSize: '36px', fontWeight: 700, color: '#ededed', marginBottom: '8px' }}>
              {formatCurrency(yearlySpend, '€')}
            </h3>
            <p style={{ fontSize: '13px', color: '#666666' }}>
              Proyección anual total
            </p>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg style={{ width: '24px', height: '24px', color: '#a855f7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: '20px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '80%', height: '100%', background: 'linear-gradient(90deg, #a855f7, #7e22ce)', borderRadius: '2px', boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)' }} />
        </div>
      </div>
    </>
  );
};
