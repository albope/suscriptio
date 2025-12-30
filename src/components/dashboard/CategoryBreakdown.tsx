import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryBreakdown as CategoryData } from '@/types';

interface CategoryBreakdownProps {
  data: CategoryData[];
}

// Neon colors for futuristic dark mode
const COLORS = ['#06b6d4', '#a855f7', '#3b82f6', '#f59e0b', '#ec4899', '#10b981', '#ef4444', '#8b5cf6', '#14b8a6'];

export const CategoryBreakdown = ({ data }: CategoryBreakdownProps) => {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div
        className="card"
        style={{
          padding: '28px',
          borderRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg style={{ width: '22px', height: '22px', color: '#a855f7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ededed' }}>{t('dashboard.categoryBreakdown')}</h2>
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2), transparent)', marginBottom: '24px' }} />
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <svg style={{ width: '28px', height: '28px', color: '#666666' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#999999' }}>No hay datos disponibles</p>
          <p style={{ fontSize: '12px', color: '#666666', marginTop: '6px' }}>Agrega suscripciones para ver el desglose</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: t(`subscriptions.categories.${item.category}`),
    value: parseFloat(item.total.toFixed(2)),
  }));

  return (
    <div
      className="card"
      style={{
        padding: '28px',
        borderRadius: '16px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg style={{ width: '22px', height: '22px', color: '#a855f7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ededed', marginBottom: '4px' }}>{t('dashboard.categoryBreakdown')}</h2>
          <p style={{ fontSize: '13px', color: '#666666' }}>Distribución por categoría</p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2), transparent)', marginBottom: '20px' }} />

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
          <Tooltip
            formatter={(value) => `€${value}`}
            contentStyle={{
              backgroundColor: 'rgba(17, 17, 17, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
              color: '#ededed',
              padding: '12px 16px',
            }}
            labelStyle={{ color: '#ededed', fontWeight: 600 }}
            itemStyle={{ color: '#999999' }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
            iconType="circle"
            formatter={(value) => <span style={{ color: '#999999', fontSize: '13px' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
