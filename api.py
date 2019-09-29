import os
import json
import requests
import bottle

POCKET_HEADERS = {'X-Accept': 'application/json'}

GET_URL = 'https://getpocket.com/v3/get'
ARCHIVE_URL = 'https://getpocket.com/v3/send'
REQUEST_URL = 'https://getpocket.com/v3/oauth/request'
AUTHORIZE_URL = 'https://getpocket.com/v3/oauth/authorize'


class JSONErrorBottle(bottle.Bottle):
    """JSONErrorBottle represents Bottle object with JSON error handler"""

    def default_error_handler(self, res):
        bottle.response.content_type = 'application/json'
        return json.dumps({
            'message': res.body,
        })


app = JSONErrorBottle()


def authenticated(func):
    def wrapped(*args, **kwargs):
        try:
            key = bottle.request.cookies['consumer_key']
            token = bottle.request.cookies['access_token']
        except KeyError:
            bottle.abort(403, 'failed getting cookies')
        credentials = dict(consumer_key=key, access_token=token)
        return func(credentials, *args, **kwargs)
    return wrapped


@app.post('/oauth/request')
def request_oauth():
    forms = bottle.request.forms
    try:
        consumer_key = forms['consumer_key']
        redirect_uri = forms['redirect_uri']
    except KeyError:
        bottle.abort(400, 'requires consumer key')

    REDIRECT_URI = 'http://localhost'
    post_body = dict(redirect_uri=redirect_uri, consumer_key=consumer_key)
    rv = requests.post(REQUEST_URL, json=post_body, headers=POCKET_HEADERS)

    try:
        req_token = rv.json()['code']
    except (KeyError, json.decoder.JSONDecodeError):
        bottle.abort(rv.status_code, rv.text)

    link = 'https://getpocket.com/auth/authorize' \
        f'?request_token={req_token}&redirect_uri={redirect_uri}'

    bottle.response.set_cookie(
        name='consumer_key', value=consumer_key, httponly=True, path='/')
    bottle.response.set_cookie(
        name='request_token', value=req_token, httponly=True, path='/')
    return {'link': link}


@app.post('/oauth/authorize')
def authorize_oauth():
    try:
        key = bottle.request.cookies['consumer_key']
        token = bottle.request.cookies['request_token']
    except KeyError:
        bottle.abort(403, 'failed getting cookies')

    auth_body = dict(consumer_key=key, code=token)
    rv = requests.post(AUTHORIZE_URL, json=auth_body, headers=POCKET_HEADERS)
    try:
        access_token = rv.json()['access_token']
    except (KeyError, json.decoder.JSONDecodeError):
        bottle.abort(rv.status_code, rv.text)

    bottle.response.set_cookie(
        name='access_token', value=access_token, httponly=True, path='/')
    bottle.response.status = rv.status_code
    return {}


@app.get('/articles')
@authenticated
def get_articles(credentials):
    query_args = bottle.request.query
    limit = query_args.get('limit', default=25)
    offset = query_args.get('offset', default=0)

    req_data = {
        **credentials,
        'count': limit,
        'offset': offset,
        'detailType': 'simple',
        'state': 'unread',
        'sort': 'newest'
    }

    rv = requests.post(GET_URL, data=req_data)
    try:
        content = rv.json()
    except json.decoder.JSONDecodeError:
        bottle.abort(rv.status_code, rv.text)

    try:
        articles = list(content['list'].values())
    except AttributeError:
        articles = []

    return {
        'articles': [{
            'id': a['item_id'],
            'excerpt': a.get('excerpt', ''),
            'url': a.get('resolved_url', a.get('given_url')),
            'title': a.get('resolved_title') or a.get('given_title'),
        } for a in articles]
    }


@app.delete('/articles/<article_id>')
@authenticated
def archive_article(credentials, article_id):
    rv = requests.post(
        ARCHIVE_URL,
        data={
            **credentials,
            'actions': json.dumps([{'action': 'archive', 'item_id': article_id}])}
    )

    bottle.response.status = rv.status_code
    bottle.response.content_type = 'application/json'
    return {}


app.run(host='0.0.0.0', port=8080)
