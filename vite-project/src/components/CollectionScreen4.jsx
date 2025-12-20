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
  // useOutletContextがnullの場合の安全策
  const context = useOutletContext();
  const { updateItem } = context || {}; 
  
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
        // ✅修正: 取得したデータが配列か確認し、配列でない場合は空配列をセットしてクラッシュを防ぐ
        if (Array.isArray(data)) {
          setDbItems(data);
        } else {
          console.warn('取得したデータが配列ではありません:', data);
          setDbItems([]); 
        }
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
  // ✅修正: dbItemsが万が一配列以外になっていてもクラッシュしないように Array.isArray でチェック
  const safeDbItems = Array.isArray(dbItems) ? dbItems : [];
  
  const validItems = safeDbItems.filter(item => item && (item.isCompleted || item.isGem || item.isConstellation));
  
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
      const randomIndex = Math.floor(Math.random() * AVAILABLE_CONSTELLATION_IMAGES.length);
      const selectedImage = AVAILABLE_CONSTELLATION_IMAGES[randomIndex];

      const updatedData = {
        ...selectedItem,
        isGem: false,           
        isConstellation: true,  
        image: selectedImage,   
        date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
        // ✅修正: memoがundefinedの場合に備えて空文字を結合
        memo: (selectedItem.memo || '') + '\n(観測完了により星座として登録されました)',
      };

      try {
        const response = await fetch(`http://127.0.0.1:5000/api/stones/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          alert(`原石「${selectedItem.title}」が輝き出し、星座に変わりました！`);
          
          setDbItems(prevItems => 
            // ✅修正: prevItemsも念のため配列チェック
            Array.isArray(prevItems) 
              ? prevItems.map(item => (item.id === selectedItem.id ? updatedData : item))
              : []
          );
          
          if (typeof updateItem === 'function') {
            updateItem(updatedData);
          }

          setSelectedItem(null); 
          setActiveTab('constellation');

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

                      {/* ✅修正: titleが無い場合のフォールバック */}
                      <p className="s4-star-name">{item.title || 'No Name'}</p>
                      
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
              {/* ✅修正: tagsが存在しない(undefined/null)場合を考慮して安全に表示 */}
              {selectedItem.tags ? (
                Array.isArray(selectedItem.tags) ? (
                  selectedItem.tags.map((tag, i) => (
                    <span key={i} className="s4-tag-badge">#{tag}</span>
                  ))
                ) : (
                  <span className="s4-tag-badge">#{selectedItem.tags}</span>
                )
              ) : (
                <span className="s4-tag-badge" style={{opacity:0.5}}>#NoTags</span>
              )}
            </div>

            <div className="s4-modal-body">
               {selectedItem.image && (
                 <div className="s4-modal-image-wrapper">
                    <img src={selectedItem.image} alt={selectedItem.title} className="s4-modal-image" />
                 </div>
               )}
               {/* ✅修正: memoがundefinedの時にクラッシュしないように */}
               <p style={{whiteSpace: 'pre-wrap'}}>{selectedItem.memo || ''}</p>
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