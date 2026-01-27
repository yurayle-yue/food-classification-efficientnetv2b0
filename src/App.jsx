import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import tfjsService from './services/tfjsService';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * Main Application Component
 * Implementasi CNN untuk Klasifikasi Citra Makanan dan Informasi Gizi Berbasis Web
 */
function App() {
  const [modelStatus, setModelStatus] = useState('loading'); // loading, ready, error
  const [statusMessage, setStatusMessage] = useState('Memuat model...');
  const [imageData, setImageData] = useState(null);
  const [predictionResults, setPredictionResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);

  // Load model saat aplikasi start
  useEffect(() => {
    const loadModel = async () => {
      try {
        setStatusMessage('Memuat model EfficientNetV2B0...');
        await tfjsService.loadModel();
        const info = tfjsService.getModelInfo();
        setModelInfo(info);
        setModelStatus('ready');
        setStatusMessage('Model berhasil dimuat! Siap untuk klasifikasi.');
      } catch (error) {
        console.error('Error loading model:', error);
        setModelStatus('error');
        setStatusMessage('Gagal memuat model. Pastikan file model tersedia di folder /public/models');
      }
    };

    loadModel();

    // Cleanup saat unmount
    return () => {
      tfjsService.dispose();
    };
  }, []);

  /**
   * Handle gambar yang dipilih user
   */
  const handleImageSelect = useCallback(async (dataUrl, file) => {
    if (modelStatus !== 'ready') {
      alert('Model belum siap. Silakan tunggu sebentar.');
      return;
    }

    setImageData(dataUrl);
    setIsProcessing(true);

    try {
      // Create image element untuk prediction
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          console.log('Image loaded, size:', img.width, 'x', img.height);
          const results = await tfjsService.predict(img);
          console.log('Prediction results:', results);
          setPredictionResults(results);
        } catch (error) {
          console.error('Prediction error:', error);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          alert(`Gagal melakukan prediksi: ${error.message}\n\nCek console (F12) untuk detail error.`);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = (e) => {
        console.error('Image load error:', e);
        alert('Gagal memuat gambar. Silakan pilih gambar lain.');
        setIsProcessing(false);
        setImageData(null);
      };
      img.src = dataUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Terjadi kesalahan saat memproses gambar.');
      setIsProcessing(false);
      setImageData(null);
    }
  }, [modelStatus]);

  /**
   * Reset ke awal
   */
  const handleReset = useCallback(() => {
    setImageData(null);
    setPredictionResults(null);
  }, []);

  /**
   * Render status model dengan informasi akurasi
   */
  const renderModelStatus = () => {
    if (modelStatus === 'ready' && predictionResults) return null;

    const icons = {
      loading: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="4" className="spinner" />
        </svg>
      ),
      ready: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      error: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    };

    const titles = {
      loading: 'Memuat Model',
      ready: 'Model Siap',
      error: 'Error'
    };

    return (
      <div className={`model-status ${modelStatus}`}>
        <div className="status-icon">{icons[modelStatus]}</div>
        <div className="status-text">
          <h4>{titles[modelStatus]}</h4>
          <p>{statusMessage}</p>
        </div>
        {modelStatus === 'ready' && modelInfo && (
          <div className="model-info-badge">
            <span className="accuracy-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Akurasi: {modelInfo.accuracy}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div className="header-text">
            <h1>Klasifikasi Makanan CNN</h1>
            <p className="subtitle">Implementasi EfficientNetV2B0 untuk Klasifikasi Citra Makanan dan Informasi Gizi</p>
          </div>
        </div>

        <div className="badges">
          <span className="badge model-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            EfficientNetV2B0
          </span>
          <span className="badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Akurasi: {modelInfo?.accuracy || '94.8%'}
          </span>
          <span className="badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Food-101 Dataset
          </span>
          <span className="badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            101 Kelas
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderModelStatus()}

        {!predictionResults ? (
          <ImageUploader onImageSelect={handleImageSelect} />
        ) : (
          <ResultCard
            results={predictionResults}
            imageData={imageData}
            onReset={handleReset}
            modelInfo={modelInfo}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Skripsi: Implementasi CNN untuk Klasifikasi Citra Makanan</h3>
            <p>Aplikasi web ini menggunakan arsitektur EfficientNetV2B0 untuk mengklasifikasikan 101 jenis makanan</p>
          </div>
          <div className="tech-stack">
            <span className="tech-item">React 18</span>
            <span className="tech-item">TensorFlow.js</span>
            <span className="tech-item">EfficientNetV2B0</span>
            <span className="tech-item">Food-101</span>
          </div>
        </div>
        <p className="copyright">
          © 2025 - Developed for Thesis Project | Berbasis Web (Browser-based Neural Network)
        </p>
      </footer>

      {/* Loading Overlay */}
      {isProcessing && <LoadingSpinner message="Menganalisis gambar dengan EfficientNetV2B0... Mohon tunggu" />}
    </div>
  );
}

export default App;
