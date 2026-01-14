import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '@/types';
import { getCurrencyByCode } from '@/constants/currencies';

interface FilterBarProps {
  categories: (Category | 'no-category')[];
  onCategoryChange: (categories: (Category | 'no-category')[]) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  priceRange: { min: number | null; max: number | null };
  onPriceRangeChange: (range: { min: number | null; max: number | null }) => void;
  dateRange: { from: string | null; to: string | null };
  onDateRangeChange: (range: { from: string | null; to: string | null }) => void;
  currency: string;
  onReset: () => void;
  activeFiltersCount: number;
}

const ALL_CATEGORIES: Array<{ value: Category | 'no-category'; label: string }> = [
  { value: Category.STREAMING, label: 'Streaming' },
  { value: Category.PRODUCTIVITY, label: 'Productividad' },
  { value: Category.CLOUD_STORAGE, label: 'Almacenamiento' },
  { value: Category.MUSIC, label: 'Música' },
  { value: Category.GAMING, label: 'Gaming' },
  { value: Category.HEALTH_FITNESS, label: 'Salud y fitness' },
  { value: Category.NEWS_LEARNING, label: 'Noticias y aprendizaje' },
  { value: Category.UTILITIES, label: 'Utilidades' },
  { value: Category.OTHER, label: 'Otros' },
  { value: 'no-category', label: 'Sin categoría' },
];

export const FilterBar = ({
  categories,
  onCategoryChange,
  tags,
  onTagsChange,
  availableTags,
  priceRange,
  onPriceRangeChange,
  dateRange,
  onDateRangeChange,
  currency,
  onReset,
  activeFiltersCount,
}: FilterBarProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(activeFiltersCount > 0);
  const currencySymbol = getCurrencyByCode(currency)?.symbol || currency;

  // Auto-expand when filters are applied
  useEffect(() => {
    if (activeFiltersCount > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  }, [activeFiltersCount, isExpanded]);

  const handleCategoryToggle = (category: Category | 'no-category') => {
    if (categories.includes(category)) {
      onCategoryChange(categories.filter((c) => c !== category));
    } else {
      onCategoryChange([...categories, category]);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (tags.includes(tag)) {
      onTagsChange(tags.filter((t) => t !== tag));
    } else {
      onTagsChange([...tags, tag]);
    }
  };

  const handlePriceMinChange = (value: string) => {
    const num = value === '' ? null : parseFloat(value);
    onPriceRangeChange({ ...priceRange, min: num });
  };

  const handlePriceMaxChange = (value: string) => {
    const num = value === '' ? null : parseFloat(value);
    onPriceRangeChange({ ...priceRange, max: num });
  };

  const handleDatePreset = (preset: 'next7days' | 'next30days' | 'thisMonth' | 'next3months') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let to = new Date();

    switch (preset) {
      case 'next7days':
        to.setDate(today.getDate() + 7);
        break;
      case 'next30days':
        to.setDate(today.getDate() + 30);
        break;
      case 'thisMonth':
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'next3months':
        to.setMonth(today.getMonth() + 3);
        break;
    }

    onDateRangeChange({
      from: today.toISOString().split('T')[0],
      to: to.toISOString().split('T')[0],
    });
  };

  const isPriceRangeInvalid =
    priceRange.min !== null &&
    priceRange.max !== null &&
    priceRange.max < priceRange.min;

  return (
    <div style={{
      background: 'rgba(17, 17, 17, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      padding: '16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isExpanded ? '20px' : '0',
      }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            color: '#ededed',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          <svg
            style={{
              width: '20px',
              height: '20px',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          {t('filters.advanced')}
          {activeFiltersCount > 0 && (
            <span style={{
              background: 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)',
              color: '#000',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '12px',
              boxShadow: '0 0 15px rgba(0, 212, 255, 0.3)',
            }}>
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            style={{
              background: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#ff3b30',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 59, 48, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)';
            }}
          >
            {t('filters.clearAll')}
          </button>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Categories */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#888888',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {t('filters.categories')}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ALL_CATEGORIES.map((cat) => {
                const isSelected = categories.includes(cat.value);
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategoryToggle(cat.value)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      border: 'none',
                      background: isSelected
                        ? 'linear-gradient(180deg, #00d4ff 0%, #00a8cc 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#000' : '#888888',
                      boxShadow: isSelected ? '0 0 15px rgba(0, 212, 255, 0.2)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.color = '#ededed';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = '#888888';
                      }
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          {availableTags.length > 0 && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#888888',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {t('filters.tags')}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableTags.map((tag) => {
                  const isSelected = tags.includes(tag);
                  // Generate consistent color for each tag
                  let hash = 0;
                  for (let i = 0; i < tag.length; i++) {
                    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  const colors = [
                    { bg: 'rgba(0, 212, 255, 0.12)', text: '#00d4ff', border: 'rgba(0, 212, 255, 0.3)' },
                    { bg: 'rgba(138, 43, 226, 0.12)', text: '#b37fe8', border: 'rgba(138, 43, 226, 0.3)' },
                    { bg: 'rgba(255, 107, 107, 0.12)', text: '#ff6b6b', border: 'rgba(255, 107, 107, 0.3)' },
                    { bg: 'rgba(72, 219, 251, 0.12)', text: '#48dbfb', border: 'rgba(72, 219, 251, 0.3)' },
                    { bg: 'rgba(255, 159, 64, 0.12)', text: '#ff9f40', border: 'rgba(255, 159, 64, 0.3)' },
                  ];
                  const color = colors[Math.abs(hash) % colors.length];

                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: `1px solid ${isSelected ? color.border : 'rgba(255, 255, 255, 0.08)'}`,
                        background: isSelected ? color.bg : 'rgba(255, 255, 255, 0.05)',
                        color: isSelected ? color.text : '#888888',
                        boxShadow: isSelected ? `0 0 15px ${color.bg}` : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = '#ededed';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = '#888888';
                        }
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Range */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#888888',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {t('filters.priceRange')} ({currencySymbol})
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceRange.min ?? ''}
                onChange={(e) => handlePriceMinChange(e.target.value)}
                placeholder={t('filters.minPrice')}
                style={{
                  flex: '1',
                  minWidth: '120px',
                  padding: '10px 14px',
                  background: 'rgba(17, 17, 17, 0.8)',
                  border: `1px solid ${isPriceRangeInvalid ? 'rgba(255, 59, 48, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#ededed',
                  outline: 'none',
                }}
              />
              <span style={{ color: '#666666', fontSize: '14px' }}>—</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceRange.max ?? ''}
                onChange={(e) => handlePriceMaxChange(e.target.value)}
                placeholder={t('filters.maxPrice')}
                style={{
                  flex: '1',
                  minWidth: '120px',
                  padding: '10px 14px',
                  background: 'rgba(17, 17, 17, 0.8)',
                  border: `1px solid ${isPriceRangeInvalid ? 'rgba(255, 59, 48, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#ededed',
                  outline: 'none',
                }}
              />
            </div>
            {isPriceRangeInvalid && (
              <p style={{
                fontSize: '12px',
                color: '#ff3b30',
                marginTop: '6px',
                marginBottom: '0',
              }}>
                El precio máximo debe ser mayor que el mínimo
              </p>
            )}
          </div>

          {/* Date Range */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#888888',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              {t('filters.dateRange')}
            </label>

            {/* Presets */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <button
                onClick={() => handleDatePreset('next7days')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#888888',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#ededed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#888888';
                }}
              >
                {t('filters.presets.next7days')}
              </button>
              <button
                onClick={() => handleDatePreset('next30days')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#888888',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#ededed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#888888';
                }}
              >
                {t('filters.presets.next30days')}
              </button>
              <button
                onClick={() => handleDatePreset('thisMonth')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#888888',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#ededed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#888888';
                }}
              >
                {t('filters.presets.thisMonth')}
              </button>
              <button
                onClick={() => handleDatePreset('next3months')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#888888',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = '#ededed';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#888888';
                }}
              >
                {t('filters.presets.next3months')}
              </button>
            </div>

            {/* Date Inputs */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="date"
                value={dateRange.from ?? ''}
                onChange={(e) => onDateRangeChange({ ...dateRange, from: e.target.value || null })}
                style={{
                  flex: '1',
                  minWidth: '140px',
                  padding: '10px 14px',
                  background: 'rgba(17, 17, 17, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#ededed',
                  outline: 'none',
                  colorScheme: 'dark',
                }}
              />
              <span style={{ color: '#666666', fontSize: '14px' }}>—</span>
              <input
                type="date"
                value={dateRange.to ?? ''}
                onChange={(e) => onDateRangeChange({ ...dateRange, to: e.target.value || null })}
                style={{
                  flex: '1',
                  minWidth: '140px',
                  padding: '10px 14px',
                  background: 'rgba(17, 17, 17, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#ededed',
                  outline: 'none',
                  colorScheme: 'dark',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
