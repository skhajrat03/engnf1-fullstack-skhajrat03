
import express from 'express';

import {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
  getAvailableResources
} from '../controllers/resourceController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public routes (all authenticated or unauthenticated users can view)
router.get('/availability', getAvailableResources);
router.get('/', getAllResources);
router.get('/:id', getResourceById);

// Admin-only routes
router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  createResource
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  updateResource
);

router.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  deleteResource
);

export default router;
