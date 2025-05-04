const mongoose = require("mongoose");

const intakeSchema = new mongoose.Schema({
  intakeName: {
    type: String,
    required: true, 
  },
  intakeStartDate: {
    type: Date,
    required: true,
  },
  intakeEndDate: {
    type: Date,
    required: true, 
  },
  isIntakeActive: {
    type: Boolean,
    required: true, 
    default: true, 
  },
  isEvaluationActive: {
    type: Boolean,
    required: true, 
    default: true, 
  },
});


const Event = mongoose.models.Intake || mongoose.model("Intake", intakeSchema);
export default Event;
