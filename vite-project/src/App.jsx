import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // 追加
import InformationScreen from './components/InformationScreen';

function App() {
  return (
    // 1. 全体を BrowserRouter で囲む
    <BrowserRouter>
      <Routes>
        {/* 2. 表示したいコンポーネントを Route として設定する */}
        <Route path="/" element={<InformationScreen />} />
        
        {/* navigate('/dashboard') の移動先も作っておかないとエラーになります */}
        <Route path="/dashboard" element={<div>ダッシュボード画面（遷移先）</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
