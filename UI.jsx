import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'; // ルーターの中身を表示するための機能
import './UI.css';

const UI = ({ children }) => {
  const [stars, setStars] = useState([]);

  // 星をランダムに生成するロジック（一度だけ実行）
  useEffect(() => {
    const starCount = 80; // 星の数
    const newStars = Array.from({ length: starCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1 + 'px', // 1px〜3px
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      duration: Math.random() * 3 + 2 + 's', // 点滅速度
      delay: Math.random() * 5 + 's'
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="ui-container">
      {/* 1. 背景レイヤー（星空） */}
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

      {/* 2. メインコンテンツ表示エリア */}
      {/* ここに MainScreen や InGalaxy が表示されます */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        {/* childrenがあればそれを表示、なければOutlet（ルーター）を表示 */}
        {children ? children : <Outlet />}
      </div>
    </div>
  );
};

export default UI;