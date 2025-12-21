import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './CollectionScreen4.css';

const CollectionScreen4 = () => {
  // MainLayoutからデータをもらう（もし来なくても空配列にする）
  const { items = [], updateItem } = useOutletContext() || {};
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('star');
  const [selectedItem, setSelectedItem] = useState(null);

  /* ▼▼▼ 追加：強制サンプルデータ（APIがダメな時用） ▼▼▼ */
  const sampleData = [
    {
      id: 'sample-1',
      title: 'ポートフォリオページの作成',
      memo: 'ワークショップに関するポートフォリオページの作成',
      object_type: '原石',
      isGem: true,
      tags: ['仕事'],
      image: null
    },
    {
      id: 'sample-2',
      title: 'UIデザインのラフ作成',
      memo: 'トップページと詳細画面の手書きラフを描く',
      object_type: '原石',
      isGem: true,
      tags: ['デザイン'],
      image: null
    },
    {
      id: 'sample-3',
      title: '使用技術の選定',
      memo: 'フロントエンドとバックエンドのフレームワーク比較',
      object_type: '原石',
      isGem: true,
      tags: ['学習'],
      image: null
    },
    {
      id: 'sample-4',
      title: 'ロゴのアイデア出し',
      memo: 'サービス名を体現するロゴのスケッチ',
      object_type: '原石',
      isGem: true,
      tags: ['アイデア'],
      image: null
    },
    {
      id: 'sample-5',
      title: 'ユーザーインタビュー',
      memo: 'ターゲット層3名へのヒアリング実施',
      object_type: '原石',
      isGem: true,
      tags: ['調査'],
      image: null
    }
  ];
  /* ▲▲▲ 追加終わり ▲▲▲ */

  // ▼▼▼ 修正：データがあるならそれを、なければサンプルを使う ▼▼▼
  // itemsの中身が0個なら、sampleDataを使うように切り替えます
  const sourceData = (items && items.length > 0) ? items : sampleData;

  const filteredDisplayItems = sourceData.filter(item => {
    if (!item) return false;
    
    if (activeTab === 'star') {
      // 星、原石、または object_type が 星/原石 のものを表示
      return item.object_type === '星' || item.object_type === '原石' || item.isGem;
    } else {
      return item.object_type === '星座' || item.isConstellation;
    }
  });

  // 星座画像の候補
  const CONSTELLATION_IMAGES = [
      '/image/Hituzi.png', '/image/Hutago.png', '/image/Kani.png',
      '/image/Otome.png', '/image/Ousi.png', '/image/Shi.png',
  ];

  // 星座にする処理
  const handleComplete = () => {
    // データがない場合のガード
    if (!selectedItem) return;

    const randomIndex = Math.floor(Math.random() * CONSTELLATION_IMAGES.length);
    const selectedImage = CONSTELLATION_IMAGES[randomIndex];

    const updatedItem = {
      ...selectedItem,
      isGem: false,           
      isConstellation: true,
      object_type: '星座', // ここも更新
      image: selectedImage,   
      memo: selectedItem.memo + '\n(星座になりました)',
    };

    if (updateItem) {
      updateItem(updatedItem); 
      alert('星座になりました！');
    } else {
       // updateItem関数がない（サンプルデータの）場合、見た目だけ変えるなどの処理が必要ですが
       // いったんアラートだけ出します
       alert('（サンプルモード）星座になりました！');
    }
    setSelectedItem(null); 
  };

  return (
    <div className="s4-container">
      <div className="s4-header">
        <h2 className="s4-page-title">COLLECTION</h2>
        <div className="s4-tabs">
          <button className={`s4-tab-button ${activeTab === 'star' ? 'active' : ''}`} onClick={() => setActiveTab('star')}>
            STAR / GEM
          </button>
          <button className={`s4-tab-button ${activeTab === 'constellation' ? 'active' : ''}`} onClick={() => setActiveTab('constellation')}>
            CONSTELLATION
          </button>
        </div>
      </div>

      <div className="s4-content-area">
        <div className="s4-grid-container fadeIn">
            {filteredDisplayItems.length === 0 ? (
              <div style={{color: '#999', marginTop: '50px', textAlign: 'center'}}>NO DATA FOUND</div>
            ) : (
              filteredDisplayItems.map((item, index) => (
                  <div key={index} className="s4-star-card" onClick={() => setSelectedItem(item)}>
                      <div className="s4-star-visual">
                      {item.image ? (
                          <img src={item.image} alt={item.title} className="s4-card-img" />
                      ) : (
                          <div className="s4-core-star" style={(item.isGem || item.object_type === '原石') ? { background: '#ffd700', boxShadow: '0 0 20px gold' } : {}}></div>
                      )}
                      </div>
                      <p className="s4-star-name">{item.title}</p>
                  </div>
              ))
            )}
        </div>
      </div>

      {selectedItem && (
        <div className="s4-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="s4-modal-content scaleIn" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedItem.title}</h2>
            <div className="s4-tags-row">
              {selectedItem.tags?.map((tag, i) => <span key={i} className="s4-tag-badge">#{tag}</span>)}
            </div>
            <p>{selectedItem.memo}</p>
            <div className="s4-modal-footer">
               {/* 原石または星の場合にボタンを表示 */}
               {(selectedItem.isGem || selectedItem.object_type === '原石' || selectedItem.object_type === '星') && (
                 <button className="s4-complete-btn" onClick={handleComplete}>✦ AWAKEN ✦</button>
               )}
            </div>
            <button className="s4-modal-close" onClick={() => setSelectedItem(null)}>CLOSE</button>
          </div>
        </div>
      )}
      
      <button className="s4-back-btn" onClick={() => navigate(-1)}>BACK</button>
    </div>
  );
};

export default CollectionScreen4;