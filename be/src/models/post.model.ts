export type PostChannel =
  | "twitter"
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin";

export interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  channel: PostChannel[];
  scheduled_time: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PostResponse {
  id: string;
  user_id: string;
  title: string;
  content: string;
  channel: PostChannel[];
  scheduled_time: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  channel: PostChannel[];
  scheduled_time: string;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  channel?: PostChannel[];
  scheduled_time?: string;
}

export interface PostsQueryParams {
  channel?: PostChannel;
  start_date?: string;
  end_date?: string;
}

export interface FileUploadData {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export const sanitizePost = (post: Post): PostResponse => {
  const { deleted_at: _deletedAt, ...postResponse } = post;
  return postResponse;
};
