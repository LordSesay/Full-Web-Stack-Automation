const { Router } = require('express');
const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'encounter-id-api', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

module.exports = router;
