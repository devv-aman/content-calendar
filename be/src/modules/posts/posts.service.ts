import { supabase } from "../../config/database.js";
import { DATABASE } from "../../constants/database.js";
import { MESSAGES } from "../../constants/messages.js";
import {
  Post,
  PostResponse,
  sanitizePost,
  FileUploadData,
} from "../../models/post.model.js";
import {
  NotFoundError,
  AuthorizationError,
  uploadFile,
  deleteFile,
  deletePostFiles,
  getFilePathFromUrl,
} from "../../utils/index.js";
import type {
  CreatePostInput,
  UpdatePostInput,
  PostsQueryInput,
} from "./posts.schema.js";

const TABLE = DATABASE.TABLES.POSTS;
const COLUMNS = DATABASE.COLUMNS.POSTS;

/**
 * Create a new post
 */
export const createPost = async (
  userId: string,
  input: CreatePostInput,
  file?: FileUploadData
): Promise<PostResponse> => {
  // First, create the post without file info to get the post ID
  const { data: post, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: userId,
      title: input.title,
      content: input.content,
      channel: input.channel,
      scheduled_time: input.scheduled_time,
    })
    .select("*")
    .single<Post>();

  if (error || !post) {
    throw new Error(error?.message || MESSAGES.DATABASE.QUERY_ERROR);
  }

  // If file provided, upload it and update the post
  if (file) {
    const uploadResult = await uploadFile(
      userId,
      post.id,
      file.originalname,
      file.buffer,
      file.mimetype
    );

    const { data: updatedPost, error: updateError } = await supabase
      .from(TABLE)
      .update({
        file_url: uploadResult.url,
        file_name: file.originalname,
        file_type: file.mimetype,
      })
      .eq(COLUMNS.ID, post.id)
      .select("*")
      .single<Post>();

    if (updateError || !updatedPost) {
      // Clean up uploaded file if post update fails
      await deleteFile(uploadResult.path);
      throw new Error(updateError?.message || MESSAGES.DATABASE.QUERY_ERROR);
    }

    return sanitizePost(updatedPost);
  }

  return sanitizePost(post);
};

/**
 * Get all posts for a user with optional filters
 */
export const getPosts = async (
  userId: string,
  query: PostsQueryInput
): Promise<PostResponse[]> => {
  let queryBuilder = supabase
    .from(TABLE)
    .select("*")
    .eq(COLUMNS.USER_ID, userId)
    .is(COLUMNS.DELETED_AT, null)
    .order(COLUMNS.SCHEDULED_TIME, { ascending: true });

  // Apply channel filter (check if array contains the channel)
  if (query.channel) {
    queryBuilder = queryBuilder.contains(COLUMNS.CHANNEL, [query.channel]);
  }

  // Apply date range filters
  if (query.start_date) {
    queryBuilder = queryBuilder.gte(
      COLUMNS.SCHEDULED_TIME,
      `${query.start_date}T00:00:00`
    );
  }

  if (query.end_date) {
    queryBuilder = queryBuilder.lte(
      COLUMNS.SCHEDULED_TIME,
      `${query.end_date}T23:59:59`
    );
  }

  const { data: posts, error } = await queryBuilder;

  if (error) {
    throw new Error(error.message);
  }

  return (posts || []).map(sanitizePost);
};

/**
 * Get a single post by ID
 */
export const getPostById = async (
  userId: string,
  postId: string
): Promise<PostResponse> => {
  const { data: post, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq(COLUMNS.ID, postId)
    .eq(COLUMNS.USER_ID, userId)
    .is(COLUMNS.DELETED_AT, null)
    .single<Post>();

  if (error || !post) {
    throw new NotFoundError(MESSAGES.POSTS.NOT_FOUND);
  }

  return sanitizePost(post);
};

/**
 * Update a post
 */
export const updatePost = async (
  userId: string,
  postId: string,
  input: UpdatePostInput,
  file?: FileUploadData
): Promise<PostResponse> => {
  // First, verify the post exists and belongs to the user
  const { data: existingPost, error: fetchError } = await supabase
    .from(TABLE)
    .select("*")
    .eq(COLUMNS.ID, postId)
    .is(COLUMNS.DELETED_AT, null)
    .single<Post>();

  if (fetchError || !existingPost) {
    throw new NotFoundError(MESSAGES.POSTS.NOT_FOUND);
  }

  if (existingPost.user_id !== userId) {
    throw new AuthorizationError(MESSAGES.POSTS.FORBIDDEN);
  }

  // Build update object
  const updateData: Record<string, unknown> = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.channel !== undefined) updateData.channel = input.channel;
  if (input.scheduled_time !== undefined) {
    updateData.scheduled_time = input.scheduled_time;
  }

  // Handle file update
  if (file) {
    // Delete old file if exists
    if (existingPost.file_url) {
      const oldFilePath = getFilePathFromUrl(existingPost.file_url);
      if (oldFilePath) {
        await deleteFile(oldFilePath);
      }
    }

    // Upload new file
    const uploadResult = await uploadFile(
      userId,
      postId,
      file.originalname,
      file.buffer,
      file.mimetype
    );

    updateData.file_url = uploadResult.url;
    updateData.file_name = file.originalname;
    updateData.file_type = file.mimetype;
  }

  // Only update if there's something to update
  if (Object.keys(updateData).length === 0) {
    return sanitizePost(existingPost);
  }

  const { data: updatedPost, error: updateError } = await supabase
    .from(TABLE)
    .update(updateData)
    .eq(COLUMNS.ID, postId)
    .select("*")
    .single<Post>();

  if (updateError || !updatedPost) {
    throw new Error(updateError?.message || MESSAGES.DATABASE.QUERY_ERROR);
  }

  return sanitizePost(updatedPost);
};

/**
 * Soft delete a post
 */
export const deletePost = async (
  userId: string,
  postId: string
): Promise<void> => {
  // First, verify the post exists and belongs to the user
  const { data: existingPost, error: fetchError } = await supabase
    .from(TABLE)
    .select("*")
    .eq(COLUMNS.ID, postId)
    .is(COLUMNS.DELETED_AT, null)
    .single<Post>();

  if (fetchError || !existingPost) {
    throw new NotFoundError(MESSAGES.POSTS.NOT_FOUND);
  }

  if (existingPost.user_id !== userId) {
    throw new AuthorizationError(MESSAGES.POSTS.FORBIDDEN);
  }

  // Soft delete the post
  const { error: deleteError } = await supabase
    .from(TABLE)
    .update({ deleted_at: new Date().toISOString() })
    .eq(COLUMNS.ID, postId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  // Delete associated files from storage
  await deletePostFiles(userId, postId);
};
