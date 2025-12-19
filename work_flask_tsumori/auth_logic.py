# 簡易的なデータベース（サーバーを再起動すると消えます）
users_db = []
 
def register_user(username, email, password):
    """新規登録の処理"""
    # すでに同じメールアドレスがないか確認
    for user in users_db:
        if user['email'] == email:
            return {"success": False, "message": "このメールアドレスは既に登録されています"}

    # ユーザーを保存
    new_user = {
        "username": username,
        "email": email,
        "password": password
    }
    users_db.append(new_user)
    print(f"現在の登録ユーザー: {users_db}") # デバッグ用
    return {"success": True, "message": "登録が完了しました"}

def login_user(username, password):
    """ログイン認証の処理"""
    # ユーザー名とパスワードが一致する人を探す
    for user in users_db:
        if user['username'] == username and user['password'] == password:
            return {"success": True, "message": "ログイン成功！"}
    
    return {"success": False, "message": "ユーザー名かパスワードが間違っています"}