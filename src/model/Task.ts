import mongoose from "mongoose";

const departments = [
  "Governing Body",
  "Communication and Marketing",
  "Creative",
  "Event Management",
  "Finance",
  "Human Resources",
  "Press Release and Publications",
  "Research and Development",
];

const designations = [
  "President",
  "Vice President",
  "General Secretary",
  "Treasurer",
  "Director",
  "Assistant Director",
  "Senior Executive",
  "Executive",
  "General Member",
];

const TaskSchema = new mongoose.Schema({
  taskTitle: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  fromDept: {
    type: String,
    required: true,
    enum: departments,
  },
  fromDesignation: {
    type: String,
    required: true,
    enum: designations,
  },
  toDept: {
    type: String,
    required: true,
    enum: departments,
  },
  toDesignation: {
    type: String,
    required: true,
    enum: designations,
  },
  assignDate: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
  acceptedBy: {
    type: [String],
    default: [],
  },
  dateCompleted: {
    type: Date,
  },
  comment: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending",
  },
});

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
