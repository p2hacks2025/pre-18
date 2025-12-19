import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './InformationScreen.css'; // Make sure this matches your CSS filename

const InformationScreen = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert('名称を入力してください。');
    const newItem = { 
      id: Date.now(), 
      title, 
      memo, 
      tags: [selectedTag], 
      objectType, 
      isPublic, 
      date: new Date().toISOString() 
    };
    if (addItem) addItem(newItem);
    navigate('/dashboard');
  };

  // Helper for dynamic button styles
  const getBtnStyle = (isSelected) => ({
    backgroundColor: isSelected ? currentColor : 'rgba(255,255,255,0.05)',
    color: isSelected ? '#050a1b' : '#fff',
    borderColor: isSelected ? currentColor : 'rgba(255,255,255,0.2)',
    boxShadow: isSelected ? `0 0 10px ${currentColor}44` : 'none',
  });

  return (
    <div className="container">
      <div className="gridBackground"></div>
      
      {/* Title with dynamic glow */}
      <h2 
        className="title" 
        style={{ color: currentColor, textShadow: `0 0 20px ${currentColor}44` }}
      >
        原石の観測設計図
      </h2>

      <form onSubmit={handleSubmit} className="formArea">
        
        {/* --- NODE 1: DATA INPUT --- */}
        <div className="nodeWrapper">
          <div 
            className="nodePoint" 
            style={{ borderColor: currentColor, boxShadow: `0 0 20px ${currentColor}` }}
          ></div>
          
          <div className="nodeBox">
            <h3 className="nodeHeader" style={{ color: currentColor }}>
              01. DATA INPUT
            </h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label className="label">名称</label>
              <input 
                className="input"
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="観測対象を命名..." 
              />
            </div>
            
            <div>
              <label className="label">詳細記録</label>
              <textarea 
                className="textarea"
                value={memo} 
                onChange={(e) => setMemo(e.target.value)} 
                placeholder="メモを記述..." 
              />
            </div>
          </div>
        </div>

        {/* Connection Line */}
        <div 
          className="line" 
          style={{ backgroundColor: currentColor, boxShadow: `0 0 8px ${currentColor}66` }}
        ></div>

        {/* --- NODE 2: PROPERTIES --- */}
        <div className="nodeWrapper" style={{ marginTop: '25px' }}>
          <div 
            className="nodePoint" 
            style={{ borderColor: currentColor, boxShadow: `0 0 20px ${currentColor}` }}
          ></div>
          
          <div className="nodeBox">
            <h3 className="nodeHeader" style={{ color: currentColor }}>
              02. PROPERTIES
            </h3>
            
            <div className="propertyGrid">
              <div style={{ flex: 1.2 }}>
                <label className="label">銀河タグ</label>
                <div className="btnGrid">
                  {Object.keys(tagColors).map(tag => (
                    <button 
                      key={tag} 
                      type="button" 
                      className="selectionButton"
                      onClick={() => setSelectedTag(tag)} 
                      style={getBtnStyle(selectedTag === tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <label className="label">形態</label>
                <div className="btnGrid">
                  {['星', '星座'].map(type => (
                    <button 
                      key={type} 
                      type="button" 
                      className="selectionButton"
                      onClick={() => setObjectType(type)} 
                      style={getBtnStyle(objectType === type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="toggleArea">
              <div 
                className="toggleContent" 
                onClick={() => setIsPublic(!isPublic)}
                style={{ color: isPublic ? currentColor : '#888' }}
              >
                <span className="toggleIcon">{isPublic ? '✦' : '✧'}</span>
                <span>{isPublic ? '他の観測者へ公開する' : 'この記録を非公開にする'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="submitWrapper">
          <button 
            type="submit" 
            className="submitBtn"
            style={{ 
              borderColor: currentColor, 
              color: currentColor, 
              boxShadow: `0 0 20px ${currentColor}22` 
            }}
          >
            宇宙へ記録を刻む
          </button>
        </div>

      </form>
    </div>
  );
};

export default InformationScreen;