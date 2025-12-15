import React, { useState, useEffect } from 'react';
import { historyService } from '../../services/historyService';
import type { UploadHistory } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './UploadHistoryList.css';

const UploadHistoryList: React.FC = () => {
  const [history, setHistory] = useState<UploadHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedHistory, setSelectedHistory] = useState<UploadHistory | null>(null);

  const fetchHistory = async (pageNum: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await historyService.getUploadHistory(pageNum, 20);
      setHistory(response.items);
      setTotalPages(response.totalPages);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchHistory(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchHistory(page - 1);
    }
  };

  if (isLoading && history.length === 0) {
    return <LoadingSpinner message="Loading history..." />;
  }

  if (error && history.length === 0) {
    return <ErrorMessage message={error} onRetry={() => fetchHistory(1)} />;
  }

  return (
    <div className="upload-history">
      <div className="history-header">
        <h2>Upload History</h2>
        <p className="history-count">
          {history.length > 0 ? `${history.length} records` : 'No history found'}
        </p>
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No upload history yet. Upload your first image!</p>
        </div>
      ) : (
        <>
          <div className="history-list">
            {history.map((item) => (
              <HistoryCard
                key={item.id}
                item={item}
                onClick={() => setSelectedHistory(item)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="history-pagination">
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

      {selectedHistory && (
        <HistoryDetailModal
          item={selectedHistory}
          onClose={() => setSelectedHistory(null)}
        />
      )}
    </div>
  );
};

// History Card Component
interface HistoryCardProps {
  item: UploadHistory;
  onClick: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'processing':
        return 'status-processing';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="history-card" onClick={onClick}>
      {item.thumbnailUrl && (
        <div className="history-card-thumbnail">
          <img src={item.thumbnailUrl} alt="Thumbnail" />
        </div>
      )}
      <div className="history-card-content">
        <div className="history-card-header">
          <span className={`history-status ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
          <span className="history-date">
            {new Date(item.createdAt).toLocaleString()}
          </span>
        </div>
        <p className="history-prompt">
          {item.promptText.length > 100
            ? `${item.promptText.substring(0, 100)}...`
            : item.promptText}
        </p>
        {item.errorMessage && (
          <p className="history-error">Error: {item.errorMessage}</p>
        )}
      </div>
    </div>
  );
};

// History Detail Modal Component
interface HistoryDetailModalProps {
  item: UploadHistory;
  onClose: () => void;
}

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ item, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'processing':
        return 'status-processing';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        {item.imageUrl && (
          <img src={item.imageUrl} alt="Result" className="modal-image" />
        )}
        
        <div className="modal-details">
          <div className="detail-row">
            <strong>Status:</strong>
            <span className={`history-status ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>

          <div className="detail-row">
            <strong>Submitted:</strong>
            <span>{new Date(item.createdAt).toLocaleString()}</span>
          </div>

          {item.completedAt && (
            <div className="detail-row">
              <strong>Completed:</strong>
              <span>{new Date(item.completedAt).toLocaleString()}</span>
            </div>
          )}

          <div className="prompt-detail">
            <strong>Prompt Text:</strong>
            <p>{item.promptText}</p>
          </div>

          {item.errorMessage && (
            <div className="error-detail">
              <strong>Error Message:</strong>
              <p>{item.errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadHistoryList;
