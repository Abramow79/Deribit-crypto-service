import time
import requests
from app.celery_app import celery_app
from app.database import SessionLocal
from app.models import Price

DERIBIT_URL = "https://www.deribit.com/api/v2/public/get_index_price"
TICKERS = ["btc", "eth"]


@celery_app.task
def fetch_price(*args, **kwargs):
    with SessionLocal() as db:
        for ticker in TICKERS:
            try:
                response = requests.get(
                    DERIBIT_URL,
                    params={"index_name": f"{ticker}_usd"},
                    timeout=10
                )
                data = response.json()
                price = data["result"]["index_price"]

                db.add(
                    Price(
                        ticker=ticker,
                        price=price,
                        timestamp=int(time.time())
                    )
                )
            except Exception as e:
                print(f"Error fetching {ticker}: {e}")

        # Фиксируем изменения
        db.commit()
