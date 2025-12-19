import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Navigation.css';

const MainLayout = ({ items, addItem, updateItemStatus }) => {

  // 色や影など「動的に変わるスタイル」だけを生成する関数
  const getDynamicBtnStyle = (color, isDisabled = false) => ({
    boxShadow: `0 0 50px ${color}88`, // 色に応じた影
    opacity: isDisabled ? 0.6 : 1,
    cursor: isDisabled ? 'default' : 'pointer',
    pointerEvents: isDisabled ? 'none' : 'auto' // 無効時はクリック不可に
  });

  return (
    <div className="main-layout">
      <div className="content-area">
        
        <main className="main-content">
          {/* Outlet にデータを渡す */}
          <Outlet context={{ items, addItem, updateItemStatus }} />
        </main>
        
        <nav className="right-nav">
          
          {/* 地球：宇宙を見る（自分のホーム） */}
          <Link 
            to="/main" 
            className="nav-btn planet-btn"
          >
            <img 
              src="/image/earth.png" 
              alt="Earth" 
              className="nav-btn-image" 
            />
            <span className="nav-text">宇宙を<br/>見る</span>
          </Link>

        
          {/* 月：原石登録 */}
          <Link 
            to="/main/InformationScreen" 
            className="nav-btn planet-btn"
          >
            <img 
              src="/image/moon.png" 
              alt="Moon" 
              className="nav-btn-image" 
            />
            <span className="nav-text">原石登録</span>
          </Link>

          {/* 太陽：コレクション */}
          <Link 
            to="/main/CollectionScreen4" 
            className="nav-btn planet-btn sun-btn"
          >
            <img 
              src="/image/sun.png" 
              alt="Sun" 
              className="nav-btn-image" 
            />
            <span className="nav-text">コレク<br/>ション</span>
          </Link>
          
        </nav>
      </div>
    </div>
  );
};

export default MainLayout;