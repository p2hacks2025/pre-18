import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Navigation.css';

const MainLayout = () => {
  // ★重要: ここでデータを管理します
  const [items, setItems] = useState([]);

  // --- 1. 画面が開かれたら、Pythonからデータを取ってくる (GET) ---
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/stones');
      const data = await response.json();

      if (data.success) {
        // DBのデータ(snake_case)をReact用(camelCase)に変換してセット
        const formattedItems = data.stones.map(item => ({
          id: item.id,
          title: item.title,
          memo: item.memo,
          tags: item.tags || [], // nullなら空配列にする
          date: item.created_at,
          
          // ★DBの「星」か「星座」かを見て、React用のフラグを立てる
          isGem: item.object_type === '星',            // 「星」なら原石扱い
          isConstellation: item.object_type === '星座', // 「星座」なら星座扱い
          isCompleted: false, // 必要ならDBにカラム追加（今回は初期値false）
          image: null         // 画像URLがあればここに入れる
        }));
        setItems(formattedItems);
      }
    } catch (error) {
      console.error("データの取得に失敗:", error);
    }
  };

  // --- 2. データを追加する関数 (InformationScreen用) ---
  // (ここはDB保存処理をInformationScreen側でやっているので、表示更新用)
  const addItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
    // 念のため再取得しても良い
    fetchItems(); 
  };

  // --- 3. データを更新する関数 (CollectionScreenの「完了」ボタン用) ---
// --- 3. データを更新する関数 (DBとも連携) ---
  const updateItem = async (updatedItem) => {
    // まず画面をサクサク更新しちゃう（楽観的UI更新）
    setItems(prevItems => 
      prevItems.map(item => item.id === updatedItem.id ? updatedItem : item)
    );

    // 裏でPythonに報告
    try {
      await fetch(`http://127.0.0.1:5000/api/stones/${updatedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          object_type: updatedItem.isConstellation ? '星座' : '星',
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
          {/* Outlet にデータを渡す */}
          <Outlet context={{ items, addItem, updateItem }} />
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