import mongoose from "mongoose";

const allowedStatuses = ["Pending", "Accepted", "Rejected"];

const MemberEBAssesmentSchema = new mongoose.Schema({
  studentId: {
    type: Number,
    required: true,
    unique: true,
  },
  gSuiteEmail: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  inteviewTakenBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "UserAuth", // Fix: List of EBs name
  },

  assignedDepartment: {
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
