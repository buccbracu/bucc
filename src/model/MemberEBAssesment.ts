import mongoose from "mongoose";

const allowedStatuses = ["Pending", "Accepted", "Rejected"];

const MemberEBAssesmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: Number,
    required: true,
    unique: true,
  },
  gSuiteEmail: {
    type: String,
    required: true,
  },

  inteviewTakenBy: {
    type: [String],
    required: true,
  },

  modifiedBy: {
    type: String,
    required: false,
    default: "Not Modified",
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
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const MemberEBAssesment =
  mongoose.models.MemberEBAssesment ||
  mongoose.model("MemberEBAssesment", MemberEBAssesmentSchema);

export default MemberEBAssesment;
