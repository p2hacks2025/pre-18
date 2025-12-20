import os
import psycopg2
from psycopg2.extras import RealDictCursor
from auth_logic import get_connection

# ▼ 保存処理
def register_stone(title, memo, tags, object_type, is_public, username):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # 【修正点】ユーザー名がない(None)なら 'Guest' という名前で保存する
        safe_user = username if username else 'Guest'
        
        cur.execute(
            """
            INSERT INTO stones (title, memo, tags, object_type, is_public, username)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (title, memo, tags, object_type, is_public, safe_user)
        )
        conn.commit()
        return {"success": True, "message": "原石を保存しました！"}
    except Exception as e:
        print(f"Save Error: {e}")
        return {"success": False, "message": "保存失敗"}
    finally:
        if conn: conn.close()

# ▼ 取得処理
def get_all_stones(current_user):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # 【修正点】ユーザー名がないなら 'Guest' としてデータを探す
        safe_user = current_user if current_user else 'Guest'
        
        # 自分のデータ(Guest含む) か、公開されているデータ を取得
        query = """
            SELECT * FROM stones 
            WHERE username = %s OR is_public = true 
            ORDER BY id DESC
        """
        cur.execute(query, (safe_user,))
        
        return {"success": True, "stones": cur.fetchall()}
    except Exception as e:
        print(f"Fetch Error: {e}")
        return {"success": False, "stones": []}
    finally:
        if conn: conn.close()
        
# ▼ 更新処理（そのまま）
def update_stone_status(stone_id, object_type, image):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE stones SET object_type = %s, image = %s WHERE id = %s",
            (object_type, image, stone_id)
        )
        conn.commit()
        return {"success": True}
    except:
        return {"success": False}
    finally:
        if conn: conn.close()