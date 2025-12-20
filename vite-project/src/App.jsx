import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainScreen from './components/MainScreen';
import LoginForm from './components/LoginForm';
import MainLayout from './components/MainLayout';
import CollectionScreen4 from './components/CollectionScreen4';
import InformationScreen from './components/InformationScreen';
import InGalaxy from './components/InGalaxy';
import UI from './components/UI'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* すべての画面をUIで囲む */}
        <Route element={<UI />}>
            <Route path="/" element={<LoginForm />} />
            
            <Route path="/main" element={<MainLayout />}>
                <Route index element={<MainScreen />} />
                <Route path="InformationScreen" element={<InformationScreen />} />
                <Route path="InGalaxy" element={<InGalaxy />} />
                <Route path="CollectionScreen4" element={<CollectionScreen4 />} />
            </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;