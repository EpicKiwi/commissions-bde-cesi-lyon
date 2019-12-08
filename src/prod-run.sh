#!/bin/bash
set -e

cd .. && npm run build

cd src/ && python manage.py collectstatic --noinput

while ! pg_isready -U "$POSTGRES_USER" -h "$POSTGRES_HOST"; do
  echo "Waiting for postgres to be ready..."
  sleep 1
done

python manage.py migrate

gunicorn bdecesi.wsgi --bind=0.0.0.0 $@