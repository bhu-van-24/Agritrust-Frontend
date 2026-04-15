import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#274e13', // Deep Forest Green
      light: '#4c8c4a',
      dark: '#0d2b04',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#964b00', // Earthy Soil Brown
      light: '#be6b2e',
      dark: '#5d2906',
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#ffb300', // Harvest Gold
    },
    background: {
      default: '#f4f7f5', // Soft Mint Grey
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1a1c1a',
      secondary: '#4b4d4b',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#f9a825',
    },
    error: {
      main: '#c62828',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Plus Jakarta Sans", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      fontSize: '3.5rem',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 28px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(39, 78, 19, 0.2)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #274e13 0%, #4c8c4a 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1e3d0f 0%, #3e743c 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
          borderRadius: 24,
          border: '1px solid rgba(0,0,0,0.04)',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
          }
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 14,
            backgroundColor: '#fff',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'rgba(0,0,0,0.1)',
            },
            '&:hover fieldset': {
              borderColor: '#274e13',
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          color: '#274e13',
          boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
        }
      }
    }
  },
});

export default theme;

