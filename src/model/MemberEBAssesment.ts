import mongoose from "mongoose";

const allowedStatuses = ["Pending", "Accepted", "Rejected"];

const MemberEBAssesmentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    required: true,
    unique: true,
    ref: "PreregMemberInfo",
  },

  // TODO: Add name and Gsuite email

  inteview_taken_by: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "UserAuth", // Fix: List of EBs name
  },

  assigned_department: {
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
    required: true,
  },

  //TODO: RESPONSE OBJECT FROM SURVEYJS
  responseObject: {
    type: Object,
    required: true,
  },
});

const MemberEBAssesment =
  mongoose.models.MemberEBAssesment ||
  mongoose.model("MemberEBAssesment", MemberEBAssesmentSchema);

export default MemberEBAssesment;
