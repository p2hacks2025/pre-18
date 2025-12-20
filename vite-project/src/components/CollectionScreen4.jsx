import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './CollectionScreen4.css';

// 原石が星座に変わる際に付与されるランダム画像の候補
const AVAILABLE_CONSTELLATION_IMAGES = [
  '/image/Hituzi.png',
  '/image/Hutago.png',
  '/image/Kani.png',
  '/image/Otome.png',
  '/image/Ousi.png',
  '/image/Shi.png',
];

const CollectionScreen4 = () => {
  const navigate = useNavigate();
  // 親コンポーネントからのデータも受け取れますが、今回はDBから直接取得したデータを主とします
  const { updateItem } = useOutletContext() || {}; 
  
  const [activeTab, setActiveTab] = useState('star');
  const [selectedItem, setSelectedItem] = useState(null);
  const [dbItems, setDbItems] = useState([]); // DBから取得したデータを格納
  const [loading, setLoading] = useState(true);

  // ▼▼▼ 1. DBからデータを取得 (GET) ▼▼▼
  const fetchStones = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/stones');
      if (response.ok) {
        const data = await response.json();
        // 取得したデータには id が含まれていることを想定
        setDbItems(data);
      } else {
        console.error('データの取得に失敗しました');
      }
    } catch (error) {
      console.error('通信エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStones();
  }, []);

  // ▼リスト表示ロジック
  // DBから取得した items を使用してフィルタリング
  const validItems = dbItems.filter(item => item && (item.isCompleted || item.isGem || item.isConstellation));
  
  // 表示用データ（データがない場合は空配列、あるいはローディング表示などを検討）
  // 開発中は確認用にサンプルを残したい場合は以下のように空配列時のフォールバックを残してもOKです
  const displayItems = validItems;

  // タブごとの出し分け
  const filteredDisplayItems = displayItems.filter(item => {
    if (activeTab === 'star') {
      return item.isGem || item.isCompleted; // 原石 または 星
    } else {
      return item.isConstellation; // 星座
    }
  });

  // ▼▼▼ 2. 完了ボタンの処理 (UPDATE/PUT) ▼▼▼
  const handleComplete = async () => {
    if (!selectedItem) return;

    if (selectedItem.isGem) {
      // 1. 画像をランダムに選出
      const randomIndex = Math.floor(Math.random() * AVAILABLE_CONSTELLATION_IMAGES.length);
      const selectedImage = AVAILABLE_CONSTELLATION_IMAGES[randomIndex];

      // 2. 更新用データを作成
      const updatedData = {
        ...selectedItem,
        isGem: false,           // 原石卒業
        isConstellation: true,  // 星座へ昇格
        image: selectedImage,   // 画像パスを保存
        date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
        memo: selectedItem.memo + '\n(観測完了により星座として登録されました)',
      };

      try {
        // DBへ更新リクエストを送信 (PUTメソッドを想定)
        // エンドポイントは個別のIDを指定: /api/stones/<id>
        const response = await fetch(`http://127.0.0.1:5000/api/stones/${selectedItem.id}`, {
          method: 'PUT', // Python側でPUTメソッドを受け取るように設定してください
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          alert(`原石「${selectedItem.title}」が輝き出し、星座に変わりました！`);
          
          // ローカルの表示を更新 (再fetchするか、stateを直接書き換える)
          setDbItems(prevItems => 
            prevItems.map(item => (item.id === selectedItem.id ? updatedData : item))
          );
          
          // 親コンポーネントへの通知が必要ならここで行う
          if (typeof updateItem === 'function') {
            updateItem(updatedData);
          }

          setSelectedItem(null); // モーダルを閉じる
          setActiveTab('constellation'); // 星座タブへ移動してあげる

        } else {
          alert('データの更新に失敗しました');
        }
      } catch (error) {
        console.error('更新通信エラー:', error);
        alert('サーバーと通信できませんでした');
      }

    } else if (selectedItem.isConstellation) {
      alert('この星座は既に観測済みです。');
    }
  };

  return (
    <div className="s4-container">
      {/* --- ヘッダー --- */}
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

      {/* --- コンテンツエリア --- */}
      <div className="s4-content-area">
        <div className="s4-grid-container fadeIn">
            {loading ? (
              <div style={{color: '#999', marginTop: '50px'}}>LOADING DATA...</div>
            ) : filteredDisplayItems.length === 0 ? (
              <div style={{color: '#999', marginTop: '50px'}}>NO DATA FOUND</div>
            ) : (
              filteredDisplayItems.map((item, index) => {
                if (!item) return null;
                // キーにはユニークなIDを使用するのがベストです
                return (
                  <div key={item.id || index} className="s4-star-card" onClick={() => setSelectedItem(item)}>
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

      {/* ================= 詳細モーダル ================= */}
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
              {/* tagsが文字列か配列かで処理を分ける安全策 */}
              {Array.isArray(selectedItem.tags) ? selectedItem.tags.map((tag, i) => (
                <span key={i} className="s4-tag-badge">#{tag}</span>
              )) : <span className="s4-tag-badge">#{selectedItem.tags}</span>}
            </div>

            <div className="s4-modal-body">
               {selectedItem.image && (
                 <div className="s4-modal-image-wrapper">
                    <img src={selectedItem.image} alt={selectedItem.title} className="s4-modal-image" />
                 </div>
               )}
               <p style={{whiteSpace: 'pre-wrap'}}>{selectedItem.memo}</p>
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

      {/* 戻るボタン */}
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