import React, { useState, useEffect } from 'react';
import './LoginForm.css'; 

const LoginForm = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [bgStars, setBgStars] = useState([]);

  // 背景の星を生成
  useEffect(() => {
    const stars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1 + 'px', 
      top: Math.random() * 100 + '%',    
      left: Math.random() * 100 + '%',   
      duration: Math.random() * 3 + 2 + 's', 
      delay: Math.random() * 5 + 's',       
    }));
    setBgStars(stars);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ボタンが押されました！"); // これを追加
    // ここでバックエンドに送るデータを整理（今はコンソールのみ）
    if (mode === 'signup') {
      console.log('新規登録:', { username, email, password });
    } else {
      console.log('ログイン:', { email, password });
    }
    onLogin(); // ログイン成功として親コンポーネントへ通知
  };

  return (
    <div style={styles.container}>
      {/* 背景の星空レイヤー（ピカピカ光る星） */}
      <div className="login-background">
        {bgStars.map((star) => (
          <div
            key={star.id}
            className="twinkle-star" // CSS側のクラス名と一致させる
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

      {/* ログイン・新規登録カード */}
      <div style={styles.card}>
        <div style={styles.tabGroup}>
          <button 
            style={{...styles.tab, borderBottom: mode === 'login' ? '3px solid #007bff' : 'none', color: mode === 'login' ? '#007bff' : '#333'}}
            onClick={() => setMode('login')}
          >
            ログイン
          </button>
          <button 
            style={{...styles.tab, borderBottom: mode === 'signup' ? '3px solid #007bff' : 'none', color: mode === 'signup' ? '#007bff' : '#333'}}
            onClick={() => setMode('signup')}
          >
            新規登録
          </button>
        </div>

        <h2 style={styles.title}>{mode === 'login' ? 'おかえりなさい' : 'アカウント作成'}</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>ユーザー名</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                style={styles.input} 
                placeholder="つもり"
              />
            </div>
          )}
          <div style={styles.inputGroup}>
            <label style={styles.label}>メールアドレス</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={styles.input} 
              placeholder="example@mail.com"
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>パスワード</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={styles.input} 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" style={styles.button}>
            {mode === 'login' ? 'ログインする' : '登録を完了する'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden', backgroundColor: '#050a1b'
  },
  // 重複していた card を1つに統合しました
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // 透明度を上げた
    padding: '40px',
    borderRadius: '24px',
    backdropFilter: 'blur(10px)', // すりガラス効果
    WebkitBackdropFilter: 'blur(10px)', // Safari用
    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
    width: '100%',
    maxWidth: '400px', 
    textAlign: 'center',
    zIndex: 10
  },
  tabGroup: { display: 'flex', marginBottom: '30px', borderBottom: '1px solid #eee' },
  tab: { flex: 1, padding: '12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold', transition: 'all 0.3s' },
  title: { marginBottom: '20px', color: '#1a1a1a', fontSize: '1.8em' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.9em', color: '#666', fontWeight: 'bold' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1em', outline: 'none' },
  button: { padding: '16px', borderRadius: '10px', border: 'none', backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', fontSize: '1.1em', cursor: 'pointer', marginTop: '15px', boxShadow: '0 4px 15px rgba(0,123,255,0.3)' }
};

export default LoginForm;

