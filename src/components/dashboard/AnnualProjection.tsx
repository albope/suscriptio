import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Subscription, BillingFrequency } from '@/types';
import { formatCurrency } from '@/utils/calculations';
import { addMonths, getMonth, getYear, startOfMonth, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AnnualProjectionProps {
  subscriptions: Subscription[];
  preferredCurrency: string;
}

interface MonthData {
  month: string;
  monthIndex: number;
  total: number;
  monthly: number;
  yearly: number;
  isCurrentMonth: boolean;
}

export const AnnualProjection = ({ subscriptions, preferredCurrency }: AnnualProjectionProps) => {
  const { t } = useTranslation();

  // Calculate 12 months of projected spend
  const projectionData = useMemo(() => {
    const now = new Date();
    const currentMonth = getMonth(now);
    const currentYear = getYear(now);
    const data: MonthData[] = [];

    // Filter subscriptions by preferred currency
    const filteredSubs = subscriptions.filter((sub) => sub.currency === preferredCurrency);

    // Generate data for 12 months starting from current month
    for (let i = 0; i < 12; i++) {
      const targetDate = addMonths(startOfMonth(now), i);
      const targetMonth = getMonth(targetDate);
      const targetYear = getYear(targetDate);

      let monthlyTotal = 0;
      let yearlyTotal = 0;

      filteredSubs.forEach((sub) => {
        if (sub.billingFrequency === BillingFrequency.MONTHLY) {
          // Monthly subscriptions appear every month
          monthlyTotal += sub.cost;
        } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
          // Yearly subscriptions appear only in their payment month
          const paymentDate = new Date(sub.nextPaymentDate);
          const paymentMonth = getMonth(paymentDate);
          const paymentYear = getYear(paymentDate);

          // Check if this subscription pays in this target month
          // We need to consider future years too
          if (paymentMonth === targetMonth) {
            // Check if the payment year matches or is in the future
            if (
              paymentYear === targetYear ||
              (paymentYear < targetYear && targetMonth >= currentMonth) ||
              (paymentYear > targetYear && targetMonth < currentMonth)
            ) {
              yearlyTotal += sub.cost;
            } else if (paymentYear === currentYear && targetYear === currentYear + 1) {
              // Next year's occurrence
              yearlyTotal += sub.cost;
            }
          }
        }
      });

      data.push({
        month: format(targetDate, 'MMM', { locale: es }),
        monthIndex: i,
        total: monthlyTotal + yearlyTotal,
        monthly: monthlyTotal,
        yearly: yearlyTotal,
        isCurrentMonth: targetMonth === currentMonth && targetYear === currentYear,
      });
    }

    return data;
  }, [subscriptions, preferredCurrency]);

  // Find max value for chart scaling
  const maxValue = Math.max(...projectionData.map((d) => d.total), 1);

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ payload: MonthData }>;
    label?: string;
  }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          backdropFilter: 'blur(10px)',
          padding: '14px 18px',
          minWidth: '160px',
        }}
      >
        <p
          style={{
            color: '#ededed',
            fontWeight: 600,
            marginBottom: '10px',
            textTransform: 'capitalize',
          }}
        >
          {label} {data.isCurrentMonth && '(actual)'}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
              {t('dashboard.monthlyProjection')}
            </span>
            <span style={{ color: '#00d4ff', fontSize: '13px', fontWeight: 500 }}>
              {formatCurrency(data.monthly, preferredCurrency)}
            </span>
          </div>
          {data.yearly > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '13px' }}>
                {t('dashboard.yearlyPayments')}
              </span>
              <span style={{ color: '#f59e0b', fontSize: '13px', fontWeight: 500 }}>
                {formatCurrency(data.yearly, preferredCurrency)}
              </span>
            </div>
          )}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '8px',
              marginTop: '4px',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px', fontWeight: 600 }}>
              Total
            </span>
            <span style={{ color: '#ededed', fontSize: '13px', fontWeight: 600 }}>
              {formatCurrency(data.total, preferredCurrency)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Calculate yearly total
  const yearlyTotal = projectionData.reduce((sum, d) => sum + d.total, 0);

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background:
                'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(0, 212, 255, 0.05) 100%)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
            }}
          >
            <svg
              style={{ width: '20px', height: '20px', color: '#00d4ff' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
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
              {t('dashboard.annualProjection')}
            </h2>
            <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)' }}>
              {t('dashboard.next12Months')}
            </p>
          </div>
        </div>

        {/* Yearly total badge */}
        <div
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.15)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {t('dashboard.projectedTotal')}
          </span>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#00d4ff',
              marginTop: '2px',
            }}
          >
            {formatCurrency(yearlyTotal, preferredCurrency)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, rgba(0, 212, 255, 0.3), rgba(168, 85, 247, 0.2), transparent)',
          margin: '20px 0',
          opacity: 0.5,
        }}
      />

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '16px',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: '#00d4ff',
            }}
          />
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {t('dashboard.monthlySubscriptions')}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '3px',
              background: '#f59e0b',
            }}
          />
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            {t('dashboard.yearlySubscriptions')}
          </span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={projectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
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
            domain={[0, maxValue * 1.1]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} />
          <Bar dataKey="monthly" stackId="a" fill="#00d4ff" radius={[0, 0, 0, 0]} />
          <Bar dataKey="yearly" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]}>
            {projectionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.yearly > 0 ? '#f59e0b' : 'transparent'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
