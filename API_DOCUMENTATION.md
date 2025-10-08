# INSTOK API Documentation

Complete API reference for the INSTOK backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "bio": "",
    "avatar": "",
    "followers": [],
    "following": [],
    "posts": [],
    "isPrivate": false,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

---

### Login User

Authenticate an existing user.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  }
}
```

---

### Get Current User

Get authenticated user's profile.

**Endpoint:** `GET /api/auth/me`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "bio": "Software Developer",
  "avatar": "/uploads/avatar-123.jpg",
  "followers": ["507f191e810c19729de860ea"],
  "following": ["507f191e810c19729de860eb"],
  "posts": ["507f191e810c19729de860ec"],
  "isPrivate": false
}
```

---

## User Endpoints

### Get User Profile

Get a user's profile by username.

**Endpoint:** `GET /api/users/:username`

**Response:** `200 OK`
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "fullName": "John Doe",
  "bio": "Software Developer",
  "avatar": "/uploads/avatar-123.jpg",
  "followers": [...],
  "following": [...],
  "posts": [...],
  "isPrivate": false
}
```

---

### Get User Posts

Get all posts from a specific user.

**Endpoint:** `GET /api/users/:username/posts`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": {...},
    "images": ["/uploads/post-123.jpg"],
    "caption": "Beautiful sunset!",
    "likes": [...],
    "comments": [...]
  }
]
```

---

### Follow User

Follow a user.

**Endpoint:** `POST /api/users/:userId/follow`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "User followed successfully"
}
```

---

### Unfollow User

Unfollow a user.

**Endpoint:** `DELETE /api/users/:userId/follow`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "User unfollowed successfully"
}
```

---

### Search Users

Search for users by username or full name.

**Endpoint:** `GET /api/users/search/:query`

**Example:** `GET /api/users/search/john`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "fullName": "John Doe",
    "avatar": "/uploads/avatar-123.jpg",
    "followers": [...],
    "following": [...]
  }
]
```

---

## Post Endpoints

### Get Feed Posts

Get posts from followed users (requires authentication).

**Endpoint:** `GET /api/posts/feed`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": "/uploads/avatar-123.jpg"
    },
    "images": ["/uploads/post-123.jpg"],
    "caption": "Amazing view!",
    "location": "New York, NY",
    "tags": ["travel", "photography"],
    "mentions": [],
    "type": "image",
    "likes": [...],
    "comments": [...],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

---

### Get Public Posts

Get all public posts (no authentication required).

**Endpoint:** `GET /api/posts/public`

**Response:** `200 OK` (same format as feed)

---

### Create Post

Create a new post.

**Endpoint:** `POST /api/posts`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image or video file (required)
- `caption`: Post caption
- `location`: Location tag
- `tags`: JSON array of tags
- `mentions`: JSON array of mentioned users
- `type`: "image" or "video"
- `filters`: JSON object with filter values
- `crop`: JSON object with crop values
- `sound`: JSON object with sound settings

**Example:**
```javascript
const formData = new FormData();
formData.append('file', imageFile);
formData.append('caption', 'Beautiful sunset!');
formData.append('location', 'California');
formData.append('tags', JSON.stringify(['sunset', 'nature']));
formData.append('type', 'image');
```

**Response:** `201 Created`
```json
{
  "_id": "507f191e810c19729de860ea",
  "user": {...},
  "images": ["/uploads/post-123.jpg"],
  "caption": "Beautiful sunset!",
  "location": "California",
  "tags": ["sunset", "nature"],
  "type": "image",
  "likes": [],
  "comments": []
}
```

---

### Like/Unlike Post

Toggle like on a post.

**Endpoint:** `POST /api/posts/:postId/like`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "isLiked": true,
  "likesCount": 42
}
```

---

### Unlike Post

Remove like from a post.

**Endpoint:** `DELETE /api/posts/:postId/like`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "isLiked": false,
  "likesCount": 41
}
```

---

## Comment Endpoints

### Get Post Comments

Get all comments for a post.

**Endpoint:** `GET /api/comments/post/:postId`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": "/uploads/avatar-123.jpg"
    },
    "post": "507f191e810c19729de860eb",
    "text": "Great photo!",
    "likes": [],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

---

### Create Comment

Add a comment to a post.

**Endpoint:** `POST /api/comments`

**Headers:** 
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "postId": "507f191e810c19729de860ea",
  "text": "Amazing photo!"
}
```

**Response:** `201 Created`
```json
{
  "_id": "507f191e810c19729de860ec",
  "user": {...},
  "post": "507f191e810c19729de860ea",
  "text": "Amazing photo!",
  "likes": [],
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

---

### Like Comment

Like a comment.

**Endpoint:** `POST /api/comments/:commentId/like`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "isLiked": true,
  "likesCount": 5
}
```

---

### Delete Comment

Delete a comment (owner only).

**Endpoint:** `DELETE /api/comments/:commentId`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Comment deleted successfully"
}
```

---

## Story Endpoints

### Get All Stories

Get all active stories (not expired).

**Endpoint:** `GET /api/stories`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": "/uploads/avatar-123.jpg"
    },
    "image": "/uploads/story-123.jpg",
    "expiresAt": "2023-01-02T00:00:00.000Z",
    "viewers": [...],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

---

### Get User Stories

Get stories from a specific user.

**Endpoint:** `GET /api/stories/user/:userId`

**Response:** `200 OK` (same format as all stories)

---

### Create Story

Create a new story.

**Endpoint:** `POST /api/stories`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `image`: Image file (required)

**Response:** `201 Created`
```json
{
  "_id": "507f191e810c19729de860ea",
  "user": {...},
  "image": "/uploads/story-123.jpg",
  "expiresAt": "2023-01-02T00:00:00.000Z",
  "viewers": []
}
```

---

### View Story

Mark a story as viewed.

**Endpoint:** `POST /api/stories/:storyId/view`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Story viewed"
}
```

---

### Delete Story

Delete a story (owner only).

**Endpoint:** `DELETE /api/stories/:storyId`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "Story deleted successfully"
}
```

---

## Message Endpoints

### Get Conversations

Get list of all conversations.

**Endpoint:** `GET /api/messages/conversations`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": "/uploads/avatar-123.jpg"
    },
    "lastMessage": {
      "_id": "507f191e810c19729de860ea",
      "sender": {...},
      "receiver": {...},
      "text": "Hello!",
      "isRead": false,
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    "unreadCount": 3
  }
]
```

---

### Get Messages with User

Get all messages with a specific user.

**Endpoint:** `GET /api/messages/:userId`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "sender": {...},
    "receiver": {...},
    "text": "Hello!",
    "image": "",
    "isRead": true,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

---

### Send Message

Send a message to a user.

**Endpoint:** `POST /api/messages`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `receiverId`: User ID of receiver (required)
- `text`: Message text (required)
- `image`: Optional image file

**Response:** `201 Created`
```json
{
  "_id": "507f191e810c19729de860ea",
  "sender": {...},
  "receiver": {...},
  "text": "Hello!",
  "image": "",
  "isRead": false,
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

---

### Mark Message as Read

Mark a message as read.

**Endpoint:** `PUT /api/messages/:messageId/read`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "507f191e810c19729de860ea",
  "sender": {...},
  "receiver": {...},
  "text": "Hello!",
  "isRead": true
}
```

---

## Notification Endpoints

### Get Notifications

Get all notifications for the current user.

**Endpoint:** `GET /api/notifications`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
[
  {
    "_id": "507f191e810c19729de860ea",
    "user": "507f1f77bcf86cd799439011",
    "sender": {
      "_id": "507f191e810c19729de860eb",
      "username": "janedoe",
      "fullName": "Jane Doe",
      "avatar": "/uploads/avatar-456.jpg"
    },
    "type": "like",
    "post": "507f191e810c19729de860ec",
    "text": "janedoe liked your post",
    "isRead": false,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

**Notification Types:**
- `like`: User liked your post
- `comment`: User commented on your post
- `follow`: User followed you
- `mention`: User mentioned you

---

### Get Unread Count

Get count of unread notifications.

**Endpoint:** `GET /api/notifications/unread-count`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "count": 5
}
```

---

### Mark Notification as Read

Mark a specific notification as read.

**Endpoint:** `PUT /api/notifications/:notificationId/read`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "_id": "507f191e810c19729de860ea",
  "isRead": true,
  ...
}
```

---

### Mark All as Read

Mark all notifications as read.

**Endpoint:** `PUT /api/notifications/read-all`

**Headers:** 
- `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "message": "All notifications marked as read"
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Invalid credentials"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

## CORS

CORS is enabled for all origins in development. Configure appropriately for production.

## File Uploads

- Maximum file size: 50MB for videos, 10MB for images
- Supported formats: JPEG, PNG, GIF, MP4, MOV
- Files are stored in the `uploads/` directory

---

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"password123","fullName":"John Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import the API collection
2. Set base URL: `http://localhost:5000/api`
3. For authenticated requests, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`

---

**Version:** 1.0.0  
**Last Updated:** 2023

