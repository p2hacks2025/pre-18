CREATE TABLE users (
    id SERIAL PRIMARY KEY,      -- 自動で連番がつくID
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL, -- UNIQUEをつけると重複をDBが防いでくれる
    password TEXT NOT NULL
);