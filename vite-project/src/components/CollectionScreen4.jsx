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
  // 親コンポーネントからの updateItem も一応受け取れるように残しますが、
  // 基本的にはこのコンポーネント内でデータを再取得して画面を更新します。
  const { updateItem } = useOutletContext() || {};

  // --- State ---
  const [activeTab, setActiveTab] = useState('star');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // ★バックエンド機能: DBデータの管理用State
  const [dbItems, setDbItems] = useState([]); 
  const [loading, setLoading] = useState(true);

  // ========================================================
  // ★バックエンド機能: 1. DBからデータを取得 (GET)
  // ========================================================
  const fetchStones = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/stones');
      if (response.ok) {
        const data = await response.json();
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

  // 初回ロード時に実行
  useEffect(() => {
    fetchStones();
  }, []);

  // ========================================================
  // ★フロントエンド機能: リスト表示ロジック (UI維持)
  // ========================================================
  // DBデータ(dbItems)を使ってフィルタリング
  const validItems = dbItems.filter(item => item && (item.isCompleted || item.isGem || item.isConstellation));

  /* --- サンプルデータ（データが空の時用：フロントエンドの仕様を維持） --- */
  const sampleStar = { 
    id: 'sample-s', title: 'チタタプ', memo: '初期アイデア', tags: ['sample'], isCompleted: true 
  };
  const sampleGem = {
    id: 'gem-1', title: '未明の原石', memo: 'まだ磨かれていない石', tags: ['原石'], isGem: true 
  };

  // 読み込み完了後、データがあればそれを表示。なければサンプルを表示
  // (ローディング中は何も出さないか、ローディング表示にするかはここで制御)
  const displayItems = loading ? [] : (validItems.length > 0 ? validItems : [sampleStar, sampleGem]);

  // タブごとの出し分け
  const filteredDisplayItems = displayItems.filter(item => {
    if (activeTab === 'star') {
      return item.isGem || item.isCompleted;
    } else {
      return item.isConstellation;
    }
  });

  // ========================================================
  // ★統合機能: 完了ボタンの処理 (DB更新 + UI反映)
  // ========================================================
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
        image: selectedImage,   // ランダム画像を付与
        memo: (selectedItem.memo || '') + '\n(観測完了により星座として登録されました)',
      };

      // 3. DBへ保存 (PUT) ※サンプルデータの場合は保存しないガードを入れる
      if (typeof selectedItem.id === 'number') {
        try {
          const response = await fetch(`http://127.0.0.1:5000/api/stones/${selectedItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
          });

          if (response.ok) {
            // 成功したらローカルの表示も更新
            setDbItems(prevItems => 
              prevItems.map(item => (item.id === selectedItem.id ? updatedData : item))
            );
            
            // 親コンポーネントへ通知（もし必要なら）
            if (typeof updateItem === 'function') {
               updateItem(updatedData);
            }

            alert(`原石「${selectedItem.title}」が輝き出し、星座に変わりました！\n（CONSTELLATIONタブへ移動しました）`);
            setSelectedItem(null);       // モーダルを閉じる
            setActiveTab('constellation'); // タブ移動
          } else {
            alert('データの更新に失敗しました');
          }
        } catch (error) {
          console.error('更新通信エラー:', error);
          alert('サーバーと通信できませんでした');
        }
      } else {
        // IDが数値でない＝サンプルデータの場合の動作（フロントエンドのテスト用挙動）
        alert(`【サンプル動作】本来はDBが更新されます。\n選ばれた画像: ${selectedImage}`);
        setSelectedItem(null);
      }

    } else if (selectedItem.isConstellation) {
      alert('この星座は既に観測済みです。');
    }
  };

  // ========================================================
  // ★UI描画 (フロントエンドのコードを完全維持)
  // ========================================================
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
              <div style={{color: '#999', marginTop: '50px', gridColumn: '1 / -1', textAlign: 'center'}}>LOADING...</div>
            ) : filteredDisplayItems.length === 0 ? (
              <div style={{color: '#999', marginTop: '50px', gridColumn: '1 / -1', textAlign: 'center'}}>NO DATA FOUND</div>
            ) : (
              filteredDisplayItems.map((item, index) => {
                if (!item) return null;
                return (
                  <div key={item.id || index} className="s4-star-card" onClick={() => setSelectedItem(item)}>
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
              {/* 安全策: tagsが配列ならmap、文字列ならそのまま、未定義なら空 */}
              {Array.isArray(selectedItem.tags) 
                ? selectedItem.tags.map((tag, i) => <span key={i} className="s4-tag-badge">#{tag}</span>)
                : (selectedItem.tags ? <span className="s4-tag-badge">#{selectedItem.tags}</span> : null)
              }
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
               {/* 原石(isGem)の場合のみ完了ボタンを表示 */}
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