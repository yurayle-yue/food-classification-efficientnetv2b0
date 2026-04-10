import React, { useState, useRef } from 'react';

const SAMPLE_FOODS = [
  { name: 'pizza', emoji: '\uD83C\uDF55' },
  { name: 'sushi', emoji: '\uD83C\uDF63' },
  { name: 'hamburger', emoji: '\uD83C\uDF54' },
  { name: 'ice_cream', emoji: '\uD83C\uDF68' },
  { name: 'fried_rice', emoji: '\uD83C\uDF5A' },
  { name: 'steak', emoji: '\uD83E\uDD69' },
  { name: 'ramen', emoji: '\uD83C\uDF5C' },
  { name: 'french_fries', emoji: '\uD83C\uDF5F' },
  { name: 'tacos', emoji: '\uD83C\uDF2E' },
  { name: 'pancakes', emoji: '\uD83E\uDD5E' },
  { name: 'donuts', emoji: '\uD83C\uDF69' },
  { name: 'waffles', emoji: '\uD83E\uDDC7' },
  { name: 'chocolate_cake', emoji: '\uD83C\uDF82' },
  { name: 'hot_dog', emoji: '\uD83C\uDF2D' },
  { name: 'pad_thai', emoji: '\uD83C\uDF5D' },
];

const formatName = (name) =>
  name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const SampleGallery = ({ onImageSelect, disabled }) => {
  const [selectedFood, setSelectedFood] = useState(null);
  const fileInputRef = useRef(null);

  const handleFoodClick = (food) => {
    setSelectedFood(food);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onImageSelect(ev.target.result, file, selectedFood?.name || null);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="sample-gallery">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="gallery-header">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.03 0 2.02.17 2.94.49" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
        <div>
          <h3>Uji Model — Challenge Mode</h3>
          <p>Pilih makanan di bawah, lalu upload fotonya. Apakah model bisa mengenali?</p>
        </div>
      </div>

      <div className="gallery-grid">
        {SAMPLE_FOODS.map((food) => (
          <button
            key={food.name}
            className={`gallery-item ${selectedFood?.name === food.name ? 'selected' : ''}`}
            onClick={() => handleFoodClick(food)}
            disabled={disabled}
          >
            <span className="food-emoji">{food.emoji}</span>
            <span className="food-label">{formatName(food.name)}</span>
          </button>
        ))}
      </div>

      <p className="gallery-hint">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Klik salah satu makanan, lalu upload gambar makanan tersebut untuk menguji akurasi model
      </p>

      <style jsx>{`
        .sample-gallery {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          border: 2px solid #D4CDB8;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(139, 149, 86, 0.1);
          animation: fadeInUp 0.5s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .gallery-header {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          margin-bottom: 1.25rem;
          color: #4A5D3A;
        }

        .gallery-header svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .gallery-header h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .gallery-header p {
          font-size: 0.82rem;
          color: #6B5D4F;
          margin: 0.2rem 0 0 0;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
          gap: 0.6rem;
          margin-bottom: 1rem;
        }

        .gallery-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          padding: 0.75rem 0.5rem;
          border: 2px solid #EBE5DE;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.85);
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .gallery-item:hover:not(:disabled) {
          border-color: #8B9556;
          background: rgba(139, 149, 86, 0.06);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 149, 86, 0.15);
        }

        .gallery-item.selected {
          border-color: #8B9556;
          background: rgba(139, 149, 86, 0.1);
          box-shadow: 0 2px 8px rgba(139, 149, 86, 0.2);
        }

        .gallery-item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .food-emoji {
          font-size: 1.8rem;
        }

        .food-label {
          font-size: 0.72rem;
          color: #2c2c2c;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
        }

        .gallery-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: #8B9556;
          font-style: italic;
          margin: 0;
        }

        .gallery-hint svg {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .sample-gallery { padding: 1.25rem; }
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          }
          .food-emoji { font-size: 1.5rem; }
          .food-label { font-size: 0.68rem; }
        }

        @media (max-width: 480px) {
          .sample-gallery { padding: 1rem; }
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 0.5rem;
          }
          .gallery-item { padding: 0.6rem 0.4rem; }
          .food-emoji { font-size: 1.3rem; }
          .food-label { font-size: 0.62rem; }
          .gallery-header h3 { font-size: 0.92rem; }
          .gallery-header p { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
};

export default SampleGallery;
