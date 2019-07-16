import os
import json
import requests
import bottle

GET_URL = 'https://getpocket.com/v3/get'
ARCHIVE_URL = 'https://getpocket.com/v3/send'

CONSUMER_KEY = os.environ['POCKET_CONSUMER_KEY']
ACCESS_TOKEN = os.environ['POCKET_ACCESS_TOKEN']


@bottle.route('/articles')
def get_articles():
    query_args = dict(bottle.request.query)
    limit = query_args.get('limit', 25)
    offset = query_args.get('offset', 0)

    req_data = dict(
        consumer_key=CONSUMER_KEY,
        access_token=ACCESS_TOKEN,
        count=limit,
        offset=offset,
        detailType='simple',
        state='unread',
        sort='newest'
    )

    rv = requests.post(GET_URL, data=req_data)
    content = rv.json()
    if not content['list']:
        return {'articles': []}
    articles = list(content['list'].values())
    output = [{
        'id': a['item_id'],
        'title': a.get('resolved_title', a.get('given_title')) or a['item_id'],
        'url': a.get('resolved_url', a.get('given_url')),
    } for a in articles]
    return {'articles': output}


@bottle.route('/articles/<article_id>', method=['DELETE'])
def archive_article(article_id):
    requests.post(
        ARCHIVE_URL,
        data=dict(
            consumer_key=CONSUMER_KEY,
            access_token=ACCESS_TOKEN,
            actions=json.dumps([{'action': 'archive', 'item_id': article_id}]))
    )
    return {}

bottle.run(host='0.0.0.0', port=8080, debug=True)
