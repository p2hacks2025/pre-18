import React, { useMemo, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './MainScreen.css';

// ▼ 他人の宇宙のモックデータ（実際はサーバーから取得するイメージ）
const MOCK_OTHER_UNIVERSES = [
    {
        id: 'user_01',
        name: 'ANDROMEDA',
        items: [
            { tags: ['イラスト'] }, { tags: ['イラスト'] }, { tags: ['イラスト'] },
            { tags: ['趣味'] }, { tags: ['趣味'] },
            { tags: ['仕事'] }
        ],
        message: 'イラスト中心の宇宙です'
    },
    {
        id: 'user_02',
        name: 'SIRIUS',
        items: [
            { tags: ['学習'] }, { tags: ['学習'] }, { tags: ['学習'] }, { tags: ['学習'] },
            { tags: ['アイデア'] }, { tags: ['アイデア'] },
            { tags: ['健康'] }
        ],
        message: '学習記録が蓄積されています'
    },
    {
        id: 'user_03',
        name: 'ORION',
        items: [
            { tags: ['健康'] }, { tags: ['健康'] },
            { tags: ['仕事'] }, { tags: ['仕事'] },
            { tags: ['趣味'] }, { tags: ['趣味'] }
        ],
        message: 'バランス型の宇宙'
    }
];

const MainScreen = () => {
    const { items = [] } = useOutletContext() || {};
    const [Stars, setStars] = useState([]);
    
    // ▼ 状態管理の追加
    const [isPublicMode, setIsPublicMode] = useState(false); // false=自分, true=他人モード
    const [visitingUser, setVisitingUser] = useState(null);  // 誰の宇宙を見ているか

    /* 背景で光る星のエフェクト定義 */
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

    // ▼ 現在表示すべきアイテムデータを決定する
    const currentItems = useMemo(() => {
        if (visitingUser) {
            return visitingUser.items;
        }
        return items;
    }, [items, visitingUser]);

    // ▼ 銀河の配置計算（currentItems を使うように変更）
    const galaxiesWithPositions = useMemo(() => {
        const allTags = ['イラスト', 'アイデア', '学習', '健康', '仕事', '趣味'];
        
        const grouped = allTags.map(tag => ({
            name: tag,
            count: currentItems.filter(item => item.tags?.includes(tag)).length,
            latestMessage: (tag === 'アイデア' && !visitingUser) ? 'SIGNAL: 新しい進捗を検知...' : null
        }));

        const topThree = grouped.sort((a, b) => b.count - a.count).slice(0, 3);

        const fixedPositions = [
            { top: '15%', left: '15%', rotate: '-8deg' },
            { top: '50%', left: '40%', rotate: '4deg' },
            { top: '20%', left: '65%', rotate: '-4deg' },
        ];

        /* --- 修正前（コメントアウト） ---
        return topThree.map((galaxy, index) => ({
            ...galaxy,
            ...fixedPositions[index]
        }));
        ------------------------------ */

        // ▼▼▼ 修正箇所：ここから新しいロジック ▼▼▼
        return topThree.map((galaxy, index) => {
            // ▼ 追加: 件数(count)に応じてスケール（大きさ）を計算
            // 基本サイズ0.8 + (件数 * 0.05)。ただし最大+0.5倍(合計1.3倍)まで制限
            const baseScale = 0.8; 
            const growthFactor = Math.min(galaxy.count * 0.05, 0.5); 
            const finalScale = baseScale + growthFactor;
    
            return {
                ...galaxy,
                ...fixedPositions[index],
                scale: finalScale // ここで計算したサイズをデータに持たせる
            };
        });
        // ▲▲▲ 修正箇所：ここまで ▲▲▲

    }, [currentItems, visitingUser]);

    // ▼ モード切り替えハンドラ
    const toggleMode = () => {
        if (isPublicMode) {
            setIsPublicMode(false);
            setVisitingUser(null);
        } else {
            setIsPublicMode(true);
            setVisitingUser(null);
        }
    };

    return (
        <div className="universe-container">
            {/* ▼ 右上の切り替えボタン */}
            <div className="top-right-control">
                <button 
                    className={`mode-toggle-btn ${isPublicMode ? 'active' : ''}`} 
                    onClick={toggleMode}
                >
                    <span className="mode-label">{isPublicMode ? 'GLOBAL' : 'MY UNIVERSE'}</span>
                    <div className="mode-indicator"></div>
                </button>
            </div>

            {/* タイトル表示の分岐 */}
            <h1 className="main-title">
                {visitingUser ? `UNIVERSE: ${visitingUser.name}` : (isPublicMode ? '銀河を選択' : 'あなたの宇宙')}
            </h1>

            {/* 星を表示 */}
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

            {/* ▼ 表示コンテンツの分岐 */}
            {isPublicMode && !visitingUser ? (
                /* --- 他人の宇宙リスト表示モード --- */
                <div className="universe-list-view">
                    <div className="user-grid">
                        {MOCK_OTHER_UNIVERSES.map((user) => (
                            <div key={user.id} className="user-card" onClick={() => setVisitingUser(user)}>
                                <div className="user-planet-icon"></div>
                                <h3>{user.name}</h3>
                                <p>{user.message}</p>
                                <div className="scan-line"></div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* --- 宇宙空間（自分 または 選択した他人） --- */
                <div className="universe-canvas">
                    {/* 戻るボタン（他人の宇宙を見ている時だけ表示） */}
                    {visitingUser && (
                        <button className="back-to-list-btn" onClick={() => setVisitingUser(null)}>
                            ◀ RETURN TO MAP
                        </button>
                    )}

                    {galaxiesWithPositions.map((galaxy, index) => (
                        <div
                            key={index}
                            className="galaxy-wrapper"
                            style={{
                                position: 'absolute',
                                top: galaxy.top,
                                left: galaxy.left,
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {/* SF風通知バブル */}
                            {galaxy.latestMessage && (
                                <div className="sf-bubble">
                                    <div className="sf-bubble-text">{galaxy.latestMessage}</div>
                                    <div className="sf-bubble-dot"></div>
                                </div>
                            )}

                            {/* 銀河パネル */}
                            <div
                                className="galaxy-card"
                                style={{ 
                                    // scaleを追加済み
                                    transform: `rotate(${galaxy.rotate}) scale(${galaxy.scale})` 
                                }}
                            >
                                <img src="./image/logo.png" alt={galaxy.name} className="galaxy-image"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                                <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderLeft: '2px solid #4facfe', borderTop: '2px solid #4facfe' }}></div>
                            </div>

                            <p className="galaxy-label">{galaxy.name.toUpperCase()} SYSTEM</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MainScreen;