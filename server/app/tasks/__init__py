from celery import Celery
import os

celery = Celery(__name__, broker='redis://localhost:6379/0')

celery.conf.update(
    result_backend='redis://localhost:6379/0',
    task_serializer='json',
    accept_content=['json'],
)
