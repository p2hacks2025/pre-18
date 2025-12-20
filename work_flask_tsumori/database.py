import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

#Renderの環境変数を取得
database_url = os.getenv("DATABASE_URL")

#RenderのURL補正 (postgres:// -> postgresql://)
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

##ローカル開発用 (Renderにいない時用)
if not database_url:
    database_url = "sqlite:///./local.db"

#接続エンジンの作成
engine = create_engine(database_url)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()