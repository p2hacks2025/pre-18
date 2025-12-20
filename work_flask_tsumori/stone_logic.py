import os
import psycopg2
from psycopg2.extras import RealDictCursor
from auth_logic import get_connection

# ▼ シンプルな登録
def register_stone(title, memo, tags, object_type, is_public, username):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO stones (title, memo, tags, object_type, is_public, username)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (title, memo, tags, object_type, is_public, username)
        )
        conn.commit()
        return {"success": True, "message": "原石を保存しました！"}
    except Exception as e:
        print(e)
        return {"success": False, "message": "保存失敗"}
    finally:
        if conn: conn.close()

# ▼ シンプルな取得（自分の か 公開されているもの）
def get_all_stones(current_user):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT * FROM stones 
            WHERE username = %s OR is_public = true 
            ORDER BY id DESC
        """
        cur.execute(query, (current_user,))
        
        return {"success": True, "stones": cur.fetchall()}
    except Exception as e:
        print(e)
        return {"success": False, "stones": []}
    finally:
        if conn: conn.close()

# ▼ シンプルな更新
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
    except Exception as e:
        return {"success": False}
    finally:
        if conn: conn.close()