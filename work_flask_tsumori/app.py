from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime

app = Flask(__name__)
CORS(app) # Reactからのアクセスを許可

DB_NAME = "database.db"

# ==================================================
# データベース接続・初期化
# ==================================================
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row # カラム名でデータを扱えるようにする
    return conn

def init_db():
    conn = get_db_connection()
    
    # 1. コレクション用テーブル (stones)
    conn.execute('''
    CREATE TABLE IF NOT EXISTS stones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        memo TEXT,
        tags TEXT,
        image TEXT,
        object_type TEXT,
        is_gem BOOLEAN DEFAULT 0,
        is_constellation BOOLEAN DEFAULT 0,
        is_completed BOOLEAN DEFAULT 0,
        is_public BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # 2. ユーザー管理用テーブル (users) ※ログイン機能用
    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    ''')
    
    conn.commit()
    conn.close()

# アプリ起動時にDB初期化を実行
init_db()

# ==================================================
# 1. MY UNIVERSE用: データの保存と読み込み
# ==================================================
@app.route('/api/stones', methods=['GET', 'POST'])
def handle_stones():
    conn = get_db_connection()
    
    # ▼【読み込み (GET)】 自分の全データ取得
    if request.method == 'GET':
        stones = conn.execute('SELECT * FROM stones ORDER BY id DESC').fetchall()
        conn.close()

        results = []
        for stone in stones:
            # DBの文字列 "タグA,タグB" を 配列 ["タグA", "タグB"] に戻す
            tags_raw = stone['tags']
            tags_array = tags_raw.split(',') if tags_raw else []

            results.append({
                "id": stone['id'],
                "title": stone['title'],
                "memo": stone['memo'],
                "tags": tags_array,
                "image": stone['image'],
                "objectType": stone['object_type'],
                "isGem": bool(stone['is_gem']),
                "isConstellation": bool(stone['is_constellation']),
                "isCompleted": bool(stone['is_completed']),
                "isPublic": bool(stone['is_public']),
            })
        return jsonify(results)

    # ▼【保存 (POST)】 新しい星の記録
    elif request.method == 'POST':
        try:
            data = request.json
            title = data.get('title')
            memo = data.get('memo', '')
            
            # 配列をカンマ区切り文字列に変換して保存
            tags_list = data.get('tags', [])
            tags_str = ",".join(tags_list) if isinstance(tags_list, list) else str(tags_list)
            
            object_type = data.get('objectType', '星')
            is_gem = data.get('isGem', False)
            is_constellation = data.get('isConstellation', False)
            is_public = data.get('isPublic', False)

            conn.execute('''
                INSERT INTO stones (title, memo, tags, object_type, is_gem, is_constellation, is_public)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (title, memo, tags_str, object_type, is_gem, is_constellation, is_public))
            
            conn.commit()
            return jsonify({"message": "保存成功！"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        finally:
            conn.close()

# ==================================================
# 2. 更新用: 覚醒ボタンなどでデータ変更 (PUT)
# ==================================================
@app.route('/api/stones/<int:id>', methods=['PUT'])
def update_stone(id):
    try:
        data = request.json
        conn = get_db_connection()
        conn.execute('''
            UPDATE stones 
            SET is_gem = ?, is_constellation = ?, image = ?, memo = ?, updated_at = ?
            WHERE id = ?
        ''', (
            data.get('isGem'), 
            data.get('isConstellation'), 
            data.get('image'), 
            data.get('memo'), 
            datetime.datetime.now(),
            id
        ))
        conn.commit()
        conn.close()
        return jsonify({"message": "更新成功"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==================================================
# 3. GLOBAL用: みんなの星を取得 (ランダム表示)
# ==================================================
@app.route('/api/global/stars', methods=['GET'])
def get_global_stars():
    try:
        # フロントから「どの銀河（タグ）か？」を受け取る
        target_tag = request.args.get('tag')
        
        conn = get_db_connection()
        
        # SQLクエリ:
        # 1. is_public = 1 (公開されている)
        # 2. tags LIKE ... (そのタグが含まれている)
        # 3. ORDER BY RANDOM() (毎回ランダムな順序で取得＝おすすめ機能)
        # 4. LIMIT 30 (最大30個まで)
        
        query = '''
            SELECT * FROM stones 
            WHERE is_public = 1 
            AND tags LIKE ? 
            ORDER BY RANDOM() 
            LIMIT 30
        '''
        
        # "健康" -> "%健康%" にして部分一致検索できるようにする
        search_tag = f"%{target_tag}%"
        
        stones = conn.execute(query, (search_tag,)).fetchall()
        conn.close()

        results = []
        for stone in stones:
            tags_raw = stone['tags']
            tags_array = tags_raw.split(',') if tags_raw else []

            results.append({
                "id": stone['id'],
                "title": stone['title'],
                "memo": stone['memo'],
                "tags": tags_array,
                "image": stone['image'],
                "objectType": stone['object_type'],
                "isGem": bool(stone['is_gem']),
                "isConstellation": bool(stone['is_constellation']),
                "isPublic": bool(stone['is_public']),
            })
        
        return jsonify(results)

    except Exception as e:
        print("GLOBAL Error:", e)
        return jsonify({"error": str(e)}), 500

# ==================================================
# 4. ユーザーログイン機能（ダミー実装）
# ※LoginForm.jsxを動かすために必要な最低限のエンドポイント
# ==================================================
@app.route('/api/login', methods=['POST'])
def login():
    # 本格的なログイン実装までは、どんな入力でも「成功」として返します
    # 必要に応じてここにSQLでのチェック処理を追加してください
    return jsonify({"message": "Login successful", "token": "dummy-token"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)