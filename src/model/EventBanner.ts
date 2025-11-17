import mongoose from "mongoose";

const EventBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    targetUrl: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    eventDate: {
      type: Date,
      required: false,
    },
    eventEndDate: {
      type: Date,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: false,
    },
    isExclusive: {
      type: Boolean,
      default: false,
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
EventBannerSchema.index({ isActive: 1, createdAt: -1 });
EventBannerSchema.index({ isActive: 1, eventDate: 1 });
EventBannerSchema.index({ isActive: 1, eventEndDate: 1 });

const EventBanner =
  mongoose.models.EventBanner ||
  mongoose.model("EventBanner", EventBannerSchema);

export default EventBanner;
