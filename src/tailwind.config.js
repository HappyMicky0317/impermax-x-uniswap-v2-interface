
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

const { BREAKPOINTS } = require('./utils/constants/styles');

const IMPERMAX_BLACK_HAZE = Object.freeze({
  50: '#ffffff',
  100: '#fefefe',
  200: '#fdfdfd',
  300: '#fbfbfc',
  400: '#f8f9f9',
  500: '#f5f6f7',
  600: '#ddddde',
  700: '#b8b9b9',
  800: '#939494',
  900: '#787979'
});
const IMPERMAX_JADE = Object.freeze({
  50: '#f2fbf8',
  100: '#e6f8f1',
  200: '#bfeddc',
  300: '#99e1c7',
  400: '#4dcb9d',
  500: '#00b573',
  600: '#00a368',
  700: '#008856',
  800: '#006d45',
  900: '#005938'
});
const IMPERMAX_CARNATION = Object.freeze({
  50: '#fef6f6',
  100: '#fdeeee',
  200: '#fad4d4',
  300: '#f7bbbb',
  400: '#f18787',
  500: '#eb5454',
  600: '#d44c4c',
  700: '#b03f3f',
  800: '#8d3232',
  900: '#732929'
});
const IMPERMAX_ASTRAL = Object.freeze({
  50: '#f5f8fa',
  100: '#eaf1f5',
  200: '#cbdce6',
  300: '#abc7d7',
  400: '#6d9db8',
  500: '#2e739a',
  600: '#29688b',
  700: '#235674',
  800: '#1c455c',
  900: '#17384b'
});
const IMPERMAX_CORNFLOWER = Object.freeze({
  50: '#fafcfd',
  100: '#f5f9fc',
  200: '#e5eff6',
  300: '#d5e5f1',
  400: '#b6d2e7',
  500: '#97bedc',
  600: '#88abc6',
  700: '#718fa5',
  800: '#5b7284',
  900: '#4a5d6c'
});
const IMPERMAX_MERCURY = Object.freeze({
  50: '#fefefe',
  100: '#fdfdfd',
  200: '#f9f9f9',
  300: '#f5f5f5',
  400: '#eeeeee',
  500: '#e7e7e7',
  600: '#d0d0d0',
  700: '#adadad',
  800: '#8b8b8b',
  900: '#717171'
});
const IMPERMAX_MIRAGE = Object.freeze({
  50: '#f3f3f4',
  100: '#e7e8e9',
  200: '#c4c5c9',
  300: '#a0a3a9',
  400: '#585d68',
  500: '#111827',
  600: '#0f1623',
  700: '#0d121d',
  800: '#0a0e17',
  900: '#080c13'
});
const IMPERMAX_EMERALD = Object.freeze({
  50: '#f3fcf9',
  100: '#e6faf2',
  200: '#c1f1e0',
  300: '#9be9cd',
  400: '#50d9a7',
  500: '#05c881',
  600: '#05b474',
  700: '#049661',
  800: '#03784d',
  900: '#02623f'
});
const IMPERMAX_INCH_WORM = Object.freeze({
  50: '#fafdf2',
  100: '#f4fbe6',
  200: '#e4f5bf',
  300: '#d4ef99',
  400: '#b3e44d',
  500: '#93d800',
  600: '#84c200',
  700: '#6ea200',
  800: '#588200',
  900: '#486a00'
});
const IMPERMAX_GOLD_TIPS = Object.freeze({
  50: '#fdfcf2',
  100: '#fbf9e6',
  200: '#f5f0bf',
  300: '#efe699',
  400: '#e4d44d',
  500: '#d8c100',
  600: '#c2ae00',
  700: '#a29100',
  800: '#827400',
  900: '#6a5f00'
});
const IMPERMAX_TREE_POPPY = Object.freeze({
  50: '#fefaf3',
  100: '#fdf4e6',
  200: '#fbe4c1',
  300: '#f8d49b',
  400: '#f3b350',
  500: '#ee9305',
  600: '#d68405',
  700: '#b36e04',
  800: '#8f5803',
  900: '#754802'
});
const IMPERMAX_TRINIDAD = Object.freeze({
  50: '#fef7f3',
  100: '#fdeee6',
  200: '#fbd5c1',
  300: '#f8bc9b',
  400: '#f38950',
  500: '#ee5705',
  600: '#d64e05',
  700: '#b34104',
  800: '#8f3403',
  900: '#752b02'
});
const IMPERMAX_MILANO_RED = Object.freeze({
  50: '#fbf2f2',
  100: '#f8e6e6',
  200: '#edc0c0',
  300: '#e39b9b',
  400: '#cd4f4f',
  500: '#b80404',
  600: '#a60404',
  700: '#8a0303',
  800: '#6e0202',
  900: '#5a0202'
});

module.exports = {
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: BREAKPOINTS,
    extend: {
      colors: {
        impermaxBlackHaze: {
          50: IMPERMAX_BLACK_HAZE[50],
          100: IMPERMAX_BLACK_HAZE[100],
          200: IMPERMAX_BLACK_HAZE[200],
          300: IMPERMAX_BLACK_HAZE[300],
          400: IMPERMAX_BLACK_HAZE[400],
          DEFAULT: IMPERMAX_BLACK_HAZE[500],
          600: IMPERMAX_BLACK_HAZE[600],
          700: IMPERMAX_BLACK_HAZE[700],
          800: IMPERMAX_BLACK_HAZE[800],
          900: IMPERMAX_BLACK_HAZE[900]
        },
        impermaxJade: {
          50: IMPERMAX_JADE[50],
          100: IMPERMAX_JADE[100],
          200: IMPERMAX_JADE[200],
          300: IMPERMAX_JADE[300],
          400: IMPERMAX_JADE[400],
          DEFAULT: IMPERMAX_JADE[500],
          600: IMPERMAX_JADE[600],
          700: IMPERMAX_JADE[700],
          800: IMPERMAX_JADE[800],
          900: IMPERMAX_JADE[900]
        },
        impermaxCarnation: {
          50: IMPERMAX_CARNATION[50],
          100: IMPERMAX_CARNATION[100],
          200: IMPERMAX_CARNATION[200],
          300: IMPERMAX_CARNATION[300],
          400: IMPERMAX_CARNATION[400],
          DEFAULT: IMPERMAX_CARNATION[500],
          600: IMPERMAX_CARNATION[600],
          700: IMPERMAX_CARNATION[700],
          800: IMPERMAX_CARNATION[800],
          900: IMPERMAX_CARNATION[900]
        },
        impermaxAstral: {
          50: IMPERMAX_ASTRAL[50],
          100: IMPERMAX_ASTRAL[100],
          200: IMPERMAX_ASTRAL[200],
          300: IMPERMAX_ASTRAL[300],
          400: IMPERMAX_ASTRAL[400],
          DEFAULT: IMPERMAX_ASTRAL[500],
          600: IMPERMAX_ASTRAL[600],
          700: IMPERMAX_ASTRAL[700],
          800: IMPERMAX_ASTRAL[800],
          900: IMPERMAX_ASTRAL[900]
        },
        impermaxMercury: {
          50: IMPERMAX_MERCURY[50],
          100: IMPERMAX_MERCURY[100],
          200: IMPERMAX_MERCURY[200],
          300: IMPERMAX_MERCURY[300],
          400: IMPERMAX_MERCURY[400],
          DEFAULT: IMPERMAX_MERCURY[500],
          600: IMPERMAX_MERCURY[600],
          700: IMPERMAX_MERCURY[700],
          800: IMPERMAX_MERCURY[800],
          900: IMPERMAX_MERCURY[900]
        },
        impermaxMirage: {
          50: IMPERMAX_MIRAGE[50],
          100: IMPERMAX_MIRAGE[100],
          200: IMPERMAX_MIRAGE[200],
          300: IMPERMAX_MIRAGE[300],
          400: IMPERMAX_MIRAGE[400],
          DEFAULT: IMPERMAX_MIRAGE[500],
          600: IMPERMAX_MIRAGE[600],
          700: IMPERMAX_MIRAGE[700],
          800: IMPERMAX_MIRAGE[800],
          900: IMPERMAX_MIRAGE[900]
        },
        impermaxCornflower: {
          50: IMPERMAX_CORNFLOWER[50],
          100: IMPERMAX_CORNFLOWER[100],
          200: IMPERMAX_CORNFLOWER[200],
          300: IMPERMAX_CORNFLOWER[300],
          400: IMPERMAX_CORNFLOWER[400],
          DEFAULT: IMPERMAX_CORNFLOWER[500],
          600: IMPERMAX_CORNFLOWER[600],
          700: IMPERMAX_CORNFLOWER[700],
          800: IMPERMAX_CORNFLOWER[800],
          900: IMPERMAX_CORNFLOWER[900]
        },
        impermaxEmerald: {
          50: IMPERMAX_EMERALD[50],
          100: IMPERMAX_EMERALD[100],
          200: IMPERMAX_EMERALD[200],
          300: IMPERMAX_EMERALD[300],
          400: IMPERMAX_EMERALD[400],
          DEFAULT: IMPERMAX_EMERALD[500],
          600: IMPERMAX_EMERALD[600],
          700: IMPERMAX_EMERALD[700],
          800: IMPERMAX_EMERALD[800],
          900: IMPERMAX_EMERALD[900]
        },
        impermaxInchWorm: {
          50: IMPERMAX_INCH_WORM[50],
          100: IMPERMAX_INCH_WORM[100],
          200: IMPERMAX_INCH_WORM[200],
          300: IMPERMAX_INCH_WORM[300],
          400: IMPERMAX_INCH_WORM[400],
          DEFAULT: IMPERMAX_INCH_WORM[500],
          600: IMPERMAX_INCH_WORM[600],
          700: IMPERMAX_INCH_WORM[700],
          800: IMPERMAX_INCH_WORM[800],
          900: IMPERMAX_INCH_WORM[900]
        },
        impermaxGoldTips: {
          50: IMPERMAX_GOLD_TIPS[50],
          100: IMPERMAX_GOLD_TIPS[100],
          200: IMPERMAX_GOLD_TIPS[200],
          300: IMPERMAX_GOLD_TIPS[300],
          400: IMPERMAX_GOLD_TIPS[400],
          DEFAULT: IMPERMAX_GOLD_TIPS[500],
          600: IMPERMAX_GOLD_TIPS[600],
          700: IMPERMAX_GOLD_TIPS[700],
          800: IMPERMAX_GOLD_TIPS[800],
          900: IMPERMAX_GOLD_TIPS[900]
        },
        impermaxTreePoppy: {
          50: IMPERMAX_TREE_POPPY[50],
          100: IMPERMAX_TREE_POPPY[100],
          200: IMPERMAX_TREE_POPPY[200],
          300: IMPERMAX_TREE_POPPY[300],
          400: IMPERMAX_TREE_POPPY[400],
          DEFAULT: IMPERMAX_TREE_POPPY[500],
          600: IMPERMAX_TREE_POPPY[600],
          700: IMPERMAX_TREE_POPPY[700],
          800: IMPERMAX_TREE_POPPY[800],
          900: IMPERMAX_TREE_POPPY[900]
        },
        impermaxTrinidad: {
          50: IMPERMAX_TRINIDAD[50],
          100: IMPERMAX_TRINIDAD[100],
          200: IMPERMAX_TRINIDAD[200],
          300: IMPERMAX_TRINIDAD[300],
          400: IMPERMAX_TRINIDAD[400],
          DEFAULT: IMPERMAX_TRINIDAD[500],
          600: IMPERMAX_TRINIDAD[600],
          700: IMPERMAX_TRINIDAD[700],
          800: IMPERMAX_TRINIDAD[800],
          900: IMPERMAX_TRINIDAD[900]
        },
        impermaxMilanoRed: {
          50: IMPERMAX_MILANO_RED[50],
          100: IMPERMAX_MILANO_RED[100],
          200: IMPERMAX_MILANO_RED[200],
          300: IMPERMAX_MILANO_RED[300],
          400: IMPERMAX_MILANO_RED[400],
          DEFAULT: IMPERMAX_MILANO_RED[500],
          600: IMPERMAX_MILANO_RED[600],
          700: IMPERMAX_MILANO_RED[700],
          800: IMPERMAX_MILANO_RED[800],
          900: IMPERMAX_MILANO_RED[900]
        },
        primary: {
          50: IMPERMAX_JADE[50],
          100: IMPERMAX_JADE[100],
          200: IMPERMAX_JADE[200],
          300: IMPERMAX_JADE[300],
          400: IMPERMAX_JADE[400],
          DEFAULT: IMPERMAX_JADE[500],
          600: IMPERMAX_JADE[600],
          700: IMPERMAX_JADE[700],
          800: IMPERMAX_JADE[800],
          900: IMPERMAX_JADE[900]
        },
        secondary: {
          50: IMPERMAX_CARNATION[50],
          100: IMPERMAX_CARNATION[100],
          200: IMPERMAX_CARNATION[200],
          300: IMPERMAX_CARNATION[300],
          400: IMPERMAX_CARNATION[400],
          DEFAULT: IMPERMAX_CARNATION[500],
          600: IMPERMAX_CARNATION[600],
          700: IMPERMAX_CARNATION[700],
          800: IMPERMAX_CARNATION[800],
          900: IMPERMAX_CARNATION[900]
        }
      },
      backgroundColor: {
        default: IMPERMAX_BLACK_HAZE[500]
      },
      textColor: {
        textPrimary: colors.coolGray[900],
        textSecondary: colors.coolGray[500]
      },
      // MEMO: inspired by https://material-ui.com/customization/default-theme/
      zIndex: {
        impermaxMobileStepper: 1000,
        impermaxSpeedDial: 1050,
        impermaxAppBar: 1100,
        impermaxDrawer: 1200,
        impermaxModal: 1300,
        impermaxSnackbar: 1400,
        impermaxTooltip: 1500
      }
    }
  },
  variants: {
    extend: {
      borderRadius: [
        'first',
        'last'
      ],
      margin: ['important'],
      padding: ['important']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(function ({
      addBase,
      theme,
      addVariant
    }) {
      // MEMO: inspired by https://tailwindcss.com/docs/adding-base-styles#using-a-plugin
      addBase({
        body: {
          color: theme('textColor.textPrimary')
        }
      });

      // MEMO: inspired by https://github.com/tailwindlabs/tailwindcss/issues/493#issuecomment-610907147
      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls(decl => {
            decl.important = true;
          });
        });
      });
    })
  ]
};
