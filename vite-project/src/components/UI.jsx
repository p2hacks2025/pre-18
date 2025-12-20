import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './UI.css';

const UI = ({ children }) => {
  const [stars, setStars] = useState([]);

  // 星をランダムに生成（一度だけ実行）
  useEffect(() => {
    const starCount = 80; 
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1 + 'px', 
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      duration: Math.random() * 3 + 2 + 's',
      delay: Math.random() * 5 + 's'
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="ui-container">
      {/* 背景レイヤー */}
      <div className="ui-background">
        {stars.map((star) => (
          <div
            key={star.id}
            className="ui-star"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
              animationDuration: star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* メインコンテンツ表示エリア */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {children ? children : <Outlet />}
      </div>
    </div>
  );
};

export default UI;