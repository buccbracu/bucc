import mongoose from "mongoose";
import { comment } from "postcss";

const allowedStatuses = ["Pending", "Accepted", "Rejected"];

const MemberEBAssesmentSchema = new mongoose.Schema({

    student_id: {
        type: String,
        required: true,
        unique: true,
        ref: 'PreregMemberInfo'
    }, 
 	inteview_taken_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'UserAuth'

    },
    assigned_department: {
        type: String,
        required: true,
        default: "Not Assigned"
    },
    status: {
        type: String,
        required: true,
        default: "Pending",
        enum: allowedStatuses
    },
    comment: {
        type: String,
        required: true
    }

    //TODO: RESPONSE OBJECT FROM SURVEYJS

})