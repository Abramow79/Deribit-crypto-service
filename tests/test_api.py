# tests/test_api.py
import time
import pytest
from app.models import Price


@pytest.mark.asyncio
async def test_get_all_prices(client, session):
    session.add_all([
        Price(ticker="BTC", price=40000, timestamp=int(time.time())),
        Price(ticker="BTC", price=41000, timestamp=int(time.time())),
    ])
    await session.commit()

    response = await client.get("/prices", params={"ticker": "BTC"})

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert all(item["ticker"] == "BTC" for item in data)


@pytest.mark.asyncio
async def test_get_latest_price(client, session):
    session.add_all([
        Price(ticker="ETH", price=2000, timestamp=100),
        Price(ticker="ETH", price=2200, timestamp=200),
    ])
    await session.commit()

    response = await client.get("/prices/latest", params={"ticker": "ETH"})

    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 2200


@pytest.mark.asyncio
async def test_get_prices_by_date(client, session):
    session.add_all([
        Price(ticker="BTC", price=39000, timestamp=100),
        Price(ticker="BTC", price=40000, timestamp=200),
        Price(ticker="BTC", price=41000, timestamp=300),
    ])
    await session.commit()

    response = await client.get(
        "/prices/by-date",
        params={"ticker": "BTC", "start": 150, "end": 250}
    )

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["price"] == 40000
