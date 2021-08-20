FROM node:14.17.5-alpine3.14 AS builder

WORKDIR /frontend
COPY frontend .
RUN npm install && npm run build:style && npm run build

FROM node:14.17.5-alpine3.14

WORKDIR /app
COPY --from=builder /frontend/build /app/build
RUN apk add --no-cache python3==3.9.5-r1 py3-pip==20.3.4-r1 \
            && npm add local-web-server@5.1.0 \
            && pip3 install bottle requests
COPY api.py .

# https://docs.docker.com/config/containers/multi-service_container/
CMD python3 api.py & \
        node_modules/.bin/ws -p 3000 --directory build \
        --rewrite '/api/(.*) -> http://localhost:8080/$1'
