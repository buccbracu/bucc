import mongoose from "mongoose";

const intakes = ["Spring", "Summer", "Fall"];

// TODO: SINGLE INTAKE, START END DATE NOT NEEDED, TOGGLE with isActive Boolean

const IntakeShema = new mongoose.Schema({

    intake: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        enum: intakes
    },
    intake_start_date: {
        type: Date,
        required: true
    },
    intake_end_date: {
        type: Date,
        required: true
    },
    assesment_form_link: {
        type: String,
        required: true
    },
    assesment_sheet_link: {
        type: String,
        required: true
    },
    is_intake_active: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Intake = mongoose.models.Intake || mongoose.model('Intake', IntakeShema);

export default Intake;