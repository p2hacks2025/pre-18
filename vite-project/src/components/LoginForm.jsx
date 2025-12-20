import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Stars, setStars] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const currentColor = '#4facfe';

  /*背景で光る星のエフェクト定義*/
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

  /*画面遷移のための定義*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 送信するデータの準備
    const endpoint = mode === 'signup' ? 'https://pre-18-3r22.onrender.com/api/signup' : 'https://pre-18-3r22.onrender.com/api/login';
    const postData = mode === 'signup' 
      ? { username, email, password } 
      : { username, password };

    try {
      // Flaskサーバーにデータを送る
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        // 成功時の処理
        console.log('成功:', data);
        //onLogin(); //ログイン成功後の画面遷移などを実行
        
        navigate('/main');
      } else {
        //サーバーからエラーが返ってきた場合
        console.error('エラー:', data);
        setError(data.message || 'エラーが発生しました');
      }

    } catch (err) {
      // 通信自体が失敗した場合
      console.error('通信エラー:', err);
      setError('サーバーとの通信に失敗しました。サーバーは起動していますか？');
    }
  };

  // ▼▼▼ 追加機能: ログインなしでメイン画面へ行く関数 ▼▼▼
  const handleSkipLogin = () => {
    console.log("ゲストとして入場します");
    navigate('/main');
  };

  return (
    <div className="login-container">
      <div className="login-background">
        {/*星を表示*/}
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

      <h2 className="login-title" style={{ color: currentColor, textShadow: `0 0 20px ${currentColor}44` }}>
        未完星コレクション
      </h2>

      <form onSubmit={handleSubmit} className="form-area">

        <div className="node-wrapper">
          <div className="node-box">

            {/*入力フォーム*/}
            <div className="tab-group">
              <button type="button"
                className="tab-btn"
                style={mode === 'login' ? { borderBottomColor: currentColor, color: currentColor } : {}}
                onClick={() => setMode('login')}>ログイン</button>
              <button type="button"
                className="tab-btn"
                style={mode === 'signup' ? { borderBottomColor: currentColor, color: currentColor } : {}}
                onClick={() => setMode('signup')}>新規登録</button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="input-label">ユーザー名</label>
              <input type="text" className="input-glow" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label className="input-label">メールアドレス</label>
              <input type="email" className="input-glow" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="input-label">パスワード</label>
              <input type="password" className="input-glow" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            {/* エラーメッセージ表示エリア */}
            {error && <p style={{ color: '#ff4b4b', fontSize: '0.8rem', marginTop: '10px' }}>{error}</p>}
          </div>
        </div>

        {/*実行ボタン*/}
        <div className="node-wrapper" style={{ marginTop: '25px' }}>
          <div style={{ flex: 1 }}>
            <button type="submit" className="submit-btn" style={{ borderColor: currentColor, color: currentColor }}>
              {mode === 'login' ? 'ログイン' : '新規登録'}
            </button>
          </div>
        </div>

        {/* ▼▼▼ 追加機能: ゲスト入場ボタン（デザインは控えめに） ▼▼▼ */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={handleSkipLogin}
            style={{
              background: 'transparent',
              border: '1px dashed rgba(255, 255, 255, 0.3)',
              color: 'rgba(255, 255, 255, 0.6)',
              padding: '8px 15px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#fff';
              e.target.style.borderColor = currentColor;
            }}
            onMouseOut={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.6)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            ゲストとして探索（ログインなし）
          </button>
        </div>

      </form>
    </div>
  );
};

export default LoginForm;