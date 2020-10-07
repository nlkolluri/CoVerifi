# CoVerifi: A COVID-19 News Verification System.
This is the GitHub repository accompanying the paper "CoVerifi: A COVID-19 News Verification System." 


![Figure 2 from CoVerifi Paper](https://github.com/nlkolluri/CoVerifi/blob/master/Figure2.jpg?raw=true)
*Above: Figure 2 from the CoVerifi paper, which shows COVID-19 news drawn from Bing News Search API*


![Figure 3 from CoVerifi Paper](https://github.com/nlkolluri/CoVerifi/blob/master/Figure3.jpg?raw=true)
*Above: Figure 3 from the CoVerifi paper, which shows COVID-19 news drawn from Twitter*



## Backend Important Notes
### 1] API keys are required for Twitter deployment
This is because we have obscured the API keys for the Twitter API. Thus, new users will need to create a Twitter Developer account, obtain an API key, API secret key, Access Token, and Access Token Secret. Then, they will need to replace the fields consumer_key, consumer_secret, key, and secret in app.py with these values.
### 2] We recommend using a different Hugging Face detector API than provided in the code.
In our code, we make API calls to https://huggingface.co/openai-detector, which was not intended to be used as an API but we obtained permission from the authors to use it as such on a small scale. However, Hugging Face has more recently released a set of APIs which are intended for this purpose: https://huggingface.co/roberta-base-openai-detector?text=I+like+you.+I+love+you and https://huggingface.co/roberta-large-openai-detector?text=I+like+you.+I+love+you. It appears that label 0 means "likely real" and label 1 means "likely machine-generated." If you are interested in sending large volumes of requests, their website (URL: https://huggingface.co/docs) says:
"If you are interested in accelerated inference and/or higher volumes of requests and/or a SLA, please contact us at api-enterprise at huggingface.co"
### 3] Deploying to Heroku or another hosting provider is an important step.
We have included our requirements.txt file and Procfile for easy deployment to Heroku. In its current state, our code is fully functional when deployed to Heroku. However, when running in a local environment, there are sometimes articles which cause the backend service to crash. Locally, you should be able to wait a few seconds, restart the backend service, and the web app will behave normally. On Heroku, if an article causes the error, the backend service automatically re-starts and the web app displays normal behavior.

## Frontend Important Notes
### 1] Some features require API keys
In order to access the Bing News Search API results, the variable BING_NEWS_API_KEY in App.js must be set equal to the API key associated with a Bing News Search instance. This is free but seems to require credit card verification if you set up an account (URL: https://azure.microsoft.com/en-us/services/cognitive-services/bing-news-search-api/). Furthermore, in Firebase.js, all of the config values must be updated with the config values which are present after creating a Google Firebase app. This is also the case with the Firebase config values in the public/index.html file.

### 2] All features require integration with the backend
There are several API calls to localhost:5000 in the code, such as http://localhost:5000/get_tweets. If you host our backend through different hosting, localhost:5000 would be replaced by the name of your hosting provider. For example, all references to localhost:5000 may be replaced with references to CUSTOM_API.herokuapp.com. It would look like: http://CUSTOM_API.herokuapp.com/get_tweets. 

## How to run
#### 1] Clone the project
#### 2] Set up and run the backend service 
You may need to install the dependencies provided in the requirements.txt file. Run the backend by running the app.py file.
#### 3] Set up the frontend 
Replace all API key placeholders (Firebase API key, Bing News Search API key) with your own API keys. Then, replace all URLs in the frontend code with references to your backend rather than localhost:5000
#### 4] Run the frontend
In the frontend project folder, which includes package.json and the src folder, perform the command "npm install". This will install the dependencies for the frontend. Next, perform the command "npm start"


## Additional sources helped in the development of this code
For the frontend, we began with this a sample React Twitter Feed project (URL: https://github.com/kakaly/twitter-feed), but then heavily modified it. We retained this author's MIT license. We also used tools such as news-please (URL: https://github.com/fhamborg/news-please) and tweepy (URL: https://github.com/tweepy/tweepy)
