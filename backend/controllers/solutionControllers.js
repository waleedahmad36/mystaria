import Solution from "../models/solutionModel.js";
import User from "../models/userModel.js";

// Create a new solution
const createSolution = async (req, res) => {
  try {
    const { title, description, tags, imageUrl } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const author = req.user._id;

    const newSolution = new Solution({
      title,
      description,
      tags,
      author,
      imageUrl, 
    });

    const savedSolution = await newSolution.save();

    res.status(201).json(savedSolution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);

    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    if (solution.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized to delete solution" });
    }

    await Solution.findByIdAndDelete(req.params.id);
    res.json({ message: "Solution deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const searchSolutions = async (req, res) => {
    try {
      const { query } = req.body; 
  
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Query parameter is required and should be a string" });
      }
  
      const solutions = await Solution.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }).populate("author", "username profilePic");
  
      res.json(solutions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  



const getAllSolutions = async (req, res) => {
    try {

      const solutions = await Solution.find().populate("author", "username profilePic");
  
      res.json(solutions);
    } catch (error) {
      // Handle errors
      res.status(500).json({ message: error.message });
    }
  };




//admin controllers


  
  






export { createSolution , deleteSolution  , searchSolutions , getAllSolutions};
