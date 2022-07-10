FROM node:14.20.0-alpine3.16 AS builder

WORKDIR /workspace

COPY frontend .
RUN npm install && npm run build:all

FROM node:14.20.0-bullseye-slim

WORKDIR /app
COPY --from=builder /workspace/build /app/build
COPY requirements.txt .
RUN apt-get update -y && apt-get install -y python3 python3-pip \
        && npm add --global local-web-server@5.1.0 \
        && pip3 install -r requirements.txt

COPY api.py start.sh ./
CMD "./start.sh"
