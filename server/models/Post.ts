import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  images: string[];
  videos?: string[];
  caption?: string;
  location?: string;
  tags: string[];
  mentions: string[];
  type: 'image' | 'video';
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    sepia: number;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sound?: {
    enabled: boolean;
    volume: number;
    track: string | null;
  };
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  videos: [{
    type: String
  }],
  caption: {
    type: String,
    maxlength: 2200,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  mentions: [{
    type: String
  }],
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  filters: {
    brightness: { type: Number, default: 100 },
    contrast: { type: Number, default: 100 },
    saturation: { type: Number, default: 100 },
    blur: { type: Number, default: 0 },
    sepia: { type: Number, default: 0 }
  },
  crop: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 100 }
  },
  sound: {
    enabled: { type: Boolean, default: false },
    volume: { type: Number, default: 50 },
    track: { type: String, default: null }
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

// Index for better performance
PostSchema.index({ user: 1, createdAt: -1 });
PostSchema.index({ likes: 1 });

export default mongoose.model<IPost>('Post', PostSchema);
