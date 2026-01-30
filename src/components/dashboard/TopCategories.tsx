import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/calculations';

interface TopCategory {
  category: string;
  total: number;
  percentage: number;
}

interface TopCategoriesProps {
  topCategories: TopCategory[];
  preferredCurrency: string;
  onViewAll?: () => void;
}

// Shared card styles for consistency
const cardStyle = {
  padding: '28px',
  borderRadius: '16px',
  background: 'linear-gradient(145deg, rgba(17, 17, 17, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'default',
  boxShadow: `
    0 0 0 1px rgba(255, 255, 255, 0.03) inset,
    0 4px 24px -4px rgba(0, 0, 0, 0.4)
  `,
};

// Category colors for visual distinction
const categoryColors: Record<string, string> = {
  streaming: '#ef4444',
  productivity: '#3b82f6',
  cloud_storage: '#8b5cf6',
  music: '#ec4899',
  gaming: '#22c55e',
  health_fitness: '#14b8a6',
  news_learning: '#f59e0b',
  utilities: '#6366f1',
  other: '#6b7280',
};

export const TopCategories = ({
  topCategories,
  preferredCurrency,
  onViewAll,
}: TopCategoriesProps) => {
  const { t } = useTranslation();

  if (topCategories.length === 0) {
    return null;
  }

  return (
    <div
      className="metric-card"
      style={cardStyle}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {t('dashboard.topCategories')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topCategories.map((cat, index) => {
              const color = categoryColors[cat.category] || categoryColors.other;
              return (
                <div
                  key={cat.category}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {/* Rank indicator */}
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'rgba(255, 255, 255, 0.3)',
                      minWidth: '16px',
                    }}
                  >
                    #{index + 1}
                  </span>

                  {/* Category color dot */}
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      flexShrink: 0,
                    }}
                  />

                  {/* Category name */}
                  <span
                    style={{
                      flex: 1,
                      fontSize: '14px',
                      color: '#ededed',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t(`subscriptions.categories.${cat.category}`)}
                  </span>

                  {/* Amount and percentage */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#ededed',
                      }}
                    >
                      {formatCurrency(cat.total, preferredCurrency)}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        marginLeft: '6px',
                      }}
                    >
                      ({cat.percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {onViewAll && topCategories.length >= 3 && (
            <button
              onClick={onViewAll}
              style={{
                marginTop: '16px',
                padding: '8px 0',
                background: 'transparent',
                border: 'none',
                color: '#00d4ff',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {t('dashboard.viewAllCategories')}
              <svg
                style={{ width: '14px', height: '14px' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Icon */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background:
              'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0.05) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)',
            marginLeft: '24px',
          }}
        >
          <svg
            style={{ width: '22px', height: '22px', color: '#a855f7' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
        </div>
      </div>

      {/* Subtle accent line */}
      <div
        style={{
          marginTop: '20px',
          height: '2px',
          background:
            'linear-gradient(90deg, #a855f7 0%, rgba(168, 85, 247, 0.3) 50%, transparent 100%)',
          borderRadius: '1px',
          opacity: 0.6,
        }}
      />
    </div>
  );
};
