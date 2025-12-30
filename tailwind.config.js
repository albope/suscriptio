/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary: Cyan/Teal futurista
        primary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        // Accent: Purple para contraste
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // Dark palette para fondos
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#030712',
        },
        // Slate para textos
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Status colors
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        success: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.3)',
        'medium': '0 4px 16px -4px rgba(0, 0, 0, 0.4)',
        'hard': '0 8px 24px -8px rgba(0, 0, 0, 0.5)',
        // Cyan glow effects
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)',
        'glow-cyan-lg': '0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(6, 182, 212, 0.3)',
        'glow-cyan-sm': '0 0 10px rgba(6, 182, 212, 0.3)',
        // Purple glow effects
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.2)',
        'glow-purple-lg': '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.3)',
        // Mixed glow
        'glow-mixed': '0 0 20px rgba(6, 182, 212, 0.25), 0 0 40px rgba(168, 85, 247, 0.15)',
        // Inner highlight for glass
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        // Card shadows for dark mode
        'card': '0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh-dark': 'var(--gradient-mesh-dark)',
        'gradient-primary': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'gradient-accent': 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
        'gradient-mixed': 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'breathe-glow': 'breathe-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' },
        },
        'breathe-glow': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)',
            borderColor: 'rgba(6, 182, 212, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
            borderColor: 'rgba(6, 182, 212, 0.5)',
          },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
