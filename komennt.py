from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)

# --- 設定 ---
# Reactからのアクセスを許可
CORS(app) 
# SQLiteデータベースをローカルに作成 ('comments.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///universe.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- データベースモデル (設計図) ---
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    target_id = db.Column(db.String(50), nullable=False)   # コメント対象のID (星や星座のID)
    from_user_id = db.Column(db.String(50), nullable=False) # 送信者のID
    from_user_name = db.Column(db.String(50), nullable=False) # 送信者の名前 (表示用)
    content = db.Column(db.Text, nullable=False)           # コメント本文
    created_at = db.Column(db.DateTime, default=datetime.now) # 送信日時

    def to_dict(self):
        """JSONとして返すための辞書変換メソッド"""
        return {
            'id': self.id,
            'target_id': self.target_id,
            'from_user_id': self.from_user_id,
            'from_user_name': self.from_user_name,
            'content': self.content,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M')
        }

# --- データベースの初期化 ---
with app.app_context():
    db.create_all()

# --- API ルート定義 ---

# 1. コメントを取得するAPI
# GET /api/comments?target_id=star_001
@app.route('/api/comments', methods=['GET'])
def get_comments():
    target_id = request.args.get('target_id')
    
    if not target_id:
        return jsonify({'error': 'Target ID is required'}), 400

    # 対象IDのコメントを新しい順に取得
    comments = Comment.query.filter_by(target_id=target_id)\
                            .order_by(Comment.created_at.desc())\
                            .all()
    
    return jsonify([c.to_dict() for c in comments])

# 2. コメントを投稿するAPI
# POST /api/comments
@app.route('/api/comments', methods=['POST'])
def post_comment():
    data = request.json
    
    # 必須データのチェック
    if not data or 'content' not in data or 'target_id' not in data:
        return jsonify({'error': 'Missing data'}), 400

    new_comment = Comment(
        target_id=data['target_id'],
        from_user_id=data.get('from_user_id', 'guest'),      # ログイン機能がない場合はguest
        from_user_name=data.get('from_user_name', 'Visitor'), # 表示名
        content=data['content']
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify({'message': 'Comment added successfully', 'comment': new_comment.to_dict()}), 201

# --- サーバー起動 ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)