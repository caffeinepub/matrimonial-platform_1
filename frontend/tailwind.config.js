import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                serif: ['Cormorant Garamond', 'Georgia', 'serif'],
                body: ['Lora', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                },
                saffron: {
                    50: 'oklch(0.97 0.02 75)',
                    100: 'oklch(0.93 0.05 72)',
                    200: 'oklch(0.87 0.09 68)',
                    300: 'oklch(0.80 0.13 62)',
                    400: 'oklch(0.72 0.16 55)',
                    500: 'oklch(0.62 0.18 48)',
                    600: 'oklch(0.54 0.17 44)',
                    700: 'oklch(0.46 0.15 40)',
                    800: 'oklch(0.36 0.12 35)',
                    900: 'oklch(0.26 0.08 30)',
                },
                gold: {
                    50: 'oklch(0.97 0.02 82)',
                    100: 'oklch(0.93 0.05 80)',
                    200: 'oklch(0.87 0.08 78)',
                    300: 'oklch(0.82 0.11 76)',
                    400: 'oklch(0.76 0.13 74)',
                    500: 'oklch(0.72 0.14 72)',
                    600: 'oklch(0.64 0.13 68)',
                    700: 'oklch(0.54 0.11 62)',
                    800: 'oklch(0.42 0.09 55)',
                    900: 'oklch(0.30 0.06 48)',
                },
                ivory: {
                    DEFAULT: 'oklch(0.98 0.012 85)',
                    dark: 'oklch(0.95 0.022 82)',
                },
                maroon: {
                    DEFAULT: 'oklch(0.32 0.12 20)',
                    light: 'oklch(0.45 0.14 22)',
                    dark: 'oklch(0.22 0.09 18)',
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                gold: '0 4px 20px rgba(180, 140, 40, 0.25)',
                'gold-lg': '0 8px 40px rgba(180, 140, 40, 0.35)',
                saffron: '0 4px 20px rgba(200, 100, 20, 0.25)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'pulse-gold': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(180, 140, 40, 0.4)' },
                    '50%': { boxShadow: '0 0 0 8px rgba(180, 140, 40, 0)' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.4s ease-out',
                'pulse-gold': 'pulse-gold 2s infinite',
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
