import React from 'react';
import LoginForm from './components/LoginForm';
import RegistrationScreen from './components/RegistrationScreen';

function App() {
  const handleLoginSuccess = () =>{
    console.log("ログイン成功");
  }
    
  return (
    <div>
      <RegistrationScreen/>
      {/*<LoginForm onLogin={handleLoginSuccess}/>*/}
    </div>
  );
}

export default App;
