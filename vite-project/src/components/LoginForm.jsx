import React, { useState, useEffect } from 'react';
//バックエンドと連携するときにこれをインポートする。画面遷移のためのライブラリ
//import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [Stars, setStars] = useState([]);

  //画面遷移のための定数
  //const navigate = useNavigate();

  useEffect(() => {
    const stars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1 + 'px',//1~3px
      top: Math.random() * 100 + '%',//0~100%
      left: Math.random() * 100 + '%',//0~100%
      duration: Math.random() * 3 + 2 + 's',//2~5s
      delay: Math.random() * 5 + 's',//0~5s
    }));
    setStars(stars);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      console.log('新規登録:', { username, email, password });
    } else {
      console.log('ログイン:', { username, email, password });
    }
    onLogin();

    // 実際のアプリケーションでは、axiosなどを使って以下のようにAPIコールを行います。
    /*
    axios.post('/api/login', { username, password })
      .then(response => {
        // 成功時の処理。ホーム画面に遷移
        console.log('ログイン成功:', response.data);
        navigate('/dashboard'); 
      })
      .catch(err => {
        // 失敗時の処理
        console.error('ログイン失敗:', err);
        setError('ユーザー名またはパスワードが正しくありません。');
      });
    */

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
        {/*ロゴを入れるためのスペース*/}
        <img src="/image/logo2.png" alt="logo" className="login-logo" />
        
        {/*タブの記述*/}
        <div className="tab-group">
          <button
            className="tab-button"
            style={{
              /*透明な線を引いて場所を調整する*/
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
              /*同じく透明な線を引く*/
              borderBottom: mode === 'signup' ? '3px solid #007bff' : '3px solid transparent',
              color: mode === 'signup' ? '#007bff' : '#333'
            }}
            onClick={() => setMode('signup')}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-style">
          
          {/*入力ボックスとタイトルの記述*/}
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

          <div className="input-group">
            <label className="label-style">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="パスワードを入力してください"
            />
          </div>
          {error && <p style={{ color: '#ff4d4f', fontSize: '0.9em', marginBottom: '10px' }}>{error}</p>}
          
          {/*登録ボタンの記述*/}
          <button type="submit" className="buttonStyle">
            {mode === 'login' ? 'ログインする' : '登録を完了する'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;