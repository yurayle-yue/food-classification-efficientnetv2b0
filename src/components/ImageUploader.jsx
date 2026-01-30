import React, { useRef, useState } from 'react';

/**
 * Komponen untuk upload gambar
 */
const ImageUploader = ({ imageData, onImageSelect, onSubmit, onCancel }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageSelect(e.target.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input file change
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />

      {!imageData ? (
        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h3>Upload Gambar Makanan</h3>
          <p>Klik atau seret gambar ke area ini</p>
        </div>
      ) : (
        <div className="image-preview-container">
          <div className="preview-content">
            <div className="image-preview-wrapper">
              <img src={imageData} alt="Preview gambar makanan" className="preview-image" />
              <div className="preview-overlay">
                <div className="preview-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Gambar Siap Diklasifikasi
                </div>
              </div>
            </div>

            <div className="preview-actions">
              <button
                className="action-btn submit-btn"
                onClick={onSubmit}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Submit untuk Klasifikasi
              </button>
              <button
                className="action-btn cancel-btn"
                onClick={onCancel}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Ubah Gambar
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .image-uploader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2.5rem;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(139, 149, 86, 0.15);
          backdrop-filter: blur(10px);
          border: 2px solid #D4CDB8;
          animation: fadeInUp 0.8s ease-out;
          position: relative;
          overflow: hidden;
        }

        /* Leaf decoration at top */
        .image-uploader::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, transparent, #8B9556, #9CAF88, #8B9556, transparent);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .upload-area {
          width: 100%;
          max-width: 520px;
          padding: 3.5rem 2.5rem;
          border: 2px dashed #B8A99A;
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(242, 235, 220, 0.6) 100%);
          position: relative;
          overflow: hidden;
        }

        .upload-area::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(139, 149, 86, 0.08) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .upload-area:hover::before {
          opacity: 1;
        }

        .upload-area:hover {
          border-color: #8B9556;
          box-shadow: 0 8px 30px rgba(139, 149, 86, 0.2);
          transform: translateY(-4px);
        }

        .upload-area.drag-active {
          border-color: #9CAF88;
          background: rgba(156, 175, 136, 0.12);
          box-shadow: 0 8px 30px rgba(139, 149, 86, 0.25);
          transform: scale(1.02);
        }

        .upload-icon {
          color: #8B9556;
          margin-bottom: 1.5rem;
          transition: all 0.4s ease;
          position: relative;
          z-index: 1;
        }

        .upload-area:hover .upload-icon {
          transform: scale(1.1);
          color: #7A8449;
        }

        .upload-area h3 {
          color: #2c2c2c;
          margin-bottom: 0.75rem;
          font-size: 1.4rem;
          font-weight: 600;
          position: relative;
          z-index: 1;
          letter-spacing: 1px;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .upload-area p {
          color: #6B5D4F;
          font-size: 1rem;
          font-weight: 400;
          position: relative;
          z-index: 1;
          font-family: 'Segoe UI', 'Georgia', serif;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .image-uploader {
            padding: 2rem;
          }

          .upload-area {
            padding: 2.5rem 2rem;
          }

          .upload-area h3 {
            font-size: 1.2rem;
          }

          .upload-area p {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .image-uploader {
            padding: 1.5rem;
          }

          .upload-area {
            padding: 2rem 1.5rem;
          }

          .upload-icon svg {
            width: 60px !important;
            height: 60px !important;
          }

          .upload-area h3 {
            font-size: 1.1rem;
            letter-spacing: 0.5px;
          }

          .upload-area p {
            font-size: 0.85rem;
          }

          .preview-image {
            max-height: 280px !important;
          }

          .preview-actions {
            flex-direction: column !important;
            gap: 0.75rem !important;
          }

          .action-btn {
            width: 100% !important;
          }
        }

        /* Image Preview Styles */
        .image-preview-container {
          width: 100%;
          max-width: 600px;
          animation: fadeInUp 0.6s ease-out;
        }

        .preview-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .image-preview-wrapper {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(139, 149, 86, 0.2);
          border: 3px solid #8B9556;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(242, 235, 220, 0.6) 100%);
        }

        .preview-image {
          width: 100%;
          height: auto;
          max-height: 350px;
          object-fit: contain;
          display: block;
        }

        .preview-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(139, 149, 86, 0.92), transparent);
          padding: 1rem;
          display: flex;
          justify-content: center;
        }

        .preview-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #FAF7F2;
          font-size: 0.95rem;
          font-weight: 500;
          font-family: 'Segoe UI', 'Georgia', serif;
          letter-spacing: 0.5px;
        }

        .preview-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          font-family: 'Segoe UI', 'Georgia', serif;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .submit-btn {
          background: linear-gradient(135deg, #8B9556 0%, #7A8449 100%);
          color: #FAF7F2;
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #7A8449 0%, #6B7540 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 149, 86, 0.35);
        }

        .cancel-btn {
          background: linear-gradient(135deg, #A67B5B 0%, #8B6B4A 100%);
          color: #FAF7F2;
        }

        .cancel-btn:hover {
          background: linear-gradient(135deg, #8B6B4A 0%, #6B4F35 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(166, 123, 91, 0.3);
        }

        .action-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
