export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#08090B',
        'accent': '#E53935',
        'text-primary': '#F5F5F5',
        'text-secondary': '#9297A1',
      },
      fontFamily: {
        'bebas': ['"Bebas Neue"', 'Impact', 'Haettenschweiler', '"Arial Narrow Bold"', 'sans-serif'],
        'inter': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Open Sans"', '"Helvetica Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
