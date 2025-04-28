const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featuredImage: {
    type: String,
    required: false,
  },
    type: {
      type: String,
      required: true,
    },
    needAttendance: {
      type: Boolean,
      default: false,
    },
    startingDate: {
      type: Date,
      required: true,
    },
    endingDate: {
      type: Date,
      required: true,
    },
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MemberInfo",
      },
    ],
    prId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PR",
      default: null,
    },
    allowedMembers: {
      type: String,
      enum: ["Any", "BUCC Members", "BRACU Students"],
      required: true,
    },
    allowedDepartments: [
      {
        type: String,
      },
    ],
    allowedDesignations: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: "createdDate", updatedAt: "lastUpdate" },
  },
);

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
export default Event;
