import os
import requests

# TODO: see notebook.

CONSUMER_KEY = os.environ['POCKET_CONSUMER_KEY']
AUTH_URL = 'https://getpocket.com/v3/oauth/request'

REDIRECT_URI = 'http://localhost'
rv = requests.post(
    AUTH_URL,
    json=dict(redirect_uri=REDIRECT_URI, consumer_key=CONSUMER_KEY),
    headers={'X-Accept': 'application/json'}
)

req_token = rv.json()['code']

LINK = 'https://getpocket.com/auth/authorize?request_token=YOUR_REQUEST_TOKEN&redirect_uri=YOUR_REDIRECT_URI'
LINK = LINK.replace('YOUR_REQUEST_TOKEN', req_token).replace(
    'YOUR_REDIRECT_URI', REDIRECT_URI)
print('Click me!', LINK)
input()
rv = requests.post(
    'https://getpocket.com/v3/oauth/authorize', 
    data=dict(consumer_key=CONSUMER_KEY, code=req_token), 
    headers={'X-Accept': 'application/json'})

access_token = rv.json()['access_token']
username = rv.json()['username']
