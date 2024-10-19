import mongoose from "mongoose";

// Define the schema
const codeSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

// Create the model
const Code = mongoose.model('Code', codeSchema);

// Controller functions

// Create a new code document
export const createCode = async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text field is required" });
  }

  try {
    const newCode = new Code({ text });
    await newCode.save();
    res.status(201).json(newCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all code documents
export const getCodes = async (req, res) => {
  try {
    const codes = await Code.find();
    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a code document
export const updateCode = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text field is required" });
  }

  try {
    const updatedCode = await Code.findByIdAndUpdate(id, { text }, { new: true });
    if (!updatedCode) {
      return res.status(404).json({ error: "Code not found" });
    }
    res.status(200).json(updatedCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default Code;
