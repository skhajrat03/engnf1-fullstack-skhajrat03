
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Conference Room',
        'Computer Lab',
        'Meeting Room',
        'Equipment',
        'Other',
      ],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    facilities: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      default: '',
    },

    status: {
      type: String,
      enum: ['Available', 'Unavailable', 'Maintenance'],
      default: 'Available',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
