
import User from '../models/User.js';

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
