import { error } from "console";
import mongoose from "mongoose";

const allowedSocials = ['github', 'linkedin', 'facebook'];

const MemberSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    student_id: {
        type: String,
        required: false,
    },
    gsuite_email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, 'Email already exists']
    },
    personal_email: {
        type: String,
        required: false,
        unique: true
    },
    contact_number: {
        type: String,
        required: false,
        unique: true
    },
    joined_bracu: {
        type: String,
        required: false
    },
    department_bracu: {
        type: String,
        required: false
    },
    profile_image_url:{
        type: String,
        required: false
    },
    rfid:{
        type: String,
        required: false,
        unique: true
    },
    date_of_birth:{
        type: Date,
        required: false
    },
    blood_group:{
        type: String,
        required: false
    },
    assigned_bucc_department:{
        type: String,
        required: false
    },
    emergency_contact_number:{
        type: String,
        required: false
    },
    joined_bucc:{
        type: String,
        required: false
    },
    last_promotion:{
        type: String,
        required: false
    },
    member_status:{
        type: String,
        required: false,
        default: 'Pending'
    },
    member_skills:{
        type: [String],
        required: false
    },
    member_socials:{ // NEEDS SERVER SIDE VALIDATION TO PREVENT ARBITRARY DATA INJECTION
        type: Map,
        of: String,
        validate: {
            validator: function(v: any) {
                return Object.keys(v).every(key => allowedSocials.includes(key));
            },
            message: (props: { value: any; }) => `${props.value} is not a valid social media platform`

        }

    },
    eb_assesment_details: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MemberEBAssesment'
    },


});

const MemberInfo = mongoose.models.MemberInfo || mongoose.model('MemberInfo', MemberSchema);
export default MemberInfo;