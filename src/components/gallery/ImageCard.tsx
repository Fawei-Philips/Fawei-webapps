import React from 'react';
import type { ImageInfo } from '../../types';
import './ImageCard.css';

interface ImageCardProps {
  image: ImageInfo;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  return (
    <div className="image-card" onClick={onClick}>
      <div className="image-card-thumbnail">
        <img
          src={image.thumbnailUrl || image.url}
          alt={image.title || 'Image'}
          loading="lazy"
        />
        {image.status && image.status !== 'completed' && (
          <div className={`status-overlay status-${image.status}`}>
            {image.status}
          </div>
        )}
      </div>
      <div className="image-card-info">
        <h4 className="image-card-title">{image.title || 'Untitled'}</h4>
        {image.promptText && (
          <p className="image-card-prompt">
            {image.promptText.length > 60
              ? `${image.promptText.substring(0, 60)}...`
              : image.promptText}
          </p>
        )}
        <p className="image-card-date">
          {new Date(image.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;
