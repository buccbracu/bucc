/**
 * Uploads an image to Cloudinary via server-side API route.
 * @param file - The file to upload (as a `File` object).
 * @param folder - The folder path in Cloudinary (e.g., 'blog', 'pr').
 * @returns A promise resolving to the uploaded image's secure URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
}
