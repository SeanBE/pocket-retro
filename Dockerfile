FROM nikolaik/python-nodejs:python3.6-nodejs10

RUN pip install bottle requests

COPY . .
WORKDIR frontend
RUN yarn && yarn build:style && yarn build

CMD nohup bash -c "python3 ../api.py &" & node_modules/.bin/ws -p 3000 --directory build --rewrite '/api/(.*) -> http://localhost:8080/$1'
