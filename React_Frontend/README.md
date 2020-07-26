# This is the frontend code for CoVerifi, written in React.js
## Important Notes: 
### 1] Some features require API keys
In order to access the Bing News Search API results, the variable BING_NEWS_API_KEY in App.js must be set equal to the API key associated with a Bing News Search instance. This is free but seems to require credit card verification if you set up an account (URL: https://azure.microsoft.com/en-us/services/cognitive-services/bing-news-search-api/). Furthermore, in Firebase.js, all of the config values must be updated with the config values which are present after creating a Google Firebase app. This is also the case with the Firebase config values in the public/index.html file.

### 2] All features require integration with the backend
There are several API calls to localhost:5000 in the code, such as http://localhost:5000/get_tweets. If you host our backend through different hosting, localhost:5000 would be replaced by the name of your hosting provider. For example, all references to localhost:5000 may be replaced with references to CUSTOM_API.herokuapp.com. It would look like: http://CUSTOM_API.herokuapp.com/get_tweets. 



