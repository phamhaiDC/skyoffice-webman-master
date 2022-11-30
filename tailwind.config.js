module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: {
          100: '#FAFAFA',
          200: '#EAECEE',
          300: '#D6DADE',
          400: '#A8B0B9',
          500: '#717D8A',
          600: '#4F5B67',
          700: '#424D57',
          800: '#373F47',
          900: '#242D35',
          1000: '#0C1116',
        },
        primary: {
          100: '#FFF4EC',
          200: '#FFE8D7',
          300: '#FFCCB0',
          400: '#FF886B',
          500: '#E6311A',
          600: '#DA2B25',
          700: '#B71D23',
          800: '#931222',
          900: '#7A0B21',
          1000: '#2F040D',
          hover: '#40a9ff',
        },
        green: {
          100: '#FCFFFA',
          200: '#E6FBD9',
          300: '#C9F8B4',
          400: '#A0EC8A',
          500: '#44C13C',
          600: '#2BA52E',
          700: '#1E8A29',
          800: '#0F5B1D',
          900: '#073E16',
          1000: '#052E10',
        },
        danger: {
          default: '#ff4d4f',
          hover: '#ff7875',
        },
        bg: '#FAF9F8',
        menu: {
          bg: '#F3F2F1',
          line: '#E1DFDD',
        },
        table: {
          line: '#EDEBE9',
        },
        input: {
          line: '#d9d9d9',
        },
        status: {
          0: '#E5311A', // deleted
          1: '#D6DADE', // draft
          2: '#eab308', // inactive
          3: '#44C13C', // active
          4: '#3377FF', // preset
        },
      },
      boxShadow: {
        popover:
          '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
      },
    },
  },
  plugins: [],
}
