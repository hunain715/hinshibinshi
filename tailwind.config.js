/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - white & orange theme
        brand: '#FF6B00',
        'brand-light': '#FF8C3A',
        'brand-dark': '#E05A00',
        'brand-pale': '#FFF3E8',
        'brand-50': '#FFF8F2',
        // Neutrals
        surface: '#FFFFFF',
        'surface-2': '#F9FAFB',
        'surface-3': '#F3F4F6',
        muted: '#6B7280',
        'muted-light': '#9CA3AF',
        dark: '#111827',
        'dark-2': '#1F2937',
        'dark-3': '#374151',
        // Legacy (keep for admin panel)
        obsidian: '#0f1923',
        cobalt: '#2f7cff',
        'slate-muted': '#8da0b3',
        optic: '#f6fbff',
        sidebar: 'hsl(var(--sidebar-background))',
        'sidebar-foreground': 'hsl(var(--sidebar-foreground))',
        'sidebar-border': 'hsl(var(--sidebar-border))',
        'sidebar-accent': 'hsl(var(--sidebar-accent))',
        'sidebar-accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
        'sidebar-ring': 'hsl(var(--sidebar-ring))',
      },
      fontFamily: {
        heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brand-sm': '0 2px 12px rgba(255,107,0,0.15)',
        'brand-md': '0 4px 24px rgba(255,107,0,0.20)',
        'brand-lg': '0 8px 40px rgba(255,107,0,0.25)',
        card: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.08)',
      },
      keyframes: {
        'pulse-travel': { '0%, 100%': { opacity: '0.4' }, '50%': { opacity: '1' } },
        sweep: { '0%': { transform: 'translateX(-100%)' }, '100%': { transform: 'translateX(100%)' } },
        'float-y': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        'tick-up': { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'pulse-travel': 'pulse-travel 2s ease-in-out infinite',
        sweep: 'sweep 2.4s linear infinite',
        'float-y': 'float-y 3s ease-in-out infinite',
        'tick-up': 'tick-up .35s ease-out',
        float: 'float-y 3s ease-in-out infinite',
        tick: 'tick-up .35s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
