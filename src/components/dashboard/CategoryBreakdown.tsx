import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryBreakdown as CategoryData } from '@/types';
import { formatCurrency } from '@/utils/calculations';

interface CategoryBreakdownProps {
  data: CategoryData[];
}

// Neon colors for futuristic dark mode
const COLORS = [
  '#06b6d4',
  '#a855f7',
  '#3b82f6',
  '#f59e0b',
  '#ec4899',
  '#10b981',
  '#ef4444',
  '#8b5cf6',
  '#14b8a6',
];

export const CategoryBreakdown = ({ data }: CategoryBreakdownProps) => {
  const { t } = useTranslation();

  const EmptyState = () => (
    <div
      style={{
        textAlign: 'center',
        padding: '56px 20px',
      }}
    >
      {/* Empty state illustration */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '20px',
          background:
            'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(0, 212, 255, 0.05) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.15)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        {/* Animated rings */}
        <div
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '24px',
            border: '2px solid rgba(168, 85, 247, 0.1)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: '-16px',
            borderRadius: '28px',
            border: '1px solid rgba(168, 85, 247, 0.05)',
            animation: 'pulse 2s ease-in-out 0.5s infinite',
          }}
        />

        <svg
          style={{ width: '36px', height: '36px', color: '#a855f7' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
          />
        </svg>
      </div>

      <p
        style={{
          fontSize: '15px',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '8px',
        }}
      >
        {t('dashboard.noDataAvailable')}
      </p>
      <p
        style={{
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.35)',
          maxWidth: '280px',
          margin: '0 auto',
          lineHeight: 1.5,
        }}
      >
        {t('dashboard.addSubscriptionsToSeeBreakdown')}
      </p>
    </div>
  );

  if (data.length === 0) {
    return (
      <div
        style={{
          padding: '28px',
          borderRadius: '16px',
          background:
            'linear-gradient(145deg, rgba(17, 17, 17, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.03) inset,
            0 4px 24px -4px rgba(0, 0, 0, 0.4)
          `,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background:
                'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
            }}
          >
            <svg
              style={{ width: '20px', height: '20px', color: '#a855f7' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
              />
            </svg>
          </div>
          <div>
            <h2
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#ededed',
                marginBottom: '2px',
                letterSpacing: '-0.01em',
              }}
            >
              {t('dashboard.categoryBreakdown')}
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
              Distribución por categoría
            </p>
          </div>
        </div>
        <div
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2), transparent)',
            margin: '20px 0',
            opacity: 0.5,
          }}
        />
        <EmptyState />
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
        `}</style>
      </div>
    );
  }

  // Use count for the pie chart (universal across currencies)
  const chartData = data.map((item) => ({
    name: t(`subscriptions.categories.${item.category}`),
    value: item.count,
    category: item.category,
    totalsByCurrency: item.totalsByCurrency,
  }));

  // Custom tooltip to show currency breakdown
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: (typeof chartData)[0] }>;
  }) => {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0].payload;
    const hasMultipleCurrencies = item.totalsByCurrency.length > 1;

    return (
      <div
        style={{
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          backdropFilter: 'blur(10px)',
          padding: '12px 16px',
          minWidth: '140px',
        }}
      >
        <p style={{ color: '#ededed', fontWeight: 600, marginBottom: '8px' }}>{item.name}</p>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '13px',
            marginBottom: hasMultipleCurrencies ? '8px' : 0,
          }}
        >
          {item.value}{' '}
          {item.value === 1 ? t('dashboard.subscription') : t('dashboard.subscriptions')}
        </p>
        {item.totalsByCurrency.length > 0 && (
          <div
            style={{
              borderTop: hasMultipleCurrencies ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              paddingTop: hasMultipleCurrencies ? '8px' : 0,
            }}
          >
            {item.totalsByCurrency.map((curr) => (
              <p
                key={curr.currency}
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}
              >
                {formatCurrency(curr.amount, curr.currency)}/mes
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: '28px',
        borderRadius: '16px',
        background: 'linear-gradient(145deg, rgba(17, 17, 17, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: `
          0 0 0 1px rgba(255, 255, 255, 0.03) inset,
          0 4px 24px -4px rgba(0, 0, 0, 0.4)
        `,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background:
              'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
          }}
        >
          <svg
            style={{ width: '20px', height: '20px', color: '#a855f7' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
            />
          </svg>
        </div>
        <div>
          <h2
            style={{
              fontSize: '17px',
              fontWeight: 700,
              color: '#ededed',
              marginBottom: '2px',
              letterSpacing: '-0.01em',
            }}
          >
            {t('dashboard.categoryBreakdown')}
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
            Distribución por categoría
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2), transparent)',
          margin: '20px 0',
          opacity: 0.5,
        }}
      />

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={90}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            strokeWidth={2}
            stroke="#000000"
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
            iconType="circle"
            formatter={(value) => (
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
