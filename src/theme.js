import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', 
    primary: {
      main: '#7c4dff', 
    },
    secondary: {
      main: '#00e5ff',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e', 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: '0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(124, 77, 255, 0.4)', // Sombra morada al pasar ratón
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 'bold' },
      },
    },
  },
});

export default theme;