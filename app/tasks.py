# tasks.py
import time
import requests
from app.celery_app import celery_app
from app.database import SessionLocal
from app.models import Price

DERIBIT_URL = "https://www.deribit.com/api/v2/public/get_index_price"
TICKERS = ["btc", "eth"]

@celery_app.task
def fetch_price(*args, **kwargs):
    # Создаём сессию SQLAlchemy
    with SessionLocal() as db:
        for ticker in TICKERS:
            try:
                # Синхронный запрос к API
                response = requests.get(
                    DERIBIT_URL,
                    params={"index_name": f"{ticker}_usd"},
                    timeout=10
                )
                data = response.json()
                price = data["result"]["index_price"]

                # Сохраняем в базу
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

"""

import time
import logging
import requests
from app.database import SessionLocal
from app.models import Price
from app.celery_app import celery_app

# Настройка логгера
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

DERIBIT_URL = "https://www.deribit.com/api/v2/public/get_index_price"
TICKERS = ["BTC", "ETH", "SOL"]  # пример

@celery_app.task
def fetch_price(*args, **kwargs):
    saved_prices = {}
    failed_tickers = []

    with SessionLocal() as db:
        for ticker in TICKERS:
            try:
                logger.info(f"Fetching {ticker} price with params={{'index_name': f'{ticker}_usd'}}")

                response = requests.get(
                    DERIBIT_URL,
                    params={"index_name": f"{ticker}_usd"},
                    timeout=10
                )
                response.raise_for_status()  # вызовет исключение при ошибке HTTP
                data = response.json()

                if "result" not in data or "index_price" not in data["result"]:
                    raise ValueError(f"No price data for {ticker}")

                price = data["result"]["index_price"]

                db.add(
                    Price(
                        ticker=ticker,
                        price=price,
                        timestamp=int(time.time())
                    )
                )

                saved_prices[ticker] = price
                logger.info(f"{ticker}: price {price} added to DB")

            except Exception as e:
                logger.error(f"Failed to fetch/save {ticker}: {e}")
                failed_tickers.append(ticker)

        # Фиксируем все успешные добавления одной коммит-операцией
        db.commit()

    # Возвращаем подробную статистику для Celery
    result = {
        "saved_count": len(saved_prices),
        "saved_prices": saved_prices,
        "failed_tickers": failed_tickers
    }

    logger.info(f"Task finished. {len(saved_prices)} saved, {len(failed_tickers)} failed")
    return result """