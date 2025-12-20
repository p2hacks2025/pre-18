import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './CollectionScreen4.css';

const CollectionScreen4 = () => {
  const { items = [], updateItem } = useOutletContext() || {};
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('star');
  const [selectedItem, setSelectedItem] = useState(null);

  // ▼ シンプルなフィルタリング
  const filteredDisplayItems = items.filter(item => {
    if (!item) return false;
    if (activeTab === 'star') {
      return item.isGem || item.isCompleted;
    } else {
      return item.isConstellation;
    }
  });

  // 星座画像の候補
  const CONSTELLATION_IMAGES = [
      '/image/Hituzi.png', '/image/Hutago.png', '/image/Kani.png',
      '/image/Otome.png', '/image/Ousi.png', '/image/Shi.png',
  ];

  // 星座にする処理
  const handleComplete = () => {
    if (!selectedItem || !selectedItem.isGem) return;

    const randomIndex = Math.floor(Math.random() * CONSTELLATION_IMAGES.length);
    const selectedImage = CONSTELLATION_IMAGES[randomIndex];

    const updatedItem = {
      ...selectedItem,
      isGem: false,           
      isConstellation: true,  
      image: selectedImage,   
      memo: selectedItem.memo + '\n(星座になりました)',
    };

    if (updateItem) {
      updateItem(updatedItem); 
      alert('星座になりました！');
    }
    setSelectedItem(null); 
  };

  return (
    <div className="s4-container">
      <div className="s4-header">
        <h2 className="s4-page-title">COLLECTION</h2>
        <div className="s4-tabs">
          <button className={`s4-tab-button ${activeTab === 'star' ? 'active' : ''}`} onClick={() => setActiveTab('star')}>
            STAR / GEM
          </button>
          <button className={`s4-tab-button ${activeTab === 'constellation' ? 'active' : ''}`} onClick={() => setActiveTab('constellation')}>
            CONSTELLATION
          </button>
        </div>
      </div>

      <div className="s4-content-area">
        <div className="s4-grid-container fadeIn">
            {filteredDisplayItems.length === 0 ? (
              <div style={{color: '#999', marginTop: '50px', textAlign: 'center'}}>NO DATA FOUND</div>
            ) : (
              filteredDisplayItems.map((item, index) => (
                  <div key={index} className="s4-star-card" onClick={() => setSelectedItem(item)}>
                      <div className="s4-star-visual">
                      {item.image ? (
                          <img src={item.image} alt={item.title} className="s4-card-img" />
                      ) : (
                          <div className="s4-core-star" style={item.isGem ? { background: '#ffd700', boxShadow: '0 0 20px gold' } : {}}></div>
                      )}
                      </div>
                      <p className="s4-star-name">{item.title}</p>
                  </div>
              ))
            )}
        </div>
      </div>

      {selectedItem && (
        <div className="s4-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="s4-modal-content scaleIn" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.title}</h2>
            <div className="s4-tags-row">
              {selectedItem.tags?.map((tag, i) => <span key={i} className="s4-tag-badge">#{tag}</span>)}
            </div>
            <p>{selectedItem.memo}</p>
            <div className="s4-modal-footer">
               {selectedItem.isGem && (
                 <button className="s4-complete-btn" onClick={handleComplete}>✦ AWAKEN ✦</button>
               )}
            </div>
            <button className="s4-modal-close" onClick={() => setSelectedItem(null)}>CLOSE</button>
          </div>
        </div>
      )}
      
      <button className="s4-back-btn" onClick={() => navigate(-1)}>BACK</button>
    </div>
  );
};

export default CollectionScreen4;