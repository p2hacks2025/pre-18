import psycopg2
from psycopg2.extras import RealDictCursor

# ▼ ここは絶対にいじらないでください（この後、DB側をこのパスワードに合わせます）
DB_URL = "postgresql://postgres:pass2016@localhost:5432/mikansei_DB"

def get_connection():
    return psycopg2.connect(DB_URL)

def register_user(username, email, password):
    """新規登録"""
    conn = None
    cur = None # ★重要：最初に空っぽで作る
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # SQL実行
        cur.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, password)
        )
        conn.commit()
        return {"success": True, "message": "登録完了"}
        
    except psycopg2.IntegrityError:
        if conn: conn.rollback()
        return {"success": False, "message": "その名前かメールアドレスは既に使われています"}

    except Exception as e:
        if conn: conn.rollback()
        print(f"エラー詳細: {e}") # これで黒い画面に本当の原因が出る
        return {"success": False, "message": "サーバーエラーが発生しました"}

    finally:
        # ★重要：curが存在する時だけ閉じる（これでUnboundLocalErrorが消える）
        if cur: cur.close()
        if conn: conn.close()

def login_user(username, password):
    """ログイン"""
    conn = None
    cur = None
    try:
        conn = get_connection()
        # 辞書形式で結果を受け取る設定
        cur = conn.cursor(cursor_factory=RealDictCursor)

        cur.execute(
            "SELECT * FROM users WHERE username = %s AND password = %s",
            (username, password)
        )
        user = cur.fetchone()

        if user:
            return {"success": True, "message": "ログイン成功！"}
        else:
            return {"success": False, "message": "ユーザー名かパスワードが違います"}
            
    except Exception as e:
        print(f"エラー詳細: {e}")
        return {"success": False, "message": "ログイン処理でエラーが発生しました"}

    finally:
        if cur: cur.close()
        if conn: conn.close()