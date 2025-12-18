import React, { useState } from 'react';
import './RegistrationScreen.css';

//タグのリスト
const AVAILABLE_TAGS = [
    '風景', 'ポートレート', '天体', '日常', '夜景',
    '動物', '自然', 'イベント', '実験', 'その他'
];

const RegistrationScreen = () => {
    //日付取得
    const getToday = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    //フォームの状態管理
    const [theme, setTheme] = useState(null);
    const [date, setDate] = useState(getToday());
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [isPublic, setIsPublic] = useState(true);
    const [registrationStatus, setRegistrationStatus] = useState('');//登録処理中、みたいな状態管理

    //タグの選択/解除
    const handleTagChange = (tag) => {
        setSelectedTags(prevTags =>
            prevTags.includes(tag)
                ? prevTags.filter(t => t !== tag)//クリックしたもの以外で、新しい配列を作る
                : [...prevTags, tag]//入ってなかったらタグを追加
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setRegistrationStatus('登録処理中...');

        setTimeout(() => {
            console.log('--- 登録データ確定 ---');
            console.log('テーマ:', theme);
            console.log('日付:', date);
            console.log('タイトル:', title);
            console.log('選択されたタグ:', selectedTags);
            console.log('写真:', photo ? photo.name : 'なし');
            setRegistrationStatus('登録完了しました！');
        }, 1500);
    };

    return (
        <div className="background-style">
            <div className="container-style">
                <h1>⚙️ 画面2: コメント・写真登録</h1>
                {registrationStatus && <p className="status-message">{registrationStatus}</p>}

                <form onSubmit={handleSubmit} className="form">
                    <div className="input-group">
                        <label className="label">**1. テーマの選択**</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input type="radio" value="star" checked={theme === 'star'} onChange={(e) => setTheme(e.target.value)} required /> スター
                            </label>
                            <label className="radio-label">
                                <input type="radio" value="constellation" checked={theme === 'constellation'} onChange={(e) => setTheme(e.target.value)} /> 星座
                            </label>
                        </div>
                    </div>

                    {theme && (
                        <>
                            <h2 className="subtitle">2. コンテンツの入力</h2>

                            {/* 日付入力 */}
                            <div className="input-group">
                                <label htmlFor="date" className="label">日付:</label>
                                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input" />
                            </div>

                            {/*タイトル*/}
                            <div className="input-group">
                                <label htmlFor="title" className="label">タイトル:</label>
                                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="input" />
                            </div>

                            {/*コメント*/}
                            <div className="input-group">
                                <label htmlFor="comment" className="label">コメント:</label>
                                <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} required className="commentarea" />
                            </div>

                            {/*タグ選択*/}
                            <div className="input-group">
                                <label className="label">タグ (複数選択可):</label>
                                <div className="tag-grid">
                                    {AVAILABLE_TAGS.map((tag) => (
                                        <label key={tag} className="tag-grid">
                                            <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => handleTagChange(tag)} />
                                            {tag}
                                        </label>
                                    ))}
                                </div>
                                {selectedTags.length === 0 && <p className="required-warning">タグは1つ以上選択してください。</p>}
                            </div>

                            {/*写真 (任意)*/}
                            <div className="input-group">
                                <label htmlFor="photo" className="label">写真 (任意):</label>
                                <input type="file" id="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                            </div>

                            {/*公開設定 (スターのみ)*/}
                            {theme === 'star' && (
                                <div className="input-group">
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                                        他人に公開する
                                    </label>
                                </div>
                            )}

                            <button type="submit" className="button" disabled={selectedTags.length === 0}>
                                登録ボタンを押します
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegistrationScreen;