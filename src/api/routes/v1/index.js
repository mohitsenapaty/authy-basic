const express = require('express');
const clientRoutes = require('./client.routes');

const router = express.Router();

/**
 * API Routes
 */
router.use('/api/v1/client', clientRoutes);

module.exports = router;