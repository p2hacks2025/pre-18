import React, { useMemo, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import './MainScreen.css';

const MainScreen = () => {
    const { items = [] } = useOutletContext() || {};
    const [Stars, setStars] = useState([]);
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

    const galaxiesWithPositions = useMemo(() => {
        const allTags = ['イラスト', 'アイデア', '学習', '健康', '仕事', '趣味'];
        const grouped = allTags.map(tag => ({
            name: tag,
            count: items.filter(item => item.tags?.includes(tag)).length,
            latestMessage: tag === 'アイデア' ? 'SIGNAL: 新しい進捗を検知...' : null
        }));

        const topThree = grouped.sort((a, b) => b.count - a.count).slice(0, 3);

        const fixedPositions = [
            { top: '15%', left: '15%', rotate: '-8deg' },
            { top: '50%', left: '40%', rotate: '4deg' },
            { top: '20%', left: '65%', rotate: '-4deg' },
        ];

        return topThree.map((galaxy, index) => ({
            ...galaxy,
            ...fixedPositions[index]
        }));
    }, [items]);

    return (
        <div className="universe-container">
            <h1 className="main-title">あなたの宇宙</h1>
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

            <div className="universe-canvas">
                {galaxiesWithPositions.map((galaxy, index) => (
                    <div
                        key={index}
                        className="galaxy-wrapper"
                        style={{
                            position: 'absolute',
                            top: galaxy.top,
                            left: galaxy.left,
                            transform: 'translateX(-50%)' // ★ これを追加（配置の基準を中央にする）
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
                            style={{ transform: `rotate(${galaxy.rotate})` }}
                        >
                            <img src="./image/logo.png" alt={galaxy.name} className="galaxy-image"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />

                            {/* 装飾用のコーナーライン（オプション） */}
                            <div style={{ position: 'absolute', top: 10, left: 10, width: 20, height: 20, borderLeft: '2px solid #4facfe', borderTop: '2px solid #4facfe' }}></div>
                        </div>

                        <p className="galaxy-label">{galaxy.name.toUpperCase()} SYSTEM</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MainScreen;