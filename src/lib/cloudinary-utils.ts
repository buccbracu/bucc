/**
 * Extracts the public ID from a Cloudinary URL.
 * @param url - The Cloudinary URL of the image.
 * @returns The public ID, including folder paths if present.
 * @throws Error if the URL is invalid or the public ID cannot be extracted.
 */
export function extractPublicId(url: string): string {
  const urlWithoutParams = url.split("?")[0]; // Remove query parameters if present
  const parts = urlWithoutParams.split("/");
  const fileNameWithExtension = parts.pop(); // Get the last part of the URL
  if (!fileNameWithExtension) throw new Error("Invalid Cloudinary URL");

  // Remove file extension to get the public ID
  const publicId = fileNameWithExtension.split(".").slice(0, -1).join(".");
  if (!publicId) throw new Error("Could not extract publicId from URL");

  return parts.length > 0 ? `${parts.join("/")}/${publicId}` : publicId; // Include folder path if any
}
