from flask import Flask, request, Response, make_response
from flask_cors import CORS, cross_origin
import json
from newsplease import NewsPlease
import requests
import tweepy

app = Flask(__name__)
app.config['DEBUG'] = False
cors = CORS(app, resources={r"/*": {"origins": "*"}})

consumer_key = "PLACEHOLDER"
consumer_secret = "PLACEHOLDER"
key = "PLACEHOLDER"
secret = "PLACEHOLDER"

@app.route('/get_tweets', methods=['POST'])
def get_the_tweets():    
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret);
    auth.set_access_token(key, secret)
    api = tweepy.API(auth)
    requestObject = request.get_json()
    query = requestObject['tweetQuery']
    max_tweets = 60
    searched_tweets = api.search(q=query, count=max_tweets,lang='en', include_entities=True, tweet_mode="extended")
    listOfTweets = []
    count=0
    
    for i in searched_tweets:
        if (not i.retweeted) and ('RT @' not in i.full_text) and count<20:
            userJson = i._json
            theTweetUrl = 'https://twitter.com/'
            try:
                theTweetUrl = userJson['entities']['urls'][0]['url']
            except:
                print("URL not found.")
            compactTweet = {'tweetText': userJson['full_text'], 'profileImageURL': userJson['user']['profile_image_url'], 'name': userJson['user']['name'],
            'screenName': userJson['user']['screen_name'], 'tweetURL': theTweetUrl
            }
            listOfTweets.append(compactTweet)
            count = count+1
    outputJson = json.dumps(listOfTweets)
    resp = make_response(outputJson)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods']= 'DELETE, POST, GET, OPTIONS'
    resp.headers['Access-Control-Allow-Headers']='Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-Width'
    return resp

@app.route('/process-tweet', methods=['POST'])
def process_tweets():
    requestObject = request.get_json()
    theTweet = requestObject['tweetMessage']
    fakeRating = requests.get('https://huggingface.co/openai-detector/?'+theTweet)
    data_set = {"real": fakeRating.json()['real_probability']}
    outputJson = json.dumps(data_set)
    resp = make_response(outputJson)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods']= 'DELETE, POST, GET, OPTIONS'
    resp.headers['Access-Control-Allow-Headers']='Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-Width'
    return resp


@app.route('/classify-texts', methods=['POST'])
def classify_texts():
    requestObject = request.get_json()
    theURL = requestObject['urlOfContent']
    articleTitle = ""
    articleMaintext = ""
    try:
        article = NewsPlease.from_url(theURL)
        articleTitle = article.title
        articleMaintext = article.maintext
    except: 
        articleTitle=""
        articleMaintext=""
    fakeRating = requests.get('https://huggingface.co/openai-detector/?'+articleMaintext)
    data_set = {"real": fakeRating.json()['real_probability'], "fullText": "" +articleMaintext}
    outputJson = json.dumps(data_set)
    resp = make_response(outputJson)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods']= 'DELETE, POST, GET, OPTIONS'
    resp.headers['Access-Control-Allow-Headers']='Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-Width'
    return resp

if __name__ == '__main__':
    app.run(host='127.0.0.1', port='5000', debug=False)
