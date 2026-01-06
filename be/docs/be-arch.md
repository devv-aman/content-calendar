# Backend Architecture

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (HTTP-only cookies)
- **Validation**: Zod
- **Logging**: Pino

## Project Structure

```
be/
├── src/
│   ├── config/          # Environment, database, swagger config
│   ├── constants/       # All string constants (messages, routes, errors)
│   ├── middlewares/     # Express middlewares (auth, error, logger, validate)
│   ├── models/          # Database models/types
│   ├── modules/         # Feature modules (controller, service, routes, schema)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (jwt, password, response, errors)
│   ├── app.ts           # Express app configuration
│   └── server.ts        # Entry point
├── supabase/migrations/ # SQL migrations
└── scripts/             # Utility scripts (seed, swagger)
```

## Module Pattern

Each feature follows this structure:

```
modules/
└── {feature}/
    ├── {feature}.controller.ts  # Request handlers + Swagger docs
    ├── {feature}.service.ts     # Business logic + DB operations
    ├── {feature}.routes.ts      # Route definitions
    ├── {feature}.schema.ts      # Zod validation schemas
    ├── {feature}.constants.ts   # Feature-specific constants
    └── index.ts                 # Barrel exports
```

## Request Flow

```
Request → Logger → Auth Middleware → Validate Middleware → Controller → Service → Database
                                                                ↓
Response ← Error Handler ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## Adding a New Feature

### 1. Create Constants

```typescript
// src/constants/messages.ts
export const MESSAGES = {
  POSTS: {
    CREATED: "Post created successfully",
    UPDATED: "Post updated successfully",
    DELETED: "Post deleted successfully",
    NOT_FOUND: "Post not found",
  },
};

// src/constants/routes.ts
export const ROUTES = {
  POSTS: {
    BASE: "/posts",
    BY_ID: "/:id",
  },
};
```

### 2. Create Model

```typescript
// src/models/post.model.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
```

### 3. Create Schema (Zod)

```typescript
// src/modules/posts/posts.schema.ts
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
```

### 4. Create Service

```typescript
// src/modules/posts/posts.service.ts
import { supabase } from "../../config/database.js";
import { DATABASE } from "../../constants/database.js";
import { NotFoundError } from "../../utils/index.js";

export const createPost = async (userId: string, input: CreatePostInput) => {
  const { data, error } = await supabase
    .from("posts")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
```

### 5. Create Controller

```typescript
// src/modules/posts/posts.controller.ts
import { Request, Response, NextFunction } from "express";
import { MESSAGES } from "../../constants/messages.js";
import { sendSuccess } from "../../utils/response.js";
import * as postsService from "./posts.service.js";
import type { JwtPayload } from "../../types/index.js";

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Post created
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as JwtPayload;
    const post = await postsService.createPost(user.userId, req.body);
    sendSuccess(res, 201, MESSAGES.POSTS.CREATED, post);
  } catch (error) {
    next(error);
  }
};
```

### 6. Create Routes

```typescript
// src/modules/posts/posts.routes.ts
import { Router, type Router as RouterType } from "express";
import { ROUTES } from "../../constants/routes.js";
import { authenticate, validate } from "../../middlewares/index.js";
import * as postsController from "./posts.controller.js";
import { createPostSchema } from "./posts.schema.js";

const router: RouterType = Router();

router.post(
  "/",
  authenticate,
  validate({ body: createPostSchema }),
  postsController.create
);

export default router;
```

### 7. Register Routes

```typescript
// src/app.ts
import { postsRoutes } from "./modules/posts/index.js";

// Add after authRoutes
app.use(`${apiPrefix}${ROUTES.POSTS.BASE}`, postsRoutes);
```

### 8. Create Migration

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_create_posts_table.sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Key Utilities

### Response Helpers

```typescript
import { sendSuccess, sendError } from "../utils/response.js";

sendSuccess(res, 200, "Message", data);
sendError(res, 400, "Error message");
```

### Error Classes

```typescript
import { 
  AuthenticationError,  // 401
  AuthorizationError,   // 403
  NotFoundError,        // 404
  ConflictError,        // 409
  ValidationError,      // 422
} from "../utils/errors.js";

throw new NotFoundError(MESSAGES.POSTS.NOT_FOUND);
```

### Auth Middleware

```typescript
import { authenticate, requireRole } from "../middlewares/index.js";

// Require authentication
router.get("/", authenticate, controller.list);

// Require specific role
router.delete("/:id", authenticate, requireRole("admin"), controller.delete);
```

### Validation Middleware

```typescript
import { validate } from "../middlewares/index.js";

router.post(
  "/",
  validate({ body: createSchema, params: paramsSchema, query: querySchema }),
  controller.create
);
```

## Database Access

```typescript
import { supabase } from "../config/database.js";

// Select
const { data, error } = await supabase
  .from("table")
  .select("*")
  .eq("column", value)
  .single();

// Insert
const { data, error } = await supabase
  .from("table")
  .insert({ column: value })
  .select()
  .single();

// Update
const { data, error } = await supabase
  .from("table")
  .update({ column: value })
  .eq("id", id)
  .select()
  .single();

// Soft Delete
const { error } = await supabase
  .from("table")
  .update({ deleted_at: new Date().toISOString() })
  .eq("id", id);
```

## Constants Pattern

- **Never hardcode strings** - Use constants files
- Global constants: `src/constants/`
- Feature constants: `src/modules/{feature}/{feature}.constants.ts`

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `auth.controller.ts` |
| Functions | camelCase | `createPost` |
| Types/Interfaces | PascalCase | `PostResponse` |
| Constants | UPPER_SNAKE | `MESSAGES.POSTS.CREATED` |
| DB Tables | snake_case | `user_posts` |
| DB Columns | snake_case | `created_at` |

