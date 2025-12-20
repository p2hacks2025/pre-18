import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './CollectionScreen4.css';

const AVAILABLE_CONSTELLATION_IMAGES = [
  '/image/Hituzi.png',
  '/image/Hutago.png',
  '/image/Kani.png',
  '/image/Otome.png',
  '/image/Ousi.png',
  '/image/Shi.png',
];

const CollectionScreen4 = () => {
  const { items = [], updateItem } = useOutletContext() || {};
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('star');
  const [selectedItem, setSelectedItem] = useState(null);

  const validItems = items.filter(item => item && (item.isCompleted || item.isGem || item.isConstellation));
  
  const sampleStar = { 
    id: 'sample-s', title: 'チタタプ', memo: '初期アイデア', tags: ['sample'], isCompleted: true 
  };
  const sampleGem = {
    id: 'gem-1', title: '未明の原石', memo: 'まだ磨かれていない石', tags: ['原石'], isGem: true 
  };

  const displayItems = validItems.length > 0 ? validItems : [sampleStar, sampleGem];

  const filteredDisplayItems = displayItems.filter(item => {
    if (activeTab === 'star') {
      return item.isGem || item.isCompleted;
    } else {
      return item.isConstellation;
    }
  });

  const handleComplete = () => {
    if (!selectedItem) return;

    if (selectedItem.isGem) {
      const randomIndex = Math.floor(Math.random() * AVAILABLE_CONSTELLATION_IMAGES.length);
      const selectedImage = AVAILABLE_CONSTELLATION_IMAGES[randomIndex];

      const updatedItem = {
        ...selectedItem,
        isGem: false,           
        isConstellation: true,  
        image: selectedImage,   
        date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
        memo: selectedItem.memo + '\n(観測完了により星座として登録されました)',
      };

      if (typeof updateItem === 'function') {
        updateItem(updatedItem); 
        alert(`原石「${selectedItem.title}」が輝き出し、星座に変わりました！`);
      }
      
      setSelectedItem(null); 

    } else if (selectedItem.isConstellation) {
      alert('この星座は既に観測済みです。');
    }
  };

  return (
    <div className="s4-container">
      <div className="s4-header">
        <h2 className="s4-page-title">COLLECTION ARCHIVE</h2>
        <div className="s4-tabs">
          <button 
            className={`s4-tab-button ${activeTab === 'star' ? 'active' : ''}`}
            onClick={() => setActiveTab('star')}
          >
            STAR / GEM
            <div className="s4-tab-indicator"></div>
          </button>
          <button 
            className={`s4-tab-button ${activeTab === 'constellation' ? 'active' : ''}`}
            onClick={() => setActiveTab('constellation')}
          >
            CONSTELLATION
            <div className="s4-tab-indicator"></div>
          </button>
        </div>
      </div>

      <div className="s4-content-area">
        <div className="s4-grid-container fadeIn">
            {filteredDisplayItems.length === 0 ? (
              <div style={{color: '#999', marginTop: '50px'}}>NO DATA FOUND</div>
            ) : (
              filteredDisplayItems.map((item, index) => {
                if (!item) return null;
                return (
                  <div key={index} className="s4-star-card" onClick={() => setSelectedItem(item)}>
                      <div className="s4-card-glow"></div>
                      
                      <div className="s4-star-visual">
                      {item.image ? (
                          <div className="s4-card-img-container">
                              <img src={item.image} alt={item.title} className="s4-card-img" />
                              <div className={`s4-img-ring ${item.isConstellation ? 'constellation-ring' : ''}`}></div>
                          </div>
                      ) : (
                          <>
                              <div 
                                  className="s4-core-star" 
                                  style={item.isGem ? { background: '#ffd700', boxShadow: '0 0 20px #ffd700' } : {}}
                              ></div>
                              <div className="s4-ring"></div>
                          </>
                      )}
                      </div>

                      <p className="s4-star-name">{item.title}</p>
                      
                      <span style={{fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)'}}>
                        {item.isGem ? 'RAW GEM' : (item.isConstellation ? 'CONSTELLATION' : 'STAR')}
                      </span>
                  </div>
                );
              })
            )}
            <div className="s4-grid-placeholder"></div>
            <div className="s4-grid-placeholder"></div>
        </div>
      </div>

      {selectedItem && (
        <div className="s4-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="s4-modal-content scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="s4-modal-header">
              <span className="s4-modal-type">
                {selectedItem.isConstellation ? 'CONSTELLATION DATA' : (selectedItem.isGem ? 'RAW GEMSTONE' : 'STAR DATA')}
              </span>
              <button className="s4-modal-close" onClick={() => setSelectedItem(null)}>×</button>
            </div>
            
            <h2 
              className="s4-modal-title" 
              style={selectedItem.isGem ? {color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'} : {}}
            >
              {selectedItem.title}
            </h2>
            
            <div className="s4-tags-row">
              {selectedItem.tags?.map((tag, i) => (
                <span key={i} className="s4-tag-badge">#{tag}</span>
              ))}
            </div>

            <div className="s4-modal-body">
               {selectedItem.image && (
                 <div className="s4-modal-image-wrapper">
                    <img src={selectedItem.image} alt={selectedItem.title} className="s4-modal-image" />
                 </div>
               )}
               <p>{selectedItem.memo}</p>
            </div>

            <div className="s4-modal-footer">
               {selectedItem.isGem ? (
                 <button className="s4-complete-btn" onClick={handleComplete}>
                    ✦ AWAKEN (完了して星座へ) ✦
                 </button>
               ) : (
                 <div className="s4-data-deco"></div>
               )}
            </div>
          </div>
        </div>
      )}

      <button className="s4-back-btn" onClick={() => navigate(-1)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span style={{marginLeft: '8px'}}>BACK</span>
      </button>
    </div>
  );
};

export default CollectionScreen4;