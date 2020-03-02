#!/bin/bash
set -e

echo "Webpack build"
cd .. && npm run build

echo "Collecting statics"
cd src/ && python manage.py collectstatic --noinput

echo "Checking Postgres"
while ! pg_isready -U "$POSTGRES_USER" -h "$POSTGRES_HOST"; do
  echo "Waiting for postgres to be ready..."
  sleep 1
done

echo "Checking elasticsearch"
while ! curl $ELASTIC_HOST >> /dev/null; do
  echo "Waiting for elasticsearch to be ready..."
  sleep 1
done

echo "Applying migrations"
python manage.py migrate

echo "Rebuilding elasticsearch indexes"
python manage.py search_index --rebuild -f
curl -XPUT -H "Content-Type: application/json" http://$ELASTIC_HOST/_all/_settings -d '{"index.blocks.read_only_allow_delete": false}'

echo "Starting server"
gunicorn bdecesi.wsgi --bind=0.0.0.0 $@