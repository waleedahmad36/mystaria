import Event from "../models/eventsModel.js";
import { v2 as cloudinary } from "cloudinary";

// Create a new event
export const createEvent = async (req, res) => {
  const { text } = req.body;
  let { image } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text fields are required" });
  }

  if (image) {
    const uploadedResponse = await cloudinary.uploader.upload(image);
    image = uploadedResponse.secure_url;
  }
  const newEvent = new Event({ text, image });
    await newEvent.save();
    res.status(201).json(newEvent);
  try {
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an event by ID
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { text, image } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { text, image },
      { new: true, runValidators: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an event by ID
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
