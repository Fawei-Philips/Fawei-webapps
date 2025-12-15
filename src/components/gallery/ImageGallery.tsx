import React, { useState, useEffect } from 'react';
import { imageService } from '../../services/imageService';
import type { ImageInfo } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ImageCard from './ImageCard';
import './ImageGallery.css';

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);

  const fetchImages = async (pageNum: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await imageService.getImages(pageNum, 20);
      setImages(response.items);
      setTotalPages(response.totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, []);

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchImages(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchImages(page - 1);
    }
  };

  if (isLoading && images.length === 0) {
    return <LoadingSpinner message="Loading images..." />;
  }

  if (error && images.length === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchImages(1)} />;
  }

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h2>Image Gallery</h2>
        <p className="gallery-count">
          {images.length > 0 ? `Showing ${images.length} images` : 'No images found'}
        </p>
      </div>

      {images.length === 0 ? (
        <div className="empty-state">
          <p>No images to display. Upload your first image!</p>
        </div>
      ) : (
        <>
          <div className="gallery-grid">
            {images.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="gallery-pagination">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || isLoading}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages || isLoading}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

// Image Detail Modal Component
interface ImageDetailModalProps {
  image: ImageInfo;
  onClose: () => void;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ image, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <img src={image.url} alt={image.title || 'Image'} className="modal-image" />
        <div className="modal-details">
          <h3>{image.title || 'Untitled'}</h3>
          {image.description && <p className="image-description">{image.description}</p>}
          {image.promptText && (
            <div className="prompt-section">
              <strong>Prompt:</strong>
              <p>{image.promptText}</p>
            </div>
          )}
          <div className="metadata-section">
            <p>
              <strong>Uploaded:</strong> {new Date(image.uploadedAt).toLocaleString()}
            </p>
            <p>
              <strong>By:</strong> {image.uploadedBy}
            </p>
            {image.status && (
              <p>
                <strong>Status:</strong> <span className={`status-badge status-${image.status}`}>{image.status}</span>
              </p>
            )}
            {image.tags && image.tags.length > 0 && (
              <div className="tags-container">
                <strong>Tags:</strong>
                <div className="tags">
                  {image.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
