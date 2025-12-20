import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const currentColor = '#4facfe';

  // ★ 削除: 星の生成コード (UIコンポーネントで管理するため不要)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- ここに実際のAPI通信処理が入ります (今回は省略) ---
    // ログイン成功とみなして画面遷移
    navigate('/main');
  };

  const handleSkipLogin = () => {
    navigate('/main');
  };

  return (
    <div className="login-container">
        {/* ★ 削除: login-background のdiv (UI側の背景が見えるようにする) */}
        
        <h1 className="login-title">未完星コレクション</h1>

        <div className="form-area">
          <div className="node-box">
            {/* タブ切り替えボタン */}
            <div className="tab-group">
              <button 
                className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                LOGIN
              </button>
              <button 
                className={`tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                SIGN UP
              </button>
            </div>

            <form onSubmit={handleSubmit}>
               {/* ▼ 修正: 条件分岐を削除し、LOGINモードでもユーザー名を表示するように変更 */}
               <div className="node-wrapper">
                  <div className="node-dot"></div>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
               </div>
              
              <div className="node-wrapper">
                <div className="node-dot"></div>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="node-wrapper">
                <div className="node-dot"></div>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '10px' }}>{error}</p>}

              {/* 実行ボタン */}
              <div className="node-wrapper" style={{ marginTop: '25px' }}>
                <div style={{ flex: 1 }}>
                    <button type="submit" className="submit-btn" style={{ borderColor: currentColor, color: currentColor }}>
                    {mode === 'login' ? 'LOGIN' : 'REGISTER'}
                    </button>
                </div>
              </div>
            </form>
          </div>

          {/* ゲスト入場ボタン */}
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
                Skip Login (Guest)
            </button>
          </div>
        </div>
    </div>
  );
};

export default LoginForm;