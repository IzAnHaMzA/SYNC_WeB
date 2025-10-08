export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  followers: string[];
  following: string[];
  posts: string[];
  isPrivate: boolean;
  isCreator?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  user: string; // User ID
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
  likes: string[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  text: string;
  likes: string[];
  createdAt: string;
}

export interface Story {
  _id: string;
  user: User;
  image: string;
  expiresAt: string;
  viewers: string[];
  createdAt: string;
}

export interface Message {
  _id: string;
  sender: User;
  receiver: User;
  text?: string;
  image?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LoginData {
  email: string;
  password: string;
}
