# CoVerifi: A COVID-19 News Verification System.
This is the GitHub repository accompanying the paper "CoVerifi: A COVID-19 News Verification System."
### More comprehensive README.md files are provided for the Frontend folder and Backend folder.
The two folders are best understood as two separate projects, and can be hosted using separate hosting providers. For our free, proof-of-concept implementation, we opted for Google Firebase Hosting for the React.js Frontend and Heroku for the backend.
## How to run
#### 1] Clone the project
#### 2] Set up and run the backend service 
Review the instructions in the "backend" folder to set up the backend service. You may need to install the dependencies provided in the requirements.txt file. Run the backend by running the app.py file.
#### 3] Set up the frontend 
Replace all API key placeholders (Firebase API key, Bing News Search API key) with your own API keys. Then, replace all URLs in the frontend code with references to your backend rather than localhost:5000
#### 4] Run the frontend
In the frontend project folder, which includes package.json and the src folder, perform the command "npm install". This will install the dependencies for the frontend. Next, perform the command "npm start"
## Backend Important Notes
### 1] API keys are required for Twitter deployment
This is because we have obscured the API keys for the Twitter API. Thus, new users will need to create a Twitter Developer account, obtain an API key, API secret key, Access Token, and Access Token Secret. Then, they will need to replace the fields consumer_key, consumer_secret, key, and secret in app.py with these values.
### 2] We recommend using a different Hugging Face detector API than provided in the code.
In our code, we make API calls to https://huggingface.co/openai-detector, which was not intended to be used as an API but we obtained permission from the authors to use it as such on a small scale. However, Hugging Face has more recently released a set of APIs which are intended for this purpose: https://huggingface.co/roberta-base-openai-detector?text=I+like+you.+I+love+you and https://huggingface.co/roberta-large-openai-detector?text=I+like+you.+I+love+you. It appears that label 0 means "likely real" and label 1 means "likely machine-generated." If you are interested in sending large volumes of requests, their website (URL: https://huggingface.co/docs) says:
"If you are interested in accelerated inference and/or higher volumes of requests and/or a SLA, please contact us at api-enterprise at huggingface.co"
### 3] Deploying to Heroku or another hosting provider is an important step.
We have included our requirements.txt file and Procfile for easy deployment to Heroku. In its current state, our code is fully functional when deployed to Heroku. However, when running in a local environment, there are sometimes articles which cause the backend service to crash. Locally, you should be able to wait a few seconds, restart the backend service, and the web app will behave normally. On Heroku, if an article causes the error, the backend service automatically re-starts and the web app displays normal behavior.

## Frontend Important Notes


## Additional sources helped in the development of this code
For the frontend, we began with this a sample React Twitter Feed project (URL: https://github.com/kakaly/twitter-feed), but then heavily modified it. We retained this author's MIT license. We also used tools such as news-please (URL: https://github.com/fhamborg/news-please) and tweepy (URL: https://github.com/tweepy/tweepy)
