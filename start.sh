#!/bin/sh

# https://docs.docker.com/config/containers/multi-service_container/
python3 api.py & \
	ws -p 3000 --directory build \
        --rewrite '/api/(.*) -> http://localhost:8080/$1'
