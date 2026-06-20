import React from 'react';
import {
  Box, Card, CardContent, Typography, Stack, Chip, Grid, Paper, LinearProgress,
} from '@mui/material';
import {
  TrendingUp, Psychology, CheckCircle, EmojiEvents,
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, Cell,
} from 'recharts';

const careerGrowthData = [
  { month: 'Jan', score: 20 },
  { month: 'Feb', score: 28 },
  { month: 'Mar', score: 35 },
  { month: 'Apr', score: 40 },
  { month: 'May', score: 45 },
  { month: 'Jun', score: 55 },
  { month: 'Jul', score: 62 },
];

const skillData = [
  { subject: 'Java', value: 65 },
  { subject: 'DSA', value: 40 },
  { subject: 'Spring', value: 30 },
  { subject: 'SQL', value: 75 },
  { subject: 'System Design', value: 25 },
  { subject: 'Git', value: 80 },
];

const roadmapData = [
  { month: 'Month 1', completion: 100 },
  { month: 'Month 2', completion: 60 },
  { month: 'Month 3', completion: 25 },
  { month: 'Month 4', completion: 0 },
];

const kpis = [
  {
    label: 'Career Score',
    value: 45,
    max: 100,
    icon: <EmojiEvents />,
    color: '#4f46e5',
    bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
    suffix: '%',
  },
  {
    label: 'Skill Progress',
    value: 35,
    max: 100,
    icon: <Psychology />,
    color: '#059669',
    bg: 'linear-gradient(135deg,#059669,#10b981)',
    suffix: '%',
  },
  {
    label: 'Interview Readiness',
    value: 40,
    max: 100,
    icon: <TrendingUp />,
    color: '#d97706',
    bg: 'linear-gradient(135deg,#d97706,#f59e0b)',
    suffix: '%',
  },
  {
    label: 'Roadmap Completion',
    value: 20,
    max: 100,
    icon: <CheckCircle />,
    color: '#0891b2',
    bg: 'linear-gradient(135deg,#0891b2,#06b6d4)',
    suffix: '%',
  },
];

const CircularKPI = ({ value, max, color, size = 80 }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (value / max) * circumference;

  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={8} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" fontWeight={800} sx={{ fontSize: size > 70 ? '0.9rem' : '0.7rem' }}>
          {value}%
        </Typography>
      </Box>
    </Box>
  );
};

const AnalyticsDashboard = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 2 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg,#0f172a 0%,#1e293b 60%,#334155 100%)',
          color: 'white',
        }}
      >
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Career Analytics Dashboard
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.75 }}>
          Real-time metrics tracking your progress toward SDE-1 readiness.
        </Typography>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={2.5}>
        {kpis.map((kpi) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.label}>
            <Card
              sx={{
                borderRadius: 4,
                height: '100%',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': { transform: 'translateY(-6px)', boxShadow: 8 },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box
                    sx={{
                      background: kpi.bg,
                      borderRadius: 2,
                      p: 1,
                      color: 'white',
                      display: 'flex',
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <CircularKPI value={kpi.value} max={kpi.max} color={kpi.color} size={64} />
                </Stack>
                <Typography variant="h4" fontWeight={800} sx={{ color: kpi.color, lineHeight: 1 }}>
                  {kpi.value}{kpi.suffix}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5} fontWeight={600}>
                  {kpi.label}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={kpi.value}
                  sx={{
                    mt: 1.5, height: 6, borderRadius: 4,
                    '& .MuiLinearProgress-bar': { background: kpi.bg, borderRadius: 4 },
                    backgroundColor: '#f1f5f9',
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3}>
        {/* Career Growth Trend */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight={800}>Career Growth Trend</Typography>
                <Chip label="Last 7 months" size="small" variant="outlined" />
              </Stack>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={careerGrowthData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                    formatter={(val) => [`${val}%`, 'Career Score']}
                  />
                  <Area
                    type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3}
                    fill="url(#colorScore)" dot={{ fill: '#4f46e5', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Development Radar */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 4, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={800} mb={2}>Skill Development</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={skillData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <Radar
                    name="Score" dataKey="value" stroke="#059669" fill="#059669" fillOpacity={0.25}
                    strokeWidth={2}
                  />
                  <Tooltip formatter={(val) => [`${val}%`, 'Skill Level']} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Roadmap Completion Bar Chart */}
      <Card sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={800}>Roadmap Completion</Typography>
            <Chip label="4-Month Plan" size="small" color="primary" />
          </Stack>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={roadmapData} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} unit="%" />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Completion']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
              />
              <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
                {roadmapData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      entry.completion === 100 ? '#10b981' :
                      entry.completion >= 50 ? '#4f46e5' :
                      entry.completion > 0 ? '#f59e0b' : '#e5e7eb'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Progress bars legend */}
          <Stack spacing={1.5} mt={2}>
            {roadmapData.map((item) => (
              <Stack key={item.month} direction="row" spacing={2} alignItems="center">
                <Typography variant="body2" fontWeight={600} sx={{ minWidth: 80, color: 'text.secondary' }}>
                  {item.month}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={item.completion}
                  sx={{
                    flex: 1, height: 8, borderRadius: 4,
                    backgroundColor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background:
                        item.completion === 100 ? 'linear-gradient(90deg,#059669,#10b981)' :
                        item.completion >= 50 ? 'linear-gradient(90deg,#4f46e5,#7c3aed)' :
                        item.completion > 0 ? 'linear-gradient(90deg,#d97706,#f59e0b)' : '#e5e7eb',
                    },
                  }}
                />
                <Typography variant="body2" fontWeight={700} sx={{ minWidth: 36 }}>
                  {item.completion}%
                </Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnalyticsDashboard;
