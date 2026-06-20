import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  LinearProgress,
  Divider,
  Paper,
} from '@mui/material';

import {
  ExpandMore,
  Code,
  Storage,
  BugReport,
  Architecture,
  GitHub,
  Assignment,
  Timer,
  TrendingUp,
  WorkspacePremium,
  Psychology,
  RocketLaunch,
} from '@mui/icons-material';

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';

const CareerDevelopmentDashboard = () => {
  const careerScore = 45;

  const [expanded, setExpanded] = useState('month1');

  const handleAccordion = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getLevel = (score) => {
    if (score <= 30)
      return {
        label: 'Beginner',
        color: '#ef4444',
      };

    if (score <= 60)
      return {
        label: 'Developing',
        color: '#f59e0b',
      };

    if (score <= 80)
      return {
        label: 'Job Ready',
        color: '#3b82f6',
      };

    return {
      label: 'Interview Ready',
      color: '#10b981',
    };
  };

  const levelInfo = getLevel(careerScore);

  const skillsData = [
    {
      category: 'Algorithms',
      priority: 'High',
      icon: <Code />,
      skills: [
        'Data Structures',
        'Algorithms',
        'Problem Solving',
        'Complexity Analysis',
      ],
    },

    {
      category: 'Backend Development',
      priority: 'High',
      icon: <Storage />,
      skills: [
        'Spring Boot',
        'REST APIs',
        'Hibernate',
        'JPA',
      ],
    },

    {
      category: 'Testing',
      priority: 'Medium',
      icon: <BugReport />,
      skills: [
        'JUnit',
        'Mockito',
      ],
    },

    {
      category: 'System Design',
      priority: 'Medium',
      icon: <Architecture />,
      skills: [
        'Scalability',
        'Caching',
        'Load Balancing',
      ],
    },

    {
      category: 'Version Control',
      priority: 'Low',
      icon: <GitHub />,
      skills: [
        'Git',
        'GitHub Workflow',
      ],
    },
  ];

  const projects = [
    {
      title: 'E-Commerce Backend',
      difficulty: 'Advanced',
      duration: '6 Weeks',
      technologies: [
        'Spring Boot',
        'JWT',
        'MySQL',
        'Hibernate',
      ],
      value: 'Excellent',
    },

    {
      title: 'Student Management System',
      difficulty: 'Intermediate',
      duration: '3 Weeks',
      technologies: [
        'Java',
        'Spring Boot',
        'REST API',
      ],
      value: 'High',
    },

    {
      title: 'Multi-threaded Web Crawler',
      difficulty: 'Advanced',
      duration: '4 Weeks',
      technologies: [
        'Java Concurrency',
        'Networking',
        'Collections',
      ],
      value: 'Excellent',
    },
  ];

  const roadmap = [
    {
      id: 'month1',
      month: 'Month 1',
      title: 'Data Structures & Algorithms',
      description:
        'Arrays, Linked Lists, Trees, Graphs, Dynamic Programming and LeetCode practice.',
    },

    {
      id: 'month2',
      month: 'Month 2',
      title: 'Spring Boot Ecosystem',
      description:
        'Spring Boot, Security, Dependency Injection, Validation and REST Architecture.',
    },

    {
      id: 'month3',
      month: 'Month 3',
      title: 'Portfolio Projects & Git',
      description:
        'Build production-grade backend projects and master Git workflows.',
    },

    {
      id: 'month4',
      month: 'Month 4',
      title: 'System Design & Mock Interviews',
      description:
        'Scalable architectures, caching strategies, mock interviews and hiring preparation.',
    },
  ];

  const priorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';

      case 'Medium':
        return 'warning';

      default:
        return 'success';
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {/* HEADER */}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background:
            'linear-gradient(135deg,#4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          color: 'white',
        }}
      >
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          justifyContent="space-between"
          alignItems={{
            xs: 'flex-start',
            md: 'center',
          }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
            >
              Career Development Intelligence
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mt: 1,
                opacity: 0.9,
              }}
            >
              AI-powered roadmap to become interview ready.
            </Typography>
          </Box>

          <Chip
            icon={<RocketLaunch />}
            label="AI Career Planner"
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 700,
            }}
          />
        </Stack>
      </Paper>

      {/* INTERVIEW READINESS */}

      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
            }}
          >
            <CardContent
              sx={{
                textAlign: 'center',
                py: 4,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
              >
                Interview Readiness
              </Typography>

              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  my: 3,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={careerScore}
                  size={140}
                  thickness={5}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                  >
                    {careerScore}%
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={levelInfo.label}
                sx={{
                  bgcolor: levelInfo.color,
                  color: 'white',
                  fontWeight: 700,
                }}
              />

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="subtitle2"
                gutterBottom
              >
                Overall Progress
              </Typography>

              <LinearProgress
                variant="determinate"
                value={careerScore}
                sx={{
                  height: 10,
                  borderRadius: 10,
                }}
              />
                            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Current Level: {levelInfo.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* AREAS TO IMPROVE */}

        <Grid
          item
          xs={12}
          md={8}
        >
          <Card
            sx={{
              borderRadius: 4,
              height: '100%',
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                mb={2}
              >
                <Psychology color="primary" />
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  AI Improvement Areas
                </Typography>
              </Stack>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >
                {[
                  'DSA Problem Solving',
                  'Spring Boot',
                  'REST APIs',
                  'System Design',
                ].map((item) => (
                  <Chip
                    key={item}
                    color="warning"
                    label={item}
                  />
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="subtitle1"
                fontWeight={700}
                gutterBottom
              >
                Recommended Interview Topics
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
              >
                {[
                  'Arrays',
                  'Linked Lists',
                  'Trees',
                  'Spring Security',
                  'Microservices',
                  'Database Optimization',
                ].map((topic) => (
                  <Chip
                    key={topic}
                    variant="outlined"
                    label={topic}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* SKILLS ANALYSIS */}

      <Box>
        <Typography
          variant="h5"
          fontWeight={800}
          mb={3}
        >
          Missing Skills Analysis
        </Typography>

        <Grid
          container
          spacing={3}
        >
          {skillsData.map((section) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={section.category}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all .3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                      }}
                    >
                      {section.icon}
                    </Avatar>

                    <Chip
                      label={section.priority}
                      color={priorityColor(section.priority)}
                    />
                  </Stack>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                  >
                    {section.category}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                  >
                    {section.skills.map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* PROJECTS */}

      <Box>
        <Typography
          variant="h5"
          fontWeight={800}
          mb={3}
        >
          Recommended Projects
        </Typography>

        <Grid
          container
          spacing={3}
        >
          {projects.map((project) => (
            <Grid
              item
              xs={12}
              md={4}
              key={project.title}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all .3s ease',
                  display: 'flex',
                  flexDirection: 'column',

                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 10,
                  },
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Chip
                      label={project.difficulty}
                      color={
                        project.difficulty === 'Advanced'
                          ? 'error'
                          : 'primary'
                      }
                    />

                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Timer
                        fontSize="small"
                        color="action"
                      />

                      <Typography variant="body2">
                        {project.duration}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                  >
                    {project.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Technologies Used
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    mb={3}
                  >
                    {project.technologies.map((tech) => (
                      <Chip
                        key={tech}
                        size="small"
                        label={tech}
                      />
                    ))}
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <WorkspacePremium color="success" />

                    <Typography>
                      Resume Value:
                      <strong>
                        {' '}
                        {project.value}
                      </strong>
                    </Typography>
                  </Stack>
                </CardContent>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Assignment />}
                >
                  View Details
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
            {/* LEARNING ROADMAP */}

      <Box>
        <Typography
          variant="h5"
          fontWeight={800}
          mb={3}
        >
          Learning Roadmap Timeline
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 4,
          }}
        >
          <Timeline position="alternate">
            {roadmap.map((item, index) => (
              <TimelineItem key={item.id}>
                <TimelineOppositeContent
                  sx={{
                    m: 'auto 0',
                  }}
                  color="text.secondary"
                >
                  {item.month}
                </TimelineOppositeContent>

                <TimelineSeparator>
                  {index !== 0 && <TimelineConnector />}

                  <TimelineDot color="primary">
                    <TrendingUp />
                  </TimelineDot>

                  {index !== roadmap.length - 1 && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>

                <TimelineContent>
                  <Accordion
                    expanded={expanded === item.id}
                    onChange={handleAccordion(item.id)}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                    >
                      <Typography
                        fontWeight={700}
                      >
                        {item.title}
                      </Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.description}
                      </Typography>

                      <Box mt={3}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                        >
                          Completion Progress
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={
                            index === 0
                              ? 100
                              : index === 1
                              ? 60
                              : index === 2
                              ? 25
                              : 0
                          }
                          sx={{
                            height: 10,
                            borderRadius: 10,
                          }}
                        />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Paper>
      </Box>

      {/* FOOTER */}

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background:
            'linear-gradient(135deg,#111827,#1f2937)',
          color: 'white',
        }}
      >
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
            md={6}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
            >
              CareerPilot AI Insights
            </Typography>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
              }}
            >
              Your current readiness score indicates
              strong potential. Prioritize DSA,
              Spring Boot, and System Design to
              rapidly move from Developing to
              Job Ready.
            </Typography>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
            >
              Estimated Timeline
            </Typography>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.8,
              }}
            >
              Following this roadmap consistently
              can move your readiness score from
              45% to 80%+ within approximately
              4 months.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CareerDevelopmentDashboard;