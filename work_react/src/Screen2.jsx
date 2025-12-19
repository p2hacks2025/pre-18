import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const Screen2 = () => {
  const { addItem } = useOutletContext() || {};
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [selectedTag, setSelectedTag] = useState('アイデア');
  const [objectType, setObjectType] = useState('星');
  const [isPublic, setIsPublic] = useState(false);

  const tagColors = {
    'イラスト': '#4facfe', 'アイデア': '#f9d423', '学習': '#a8edea',
    '健康': '#5ee7df', '仕事': '#667eea', '趣味': '#ff9a9e',
  };

  const currentColor = tagColors[selectedTag] || '#fff';

// これを貼り付ける
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert('名称を入力してください。');

    // 1. Flaskに送るデータを作る
    const formData = new FormData();
    formData.append('title', title);
    formData.append('comment', memo);
    formData.append('tags', selectedTag);
    formData.append('date', new Date().toISOString().split('T')[0]);

    try {
      // 2. サーバー(5000番)に送信
      const response = await fetch('http://127.0.0.1:5000/api/submit', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('観測データをサーバーに転送しました🚀');
        navigate('/'); // ← ★トップ画面に戻る設定です
      } else {
        alert('転送失敗...サーバーエラー');
      }

    } catch (error) {
      console.error('通信エラー:', error);
      alert('サーバーと通信できません。Flaskは動いていますか？');
    }
  };

  const getBtnStyle = (isSelected) => ({
    ...styles.selectionButton,
    backgroundColor: isSelected ? currentColor : 'rgba(255,255,255,0.05)',
    color: isSelected ? '#050a1b' : '#fff',
    borderColor: isSelected ? currentColor : 'rgba(255,255,255,0.2)',
    boxShadow: isSelected ? `0 0 10px ${currentColor}44` : 'none',
  });

  return (
    <div style={styles.container}>
      <div style={styles.gridBackground}></div>
      
      {/* タイトル：少し下げてゆとりを持たせる */}
      <h2 style={{...styles.title, color: currentColor, textShadow: `0 0 20px ${currentColor}44`}}>原石の観測設計図</h2>

      <form onSubmit={handleSubmit} style={styles.formArea}>
        
        {/* --- ノード1：DATA INPUT --- */}
        <div style={styles.nodeWrapper}>
          <div style={{...styles.nodePoint, borderColor: currentColor, boxShadow: `0 0 20px ${currentColor}`}}></div>
          <div style={styles.nodeBox}>
            <h3 style={{...styles.nodeHeader, color: currentColor}}>01. DATA INPUT</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>名称</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} placeholder="観測対象を命名..." />
            </div>
            <div style={{marginTop: '15px'}}>
              <label style={styles.label}>詳細記録</label>
              <textarea value={memo} onChange={(e) => setMemo(e.target.value)} style={styles.textarea} placeholder="メモを記述..." />
            </div>
          </div>
        </div>

        {/* 接続線：垂直に近い角度で「繋がり」を強調 */}
        <div style={{...styles.line, backgroundColor: currentColor, boxShadow: `0 0 8px ${currentColor}66`}}></div>

        {/* --- ノード2：PROPERTIES --- */}
        <div style={{...styles.nodeWrapper, marginTop: '25px'}}>
          <div style={{...styles.nodePoint, borderColor: currentColor, boxShadow: `0 0 20px ${currentColor}`}}></div>
          <div style={styles.nodeBox}>
            <h3 style={{...styles.nodeHeader, color: currentColor}}>02. PROPERTIES</h3>
            
            <div style={styles.propertyGrid}>
              <div style={{flex: 1.2}}>
                <label style={styles.label}>銀河タグ</label>
                <div style={styles.btnGrid}>
                  {Object.keys(tagColors).map(tag => (
                    <button key={tag} type="button" onClick={() => setSelectedTag(tag)} style={getBtnStyle(selectedTag === tag)}>{tag}</button>
                  ))}
                </div>
              </div>
              <div style={{flex: 1}}>
                <label style={styles.label}>形態</label>
                <div style={styles.btnGrid}>
                  {['星', '星座'].map(type => (
                    <button key={type} type="button" onClick={() => setObjectType(type)} style={getBtnStyle(objectType === type)}>{type}</button>
                  ))}
                </div>
              </div>
            </div>

            <div style={styles.toggleArea}>
              <div onClick={() => setIsPublic(!isPublic)} style={{...styles.toggleContent, color: isPublic ? currentColor : '#888'}}>
                <span style={styles.toggleIcon}>{isPublic ? '✦' : '✧'}</span>
                <span>{isPublic ? '他の観測者へ公開する' : 'この記録を非公開にする'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 登録ボタン：デザインの締めくくり */}
        <div style={styles.submitWrapper}>
          <button type="submit" style={{...styles.submitBtn, borderColor: currentColor, color: currentColor, boxShadow: `0 0 20px ${currentColor}22`}}>
            宇宙へ記録を刻む
          </button>
        </div>

      </form>
    </div>
  );
};

const styles = {
  container: { 
    width: '100%', height: '100vh', position: 'relative', 
    padding: '0 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden'
  },
  gridBackground: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: -1 },
  
  title: { fontSize: '1.4rem', marginBottom: '35px', fontWeight: '200', letterSpacing: '10px', fontFamily: 'serif', transition: 'all 0.5s ease' },
  
  formArea: { position: 'relative', width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column' },
  
  nodeWrapper: { display: 'flex', alignItems: 'flex-start', position: 'relative', zIndex: 2 },
  nodePoint: { width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, border: '3px solid', backgroundColor: '#050a1b', marginRight: '25px', marginTop: '6px', transition: 'all 0.5s ease' },
  nodeBox: { 
    flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', 
    borderRadius: '16px', padding: '22px 28px', backdropFilter: 'blur(12px)', transition: 'all 0.3s ease'
  },
  nodeHeader: { fontSize: '0.8rem', marginBottom: '18px', fontWeight: 'bold', letterSpacing: '3px', opacity: 0.8 },

// 以前のコード...
  nodeHeader: { fontSize: '0.8rem', marginBottom: '18px', fontWeight: 'bold', letterSpacing: '3px', opacity: 0.8 },

  // ▼▼▼ この定義を追加してください ▼▼▼
  inputGroup: { marginBottom: '25px', position: 'relative' }, 
  // ▲▲▲▲▲▲

  label: { display: 'block', fontSize: '0.75rem', color: '#777', marginBottom: '8px', letterSpacing: '1px' },
  // 続き...
  
  label: { display: 'block', fontSize: '0.75rem', color: '#777', marginBottom: '8px', letterSpacing: '1px' },
  input: { width: '100%', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', padding: '8px 0', color: '#fff', fontSize: '1.1rem', outline: 'none', transition: 'border 0.3s ease' },
  textarea: { width: '100%', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '0.95rem', minHeight: '75px', maxHeight: '100px', outline: 'none', resize: 'none' },

  // ノード同士を繋ぐ線
  line: { position: 'absolute', width: '2px', height: '60px', left: '8px', top: '45px', opacity: 0.4, zIndex: 1, transition: 'all 0.5s ease' },

  propertyGrid: { display: 'flex', gap: '30px' },
  btnGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  selectionButton: { padding: '6px 14px', borderRadius: '18px', border: '1px solid', cursor: 'pointer', transition: 'all 0.3s ease', fontSize: '0.75rem', background: 'none' },

  toggleArea: { marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.08)' },
  toggleContent: { cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.3s ease' },
  toggleIcon: { fontSize: '1.2rem' },

  submitWrapper: { textAlign: 'center', marginTop: '40px' },
  submitBtn: { padding: '14px 80px', borderRadius: '40px', border: '1px solid', backgroundColor: 'rgba(255,255,255,0.03)', fontSize: '1.1rem', letterSpacing: '6px', cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: 'serif' },
};

export default Screen2;