const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 4500;

app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

const taskCounter = new client.Counter({
  name: 'task_created_total',
  help: 'Total tasks created',
});

app.get('/tasks', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM tasks ORDER BY id DESC');
  res.json(rows);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  await db.query('INSERT INTO tasks (title) VALUES ($1)', [title]);
  taskCounter.inc();
  res.status(201).send();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(port, () => console.log(`Server running on port ${port}`));
