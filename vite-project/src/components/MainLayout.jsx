import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Navigation.css';

const MainLayout = () => {
  // データを管理
  const [items, setItems] = useState([]);

  //画面が開かれたらPythonからデータを取ってくる
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://pre-18-3r22.onrender.com/api/stones');
      const data = await response.json();

      if (data.success) {
        //DBのデータ(snake_case)をReact用(camelCase)に変換してセット
        const formattedItems = data.stones.map(item => ({
          id: item.id,
          title: item.title,
          memo: item.memo,
          tags: item.tags || [], //nullなら空配列
          date: item.created_at,
          
          //DBの「星」か「星座」かを見てReact用のフラグを立てる
          isGem: item.object_type === '星',//「星」なら原石扱い
          isConstellation: item.object_type === '星座', //「星座」なら星座扱い
          isCompleted: false, //必要ならDBにカラム追加
          image: null//画像URL用
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      console.error("データの取得に失敗:", error);
    }
  };

  //データを追加する関数、表示更新のためのもの
  const addItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
    fetchItems(); 
  };

  //データを更新する関数
  //データを更新する関数 (DBとも連携)
  const updateItem = async (updatedItem) => {
    //UI更新
    setItems(prevItems => 
      prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
    );

    //Pythonに報告
//Pythonに報告
    try {
      await fetch(`https://pre-18-3r22.onrender.com/api/stones/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // ▼▼▼ ここを修正！ ▼▼▼
          objectType: updatedItem.isConstellation ? '星座' : '星', 
          // （修正前は object_type でした）
          
          image: updatedItem.image
        }),
      });
      console.log("DB更新完了: 星座へ進化");
    } catch (error) {
      console.error("DB更新失敗:", error);
      alert("進化の記録に失敗しました...");
    }
  };
    
    // ★発展課題: ここで本当は '/api/stones/update' みたいなAPIを呼んで
    // DBの中身も書き換える必要がありますが、まずは「見た目の更新」まで！

  return (
    <div className="main-layout">
      <div className="content-area">
        
        <main className="main-content">
          {/*Outletにデータを渡す*/}
          <Outlet context={{ items, addItem, updateItem }} />
        </main>
        
        <nav className="right-nav">
          
          {/*宇宙を見る*/}
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

        
          {/*原石登録*/}
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

          {/*コレクション*/}
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