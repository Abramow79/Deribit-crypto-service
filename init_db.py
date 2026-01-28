import time
from sqlalchemy.exc import OperationalError
from app.database import Base, engine


def init_db(retries: int = 10, delay: int = 3):
    for attempt in range(1, retries + 1):
        try:
            Base.metadata.create_all(bind=engine, checkfirst=True)
            print("✅ DB initialized successfully!")
            return
        except OperationalError:
            print(f"⏳ DB not ready (attempt {attempt}/{retries}), retrying...")
            time.sleep(delay)

    raise RuntimeError("❌ Could not initialize database after retries")


if __name__ == "__main__":
    init_db()
