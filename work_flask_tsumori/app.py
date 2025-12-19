from flask import Flask, request, jsonify
from flask_cors import CORS
# ★追加: stone_logic をインポート
from auth_logic import register_user, login_user
from stone_logic import get_all_stones, register_stone 

app = Flask(__name__)
CORS(app)

# --- 既存の認証系 ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    result = register_user(data.get('username'), data.get('email'), data.get('password'))
    return jsonify(result), (200 if result["success"] else 400)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    result = login_user(data.get('username'), data.get('password'))
    return jsonify(result), (200 if result["success"] else 401)

# --- ★追加: メイン画面・原石用 ---

@app.route('/api/stones', methods=['GET'])
def get_stones():
    """メイン画面用にデータを取得する"""
    result = get_all_stones()
    return jsonify(result), 200

@app.route('/api/stones', methods=['POST'])
def add_stone():
    """原石を登録する"""
    data = request.json
    title = data.get('title')
    tags = data.get('tags', []) # タグがなければ空リスト
    result = register_stone(title, tags)
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)