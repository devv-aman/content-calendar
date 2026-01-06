export { default as postsRoutes } from "./posts.routes.js";
export * as postsController from "./posts.controller.js";
export * as postsService from "./posts.service.js";
export {
  createPostSchema,
  updatePostSchema,
  postsQuerySchema,
  postIdParamSchema,
  type CreatePostInput,
  type UpdatePostInput,
  type PostsQueryInput,
  type PostIdParam,
} from "./posts.schema.js";
export {
  POSTS_CONSTANTS,
  type Channel,
  type AllowedMimeType,
} from "./posts.constants.js";
