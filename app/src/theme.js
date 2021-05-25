import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const PALETTE = {
  // App theme colors.
  primary: {
    light: '#29b1dc',
    main: '#0098C8',
    dark: '#006585',
    contrastText: '#FFFFFF',
  },
  secondary: {
    light: '#329EBF',
    main: '#148cb1',
    dark: '#006E90',
    contrastText: '#FFFFFF',
  },
  error: {
    light: '#EF9A9A',
    main: '#EF5350',
    dark: '#E53935',
    contrastText: '#FFFFFF',
  },
  warning: {
    light: '#FFCC80',
    main: '#FFA726',
    dark: '#FB8C00',
    contrastText: '#FFFFFF',
  },

  // Custom colors.
  common: {
    white: '#FFFFFF',
    black: '#000000',
    grey1: '#707070',
    grey2: '#979797',
    grey3: '#606060',
    grey4: '#4B4343',
    grey5: '#808080',
    grey6: '#989898',
    grey7: '#757575',
    grey8: '#C4C4C4',
    grey9: '#8D8D8D',
    grey10: '#363636',
    grey11: '#CDCDCD',
  },
  text: {
    primary: '#363636',
    secondary: '#707070',
    placeholder: '#BFBFBF',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    disabled: '#F7F7F7',
    content: '#F4F6F8',
    snackbar: 'rgba(0, 0, 0, 0.95)',
    chip: '#F7F7F7',
    tooltip: '#383838',
    stickyHeader: '#F7F7F7',
    stickyFooter: '#FFFFFF',
    menuItem: 'rgba(0, 152, 200, 0.1)',
    formSectionHeader: '#F8FAFC',
    error: 'rgba(198,61,67,0.25)'
  },
  shadow: {
    popper: 'rgba(0, 0, 0, 0.25)',
    drawer: 'rgba(0, 0, 0, 0.5)',
    snackbar: 'rgba(54, 54, 54, 0.15)',
    stickyHeader: '#BFBFBF',
    stickyFooter: '#BFBFBF',
    networkToggle: 'rgba(0, 0, 0, 0.1)',
    networkCard: 'rgba(103, 103, 103, 0.25)',
    networkCardSelected: 'rgba(0, 152, 200, 0.5)',
    pane: 'rgba(0, 0, 0, 0.05)',
    cardBorder: 'rgba(103, 103, 103, 0.25)',
  },
  border: {
    input: '#DDDDDD',
    card: '#E4E6E8',
    appBar: '#F1F1F1',
    checkbox: '#D2D2D2',
    table: 'rgba(37, 110, 216, 0.1)',
    pane: '#E4E6E8',
  },
  status: {
    active: '#70CD7C',
    inactive: 'rgb(204, 204, 204)',
    pending: '#3983C5',
    ready: '#48C2D1',
    complete: '#B2E2B8',
    archived: '#784C34'
  }
};

const TYPOGRAPHY = {
  defaultFontStyles: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    color: PALETTE.text.primary,
    lineHeight: '140%',
  }
}

export const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200
    }
  },
  palette: PALETTE,
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Nunito',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    body1: {
      ...TYPOGRAPHY.defaultFontStyles,
    },
    body2: {
      ...TYPOGRAPHY.defaultFontStyles,
      fontSize: '12px'
    },
    subtitle1: {
      ...TYPOGRAPHY.defaultFontStyles,
      color: PALETTE.text.secondary,
    },
    subtitle2: {
      ...TYPOGRAPHY.defaultFontStyles,
      fontWeight: 600,
      fontSize: '12px',
      color: PALETTE.text.secondary,
    },
    overline: {
      fontStyle: 'normal',
      fontWeight: 600,
      letterSpacing: 'normal',
      textTransform: 'none',
      fontSize: '12px',
      color: PALETTE.text.secondary,
      lineHeight: '140%',
      paddingBottom: '2px',
      '&:hover': {
        textTransform: 'none',
      },
    },
    caption: {
      ...TYPOGRAPHY.defaultFontStyles,
      letterSpacing: 'normal',
      fontSize: '11px',
      color: PALETTE.text.secondary,
    },
    button: {
      ...TYPOGRAPHY.defaultFontStyles,
      fontWeight: 600,
      letterSpacing: '0.16px',
      textTransform: 'none',
      fontSize: '12px',
    },
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1.0625rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
  },
  overrides: {
    MuiFormControl: {
      root: {
        width: '100%',
        '& .MuiOutlinedInput-root': {
          '& .MuiOutlinedInput-input': {
            padding: '16px 8px'
          },
        },
      },
    },
    MuiButton: {
      root: {
        height: '40px',
        borderRadius: '6px',
      },
      contained: {
        boxShadow: 'none',
      },
    },
    MuiTableCell: {
      head: {
        fontWeight: 700,
      },
    }
  },
});
