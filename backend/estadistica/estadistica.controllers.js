import Statistic from './estadistica.model';

const Statistic = require('../models/statistic.model'); // Assuming the Mongoose model is defined

// Create a new statistic
const createStatistic = async (req, res) => {
  try {
    const { sessionId, userId, llocEvent, tipusEvent } = req.body;

    if (!sessionId || !llocEvent || !tipusEvent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const statistic = new Statistic({ sessionId, userId, llocEvent, tipusEvent });
    await statistic.save();

    res.status(201).json({
      message: 'Statistic logged successfully',
      statistic,
    });
  } catch (error) {
    console.error('Error logging statistic:', error);
    res.status(500).json({ error: 'Failed to log statistic' });
  }
};

// Get filtered statistics
const getFilteredStatistics = async (req, res) => {
  try {
    const { dataInici, dataFinal, llocEvent, tipusEvent } = req.query;

    const query = {};

    if (dataInici) query.createdAt = { $gte: new Date(dataInici) };
    if (dataFinal) query.createdAt = { ...query.createdAt, $lte: new Date(dataFinal) };
    if (llocEvent) query.llocEvent = llocEvent;
    if (tipusEvent) query.tipusEvent = tipusEvent;

    const stats = await Statistic.aggregate([
      { $match: query },
      { $group: { _id: '$tipusEvent', count: { $sum: 1 } } },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Error fetching filtered statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// Get recent events (10 most recent) with optional filters
const getRecentStatistics = async (req, res) => {
  try {
    const { dataInici, dataFinal, llocEvent, tipusEvent } = req.query;

    const query = {};

    if (dataInici) query.createdAt = { $gte: new Date(dataInici) };
    if (dataFinal) query.createdAt = { ...query.createdAt, $lte: new Date(dataFinal) };
    if (llocEvent) query.llocEvent = llocEvent;
    if (tipusEvent) query.tipusEvent = tipusEvent;

    const events = await Statistic.find(query).sort({ createdAt: -1 }).limit(10);

    res.json(events);
  } catch (error) {
    console.error('Error fetching recent statistics:', error);
    res.status(500).json({ error: 'Failed to fetch recent events' });
  }
};

module.exports = {
  createStatistic,
  getFilteredStatistics,
  getRecentStatistics,
};
