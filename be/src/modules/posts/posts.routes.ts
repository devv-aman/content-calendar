import { Router, type Router as RouterType } from "express";
import multer from "multer";
import { ROUTES } from "../../constants/routes.js";
import { authenticate, validate } from "../../middlewares/index.js";
import * as postsController from "./posts.controller.js";
import {
  createPostSchema,
  updatePostSchema,
  postsQuerySchema,
  postIdParamSchema,
} from "./posts.schema.js";
import { POSTS_CONSTANTS } from "./posts.constants.js";

const router: RouterType = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: POSTS_CONSTANTS.FILE.MAX_SIZE,
  },
});

// Create post
router.post(
  "/",
  authenticate,
  upload.single("file"),
  validate({ body: createPostSchema }),
  postsController.create
);

// List posts
router.get(
  "/",
  authenticate,
  validate({ query: postsQuerySchema }),
  postsController.list
);

// Get post by ID
router.get(
  ROUTES.POSTS.BY_ID,
  authenticate,
  validate({ params: postIdParamSchema }),
  postsController.getById
);

// Update post
router.put(
  ROUTES.POSTS.BY_ID,
  authenticate,
  upload.single("file"),
  validate({ params: postIdParamSchema, body: updatePostSchema }),
  postsController.update
);

// Delete post
router.delete(
  ROUTES.POSTS.BY_ID,
  authenticate,
  validate({ params: postIdParamSchema }),
  postsController.remove
);

export default router;
