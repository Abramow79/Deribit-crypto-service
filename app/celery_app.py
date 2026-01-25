""" from celery import Celery
from app.config import REDIS_URL

celery_app = Celery(
    "worker",
    broker=REDIS_URL,
    backend=REDIS_URL,
)
 """

from celery import Celery
from celery.schedules import crontab

celery_app = Celery(
    "crypto",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
    include=["app.tasks"]
)

celery_app.conf.beat_schedule = {
    "btc-every-minute": {
        "task": "app.tasks.fetch_price",
        "schedule": crontab(minute="*"),
        "args": ("btc",),
    },
    "eth-every-minute": {
        "task": "app.tasks.fetch_price",
        "schedule": crontab(minute="*"),
        "args": ("eth",),
    },
}

celery_app.autodiscover_tasks(["app"])

celery_app.conf.timezone = "UTC"
