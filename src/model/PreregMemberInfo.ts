import mongoose from "mongoose";

const PreregMemberInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^[0-9]{8,10}$/.test(v);

      },
      message: (props: { value: any }) =>
        `${props.value} is not a valid student ID!`,
    },
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
  departmentBracu: {
    //TODO: ENUM Needed here for predefined departments
    type: String,
    required: true,
    trim: true,
  },
  joinedBracu: {
    type: String,
    required: true,
  },
  ebAssessmentDetails: {
    //TODO: REMOVE THIS
    type: mongoose.Schema.Types.ObjectId,
    ref: "MemberEBAssessment",
  },
});

const PreregMemberInfo =
  mongoose.models.PreregMemberInfo ||
  mongoose.model("PreregMemberInfo", PreregMemberInfoSchema);

export default PreregMemberInfo;
