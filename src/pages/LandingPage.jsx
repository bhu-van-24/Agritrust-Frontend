import React from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Fade, Zoom } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloudIcon from '@mui/icons-material/Cloud';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InsightsIcon from '@mui/icons-material/Insights';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box className="page-transition" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, #f4f7f5 0%, #e8f5e9 100%)',
        pt: { xs: 12, md: 20 },
        pb: { xs: 10, md: 15 },
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(39, 78, 19, 0.05) 0%, transparent 70%)',
          zIndex: 0
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
            <Fade in={true} timeout={800}>
              <Typography variant="h1" gutterBottom sx={{
                mb: 3,
                fontSize: { xs: '2.8rem', md: '4.5rem' },
                background: 'linear-gradient(45deg, #274e13, #4c8c4a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Bridging the Gap in <br />Agricultural Finance
              </Typography>
            </Fade>
            
            <Fade in={true} timeout={1200}>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 6, lineHeight: 1.6, maxWidth: 700, mx: 'auto' }}>
                AgriCredit leverages alternative data and AI to provide fair, accurate, and instant credit scoring for India's farmers.
              </Typography>
            </Fade>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Zoom in={true} style={{ transitionDelay: '500ms' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  startIcon={<CalculateIcon />}
                  sx={{ 
                    py: 2, 
                    px: 5, 
                    fontSize: '1.15rem',
                    boxShadow: '0 10px 30px rgba(39, 78, 19, 0.25)' 
                  }}
                >
                  Evaluate Farmer
                </Button>
              </Zoom>
              <Zoom in={true} style={{ transitionDelay: '700ms' }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  startIcon={<AccountBalanceIcon />}
                  sx={{ 
                    py: 2, 
                    px: 5, 
                    fontSize: '1.15rem',
                    borderWidth: 2,
                    borderColor: 'primary.main',
                    background: 'rgba(255,255,255,0.4)',
                    '&:hover': { borderWidth: 2, background: 'rgba(255,255,255,0.8)' }
                  }}
                >
                  Bank Dashboard
                </Button>
              </Zoom>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats/Badge Section */}
      <Container maxWidth="lg" sx={{ mt: -5, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={3} justifyContent="center">
          {[
            { label: 'Alternative Data Points', value: '15+', icon: <InsightsIcon /> },
            { label: 'Instant Scoring', value: '< 2m', icon: <TrendingUpIcon /> },
            { label: 'Secure & Compliant', value: 'ISO', icon: <SecurityIcon /> }
          ].map((stat, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Card sx={{ 
                p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                backgroundColor: 'rgba(255,255,255,0.9)', 
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.5)'
              }}>
                <Box sx={{ color: 'primary.main', display: 'flex' }}>{stat.icon}</Box>
                <Box>
                  <Typography variant="h6" sx={{ lineHeight: 1 }}>{stat.value}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{stat.label}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 15, flexGrow: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 3 }}>FEATURES</Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>Next-Gen Credit Intelligence</Typography>
        </Box>

        <Grid container spacing={5}>
          {[
            { 
              title: "Non-Traditional Data", 
              desc: "We analyze soil quality, crop yield history, and satellite weather data to understand true farming potential beyond just financial statements.",
              icon: <CloudIcon sx={{ fontSize: 40 }} />,
              color: 'rgba(39, 78, 19, 0.1)'
            },
            { 
              title: "AI Risk Assessment", 
              desc: "Our proprietary AI engine processes thousands of data points to generate high-confidence risk profiles and eligibility recommendations.",
              icon: <CalculateIcon sx={{ fontSize: 40 }} />,
              color: 'rgba(150, 75, 0, 0.1)'
            },
            { 
              title: "Smart Bank Integration", 
              desc: "Seamless dashboard for bank officers to manage applications, view real-time scores, and fast-track loan approvals for rural populations.",
              icon: <AccountBalanceIcon sx={{ fontSize: 40 }} />,
              color: 'rgba(39, 78, 19, 0.1)'
            }
          ].map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card sx={{ 
                height: '100%', 
                p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                borderRadius: 6,
                '&:hover': {
                  '& .icon-box': { transform: 'scale(1.1) rotate(5deg)' }
                }
              }}>
                <Box className="icon-box" sx={{
                  backgroundColor: feature.color,
                  p: 2.5,
                  borderRadius: 5,
                  mb: 4,
                  width: 'fit-content',
                  color: idx === 1 ? 'secondary.main' : 'primary.main',
                  transition: 'transform 0.3s ease'
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>{feature.title}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {feature.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingPage;

