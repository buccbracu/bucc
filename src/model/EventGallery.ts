import mongoose from "mongoose";

const EventGallerySchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    order: {
      type: String,
      default: "0",
    },
  },
  {
    timestamps: true,
  }
);

const EventGallery =
  mongoose.models.EventGallery ||
  mongoose.model("EventGallery", EventGallerySchema);

export default EventGallery;
