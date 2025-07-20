const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const HealthLog = require('../models/HealthLog');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

router.post('/', verifyToken, async (req, res) => {
  const log = new HealthLog({ ...req.body, userId: req.userId });
  await log.save();
  res.json(log);
});

router.get('/', verifyToken, async (req, res) => {
  const logs = await HealthLog.find({ userId: req.userId });
  res.json(logs);
});

module.exports = router;
