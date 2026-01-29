import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/types';

type SortOption = 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc' | 'name-asc';

export interface FilterPreferences {
  sortBy: SortOption;
  statusFilter: 'all' | 'active' | 'canceled';
  categoryFilters: Category[];
  tagFilters: string[];
  priceRange: { min: number | null; max: number | null };
  dateRange: { from: string | null; to: string | null }; // ISO string for serialization
}

const STORAGE_KEY = 'subscriptio-filter-preferences';

const DEFAULT_PREFERENCES: FilterPreferences = {
  sortBy: 'date-asc',
  statusFilter: 'active',
  categoryFilters: [],
  tagFilters: [],
  priceRange: { min: null, max: null },
  dateRange: { from: null, to: null },
};

// Debounce helper
let debounceTimeout: NodeJS.Timeout | null = null;

export function useFilterPreferences() {
  const [preferences, setPreferences] = useState<FilterPreferences>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch (error) {
      console.error('Error loading filter preferences:', error);
    }
    return DEFAULT_PREFERENCES;
  });

  // Persist to localStorage with debounce
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Error saving filter preferences:', error);
      }
    }, 300);

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [preferences]);

  const updatePreferences = useCallback((updates: Partial<FilterPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  return { preferences, updatePreferences, resetPreferences };
}
