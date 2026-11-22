import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory data store (would be PostgreSQL in production)
const store = {
  users: [],
  attempts: [],
  assignments: [],
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ---- Curriculum API ----
app.get('/api/curriculum/outcomes', (req, res) => {
  res.json({
    outcomes: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      year: i < 13 ? 1 : 2,
      status: i < 3 ? 'available' : 'locked',
    })),
  });
});

// ---- Content API ----
app.get('/api/content/glossary', (req, res) => {
  res.json({ count: 18, message: 'Glossary served from client-side data' });
});

app.get('/api/content/questions', (req, res) => {
  const { topic, difficulty, limit = 10 } = req.query;
  res.json({
    questions: [],
    message: 'Question bank served from client-side data',
    filters: { topic, difficulty, limit },
  });
});

// ---- Attempts API ----
app.post('/api/attempts', (req, res) => {
  const attempt = {
    id: `att_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  store.attempts.push(attempt);
  res.status(201).json(attempt);
});

app.get('/api/attempts', (req, res) => {
  const { userId, type } = req.query;
  let results = store.attempts;
  if (userId) results = results.filter((a) => a.userId === userId);
  if (type) results = results.filter((a) => a.type === type);
  res.json({ attempts: results, total: results.length });
});

// ---- Progress API ----
app.get('/api/progress/:userId', (req, res) => {
  const { userId } = req.params;
  const userAttempts = store.attempts.filter((a) => a.userId === userId);
  res.json({
    userId,
    totalAttempts: userAttempts.length,
    quizAttempts: userAttempts.filter((a) => a.type === 'quiz').length,
    labAttempts: userAttempts.filter((a) => a.type === 'lab').length,
    xpEarned: userAttempts.reduce((sum, a) => sum + (a.xp || 0), 0),
  });
});

// ---- Leaderboard API ----
app.get('/api/leaderboard', (req, res) => {
  res.json({
    leaderboard: [
      { rank: 1, name: 'Demo Student', xp: 1250, level: 5 },
    ],
  });
});

// ---- Assignments API (Instructor) ----
app.post('/api/assignments', (req, res) => {
  const assignment = {
    id: `asg_${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  store.assignments.push(assignment);
  res.status(201).json(assignment);
});

app.get('/api/assignments', (req, res) => {
  res.json({ assignments: store.assignments });
});

// ---- Circuit Solver API (server-side validation) ----
app.post('/api/circuit/solve', (req, res) => {
  const { components, nodeCount } = req.body;
  // Server-side circuit solving can be added for validation
  // Currently the solver runs client-side for instant feedback
  res.json({
    message: 'Circuit solving is handled client-side for instant feedback',
    componentCount: components?.length || 0,
    nodeCount: nodeCount || 0,
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`⚡ Electrician SkillLab API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
