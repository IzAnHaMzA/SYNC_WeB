import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, ArrowLeft, Filter, Crop, Music, MapPin, Hash, User, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

type CreateStep = 'upload' | 'edit' | 'details' | 'sharing';

interface PostData {
  file: File | null;
  preview: string | null;
  type: 'image' | 'video' | null;
  filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    sepia: number;
  };
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  sound: {
    enabled: boolean;
    volume: number;
    track: string | null;
  };
  details: {
    caption: string;
    location: string;
    tags: string[];
    mentions: string[];
  };
}

const Create: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<CreateStep>('upload');
  const [postData, setPostData] = useState<PostData>({
    file: null,
    preview: null,
    type: null,
    filters: {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
    },
    crop: {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
    sound: {
      enabled: false,
      volume: 50,
      track: null,
    },
    details: {
      caption: '',
      location: '',
      tags: [],
      mentions: [],
    },
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  // Step 1: File Upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        toast.error('Please select an image or video file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPostData(prev => ({
          ...prev,
          file,
          preview: e.target?.result as string,
          type: isVideo ? 'video' : 'image',
        }));
        setCurrentStep('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 2: Edit (Filters, Crop, Sound)
  const updateFilter = (filterType: keyof PostData['filters'], value: number) => {
    setPostData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value,
      },
    }));
  };

  const updateCrop = (cropData: Partial<PostData['crop']>) => {
    setPostData(prev => ({
      ...prev,
      crop: {
        ...prev.crop,
        ...cropData,
      },
    }));
  };

  const updateSound = (soundData: Partial<PostData['sound']>) => {
    setPostData(prev => ({
      ...prev,
      sound: {
        ...prev.sound,
        ...soundData,
      },
    }));
  };

  // Step 3: Details
  const updateDetails = (detailsData: Partial<PostData['details']>) => {
    setPostData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        ...detailsData,
      },
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !postData.details.tags.includes(tag)) {
      updateDetails({
        tags: [...postData.details.tags, tag],
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateDetails({
      tags: postData.details.tags.filter(tag => tag !== tagToRemove),
    });
  };

  // Step 4: Share
  const handleShare = async () => {
    if (!postData.file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', postData.file);
      formData.append('caption', postData.details.caption);
      formData.append('location', postData.details.location);
      formData.append('tags', JSON.stringify(postData.details.tags));
      formData.append('mentions', JSON.stringify(postData.details.mentions));
      formData.append('filters', JSON.stringify(postData.filters));
      formData.append('crop', JSON.stringify(postData.crop));
      formData.append('sound', JSON.stringify(postData.sound));
      formData.append('type', postData.type || '');

      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Post created successfully!');
      setCurrentStep('sharing');
      
      // Navigate to profile after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'upload') {
      navigate(-1);
    } else if (currentStep === 'edit') {
      setCurrentStep('upload');
    } else if (currentStep === 'details') {
      setCurrentStep('edit');
    }
  };

  const handleNext = () => {
    if (currentStep === 'edit') {
      setCurrentStep('details');
    }
  };

  const getFilterStyle = () => {
    const { brightness, contrast, saturation, blur, sepia } = postData.filters;
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px) sepia(${sepia}%)`,
    };
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button onClick={handleBack}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">
          {currentStep === 'upload' && 'New Post'}
          {currentStep === 'edit' && 'Edit'}
          {currentStep === 'details' && 'Details'}
          {currentStep === 'sharing' && 'Sharing'}
        </h1>
        {currentStep === 'details' && (
          <button
            onClick={handleShare}
            disabled={!postData.file || isUploading}
            className="text-blue-500 font-semibold disabled:opacity-50"
          >
            {isUploading ? 'Sharing...' : 'Share'}
          </button>
        )}
        {currentStep === 'edit' && (
          <button
            onClick={handleNext}
            className="text-blue-500 font-semibold"
          >
            Next
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-2 p-4">
        {['upload', 'edit', 'details', 'sharing'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-3 h-3 rounded-full ${
                currentStep === step
                  ? 'bg-blue-500'
                  : ['upload', 'edit', 'details', 'sharing'].indexOf(currentStep) > index
                  ? 'bg-green-500'
                  : 'bg-gray-600'
              }`}
            />
            {index < 3 && (
              <div
                className={`w-8 h-0.5 ${
                  ['upload', 'edit', 'details', 'sharing'].indexOf(currentStep) > index
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {currentStep === 'upload' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center mb-8">
            <Camera className="w-16 h-16 text-gray-400" />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-4">
            Add photos and videos here
          </h2>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Select from computer
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Step 2: Edit */}
      {currentStep === 'edit' && postData.preview && (
        <div className="flex-1 flex flex-col">
          {/* Preview */}
          <div className="flex-1 relative bg-gray-900">
            {postData.type === 'video' ? (
              <video
                ref={videoRef}
                src={postData.preview}
                className="w-full h-full object-cover"
                style={getFilterStyle()}
                controls
                autoPlay
                loop
                muted
              />
            ) : (
              <img
                src={postData.preview}
                alt="Preview"
                className="w-full h-full object-cover"
                style={getFilterStyle()}
              />
            )}
          </div>
          
          {/* Edit Controls */}
          <div className="bg-black p-4 space-y-4">
            {/* Filter Controls */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Filter className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">Filters</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white text-sm">Brightness</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={postData.filters.brightness}
                    onChange={(e) => updateFilter('brightness', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white text-sm">Contrast</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={postData.filters.contrast}
                    onChange={(e) => updateFilter('contrast', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white text-sm">Saturation</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={postData.filters.saturation}
                    onChange={(e) => updateFilter('saturation', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-white text-sm">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={postData.filters.blur}
                    onChange={(e) => updateFilter('blur', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Sound Controls (for videos) */}
            {postData.type === 'video' && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Music className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">Sound</span>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={postData.sound.enabled}
                      onChange={(e) => updateSound({ enabled: e.target.checked })}
                      className="rounded"
                    />
                    <span className="text-white text-sm">Enable sound</span>
                  </label>
                  {postData.sound.enabled && (
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={postData.sound.volume}
                        onChange={(e) => updateSound({ volume: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {currentStep === 'details' && postData.preview && (
        <div className="flex-1 flex flex-col">
          {/* Preview */}
          <div className="flex-1 relative bg-gray-900">
            {postData.type === 'video' ? (
              <video
                src={postData.preview}
                className="w-full h-full object-cover"
                style={getFilterStyle()}
                controls
                autoPlay
                loop
                muted
              />
            ) : (
              <img
                src={postData.preview}
                alt="Preview"
                className="w-full h-full object-cover"
                style={getFilterStyle()}
              />
            )}
          </div>
          
          {/* Details Form */}
          <div className="bg-black p-4 space-y-4">
            {/* Caption */}
            <div>
              <textarea
                value={postData.details.caption}
                onChange={(e) => updateDetails({ caption: e.target.value })}
                placeholder="Write a caption..."
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none border-b border-gray-700 pb-2"
                rows={3}
              />
            </div>

            {/* Location */}
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={postData.details.location}
                onChange={(e) => updateDetails({ location: e.target.value })}
                placeholder="Add location"
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Hash className="w-5 h-5 text-gray-400" />
                <span className="text-white font-semibold">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {postData.details.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>#{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-white hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags (without #)"
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none border-b border-gray-700 pb-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const tag = e.currentTarget.value.trim();
                    if (tag) {
                      addTag(tag);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>

            {/* Mentions */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-white font-semibold">Mentions</span>
              </div>
              <input
                type="text"
                placeholder="Mention people (@username)"
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none border-b border-gray-700 pb-1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Sharing */}
      {currentStep === 'sharing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center mb-8">
            <Check className="w-16 h-16 text-white" />
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            Post Shared Successfully!
          </h2>
          
          <p className="text-gray-400 text-center mb-8">
            Your post has been uploaded and is now visible to your followers.
          </p>
          
          <div className="w-full max-w-sm">
            {postData.preview && (
              <div className="relative mb-4">
                {postData.type === 'video' ? (
                  <video
                    src={postData.preview}
                    className="w-full aspect-square object-cover rounded-lg"
                    style={getFilterStyle()}
                    controls
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={postData.preview}
                    alt="Shared Post"
                    className="w-full aspect-square object-cover rounded-lg"
                    style={getFilterStyle()}
                  />
                )}
              </div>
            )}
            
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-white text-sm mb-2">
                {postData.details.caption || 'No caption'}
              </p>
              {postData.details.location && (
                <p className="text-gray-400 text-xs mb-2">
                  📍 {postData.details.location}
                </p>
              )}
              {postData.details.tags.length > 0 && (
                <p className="text-blue-400 text-xs">
                  {postData.details.tags.map(tag => `#${tag}`).join(' ')}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;
