const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User.js');
const Post = require('./models/Post.js');
const Story = require('./models/Story.js');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-clone';

const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    fullName: 'John Doe',
    bio: 'Photographer and traveler 📸✈️'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    fullName: 'Jane Smith',
    bio: 'Fashion enthusiast 👗✨'
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: 'password123',
    fullName: 'Mike Wilson',
    bio: 'Food lover and chef 🍕👨‍🍳'
  },
  {
    username: 'sarah_jones',
    email: 'sarah@example.com',
    password: 'password123',
    fullName: 'Sarah Jones',
    bio: 'Fitness enthusiast 💪🏃‍♀️'
  }
];

const samplePosts = [
  {
    caption: 'Beautiful sunset today! 🌅 #sunset #nature #photography',
    images: ['https://picsum.photos/400/400?random=1']
  },
  {
    caption: 'New outfit for the weekend! 👗 #fashion #style #ootd',
    images: ['https://picsum.photos/400/400?random=2']
  },
  {
    caption: 'Homemade pizza night! 🍕 #food #cooking #delicious',
    images: ['https://picsum.photos/400/400?random=3']
  },
  {
    caption: 'Morning workout complete! 💪 #fitness #gym #motivation',
    images: ['https://picsum.photos/400/400?random=4']
  },
  {
    caption: 'Coffee and coding ☕️💻 #developer #coffee #coding',
    images: ['https://picsum.photos/400/400?random=5']
  }
];

const sampleStories = [
  'https://picsum.photos/400/600?random=10',
  'https://picsum.photos/400/600?random=11',
  'https://picsum.photos/400/600?random=12',
  'https://picsum.photos/400/600?random=13'
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Story.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create posts
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const user = users[i % users.length]; // Distribute posts among users
      
      const post = new Post({
        user: user._id,
        images: postData.images,
        caption: postData.caption,
        likes: [] // Start with no likes
      });
      
      await post.save();
      
      // Add post to user's posts array
      user.posts.push(post._id);
      await user.save();
      
      console.log(`Created post: ${post.caption.substring(0, 30)}...`);
    }

    // Create stories
    for (let i = 0; i < sampleStories.length; i++) {
      const user = users[i % users.length];
      
      const story = new Story({
        user: user._id,
        image: sampleStories[i],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      });
      
      await story.save();
      console.log(`Created story for user: ${user.username}`);
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users, ${samplePosts.length} posts, and ${sampleStories.length} stories`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
