import mongoose from "mongoose";

const allowedStatuses = ["Pending", "Accepted", "Rejected"];

const MemberEBAssesmentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  studentId: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },

  inteviewTakenBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "UserAuth", // Fix: List of EBs name
  },

  buccDepartment: {
    type: String,
    required: true,
    default: "Not Assigned",
  },

  status: {
    type: String,
    required: true,
    default: "Pending",
    enum: allowedStatuses,
  },

  comment: {
    type: String,
    required: false,
  },

  responseObject: {
    type: String,
    required: true,
  },
});

const MemberEBAssesment =
  mongoose.models.MemberEBAssesment ||
  mongoose.model("MemberEBAssesment", MemberEBAssesmentSchema);

export default MemberEBAssesment;
