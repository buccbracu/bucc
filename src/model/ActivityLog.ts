import mongoose, { Schema } from "mongoose";

export interface IActivityLog extends mongoose.Document {
  actor: {
    id?: string;
    name: string;
    email?: string;
    designation?: string;
    department?: string;
  };
  method: "POST" | "PATCH" | "PUT" | "DELETE";
  category: "Recruitment" | "Members" | "Events" | "Blogs" | "Projects" | "System";
  action: string;
  summary: string;
  targetId?: string;
  targetName?: string;
  details?: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    metadata?: any;
  };
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    actor: {
      id: { type: String },
      name: { type: String, required: true },
      email: { type: String },
      designation: { type: String },
      department: { type: String },
    },
    method: {
      type: String,
      enum: ["POST", "PATCH", "PUT", "DELETE"],
      required: true,
      default: "POST",
    },
    category: {
      type: String,
      enum: ["Recruitment", "Members", "Events", "Blogs", "Projects", "System"],
      required: true,
      default: "Recruitment",
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      index: true,
    },
    targetName: {
      type: String,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries & sorting by timestamp
ActivityLogSchema.index({ createdAt: -1, category: 1 });
ActivityLogSchema.index({ "actor.name": 1, createdAt: -1 });

const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);

export default ActivityLog;
