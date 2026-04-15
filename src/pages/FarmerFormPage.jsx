import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, MenuItem, Box, Card, CircularProgress, Divider, InputAdornment } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { farmerService, creditService } from '../api';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import GrassIcon from '@mui/icons-material/Grass';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  aadhaar: Yup.string().length(12, 'Must be exactly 12 digits').required('Required'),
  landSize: Yup.number().min(0.1, 'Min 0.1 acres').required('Required'),
  cropType: Yup.string().required('Required'),
  irrigation: Yup.boolean().required('Required'),
  yieldHistory: Yup.number().min(0, 'Must be positive').required('Required'),
  marketTrendScore: Yup.number().min(0).max(1).required('Required (0 to 1)'),
  weatherRiskScore: Yup.number().min(0).max(1).required('Required (0 to 1)'),
  pastRepaymentHistory: Yup.boolean().required('Required'),
});

const FarmerFormPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      aadhaar: '',
      landSize: '',
      cropType: '',
      irrigation: false,
      yieldHistory: '',
      marketTrendScore: 0.5,
      weatherRiskScore: 0.5,
      pastRepaymentHistory: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await farmerService.register(values);
        const farmerId = res.data.farmerId;
        await creditService.calculateScore(farmerId);
        navigate(`/score/${farmerId}`);
      } catch (error) {
        console.error("Error registering farmer", error);
        let errorMessage = "Unknown error occurred";
        
        if (error.response) {
          // Server responded with a status code
          const data = error.response.data;
          errorMessage = data.message || data.error || (typeof data === 'string' ? data : JSON.stringify(data));
        } else if (error.request) {
          // Request made but no response received (Network Error)
          errorMessage = "Network Error: Cannot reach the backend server. Is it running?";
        } else {
          errorMessage = error.message;
        }

        alert(`Failed to register farmer: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container maxWidth="md" className="page-transition" sx={{ mt: 8, mb: 12 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2 }}>REGISTRATION</Typography>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 800, mt: 1 }}>Farmer Evaluation</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
          Comprehensive agricultural assessment for digital credit scoring.
        </Typography>
      </Box>

      <Card sx={{ p: { xs: 4, md: 8 }, borderRadius: 8, overflow: 'visible' }}>
        <form onSubmit={formik.handleSubmit}>
          {/* Section 1 */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <PersonOutlineIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Personal Identity</Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth id="name" name="name" label="Full Legal Name" 
                  placeholder="e.g. Ramesh Kumar"
                  value={formik.values.name} onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth id="aadhaar" name="aadhaar" label="Aadhaar ID" 
                  placeholder="12-digit number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FingerprintIcon sx={{ fontSize: 20, opacity: 0.5 }} />
                      </InputAdornment>
                    ),
                  }}
                  value={formik.values.aadhaar} onChange={formik.handleChange}
                  error={formik.touched.aadhaar && Boolean(formik.errors.aadhaar)}
                  helperText={formik.touched.aadhaar && formik.errors.aadhaar} 
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 6, opacity: 0.1 }} />

          {/* Section 2 */}
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <GrassIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Agricultural Footprint</Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth id="landSize" name="landSize" label="Total Land Area" 
                  type="number" InputProps={{ endAdornment: <InputAdornment position="end">Acres</InputAdornment> }}
                  value={formik.values.landSize} onChange={formik.handleChange}
                  error={formik.touched.landSize && Boolean(formik.errors.landSize)}
                  helperText={formik.touched.landSize && formik.errors.landSize} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth id="cropType" name="cropType" label="Primary Commodity" 
                  placeholder="e.g. Rice, Wheat"
                  value={formik.values.cropType} onChange={formik.handleChange}
                  error={formik.touched.cropType && Boolean(formik.errors.cropType)}
                  helperText={formik.touched.cropType && formik.errors.cropType} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth select id="irrigation" name="irrigation" label="Irrigation Capability"
                  value={formik.values.irrigation} onChange={formik.handleChange}
                  error={formik.touched.irrigation && Boolean(formik.errors.irrigation)}
                >
                  <MenuItem value={true}>Reliable Access (Canal/Well)</MenuItem>
                  <MenuItem value={false}>Rain-Fed Only</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth id="yieldHistory" name="yieldHistory" label="Avg. Productivity" 
                  type="number" InputProps={{ endAdornment: <InputAdornment position="end">T/Acre</InputAdornment> }}
                  value={formik.values.yieldHistory} onChange={formik.handleChange}
                  error={formik.touched.yieldHistory && Boolean(formik.errors.yieldHistory)}
                  helperText={formik.touched.yieldHistory && formik.errors.yieldHistory} 
                />
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ mb: 6, opacity: 0.1 }} />

          {/* Section 3 */}
          <Box sx={{ mb: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AssessmentIcon sx={{ mr: 2, color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Risk Parameters</Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth id="marketTrendScore" name="marketTrendScore" label="Market Viability" 
                  type="number" inputProps={{ step: "0.1" }}
                  helperText="0.0 (Poor) to 1.0 (Excellent)"
                  value={formik.values.marketTrendScore} onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth id="weatherRiskScore" name="weatherRiskScore" label="Ecological Resilience" 
                  type="number" inputProps={{ step: "0.1" }}
                  helperText="1.0 = High Resilience to Weather"
                  value={formik.values.weatherRiskScore} onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth select id="pastRepaymentHistory" name="pastRepaymentHistory" label="Credit Credibility"
                  value={formik.values.pastRepaymentHistory} onChange={formik.handleChange}
                >
                  <MenuItem value={true}>Established Good History</MenuItem>
                  <MenuItem value={false}>Developing History / None</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              color="primary" variant="contained" type="submit" size="large" 
              disabled={loading} 
              sx={{ minWidth: 280, py: 2, fontSize: '1.2rem', borderRadius: 4 }}
            >
              {loading ? <CircularProgress size={28} color="inherit" /> : 'Generate Assessment'}
            </Button>
          </Box>
        </form>
      </Card>
    </Container>
  );
};

export default FarmerFormPage;

