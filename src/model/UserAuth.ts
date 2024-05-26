import mongoose from "mongoose";

const userRoles = [
  "X_GB",
  "CNM_EB",
  "CR_EB",
  "EM_EB",
  "FN_EB",
  "HR_EB",
  "PR_EB",
  "RND_EB",
  "MEMBER",
];

//TODO Designation And Department Join

const UserAuthSchema = new mongoose.Schema({
  // userId: { type: Schema.Types.ObjectId, ref: 'UserInfo', required: true, index: true },
  userRoles: {
    type: [String],
    required: [true, "Please provide a role"],
    enum: userRoles, //Only Predefined Values from the above memberRoles array.
    default: ["MEMBER"], // Roles from here will be fetched in a particular order, so the first role will be the primary role. This eliminates the need for a sperate field for designations
  },
  name: {
    type: String,
    required: true,
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
    required: false,
  },
  verifyTokenExpiry: {
    type: Date,
    required: false,
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpiry: {
    type: Date,
    required: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const UserAuth =
  mongoose.models.UserAuth || mongoose.model("UserAuth", UserAuthSchema);

export default UserAuth;
