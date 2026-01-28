from fastapi import FastAPI, Query, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database import SessionLocal
from app.models import Price

import logging
import re

app = FastAPI(title="Crypto Price Service")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler(),
    ],
)

logger = logging.getLogger("crypto-price-service")

TICKER_RE = re.compile(r"^[a-zA-Z0-9]{2,10}$")


class PriceSchema(BaseModel):
    id: int
    ticker: str
    price: float
    timestamp: int

    class Config:
        from_attributes = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/prices", response_model=List[PriceSchema])
def get_all_prices(
    ticker: str = Query(...),
    db: Session = Depends(get_db),
):
    if not TICKER_RE.match(ticker):
        logger.warning("Invalid ticker format | ticker=%s", ticker)
        raise HTTPException(status_code=400, detail="Invalid ticker")
    logger.info("GET /prices | ticker=%s", ticker)
    try:
        result = db.execute(
            select(Price).where(Price.ticker == ticker)
        )
        prices = result.scalars().all()
        logger.info("Found %d prices for ticker=%s", len(prices), ticker)
        return prices
    except Exception:
        logger.exception("Error in get_all_prices | ticker=%s", ticker)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/prices/latest", response_model=PriceSchema | None)
def get_latest_price(
    ticker: str = Query(...),
    db: Session = Depends(get_db),
):
    if not TICKER_RE.match(ticker):
        logger.warning("Invalid ticker format | ticker=%s", ticker)
        raise HTTPException(status_code=400, detail="Invalid ticker")
    logger.info("GET /prices/latest | ticker=%s", ticker)

    try:
        result = db.execute(
            select(Price)
            .where(Price.ticker == ticker)
            .order_by(Price.timestamp.desc())
            .limit(1)
        )
        price = result.scalar_one_or_none()
        if price:
            logger.info(
                "Latest price found | ticker=%s price=%s ts=%s",
                ticker,
                price.price,
                price.timestamp,
            )
        else:
            logger.warning("No prices found | ticker=%s", ticker)
        return price
    except Exception:
        logger.exception("Error in get_latest_price | ticker=%s", ticker)
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/prices/by-date", response_model=List[PriceSchema])
def get_prices_by_date(
    ticker: str = Query(...),
    start: int | None = None,
    end: int | None = None,
    db: Session = Depends(get_db),
):
    if not TICKER_RE.match(ticker):
        logger.warning("Invalid ticker format | ticker=%s", ticker)
        raise HTTPException(status_code=400, detail="Invalid ticker")
    logger.info(
        "GET /prices/by-date | ticker=%s start=%s end=%s",
        ticker,
        start,
        end,
    )
    try:
        query = select(Price).where(Price.ticker == ticker)
        if start is not None:
            query = query.where(Price.timestamp >= start)
        if end is not None:
            query = query.where(Price.timestamp <= end)

        result = db.execute(query)
        prices = result.scalars().all()
        logger.info(
            "Found %d prices for ticker=%s in range",
            len(prices),
            ticker,
        )
        return prices
    except Exception:
        logger.exception(
            "Error in get_prices_by_date | ticker=%s start=%s end=%s",
            ticker,
            start,
            end,
        )
        raise HTTPException(status_code=500, detail="Internal server error")
