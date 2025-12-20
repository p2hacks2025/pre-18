import os
import psycopg2
from psycopg2.extras import RealDictCursor
from auth_logic import get_connection

def register_stone(title, memo, tags, object_type, is_public):
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO stones (title, memo, tags, object_type, is_public)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (title, memo, tags, object_type, is_public)
        )
        conn.commit()
        return {"success": True, "message": "原石を保存しました！"}
    except Exception as e:
        return {"success": False, "message": "保存失敗"}
    finally:
        if cur: cur.close()
        if conn: conn.close()

def get_all_stones():
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM stones ORDER BY id DESC")
        stones = cur.fetchall()
        return {"success": True, "stones": stones}
    except Exception as e:
        return {"success": False, "stones": []}
    finally:
        if cur: cur.close()
        if conn: conn.close()

def update_stone_status(stone_id, object_type, image):
    conn = None
    cur = None
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
        if cur: cur.close()
        if conn: conn.close()