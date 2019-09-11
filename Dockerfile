FROM node:10.16.3-alpine AS builder

WORKDIR /frontend
COPY frontend .
RUN yarn && yarn build:style && yarn build

FROM node:10.16.3-alpine

WORKDIR /app
COPY --from=builder /frontend/build /app/build
RUN apk add --no-cache python3 python3-dev \
            && yarn add local-web-server \
            && pip3 install bottle requests
COPY api.py .

CMD nohup /bin/sh -c "python3 api.py &" & node_modules/.bin/ws -p 3000 --directory build --rewrite '/api/(.*) -> http://localhost:8080/$1'
