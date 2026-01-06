# Calendar Posts API Reference

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

All endpoints require authentication via HTTP-only cookie. Login first to obtain the cookie.

---

## Create Post

Create a new scheduled post with optional file attachment. Posts can be scheduled for multiple channels.

**Endpoint:** `POST /posts`

**Content-Type:** `multipart/form-data`

**Request Body:**

| Field          | Type   | Required | Description                                                   |
| -------------- | ------ | -------- | ------------------------------------------------------------- |
| title          | string | Yes      | Post title (max 255 chars)                                    |
| content        | string | Yes      | Post content (max 10000 chars)                                |
| channel        | string | Yes      | Comma-separated channels (e.g., "twitter,instagram,linkedin") |
| scheduled_time | string | Yes      | Format: YYYY-MM-DD HH:MM:SS                                   |
| file           | file   | No       | Attachment (max 10MB)                                         |

**curl Example:**

```bash
# Single channel
curl -X POST http://localhost:3000/api/v1/posts \
  -b "access_token=YOUR_TOKEN" \
  -F "title=My First Post" \
  -F "content=Hello world! This is my first scheduled post." \
  -F "channel=twitter" \
  -F "scheduled_time=2026-01-15 14:30:00"

# Multiple channels
curl -X POST http://localhost:3000/api/v1/posts \
  -b "access_token=YOUR_TOKEN" \
  -F "title=Cross-Platform Announcement" \
  -F "content=Exciting news coming to all our social channels!" \
  -F "channel=twitter,instagram,linkedin" \
  -F "scheduled_time=2026-01-15 14:30:00"

# With file attachment
curl -X POST http://localhost:3000/api/v1/posts \
  -b "access_token=YOUR_TOKEN" \
  -F "title=My First Post" \
  -F "content=Check out this image!" \
  -F "channel=instagram,facebook" \
  -F "scheduled_time=2026-01-15 14:30:00" \
  -F "file=@/path/to/image.jpg"
```

**Response (201):**

```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Cross-Platform Announcement",
    "content": "Exciting news coming to all our social channels!",
    "channel": ["twitter", "instagram", "linkedin"],
    "scheduled_time": "2026-01-15T14:30:00.000Z",
    "file_url": null,
    "file_name": null,
    "file_type": null,
    "created_at": "2026-01-06T10:00:00.000Z",
    "updated_at": "2026-01-06T10:00:00.000Z"
  }
}
```

---

## Get Posts

Retrieve all posts for the authenticated user with optional filters.

**Endpoint:** `GET /posts`

**Query Parameters:**

| Parameter  | Type   | Required | Description                            |
| ---------- | ------ | -------- | -------------------------------------- |
| channel    | string | No       | Filter posts that include this channel |
| start_date | string | No       | Filter posts on or after (YYYY-MM-DD)  |
| end_date   | string | No       | Filter posts on or before (YYYY-MM-DD) |

**curl Examples:**

```bash
# Get all posts
curl -X GET http://localhost:3000/api/v1/posts \
  -b "access_token=YOUR_TOKEN"

# Filter by channel (returns posts that include twitter)
curl -X GET "http://localhost:3000/api/v1/posts?channel=twitter" \
  -b "access_token=YOUR_TOKEN"

# Filter by date range
curl -X GET "http://localhost:3000/api/v1/posts?start_date=2026-01-01&end_date=2026-01-31" \
  -b "access_token=YOUR_TOKEN"

# Combined filters
curl -X GET "http://localhost:3000/api/v1/posts?channel=instagram&start_date=2026-01-15" \
  -b "access_token=YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "message": "Posts fetched successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "My First Post",
      "content": "Hello world!",
      "channel": ["twitter", "linkedin"],
      "scheduled_time": "2026-01-15T14:30:00.000Z",
      "file_url": null,
      "file_name": null,
      "file_type": null,
      "created_at": "2026-01-06T10:00:00.000Z",
      "updated_at": "2026-01-06T10:00:00.000Z"
    }
  ]
}
```

---

## Get Post by ID

Retrieve a single post by its ID.

**Endpoint:** `GET /posts/:id`

**curl Example:**

```bash
curl -X GET http://localhost:3000/api/v1/posts/550e8400-e29b-41d4-a716-446655440000 \
  -b "access_token=YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post fetched successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "My First Post",
    "content": "Hello world!",
    "channel": ["twitter", "instagram"],
    "scheduled_time": "2026-01-15T14:30:00.000Z",
    "file_url": "https://supabase.co/.../image.jpg",
    "file_name": "image.jpg",
    "file_type": "image/jpeg",
    "created_at": "2026-01-06T10:00:00.000Z",
    "updated_at": "2026-01-06T10:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Post not found"
}
```

---

## Update Post

Update an existing post. Only the owner can update.

**Endpoint:** `PUT /posts/:id`

**Content-Type:** `multipart/form-data`

**Request Body:** (all fields optional)

| Field          | Type   | Required | Description                                                   |
| -------------- | ------ | -------- | ------------------------------------------------------------- |
| title          | string | No       | Post title (max 255 chars)                                    |
| content        | string | No       | Post content (max 10000 chars)                                |
| channel        | string | No       | Comma-separated channels (e.g., "twitter,instagram,linkedin") |
| scheduled_time | string | No       | Format: YYYY-MM-DD HH:MM:SS                                   |
| file           | file   | No       | New attachment (replaces existing)                            |

**curl Example:**

```bash
# Update title and content
curl -X PUT http://localhost:3000/api/v1/posts/550e8400-e29b-41d4-a716-446655440000 \
  -b "access_token=YOUR_TOKEN" \
  -F "title=Updated Title" \
  -F "content=Updated content here"

# Update channels
curl -X PUT http://localhost:3000/api/v1/posts/550e8400-e29b-41d4-a716-446655440000 \
  -b "access_token=YOUR_TOKEN" \
  -F "channel=twitter,facebook,youtube"

# Update with new file
curl -X PUT http://localhost:3000/api/v1/posts/550e8400-e29b-41d4-a716-446655440000 \
  -b "access_token=YOUR_TOKEN" \
  -F "file=@/path/to/new-image.jpg"
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated Title",
    "content": "Updated content here",
    "channel": ["twitter", "facebook", "youtube"],
    "scheduled_time": "2026-01-15T14:30:00.000Z",
    "file_url": null,
    "file_name": null,
    "file_type": null,
    "created_at": "2026-01-06T10:00:00.000Z",
    "updated_at": "2026-01-06T12:00:00.000Z"
  }
}
```

**Error Response (403):**

```json
{
  "success": false,
  "message": "You are not authorized to modify this post"
}
```

---

## Delete Post

Soft delete a post. Only the owner can delete.

**Endpoint:** `DELETE /posts/:id`

**curl Example:**

```bash
curl -X DELETE http://localhost:3000/api/v1/posts/550e8400-e29b-41d4-a716-446655440000 \
  -b "access_token=YOUR_TOKEN"
```

**Response (200):**

```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## Channels

Valid channel values (can be combined):

- `twitter`
- `facebook`
- `instagram`
- `youtube`
- `linkedin`

Posts can be scheduled for multiple channels at once by providing a comma-separated list.

---

## Allowed File Types

| Category     | Extensions                | MIME Types                                                                                                   |
| ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Images       | jpg, jpeg, png, gif, webp | image/jpeg, image/png, image/gif, image/webp                                                                 |
| Documents    | pdf, doc, docx            | application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| Spreadsheets | xls, xlsx                 | application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet                  |
| Videos       | mp4, mov                  | video/mp4, video/quicktime                                                                                   |

**Max file size:** 10MB

---

## Error Responses

| Status | Description                               |
| ------ | ----------------------------------------- |
| 401    | Unauthorized - missing or invalid token   |
| 403    | Forbidden - not the owner of the resource |
| 404    | Not Found - resource does not exist       |
| 422    | Validation Error - invalid input data     |
| 500    | Internal Server Error                     |

**Example Error Response:**

```json
{
  "success": false,
  "message": "Validation failed: channel: Invalid channel. Must be one of: twitter, facebook, instagram, youtube, linkedin"
}
```

---

## TypeScript Types (for Frontend)

```typescript
type PostChannel =
  | "twitter"
  | "facebook"
  | "instagram"
  | "youtube"
  | "linkedin";

interface Post {
  id: string;
  user_id: string;
  title: string;
  content: string;
  channel: PostChannel[]; // Array of channels
  scheduled_time: string; // ISO 8601 format
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

interface CreatePostInput {
  title: string;
  content: string;
  channel: string; // Comma-separated channels for form-data
  scheduled_time: string; // Format: "YYYY-MM-DD HH:MM:SS"
  file?: File;
}

interface UpdatePostInput {
  title?: string;
  content?: string;
  channel?: string; // Comma-separated channels for form-data
  scheduled_time?: string;
  file?: File;
}

interface PostsQueryParams {
  channel?: PostChannel; // Filter by single channel
  start_date?: string; // Format: "YYYY-MM-DD"
  end_date?: string; // Format: "YYYY-MM-DD"
}
```
