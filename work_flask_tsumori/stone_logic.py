from psycopg2.extras import RealDictCursor
from auth_logic import get_connection

def register_stone(title, memo, tags, object_type, is_public):
    """詳細データを含めて原石を保存する"""
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor()
        
        # SQL実行: 項目が増えました
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
        print(f"Error: {e}")
        return {"success": False, "message": "保存に失敗しました"}
    finally:
        if cur: cur.close()
        if conn: conn.close()

def get_all_stones():
    """全ての原石を取得する"""
    conn = None
    cur = None
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("SELECT * FROM stones ORDER BY id DESC")
        stones = cur.fetchall()
        return {"success": True, "stones": stones}
        
    except Exception as e:
        print(f"Error: {e}")
        return {"success": False, "stones": []}
    finally:
        if cur: cur.close()
        if conn: conn.close()