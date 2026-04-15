import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Card, CardContent, Box, Button,
  CircularProgress, Chip, Grid, Divider
} from '@mui/material';
import { creditService, farmerService } from '../api';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const ScoreResultPage = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();
  const [scoreData, setScoreData] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scoreRes, farmerRes, insightsRes] = await Promise.all([
          creditService.getScore(farmerId),
          farmerService.getById(farmerId),
          creditService.getAIInsights(farmerId).catch(() => ({
            data: { insights: 'AI Risk Analysis is briefly unavailable.' }
          }))
        ]);
        setScoreData(scoreRes.data);
        setFarmer(farmerRes.data);
        setAiInsights(insightsRes.data.insights);
      } catch {
        console.error('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farmerId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <CircularProgress size={48} thickness={4} color="primary" />
        <Typography sx={{ mt: 2, fontSize: '0.95rem', color: 'text.secondary' }}>Synthesizing Credit Profile...</Typography>
      </Box>
    );
  }

  if (!scoreData || !farmer) {
    return (
      <Container sx={{ mt: 12, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 700 }}>Profile Not Found</Typography>
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>The requested evaluation data could not be retrieved.</Typography>
        <Button variant="contained" size="small" onClick={() => navigate('/')}>Return to Home</Button>
      </Container>
    );
  }

  const scorePercentage = (scoreData.creditScore * 100).toFixed(0);
  const chartData = [
    { name: 'Score', value: scoreData.creditScore * 100 },
    { name: 'Remaining', value: 100 - scoreData.creditScore * 100 }
  ];

  const riskColor = scoreData.riskLevel === 'Low' ? '#2e7d32'
    : scoreData.riskLevel === 'Medium' ? '#ed6c02'
    : '#c62828';

  const verdictIcon = scoreData.eligibilityRecommendation === 'Approved'
    ? <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'success.main' }} />
    : scoreData.eligibilityRecommendation === 'Rejected'
    ? <CancelOutlinedIcon sx={{ fontSize: 20, color: 'error.main' }} />
    : <HourglassEmptyIcon sx={{ fontSize: 20, color: 'warning.main' }} />;

  const verdictColor = scoreData.eligibilityRecommendation === 'Approved' ? 'success.main'
    : scoreData.eligibilityRecommendation === 'Rejected' ? 'error.main'
    : 'warning.main';

  return (
    <Container maxWidth="lg" className="page-transition" sx={{ mt: 6, mb: 10 }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, fontSize: '0.7rem' }}>
          ASSESSMENT COMPLETE
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>Credit Evaluation</Typography>
        <Typography variant="body2" color="text.secondary">Report for <strong>{farmer.name}</strong></Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left: Score Gauge */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            {/* Circular SVG Ring */}
            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#e8e8e8" strokeWidth="10" />
                <circle
                  cx="80" cy="80" r="68"
                  fill="none"
                  stroke={riskColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 68 * (scoreData.creditScore)}, ${2 * Math.PI * 68}`}
                  strokeDashoffset={2 * Math.PI * 68 * 0.25}
                  transform="rotate(-90 80 80)"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <Box sx={{ position: 'absolute', textAlign: 'center' }}>
                <Typography sx={{ fontSize: '2.8rem', fontWeight: 900, color: riskColor, lineHeight: 1 }}>
                  {scorePercentage}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  Agri-Score
                </Typography>
              </Box>
            </Box>
            <Chip
              label={`${scoreData.riskLevel} Risk`}
              size="small"
              sx={{ fontWeight: 700, color: riskColor, bgcolor: riskColor + '18', border: `1px solid ${riskColor}40`, px: 1 }}
            />
          </Card>
        </Grid>

        {/* Right: Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Farmer Profile */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonOutlineIcon sx={{ color: 'primary.main', fontSize: 20, mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Farmer Profile</Typography>
              </Box>
              <Grid container spacing={1} sx={{ mb: 3 }}>
                {[
                  { l: 'Aadhaar', v: farmer.aadhaar },
                  { l: 'Crop', v: farmer.cropType },
                  { l: 'Land Size', v: `${farmer.landSize} Acres` },
                  { l: 'Avg Yield', v: `${farmer.yieldHistory} T/A` },
                  { l: 'Irrigation', v: farmer.irrigation ? 'Yes (Canal/Well)' : 'Rain-Fed' },
                  { l: 'Repayment', v: farmer.pastRepaymentHistory ? 'Good History' : 'Developing' },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{item.l}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{item.v}</Typography>
                    </Grid>
                    {idx < 5 && <Grid item xs={12}><Divider sx={{ opacity: 0.08 }} /></Grid>}
                  </React.Fragment>
                ))}
              </Grid>

              <Divider sx={{ mb: 2.5, opacity: 0.1 }} />

              {/* Verdict */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <CheckCircleOutlineIcon sx={{ color: 'primary.main', fontSize: 20, mr: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Final Verdict</Typography>
              </Box>
              <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: 1.5, borderRadius: 2,
                border: `1px solid`,
                borderColor: verdictColor,
                bgcolor: scoreData.eligibilityRecommendation === 'Approved' ? 'rgba(46,125,50,0.06)'
                  : scoreData.eligibilityRecommendation === 'Rejected' ? 'rgba(198,40,40,0.06)'
                  : 'rgba(237,108,2,0.06)',
                mb: 3
              }}>
                {verdictIcon}
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', lineHeight: 1 }}>Recommendation</Typography>
                  <Typography variant="subtitle2" sx={{ color: verdictColor, fontWeight: 800 }}>
                    {scoreData.eligibilityRecommendation}
                  </Typography>
                </Box>
              </Box>

              {/* Actions */}
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button variant="contained" size="small" onClick={() => navigate('/dashboard')} sx={{ px: 2.5, fontWeight: 700, fontSize: '0.8rem' }}>
                  Bank Dashboard
                </Button>
                <Button variant="outlined" size="small" onClick={() => navigate('/register')} sx={{ px: 2.5, fontWeight: 700, fontSize: '0.8rem' }}>
                  New Evaluation
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Insights */}
      {aiInsights && (
        <Card sx={{ mt: 4, p: 3, background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white', borderRadius: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoFixHighIcon sx={{ fontSize: 18, mr: 1, color: '#ffecb3' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>AI Strategic Insights</Typography>
          </Box>
          <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.12)' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8, opacity: 0.92, fontSize: '0.875rem' }}>
              {aiInsights}
            </Typography>
          </Box>
        </Card>
      )}
    </Container>
  );
};

export default ScoreResultPage;
