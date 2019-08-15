FROM nikolaik/python-nodejs:python3.6-nodejs10

ENV POCKET_ACCESS_TOKEN
RUN pip install bottle requests

COPY . .
WORKDIR frontend
RUN yarn
# run yarn build and use serve instead...

CMD nohup bash -c "python3 ../api.py &" & yarn start
