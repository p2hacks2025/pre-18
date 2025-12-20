import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import './InGalaxy.css';
import './ShootingStar.css';

// ▼▼▼ [Main由来] 使用する画像のリスト定義 ▼▼▼
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
];

const CONSTELLATION_IMAGES = [
  '/image/Genseki.png',
];

const InGalaxy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const galaxyName = location.state?.galaxyName || 'My Galaxy';

  // --- [Local由来] バックエンド連携: 親コンポーネントからデータをもらう ---
  // contextがnullの場合に備えてデフォルト値を設定
  const { items: dbItems = [], fetchItems } = useOutletContext() || {};

  // 表示用のState (DBデータ + 画像パス + 座標)
  const [displayItems, setDisplayItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- 1. データ初期化 (DBデータに画像を割り当てる) ---
  useEffect(() => {
    // 画面ロード時に最新データを取得
    if (fetchItems) {
      fetchItems();
    }
  }, [fetchItems]);

  useEffect(() => {
    // DBからデータが届いたら、UIが表示しやすい形に変換してstateに入れる
    if (dbItems && dbItems.length > 0) {
      const formattedItems = dbItems.map((item) => {
        // テーマ判定 (原石ならstar, 星座ならconstellation)
        const theme = item.isGem ? 'star' : 'constellation';
        
        // [Main由来] 画像ランダム割り当てロジック
        const imageList = theme === 'star' ? STAR_IMAGES : CONSTELLATION_IMAGES;
        // idを使って固定のランダム（リロードしても画像が変わらないように簡易的なハッシュ利用）
        // ※完全にランダムがいいなら Math.random() だけでOK
        const seed = item.id ? item.id.toString().charCodeAt(0) : Math.random() * 100;
        const randomImage = imageList[seed % imageList.length] || imageList[0];

        return {
          ...item,
          theme: theme,
          imageSrc: randomImage, // 画像パスをセット
          comment: item.memo || 'No details.',
          tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []),
          date: item.date || 'Unknown Date',
          
          // 座標 (DBにあればそれを使う、なければランダム)
          top: item.top || `${Math.random() * 70 + 10}%`, 
          left: item.left || `${Math.random() * 80 + 10}%`,
        };
      });
      setDisplayItems(formattedItems);
    } else {
       setDisplayItems([]);
    }
  }, [dbItems]);

  // --- 2. アニメーション制御 (共通) ---
  const [showShootingStar, setShowShootingStar] = useState(false);
  const [meteors, setMeteors] = useState([]);

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

  // --- 3. UIイベント ---
  const handleComplete = (id) => {
    // [Local由来] 見た目を更新 (本来はここでAPI通信 updateItem を呼ぶ)
    setDisplayItems(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: true } : item
    ));
    setSelectedItem(null);
  };

  // データがない時の表示
  if (!displayItems || displayItems.length === 0) {
      return (
        <div className="s3-container" style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
           <h2 style={{color:'white', opacity:0.7}}>まだ星は見つかりません...</h2>
           <p style={{color:'#ccc'}}>データロード中、または星が登録されていません。</p>
           <button onClick={() => navigate('/main/CollectionScreen4')} style={{marginTop:'20px', padding:'10px 20px', borderRadius:'20px', border:'none', cursor:'pointer'}}>
             コレクションを確認する
           </button>
        </div>
      );
  }

  // --- 4. 描画 ---
  return (
    <div className="s3-container">
      {/* [Main由来] 戻るボタン */}
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

      {/* [共通] デバッグパネル */}
      <div className="debug-panel">
        <button onClick={triggerShootingStar} className="debug-button">🌠 流れ星</button>
        <button onClick={triggerMeteorShower} className="debug-button">✨ 流星群</button>
        <button onClick={() => navigate('/main/CollectionScreen4')} className="debug-button" style={{marginLeft:'10px', background:'rgba(255,255,255,0.2)'}}>
          📋 一覧へ
        </button>
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

      {/* [Main由来のデザイン] 星空エリア (画像を使用) */}
      <div className="sky-area">
        {displayItems.map((item) => (
          <img
            key={item.id}
            src={item.imageSrc} 
            alt={item.title}
            onClick={() => setSelectedItem(item)}
            className="symbol"
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              // Mainのデザイン指定 (サイズやエフェクト)
              width: '100px', // ※500pxだと大きすぎる可能性があるため調整。必要なら'500px'に戻してください
              height: '100px',
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
            
            <div style={{textAlign: 'center', margin: '15px 0'}}>
                <img src={selectedItem.imageSrc} alt="" style={{width: '100px', height:'100px', borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,255,255,0.5)'}} />
            </div>

            <div style={{ marginTop: '10px', fontSize: '1.1em', lineHeight: '1.6' }}>
              <p><strong>日付:</strong> {selectedItem.date}</p>
              <p><strong>テーマ:</strong> {selectedItem.theme === 'star' ? '星 (Star)' : '星座 (Constellation)'}</p>
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