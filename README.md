# Deribit-crypto-service
Client for the Deribit crypto exchange

# Crypto Deribit Service

Сервис для периодического получения цен BTC и ETH с биржи Deribit
и предоставления API для работы с сохранёнными данными.

## Stack
- Python 3.11
- FastAPI
- PostgreSQL
- Celery + Redis
- aiohttp
- SQLAlchemy
- pytest

## API

### GET /prices
Получить все цены по тикеру  
Query: ticker

### GET /prices/latest
Получить последнюю цену  
Query: ticker

### GET /prices/by-date
Фильтрация по дате  
Query: ticker, start, end

## Design decisions
- Использована простая архитектура без избыточных абстракций
- Celery применяется для периодического сбора данных
- aiohttp используется для асинхронного клиента Deribit
- Данные времени хранятся в UNIX timestamp
- Код ориентирован на junior backend позицию
