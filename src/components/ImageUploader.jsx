import React, { useRef, useState } from 'react';

/**
 * Komponen untuk upload gambar atau capture dari kamera
 */
const ImageUploader = ({ onImageSelect }) => {
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

  // Handle camera capture
  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = e.target.files[0];
      handleFileSelect(file);
    };
    input.click();
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

      <div className="divider">
        <span>atau</span>
      </div>

      <button className="camera-button" onClick={handleCameraCapture}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        Buka Kamera
      </button>

      <style jsx>{`
        .image-uploader {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .upload-area {
          width: 100%;
          max-width: 500px;
          padding: 3rem 2rem;
          border: 3px dashed #cbd5e1;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .upload-area:hover {
          border-color: #667eea;
          background: #f0f4ff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .upload-area.drag-active {
          border-color: #667eea;
          background: #e0e7ff;
          transform: scale(1.02);
        }

        .upload-icon {
          color: #667eea;
          margin-bottom: 1rem;
          transition: transform 0.3s ease;
        }

        .upload-area:hover .upload-icon {
          transform: scale(1.1);
        }

        .upload-area h3 {
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }

        .upload-area p {
          color: #64748b;
          font-size: 0.95rem;
        }

        .divider {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 500px;
          color: #94a3b8;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .divider span {
          padding: 0 1rem;
          font-size: 0.9rem;
        }

        .camera-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
        }

        .camera-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
        }

        .camera-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .image-uploader {
            padding: 1.5rem;
          }

          .upload-area {
            padding: 2rem 1.5rem;
          }

          .camera-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .upload-area h3 {
            font-size: 1.1rem;
          }

          .upload-area p {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;
