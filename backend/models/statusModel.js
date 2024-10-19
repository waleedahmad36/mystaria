import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  text: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  video: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: '',
  },
  visibility: {
    type: String,
    enum: ['public', 'followers'], // Add visibility option
    default: 'public',
  },
  imagePublicId: String,  // Store Cloudinary public ID for easy deletion
  videoPublicId: String,  // Store Cloudinary public ID for easy deletion
  viewers: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      username: String,
      profilePic: String,
      viewedAt: { type: Date, default: Date.now },
    },
  ], // Store information on who viewed the status
}, { timestamps: true });

const Status = mongoose.model('Status', statusSchema);

export default Status;
