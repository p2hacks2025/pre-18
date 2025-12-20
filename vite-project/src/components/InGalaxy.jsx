import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './InGalaxy.css';
import './ShootingStar.css';

// ▼▼▼ 使用する画像のリストを定義 ▼▼▼
// 実際にpublic/imageフォルダに入れているファイル名に合わせて変更してください
const STAR_IMAGES = [
   '/image/Hituzi.png',
  '/image/Hutago.png',
  '/image/Kani.png',
  '/image/Otome.png',
  '/image/Ousi.png',
  '/image/Shi.png',
  '/image/Ite.png',
  '/image/Mizugame.png',
  '/image/Sasori.png',
  '/image/Yagi.png',
  '/image/Tenbin.png',
  '/image/Uo.png',
  // '/image/star_04.png', // 画像が増えたらここに追加
];

const CONSTELLATION_IMAGES = [
  '/image/Genseki.png',
   // '/image/constellation_03.png',
];

const InGalaxy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const galaxyName = location.state?.galaxyName || 'My Galaxy';

  // --- データ管理 ---
  const [items, setItems] = useState(() => {
    // 元データ
    const initialItems = [
      { id: 1, theme: 'star', title: '一番星', date: '2025-12-01', comment: 'とても明るい星でした。', tags: ['天体', '日常'], isCompleted: false, top: '20%', left: '15%' },
      { id: 2, theme: 'star', title: '北極星', date: '2025-12-05', comment: '道標になる星です。', tags: ['天体', '風景'], isCompleted: false, top: '60%', left: '10%' },
      { id: 3, theme: 'star', title: 'シリウス', date: '2025-12-10', comment: '冬のダイヤモンドの一つ。', tags: ['夜景'], isCompleted: false, top: '30%', left: '70%' },
      { id: 4, theme: 'star', title: 'ベガ', date: '2025-12-15', comment: '夏の大三角形。', tags: ['自然'], isCompleted: false, top: '75%', left: '80%' },
      { id: 5, theme: 'constellation', title: 'オリオン座', date: '2025-12-02', comment: '三つ星が特徴的です。', tags: ['天体', '夜景'], isCompleted: false, top: '15%', left: '45%' },
      { id: 6, theme: 'constellation', title: 'カシオペア座', date: '2025-12-08', comment: 'Wの形をしています。', tags: ['天体'], isCompleted: false, top: '50%', left: '55%' },
    ];

    // ▼▼▼ ランダム画像の割り当て処理 ▼▼▼
    return initialItems.map(item => {
      // テーマに合わせて画像リストを選択
      const imageList = item.theme === 'star' ? STAR_IMAGES : CONSTELLATION_IMAGES;
      // リストからランダムに1つ選ぶ
      const randomImage = imageList[Math.floor(Math.random() * imageList.length)];

      return {
        ...item,
        imageSrc: randomImage, // 選ばれた画像を保存
      };
    });
  });

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
      {/* 戻るボタン */}
      <button 
        onClick={() => navigate(-1)}
        style={{
            position: 'absolute',
            top: '30px',
            left: '30px',
            zIndex: 100,
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'serif',
            fontSize: '1rem',
            cursor: 'pointer',
            letterSpacing: '2px',
            transition: 'color 0.3s'
        }}
        onMouseOver={(e) => e.target.style.color = '#fff'}
        onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
      >
        ← Return
      </button>

      {/* デバッグパネル */}
      <div className="debug-panel">
        <button onClick={triggerShootingStar} className="debug-button">🌠 流れ星</button>
        <button onClick={triggerMeteorShower} className="debug-button">✨ 流星群</button>
      </div>

      <h1>{galaxyName}</h1>
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
          <img
            key={item.id}
            // ▼▼▼ ここで割り当てたランダム画像を使用 ▼▼▼
            src={item.imageSrc} 
            alt={item.title}
            onClick={() => setSelectedItem(item)}
            className="symbol"
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              width: '500px',  // 写真が見やすいように少し大きくしました
              height: '500px',
              cursor: 'pointer',
              /* 完了時の発光エフェクト */
              filter: item.isCompleted
                ? 'brightness(1.2) drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))'
                : 'brightness(0.8) drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))',
              transform: item.isCompleted ? 'scale(1.2) translate(-50%, -50%)' : 'scale(1.0) translate(-50%, -50%)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* 詳細モーダル */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.title}</h2>
            <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            
            {/* モーダル内にも大きく画像を表示する場合 */}
            <div style={{textAlign: 'center', margin: '15px 0'}}>
                <img src={selectedItem.imageSrc} alt="" style={{width: '100px', height:'100px', borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,255,255,0.5)'}} />
            </div>

            <div style={{ marginTop: '10px', fontSize: '1.1em', lineHeight: '1.6' }}>
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

export default InGalaxy;