const express = require('express');
const clientRoutes = require('./client.routes');
const roleRoutes = require('./role.routes');
const userRoutes = require('./user.routes');

const router = express.Router();

/**
 * API Routes
 */
router.use('/api/v1/client', clientRoutes);
router.use('/api/v1/role', roleRoutes);
router.use('/api/v1/user', userRoutes);

module.exports = router;