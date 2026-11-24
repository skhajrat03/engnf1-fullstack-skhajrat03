
import mongoose from 'mongoose';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';

// 1. Create a resource (Admin only)
export const createResource = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      location,
      capacity,
      facilities,
      image,
      status
    } = req.body;

    if (!name || !category || !location || capacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, location and capacity are required'
      });
    }

    const resource = await Resource.create({
      name,
      description,
      category,
      location,
      capacity,
      facilities,
      image,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 2. Get all active resources
export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 3. Get a single resource by ID
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    const resource = await Resource.findOne({
      _id: id,
      isActive: true
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 4. Update a resource (Admin only)
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    const allowedFields = [
      'name',
      'description',
      'category',
      'location',
      'capacity',
      'facilities',
      'image',
      'status'
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update'
      });
    }

    const resource = await Resource.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 5. Delete a resource (Admin only)
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID'
      });
    }

    // Soft delete: preserve existing booking references
    const resource = await Resource.findOneAndUpdate(
      { _id: id, isActive: true },
      { $set: { isActive: false } },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// 6. Get available resources for a selected time slot
export const getAvailableResources = async (req, res) => {
  try {
    const { startTime, endTime, attendees, category } = req.query;

    // Validate required query parameters
    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Start time and end time are required'
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid start and end times'
      });
    }

    // Validate attendee count if provided
    let attendeeCount;

    if (attendees !== undefined) {
      attendeeCount = Number(attendees);

      if (!Number.isInteger(attendeeCount) || attendeeCount < 1) {
        return res.status(400).json({
          success: false,
          message: 'Attendees must be a positive whole number'
        });
      }
    }

    // Find resources already booked during this time slot
    const conflictingBookings = await Booking.find({
      status: { $in: ['Pending', 'Approved'] },
      startTime: { $lt: end },
      endTime: { $gt: start }
    }).distinct('resource');

    // Build resource search filters
    const filters = {
      isActive: true,
      status: 'Available',
      _id: { $nin: conflictingBookings }
    };

    if (attendeeCount !== undefined) {
      filters.capacity = { $gte: attendeeCount };
    }

    if (category) {
      filters.category = category;
    }

    const resources = await Resource.find(filters)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      message: resources.length
        ? 'Available resources retrieved successfully'
        : 'No resources available for the selected time slot',
      resources
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
