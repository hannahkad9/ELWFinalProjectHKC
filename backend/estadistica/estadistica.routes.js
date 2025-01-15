const express = require('express');
const router = express.Router();
import { postStatistic, getStatistics } from './estadistica.controllers.js';

export const statisticsRouter = router;

// Route to create a new statistic
router.post('/', createStatistic);

// Route to get filtered statistics
router.get('/', getFilteredStatistics);

// Route to get recent events (10 most recent) with optional filters
router.get('/recent', getRecentStatistics);

