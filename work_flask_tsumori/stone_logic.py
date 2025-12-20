import os
import psycopg2
from psycopg2.extras import RealDictCursor
from auth_logic import get_connection

# 修正前：全部取得
# cur.execute("SELECT * FROM stones ORDER BY id DESC")

# 修正後：自分の石 か 公開されている石 だけ取得


# ▼▼▼ usernameを受け取って保存するように変更
def register_stone(title, memo, tags, object_type, is_public, username):
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        # さっき設定した username 列にデータを入れます
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
        if cur: cur.close()
        if conn: conn.close()

# ▼▼▼ 自分のデータ(username一致) か 公開データ(is_public) だけ取得
def get_all_stones(current_user):
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # ここでデータの選り分けをしています
        query = """
            SELECT * FROM stones 
            WHERE username = %s OR is_public = true 
            ORDER BY id DESC
        """
        cur.execute(query, (current_user,))
        
        stones = cur.fetchall()
        return {"success": True, "stones": stones}
    except Exception as e:
        print(e)
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