import React from 'react';
import { Link, Outlet, useOutletContext } from 'react-router-dom';
import './Navigation.css';

const MainLayout = () => {
  const context = useOutletContext();

  // 惑星ボタンのスタイル（さらに巨大化：220px）
  const getNavButtonStyle = (color) => ({
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    backgroundColor: color, // 画像の下地として機能します
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff', // 画像の上なので白文字で見やすく
    textDecoration: 'none',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: `0 0 50px ${color}88`,
    position: 'relative',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    border: 'none',
    lineHeight: '1.4',
    flexShrink: 0,
    overflow: 'hidden', // 画像を丸の中に閉じ込める
    textShadow: '0 2px 15px rgba(0,0,0,0.8)', // 文字を読みやすくする強い影
  });

  // ボタン内の画像のスタイル
  const navImageStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.7, // 文字を際立たせるため少し暗く
    transition: 'opacity 0.3s ease',
  };

  // 文字を包む要素のスタイル（画像より手前に表示）
  const textWrapperStyle = {
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div style={styles.layout}>
      <div style={styles.contentArea}>
        
        <main style={styles.mainContent}>
          <Outlet context={context} /> 
        </main>
        
        <nav style={styles.rightNav}>
          {/* 宇宙を見る（地球イメージ） */}
          <Link to="/dashboard" style={getNavButtonStyle('#add8e6')} className="planet-btn">
            {/* ↓ここに実際の画像パスを入れてください */}
            <img src="https://via.placeholder.com/220x220/2196f3/ffffff?text=Earth" alt="Earth" style={navImageStyle} className="planet-img" />
            <span style={textWrapperStyle}>宇宙を<br/>見る</span>
          </Link>

          {/* 原石登録（月イメージ） */}
          <Link to="screen2" style={getNavButtonStyle('#fff9c4')} className="planet-btn">
            {/* ↓ここに実際の画像パスを入れてください */}
            <img src="https://via.placeholder.com/220x220/fff176/333333?text=Moon" alt="Moon" style={navImageStyle} className="planet-img" />
            <span style={textWrapperStyle}>原石登録</span>
          </Link>

          {/* コレクション（太陽イメージ） */}
          <Link to="screen3" style={getNavButtonStyle('#ffc1cc')} className="planet-btn sun-btn">
            {/* ↓ここに実際の画像パスを入れてください */}
            <img src="https://via.placeholder.com/220x220/ff7043/ffffff?text=Sun" alt="Sun" style={navImageStyle} className="planet-img" />
            <span style={textWrapperStyle}>コレク<br/>ション</span>
          </Link>
        </nav>

      </div>
    </div>
  );
};

const styles = {
  layout: { 
    height: '100vh', 
    width: '100vw', 
    backgroundColor: '#050a1b',
    overflow: 'hidden',
    position: 'relative'
  },
  contentArea: { 
    display: 'flex', 
    height: '100%', 
    width: '100%',
  },
  mainContent: { 
    flex: 1, 
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  rightNav: { 
    width: '300px', // ボタンサイズに合わせて幅を拡大
    height: '100%',
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '40px 0',
    zIndex: 100,
    borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(255, 255, 255, 0.01)'
  }
};

export default MainLayout;