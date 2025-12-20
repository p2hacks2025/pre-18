from flask import Flask, request, jsonify
from flask_cors import CORS
from auth_logic import register_user, login_user
# register_stone の引数が増えたので、新しい stone_logic を使います
from stone_logic import register_stone, get_all_stones,update_stone_status


app = Flask(__name__)
CORS(app)

# --- ユーザー認証系 ---
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

# --- 原石（アイデア）系 ---

@app.route('/api/stones', methods=['GET'])
def get_stones():
    result = get_all_stones()
    return jsonify(result), 200

@app.route('/api/stones', methods=['POST'])
def add_stone():
    data = request.json
    # Reactから送られてきた全てのデータを取り出す
    result = register_stone(
        title=data.get('title'),
        memo=data.get('memo'),
        tags=data.get('tags'),         # 配列のままでOK
        object_type=data.get('objectType'), # React側の名前(camelCase)に注意
        is_public=data.get('isPublic')
    )
    return jsonify(result), (200 if result["success"] else 400)

def update_stone(stone_id):
    data = request.json
    result = update_stone_status(
        stone_id,
        data.get('object_type'),
        data.get('image')
    )
    return jsonify(result), (200 if result["success"] else 400)

if __name__ == '__main__':
    app.run(debug=True, port=5000)