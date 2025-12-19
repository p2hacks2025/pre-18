from flask import Flask, request, jsonify
from flask_cors import CORS
# 分けたファイルをインポート
from auth_logic import register_user, login_user

app = Flask(__name__)
# React(http://localhost:5173等)からのアクセスを許可する
CORS(app)

# --- ルーティング ---

@app.route('/api/signup', methods=['POST'])
def signup():
    """新規登録の受付"""
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # ロジックファイルに処理を投げる
    result = register_user(username, email, password)
    
    # 結果をReactに返す
    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 400

@app.route('/api/login', methods=['POST'])
def login():
    """ログインの受付"""
    data = request.json
    username = data.get('username')
    password = data.get('password') # ログインにemailは使わない実装にしています

    # ロジックファイルに処理を投げる
    result = login_user(username, password)

    if result["success"]:
        return jsonify(result), 200
    else:
        return jsonify(result), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)