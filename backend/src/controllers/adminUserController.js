
import User from '../models/User.js';
import mongoose from 'mongoose';

// Get all registered users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Get All Users Error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be true or false',
      });
    }

    // Prevent administrators from deactivating themselves
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deactivation of the last active administrator
    if (!isActive && user.role === 'admin' && user.isActive !== false) {
      const activeAdminCount = await User.countDocuments({
        role: 'admin',
        isActive: { $ne: false },
      });

      if (activeAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last active administrator',
        });
      }
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Update User Status Error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Failed to update user status',
    });
  }
};
