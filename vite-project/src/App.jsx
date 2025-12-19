import React from 'react';
import MainScreen from './components/MainScreen';
// 使わないインポートは一旦コメントアウトしておくとエラーが出ません
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import LoginForm from './components/LoginForm';

function App() {
  return (
    <div className="App">
      {/* ログイン判定などを全て飛ばして、MainScreenを直に置く */}
      <MainScreen />
    </div>
  );
}

export default App;