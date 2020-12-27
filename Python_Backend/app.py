from flask import Flask, request, Response, make_response
from flask_cors import CORS, cross_origin
import json
from newsplease import NewsPlease
import requests
import tweepy
import multiprocessing
import time
import sys
import tensorflow.keras as keras
from keras.preprocessing.sequence import pad_sequences
from keras.preprocessing.text import hashing_trick
import botometer

app = Flask(__name__)
app.config['DEBUG'] = False
cors = CORS(app, resources={r"/*": {"origins": "*"}})

#Twitter Keys
consumer_key = "PLACEHOLDER"
consumer_secret = "PLACEHOLDER"
key = "PLACEHOLDER"
secret = "PLACEHOLDER"

#RapidAPI Key
rapidapi_key = "PLACEHOLDER"

#HuggingFace Auth String
HuggingFace_Auth_Str = "Bearer api_PLACEHOLDER"


classifier = keras.models.load_model('Models/CoAID_using_HashingTrick.h5')

def getMLClassification(inputStr):
    input_X = hashing_trick(str(inputStr), 10000, hash_function='md5')
    input_X = pad_sequences([input_X], padding='post', maxlen=500)
    modelPrediction = classifier.predict(input_X)
    probability = modelPrediction[0][0]
    return str(probability)


def inferWithHuggingFace(inputStr):
    inputStr = inputStr[:300]
    API_URL = "https://api-inference.huggingface.co/models/roberta-base-openai-detector"
    payload = json.dumps(inputStr)
    headers = {"Content-Type": "application/json", "Authorization": HuggingFace_Auth_Str}
    response = requests.post(API_URL, payload, headers=headers)
    respJson = response.json()
    retryCount=0
    while 'error' in respJson and retryCount<20:
        response = requests.post(API_URL, payload, headers=headers)
        respJson = response.json()
        retryCount+=1
        time.sleep(1.5)
    if 'error' not in respJson:
        return respJson[0][1]['score'] #returns real probability
    return "Error"


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

    twitter_app_auth = {
        'consumer_key': consumer_key,
        'consumer_secret': consumer_secret,
        'access_token': key,
        'access_token_secret': secret,
    }
    bom = botometer.Botometer(wait_on_ratelimit=True,
                            rapidapi_key=rapidapi_key,
                            **twitter_app_auth)

    # Check a single account by screen name
    result = bom.check_account(requestObject['screenName'])
    print(result)
    
    print(result['cap']['universal'])

    HF_Rating = ""
    try:
        # fakeRating = requests.get('https://huggingface.co/openai-detector/?'+requestObject['tweetMessage'])
        # HF_Rating = fakeRating.json()['real_probability']
        HF_Rating = inferWithHuggingFace(requestObject['tweetMessage'])
    except:
        HF_Rating = ""
    CML_Rating = getMLClassification(inputStr=requestObject['tweetMessage'])

    data_set = {"real": HF_Rating, "real_CML": CML_Rating ,"bot_CAP": result['cap']['universal'], "bot_score": result['raw_scores']['universal']['overall']}
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
        article = NewsPlease.from_url(theURL, timeout=20)
        articleTitle = article.title
        articleMaintext = article.maintext
    except: 
        articleTitle=""
        articleMaintext=""
    HF_Rating = ""
    try:
        # fakeRating = requests.get('https://huggingface.co/openai-detector/?'+articleMaintext)
        # HF_Rating = fakeRating.json()['real_probability']
        HF_Rating = inferWithHuggingFace(articleMaintext)
    except:
        HF_Rating = ""
    CML_Rating = getMLClassification(inputStr=requestObject['titleOfContent'])
    
    data_set = {"real": HF_Rating, "fullText": "" +articleMaintext, "real_CML": CML_Rating}
    outputJson = json.dumps(data_set)
    resp = make_response(outputJson)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods']= 'DELETE, POST, GET, OPTIONS'
    resp.headers['Access-Control-Allow-Headers']='Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-Width'
    return resp
    
        

if __name__ == '__main__':
    app.run(host='127.0.0.1', port='5000', debug=False)
