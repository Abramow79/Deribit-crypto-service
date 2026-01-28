# Crypto Deribit Service

Сервис для периодического получения цен **BTC** и **ETH** с биржи **Deribit**
и предоставления HTTP API для работы с сохранёнными данными.

Проект демонстрирует базовую backend-архитектуру с использованием
фоновых задач, очередей и реляционной базы данных.

---

## Features

- Периодический сбор цен BTC и ETH с Deribit
- Сохранение истории цен в PostgreSQL
- HTTP API для получения данных
- Фоновая обработка через Celery
- Контейнеризация с помощью Docker Compose

---

## Stack

- **Python 3.11**
- **FastAPI**
- **PostgreSQL**
- **Celery + Redis**
- **aiohttp**
- **SQLAlchemy**
- **pytest**
- **Docker / Docker Compose**

---

## Project structure

```text
crypto-deribit-service/
├── app/
│   ├── api.py            # HTTP эндпоинты
│   ├── celery_app.py     # конфигурация Celery
│   ├── config.py         # настройки приложения
│   ├── database.py       # подключение к БД
│   ├── deribit_client.py # клиент Deribit API
│   ├── models.py         # SQLAlchemy модели
│   ├── tasks.py          # Celery задачи
│   └── main.py           # точка входа FastAPI
├── init_db.py            # инициализация таблиц
├── docker-compose.yml
├── Dockerfile
├── .env
└── README.md


## Architecture overview

           ┌────────────┐
           │  Deribit   │
           │   API      │
           └─────▲──────┘
                 │
          aiohttp │
                 │
┌────────────┐   ┌──────────────┐
│ Celery     │◀──│ Celery Beat  │
│ Worker     │   └──────────────┘
│ (tasks)    │
└─────▲──────┘
      │ SQLAlchemy
      │
┌─────┴──────┐
│ PostgreSQL │
│   (prices) │
└─────▲──────┘
      │
┌─────┴──────┐
│ FastAPI    │
│ HTTP API   │
└────────────┘


How it works

Celery Beat по расписанию запускает задачу сбора цен

Celery Worker запрашивает цены BTC и ETH с Deribit

Полученные данные сохраняются в PostgreSQL

FastAPI предоставляет HTTP API для чтения данных

Redis используется как брокер и backend результатов Celery



Environment variables

Пример .env файла:

Environment variables

Пример .env файла:
