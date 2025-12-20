import React, { useMemo, useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './MainScreen.css';

// ▼ 他人の宇宙のモックデータ（UI表示用に情報量が多いフロント版を採用）
const MOCK_OTHER_UNIVERSES = [
    {
        id: 'user_01',
        name: 'ANDROMEDA',
        items: [
            { tags: ['イラスト'], isGem: true }, { tags: ['イラスト'], isGem: true }, { tags: ['イラスト'], isConstellation: true },
            { tags: ['趣味'], isGem: true }, { tags: ['趣味'], isConstellation: true },
            { tags: ['仕事'], isGem: true }
        ],
        message: 'イラスト中心の宇宙です'
    },
    {
        id: 'user_02',
        name: 'SIRIUS',
        items: [
            { tags: ['学習'], isGem: true }, { tags: ['学習'], isGem: true }, { tags: ['学習'], isConstellation: true }, { tags: ['学習'], isGem: true },
            { tags: ['アイデア'], isGem: true }, { tags: ['アイデア'], isGem: true },
            { tags: ['健康'], isConstellation: true }
        ],
        message: '学習記録が蓄積されています'
    },
    {
        id: 'user_03',
        name: 'ORION',
        items: [
            { tags: ['健康'], isGem: true }, { tags: ['健康'], isGem: true },
            { tags: ['仕事'], isGem: true }, { tags: ['仕事'], isConstellation: true },
            { tags: ['趣味'], isGem: true }, { tags: ['趣味'], isGem: true }
        ],
        message: 'バランス型の宇宙'
    }
];

const MainScreen = () => {
    // コンテキストがnullの場合でもクラッシュしないよう空配列をデフォルト設定
    const { items = [] } = useOutletContext() || {}; 
    const navigate = useNavigate();
    const [Stars, setStars] = useState([]);
    
    // ▼ 状態管理
    const [isPublicMode, setIsPublicMode] = useState(false); // false=My Universe, true=Global
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
        
        // フィルタリング（今回はすべて表示対象としてカウント）
        const filteredItems = currentItems; 

        const grouped = allTags.map(tag => ({
            name: tag,
            count: filteredItems.filter(item => item.tags?.includes(tag)).length,
            // フロントエンドの指示通り、メッセージ生成処理はnull固定（削除）
            latestMessage: null 
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

    // クリック時の遷移処理
    const handleGalaxyClick = (galaxy) => {
        if (!visitingUser) {
            navigate('/main/Ingalaxy', { state: { galaxyName: galaxy.name } });
        }
    };

    return (
        <div className="universe-container">
            
            {/* ヘッダー（フロントエンドのタブデザインを採用） */}
            <header className="main-header">
                {/* 左側：タイトル */}
                <h1 className="main-header-title">
                    {visitingUser 
                        ? `UNIVERSE: ${visitingUser.name}` 
                        : (isPublicMode ? 'GLOBAL UNIVERSE' : 'MY UNIVERSE')}
                </h1>

                {/* 右側：タブ（モード切り替え） */}
                {!visitingUser && (
                    <div className="main-header-tabs">
                        <button 
                            className={`header-tab-btn ${!isPublicMode ? 'active' : ''}`}
                            onClick={() => setIsPublicMode(false)}
                        >
                            MY UNIVERSE
                            <div className="header-tab-indicator"></div>
                        </button>
                        <button 
                            className={`header-tab-btn ${isPublicMode ? 'active' : ''}`}
                            onClick={() => setIsPublicMode(true)}
                        >
                            GLOBAL
                            <div className="header-tab-indicator"></div>
                        </button>
                    </div>
                )}
            </header>

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
                                cursor: !visitingUser ? 'pointer' : 'default'
                            }}
                            onClick={() => handleGalaxyClick(galaxy)}
                        >
                            {/* フロントエンドの指示通り、sf-bubble（シグナル）は削除 */}

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