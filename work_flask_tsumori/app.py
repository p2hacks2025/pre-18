import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from auth_logic import register_user, login_user
from stone_logic import register_stone, get_all_stones, update_stone_status

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

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

@app.route('/api/stones', methods=['GET'])
def get_stones():
    result = get_all_stones()
    return jsonify(result), 200

@app.route('/api/stones', methods=['POST'])
def add_stone():
    data = request.json
    result = register_stone(
        title=data.get('title'),
        memo=data.get('memo'),
        tags=data.get('tags'),
        object_type=data.get('objectType'),
        is_public=data.get('isPublic')
    )
    return jsonify(result), (200 if result["success"] else 400)

# 本質的なRESTful API：URLにIDを含める
@app.route('/api/stones/<int:stone_id>', methods=['PUT'])
def update_stone(stone_id):
    data = request.json
    result = update_stone_status(stone_id, data.get('objectType'), data.get('image'))
    return jsonify(result), (200 if result["success"] else 400)

if __name__ == '__main__':
    # 本質：Renderでは環境変数PORTが指定される。なければローカル用の5000を使う。
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)