import mongoose from "mongoose";

const GallerySettingSchema = new mongoose.Schema(
  {
    isGalleryEnabled: {
      type: Boolean,
      default: true,
      required: true,
    },
    galleryTitle: {
      type: String,
      default: "Event Gallery",
    },
    galleryDescription: {
      type: String,
      default: "Browse photos from our events",
    },
    showEventCount: {
      type: Boolean,
      default: true,
      required: true,
    },
    showPhotoCount: {
      type: Boolean,
      default: true,
      required: true,
    },
    cardsPerRow: {
      type: String,
      default: "3",
    },
    enableLightbox: {
      type: Boolean,
      default: true,
      required: true,
    },
    showCaptions: {
      type: Boolean,
      default: true,
      required: true,
    },
    featuredEventIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const GallerySetting =
  mongoose.models.GallerySetting ||
  mongoose.model("GallerySetting", GallerySettingSchema);

export default GallerySetting;
