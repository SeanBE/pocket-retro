import os
import requests

CONSUMER_KEY = os.environ['POCKET_CONSUMER_KEY']
REQUEST_URL = 'https://getpocket.com/v3/oauth/request'
AUTHORIZE_URL = 'https://getpocket.com/v3/oauth/authorize'

HEADERS = {'X-Accept': 'application/json'}

REDIRECT_URI = 'http://localhost'

post_body = dict(redirect_uri=REDIRECT_URI, consumer_key=CONSUMER_KEY)
rv = requests.post(REQUEST_URL, json=post_body, headers=HEADERS)
req_token = rv.json()['code']

LINK = f'https://getpocket.com/auth/authorize?request_token={req_token}&redirect_uri={REDIRECT_URI}'
print('Click me! Press Enter when done.', LINK)
input()

auth_body = dict(consumer_key=CONSUMER_KEY, code=req_token)
rv = requests.post(AUTHORIZE_URL, json=auth_body, headers=HEADERS)
print(rv.json())
