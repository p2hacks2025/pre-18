import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# データベースファイルの名前
DB_NAME = 'observation_log.db'

# 1. データベースとテーブル（棚）を作る関数
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # logsという名前のテーブルを作成（もし無ければ）
    # id: 自動でつく番号, title: 名称, comment: 詳細, tags: タグ, date: 日付
    c.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            comment TEXT,
            tags TEXT,
            date TEXT
        )
    ''')
    conn.commit()
    conn.close()

# 起動時に一度だけ実行して、準備を確認する
init_db()

@app.route('/api/submit', methods=['POST'])
def submit_data():
    # Reactからデータを受け取る
    title = request.form.get('title')
    comment = request.form.get('comment')
    tags = request.form.get('tags')
    date = request.form.get('date')

    try:
        # 2. データベースに接続して保存する
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        c.execute("INSERT INTO logs (title, comment, tags, date) VALUES (?, ?, ?, ?)",
                  (title, comment, tags, date))
        conn.commit()
        conn.close()

        print(f"★ 保存成功: {title} ({date})") # ターミナルで確認用
        return jsonify({"status": "success", "message": "データベースに保存されました！"})

    except Exception as e:
        print(f"エラー発生: {e}")
        return jsonify({"status": "error", "message": "保存に失敗しました"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)