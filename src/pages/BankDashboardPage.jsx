import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Chip, CircularProgress, Box, Tooltip,
  IconButton, Paper
} from '@mui/material';
import { farmerService, creditService } from '../api';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';

const BankDashboardPage = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchFarmersAndScores = async () => {
    setRefreshing(true);
    try {
      const res = await farmerService.getAll();
      const populated = await Promise.all(
        res.data.map(async (farmer) => {
          try {
            const scoreRes = await creditService.getScore(farmer.farmerId);
            return { ...farmer, creditScoreData: scoreRes.data };
          } catch {
            return { ...farmer, creditScoreData: null };
          }
        })
      );
      setFarmers(populated);
    } catch (error) {
      console.error('Error fetching farmers', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchFarmersAndScores(); }, []);

  const handleDecision = async (farmerId, decision) => {
    try {
      await creditService.updateDecision(farmerId, decision);
      fetchFarmersAndScores();
    } catch (error) {
      console.error('Error updating decision', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: 2 }}>
        <CircularProgress size={36} color="primary" />
        <Typography variant="body2" color="text.secondary">Loading Applications...</Typography>
      </Box>
    );
  }

  const statusColor = (rec) => {
    if (rec === 'Approved') return 'success.main';
    if (rec === 'Rejected') return 'error.main';
    return 'warning.main';
  };

  const riskChipColor = (level) => {
    if (level === 'Low') return { color: '#2e7d32', bg: '#e8f5e9' };
    if (level === 'Medium') return { color: '#e65100', bg: '#fff3e0' };
    return { color: '#c62828', bg: '#ffebee' };
  };

  const scoreColor = (score) => {
    if (score >= 0.7) return '#2e7d32';
    if (score >= 0.5) return '#ed6c02';
    return '#c62828';
  };

  return (
    <Container maxWidth="xl" className="page-transition" sx={{ mt: 6, mb: 10 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.7rem', letterSpacing: 2 }}>
            OFFICER CONSOLE
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>Bank Dashboard</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Unified view of alternative credit assessments and application status.
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <IconButton
            onClick={fetchFarmersAndScores}
            disabled={refreshing}
            size="small"
            sx={{ mt: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1 }}
          >
            <RefreshIcon fontSize="small" sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              {['Farmer Name', 'Commodity', 'Yield Info', 'Agri-Score', 'Risk Profile', 'Status', 'Decisions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.8, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {farmers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="body2" color="text.secondary">No farmer applications found.</Typography>
                  <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={() => navigate('/register')}>Register Farmer</Button>
                </TableCell>
              </TableRow>
            ) : farmers.map((row) => {
              const sc = row.creditScoreData;
              const rc = sc ? riskChipColor(sc.riskLevel) : null;
              return (
                <TableRow key={row.farmerId} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.018)' }, '&:last-child td': { borderBottom: 0 } }}>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{row.name}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>{row.aadhaar}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.cropType}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.landSize} Acres</Typography>
                    <Typography variant="caption" color="text.secondary">{row.yieldHistory} T/Acre Avg</Typography>
                  </TableCell>
                  <TableCell>
                    {sc ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ position: 'relative', display: 'inline-flex', width: 32, height: 32 }}>
                          <svg width="32" height="32" viewBox="0 0 32 32">
                            <circle cx="16" cy="16" r="13" fill="none" stroke="#e0e0e0" strokeWidth="3" />
                            <circle
                              cx="16" cy="16" r="13"
                              fill="none"
                              stroke={scoreColor(sc.creditScore)}
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 13 * sc.creditScore} ${2 * Math.PI * 13}`}
                              transform="rotate(-90 16 16)"
                            />
                          </svg>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: scoreColor(sc.creditScore) }}>
                          {(sc.creditScore * 100).toFixed(0)}
                        </Typography>
                      </Box>
                    ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                  </TableCell>
                  <TableCell>
                    {sc ? (
                      <Chip label={sc.riskLevel} size="small" sx={{ fontWeight: 700, fontSize: '0.72rem', color: rc.color, bgcolor: rc.bg, border: 'none', height: 22 }} />
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    {sc ? (
                      <Typography variant="body2" sx={{ fontWeight: 700, color: statusColor(sc.eligibilityRecommendation) }}>
                        {sc.eligibilityRecommendation}
                      </Typography>
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.75, alignItems: 'center' }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => navigate(`/score/${row.farmerId}`)} sx={{ color: 'primary.main', p: 0.5 }}>
                          <VisibilityIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                      {sc && (
                        <>
                          <Button
                            size="small"
                            variant={sc.eligibilityRecommendation === 'Approved' ? 'contained' : 'outlined'}
                            color="success"
                            onClick={() => handleDecision(row.farmerId, 'Approved')}
                            sx={{ fontWeight: 700, fontSize: '0.7rem', px: 1.2, py: 0.3, minWidth: 'auto', textTransform: 'none', height: 26 }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant={sc.eligibilityRecommendation === 'Rejected' ? 'contained' : 'outlined'}
                            color="error"
                            onClick={() => handleDecision(row.farmerId, 'Rejected')}
                            sx={{ fontWeight: 700, fontSize: '0.7rem', px: 1.2, py: 0.3, minWidth: 'auto', textTransform: 'none', height: 26 }}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Container>
  );
};

export default BankDashboardPage;
