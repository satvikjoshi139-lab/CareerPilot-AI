/* eslint-disable no-unused-vars, react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Stack, Avatar, Paper,
  Button, Collapse, CircularProgress, Alert, TextField, Divider,
  IconButton, Tooltip,
} from '@mui/material';
import {
  Person, Psychology, Code, Forum, AltRoute,
  ArrowDownward, CheckCircle, HourglassEmpty, PlayCircle,
  ExpandMore, ExpandLess, PlayArrow, RestartAlt, ErrorOutline,
} from '@mui/icons-material';

// ─── Gemini API call ────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  // Strip markdown fences if present
  const clean = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(clean);
}

// ─── Agent prompts ───────────────────────────────────────────────────────────
const buildPrompts = (input) => ({
  profile: `
You are a CareerPilot Profile Agent. Analyze this candidate and return ONLY a raw JSON object (no markdown, no explanation).
Input: ${JSON.stringify(input)}
Return exactly:
{
  "strengths": ["string", ...],
  "weaknesses": ["string", ...],
  "career_score": <number 0-100>,
  "profile_summary": "string"
}`,

  skillgap: (profileResult) => `
You are a CareerPilot Skill Gap Agent. Based on the profile below, identify skill gaps for the goal "${input.goal}".
Profile result: ${JSON.stringify(profileResult)}
Current skills: ${JSON.stringify(input.skills)}
Return ONLY a raw JSON object:
{
  "missing_skills": [
    { "skill": "string", "priority": "High|Medium|Low", "category": "string", "learn_time_weeks": <number> }
  ],
  "priority_order": ["skill1", "skill2", ...]
}`,

  project: (skillGapResult) => `
You are a CareerPilot Project Recommendation Agent. Suggest 4 portfolio projects for goal "${input.goal}".
Missing skills: ${JSON.stringify(skillGapResult.missing_skills?.map(s => s.skill))}
Current skills: ${JSON.stringify(input.skills)}
Return ONLY a raw JSON object:
{
  "recommended_projects": [
    {
      "title": "string",
      "description": "string",
      "tech_stack": ["string"],
      "difficulty": "Beginner|Intermediate|Advanced",
      "duration_weeks": <number>,
      "resume_value": "High|Medium|Low",
      "skills_covered": ["string"]
    }
  ]
}`,

  interview: (projectResult, mcpTopics) => `
You are a CareerPilot Interview Preparation Agent. Generate interview questions for "${input.goal}".
Skills: ${JSON.stringify(input.skills)}
${mcpTopics && mcpTopics.length > 0 ? `Include key questions and check coverage on the following interview topics retrieved from the CareerResourceMCP server: ${JSON.stringify(mcpTopics)}` : ''}
Return ONLY a raw JSON object:
{
  "java_questions": ["string", "string", "string"],
  "dsa_questions": ["string", "string", "string"],
  "system_design_questions": ["string", "string"],
  "behavioral_questions": ["string", "string", "string"],
  "interview_readiness_score": <number 0-100>
}`,

  roadmap: (interviewResult, mcpResources, mcpTemplates) => `
You are a CareerPilot Roadmap Agent. Create a 4-month learning roadmap for goal "${input.goal}".
Current skills: ${JSON.stringify(input.skills)}
Interview readiness score: ${interviewResult.interview_readiness_score}
${mcpResources && Object.keys(mcpResources).length > 0 ? `Incorporate these learning resources retrieved from the CareerResourceMCP server: ${JSON.stringify(mcpResources)}` : ''}
${mcpTemplates && Object.keys(mcpTemplates).length > 0 ? `Integrate these project templates retrieved from the CareerResourceMCP server: ${JSON.stringify(mcpTemplates)}` : ''}
Return ONLY a raw JSON object:
{
  "roadmap": [
    {
      "month": 1,
      "title": "string",
      "learning_goals": ["string"],
      "practice_tasks": ["string"],
      "projects": ["string"],
      "interview_topics": ["string"]
    }
  ]
}`,
});

// ─── Agent config ────────────────────────────────────────────────────────────
const AGENT_META = [
  { id: 'profile',   name: 'Profile Agent',                 icon: <Person />,    color: '#4f46e5', bg: 'linear-gradient(135deg,#4f46e5,#7c3aed)' },
  { id: 'skillgap',  name: 'Skill Gap Agent',               icon: <Psychology />, color: '#0891b2', bg: 'linear-gradient(135deg,#0891b2,#06b6d4)' },
  { id: 'project',   name: 'Project Recommendation Agent',  icon: <Code />,      color: '#059669', bg: 'linear-gradient(135deg,#059669,#10b981)' },
  { id: 'interview', name: 'Interview Agent',               icon: <Forum />,     color: '#d97706', bg: 'linear-gradient(135deg,#d97706,#f59e0b)' },
  { id: 'roadmap',   name: 'Roadmap Agent',                 icon: <AltRoute />,  color: '#7c3aed', bg: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
];

const STATUS = { WAITING: 'waiting', RUNNING: 'running', DONE: 'completed', ERROR: 'error' };

const statusChip = {
  waiting:   { label: 'Waiting',   color: 'default', icon: <HourglassEmpty fontSize="small" /> },
  running:   { label: 'Running',   color: 'warning', icon: <CircularProgress size={14} sx={{ mr: 0.5 }} /> },
  completed: { label: 'Completed', color: 'success', icon: <CheckCircle fontSize="small" /> },
  error:     { label: 'Error',     color: 'error',   icon: <ErrorOutline fontSize="small" /> },
};

// ─── Result renderer ─────────────────────────────────────────────────────────
const ResultView = ({ agentId, result, color, mcpMetadata }) => {
  if (!result) return null;

  if (agentId === 'profile') return (
    <Box>
      <Typography variant="body2" fontWeight={700} mb={1}>Career Score: <span style={{ color, fontSize: '1.2em' }}>{result.career_score}/100</span></Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>{result.profile_summary}</Typography>
      <Stack direction="row" flexWrap="wrap" gap={0.5} mt={1}>
        {result.strengths?.map(s => <Chip key={s} label={s} size="small" color="success" variant="outlined" />)}
      </Stack>
    </Box>
  );

  if (agentId === 'skillgap') return (
    <Box>
      <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>MISSING SKILLS</Typography>
      <Stack spacing={0.5}>
        {result.missing_skills?.map(s => (
          <Stack key={s.skill} direction="row" spacing={1} alignItems="center">
            <Chip label={s.priority} size="small"
              color={s.priority === 'High' ? 'error' : s.priority === 'Medium' ? 'warning' : 'default'}
              sx={{ minWidth: 68, fontWeight: 700 }} />
            <Typography variant="body2" fontWeight={600}>{s.skill}</Typography>
            <Typography variant="caption" color="text.secondary">({s.category} · {s.learn_time_weeks}w)</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );

  if (agentId === 'project') return (
    <Stack spacing={1.5}>
      {result.recommended_projects?.map((p, i) => (
        <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body2" fontWeight={700}>{p.title}</Typography>
            <Chip label={p.difficulty} size="small"
              color={p.difficulty === 'Advanced' ? 'error' : p.difficulty === 'Intermediate' ? 'warning' : 'success'}
              sx={{ fontWeight: 700 }} />
          </Stack>
          <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>{p.description}</Typography>
          <Stack direction="row" flexWrap="wrap" gap={0.5} mt={1}>
            {p.tech_stack?.map(t => <Chip key={t} label={t} size="small" variant="outlined" />)}
          </Stack>
          <Typography variant="caption" sx={{ color, fontWeight: 700 }}>Resume Value: {p.resume_value} · {p.duration_weeks}w</Typography>
        </Paper>
      ))}
    </Stack>
  );

  if (agentId === 'interview') return (
    <Box>
      {mcpMetadata?.interview && mcpMetadata.interview.length > 0 && (
        <Alert severity="success" sx={{ mb: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.8rem' }}>
          <strong>Connected to CareerResourceMCP:</strong> Injected {mcpMetadata.interview.length} role-specific interview topics.
        </Alert>
      )}
      <Typography variant="body2" fontWeight={700} mb={1}>
        Interview Readiness: <span style={{ color }}>{result.interview_readiness_score}/100</span>
      </Typography>
      {[
        ['Java', result.java_questions],
        ['DSA', result.dsa_questions],
        ['System Design', result.system_design_questions],
        ['Behavioral', result.behavioral_questions],
      ].map(([cat, qs]) => qs?.length ? (
        <Box key={cat} mb={1}>
          <Typography variant="caption" fontWeight={700} color="text.secondary">{cat.toUpperCase()}</Typography>
          {qs.map((q, i) => (
            <Typography key={i} variant="body2" sx={{ pl: 1, borderLeft: `3px solid ${color}`, ml: 0.5, mt: 0.5 }}>{q}</Typography>
          ))}
        </Box>
      ) : null)}
    </Box>
  );

  if (agentId === 'roadmap') return (
    <Stack spacing={1.5}>
      {mcpMetadata?.roadmap && (
        <Alert severity="success" sx={{ mb: 1.5, py: 0.5, borderRadius: 2, fontSize: '0.8rem' }}>
          <strong>Connected to CareerResourceMCP:</strong> Injected learning resources and project templates.
        </Alert>
      )}
      {result.roadmap?.map((m) => (
        <Paper key={m.month} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={800} sx={{ color }}>Month {m.month}: {m.title}</Typography>
          <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mt={0.5}>Goals</Typography>
          {m.learning_goals?.map((g, i) => <Typography key={i} variant="caption" display="block" sx={{ pl: 1 }}>• {g}</Typography>)}
          <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mt={0.5}>Interview Topics</Typography>
          {m.interview_topics?.map((t, i) => <Typography key={i} variant="caption" display="block" sx={{ pl: 1 }}>• {t}</Typography>)}
        </Paper>
      ))}
    </Stack>
  );

  return <pre style={{ fontSize: 11, overflow: 'auto', maxHeight: 200 }}>{JSON.stringify(result, null, 2)}</pre>;
};

// ─── Main component ───────────────────────────────────────────────────────────
const AgentWorkflow = () => {
  const [statuses, setStatuses]   = useState(AGENT_META.map(() => STATUS.WAITING));
  const [results, setResults]     = useState({});
  const [errors, setErrors]       = useState({});
  const [expanded, setExpanded]   = useState({});
  const [running, setRunning]     = useState(false);
  const [dotPos, setDotPos]       = useState(0);
  const [input, setInput]         = useState({ degree: 'B.Tech CSE', skills: ['Java', 'MySQL'], goal: 'SDE-1' });
  const [apiKeyMissing, setApiKeyMissing] = useState(!GEMINI_API_KEY);
  const [mcpConnected, setMcpConnected]   = useState(false);
  const [mcpMetadata, setMcpMetadata]     = useState({});
  const tickRef = useRef(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setDotPos(p => (p + 1) % 3), 600);
    return () => clearInterval(tickRef.current);
  }, []);

  useEffect(() => {
    const checkMcpConnection = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/tools/get_interview_topics?role=sde-1');
        setMcpConnected(res.ok);
      } catch {
        setMcpConnected(false);
      }
    };
    checkMcpConnection();
    const interval = setInterval(checkMcpConnection, 4000);
    return () => clearInterval(interval);
  }, []);

  const setStatus = (idx, s) => setStatuses(prev => { const n = [...prev]; n[idx] = s; return n; });

  const runPipeline = async () => {
    if (!GEMINI_API_KEY) { setApiKeyMissing(true); return; }
    setRunning(true);
    setResults({});
    setErrors({});
    setMcpMetadata({});
    setStatuses(AGENT_META.map(() => STATUS.WAITING));

    const prompts = buildPrompts(input);
    let accumulated = {};

    const agentFns = [
      () => callGemini(prompts.profile),
      () => callGemini(prompts.skillgap(accumulated.profile)),
      () => callGemini(prompts.project(accumulated.skillgap)),
      async () => {
        let mcpTopics = [];
        if (mcpConnected) {
          try {
            const url = `http://127.0.0.1:8000/tools/get_interview_topics?role=${encodeURIComponent(input.goal)}`;
            const data = await fetch(url).then(r => r.json());
            if (Array.isArray(data)) {
              mcpTopics = data;
              setMcpMetadata(prev => ({ ...prev, interview: data }));
            }
          } catch (e) {
            console.error("MCP fetch error (interview topics):", e);
          }
        }
        return callGemini(prompts.interview(accumulated.project, mcpTopics));
      },
      async () => {
        let mcpResources = {};
        let mcpTemplates = {};
        if (mcpConnected) {
          try {
            const skillsToQuery = [...input.skills];
            if (accumulated.skillgap?.missing_skills) {
              accumulated.skillgap.missing_skills.forEach(s => {
                if (s.skill && !skillsToQuery.includes(s.skill)) {
                  skillsToQuery.push(s.skill);
                }
              });
            }

            for (const skill of skillsToQuery) {
              const resUrl = `http://127.0.0.1:8000/tools/get_learning_resources?skill=${encodeURIComponent(skill)}`;
              const tmplUrl = `http://127.0.0.1:8000/tools/get_project_templates?skill=${encodeURIComponent(skill)}`;
              const [resData, tmplData] = await Promise.all([
                fetch(resUrl).then(r => r.json()).catch(() => []),
                fetch(tmplUrl).then(r => r.json()).catch(() => [])
              ]);
              if (Array.isArray(resData) && resData.length > 0) mcpResources[skill] = resData;
              if (Array.isArray(tmplData) && tmplData.length > 0) mcpTemplates[skill] = tmplData;
            }

            setMcpMetadata(prev => ({
              ...prev,
              roadmap: { resources: mcpResources, templates: mcpTemplates }
            }));
          } catch (e) {
            console.error("MCP fetch error (roadmap):", e);
          }
        }
        return callGemini(prompts.roadmap(accumulated.interview, mcpResources, mcpTemplates));
      },
    ];

    for (let i = 0; i < AGENT_META.length; i++) {
      const id = AGENT_META[i].id;
      setStatus(i, STATUS.RUNNING);
      try {
        const result = await agentFns[i]();
        accumulated[id] = result;
        setResults(prev => ({ ...prev, [id]: result }));
        setStatus(i, STATUS.DONE);
        setExpanded(prev => ({ ...prev, [id]: true }));
      } catch (e) {
        setErrors(prev => ({ ...prev, [id]: e.message }));
        setStatus(i, STATUS.ERROR);
        // Continue pipeline even on error
      }
    }
    setRunning(false);
  };

  const reset = () => {
    setStatuses(AGENT_META.map(() => STATUS.WAITING));
    setResults({});
    setErrors({});
    setExpanded({});
    setRunning(false);
    setMcpMetadata({});
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', py: 2 }}>

      {/* Header */}
      <Paper elevation={0} sx={{ width: '100%', mb: 3, p: 3, borderRadius: 4, background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 60%,#4338ca 100%)', color: 'white' }}>
        <Typography variant="h5" fontWeight={800} gutterBottom>Multi-Agent AI Workflow</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          5 specialized Gemini-powered agents run sequentially — each passes structured JSON to the next.
        </Typography>
      </Paper>

      {/* Input + Controls */}
      <Card sx={{ width: '100%', maxWidth: 720, borderRadius: 4, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ m: 0 }}>Candidate Input</Typography>
            <Chip 
              label={mcpConnected ? "CareerResourceMCP: Active" : "CareerResourceMCP: Offline"} 
              color={mcpConnected ? "success" : "default"} 
              variant="outlined" 
              size="small"
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
          </Box>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField size="small" label="Degree" value={input.degree} fullWidth
                onChange={e => setInput(p => ({ ...p, degree: e.target.value }))} disabled={running} />
              <TextField size="small" label="Career Goal" value={input.goal} fullWidth
                onChange={e => setInput(p => ({ ...p, goal: e.target.value }))} disabled={running} />
            </Stack>
            <TextField size="small" label="Current Skills (comma separated)"
              value={input.skills.join(', ')} fullWidth disabled={running}
              onChange={e => setInput(p => ({ ...p, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} />
          </Stack>

          {apiKeyMissing && (
            <Alert severity="error" sx={{ mt: 2 }}>
              <strong>VITE_GEMINI_API_KEY not set.</strong> Add it to <code>careerpilot_final/.env</code> and restart <code>npm run dev</code>.
            </Alert>
          )}

          <Stack direction="row" spacing={1.5} mt={2.5}>
            <Button variant="contained" startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
              onClick={runPipeline} disabled={running || apiKeyMissing}
              sx={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', fontWeight: 700, borderRadius: 3, px: 3 }}>
              {running ? 'Running Pipeline…' : 'Run All Agents'}
            </Button>
            <Button variant="outlined" startIcon={<RestartAlt />} onClick={reset} disabled={running} sx={{ borderRadius: 3 }}>
              Reset
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Pipeline */}
      {AGENT_META.map((agent, idx) => {
        const status = statuses[idx];
        const sc = statusChip[status];
        const isRunning = status === STATUS.RUNNING;
        const isDone = status === STATUS.DONE;
        const isError = status === STATUS.ERROR;
        const isOpen = expanded[agent.id];
        const result = results[agent.id];
        const errMsg = errors[agent.id];

        return (
          <React.Fragment key={agent.id}>
            <Card sx={{
              width: '100%', maxWidth: 720, borderRadius: 4,
              border: isRunning ? `2px solid ${agent.color}` : isDone ? '2px solid #10b981' : isError ? '2px solid #ef4444' : '2px solid transparent',
              boxShadow: isRunning ? `0 0 28px ${agent.color}44` : 2,
              transition: 'all 0.4s ease', position: 'relative', overflow: 'visible',
            }}>
              {isRunning && (
                <Box sx={{ position: 'absolute', inset: -5, borderRadius: 4, border: `2px solid ${agent.color}`,
                  opacity: dotPos === 0 ? 0.5 : dotPos === 1 ? 0.25 : 0.08,
                  transition: 'opacity 0.6s ease', pointerEvents: 'none' }} />
              )}
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ background: agent.bg, width: 52, height: 52, boxShadow: `0 4px 14px ${agent.color}44`, flexShrink: 0 }}>
                    {agent.icon}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1rem' }}>{agent.name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip icon={sc.icon} label={sc.label} color={sc.color} size="small" sx={{ fontWeight: 700 }} />
                        {(isDone || isError) && (
                          <Tooltip title={isOpen ? 'Collapse' : 'Expand results'}>
                            <IconButton size="small" onClick={() => setExpanded(p => ({ ...p, [agent.id]: !p[agent.id] }))}>
                              {isOpen ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Stack>

                    {/* Error */}
                    {isError && errMsg && (
                      <Alert severity="error" sx={{ mt: 1, mb: 1, py: 0 }}>{errMsg}</Alert>
                    )}

                    {/* Results */}
                    <Collapse in={isOpen && isDone}>
                      <Divider sx={{ my: 1.5 }} />
                      <ResultView agentId={agent.id} result={result} color={agent.color} mcpMetadata={mcpMetadata} />
                    </Collapse>

                    {/* Idle I/O chips */}
                    {!isDone && !isError && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mt={1}>
                        <Chip size="small" variant="outlined"
                          label={`IN: ${agent.id === 'profile' ? '{ degree, skills, goal }' : agent.id === 'skillgap' ? '{ profile_result }' : agent.id === 'project' ? '{ skillgap_result }' : agent.id === 'interview' ? '{ project_result }' : '{ interview_result }'}`}
                          sx={{ fontFamily: 'monospace', fontSize: '0.65rem', borderColor: agent.color, color: agent.color }} />
                      </Stack>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {idx < AGENT_META.length - 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.5, gap: 0.5 }}>
                <Stack spacing={0.5} alignItems="center">
                  {[0, 1, 2].map(d => (
                    <Box key={d} sx={{ width: 8, height: 8, borderRadius: '50%', background: agent.color,
                      opacity: (isRunning || isDone) && dotPos === d ? 1 : 0.2, transition: 'opacity 0.3s ease' }} />
                  ))}
                </Stack>
                <ArrowDownward sx={{ color: 'text.disabled', fontSize: '1.25rem' }} />
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default AgentWorkflow;
