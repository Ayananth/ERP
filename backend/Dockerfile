FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN pip install --no-cache-dir \
    "django>=6.0.6" \
    "django-cors-headers>=4.9.0" \
    "djangorestframework>=3.17.1" \
    "djangorestframework-simplejwt>=5.5.1" \
    "pillow>=12.2.0" \
    "python-dotenv>=1.2.2"

COPY core ./core

WORKDIR /app/core

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
