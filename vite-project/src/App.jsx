import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; // パスは適宜合わせてください
//import InformationScreen from './components/InformationScreen';

function App() {
  // ログイン状態を管理する関数（既存のものがあればそのまま活用）
  const handleLogin = () => {
    console.log("Logged in!");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ログイン画面をルートに設定 */}
        <Route 
          path="/" 
          element={<LoginForm onLogin={handleLogin} />} 
        />
        
        {/* 2. 登録画面（設計図）へのパスを設定 */}
        {/*
        <Route 
          path="/information" 
          element={<InformationScreen />} 
        />
        */}

        {/* 3. ダッシュボードなど、他の遷移先も準備 */}
        <Route 
          path="/dashboard" 
          element={<div style={{color: 'white'}}>ダッシュボード（観測完了）</div>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;