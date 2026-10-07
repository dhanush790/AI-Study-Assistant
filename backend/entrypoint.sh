#!/bin/bash
python manage.py migrate
gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-10000} --workers 1 --threads 1
