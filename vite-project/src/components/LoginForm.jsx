import React, { useState, useEffect } from 'react';
import './LoginForm.css'; 

const LoginForm = ({ onLogin }) => { // 関数名をKariに変更
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [Stars, setStars] = useState([]);

  useEffect(() => {
    const stars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1 + 'px',
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      duration: Math.random() * 3 + 2 + 's',
      delay: Math.random() * 5 + 's',
    }));
    setStars(stars);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'signup') {
      console.log('新規登録:', { username, email, password });
    } else {
      console.log('ログイン:', { email, password });
    }
    onLogin();
  };

  return (
    <div className="backgroundStyle" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="login-background">
        {Stars.map((star) => (
          <div
            key={star.id}
            className="twinkle-star"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
              animationDuration: star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="cardStyle">
        {/* ロゴを入れるためのスペース */}
        <img src="/image/logo2.png" alt="logo" className="login-logo" />

        <div className="tab-group">
  <button 
    className="tab-button"
    style={{ 
      /* 'none' ではなく 'transparent'（透明）な線を常に引く */
      borderBottom: mode === 'login' ? '3px solid #007bff' : '3px solid transparent', 
      color: mode === 'login' ? '#007bff' : '#333' 
    }}
    onClick={() => setMode('login')}
  >
    ログイン
  </button>
  <button 
    className="tab-button"
    style={{ 
      /* こちらも同様に transparent を指定 */
      borderBottom: mode === 'signup' ? '3px solid #007bff' : '3px solid transparent', 
      color: mode === 'signup' ? '#007bff' : '#333' 
    }}
    onClick={() => setMode('signup')}
  >
    新規登録
  </button>
</div>

        <form onSubmit={handleSubmit} className="form-style">
  
  {/* ユーザー名：条件分岐を外して、常に表示するようにしました */}
  <div className="input-group">
    <label className="label-style">ユーザー名</label>
    <input 
      type="text" 
      value={username} 
      onChange={(e) => setUsername(e.target.value)} 
      required 
      className="input-field"
      placeholder="ユーザー名を入力してください"
    />
  </div>

  {/* メールアドレス */}
  <div className="input-group">
    <label className="label-style">メールアドレス</label>
    <input 
      type="email" 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      required 
      className="input-field"
      placeholder="example@mail.com"
    />
  </div>

  {/* パスワード */}
  <div className="input-group">
    <label className="label-style">パスワード</label>
    <input 
      type="password" 
      value={password} 
      onChange={(e) => setPassword(e.target.value)} 
      required 
      className="input-field"
      placeholder="●●●●●●●●"
    />
  </div>

  <button type="submit" className="buttonStyle">
    {mode === 'login' ? 'ログインする' : '登録を完了する'}
  </button>
</form>
      </div>
    </div>
  );
};

export default LoginForm;