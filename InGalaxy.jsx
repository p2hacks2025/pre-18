import React, { useState, useEffect } from 'react';
import './InGalaxy.css'; // 新しく作ったCSS
import './ShootingStar.css'; 

const Screen3 = () => {
  // --- データ管理 ---
  const [items, setItems] = useState([
    { id: 1, theme: 'star', title: '一番星', date: '2025-12-01', comment: 'とても明るい星でした。', tags: ['天体', '日常'], isCompleted: false, top: '20%', left: '15%' },
    { id: 2, theme: 'star', title: '北極星', date: '2025-12-05', comment: '道標になる星です。', tags: ['天体', '風景'], isCompleted: false, top: '60%', left: '10%' },
    { id: 3, theme: 'star', title: 'シリウス', date: '2025-12-10', comment: '冬のダイヤモンドの一つ。', tags: ['夜景'], isCompleted: false, top: '30%', left: '70%' },
    { id: 4, theme: 'star', title: 'ベガ', date: '2025-12-15', comment: '夏の大三角形。', tags: ['自然'], isCompleted: false, top: '75%', left: '80%' },
    { id: 5, theme: 'constellation', title: 'オリオン座', date: '2025-12-02', comment: '三つ星が特徴的です。', tags: ['天体', '夜景'], isCompleted: false, top: '15%', left: '45%' },
    { id: 6, theme: 'constellation', title: 'カシオペア座', date: '2025-12-08', comment: 'Wの形をしています。', tags: ['天体'], isCompleted: false, top: '50%', left: '55%' },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showShootingStar, setShowShootingStar] = useState(false);
  const [meteors, setMeteors] = useState([]);

  // --- アニメーション制御 ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const random = Math.random() * 100;
      if (random < 1.5) { 
        triggerMeteorShower();
      } else if (random < 51.5) {
        triggerShootingStar();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const triggerShootingStar = () => {
    setShowShootingStar(true);
    setTimeout(() => setShowShootingStar(false), 2000);
  };

  const triggerMeteorShower = () => {
    const newMeteors = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      delay: i * 150,
      top: `${Math.random() * 50}%`,
      left: `${70 + Math.random() * 20}%`,
    }));
    setMeteors(newMeteors);
    setTimeout(() => setMeteors([]), 5000);
  };

  const handleComplete = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isCompleted: true } : item
    ));
    setSelectedItem(null);
  };

  return (
    <div className="s3-container">
      {/* デバッグパネル */}
      <div className="debug-panel">
        <button onClick={triggerShootingStar} className="debug-button">🌠 流れ星</button>
        <button onClick={triggerMeteorShower} className="debug-button">✨ 流星群</button>
      </div>

      <h1>👤 私の宇宙</h1>
      <p style={{ color: '#ccc' }}>夜空のアイコンをタップして詳細を確認してください。</p>

      {/* 流れ星アニメーション */}
      {showShootingStar && <div className="shooting-star"></div>}
      {meteors.map((m) => (
        <div
          key={m.id}
          className="meteor"
          style={{ top: m.top, left: m.left, animationDelay: `${m.delay}ms` }}
        />
      ))}

      {/* 星空エリア */}
      <div className="sky-area">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="symbol"
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              borderRadius: item.theme === 'star' ? '50%' : '4px',
              backgroundColor: item.theme === 'star' ? '#FFD700' : '#4169E1',
              boxShadow: item.isCompleted 
                ? '0 0 30px 10px rgba(255, 255, 255, 0.6), 0 0 15px #FFD700' 
                : '0 0 5px rgba(255,255,255,0.3)',
              filter: item.isCompleted ? 'brightness(1.5)' : 'brightness(0.8)',
              transform: item.isCompleted ? 'scale(1.2)' : 'scale(1.0)',
            }}
          >
            <span style={{ fontSize: '12px' }}>{item.theme === 'star' ? '★' : '◆'}</span>
          </div>
        ))}
      </div>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.title}</h2>
            <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ marginTop: '20px', fontSize: '1.1em', lineHeight: '1.6' }}>
              <p><strong>日付:</strong> {selectedItem.date}</p>
              <p><strong>テーマ:</strong> {selectedItem.theme === 'star' ? '星' : '星座'}</p>
              <p><strong>コメント:</strong> {selectedItem.comment}</p>
              <p><strong>タグ:</strong> {selectedItem.tags.join(', ')}</p>
            </div>
            
            <div className="button-group">
              <button onClick={() => handleComplete(selectedItem.id)} className="complete-button">
                完了（発光させる）
              </button>
              <button onClick={() => setSelectedItem(null)} className="close-button">
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Screen3;