FROM node:18.12.1-alpine3.17 AS builder

WORKDIR /workspace
COPY frontend .

RUN npm install && npm run build

FROM python:3.9.16-slim-bullseye

WORKDIR /app
COPY --from=builder /workspace/dist /app/frontend/dist
COPY requirements.txt .

RUN pip install -r requirements.txt
COPY api.py .

CMD ["python", "api.py"]
