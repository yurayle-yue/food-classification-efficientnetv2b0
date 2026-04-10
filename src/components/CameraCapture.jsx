import React, { useRef, useState, useCallback, useEffect } from 'react';

const CameraCapture = ({ onCapture, disabled }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment');

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOn(false);
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsCameraOn(true);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
    }
  };

  const switchCamera = async () => {
    stopCamera();
    const newMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newMode);
    setTimeout(async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: newMode, width: { ideal: 640 }, height: { ideal: 480 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
        setIsCameraOn(true);
      } catch (err) {
        setError('Gagal mengganti kamera.');
      }
    }, 300);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
      onCapture(dataUrl, file);
      stopCamera();
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="camera-capture">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {!isCameraOn ? (
        <div className="camera-start">
          <div className="camera-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <h3>Ambil Foto dari Kamera</h3>
          <p>Foto makanan langsung dari perangkat Anda</p>
          <button className="start-btn" onClick={startCamera} disabled={disabled}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Buka Kamera
          </button>
          {error && <p className="camera-error">{error}</p>}
        </div>
      ) : (
        <div className="camera-active">
          <div className="video-wrapper">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
            <div className="viewfinder">
              <div className="vf-corner tl"></div>
              <div className="vf-corner tr"></div>
              <div className="vf-corner bl"></div>
              <div className="vf-corner br"></div>
            </div>
          </div>
          <div className="camera-controls">
            <button className="ctrl-btn switch-btn" onClick={switchCamera} title="Ganti Kamera">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="17 1 21 5 17 9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                <polyline points="7 23 3 19 7 15" />
                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
              </svg>
            </button>
            <button className="ctrl-btn capture-btn" onClick={capturePhoto} title="Ambil Foto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" fill="currentColor" />
              </svg>
            </button>
            <button className="ctrl-btn close-btn" onClick={stopCamera} title="Tutup Kamera">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .camera-capture {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          border: 2px solid #D4CDB8;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(139, 149, 86, 0.1);
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .camera-start {
          text-align: center;
          padding: 2.5rem 1.5rem;
        }

        .camera-icon {
          color: #8B9556;
          margin-bottom: 1rem;
        }

        .camera-start h3 {
          font-size: 1.15rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0 0 0.4rem 0;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .camera-start p {
          font-size: 0.85rem;
          color: #6B5D4F;
          margin: 0 0 1.25rem 0;
          font-style: italic;
        }

        .start-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #8B9556, #7A8449);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 0.92rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Segoe UI', 'Georgia', serif;
          box-shadow: 0 3px 12px rgba(139, 149, 86, 0.25);
        }

        .start-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 16px rgba(139, 149, 86, 0.3);
        }

        .start-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .camera-error {
          color: #C47F6B;
          font-size: 0.82rem;
          margin-top: 1rem;
        }

        .camera-active {
          display: flex;
          flex-direction: column;
        }

        .video-wrapper {
          position: relative;
          background: #1a1a1a;
          aspect-ratio: 4/3;
        }

        .video-wrapper video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .viewfinder {
          position: absolute;
          top: 15%;
          left: 15%;
          right: 15%;
          bottom: 15%;
          pointer-events: none;
        }

        .vf-corner {
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: rgba(255, 255, 255, 0.7);
          border-style: solid;
          border-width: 0;
        }

        .vf-corner.tl { top: 0; left: 0; border-top-width: 2px; border-left-width: 2px; border-radius: 4px 0 0 0; }
        .vf-corner.tr { top: 0; right: 0; border-top-width: 2px; border-right-width: 2px; border-radius: 0 4px 0 0; }
        .vf-corner.bl { bottom: 0; left: 0; border-bottom-width: 2px; border-left-width: 2px; border-radius: 0 0 0 4px; }
        .vf-corner.br { bottom: 0; right: 0; border-bottom-width: 2px; border-right-width: 2px; border-radius: 0 0 4px 0; }

        .camera-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, rgba(44, 44, 44, 0.95), rgba(30, 30, 30, 0.95));
        }

        .ctrl-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .switch-btn, .close-btn {
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.15);
          color: white;
        }

        .switch-btn:hover, .close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.1);
        }

        .capture-btn {
          width: 64px;
          height: 64px;
          background: white;
          color: #C47F6B;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }

        .capture-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .capture-btn:active {
          transform: scale(0.95);
        }

        @media (max-width: 480px) {
          .camera-start { padding: 2rem 1rem; }
          .camera-start h3 { font-size: 1rem; }
          .camera-controls { gap: 1rem; padding: 1rem; }
          .capture-btn { width: 56px; height: 56px; }
          .switch-btn, .close-btn { width: 38px; height: 38px; }
        }
      `}</style>
    </div>
  );
};

export default CameraCapture;
