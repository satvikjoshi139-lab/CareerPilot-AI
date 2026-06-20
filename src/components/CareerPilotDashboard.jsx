import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, Avatar,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Badge, InputBase, Divider, Paper, useMediaQuery, useTheme,
  Tooltip, Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Psychology,
  Code,
  Forum,
  AltRoute,
  BarChart,
  Search,
  Notifications,
  Menu as MenuIcon,
  Close,
  SmartToy,
  LightMode,
  DarkMode,
} from '@mui/icons-material';

// ─── Sub-page components ───────────────────────────────────────────────────
import CareerDevelopmentDashboard from './CareerDevelopmentDashboard';
import AgentWorkflow from './AgentWorkflow';
import AnalyticsDashboard from './AnalyticsDashboard';

const DRAWER_WIDTH = 240;

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'skills', label: 'Skill Analysis', icon: <Psychology /> },
  { id: 'projects', label: 'Projects', icon: <Code /> },
  { id: 'interview', label: 'Interview Prep', icon: <Forum /> },
  { id: 'roadmap', label: 'Roadmap', icon: <AltRoute /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart /> },
  { id: 'agents', label: 'Agent Workflow', icon: <SmartToy /> },
];

const SidebarContent = ({ active, setActive, onClose }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    {/* Brand */}
    <Box
      sx={{
        px: 3, py: 2.5,
        background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
        display: 'flex', alignItems: 'center', gap: 1.5,
      }}
    >
      <SmartToy sx={{ color: 'white', fontSize: 28 }} />
      <Typography variant="h6" fontWeight={800} color="white">
        CareerPilot AI
      </Typography>
    </Box>

    <Divider />

    <List sx={{ flex: 1, px: 1, py: 1 }}>
      {navItems.map((item) => {
        const isActive = active === item.id;
        return (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => { setActive(item.id); onClose?.(); }}
              sx={{
                borderRadius: 3,
                px: 2,
                py: 1.2,
                background: isActive
                  ? 'linear-gradient(135deg,#4f46e5,#7c3aed)'
                  : 'transparent',
                color: isActive ? 'white' : 'text.primary',
                '&:hover': {
                  background: isActive
                    ? 'linear-gradient(135deg,#4338ca,#6d28d9)'
                    : 'rgba(79,70,229,0.08)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: isActive ? 700 : 500, fontSize: '0.9rem' }}
              />
              {isActive && (
                <Box
                  sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    bgcolor: 'white', flexShrink: 0,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>

    {/* Footer */}
    <Box sx={{ px: 2, pb: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: 2, borderRadius: 3,
          background: 'linear-gradient(135deg,#f0f0ff,#f5f3ff)',
          border: '1px solid #e0e7ff',
        }}
      >
        <Typography variant="caption" fontWeight={700} color="primary.main" display="block">
          Profile: B.Tech CSE
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Goal: SDE-1
        </Typography>
        <Box mt={1}>
          <Chip label="Career Score: 45%" size="small" color="primary" sx={{ fontWeight: 700 }} />
        </Box>
      </Paper>
    </Box>
  </Box>
);

const CareerPilotDashboard = ({ isDarkMode, toggleTheme }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [active, setActive] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = navItems.find((n) => n.id === active)?.label ?? 'Dashboard';

  const renderContent = () => {
    switch (active) {
      case 'analytics': return <AnalyticsDashboard />;
      case 'agents':   return <AgentWorkflow />;
      default:          return <CareerDevelopmentDashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ── Permanent sidebar (desktop) ── */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: '2px 0 12px rgba(0,0,0,0.06)',
            },
          }}
        >
          <SidebarContent active={active} setActive={setActive} />
        </Drawer>
      )}

      {/* ── Temporary drawer (mobile) ── */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setMobileOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <SidebarContent
            active={active}
            setActive={setActive}
            onClose={() => setMobileOpen(false)}
          />
        </Drawer>
      )}

      {/* ── Main area ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Navbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ gap: 2 }}>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" fontWeight={800} sx={{ flex: 0, whiteSpace: 'nowrap' }}>
              {activeLabel}
            </Typography>

            {/* Search */}
            <Paper
              elevation={0}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 2, py: 0.75, ml: 2, flex: 1, maxWidth: 420,
                bgcolor: 'action.hover', borderRadius: 3,
              }}
            >
              <Search sx={{ color: 'text.disabled', fontSize: 20 }} />
              <InputBase
                placeholder="Search skills, projects, topics…"
                sx={{ flex: 1, fontSize: '0.875rem' }}
              />
            </Paper>

            <Box sx={{ flex: 1 }} />

            {/* Theme toggle */}
            <Tooltip title={isDarkMode ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleTheme}>
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Avatar */}
            <Tooltip title="Rahul Sharma • B.Tech CSE">
              <Avatar
                sx={{
                  background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  width: 38, height: 38, cursor: 'pointer', fontWeight: 800,
                }}
              >
                R
              </Avatar>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflowY: 'auto' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default CareerPilotDashboard;
