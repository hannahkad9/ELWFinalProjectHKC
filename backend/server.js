// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { flagsRouter } from './flags/flags.routes.js';
import router from './users/auth.routes.js';
import { statsRouter } from './estadistica/estadistica.routes.js';
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/flagory')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/flags', flagsRouter);
app.use('/api/auth', router);  // Use the auth routes
app.use('/api/stats', statsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
