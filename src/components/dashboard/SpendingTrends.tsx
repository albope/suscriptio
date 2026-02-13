import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Subscription } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { calculateSpendingTrends, type MonthlySpendData } from '@/utils/spendingTrends';
import { PremiumGate } from '@/components/billing/PremiumGate';

interface SpendingTrendsProps {
  subscriptions: Subscription[];
  preferredCurrency: string;
}

type MonthRange = 3 | 6 | 12;

export const SpendingTrends = ({ subscriptions, preferredCurrency }: SpendingTrendsProps) => {
  const { t } = useTranslation();
  const [monthRange, setMonthRange] = useState<MonthRange>(6);

  const trendData = useMemo(
    () => calculateSpendingTrends(subscriptions, monthRange, preferredCurrency),
    [subscriptions, monthRange, preferredCurrency]
  );

  // Get the latest trend
  const latestTrend = trendData.length > 1 ? trendData[trendData.length - 1] : null;

  const trendColor = latestTrend?.trend === 'up' ? '#ef4444' : latestTrend?.trend === 'down' ? '#22c55e' : '#00d4ff';
  const trendArrow = latestTrend?.trend === 'up' ? '↑' : latestTrend?.trend === 'down' ? '↓' : '→';

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: MonthlySpendData }>;
  }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '14px 18px',
          minWidth: '140px',
        }}
      >
        <p style={{ color: '#ededed', fontWeight: 600, marginBottom: '8px', textTransform: 'capitalize' }}>
          {data.label}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>Total</span>
          <span style={{ color: '#00d4ff', fontSize: '13px', fontWeight: 500 }}>
            {formatCurrency(data.total, preferredCurrency)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
            {t('dashboard.activeSubscriptions')}
          </span>
          <span style={{ color: '#ededed', fontSize: '13px' }}>{data.count}</span>
        </div>
        {data.changePercent !== 0 && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span
              style={{
                fontSize: '12px',
                color: data.trend === 'up' ? '#ef4444' : data.trend === 'down' ? '#22c55e' : '#00d4ff',
              }}
            >
              {data.trend === 'up' ? '↑' : '↓'} {Math.abs(data.changePercent)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  const ranges: MonthRange[] = [3, 6, 12];

  return (
    <PremiumGate feature="spendingTrends" fallback="blur">
      <div
        style={{
          padding: '28px',
          borderRadius: '16px',
          background: 'linear-gradient(145deg, rgba(17, 17, 17, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.03) inset, 0 4px 24px -4px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                style={{ width: '20px', height: '20px', color: '#a855f7' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#ededed', marginBottom: '2px' }}>
                {t('dashboard.spendingTrends')}
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
                {t('dashboard.spendingTrendsSubtitle')}
              </p>
            </div>
          </div>

          {/* Trend indicator + range selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {latestTrend && latestTrend.changePercent !== 0 && (
              <span style={{ fontSize: '14px', fontWeight: 600, color: trendColor }}>
                {trendArrow} {Math.abs(latestTrend.changePercent)}%
              </span>
            )}
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(17, 17, 17, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '3px',
              }}
            >
              {ranges.map((r) => (
                <button
                  key={r}
                  onClick={() => setMonthRange(r)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: 'none',
                    fontFamily: 'inherit',
                    background: monthRange === r ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                    color: monthRange === r ? '#a855f7' : '#888888',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {r}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(0, 212, 255, 0.2), transparent)',
            margin: '20px 0',
            opacity: 0.5,
          }}
        />

        {/* Chart */}
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11 }}
              tickFormatter={(value) => formatCurrency(value, preferredCurrency)}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#trendGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Disclaimer */}
        <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)', marginTop: '12px', textAlign: 'center' }}>
          {t('dashboard.estimated')}
        </p>
      </div>
    </PremiumGate>
  );
};
