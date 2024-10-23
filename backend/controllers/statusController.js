import cron from 'node-cron';
import Status from '../models/statusModel.js'; 
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Schedule a cron job to run every hour and delete statuses older than 24 hours
cron.schedule('0 * * * *', async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find statuses older than 24 hours
    const oldStatuses = await Status.find({ createdAt: { $lt: twentyFourHoursAgo } });

    for (const status of oldStatuses) {
      // Delete Cloudinary media
      if (status.imagePublicId) {
        await cloudinary.uploader.destroy(status.imagePublicId);
      }
      if (status.videoPublicId) {
        await cloudinary.uploader.destroy(status.videoPublicId, { resource_type: 'video' });
      }

      // Remove status from the database
      await Status.findByIdAndDelete(status._id);
    }

    console.log(`Deleted ${oldStatuses.length} statuses older than 24 hours.`);
  } catch (error) {
    console.error('Error deleting old statuses:', error);
  }
});


export const trackStatusView = async (req, res) => {
    try {
      const statusId = req.params.statusId;
      const userId = req.user._id; // Assuming user is authenticated
  
      const status = await Status.findById(statusId);
  
      // Check if the user has already viewed the status
      const alreadyViewed = status.viewers.some(viewer => viewer.userId.toString() === userId.toString());
  
      if (!alreadyViewed) {
        // Add viewer details (userId, username, profilePic) to the status
        status.viewers.push({
          userId: req.user._id,
          username: req.user.username,
          profilePic: req.user.profilePic,
        });
  
        await status.save();
      }
  
      res.status(200).json({ message: 'Status viewed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error tracking status view', error: error.message });
    }
  };
  


// Create a status (with optional image/video)
const upload = multer({ dest: 'uploads/' }); // Temporary storage location

import { pipeline } from 'stream';
import { Readable } from 'stream';

// Function to convert buffer to readable stream
const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable._read = () => {}; // No-op
  readable.push(buffer);
  readable.push(null); // End the stream
  return readable;
};

// Function to handle Cloudinary upload as a Promise
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    bufferToStream(buffer).pipe(stream);
  });
};

export const createStatus = async (req, res) => {
  try {
    const { text, caption, visibility } = req.body;
    const userId = req.user._id;

    let image = '';
    let video = '';
    let imagePublicId = '';
    let videoPublicId = '';

    console.log(text, req.files); // Log the text and files

    // Handle image upload (from buffer)
    if (req.files && req.files.image) {
      const imageBuffer = req.files.image[0].buffer; // Access buffer of the uploaded image
      const result = await uploadToCloudinary(imageBuffer); // Wait for the upload to complete
      image = result.secure_url;
      imagePublicId = result.public_id;
      console.log('Image uploaded:', image);
    }

    // Handle video upload (from buffer)
    if (req.files && req.files.video) {
      const videoBuffer = req.files.video[0].buffer;
      const result = await uploadToCloudinary(videoBuffer, { resource_type: 'video' }); // Wait for the upload to complete
      video = result.secure_url;
      videoPublicId = result.public_id;
      console.log('Video uploaded:', video);
    }

    // Create new status with the uploaded image and video URLs
    const newStatus = new Status({
      userId,
      text,
      image,
      video,
      caption,
      visibility,
      imagePublicId,
      videoPublicId,
    });

    console.log('New Status is:', newStatus);

    await newStatus.save();
    res.status(201).json({ message: 'Status created successfully', status: newStatus });
  } catch (error) {
    res.status(500).json({ message: 'Error creating status', error: error.message });
  }
};


export const getStatuses = async (req, res) => {
    try {
      const userId = req.user._id; 
  
      const statuses = await Status.find({
        $or: [
          { visibility: 'public' },
          { visibility: 'followers', userId: { $in: req.user.following } }, 
        ],
      })
        .sort({ createdAt: -1 }) // Sort to get the latest statuses first
        .populate('userId', 'username profilePic') // Populate the user who created the status
        .populate('viewers.userId', 'username profilePic') // Populate viewer details
        .exec();
  
      res.status(200).json(statuses);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching statuses', error: error.message });
    }
  };
  
  




  export const getStatusById = async (req, res) => {
    try {
      const statusId = req.params.id;
      const status = await Status.findById(statusId);
  
      if (!status) {
        return res.status(404).json({ message: 'Status not found' });
      }
  
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching status', error: error.message });
    }
  };
  