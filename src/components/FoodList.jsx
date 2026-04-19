import React, { useState, useMemo } from 'react';

const FOOD_CATEGORIES = {
  'Daging & Seafood': [
    'baby_back_ribs', 'beef_carpaccio', 'beef_tartare', 'chicken_curry', 'chicken_wings',
    'crab_cakes', 'filet_mignon', 'foie_gras', 'grilled_salmon', 'lobster_bisque',
    'lobster_roll_sandwich', 'mussels', 'oysters', 'peking_duck', 'pork_chop',
    'prime_rib', 'pulled_pork_sandwich', 'scallops', 'shrimp_and_grits', 'steak',
    'tuna_tartare'
  ],
  'Pasta & Nasi': [
    'fried_rice', 'gnocchi', 'lasagna', 'macaroni_and_cheese', 'pad_thai',
    'paella', 'pho', 'ramen', 'ravioli', 'risotto',
    'spaghetti_bolognese', 'spaghetti_carbonara'
  ],
  'Sandwich & Burger': [
    'breakfast_burrito', 'club_sandwich', 'grilled_cheese_sandwich', 'hamburger',
    'hot_dog', 'chicken_quesadilla', 'croque_madame', 'tacos'
  ],
  'Salad & Sayuran': [
    'beet_salad', 'caesar_salad', 'caprese_salad', 'edamame', 'greek_salad',
    'guacamole', 'hummus', 'seaweed_salad'
  ],
  'Sup & Kuah': [
    'clam_chowder', 'french_onion_soup', 'hot_and_sour_soup', 'miso_soup'
  ],
  'Makanan Ringan & Goreng': [
    'bruschetta', 'churros', 'deviled_eggs', 'dumplings', 'escargots',
    'falafel', 'fish_and_chips', 'french_fries', 'french_toast', 'fried_calamari',
    'garlic_bread', 'gyoza', 'nachos', 'onion_rings', 'pancakes',
    'samosa', 'spring_rolls', 'takoyaki', 'waffles'
  ],
  'Sushi & Jepang': [
    'bibimbap', 'sashimi', 'sushi'
  ],
  'Kue & Dessert': [
    'apple_pie', 'baklava', 'bread_pudding', 'cannoli', 'carrot_cake',
    'cheesecake', 'chocolate_cake', 'chocolate_mousse', 'creme_brulee',
    'cup_cakes', 'donuts', 'frozen_yogurt', 'ice_cream', 'macarons',
    'panna_cotta', 'red_velvet_cake', 'strawberry_shortcake', 'tiramisu'
  ],
  'Lainnya': [
    'beignets', 'ceviche', 'cheese_plate', 'eggs_benedict', 'huevos_rancheros',
    'omelette', 'pizza', 'poutine'
  ]
};

const FOOD_EMOJI = {
  'Daging & Seafood': '\uD83E\uDD69',
  'Pasta & Nasi': '\uD83C\uDF5D',
  'Sandwich & Burger': '\uD83C\uDF54',
  'Salad & Sayuran': '\uD83E\uDD57',
  'Sup & Kuah': '\uD83C\uDF72',
  'Makanan Ringan & Goreng': '\uD83C\uDF5F',
  'Sushi & Jepang': '\uD83C\uDF63',
  'Kue & Dessert': '\uD83C\uDF70',
  'Lainnya': '\uD83C\uDF7D\uFE0F'
};

const formatName = (name) => {
  return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const FoodList = ({ isExpanded, onToggle }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const allFoods = useMemo(() => {
    const foods = [];
    Object.entries(FOOD_CATEGORIES).forEach(([category, items]) => {
      items.forEach(item => {
        foods.push({ name: item, displayName: formatName(item), category });
      });
    });
    return foods.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, []);

  const filteredFoods = useMemo(() => {
    let foods = activeCategory === 'all'
      ? allFoods
      : allFoods.filter(f => f.category === activeCategory);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      foods = foods.filter(f =>
        f.displayName.toLowerCase().includes(term) ||
        f.name.toLowerCase().includes(term)
      );
    }
    return foods;
  }, [allFoods, searchTerm, activeCategory]);

  const categories = ['all', ...Object.keys(FOOD_CATEGORIES)];

  return (
    <div className="food-list-section">
      <div className="food-list-toggle" onClick={onToggle}>
        <div className="toggle-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <div>
            <h3>Daftar 101 Jenis Makanan</h3>
            <p>Lihat semua makanan yang dapat dikenali oleh model</p>
          </div>
        </div>
        <svg
          className={`toggle-arrow ${isExpanded ? 'expanded' : ''}`}
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isExpanded && (
        <div className="food-list-content">
          <div className="food-list-search">
            <div className="search-input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Cari makanan (contoh: pizza, sushi, ramen)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')} aria-label="Bersihkan pencarian">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <div className="search-count">
              Menampilkan <span>{filteredFoods.length}</span> dari <span>101</span> makanan
            </div>
          </div>

          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'Semua' : `${FOOD_EMOJI[cat] || ''} ${cat}`}
              </button>
            ))}
          </div>

          {filteredFoods.length > 0 ? (
            <div className="food-grid">
              {filteredFoods.map((food) => (
                <div key={food.name} className="food-item">
                  <span className="food-name">{food.displayName}</span>
                  <span className="food-category-tag">{FOOD_EMOJI[food.category]}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="food-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              <p>Tidak ada makanan yang cocok dengan "<strong>{searchTerm}</strong>"</p>
              <span>Coba kata kunci lain atau pilih kategori berbeda</span>
            </div>
          )}

          <div className="food-list-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Model hanya dapat mengenali 101 jenis makanan di atas. Upload gambar makanan yang sesuai untuk hasil terbaik.</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .food-list-section {
          background: rgba(255, 255, 255, 0.92);
          border-radius: 16px;
          border: 2px solid #D4CDB8;
          overflow: hidden;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(139, 149, 86, 0.1);
          animation: fadeInUp 0.6s ease-out;
          margin-top: 2rem;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .food-list-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.75rem;
          cursor: pointer;
          transition: background 0.3s ease;
          user-select: none;
        }

        .food-list-toggle:hover {
          background: rgba(139, 149, 86, 0.06);
        }

        .toggle-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #4A5D3A;
        }

        .toggle-left h3 {
          font-size: 1.05rem;
          font-weight: 600;
          color: #2c2c2c;
          margin: 0;
          font-family: 'Segoe UI', 'Georgia', serif;
          letter-spacing: 0.5px;
        }

        .toggle-left p {
          font-size: 0.82rem;
          color: #6B5D4F;
          margin: 0.15rem 0 0 0;
        }

        .toggle-arrow {
          color: #8B9556;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }

        .toggle-arrow.expanded {
          transform: rotate(180deg);
        }

        .food-list-content {
          border-top: 1px solid #EBE5DE;
          padding: 1.5rem 1.75rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 2000px; }
        }

        .food-list-search {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .search-input-wrapper {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #D4CDB8;
          border-radius: 12px;
          padding: 0.7rem 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          box-sizing: border-box;
        }

        .search-input-wrapper:focus-within {
          border-color: #8B9556;
          box-shadow: 0 0 0 3px rgba(139, 149, 86, 0.15);
        }

        .search-input-wrapper svg {
          color: #8B9556;
          flex-shrink: 0;
        }

        .search-input-wrapper input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.92rem;
          background: transparent;
          color: #2c2c2c;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .search-input-wrapper input::placeholder {
          color: #A09888;
        }

        .clear-search {
          background: none;
          border: none;
          cursor: pointer;
          color: #A09888;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .clear-search:hover {
          color: #C47F6B;
        }

        .search-count {
          font-size: 0.8rem;
          color: #6B5D4F;
          padding-left: 0.25rem;
          line-height: 1.4;
        }

        .search-count span {
          font-weight: 700;
          color: #8B9556;
        }

        .category-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #EBE5DE;
        }

        .category-tab {
          padding: 0.45rem 0.9rem;
          border: 1px solid #D4CDB8;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.8);
          color: #6B5D4F;
          font-size: 0.78rem;
          font-family: 'Segoe UI', 'Georgia', serif;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .category-tab:hover {
          border-color: #9CAF88;
          background: rgba(156, 175, 136, 0.1);
          color: #4A5D3A;
        }

        .category-tab.active {
          background: linear-gradient(135deg, #8B9556, #7A8449);
          color: white;
          border-color: #7A8449;
          box-shadow: 0 2px 8px rgba(139, 149, 86, 0.3);
        }

        .food-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.6rem;
          max-height: 400px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .food-grid::-webkit-scrollbar {
          width: 6px;
        }

        .food-grid::-webkit-scrollbar-track {
          background: transparent;
        }

        .food-grid::-webkit-scrollbar-thumb {
          background: #D4CDB8;
          border-radius: 3px;
        }

        .food-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.85rem;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid #EBE5DE;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .food-item:hover {
          border-color: #9CAF88;
          background: rgba(156, 175, 136, 0.08);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(139, 149, 86, 0.1);
        }

        .food-name {
          font-size: 0.85rem;
          color: #2c2c2c;
          font-weight: 500;
          font-family: 'Segoe UI', 'Georgia', serif;
        }

        .food-category-tag {
          font-size: 1rem;
          flex-shrink: 0;
        }

        .food-empty {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #6B5D4F;
        }

        .food-empty svg {
          color: #D4CDB8;
          margin-bottom: 1rem;
        }

        .food-empty p {
          font-size: 0.95rem;
          margin: 0 0 0.4rem 0;
        }

        .food-empty span {
          font-size: 0.82rem;
          color: #A09888;
        }

        .food-list-note {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid #EBE5DE;
          font-size: 0.8rem;
          color: #8B9556;
          font-style: italic;
          line-height: 1.5;
        }

        .food-list-note svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        @media (max-width: 768px) {
          .food-list-toggle {
            padding: 1rem 1.25rem;
          }

          .toggle-left h3 {
            font-size: 0.95rem;
          }

          .toggle-left p {
            font-size: 0.75rem;
          }

          .food-list-content {
            padding: 1.25rem;
          }

          .food-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            max-height: 350px;
          }

          .category-tabs {
            gap: 0.4rem;
          }

          .category-tab {
            font-size: 0.72rem;
            padding: 0.4rem 0.7rem;
          }
        }

        @media (max-width: 480px) {
          .food-list-toggle {
            padding: 0.9rem 1rem;
          }

          .toggle-left svg {
            width: 20px;
            height: 20px;
          }

          .toggle-left h3 {
            font-size: 0.88rem;
          }

          .food-list-content {
            padding: 1rem;
          }

          .food-grid {
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 0.5rem;
            max-height: 300px;
          }

          .food-item {
            padding: 0.5rem 0.7rem;
          }

          .food-name {
            font-size: 0.78rem;
          }

          .search-input-wrapper {
            min-width: 0;
            padding: 0.6rem 0.8rem;
          }

          .search-input-wrapper input {
            font-size: 0.85rem;
          }

          .food-list-note {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FoodList;
