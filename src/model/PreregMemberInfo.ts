import mongoose from "mongoose";

const PreregMemberInfoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    student_id: {
        type: String,
        required: true,
        unique: true,

    },
    contact_number: {
        type: String,
        required: true,

    },
    personal_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Converts email to lowercase
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{+\w+})+$/, 'Please fill a valid email address'] // Email validation
    },
    gsuite_email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/, 'Please use a valid BRACU G-Suite email address'] // BRACU G-Suite email validation
    },
    department_bracu: { //ENUM Needed here for predefined departments
        type: String,
        required: true,
        trim: true
    }
})