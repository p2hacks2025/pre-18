import React from 'react';
import LoginForm from './components/LoginForm';
import MainScreen from './components/MainScreen';

function App() {
  const handleLoginSuccess = () =>{
    console.log("ログイン成功");
  }
    
  return (
    <div>
      <MainScreen/>
      {/*<LoginForm onLogin={handleLoginSuccess}/>*/}
    </div>
  );
}

export default App;
