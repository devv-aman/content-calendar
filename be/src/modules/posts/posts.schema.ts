import { z } from "zod";
import { MESSAGES } from "../../constants/messages.js";
import { POSTS_CONSTANTS } from "./posts.constants.js";

// Reusable channel enum for single channel
const channelEnum = z.enum(POSTS_CONSTANTS.CHANNELS, {
  errorMap: () => ({
    message:
      "Invalid channel. Must be one of: twitter, facebook, instagram, youtube, linkedin",
  }),
});

// Channel array schema for create/update (supports comma-separated string from form-data)
const channelsArraySchema = z
  .union([
    z
      .array(channelEnum)
      .min(1, { message: "At least one channel is required" }),
    z.string().transform((val) => val.split(",").map((s) => s.trim())),
  ])
  .pipe(
    z.array(channelEnum).min(1, { message: "At least one channel is required" })
  );

// Scheduled time validation (YYYY-MM-DD HH:MM:SS format)
const scheduledTimeSchema = z
  .string({ required_error: MESSAGES.VALIDATION.REQUIRED_FIELD })
  .regex(
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    "Invalid format. Use YYYY-MM-DD HH:MM:SS"
  )
  .refine(
    (val) => !isNaN(Date.parse(val.replace(" ", "T"))),
    "Invalid date/time value"
  );

// Date only validation (YYYY-MM-DD format)
const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid format. Use YYYY-MM-DD")
  .refine((val) => !isNaN(Date.parse(val)), "Invalid date value")
  .optional();

// Create post schema
export const createPostSchema = z.object({
  title: z
    .string({ required_error: MESSAGES.VALIDATION.REQUIRED_FIELD })
    .min(POSTS_CONSTANTS.VALIDATION.TITLE_MIN_LENGTH, {
      message: "Title is required",
    })
    .max(POSTS_CONSTANTS.VALIDATION.TITLE_MAX_LENGTH, {
      message: `Title must be at most ${POSTS_CONSTANTS.VALIDATION.TITLE_MAX_LENGTH} characters`,
    }),
  content: z
    .string({ required_error: MESSAGES.VALIDATION.REQUIRED_FIELD })
    .min(POSTS_CONSTANTS.VALIDATION.CONTENT_MIN_LENGTH, {
      message: "Content is required",
    })
    .max(POSTS_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH, {
      message: `Content must be at most ${POSTS_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH} characters`,
    }),
  channel: channelsArraySchema,
  scheduled_time: scheduledTimeSchema,
});

// Update post schema (all fields optional)
export const updatePostSchema = z.object({
  title: z
    .string()
    .min(POSTS_CONSTANTS.VALIDATION.TITLE_MIN_LENGTH, {
      message: "Title cannot be empty",
    })
    .max(POSTS_CONSTANTS.VALIDATION.TITLE_MAX_LENGTH, {
      message: `Title must be at most ${POSTS_CONSTANTS.VALIDATION.TITLE_MAX_LENGTH} characters`,
    })
    .optional(),
  content: z
    .string()
    .min(POSTS_CONSTANTS.VALIDATION.CONTENT_MIN_LENGTH, {
      message: "Content cannot be empty",
    })
    .max(POSTS_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH, {
      message: `Content must be at most ${POSTS_CONSTANTS.VALIDATION.CONTENT_MAX_LENGTH} characters`,
    })
    .optional(),
  channel: channelsArraySchema.optional(),
  scheduled_time: scheduledTimeSchema.optional(),
});

// Query params schema for listing posts
export const postsQuerySchema = z.object({
  channel: channelEnum.optional(),
  start_date: dateOnlySchema,
  end_date: dateOnlySchema,
});

// ID param schema
export const postIdParamSchema = z.object({
  id: z.string().uuid({ message: "Invalid post ID format" }),
});

// Types
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostsQueryInput = z.infer<typeof postsQuerySchema>;
export type PostIdParam = z.infer<typeof postIdParamSchema>;
