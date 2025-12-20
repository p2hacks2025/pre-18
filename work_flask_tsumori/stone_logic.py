import os
import psycopg2
from psycopg2.extras import RealDictCursor
from auth_logic import get_connection

def register_stone(title, memo, tags, object_type, is_public, username):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # ユーザー名が空なら 'Guest' に変換
        safe_user = username if username else 'Guest'
        
        # どんな状況でもエラーにならないSQL
        cur.execute(
            """
            INSERT INTO stones (title, memo, tags, object_type, is_public, username, participants)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (title, memo, tags, object_type, is_public, safe_user, [safe_user])
        )
        conn.commit()
        return {"success": True, "message": "保存成功"}
    except Exception as e:
        print(f"DB Error: {e}")
        return {"success": False, "message": "保存失敗"}
    finally:
        if conn: conn.close()

def get_all_stones(current_user):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        safe_user = current_user if current_user else 'Guest'

        # 自分、公開、参加中、全部取得
        cur.execute("""
            SELECT * FROM stones 
            WHERE username = %s OR is_public = true OR %s = ANY(participants)
            ORDER BY id DESC
        """, (safe_user, safe_user))
        
        return {"success": True, "stones": cur.fetchall()}
    except Exception as e:
        return {"success": False, "stones": []}
    finally:
        if conn: conn.close()

# 更新機能（そのまま）
def update_stone_status(stone_id, object_type, image):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("UPDATE stones SET object_type = %s, image = %s WHERE id = %s", (object_type, image, stone_id))
        conn.commit()
        return {"success": True}
    except:
        return {"success": False}
    finally:
        if conn: conn.close()

# 参加機能（そのまま）
def join_stone(stone_id, username):
    conn = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        safe_user = username if username else 'Guest'
        cur.execute("UPDATE stones SET participants = array_append(participants, %s) WHERE id = %s", (safe_user, stone_id))
        conn.commit()
        return {"success": True}
    except:
        return {"success": False}
    finally:
        if conn: conn.close()