import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { askPicoRouter } from './routes/askPico.js';
import { growthRouter } from './routes/growth.js';
import { healthRouter } from './routes/health.js';
import { notebooksRouter } from './routes/notebooks.js';
import { practiceRouter } from './routes/practice.js';
import { problemsRouter } from './routes/problems.js';
import { profileRouter } from './routes/profile.js';
import { settingsRouter } from './routes/settings.js';
import { visualLabRouter } from './routes/visualLab.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? '127.0.0.1';
const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const configuredOrigins = process.env.CLIENT_ORIGIN?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins?.length ? configuredOrigins : defaultOrigins;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS origin not allowed: ${origin}`));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.use('/api', healthRouter);
app.use('/api', askPicoRouter);
app.use('/api', problemsRouter);
app.use('/api', notebooksRouter);
app.use('/api', visualLabRouter);
app.use('/api', growthRouter);
app.use('/api', practiceRouter);
app.use('/api', profileRouter);
app.use('/api', settingsRouter);

app.use('/api', notFoundHandler);
app.use(errorHandler);

const server = app.listen(port, host, () => {
  console.log(`PicoLab mock API listening on http://${host}:${port}/api`);
});

const shutdown = (signal: NodeJS.Signals) => {
  console.log(`PicoLab mock API received ${signal}; shutting down.`);
  server.close(() => {
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
