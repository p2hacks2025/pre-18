import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './Screen4.css'; // CSSをインポート

const Screen4 = () => {
  const { items = [] } = useOutletContext() || {};
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('star');
  const [selectedItem, setSelectedItem] = useState(null);

  const starItems = items.filter(item => item.isCompleted);
  
  const sampleStar = { 
    id: 'sample-s', title: 'チタタプ', memo: 'P2HACKSで作った最初のアイデア。', 
    tags: ['アイデア'], isCompleted: true 
  };

  const sampleConstellation = {
    id: 'const-1', title: 'ひし形座',
    memo: '「チタタプ」「ラテ」など、この冬に見つけた大切な原石たちが集まってできた星座です。',
    tags: ['2024冬', 'チーム制作'],
    isConstellation: true
  };

  return (
    <div className="s4-container">
      {/* タブ切り替え */}
      <div className="s4-header-container">
        <button 
          className={`s4-tab-button ${activeTab === 'star' ? 's4-tab-active' : 's4-tab-inactive'}`}
          onClick={() => setActiveTab('star')}
        >
          スター
        </button>
        <button 
          className={`s4-tab-button ${activeTab === 'constellation' ? 's4-tab-active' : 's4-tab-inactive'}`}
          onClick={() => setActiveTab('constellation')}
        >
          星座
        </button>
      </div>

      <div className="s4-shelf-outer">
        <div className="s4-shelf-inner">
          {activeTab === 'star' ? (
            /* --- スター画面 --- */
            <>
              <div className="s4-center-line"></div>
              <div className="s4-star-grid">
                <div className="s4-star-wrapper" onClick={() => setSelectedItem(sampleStar)}>
                  <div className="s4-item-info">
                    <p className="s4-star-title">{sampleStar.title}</p>
                    <div className="s4-star-circle"><div className="s4-star-glow"></div></div>
                  </div>
                </div>
                {starItems.map((item) => (
                  <div key={item.id} className="s4-star-wrapper" onClick={() => setSelectedItem(item)}>
                    <div className="s4-item-info">
                      <p className="s4-star-title">{item.title}</p>
                      <div className="s4-star-circle"><div className="s4-star-glow"></div></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="s4-horizontal-line" style={{ top: '33%' }}></div>
              <div className="s4-horizontal-line" style={{ top: '66%' }}></div>
            </>
          ) : (
            /* --- 星座画面 --- */
            <div className="s4-constellation-view" onClick={() => setSelectedItem(sampleConstellation)}>
              <p className="s4-constellation-title">星座：{sampleConstellation.title}</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.5 }}>星座をクリックして物語を読む</p>
              
              <div className="s4-constellation-map">
                <svg className="s4-constellation-svg">
                  <line x1="50%" y1="20%" x2="80%" y2="50%" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />
                  <line x1="80%" y1="50%" x2="50%" y2="80%" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />
                  <line x1="50%" y1="80%" x2="20%" y2="50%" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />
                  <line x1="20%" y1="50%" x2="50%" y2="20%" stroke="rgba(255,255,255,0.6)" strokeWidth="3" />
                </svg>
                <div className="s4-mini-star" style={{ top: '20%', left: '50%' }}></div>
                <div className="s4-mini-star" style={{ top: '50%', left: '80%' }}></div>
                <div className="s4-mini-star" style={{ top: '80%', left: '50%' }}></div>
                <div className="s4-mini-star" style={{ top: '50%', left: '20%' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div className="s4-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="s4-modal-content" onClick={(e) => e.stopPropagation()}>
            <p style={{ fontSize: '0.8rem', color: '#9be8ff', marginBottom: '5px' }}>
              {selectedItem.isConstellation ? 'CONSTELLATION' : 'STAR ITEM'}
            </p>
            <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>{selectedItem.title}</h2>
            <div style={{ marginBottom: '20px' }}>
              {selectedItem.tags?.map((tag, i) => (
                <span key={i} className="s4-tag-badge">#{tag}</span>
              ))}
            </div>
            <p style={{ lineHeight: '1.8', color: '#eee', textAlign: 'left' }}>{selectedItem.memo}</p>
            <button className="s4-close-btn" onClick={() => setSelectedItem(null)}>閉じる</button>
          </div>
        </div>
      )}

      {/* 戻るボタン */}
      <div className="s4-back-btn" onClick={() => navigate(-1)}>
        <svg width="80" height="40" viewBox="0 0 100 50">
          <path d="M40 10 L10 25 L40 40 M10 25 L90 25" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

export default Screen4;