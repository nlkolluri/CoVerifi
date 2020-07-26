# This is the frontend code for CoVerifi, written in React.js
## Important Notes: 
### 1] Some features require API keys
In order to access the Bing News Search API results, the variable BING_NEWS_API_KEY in App.js must be set equal to the API key associated with a Bing News Search instance. This is free but seems to require credit card verification if you set up an account (URL: https://azure.microsoft.com/en-us/services/cognitive-services/bing-news-search-api/). Furthermore, in Firebase.js, all of the config values must be updated with the config values which are present after creating a Google Firebase app. This is also the case with the Firebase config values in the public/index.html file.

### 2] All features require integration with the backend
There are several API calls to localhost:5000 in the code, such as http://localhost:5000/get_tweets. If you host our backend through different hosting, localhost:5000 would be replaced by the name of your hosting provider. For example, all references to localhost:5000 may be replaced with references to CUSTOM_API.herokuapp.com. It would look like: http://CUSTOM_API.herokuapp.com/get_tweets. 


### 3] Additional sources helped in the development of this code
For the frontend, we began with this: https://github.com/kakaly/twitter-feed, but then heavily modified it. We retained this author's MIT license. We also used libraries such as react-bootstrap.
## How to run
#### 1] Clone the project
#### 2] Set up the backend service, replace all URLs in the code with references to your hosted backend
#### 3] Replace all API key placeholders (Firebase API key, Bing News Search API key) with your own API keys
#### 4] In the project's root folder, which includes package.json and the src folder, run the command "npm install"
#### 5] Next, run "npm start"

