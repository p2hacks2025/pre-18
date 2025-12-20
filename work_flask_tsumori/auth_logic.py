import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_connection():
    # 本質：Render上ではDATABASE_URLが自動で入る。なければローカルのDBに繋ぐ。
    url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(url)

def register_user(username, email, password):
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, password)
        )
        conn.commit()
        return {"success": True, "message": "ユーザー登録が完了しました"}
    except Exception as e:
        return {"success": False, "message": f"登録失敗: {str(e)}"}
    finally:
        if cur: cur.close()
        if conn: conn.close()

def login_user(username, password):
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
        user = cur.fetchone()
        if user:
            return {"success": True, "message": "ログイン成功", "user": user}
        else:
            return {"success": False, "message": "ユーザー名またはパスワードが違います"}
    except Exception as e:
        return {"success": False, "message": str(e)}
    finally:
        if cur: cur.close()
        if conn: conn.close()