import { v4 as uuidv4 } from "uuid";
import { UploadResult } from "@firebase/storage";

// Function to format a filename to a unique filename with UUID
export function generateFileName(filename: string): string {
  // Extract the file extension
  const fileExtension = filename.substring(filename.lastIndexOf("."));

  // Extract the base filename without the extension
  let baseFilename = filename.substring(0, filename.lastIndexOf("."));

  // Replace special characters with hyphens
  baseFilename = baseFilename.replace(/[^a-zA-Z0-9]/g, "-");

  // Truncate the filename to 50 characters
  if (baseFilename.length > 50) {
    baseFilename = baseFilename.substring(0, 50);
  }

  // Generate a UUID v4
  const uniqueId = uuidv4();

  // Return the formatted filename
  return `${baseFilename}-${uniqueId}${fileExtension}`;
}

// Function to format a filename to a unique filename with UUID
export function generateFileURL(storageFile: UploadResult): string {
  // Construct the full Firebase Storage URL with the new filename
  const url = new URL("https://firebasestorage.googleapis.com");
  url.pathname = `/v0/b/${storageFile.metadata.bucket}/o/${encodeURIComponent(storageFile.metadata.fullPath)}`;

  const downloadTokens = Array.isArray(storageFile.metadata.downloadTokens)
    ? storageFile.metadata.downloadTokens[0]
    : storageFile.metadata.downloadTokens;

  // Add the download token to the URL

  url.searchParams.set("alt", "media");
  if (downloadTokens) {
    url.searchParams.set("token", downloadTokens);
  }
  return url.toString();
}
