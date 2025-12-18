import React, { useState } from 'react';
//バックエンドと連携するときにこれをインポートする。画面遷移のためのライブラリ
//import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  // ユーザー名、パスワード、エラーの状態管理
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  //画面遷移のための定数としてnavigateを用意
  // //const navigate = useNavigate();

  // フォーム送信時の処理
  const handleSubmit = (event) => {
    // フォームのデフォルトの送信動作（ページリロード）を防止
    event.preventDefault();
    setError('');

    // ログイン認証
    if (!username || !password) {
      setError('ユーザー名とパスワードの両方を入力してください。');
      return;
    }

    // デバッグ用。後ほど消す
    console.log('ログイン試行:', { username, password });

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

    // デモとして、成功メッセージを一時的に表示する
    alert(`ログインを試行しました。ユーザー名: ${username}`);
    // 実際の成功時には、ページ遷移などを行います。
  };

  return (
    <div className="backgroundStyle">
      <div className="containerStyle">
        <img 
          src='/image/logo2.png'
          alt="アプリのロゴ"
          className="login-logo"
        />
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
              className="inputStyle"
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
              className="inputStyle"
              required
            />
          </div>
        
          <button type="submit" className="buttonStyle">
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

