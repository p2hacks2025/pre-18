import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './InGalaxy.css'; // 新しく作ったCSS
import './ShootingStar.css'; 

const InGalaxy = () => {
  const navigate = useNavigate();

  // ------------------------------------------------------------
  // 1. バックエンド連携: 親コンポーネントからデータと取得関数をもらう
  // ------------------------------------------------------------
  // contextがnullの場合に備えてデフォルト値を設定
  const { items: dbItems = [], fetchItems } = useOutletContext() || {};

  // 表示用のState (DBデータ + UI用座標などを保持)
  const [displayItems, setDisplayItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // ------------------------------------------------------------
  // 2. データ初期化と変換 (DB形式 -> UI形式)
  // ------------------------------------------------------------
  useEffect(() => {
    // 画面ロード時に最新データを取得
    if (fetchItems) {
      fetchItems();
    }
  }, [fetchItems]);

  useEffect(() => {
    // DBからデータが届いたら、UIが表示しやすい形に変換してstateに入れる
    if (dbItems && dbItems.length > 0) {
      const formattedItems = dbItems.map((item, index) => ({
        ...item,
        // UIに必要なフィールドへのマッピング
        theme: item.isGem ? 'star' : 'constellation', // 原石なら星、それ以外なら星座
        comment: item.memo || 'No details.',          // memoをcommentとして扱う
        tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : []), // タグを配列化
        date: item.date || 'Unknown Date',
        
        // 座標がない場合はランダム配置 (バックエンドのロジックを採用しつつUI用に保存)
        // ※一度決まったら再レンダリングで動かないように本当は固定すべきですが、今回は簡易実装
        top: item.top || `${Math.random() * 70 + 10}%`, 
        left: item.left || `${Math.random() * 80 + 10}%`,
      }));
      setDisplayItems(formattedItems);
    } else {
       // データがない場合、空にしておく（あるいはサンプルを表示してもOK）
       setDisplayItems([]);
    }
  }, [dbItems]);

  // ------------------------------------------------------------
  // 3. アニメーション制御 (フロントエンドのコードそのまま)
  // ------------------------------------------------------------
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

  // ------------------------------------------------------------
  // 4. UIイベント (完了ボタンなど)
  // ------------------------------------------------------------
  const handleComplete = (id) => {
    // 見た目だけ即座に変化させる (本来はここでAPI通信 updateItem を呼ぶとベスト)
    setDisplayItems(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: true } : item
    ));
    setSelectedItem(null);
  };

  // データがない時の表示 (バックエンドの配慮 + フロントのデザイン)
  if (!displayItems || displayItems.length === 0) {
      // ローディング中かもしれないので少し待つか、空表示を出す
      // ここでは簡易的に「データなし画面」を出します
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

  // ------------------------------------------------------------
  // 5. 描画 (フロントエンドのUIを完全に維持)
  // ------------------------------------------------------------
  return (
    <div className="s3-container">
      {/* デバッグパネル (機能統合) */}
      <div className="debug-panel">
        <button onClick={triggerShootingStar} className="debug-button">🌠 流れ星</button>
        <button onClick={triggerMeteorShower} className="debug-button">✨ 流星群</button>
        {/* 画面遷移用ボタンもここに追加しておきます */}
        <button onClick={() => navigate('/main/CollectionScreen4')} className="debug-button" style={{marginLeft:'10px', background:'rgba(255,255,255,0.2)'}}>
          📋 一覧へ
        </button>
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

      {/* 星空エリア (displayItems を使用) */}
      <div className="sky-area">
        {displayItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="symbol"
            style={{
              position: 'absolute',
              top: item.top,   // DB座標 or ランダム
              left: item.left, // DB座標 or ランダム
              borderRadius: item.theme === 'star' ? '50%' : '4px',
              backgroundColor: item.theme === 'star' ? '#FFD700' : '#4169E1',
              boxShadow: item.isCompleted 
                ? '0 0 30px 10px rgba(255, 255, 255, 0.6), 0 0 15px #FFD700' 
                : '0 0 5px rgba(255,255,255,0.3)',
              filter: item.isCompleted ? 'brightness(1.5)' : 'brightness(0.8)',
              transform: item.isCompleted ? 'scale(1.2)' : 'scale(1.0)',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '12px' }}>{item.theme === 'star' ? '★' : '◆'}</span>
          </div>
        ))}
      </div>

      {/* 詳細モーダル (フロントエンドのデザインそのまま) */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.title}</h2>
            <hr style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ marginTop: '20px', fontSize: '1.1em', lineHeight: '1.6' }}>
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