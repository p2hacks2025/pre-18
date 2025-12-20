import os
import psycopg2
from psycopg2.extras import RealDictCursor
# auth_logic.pyから接続関数を読み込む代わりに、ここで定義するか、auth_logic側も同様に書き換える必要があります
# 今回は一番確実な「このファイル内で接続先を切り替える」方法で書きます

def get_connection():
    """環境変数があればRender(本番)、なければローカルのDBに接続する"""
    # Renderの管理画面で設定する「DATABASE_URL」を読み込む
    dsn = os.environ.get('DATABASE_URL')
    
    if dsn:
        # 本番環境（Render）
        return psycopg2.connect(dsn)
    else:
        # ローカル環境（あなたのPC）
        # ※もしauth_logic.pyの接続設定を使いたい場合は、ここを元に戻してください
        return psycopg2.connect(
            host="localhost",
            database="your_db_name", # ここは自分のDB名に合わせてください
            user="postgres",
            password="your_password"
        )

def register_stone(title, memo, tags, object_type, is_public):
    """詳細データを含めて原石を保存する"""
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

def update_stone_status(stone_id, object_type, image):
    """星を星座に進化させる（更新）"""
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
        return {"success": True, "message": "進化しました！"}
        
    except Exception as e:
        print(f"Error: {e}")
        return {"success": False, "message": "進化に失敗しました"}
    finally:
        if cur: cur.close()
        if conn: conn.close()