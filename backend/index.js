const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 9000;

app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 300, 500, 1000, 2000], // buckets for response time from 50ms to 2s
});

const taskCounter = new client.Counter({
  name: 'task_created_total',
  help: 'Total number of tasks created',
});

const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_ms',
  help: 'Duration of DB queries in ms',
  buckets: [10, 50, 100, 200, 500, 1000]
});


const frontendLoadTime = new client.Histogram({
  name: 'frontend_load_time_ms',
  help: 'Frontend page load time in milliseconds',
  buckets: [100, 300, 500, 1000, 2000, 3000, 5000] 
});


app.get('/tasks', async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // add delay
  const end = dbQueryDuration.startTimer(); 
  const { rows } = await db.query('SELECT * FROM tasks ORDER BY id DESC');
  end();
  res.json(rows);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  await db.query('INSERT INTO tasks (title) VALUES ($1)', [title]);
  taskCounter.inc();
  res.status(201).send();
});

app.post('/frontend-metrics', (req, res) => {
  frontendLoadTime.observe(req.body.loadTime);
  res.sendStatus(200);
});




// Metrics endpoint
app.use((req, res, next) => {
  const startEpoch = Date.now();
  res.on('finish', () => {
    const responseTimeInMs = Date.now() - startEpoch;
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode)
      .observe(responseTimeInMs);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => console.log(`Server running on port ${port}`));
