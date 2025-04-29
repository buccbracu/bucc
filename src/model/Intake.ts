import mongoose, { Schema, Document } from 'mongoose';

interface IIntake extends Document {
  intakeName: string;
  intakeStartDate: Date;
  intakeEndDate: Date;
  isIntakeActive: boolean;
  isEvaluationActive: boolean;
}

const IntakeSchema: Schema = new Schema(
  {
    intakeName: {
      type: String,
      required: true,
    },
    intakeStartDate: {
      type: Date,
      required: true,
      set: (v: Date) => new Date(v.setHours(0, 0, 0, 0)), 
    },
    intakeEndDate: {
      type: Date,
      required: true,
      set: (v: Date) => new Date(v.setHours(0, 0, 0, 0)), 
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
  },
  { timestamps: true }
);

IntakeSchema.statics.createOrUpdate = async function (data: any) {
  const intake = await this.findOne(); 
  if (intake) {
    intake.intakeName = data.intakeName || intake.intakeName;
    intake.intakeStartDate = data.intakeStartDate || intake.intakeStartDate;
    intake.intakeEndDate = data.intakeEndDate || intake.intakeEndDate;
    intake.isIntakeActive = data.isIntakeActive ?? intake.isIntakeActive;
    intake.isEvaluationActive = data.isEvaluationActive ?? intake.isEvaluationActive;
    return intake.save(); 
  } else {
    
    const newIntake = new this(data);
    return newIntake.save();
  }
};


const Intake = mongoose.model<IIntake>('Intake', IntakeSchema);

export default Intake;
