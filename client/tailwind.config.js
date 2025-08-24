/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', , './src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        bg: '#eceff4',
        text: '#242626',
        grayL80: '#dedfdf',
        white: '#ffffff',
        strangeSilver: '#d0dce1',
        purple: '#4c396f',
        grayBase: '#595f60',
        darkBlue: '#011f49',
        easyBlue: '#125169',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
      fontSize: {
        mammut: ['38px', { lineHeight: '56px', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
  safelist: ['animate-[fade-in_1s_ease-in-out]', 'animate-[fade-in-down_1s_ease-in-out]'],
};
