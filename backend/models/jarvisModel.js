import mongoose from "mongoose";

const jarvisSchema = new mongoose.Schema(
  {
    jarvisOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    city: {
      type: String,
      required: true,
    },
    linkedIn_URL: {
      type: String,
      required: true,
    },
    fb_URL: {
      type: String,
      required: true,
    },
    customCommands: [
      {
        commandText: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Jarvis = mongoose.model("Jarvis", jarvisSchema);

export default Jarvis;
