
// import React from 'react';
// import MainScreen from './components/MainScreen';
// // 使わないインポートは一旦コメントアウトしておくとエラーが出ません
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import LoginForm from './components/LoginForm';

// function App() {
//   return (
//     <div className="App">
//       {/* ログイン判定などを全て飛ばして、MainScreenを直に置く */}
//       <MainScreen />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import LoginForm from './components/LoginForm'; // ログイン画面もインポート

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* URLが「/」のときはログイン画面を表示 */}
        <Route path="/" element={<LoginForm />} />

        {/* URLが「/main」のときはメイン画面を表示 */}
        <Route path="/main" element={<MainScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;