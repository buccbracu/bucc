import mongoose from "mongoose";
const { Schema } = mongoose;

//TODO

const UserAuthSchema = new mongoose.Schema({
    
    userId: { type: Schema.Types.ObjectId, ref: 'UserInfo', required: true }
})