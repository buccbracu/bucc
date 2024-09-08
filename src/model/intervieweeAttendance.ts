import mongoose from "mongoose";

const intervieweeAttendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  firstChoice: {
    type: String,
    required: true,
  },
  sent: {
    type: Boolean,
    default: false,
  },
  hold: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
    default: "",
  },
});

const IntervieweeAttendance =
  mongoose.models.IntervieweeAttendance ||
  mongoose.model("IntervieweeAttendance", intervieweeAttendanceSchema);
export default IntervieweeAttendance;
