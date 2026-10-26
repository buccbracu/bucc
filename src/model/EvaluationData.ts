import mongoose from "mongoose";

const EvaluationDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bracuDepartment: {
    type: String,
    required: true,
  },
  buccDepartment: {
    type: String,
    required: true,
  },
  responseObject: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Submitted", "Accepted", "Rejected"],
  },
  interviewTakenBy: {
    type: [String],
    default: [],
  },
  comment: {
    type: mongoose.Schema.Types.Mixed,
    default: "",
  },
  modifiedBy: {
    type: String,
  },
  assignedTasks: {
    type: [
      {
        department: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: mongoose.Schema.Types.Mixed, required: true },
        status: { type: String, enum: ["pending", "submitted"], default: "pending" },
        driveLink: { type: String },
        githubLink: { type: String },
        submittedAt: { type: Date },
      }
    ],
    default: [],
  },
  waitingRoomStatus: {
    type: String,
    enum: ["Waiting", "Sent to Board", null],
    default: null,
  },
  waitingRoomCheckedInAt: {
    type: Date,
    default: null,
  },
});

const EvaluationData =
  mongoose.models.EvaluationData ||
  mongoose.model("EvaluationData", EvaluationDataSchema);

export default EvaluationData;
