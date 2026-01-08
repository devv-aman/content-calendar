import { apiClient } from "./axios";
import type {
  Post,
  ScheduledPost,
  CreatePostInput,
  UpdatePostInput,
  PostsQueryParams,
  ApiResponse,
  PostStatus,
} from "@/components/calendar/calendar.types";

const POSTS_ENDPOINT = "/api/v1/posts";

/**
 * Transform API Post to UI ScheduledPost
 */
export function transformPostToScheduledPost(post: Post): ScheduledPost {
  // Determine status based on scheduled_time
  const scheduledTime = new Date(post.scheduled_time);
  const now = new Date();
  let status: PostStatus = "scheduled";
  if (scheduledTime < now) {
    status = "published";
  }

  return {
    id: post.id,
    channels: post.channel,
    scheduledTime,
    title: post.title,
    content: post.content,
    status,
    fileUrl: post.file_url ?? undefined,
    fileName: post.file_name ?? undefined,
    fileType: post.file_type ?? undefined,
  };
}

/**
 * Format date as YYYY-MM-DD for API query params
 */
export function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format date and time as ISO 8601 for API form data
 * Uses toISOString() to include UTC timezone info (e.g., 2024-01-15T18:30:00.000Z)
 */
export function formatDateTimeForApi(date: Date): string {
  return date.toISOString();
}

/**
 * Fetch posts with optional filters
 */
export async function fetchPosts(
  params?: PostsQueryParams
): Promise<ScheduledPost[]> {
  const queryParams = new URLSearchParams();

  if (params?.channel) {
    queryParams.append("channel", params.channel);
  }
  if (params?.start_date) {
    queryParams.append("start_date", params.start_date);
  }
  if (params?.end_date) {
    queryParams.append("end_date", params.end_date);
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${POSTS_ENDPOINT}?${queryString}` : POSTS_ENDPOINT;

  const response = await apiClient.get<ApiResponse<Post[]>>(url);
  return response.data.data.map(transformPostToScheduledPost);
}

/**
 * Fetch a single post by ID
 */
export async function fetchPostById(id: string): Promise<ScheduledPost> {
  const response = await apiClient.get<ApiResponse<Post>>(
    `${POSTS_ENDPOINT}/${id}`
  );
  return transformPostToScheduledPost(response.data.data);
}

/**
 * Create a new post
 */
export async function createPost(
  input: CreatePostInput
): Promise<ScheduledPost> {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("content", input.content);
  formData.append("channel", input.channel);
  formData.append("scheduled_time", input.scheduled_time);

  if (input.file) {
    formData.append("file", input.file);
  }

  const response = await apiClient.post<ApiResponse<Post>>(
    POSTS_ENDPOINT,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return transformPostToScheduledPost(response.data.data);
}

/**
 * Update an existing post
 */
export async function updatePost(
  id: string,
  input: UpdatePostInput
): Promise<ScheduledPost> {
  const formData = new FormData();

  if (input.title !== undefined) {
    formData.append("title", input.title);
  }
  if (input.content !== undefined) {
    formData.append("content", input.content);
  }
  if (input.channel !== undefined) {
    formData.append("channel", input.channel);
  }
  if (input.scheduled_time !== undefined) {
    formData.append("scheduled_time", input.scheduled_time);
  }
  if (input.file) {
    formData.append("file", input.file);
  }

  const response = await apiClient.put<ApiResponse<Post>>(
    `${POSTS_ENDPOINT}/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return transformPostToScheduledPost(response.data.data);
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<void> {
  await apiClient.delete(`${POSTS_ENDPOINT}/${id}`);
}

/**
 * Extract error message from API error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for axios error response
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    return error.message;
  }
  return "An unexpected error occurred";
}
