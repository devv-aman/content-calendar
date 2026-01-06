import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../../constants/messages.js";
import { sendSuccess } from "../../utils/response.js";
import { ValidationError } from "../../utils/errors.js";
import * as postsService from "./posts.service.js";
import { POSTS_CONSTANTS } from "./posts.constants.js";
import type { JwtPayload } from "../../types/index.js";
import type {
  CreatePostInput,
  UpdatePostInput,
  PostsQueryInput,
  PostIdParam,
} from "./posts.schema.js";
import type { FileUploadData } from "../../models/post.model.js";

/**
 * Extract file data from multer request
 */
const extractFileData = (req: Request): FileUploadData | undefined => {
  const file = req.file as Express.Multer.File | undefined;
  if (!file) return undefined;

  // Validate file type
  if (
    !POSTS_CONSTANTS.FILE.ALLOWED_MIME_TYPES.includes(
      file.mimetype as (typeof POSTS_CONSTANTS.FILE.ALLOWED_MIME_TYPES)[number]
    )
  ) {
    throw new ValidationError(MESSAGES.POSTS.INVALID_FILE_TYPE);
  }

  // Validate file size
  if (file.size > POSTS_CONSTANTS.FILE.MAX_SIZE) {
    throw new ValidationError(MESSAGES.POSTS.FILE_TOO_LARGE);
  }

  return {
    buffer: file.buffer,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  };
};

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     description: Create a new content calendar post with optional file attachment
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - channel
 *               - scheduled_time
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the post
 *                 maxLength: 255
 *               content:
 *                 type: string
 *                 description: Content of the post
 *                 maxLength: 10000
 *               channel:
 *                 type: string
 *                 description: Comma-separated list of channels (e.g., "twitter,instagram,linkedin")
 *                 example: "twitter,instagram"
 *               scheduled_time:
 *                 type: string
 *                 description: Scheduled time in YYYY-MM-DD HH:MM:SS format
 *                 example: "2026-01-15 14:30:00"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional file attachment (max 10MB)
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as JwtPayload;
    const input = req.body as CreatePostInput;
    const fileData = extractFileData(req);

    const post = await postsService.createPost(user.userId, input, fileData);

    sendSuccess(res, 201, MESSAGES.POSTS.CREATED, post);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/posts:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts
 *     description: Get all posts for the authenticated user with optional filters
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: channel
 *         schema:
 *           type: string
 *           enum: [twitter, facebook, instagram, youtube, linkedin]
 *         description: Filter posts that include this channel
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter posts scheduled on or after this date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter posts scheduled on or before this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Posts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const list = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as JwtPayload;
    const query = req.query as PostsQueryInput;

    const posts = await postsService.getPosts(user.userId, query);

    sendSuccess(res, 200, MESSAGES.POSTS.LIST_FETCHED, posts);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get a post by ID
 *     description: Get a single post by its ID
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as JwtPayload;
    const { id } = req.params as PostIdParam;

    const post = await postsService.getPostById(user.userId, id);

    sendSuccess(res, 200, MESSAGES.POSTS.FETCHED, post);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     summary: Update a post
 *     description: Update an existing post. Only the owner can update.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the post
 *                 maxLength: 255
 *               content:
 *                 type: string
 *                 description: Content of the post
 *                 maxLength: 10000
 *               channel:
 *                 type: string
 *                 description: Comma-separated list of channels (e.g., "twitter,instagram,linkedin")
 *                 example: "twitter,instagram"
 *               scheduled_time:
 *                 type: string
 *                 description: Scheduled time in YYYY-MM-DD HH:MM:SS format
 *                 example: "2026-01-15 14:30:00"
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Optional file attachment (max 10MB)
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as JwtPayload;
    const { id } = req.params as PostIdParam;
    const input = req.body as UpdatePostInput;
    const fileData = extractFileData(req);

    const post = await postsService.updatePost(
      user.userId,
      id,
      input,
      fileData
    );

    sendSuccess(res, 200, MESSAGES.POSTS.UPDATED, post);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     tags:
 *       - Posts
 *     summary: Delete a post
 *     description: Soft delete a post. Only the owner can delete.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - not the owner
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as JwtPayload;
    const { id } = req.params as PostIdParam;

    await postsService.deletePost(user.userId, id);

    sendSuccess(res, 200, MESSAGES.POSTS.DELETED);
  } catch (error) {
    next(error);
  }
};
