# This is the backend service for CoVerifi, written in Python.
## Important Notes: 
### 1] The Twitter functionality will not work without modification
This is because we have obscured the API keys for the Twitter API. Thus, new users will need to create a Twitter Developer account, obtain an API key, API secret key, Access Token, and Access Token Secret. Then, they will need to replace the fields consumer_key, consumer_secret, key, and secret in app.py with these values.
### 2] We recommend using a different Hugging Face detector API than provided in the code.
In our code, we make API calls to https://huggingface.co/openai-detector, which was not intended to be used as an API but we obtained permission from the authors to use it as such on a small scale. However, Hugging Face has more recently released a set of APIs which are intended for this purpose: https://huggingface.co/roberta-base-openai-detector?text=I+like+you.+I+love+you and https://huggingface.co/roberta-large-openai-detector?text=I+like+you.+I+love+you. It appears that label 0 means "likely real" and label 1 means "likely machine-generated." If you are interested in sending large volumes of requests, their website (URL: https://huggingface.co/docs) says:
"If you are interested in accelerated inference and/or higher volumes of requests and/or a SLA, please contact us at api-enterprise at huggingface.co"
### 3] Deploying to Heroku or another hosting provider is an important step.
We have included our requirements.txt file and Procfile for easy deployment to Heroku. In its current state, our code is fully functional when deployed to Heroku. However, when running in a local environment, there are sometimes articles which cause the backend service to crash. Locally, you should be able to wait a few seconds, restart the backend service, and the web app will behave normally. On Heroku, if an article causes the error, the backend service automatically re-starts and the web app displays normal behavior.
### 4] Additional sources helped in the development of this code

