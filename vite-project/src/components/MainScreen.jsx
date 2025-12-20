import React, { useMemo, useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom'; // ★useNavigateを追加
import './MainScreen.css';

// ▼ 他人の宇宙のモックデータ
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
    const navigate = useNavigate(); // ★ナビゲーションフック
    const [Stars, setStars] = useState([]);
    
    // ▼ 状態管理
    const [isPublicMode, setIsPublicMode] = useState(false); 
    const [visitingUser, setVisitingUser] = useState(null); 

    /* 背景で光る星のエフェクト */
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

    // ▼ 表示するアイテムを決定
    const currentItems = useMemo(() => {
        if (visitingUser) {
            return visitingUser.items;
        }
        return items;
    }, [items, visitingUser]);

    // ▼ 銀河の生成ロジック
    const galaxiesWithPositions = useMemo(() => {
        const allTags = ['イラスト', 'アイデア', '学習', '健康', '仕事', '趣味'];
        
        const grouped = allTags.map(tag => ({
            name: tag,
            count: currentItems.filter(item => item.tags?.includes(tag)).length,
            latestMessage: (tag === 'アイデア' && !visitingUser) ? 'SIGNAL: 新しい進捗を検知...' : null
        }));

        const topThree = grouped.sort((a, b) => b.count - a.count).slice(0, 3);

        const fixedPositions = [
            { top: '30%', left: '25%', rotate: '-8deg' },
            { top: '55%', left: '50%', rotate: '4deg' },
            { top: '25%', left: '60%', rotate: '-4deg' },
        ];

        return topThree.map((galaxy, index) => {
            const baseScale = 0.9; 
            const growthFactor = Math.min(galaxy.count * 0.05, 0.5); 
            const finalScale = baseScale + growthFactor;
    
            return {
                ...galaxy,
                ...fixedPositions[index],
                scale: finalScale 
            };
        });
    }, [currentItems, visitingUser]);

    // モード切り替え
    const toggleMode = () => {
        if (isPublicMode) {
            setIsPublicMode(false);
            setVisitingUser(null);
        } else {
            setIsPublicMode(true);
            setVisitingUser(null);
        }
    };

    // ★追加: 銀河クリック時の遷移処理
    const handleGalaxyClick = (galaxy) => {
        // 自分の宇宙を見ている時だけ遷移する
        if (!visitingUser) {
            // state経由で「銀河の名前（タグ名）」を渡す
            navigate('/main/Ingalaxy', { state: { galaxyName: galaxy.name } });
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

            {/* タイトル表示 */}
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
                /* --- 宇宙空間 --- */
                <div className="universe-canvas">
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
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10,
                                cursor: !visitingUser ? 'pointer' : 'default' // ★カーソルを変更
                            }}
                            // ★クリックイベントを追加
                            onClick={() => handleGalaxyClick(galaxy)}
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
                                    transform: `rotate(${galaxy.rotate}) scale(${galaxy.scale})` 
                                }}
                            >
                                <img src="./image/logo.png" alt={galaxy.name} className="galaxy-image" />
                                <div className="crystal-border-deco"></div>
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