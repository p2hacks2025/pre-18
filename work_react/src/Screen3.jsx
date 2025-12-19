import React, { useState, useEffect } from 'react';
import './ShootingStar.css'; // 流れ星と流星群のCSSを読み込み

const Screen3 = () => {
  // --- 1. データ管理（座標 top/left を追加） ---
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
  const [meteors, setMeteors] = useState([]); // 流星群用

  // --- 2. 確率とアニメーション制御 ---

 useEffect(() => {
  const timer = setTimeout(() => {
    const random = Math.random() * 100; // 0.00 〜 99.99

    if (random < 0.5) {
      // 0.5%：レインボー流星群
      triggerRainbowMeteorShower();
    } else if (random < 1.5) { 
      // 1%：通常の流星群
      triggerMeteorShower();
    } else if (random < 51.5) {
      // 50%：単発の流れ星
      triggerShootingStar();
    }
  }, 800); // 画面遷移から0.8秒後に抽選開始

  return () => clearTimeout(timer);
}, []);

  // 単発の流れ星を発動
  const triggerShootingStar = () => {
    setShowShootingStar(true);
    setTimeout(() => setShowShootingStar(false), 2000);
  };

  // 流星群を発動（キラキラ15連発）
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
    <div style={styles.container}>
      {/* デバッグパネル */}
      <div style={styles.debugPanel}>
        <button onClick={triggerShootingStar} style={styles.debugButton}>🌠 流れ星</button>
        <button onClick={triggerMeteorShower} style={styles.debugButton}>✨ 流星群</button>
      </div>

      <h1 style={{ color: 'white' }}>👤 画面3: 私の宇宙</h1>
      <p style={{ color: '#ccc' }}>夜空のアイコンをタップして詳細を確認してください。</p>

      {/* アニメーション要素 */}
      {showShootingStar && <div className="shooting-star"></div>}
      {meteors.map((m) => (
        <div
          key={m.id}
          className="meteor"
          style={{ top: m.top, left: m.left, animationDelay: `${m.delay}ms` }}
        />
      ))}

      {/* 星空エリア */}
      <div style={styles.skyArea}>
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedItem(item)}
            style={{
              ...styles.symbol,
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

      {/* 詳細表示モーダル（半透明・グラスモーフィズム） */}
      {selectedItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>{selectedItem.title}</h2>
            <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ marginTop: '20px', fontSize: '1.1em', lineHeight: '1.6' }}>
              <p><strong>日付:</strong> {selectedItem.date}</p>
              <p><strong>テーマ:</strong> {selectedItem.theme === 'star' ? '星' : '星座'}</p>
              <p><strong>コメント:</strong> {selectedItem.comment}</p>
              <p><strong>タグ:</strong> {selectedItem.tags.join(', ')}</p>
            </div>
            
            <div style={styles.buttonGroup}>
              <button onClick={() => handleComplete(selectedItem.id)} style={styles.completeButton}>
                完了（発光させる）
              </button>
              <button onClick={() => setSelectedItem(null)} style={styles.closeButton}>
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- スタイル定義 ---
const styles = {
  container: { 
    padding: '20px', textAlign: 'center', backgroundColor: '#050a1b', 
    height: '100vh', overflow: 'hidden', position: 'relative' 
  },
  skyArea: { position: 'relative', width: '100%', height: '75vh', marginTop: '20px' },
  symbol: { width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s ease', cursor: 'pointer', zIndex: 10 },
  debugPanel: { position: 'absolute', top: '10px', right: '10px', zIndex: 2000, display: 'flex', gap: '10px' },
  debugButton: {
    padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '8px', cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px'
  },
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)', color: 'white', padding: '40px',
    borderRadius: '24px', maxWidth: '800px', width: '85%', maxHeight: '80vh',
    overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)', textAlign: 'left',
  },
  buttonGroup: { display: 'flex', gap: '20px', marginTop: '40px' },
  completeButton: { flex: 2, padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em' },
  closeButton: { flex: 1, padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '12px', cursor: 'pointer' }
};

export default Screen3;