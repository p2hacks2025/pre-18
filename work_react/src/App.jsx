import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// 各コンポーネントのインポート
import LoginForm from './LoginForm'; 
import MainLayout from './MainLayout';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
//import Screen4 from './Screen4';

// 1. ログイン成功時の処理を管理するコンポーネント
const LoginWithTransition = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("親コンポーネントでログインを検知しました。遷移します。");
    navigate('/dashboard');
  };

  // ここで onLogin という名前の Props を確実に渡す！
  return <LoginForm onLogin={handleLogin} />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 直接 LoginForm を呼ぶのではなく、LoginWithTransition を呼ぶのがコツ */}
        <Route path="/" element={<LoginWithTransition />} />
        
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<Screen1 />} /> 
          <Route path="screen2" element={<Screen2 />} />
          <Route path="screen3" element={<Screen3 />} />
          {/*<Route path="screen4" element={<Screen4 />} />*/}
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;