/**
 * Uploads an image to Cloudinary.
 * @param file - The file to upload (as a `File` object).
 * @param folder - The folder path in Cloudinary (e.g., 'blog', 'pr').
 * @returns A promise resolving to the uploaded image's secure URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "bucc_blog_pr"); // Replace with your Cloudinary preset
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
}
