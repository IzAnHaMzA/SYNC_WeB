# INSTOK - Instagram Clone

A full-stack Instagram clone with web and Android mobile app support. Built with React, React Native, Node.js, Express, and MongoDB.

## Features

- ✅ User authentication (Register/Login)
- ✅ Create and share posts (images/videos)
- ✅ Stories with 24-hour expiry
- ✅ Like and comment on posts
- ✅ Follow/Unfollow users
- ✅ Direct messaging
- ✅ Real-time notifications
- ✅ User profiles
- ✅ Search users
- ✅ Explore feed
- ✅ Reels/Video player
- ✅ Image filters and editing
- ✅ Android mobile app

## Tech Stack

### Frontend (Web)
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- React Query
- Framer Motion

### Mobile (Android)
- React Native 0.72
- React Navigation
- TypeScript
- Native modules for camera, image picker, etc.

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time features
- Multer for file uploads

## Project Structure

```
instok/
├── android/                 # Android native project
│   ├── app/
│   ├── gradle/
│   └── build.gradle
├── server/                  # Backend API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── utils/              # Utility functions
├── src/                    # Web frontend
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── utils/
├── uploads/                # User uploaded files
├── App.tsx                 # React Native app entry
├── index.js               # React Native index
└── package.json
```

## Prerequisites

- Node.js 18+ and npm
- MongoDB 5+
- Android Studio (for Android development)
- JDK 11 or higher
- React Native CLI

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd INSTOK
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/instok
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=52428800
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows
mongod

# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

## Running the Application

### Development Mode (Web + Backend)

Run both frontend and backend concurrently:

```bash
npm run dev:full
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run dev
```

Access the web app at: `http://localhost:5173`
Backend API at: `http://localhost:5000/api`

### Android Development

#### 1. Set up Android environment

- Install Android Studio
- Install Android SDK (API 33)
- Set up environment variables:
  - `ANDROID_HOME`: Path to Android SDK
  - Add platform-tools to PATH

#### 2. Start Metro bundler

```bash
npm start
```

#### 3. Run on Android

```bash
# Run on connected device or emulator
npm run android

# Or use React Native CLI directly
npx react-native run-android
```

#### 4. Build Android APK

```bash
# Debug build
npm run android:build

# Release build (requires signing config)
cd android && ./gradlew assembleRelease
```

The APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

## Android Studio Setup

### Opening the project in Android Studio

1. Open Android Studio
2. Select "Open an existing project"
3. Navigate to `INSTOK/android` directory
4. Click "OK"
5. Wait for Gradle sync to complete
6. Run the app using the "Run" button or `Shift + F10`

### Gradle Tasks

Common Gradle tasks you can run from Android Studio or terminal:

```bash
# Clean build
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/:username` - Get user profile
- `GET /api/users/:username/posts` - Get user posts
- `POST /api/users/:userId/follow` - Follow user
- `DELETE /api/users/:userId/follow` - Unfollow user
- `GET /api/users/search/:query` - Search users

### Posts
- `GET /api/posts/feed` - Get feed posts (authenticated)
- `GET /api/posts/public` - Get public posts
- `GET /api/posts/user/:userId` - Get user posts
- `POST /api/posts` - Create post
- `POST /api/posts/:postId/like` - Like/Unlike post
- `DELETE /api/posts/:postId/like` - Unlike post

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `POST /api/comments/:commentId/like` - Like comment
- `DELETE /api/comments/:commentId` - Delete comment

### Stories
- `GET /api/stories` - Get all active stories
- `GET /api/stories/user/:userId` - Get user stories
- `POST /api/stories` - Create story
- `POST /api/stories/:storyId/view` - Mark story as viewed
- `DELETE /api/stories/:storyId` - Delete story

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages with user
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId/read` - Mark as read
- `DELETE /api/messages/:messageId` - Delete message

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

## Database Models

### User
- username, email, password
- fullName, bio, avatar
- followers, following, posts
- isPrivate

### Post
- user, images, videos, caption
- location, tags, mentions
- type, filters, crop, sound
- likes, comments

### Story
- user, image
- expiresAt, viewers

### Comment
- user, post, text
- likes

### Message
- sender, receiver, text
- image, isRead

### Notification
- user, sender, type
- post, comment, text
- isRead

## Development Tips

### Web Development
- Hot reload is enabled by default
- Edit files in `src/` directory
- TailwindCSS for styling

### Android Development
- Enable hot reload: Shake device → "Enable Hot Reloading"
- Debug menu: `Cmd/Ctrl + M` or shake device
- Chrome DevTools: `http://localhost:8081/debugger-ui/`
- React Native Debugger recommended

### Backend Development
- Auto-restart with tsx
- Check MongoDB connection
- Use Postman/Thunder Client for API testing

## Troubleshooting

### Android Build Issues

**Gradle build failed:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

**Android SDK not found:**
- Set ANDROID_HOME environment variable
- Add platform-tools to PATH

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify MongoDB port (default: 27017)

### Node Modules Issues

```bash
rm -rf node_modules
npm install
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Set up MongoDB Atlas or production database
4. Configure CORS for production domain
5. Use process manager (PM2)

### Android App
1. Generate signing key
2. Configure `android/app/build.gradle`
3. Build release APK
4. Test thoroughly
5. Publish to Google Play Store

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions:
- Create an issue in the repository
- Check existing documentation
- Review API endpoints

## Roadmap

- [ ] iOS app support
- [ ] Video calling
- [ ] Story replies
- [ ] Saved posts
- [ ] Archive posts
- [ ] Hashtag system
- [ ] Location tagging
- [ ] Push notifications
- [ ] Story highlights
- [ ] IGTV/Long videos

---

Built with ❤️ using React, React Native, and Node.js
#   S Y N C _ W e B  
 