
import express from 'express';


import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
  getBookingStats
} from '../controllers/bookingController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

// All booking routes require authentication
router.use(authMiddleware);

// User routes
router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.patch('/:id/cancel', cancelBooking);

// Admin route
router.get('/all', adminMiddleware, getAllBookings);
// Admin: Approve or reject bookings
router.patch('/:id/status', adminMiddleware, updateBookingStatus);
// Admin: Booking statistics
router.get('/stats', adminMiddleware, getBookingStats);

export default router;
