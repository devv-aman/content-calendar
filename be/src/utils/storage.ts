import { supabase } from "../config/database.js";
import { DATABASE } from "../constants/database.js";
import { MESSAGES } from "../constants/messages.js";
import { AppError } from "./errors.js";

const BUCKET_NAME = DATABASE.STORAGE.BUCKETS.ATTACHMENTS;

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  userId: string,
  postId: string,
  fileName: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<UploadResult> => {
  const filePath = `users/${userId}/posts/${postId}/${fileName}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error("Supabase storage upload error:", error.message);
    throw new AppError(
      `${MESSAGES.POSTS.FILE_UPLOAD_FAILED}: ${error.message}`,
      500
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return {
    url: publicUrl,
    path: filePath,
  };
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    console.error("Failed to delete file:", error.message);
  }
};

/**
 * Delete all files for a post
 */
export const deletePostFiles = async (
  userId: string,
  postId: string
): Promise<void> => {
  const folderPath = `users/${userId}/posts/${postId}`;

  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folderPath);

  if (listError || !files || files.length === 0) {
    return;
  }

  const filePaths = files.map((file) => `${folderPath}/${file.name}`);

  const { error: deleteError } = await supabase.storage
    .from(BUCKET_NAME)
    .remove(filePaths);

  if (deleteError) {
    console.error("Failed to delete post files:", deleteError.message);
  }
};

/**
 * Extract file path from public URL
 */
export const getFilePathFromUrl = (publicUrl: string | null): string | null => {
  if (!publicUrl) return null;

  const bucketPath = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const index = publicUrl.indexOf(bucketPath);

  if (index === -1) return null;

  return publicUrl.substring(index + bucketPath.length);
};
