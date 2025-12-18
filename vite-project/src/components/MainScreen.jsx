import React, { useState } from 'react';
import './MainScreen.css';

//タグのリスト
const AVAILABLE_TAGS = [
    '風景', 'ポートレート', '天体', '日常', '夜景',
    '動物', '自然', 'イベント', '実験', 'その他'
];

const MainScreen = () => {
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
                {registrationStatus && <p style={styles.statusMessage}>{registrationStatus}</p>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>**1. テーマの選択**</label>
                        <div style={styles.radioGroup}>
                            <label style={styles.radioLabel}>
                                <input type="radio" value="star" checked={theme === 'star'} onChange={(e) => setTheme(e.target.value)} required /> スター
                            </label>
                            <label style={styles.radioLabel}>
                                <input type="radio" value="constellation" checked={theme === 'constellation'} onChange={(e) => setTheme(e.target.value)} /> 星座
                            </label>
                        </div>
                    </div>

                    {theme && (
                        <>
                            <h2 className="subtitle">2. コンテンツの入力</h2>

                            {/* 日付入力 */}
                            <div style={styles.inputGroup}>
                                <label htmlFor="date" style={styles.label}>日付:</label>
                                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required style={styles.input} />
                            </div>

                            {/* タイトル */}
                            <div style={styles.inputGroup}>
                                <label htmlFor="title" style={styles.label}>タイトル:</label>
                                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={styles.input} />
                            </div>

                            {/* コメント */}
                            <div style={styles.inputGroup}>
                                <label htmlFor="comment" style={styles.label}>コメント:</label>
                                <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} required style={styles.textarea} />
                            </div>

                            {/* タグ選択 */}
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>タグ (複数選択可):</label>
                                <div style={styles.tagGrid}>
                                    {AVAILABLE_TAGS.map((tag) => (
                                        <label key={tag} style={styles.tagLabel}>
                                            <input type="checkbox" checked={selectedTags.includes(tag)} onChange={() => handleTagChange(tag)} />
                                            {tag}
                                        </label>
                                    ))}
                                </div>
                                {selectedTags.length === 0 && <p style={styles.requiredWarning}>タグは1つ以上選択してください。</p>}
                            </div>

                            {/* 写真 (任意) */}
                            <div style={styles.inputGroup}>
                                <label htmlFor="photo" style={styles.label}>写真 (任意):</label>
                                <input type="file" id="photo" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
                            </div>

                            {/* 公開設定 (スターのみ) */}
                            {theme === 'star' && (
                                <div style={styles.inputGroup}>
                                    <label style={styles.checkboxLabel}>
                                        <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                                        他人に公開する
                                    </label>
                                </div>
                            )}

                            <button type="submit" style={styles.button} disabled={selectedTags.length === 0}>
                                登録ボタンを押します
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' },
    subtitle: { borderBottom: '2px solid #eee', paddingBottom: '10px' },
    inputGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontWeight: 'bold', marginBottom: '5px' },
    input: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px' },
    textarea: { padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '100px' },
    radioGroup: { display: 'flex', gap: '20px' },
    radioLabel: { display: 'flex', alignItems: 'center', gap: '5px' },
    tagGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' },
    tagLabel: { backgroundColor: '#f0f0f0', padding: '5px 10px', borderRadius: '15px', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '5px' },
    requiredWarning: { color: 'red', fontSize: '0.8em' },
    button: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
    statusMessage: { padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '5px', textAlign: 'center' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }
};

export default MainScreen;