import mongoose, { Document, Schema } from 'mongoose';

export interface IStory extends Document {
  user: mongoose.Types.ObjectId;
  image: string;
  expiresAt: Date;
  viewers: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const StorySchema = new Schema<IStory>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  viewers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for better performance
StorySchema.index({ user: 1, createdAt: -1 });
StorySchema.index({ expiresAt: 1 });

export default mongoose.model<IStory>('Story', StorySchema);
