#!/bin/sh
sleep 1
source .venv/bin/activate
python -u -m flask --app lock_person run -p ${PORT:-8080} --debug
