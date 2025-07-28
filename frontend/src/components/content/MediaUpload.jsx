import React, { useState, useRef } from 'react';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const MediaUpload = ({ 
  onUpload, 
  onMediaUpload, // For backward compatibility
  maxFiles = 10, 
  acceptedTypes = ['image/*', 'video/*'],
  uploadedFiles: externalUploadedFiles = []
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [internalUploadedFiles, setInternalUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Use external uploadedFiles if provided, otherwise use internal state
  const uploadedFiles = externalUploadedFiles.length > 0 ? externalUploadedFiles : internalUploadedFiles;
  const setUploadedFiles = externalUploadedFiles.length > 0 ? () => {} : setInternalUploadedFiles;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      return acceptedTypes?.some(type => {
        if (type?.includes('*')) {
          return file.type?.startsWith(type.replace('*', ''));
        }
        return file.type === type;
      });
    });

    if (uploadedFiles?.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    setUploadedFiles(prev => [...(prev || []), ...validFiles]);
    
    // Call the appropriate callback
    const callback = onUpload || onMediaUpload;
    if (callback) {
      callback(validFiles);
    }
  };

  const handleFileInput = (e) => {
    if (e.target?.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev?.filter((_, i) => i !== index) || []);
  };

  const getFileIcon = (file) => {
    if (file?.type?.startsWith('image/')) {
      return PhotoIcon;
    } else if (file?.type?.startsWith('video/')) {
      return VideoCameraIcon;
    }
    return PhotoIcon;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes?.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <CloudArrowUpIcon className="mx-auto h-8 w-8 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            {acceptedTypes?.join(', ')} up to {maxFiles} files
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => {
              const Icon = getFileIcon(file);
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file?.name || 'Unknown file'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file?.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default MediaUpload; 