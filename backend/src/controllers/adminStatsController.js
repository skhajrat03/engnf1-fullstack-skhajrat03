
import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      totalResources,
      availableResources,
      unavailableResources,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      cancelledBookings,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'admin' }),

      Resource.countDocuments({ isActive: true }),
      Resource.countDocuments({
        isActive: true,
        status: 'Available',
      }),
      Resource.countDocuments({
        isActive: true,
        status: { $in: ['Unavailable', 'Maintenance'] },
      }),

      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Approved' }),
      Booking.countDocuments({ status: 'Rejected' }),
      Booking.countDocuments({ status: 'Cancelled' }),

      Booking.find()
        .populate('user', 'name email')
        .populate('resource', 'name category location')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalResources,
        availableResources,
        unavailableResources,
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings,
        cancelledBookings,
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Admin Statistics Error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin statistics',
    });
  }
};
