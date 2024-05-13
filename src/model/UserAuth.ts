import { verify } from "crypto";
import mongoose from "mongoose";
const { Schema } = mongoose;

const userRoles = ['X_GB', 'CNM_EB', 'CR_EB', 'EM_EB', 'FN_EB', 'HR_EB', 'PR_EB', 'RND_EB', 'MEMBER'];

const UserAuthSchema = new mongoose.Schema({
    
    userId: { type: Schema.Types.ObjectId, ref: 'UserInfo', required: true, index: true },
    userRoles:{
        type: [String],
        required: [true, 'Please provide a role'],
        enum: userRoles, //Only Predefined Values from the above memberRoles array.
        default: ['MEMBER']
    },
    passwordHash: { 
        type: String, 
        required: true },
    verifyToken:{
        type: String,
        required: false
    },
    verifyTokenExpiry:{
        type: Date,
        required: false
    },
    resetToken:{
        type: String,
        required: false
    },
    resetTokenExpiry:{
        type: Date,
        required: false
    },
    isVerified:{
        type: Boolean,
        required: true,
        default: false
    }
})

const UserAuth = mongoose.models.UserAuth || mongoose.model('UserAuth', UserAuthSchema);

export default UserAuth;