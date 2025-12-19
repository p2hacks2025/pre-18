import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Navigation.css';

const MainLayout = ({ items, addItem, updateItemStatus }) => {

  // 色や影など「動的に変わるスタイル」だけを生成する関数
  const getDynamicBtnStyle = (color, isDisabled = false) => ({
    backgroundColor: color,
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
          
          {/* 地球：宇宙を見る */}
          <Link 
            to="/dashboard" 
            className="nav-btn planet-btn"
            style={getDynamicBtnStyle('#add8e6')}
          >
            <img 
              src="https://via.placeholder.com/220x220/2196f3/ffffff?text=Earth" 
              alt="Earth" 
              className="nav-btn-image" 
            />
            <span className="nav-text">宇宙を<br/>見る</span>
          </Link>

          {/* 月：原石登録 */}
          <Link 
            to="/dashboard/screen2" 
            className="nav-btn planet-btn"
            style={getDynamicBtnStyle('#fff9c4')}
          >
            <img 
              src="https://via.placeholder.com/220x220/fff176/333333?text=Moon" 
              alt="Moon" 
              className="nav-btn-image" 
            />
            <span className="nav-text">原石登録</span>
          </Link>

          {/* 太陽：コレクション */}
          <Link 
            to="screen4" 
            className="nav-btn planet-btn sun-btn"
            style={getDynamicBtnStyle('#ffc1cc')}
          >
            <img 
              src="https://via.placeholder.com/220x220/ff7043/ffffff?text=Sun" 
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