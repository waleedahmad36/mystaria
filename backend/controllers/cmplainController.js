import Complain from "../models/complainModel.js";



export const createComplain = async (req, res) => {
  const { title, author, username, description, url } = req.body;
  try {
    const newComplain = new Complain({ title, author, username, description, url });
    await newComplain.save();
    res.status(201).json(newComplain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComplains = async (req, res) => {
  try {
    const complains = await Complain.find({ isFulfilled: false }).populate('author', 'name email profilePic');
    console.log("Fetched complains:", complains); // Log fetched complaints
    res.status(200).json(complains);
  } catch (error) {
    console.error("Error fetching complains:", error); // Log error
    res.status(500).json({ message: error.message });
  }
};




export const markComplainAsFulfilled = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedComplain = await Complain.findByIdAndUpdate(
      id,
      { isFulfilled: true },
      { new: true, runValidators: true }
    );
    if (!updatedComplain) {
      return res.status(404).json({ message: 'Complain not found' });
    }
    res.status(200).json(updatedComplain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateIsFulfilledField = async () => {

  await Complain.updateMany(
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
