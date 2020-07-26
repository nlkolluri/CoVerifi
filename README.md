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

## Frontend Important Notes


## Additional sources helped in the development of this code
For the frontend, we began with this a sample React Twitter Feed project (URL: https://github.com/kakaly/twitter-feed), but then heavily modified it. We retained this author's MIT license. We also used tools such as news-please (URL: https://github.com/fhamborg/news-please) and tweepy (URL: https://github.com/tweepy/tweepy)
