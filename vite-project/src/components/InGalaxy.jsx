import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './InGalaxy.css'; 
import './ShootingStar.css'; 

const InGalaxy = () => {
  const navigate = useNavigate();

  // ★変更点です: 固定データを削除し、親(MainLayout)からデータと再取得関数(fetchItems)を受け取ります
  // fetchItemsを受け取ることで、この画面に来るたびに最新データを読み込めます
  const { items, fetchItems } = useOutletContext(); 

  // ★変更点です: この画面が開かれた瞬間に、最新のデータをサーバーに取りに行きます
  useEffect(() => {
    if (fetchItems) {
      fetchItems();
    }
  }, []); // 最初の1回だけ実行

  const [selectedItem, setSelectedItem] = useState(null);

  // ★変更点です: データがまだ読み込まれていない、または空の場合の表示
  // DBがつながっていない、または登録データが0件の場合はここが表示されます
  if (!items || items.length === 0) {
    return (
      <div className="s3-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h2 style={{ color: 'white', opacity: 0.7 }}>まだ星は見つかりません...</h2>
        <p style={{ color: '#ccc' }}>「Moon (原石登録)」から新しい星を登録してみましょう。</p>
        
        {/* デバッグ用にコレクション画面へ行けるボタンは残しておきます */}
        <button onClick={() => navigate('/main/CollectionScreen4')} style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}>
          コレクション一覧へ
        </button>
      </div>
    );
  }

  return (
    <div className="s3-container">
      {/* デバッグ表示: 実際に何個データがあるか確認用 */}
      <div style={{ position: 'absolute', top: 10, left: 10, color: '#00ff00', fontSize: '0.8rem', zIndex: 9999 }}>
        登録済みの星: {items.length}個
      </div>

      <div className="debug-panel">
        <button onClick={() => navigate('/main/CollectionScreen4')} className="debug-button">
          📋 コレクションへ
        </button>
      </div>

      <h1 style={{ color: 'white' }}>👤 私の宇宙</h1>
      
      <div className="sky-area">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="symbol"
            style={{
              position: 'absolute',
              // ★変更点です: DBからの座標を使用。なければランダム配置
              top: item.top || `${Math.random() * 80 + 10}%`, 
              left: item.left || `${Math.random() * 80 + 10}%`,
              
              backgroundColor: item.isGem ? '#FFD700' : '#4169E1',
              borderRadius: item.isGem ? '50%' : '4px',
              boxShadow: item.isGem ? '0 0 10px #FFD700' : 'none'
            }}
          >
            <span style={{ fontSize: '12px' }}>{item.isGem ? '★' : '◆'}</span>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>{selectedItem.title}</h2>
            <p>{selectedItem.memo}</p>
            <p style={{fontSize:'0.8rem', color:'#ccc'}}>{selectedItem.date}</p>
            <button onClick={() => setSelectedItem(null)} style={{marginTop:'20px', color:'black', cursor:'pointer'}}>閉じる</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InGalaxy;