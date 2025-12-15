import React, { useState, useRef } from 'react';
import type { DragEvent } from 'react';
import { imageService } from '../../services/imageService';
import { APP_CONFIG } from '../../utils/config';
import './ImageUpload.css';

const ImageUpload: React.FC = () => {
  const [promptText, setPromptText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError(null);
    setSuccess(false);

    // Validate file type
    if (!APP_CONFIG.ALLOWED_FILE_TYPES.includes(file.type as any)) {
      setError('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).');
      return;
    }

    // Validate file size
    if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
      setError(`File size exceeds ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit.`);
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    if (!promptText.trim()) {
      setError('Please enter a prompt text.');
      return;
    }

    if (promptText.length > APP_CONFIG.MAX_PROMPT_LENGTH) {
      setError(`Prompt text must not exceed ${APP_CONFIG.MAX_PROMPT_LENGTH} characters.`);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      await imageService.uploadImage(selectedFile, promptText);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setPromptText('');
        setUploadProgress(0);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to upload image');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload">
      <h2>Upload Image</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <div
          className={`file-dropzone ${isDragging ? 'dragging' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {previewUrl ? (
            <div className="preview-container">
              <img src={previewUrl} alt="Preview" className="preview-image" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="remove-file-button"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="dropzone-content">
              <div className="upload-icon">📁</div>
              <p className="dropzone-text">
                Drag and drop an image here, or click to select
              </p>
              <p className="dropzone-hint">
                Supported: JPEG, PNG, GIF, WebP (Max {APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={APP_CONFIG.ALLOWED_FILE_TYPES.join(',')}
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="promptText">AI Prompt Text</label>
          <textarea
            id="promptText"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Describe what you want the AI to generate or process..."
            rows={4}
            maxLength={APP_CONFIG.MAX_PROMPT_LENGTH}
            disabled={isUploading}
            required
          />
          <p className="character-count">
            {promptText.length} / {APP_CONFIG.MAX_PROMPT_LENGTH}
          </p>
        </div>

        {error && (
          <div className="upload-error">
            {error}
          </div>
        )}

        {success && (
          <div className="upload-success">
            Image uploaded successfully!
          </div>
        )}

        {isUploading && (
          <div className="upload-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="progress-text">Uploading... {uploadProgress}%</p>
          </div>
        )}

        <button
          type="submit"
          className="upload-button"
          disabled={isUploading || !selectedFile || !promptText.trim()}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  );
};

export default ImageUpload;
