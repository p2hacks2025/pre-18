import React, { useState } from 'react';

// スタイルはここでは省略しますが、実際にはCSSやCSS-in-JSでスタイルを適用します。
const containerStyle = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  boxSizing: 'border-box',
  border: '1px solid #ddd',
  borderRadius: '4px'
};

const buttonStyle = {
  backgroundColor: '#5cb85c',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  marginTop: '10px'
};

const LoginForm = () => {
  // ユーザー名とパスワードの状態を管理する
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // エラーメッセージの状態を管理する (例: ログイン失敗時)
  const [error, setError] = useState('');

  // フォーム送信時の処理
  const handleSubmit = (event) => {
    // フォームのデフォルトの送信動作（ページリロード）を防止
    event.preventDefault();
    setError(''); // エラーメッセージをリセット

    // --- ここにログインの認証ロジックを実装します ---
    // 例: バリデーションチェック
    if (!username || !password) {
      setError('ユーザー名とパスワードの両方を入力してください。');
      return;
    }

    // バックエンド（Python）へのAPIコールを行う想定
    console.log('ログイン試行:', { username, password });

    // 実際のアプリケーションでは、axiosなどを使って以下のようにAPIコールを行います。
    /*
    axios.post('/api/login', { username, password })
      .then(response => {
        // 成功時の処理: 例としてトークンを保存し、ユーザーをホーム画面にリダイレクト
        console.log('ログイン成功:', response.data);
        // navigate('/dashboard'); 
      })
      .catch(err => {
        // 失敗時の処理: エラーメッセージを表示
        console.error('ログイン失敗:', err);
        setError('ユーザー名またはパスワードが正しくありません。');
      });
    */

    // デモとして、成功メッセージを一時的に表示する
    alert(`ログインを試行しました。ユーザー名: ${username}`);
    // 実際の成功時には、ページ遷移などを行います。
  };

  return (
    <div style={containerStyle}>
      <h2>ログイン</h2>
      {/* エラーメッセージの表示 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">ユーザー名 / メールアドレス:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        
        <button type="submit" style={buttonStyle}>
          ログイン
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

