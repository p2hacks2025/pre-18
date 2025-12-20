
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
import MainLayout from './components/MainLayout';//右画面のアイコン表示用
import CollectionScreen4 from './components/CollectionScreen4';//コレクション機能画面インポート
import InformationScreen from './components/InformationScreen';
import InGalaxy from './components/InGalaxy';


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* URLが「/」のときはログイン画面を表示 */}
//         <Route path="/" element={<LoginForm />} />

//         {/* URLが「/main」のときはメイン画面を表示 */}
//         <Route path="/main" element={<MainScreen />} />
//          <Route path="screen2" element={<InformationScreen />} />
//           <Route path="screen4" element={<CollectionScreen4/>}/>
      
//      </Routes>
//     </BrowserRouter>
//   );
// }



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* URLが「/」のときはログイン画面を表示 */}
        <Route path="/" element={<LoginForm />} />

        {/* URLが「/main」のときはメイン画面を表示 */}
        <Route path="/main" element={<MainLayout />}>
         <Route index element={<MainScreen />} />
         <Route path="/main/InformationScreen" element={<InformationScreen />} />
         <Route path="/main/InGalaxy" element={<InGalaxy />} />
         <Route path="/main/CollectionScreen4" element={<CollectionScreen4/>}/>
        </Route>
     </Routes>
    </BrowserRouter>
  );
}

export default App;