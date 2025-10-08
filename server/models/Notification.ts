import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'like' | 'comment' | 'follow' | 'mention';
  post?: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;
  text: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'mention'],
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  text: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better performance
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ isRead: 1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);

