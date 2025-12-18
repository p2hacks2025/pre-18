import React from 'react';
import LoginForm from './components/LoginForm';

function App() {
  const handleLoginSuccess = () =>{
    console.log("ログイン成功");
  }
    
  return (
    <div>
      <LoginForm onLogin={handleLoginSuccess}/>
    </div>
  );
}

export default App;
