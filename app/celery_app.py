import os
from celery import Celery
from celery.schedules import crontab


celery_app = Celery(
    "crypto",
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_RESULT_BACKEND"),
    include=["app.tasks"],
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

celery_app.conf.timezone = os.getenv("TZ", "UTC")
celery_app.autodiscover_tasks(["app"])
