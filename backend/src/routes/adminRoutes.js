
import express from 'express';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import { getAdminStats } from '../controllers/adminStatsController.js';

const router = express.Router();

router.get(
  '/dashboard',
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Welcome to TriageSync Admin Dashboard',
      admin: req.user,
    });
  }
);
router.get('/stats', adminMiddleware, getAdminStats);
export default router;
