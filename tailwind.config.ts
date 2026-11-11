import type { Config } from 'tailwindcss';

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FFFFFFEF',
                    hover: '#F6F6F6EF',
                    darker: '#D4D4D4EF', // other tab color
                    opaque: {
                        DEFAULT: '#FFFFFF',
                        hover: '#F6F6F6',
                        darker: '#D4D4D4', // other tab color
                    },
                },
                secondary: {
                    DEFAULT: '#1C76CA',
                    hover: '#155A9A',
                },
                tertiary: {
                    DEFAULT: '#10B0AD',
                    hover: '#1BDCD8',
                },
                background: 'var(--background)',
                foreground: 'var(--foreground)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config;
