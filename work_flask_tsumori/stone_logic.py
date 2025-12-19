# 簡易データベース（サーバーを再起動すると消えます）
# MainScreenで集計テストができるよう、初期データを入れておきます
stones_db = [
    {"id": 1, "title": "Reactの勉強", "tags": ["学習", "仕事"]},
    {"id": 2, "title": "新しいアプリのアイデア", "tags": ["アイデア", "趣味"]},
    {"id": 3, "title": "ジムに行く", "tags": ["健康"]},
    {"id": 4, "title": "イラスト練習", "tags": ["イラスト", "趣味"]},
    {"id": 5, "title": "API設計", "tags": ["仕事", "学習"]},
]

def get_all_stones():
    """保存されているすべてのデータを返す"""
    return {"success": True, "items": stones_db}

def register_stone(title, tags):
    """新しいデータを登録する（機能2用）"""
    new_id = len(stones_db) + 1
    new_stone = {
        "id": new_id,
        "title": title,
        "tags": tags
    }
    stones_db.append(new_stone)
    return {"success": True, "message": "登録しました", "stone": new_stone}