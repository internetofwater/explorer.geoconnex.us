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
                text: {
                    DEFAULT: '#000000',
                    light: '#333333', // Lighter black text color
                    dark: '#000000', // Darker black text color
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
