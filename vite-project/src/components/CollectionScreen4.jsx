import React, { useState } from 'react';
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
  // ▼変更点: アイテムを増やすのではなく「更新」するため updateItem を受け取ります
  // ※ 親コンポーネント(MainLayout)で updateItem 関数が提供されている必要があります
  const { items = [], updateItem } = useOutletContext() || {};
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('star');
  const [selectedItem, setSelectedItem] = useState(null);

  // ▼リスト表示ロジック
  // isCompleted(星), isGem(原石), isConstellation(星座) のいずれかを持つアイテムを表示対象とする
  const validItems = items.filter(item => item && (item.isCompleted || item.isGem || item.isConstellation));
  
  /* --- サンプルデータ（データが空の時用） --- */
  const sampleStar = { 
    id: 'sample-s', title: 'チタタプ', memo: '初期アイデア', tags: ['sample'], isCompleted: true 
  };
  const sampleGem = {
    id: 'gem-1', title: '未明の原石', memo: 'まだ磨かれていない石', tags: ['原石'], isGem: true 
  };

  // 表示用リスト
  const displayItems = validItems.length > 0 ? validItems : [sampleStar, sampleGem];

  // タブごとの出し分け
  // STARタブ: 星(isCompleted) と 原石(isGem) を表示
  // CONSTELLATIONタブ: 星座(isConstellation) を表示
  const filteredDisplayItems = displayItems.filter(item => {
    if (activeTab === 'star') {
      return item.isGem || item.isCompleted;
    } else {
      return item.isConstellation;
    }
  });

  // ▼▼▼ 修正: 完了ボタンの処理 ▼▼▼
  const handleComplete = () => {
    if (!selectedItem) return;

    if (selectedItem.isGem) {
      // ========================================================
      // 【原石】の完了 → ランダム画像を貼り付けて【星座】へ変化
      // ========================================================

      // 1. 画像をランダムに選出
      const randomIndex = Math.floor(Math.random() * AVAILABLE_CONSTELLATION_IMAGES.length);
      const selectedImage = AVAILABLE_CONSTELLATION_IMAGES[randomIndex];

      // 2. 更新用データを作成
      // 原石フラグを消し、星座フラグを立て、画像を付与する
      const updatedItem = {
        ...selectedItem,
        isGem: false,           // 原石卒業
        isConstellation: true,  // 星座へ昇格
        image: selectedImage,   // ★ここでランダム写真を貼る
        date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
        memo: selectedItem.memo + '\n(観測完了により星座として登録されました)',
      };

      // 3. データを更新
      if (typeof updateItem === 'function') {
        updateItem(updatedItem); // 親コンポーネントのステートを更新
        alert(`原石「${selectedItem.title}」が輝き出し、星座に変わりました！\n（CONSTELLATIONタブへ移動しました）`);
      } else {
        console.warn('updateItem function is not received.');
        // テスト動作確認用（本番では消して構いません）
        alert(`【テスト動作】本来はここでデータが更新されます。\n選ばれた画像: ${selectedImage}`);
      }
      
      setSelectedItem(null); // モーダルを閉じる

    } else if (selectedItem.isConstellation) {
      // 星座の完了ボタン（必要であればアーカイブなどの処理）
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
            {filteredDisplayItems.length === 0 ? (
              <div style={{color: '#999', marginTop: '50px'}}>NO DATA FOUND</div>
            ) : (
              filteredDisplayItems.map((item, index) => {
                if (!item) return null;
                return (
                  <div key={index} className="s4-star-card" onClick={() => setSelectedItem(item)}>
                      <div className="s4-card-glow"></div>
                      
                      <div className="s4-star-visual">
                      {/* 画像がある場合、または星座の場合は画像表示を優先 */}
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
                      
                      {/* 原石・星座・星でラベルを変える */}
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
               {/* 原石(isGem)の場合のみ完了ボタンを表示 
                  星座完了時に何もアクションしないならボタンは消すか、「確認」のみにする
               */}
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