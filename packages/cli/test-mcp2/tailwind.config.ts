import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(15 23 42)',
          dark: 'rgb(2 6 23)',
        },
        secondary: {
          DEFAULT: 'rgb(100 116 139)',
          dark: 'rgb(71 85 105)',
        },
        accent: {
          DEFAULT: 'rgb(59 130 246)',
          dark: 'rgb(37 99 235)',
        },
        background: 'rgb(255 255 255)',
        surface: 'rgb(248 250 252)',
        text: {
          DEFAULT: 'rgb(2 6 23)',
          secondary: 'rgb(100 116 139)',
        },
        error: 'rgb(239 68 68)',
        warning: 'rgb(245 158 11)',
        success: 'rgb(16 185 129)',
        info: 'rgb(59 130 246)',
      },
    },
  },
  plugins: [],
} satisfies Config;
