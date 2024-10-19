import Report from "../models/reportModel.js";


// Create a new report
export const createReport = async (req, res) => {
  const { author, post, description } = req.body;
  try {
    const newReport = new Report({ author, post, description });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports
export const getReports = async (req, res) => {
    try {
      const reports = await Report.find({isFulfilled:false})
        .populate('author', 'name email') // Populate author details from User model
        .populate({
          path: 'post',
          populate: {
            path: 'postedBy',
            select: 'username profilePic'
          }
        }); // Populate post details from Post model and nested postedBy field from User model
      res.status(200).json(reports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Mark a report as fulfilled by ID
export const markReportAsFulfilled = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { isFulfilled: true },
      { new: true, runValidators: true }
    );
    if (!updatedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateIsFulfilledField = async () => {

  await Report.updateMany(
    { isFulfilled: { $in: ['false', 'true'] } },
    [
      {
        $set: {
          isFulfilled: {
            $cond: { if: { $eq: ['$isFulfilled', 'true'] }, then: true, else: false },
          },
        },
      },
    ]
  );

  console.log('isFulfilled field updated successfully');
};


