import mongoose from "mongoose";
const UserAuthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/,
      "Please use a valid BRACU G-Suite email address",
    ], // BRACU G-Suite email validation
  },
  password: {
    type: String,
    required: true,
  },
  verifyToken: {
    type: String,
    default: null,
  },
  expiresIn: {
    type: Date,
    default: null,
  },
});

const UserAuth =
  mongoose.models.UserAuth || mongoose.model("UserAuth", UserAuthSchema);

export default UserAuth;
