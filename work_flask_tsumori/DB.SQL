-- ユーザー管理用
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 原石・星・星座データ用
CREATE TABLE stones (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    memo TEXT,
    tags TEXT[],
    object_type VARCHAR(50),
    is_public BOOLEAN DEFAULT FALSE,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);