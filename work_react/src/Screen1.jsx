import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

const Screen1 = () => {
  const { items = [] } = useOutletContext() || {};

  const galaxiesWithPositions = useMemo(() => {
    const allTags = ['イラスト', 'アイデア', '学習', '健康', '仕事', '趣味'];
    const grouped = allTags.map(tag => ({
      name: tag,
      count: items.filter(item => item.tags?.includes(tag)).length,
      latestMessage: tag === 'アイデア' ? '【進捗報告】今回の作…' : null
    }));
    
    const topThree = grouped.sort((a, b) => b.count - a.count).slice(0, 3);

    // ★ 座標と角度を完全に固定 ★
    const fixedPositions = [
      { top: '10%', left: '8%', rotate: '-10deg' },  // 左上
      { top: '48%', left: '32%', rotate: '5deg' },   // 中央下
      { top: '15%', left: '58%', rotate: '-5deg' },  // 右上
    ];

    return topThree.map((galaxy, index) => ({
      ...galaxy,
      ...fixedPositions[index]
    }));
  }, [items]);

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>あなたの宇宙</h1>

      <div style={styles.universeCanvas}>
        {galaxiesWithPositions.map((galaxy, index) => (
          <div 
            key={index} 
            style={{
              ...styles.galaxyWrapper,
              top: galaxy.top,
              left: galaxy.left,
            }}
          >
            {/* 通知バブル */}
            {galaxy.latestMessage && (
              <div style={styles.bubble}>
                <div style={styles.bubbleText}>{galaxy.latestMessage}</div>
                <div style={styles.bubbleDot}></div>
                <div style={styles.bubbleTail}></div>
              </div>
            )}

            {/* 固定された銀河パネル (1.2倍サイズ: 312px) */}
            <div 
              style={{
                ...styles.galaxyCard,
                transform: `rotate(${galaxy.rotate})`
              }} 
            >
              <div style={styles.imagePlaceholder}>
                <img src="IMG_7639.jpg" alt={galaxy.name} style={styles.image} /> 
              </div>
            </div>
            
            <p style={styles.galaxyLabel}>{galaxy.name}銀河</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', height: '100%', position: 'relative', padding: '40px' },
  mainTitle: { 
    fontSize: '2.5rem', fontWeight: '200', position: 'absolute', top: '40px', left: '40px', 
    fontFamily: 'serif', letterSpacing: '5px', zIndex: 10, color: '#fff' 
  },
  universeCanvas: { position: 'relative', width: '100%', height: '100%' },
  galaxyWrapper: { position: 'absolute', textAlign: 'center' },
  galaxyCard: {
    width: '312px', height: '312px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
    overflow: 'hidden', cursor: 'pointer',
  },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  galaxyLabel: { marginTop: '20px', fontSize: '1.4rem', letterSpacing: '4px', fontFamily: 'serif', color: '#fff' },
  // 吹き出しスタイルは前回と同様
  bubble: { position: 'absolute', top: '-75px', left: '60%', backgroundColor: '#fff', color: '#333', padding: '10px 16px', borderRadius: '12px', fontSize: '0.8rem', zIndex: 20, boxShadow: '0 6px 15px rgba(0,0,0,0.4)', minWidth: '150px' },
  bubbleDot: { position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', backgroundColor: '#ff7e67', borderRadius: '50%', border: '2px solid #fff' },
  bubbleTail: { position: 'absolute', bottom: '-11px', left: '20px', width: '0', height: '0', borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderTop: '11px solid #fff' },
  bubbleText: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
};

export default Screen1;