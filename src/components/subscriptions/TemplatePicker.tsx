import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SUBSCRIPTION_TEMPLATES, SubscriptionTemplate } from '@/constants/templates';
import { ServiceLogo } from '@/components/ui/ServiceLogo';
import { Category } from '@/types';
import { formatCurrency } from '@/utils/calculations';

const CATEGORY_ORDER: Category[] = [
  Category.STREAMING,
  Category.MUSIC,
  Category.GAMING,
  Category.PRODUCTIVITY,
  Category.CLOUD_STORAGE,
  Category.UTILITIES,
  Category.HEALTH_FITNESS,
  Category.NEWS_LEARNING,
  Category.OTHER,
];

interface TemplatePickerProps {
  onSelectTemplate: (template: SubscriptionTemplate) => void;
  onCustom: () => void;
  compact?: boolean;
}

export const TemplatePicker = ({ onSelectTemplate, onCustom, compact = false }: TemplatePickerProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  const filtered = useMemo(() => {
    let templates = [...SUBSCRIPTION_TEMPLATES];

    if (search) {
      const q = search.toLowerCase();
      templates = templates.filter((tpl) => tpl.name.toLowerCase().includes(q));
    }

    if (selectedCategory !== 'all') {
      templates = templates.filter((tpl) => tpl.category === selectedCategory);
    }

    templates.sort((a, b) => (a.popularityRank ?? 99) - (b.popularityRank ?? 99));
    return templates;
  }, [search, selectedCategory]);

  const groupedByCategory = useMemo(() => {
    if (selectedCategory !== 'all' || search) return null;
    const groups = new Map<Category, SubscriptionTemplate[]>();
    for (const tpl of filtered) {
      const list = groups.get(tpl.category) || [];
      list.push(tpl);
      groups.set(tpl.category, list);
    }
    return groups;
  }, [filtered, selectedCategory, search]);

  const categoryTabs = useMemo(() => {
    const seen = new Set<Category>();
    SUBSCRIPTION_TEMPLATES.forEach((tpl) => seen.add(tpl.category));
    return CATEGORY_ORDER.filter((cat) => seen.has(cat));
  }, []);

  const renderTemplate = (tpl: SubscriptionTemplate) => {
    const freqLabel =
      tpl.billingFrequency === 'monthly'
        ? t('subscriptions.frequency.perMonth')
        : tpl.billingFrequency === 'yearly'
          ? t('subscriptions.frequency.perYear')
          : t(`subscriptions.frequency.${tpl.billingFrequency}`);

    return (
      <button
        key={tpl.name}
        type="button"
        onClick={() => onSelectTemplate(tpl)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: compact ? '6px 10px' : '8px 12px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: '10px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          width: '100%',
          textAlign: 'left',
          fontFamily: 'inherit',
        }}
        className="hover:bg-white/[0.06] hover:border-cyan-500/30"
      >
        <ServiceLogo name={tpl.name} size={compact ? 28 : 32} category={tpl.category} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: compact ? '12px' : '13px',
              fontWeight: 600,
              color: '#ededed',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {tpl.name}
          </div>
          <div style={{ fontSize: '11px', color: '#888888' }}>
            {formatCurrency(tpl.cost, tpl.currency)}
            <span style={{ color: '#555555' }}> {freqLabel}</span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minHeight: 0 }}>
      {/* Search */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '16px',
            height: '16px',
            color: '#666666',
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('subscriptions.searchPlaceholder')}
          style={{
            width: '100%',
            padding: '9px 12px 9px 38px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            color: '#ededed',
            fontSize: '13px',
            outline: 'none',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }}
        />
      </div>

      {/* Category tabs */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
            background:
              selectedCategory === 'all'
                ? 'rgba(0, 212, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.04)',
            color: selectedCategory === 'all' ? '#00d4ff' : '#888888',
            transition: 'all 0.15s ease',
          }}
        >
          {t('common.all', 'Todos')}
        </button>
        {categoryTabs.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
              background:
                selectedCategory === cat
                  ? 'rgba(0, 212, 255, 0.15)'
                  : 'rgba(255, 255, 255, 0.04)',
              color: selectedCategory === cat ? '#00d4ff' : '#888888',
              transition: 'all 0.15s ease',
            }}
          >
            {t(`subscriptions.categories.${cat}`)}
          </button>
        ))}
      </div>

      {/* Templates list — scrollable, takes remaining space */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          paddingRight: '4px',
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#666666',
              fontSize: '13px',
            }}
          >
            {t('subscriptions.noResults')}
          </div>
        )}

        {groupedByCategory
          ? CATEGORY_ORDER.map((cat) => {
              const templates = groupedByCategory.get(cat);
              if (!templates || templates.length === 0) return null;
              return (
                <div key={cat}>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#555555',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '6px 4px 3px',
                    }}
                  >
                    {t(`subscriptions.categories.${cat}`)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {templates.map(renderTemplate)}
                  </div>
                </div>
              );
            })
          : filtered.map(renderTemplate)}
      </div>

      {/* Custom button */}
      <button
        type="button"
        onClick={onCustom}
        style={{
          width: '100%',
          padding: '11px',
          background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
          color: '#000',
          fontWeight: 600,
          fontSize: '14px',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {t('subscriptions.templates.addCustom')}
      </button>
    </div>
  );
};
