import { useState, KeyboardEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export const TagInput = ({ tags, onChange, placeholder, suggestions = [] }: TagInputProps) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input and exclude already added tags
  const filteredSuggestions = suggestions
    .filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(suggestion)
    )
    .slice(0, 5);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();

    // Ignore empty or duplicate tags
    if (!trimmedTag || tags.includes(trimmedTag)) {
      setInputValue('');
      return;
    }

    onChange([...tags, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    }

    // Remove last tag on Backspace when input is empty
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowSuggestions(value.length > 0 && filteredSuggestions.length > 0);
  };

  // Generate consistent color for each tag
  const getTagColor = (tag: string) => {
    const colors = [
      { bg: 'rgba(0, 212, 255, 0.15)', text: '#00d4ff', border: 'rgba(0, 212, 255, 0.3)' },
      { bg: 'rgba(138, 43, 226, 0.15)', text: '#b37fe8', border: 'rgba(138, 43, 226, 0.3)' },
      { bg: 'rgba(255, 107, 107, 0.15)', text: '#ff6b6b', border: 'rgba(255, 107, 107, 0.3)' },
      { bg: 'rgba(72, 219, 251, 0.15)', text: '#48dbfb', border: 'rgba(72, 219, 251, 0.3)' },
      { bg: 'rgba(255, 159, 64, 0.15)', text: '#ff9f40', border: 'rgba(255, 159, 64, 0.3)' },
    ];

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Tags container */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '12px',
          background: 'rgba(17, 17, 17, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '10px',
          minHeight: '48px',
          alignItems: 'center',
        }}
      >
        {/* Existing tags */}
        {tags.map((tag) => {
          const color = getTagColor(tag);
          return (
            <div
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: color.bg,
                border: `1px solid ${color.border}`,
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: color.text,
              }}
            >
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  color: color.text,
                  opacity: 0.7,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
              >
                <svg
                  style={{ width: '14px', height: '14px' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(filteredSuggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length === 0 ? placeholder || t('tags.placeholder') : ''}
          style={{
            flex: '1',
            minWidth: '120px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '14px',
            color: '#ededed',
            padding: '4px',
          }}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'rgba(17, 17, 17, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '4px',
            zIndex: 10,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          {filteredSuggestions.map((suggestion) => {
            const color = getTagColor(suggestion);
            return (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: '#ededed',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: color.text,
                  }}
                />
                {suggestion}
              </button>
            );
          })}
        </div>
      )}

      {/* Hint text */}
      <p
        style={{
          fontSize: '12px',
          color: '#666666',
          marginTop: '6px',
          marginBottom: '0',
        }}
      >
        {t('tags.hint')}
      </p>
    </div>
  );
};
