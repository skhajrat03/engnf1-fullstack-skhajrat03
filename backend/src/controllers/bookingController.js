
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';

// Check whether a resource has an overlapping active booking
const hasBookingConflict = async (resourceId, startTime, endTime) => {
  return await Booking.findOne({
    resource: resourceId,
    status: { $in: ['Pending', 'Approved'] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });
};

// 1. Create a booking
export const createBooking = async (req, res) => {
  try {
    const { resourceId, startTime, endTime, purpose, attendees } = req.body;

    if (!resourceId || !startTime || !endTime || !purpose || attendees === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All booking fields are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start <= new Date() ||
      end <= start
    ) {
      return res.status(400).json({
        success: false,
        message: 'Provide valid future start and end times'
      });
    }

    const attendeeCount = Number(attendees);

    if (!Number.isInteger(attendeeCount) || attendeeCount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Attendees must be a positive whole number'
      });
    }

    const resource = await Resource.findOne({
      _id: resourceId,
      isActive: true,
      status: 'Available'
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found or unavailable'
      });
    }

    if (attendeeCount > resource.capacity) {
      return res.status(400).json({
        success: false,
        message: `Maximum capacity is ${resource.capacity}`
      });
    }

    const conflict = await hasBookingConflict(resourceId, start, end);

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'This resource is already booked for the selected time'
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      resource: resourceId,
      startTime: start,
      endTime: end,
      purpose: purpose.trim(),
      attendees: attendeeCount
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. Get logged-in user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('resource', 'name category location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. Get all bookings (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('resource', 'name category location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 4. Cancel own pending or approved booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    const booking = await Booking.findOne({
      _id: id,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!['Pending', 'Approved'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be cancelled'
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// 5. Admin: Approve or reject a booking
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking ID'
      });
    }

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Approved or Rejected'
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be updated'
      });
    }

    // Recheck availability before approving
    if (status === 'Approved') {
      const conflict = await Booking.findOne({
        _id: { $ne: booking._id },
        resource: booking.resource,
        status: 'Approved',
        startTime: { $lt: booking.endTime },
        endTime: { $gt: booking.startTime }
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Another approved booking conflicts with this time slot'
        });
      }
    }

    booking.status = status;
    booking.adminRemarks = adminRemarks?.trim() || '';

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully`,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// 6. Admin: Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = {
      totalBookings: 0,
      pendingBookings: 0,
      approvedBookings: 0,
      rejectedBookings: 0,
      cancelledBookings: 0
    };

    stats.forEach((item) => {
      summary.totalBookings += item.count;

      switch (item._id) {
        case 'Pending':
          summary.pendingBookings = item.count;
          break;

        case 'Approved':
          summary.approvedBookings = item.count;
          break;

        case 'Rejected':
          summary.rejectedBookings = item.count;
          break;

        case 'Cancelled':
          summary.cancelledBookings = item.count;
          break;
      }
    });

    res.status(200).json({
      success: true,
      stats: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
