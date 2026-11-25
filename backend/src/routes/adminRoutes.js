
import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

import { getAdminStats } from '../controllers/adminStatsController.js';

import {
  getAllUsers,
  updateUserStatus,
} from '../controllers/adminUserController.js';

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin Dashboard
router.get('/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to TriageSync Admin Dashboard',
    admin: req.user,
  });
});

// Admin Statistics
router.get('/stats', getAdminStats);

// Get all registered users
router.get('/users', getAllUsers);

// Update user status
router.patch('/users/:id/status', updateUserStatus);

export default router;
