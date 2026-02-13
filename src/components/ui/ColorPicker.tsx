import { useTranslation } from 'react-i18next';

const PRESET_COLORS = [
  '#E50914',
  '#1DB954',
  '#00d4ff',
  '#FF9500',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#6366F1',
  '#3B82F6',
  '#EF4444',
  '#FFFFFF',
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string | undefined) => void;
  suggestedColor?: string;
}

export const ColorPicker = ({ value, onChange, suggestedColor }: ColorPickerProps) => {
  const { t } = useTranslation();

  const allColors =
    suggestedColor && !PRESET_COLORS.includes(suggestedColor)
      ? [suggestedColor, ...PRESET_COLORS]
      : PRESET_COLORS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        style={{
          fontSize: '13px',
          fontWeight: 500,
          color: '#888888',
        }}
      >
        {t('subscriptions.fields.color', 'Color')}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {/* No color / reset */}
        <button
          type="button"
          onClick={() => onChange(undefined)}
          title={t('common.none', 'Ninguno')}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: !value
              ? '2px solid #00d4ff'
              : '2px solid rgba(255, 255, 255, 0.15)',
            background: 'rgba(255, 255, 255, 0.03)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.15s ease',
            padding: 0,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#666666"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {allColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            title={color}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: color,
              border:
                value === color
                  ? '2px solid #00d4ff'
                  : `2px solid ${color === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow:
                value === color
                  ? `0 0 0 2px rgba(0, 212, 255, 0.3), 0 0 8px ${color}40`
                  : 'none',
              transform: value === color ? 'scale(1.1)' : 'scale(1)',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};
