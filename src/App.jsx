import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import tfjsService from './services/tfjsService';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import LoadingSpinner from './components/LoadingSpinner';
import FoodList from './components/FoodList';
import SampleGallery from './components/SampleGallery';
import BatchTest from './components/BatchTest';
import PredictionHistory from './components/PredictionHistory';
import DebugPanel from './components/DebugPanel';

function App() {
  const [modelStatus, setModelStatus] = useState('loading');
  const [statusMessage, setStatusMessage] = useState('Memuat model...');
  const [selectedImageData, setSelectedImageData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [predictionResults, setPredictionResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [isFoodListExpanded, setIsFoodListExpanded] = useState(false);

  // New states for 8 features
  const [benchmark, setBenchmark] = useState(null);
  const [allProbabilities, setAllProbabilities] = useState(null);
  const [expectedFood, setExpectedFood] = useState(null);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({ correct: 0, wrong: 0 });
  const [activeTab, setActiveTab] = useState('upload'); // upload, batch

  // Load model
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
    return () => { tfjsService.dispose(); };
  }, []);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('predictionHistory');
      const savedStats = localStorage.getItem('feedbackStats');
      if (saved) setPredictionHistory(JSON.parse(saved));
      if (savedStats) setFeedbackStats(JSON.parse(savedStats));
    } catch (e) { /* ignore */ }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((history, stats) => {
    try {
      localStorage.setItem('predictionHistory', JSON.stringify(history.slice(-50)));
      localStorage.setItem('feedbackStats', JSON.stringify(stats));
    } catch (e) { /* ignore */ }
  }, []);

  const handleImageSelect = useCallback((dataUrl, file, expected = null) => {
    setSelectedImageData(dataUrl);
    setSelectedFile(file);
    setExpectedFood(expected);
    setPredictionResults(null);
    setBenchmark(null);
    setAllProbabilities(null);
    setCurrentFeedback(null);
  }, []);

  const runPrediction = useCallback(async (imgDataUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        try {
          const result = await tfjsService.predict(img);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = imgDataUrl;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (modelStatus !== 'ready') {
      alert('Model belum siap. Silakan tunggu sebentar.');
      return;
    }
    if (!selectedImageData || !selectedFile) {
      alert('Silakan pilih gambar terlebih dahulu.');
      return;
    }

    setImageData(selectedImageData);
    setIsProcessing(true);
    setCurrentFeedback(null);

    try {
      const result = await runPrediction(selectedImageData);
      setPredictionResults(result.predictions);
      setBenchmark(result.benchmark);
      setAllProbabilities(result.allProbabilities);

      // Add to history
      const historyItem = {
        id: Date.now(),
        thumbnail: selectedImageData,
        prediction: result.predictions[0].displayName,
        className: result.predictions[0].className,
        confidence: result.predictions[0].confidence,
        inferenceTime: result.benchmark.totalTime,
        expectedFood: expectedFood,
        feedback: null,
        timestamp: new Date().toLocaleTimeString('id-ID')
      };

      const newHistory = [...predictionHistory, historyItem];
      setPredictionHistory(newHistory);
      saveHistory(newHistory, feedbackStats);
    } catch (error) {
      console.error('Prediction error:', error);
      alert(`Gagal melakukan prediksi: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [modelStatus, selectedImageData, selectedFile, expectedFood, predictionHistory, feedbackStats, runPrediction, saveHistory]);

  const handleFeedback = useCallback((type) => {
    setCurrentFeedback(type);

    const newStats = { ...feedbackStats };
    if (type === 'correct') newStats.correct += 1;
    else newStats.wrong += 1;
    setFeedbackStats(newStats);

    // Update last history item with feedback
    const newHistory = [...predictionHistory];
    if (newHistory.length > 0) {
      newHistory[newHistory.length - 1].feedback = type;
    }
    setPredictionHistory(newHistory);
    saveHistory(newHistory, newStats);
  }, [feedbackStats, predictionHistory, saveHistory]);

  const handleCancelImage = useCallback(() => {
    setSelectedImageData(null);
    setSelectedFile(null);
    setExpectedFood(null);
  }, []);

  const handleReset = useCallback(() => {
    setSelectedImageData(null);
    setSelectedFile(null);
    setImageData(null);
    setPredictionResults(null);
    setBenchmark(null);
    setAllProbabilities(null);
    setExpectedFood(null);
    setCurrentFeedback(null);
  }, []);

  const renderModelStatus = () => {
    if (modelStatus === 'ready' && predictionResults) return null;

    const icons = {
      loading: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
      ready: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      error: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      )
    };

    return (
      <div className={`model-status ${modelStatus}`}>
        <div className="status-icon">{icons[modelStatus]}</div>
        <div className="status-text">
          <h4>{modelStatus === 'loading' ? 'Memuat Model' : modelStatus === 'ready' ? 'Model Siap' : 'Error'}</h4>
          <p>{statusMessage}</p>
        </div>
      </div>
    );
  };

  const isModelReady = modelStatus === 'ready';

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div className="header-text">
            <h1>Klasifikasi Makanan CNN</h1>
            <p className="subtitle">EfficientNetV2B0 untuk Klasifikasi Citra Makanan dan Informasi Gizi</p>
          </div>
        </div>

        <div className="badges">
          <span className="badge model-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            EfficientNetV2B0
          </span>
          {predictionResults && benchmark && (
            <span className="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {benchmark.totalTime}ms
            </span>
          )}
          <span className="badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Food-101
          </span>
          <span className="badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <>
            {/* Input Mode Tabs */}
            <div className="input-tabs">
              <button
                className={`input-tab ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload
              </button>
              <button
                className={`input-tab ${activeTab === 'batch' ? 'active' : ''}`}
                onClick={() => setActiveTab('batch')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Batch Test
              </button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="tab-content">
                <ImageUploader
                  imageData={selectedImageData}
                  onImageSelect={handleImageSelect}
                  onSubmit={handleSubmit}
                  onCancel={handleCancelImage}
                />
                {/* Challenge Mode */}
                <SampleGallery
                  onImageSelect={handleImageSelect}
                  disabled={!isModelReady}
                />
              </div>
            )}

            {/* Batch Test Tab */}
            {activeTab === 'batch' && (
              <div className="tab-content">
                <BatchTest
                  onBatchComplete={(results) => {
                    const newHistory = [...predictionHistory];
                    results.forEach(r => {
                      if (r.success) {
                        newHistory.push({
                          id: Date.now() + r.id,
                          thumbnail: r.thumbnail,
                          prediction: r.prediction,
                          className: r.className,
                          confidence: r.confidence,
                          inferenceTime: r.time,
                          expectedFood: null,
                          feedback: null,
                          timestamp: new Date().toLocaleTimeString('id-ID')
                        });
                      }
                    });
                    setPredictionHistory(newHistory);
                    saveHistory(newHistory, feedbackStats);
                  }}
                  disabled={!isModelReady}
                />
              </div>
            )}

            {/* Food List (always visible) */}
            <FoodList
              isExpanded={isFoodListExpanded}
              onToggle={() => setIsFoodListExpanded(!isFoodListExpanded)}
            />

            {/* History & Debug (below all) */}
            <div className="bottom-panels">
              <PredictionHistory
                history={predictionHistory}
                feedbackStats={feedbackStats}
              />
              <DebugPanel />
            </div>
          </>
        ) : (
          <>
            <ResultCard
              results={predictionResults}
              imageData={imageData}
              onReset={handleReset}
              modelInfo={modelInfo}
              benchmark={benchmark}
              allProbabilities={allProbabilities}
              onFeedback={handleFeedback}
              currentFeedback={currentFeedback}
              expectedFood={expectedFood}
            />
            {/* History & Debug below result */}
            <div className="bottom-panels">
              <PredictionHistory
                history={predictionHistory}
                feedbackStats={feedbackStats}
              />
              <DebugPanel />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Implementasi CNN untuk Klasifikasi Citra Makanan</h3>
            <p>Menggunakan arsitektur EfficientNetV2B0 untuk mengklasifikasikan 101 jenis makanan dengan informasi gizi</p>
          </div>
          <div className="tech-stack">
            <span className="tech-item">React 18</span>
            <span className="tech-item">TensorFlow.js</span>
            <span className="tech-item">EfficientNetV2B0</span>
            <span className="tech-item">Food-101</span>
          </div>
        </div>
        <p className="copyright">&copy; 2026 - Satria Tarigan</p>
      </footer>

      {isProcessing && <LoadingSpinner message="Menganalisis gambar dengan EfficientNetV2B0..." />}
    </div>
  );
}

export default App;
