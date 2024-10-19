import Jarvis from '../models/jarvisModel.js';

// Create a new Jarvis entry
export const createJarvisEntry = async (req, res) => {
  const { jarvisOwner, city, linkedIn_URL, fb_URL, customCommands } = req.body;

  if (!jarvisOwner || !city || !linkedIn_URL || !fb_URL || !customCommands) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newJarvisEntry = new Jarvis({
      jarvisOwner,
      city,
      linkedIn_URL,
      fb_URL,
      customCommands,
    });

    const savedJarvisEntry = await newJarvisEntry.save();
    res.status(201).json(savedJarvisEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Jarvis entry', error });
  }
};

// Fetch Jarvis details for the specified user
export const getJarvisDetails = async (req, res) => {
  const { jarvisOwner } = req.body;

  if (!jarvisOwner) {
    return res.status(400).json({ message: 'jarvisOwner is required' });
  }

  try {
    const jarvisDetails = await Jarvis.findOne({ jarvisOwner });
    if (!jarvisDetails) {
      return res.status(404).json({ message: 'Jarvis details not found' });
    }
    res.status(200).json(jarvisDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Jarvis details', error });
  }
};

// Update Jarvis details for the specified user
export const updateJarvisDetails = async (req, res) => {
  const { jarvisOwner, city, linkedIn_URL, fb_URL, customCommands } = req.body;

  if (!jarvisOwner) {
    return res.status(400).json({ message: 'jarvisOwner is required' });
  }

  try {
    const updatedJarvisDetails = await Jarvis.findOneAndUpdate(
      { jarvisOwner },
      { city, linkedIn_URL, fb_URL, customCommands },
      { new: true, runValidators: true }
    );

    if (!updatedJarvisDetails) {
      return res.status(404).json({ message: 'Jarvis details not found' });
    }

    res.status(200).json(updatedJarvisDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Jarvis details', error });
  }
};
