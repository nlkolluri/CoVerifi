import React, { Component } from 'react';
import { TweetBody } from './components/tweet.js'
import {PullToRefresh, PullDownContent, ReleaseContent, RefreshContent} from "react-js-pull-to-refresh";
import './App.css';
import firebase from '././Firebase.js'
import { Nav, Navbar, Form, Button, FormControl } from 'react-bootstrap'

const JSON5 = require('json5')
var querystring = require('querystring')
var https = require('https')

const BING_NEWS_API_KEY = "PLACEHOLDER"

var covidNews = []
var breakingNews = []
var queryNews = []
var redditNews = []
var twitterNews = []
var intendedState = "covidNews"
var intendedQuery = ""
const lengthCap = 600
var theSearchValue = ""

class App extends Component {
  constructor(props) {
    super(props)
    this.state={
      users:
      [ 
      ]
    }
    this.getUser = this.getUser.bind(this)
    this.setIntendedState = this.setIntendedState.bind(this)
  }


  componentWillMount() {
    this.getUser("covidNews", null)
  }


  setIntendedState(theIntendedState){
    this.intendedState = theIntendedState;
  }


  async getTwitterNews(){
    const that=this; 
    var tempArray = new Array();
    let postBody = {
      tweetQuery: 'coronavirus'
    };

    try {
     let response = await fetch('http://localhost:5000/get_tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(postBody)
    });
    
      let result = await response.json();
      for (var i=0; i<result.length; i++){        
        tempArray.push({
          websiteURL: result[i].tweetURL,
          name: '@' + result[i].screenName,
          image:  result[i].profileImageURL,
          news_content:  result[i].tweetText,
          news_title: result[i].name + ' tweeted:',
          classification: 'Loading classification...',
          description: "Pulling from website",
          userVotes: "User Votes: Loading"
        })

        twitterNews = [...tempArray, ...twitterNews]
          if (intendedState === "twitterNews"){
            that.setState(prevState => ({
              users: [...twitterNews]
            }));
          }
      }

      for (var i=0; i<tempArray.length; i++){
        let postBody2 = {
          tweetMessage: tempArray[i].news_content
        };

        try {
         let response2 = await fetch('http://localhost:5000/process-tweet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(postBody2)
        });
        
        let result2 = await response2.json();
        var percent = 100*result2.real;
        percent = Math.floor(percent*1000)/1000;
        

        var classificationStr = "";
        if (percent > 50){
          classificationStr = "ML model: " + percent + "% Real (Human Generated)"
        } else {
          classificationStr = "ML model: " + (100 - percent) + "% Fake (Bot Generated)"
        }
        
        tempArray[i].classification = classificationStr;
        tempArray[i].news_content =  tempArray[i].news_content;
        tempArray[i].fullTextOfNews = tempArray[i].news_content;
        

      } catch (err) {
        tempArray[i].classification = "Failed to classify"
      }

       

        twitterNews =  [...tempArray]
        if (intendedState === "twitterNews"){
          that.setState(prevState => ({
            users: [...twitterNews]
          })
          );
        } 
      }
    } catch(err){
    }
  }

  getRedditNews(){
    const https = require('https')
    var options = {
      hostname: 'www.reddit.com/',
      path: 'r/news/best/.json?count=20',
      method: 'GET'
    }
    const that=this; 
    var tempArray = new Array();
    https.get(options, function(res){
      var data = '';
      
      res.on('data', function (chunk){
          data += chunk;
      });  
  
      res.on('end',  async function(){
        var obj = JSON.parse(data);
        console.log(obj['data'].children)
        var arrayOfPosts = obj['data'].children;
        for (var i=0; i<arrayOfPosts.length; i++){
          console.log(arrayOfPosts[i].data.url)
          tempArray.push({
            websiteURL: arrayOfPosts[i].data.url,
            name: arrayOfPosts[i].data.subreddit_name_prefixed,
            image:  'https://a.thumbs.redditmedia.com/E0Bkwgwe5TkVLflBA7WMe9fMSC7DV2UOeff-UpNJeb0.png',
            news_content:  'Pulling from website...',
            news_title: arrayOfPosts[i].data.title,
            classification: 'Loading classification...',
            description: "Pulling from website",
            userVotes: "User Votes: Loading"
          })
        }

          redditNews = [...tempArray, ...redditNews]
          if (intendedState === "redditNews"){
            that.setState(prevState => ({
              users: [...redditNews]
            }));
          }

          for (var i=0; i<tempArray.length; i++){
            let postBody = {
              urlOfContent: tempArray[i].websiteURL
            };

            try {
             let response = await fetch('http://localhost:5000/classify-texts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(postBody)
            });
            
            let result = await response.json();
            console.log("Real: " + result.real);
            console.log(data)
            var percent = 100*result.real;
            console.log("Real probability: " + percent)
            percent = Math.floor(percent*1000)/1000;
            

            var classificationStr = "";
            if (percent > 50){
              classificationStr = "ML model: " + percent + "% Real (Human Generated)"
            } else {
              classificationStr = "ML model: " + (100 - percent) + "% Fake (Bot Generated)"
            }
            console.log("ClassificationStr: " + classificationStr)
            
            tempArray[i].classification = classificationStr;
            if (result.fullText.length>0){
              var fullTextStr = result.fullText.substring(0,Math.min(result.fullText.length,lengthCap));
              tempArray[i].news_content =  fullTextStr + "... [Click to read more]";
              tempArray[i].fullTextOfNews = result.fullText;
            }

          } catch (err) {
            tempArray[i].classification = "Failed to classify"
            tempArray[i].news_content = "Failed to load content. View website instead"
          }

            redditNews =  [...tempArray]
            if (intendedState === "redditNews"){
              that.setState(prevState => ({
                users: [...redditNews]
              })
              );
            } 


          }
 
      })
    })
  }


  

  

  getUser(newsType, querystring) {
    
    var currentQuery = querystring;
    const https = require('https')
    var options = {}
    if (newsType === "covidNews"){
       options = {
        hostname: 'api.cognitive.microsoft.com',
        headers: {'Ocp-Apim-Subscription-Key': BING_NEWS_API_KEY},
        path: '/bing/v7.0/news/search?q=covid',
        method: 'GET'
      }
   } else if (newsType === "breakingNews"){
      options = {
        hostname: 'api.cognitive.microsoft.com',
        headers: {'Ocp-Apim-Subscription-Key': BING_NEWS_API_KEY},
        path: '/bing/v7.0/news',
        method: 'GET'
      }
   } else if (newsType === "queryNews"){
    var theQueryString = querystring;
    theQueryString = theQueryString.replace(/\s+/g, "+");
    console.log("Querying with value: " + theQueryString);
    options = {
      hostname: 'api.cognitive.microsoft.com',
      headers: {'Ocp-Apim-Subscription-Key': BING_NEWS_API_KEY},
      path: '/bing/v7.0/news/search?q='+theQueryString,
      method: 'GET'
    }

   }

    const that=this; 
    var tempArray = new Array();
    https.get(options, function(res){
      var data = '';
  
      res.on('data', function (chunk){
          data += chunk;
      });  
  
      res.on('end',  async function(){
          var obj = JSON.parse(data);
          console.log(obj['value'])
          var theResultsArray = obj['value'];
          for (let i=0; i<Math.min(theResultsArray.length,20); i++){
            if (newsType === "queryNews" && intendedQuery!=currentQuery) continue;
          
            var imageToPut = 'https://www.bing.com/sa/simg/bing_news.png';
             try {
              imageToPut = theResultsArray[i].image.thumbnail.contentUrl
             }
             catch (err){
              imageToPut = 'https://www.bing.com/sa/simg/bing_news.png';
             }

            tempArray.push({
              websiteURL: theResultsArray[i].url,
              name: theResultsArray[i].provider[0].name,
              image: imageToPut,
              news_content:  'Description: ' +theResultsArray[i].description,
              news_title: theResultsArray[i].name,
              classification: 'Loading classification...',
              description: theResultsArray[i].description,
              userVotes: 'User Votes: Loading...'
            })
          
          }
          
          if (newsType === "covidNews") covidNews =  [...tempArray, ...covidNews]
          else if (newsType === "breakingNews") breakingNews = [...tempArray, ...breakingNews]
          else if (newsType === "queryNews") queryNews = [...tempArray, ...queryNews]
          if (intendedState === "covidNews"){
            that.setState(prevState => ({
              users: [...covidNews]
            })
            );
          } else if (intendedState === "breakingNews"){
            that.setState(prevState => ({
              users: [...breakingNews]
            }))
          } else if (intendedState === "queryNews"){
            that.setState(prevState => ({
              users: [...queryNews]
            }))
          }
          
          
          for (var i=0; i<tempArray.length; i++){
            if (newsType === "queryNews" && intendedQuery!=currentQuery) continue;
            let postBody = {
              urlOfContent: tempArray[i].websiteURL
            };

            try {
             let response = await fetch('http://localhost:5000/classify-texts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(postBody)
            });
            
            let result = await response.json();
            console.log("Real: " + result.real);
            var percent = 100*result.real;
            percent = Math.floor(percent*1000)/1000;

            var classificationStr = "";
            if (percent > 50){
              classificationStr = "ML model: " + percent + "% Real (Human Generated)"
            } else {
              classificationStr = "ML model: " + (100 - percent) + "% Fake (Bot Generated)"
            }
            
            tempArray[i].classification = classificationStr;
            if (result.fullText.length>0){
              var fullTextStr = result.fullText.substring(0,Math.min(result.fullText.length,lengthCap));
              tempArray[i].news_content =  fullTextStr + "... [Click to read more]";
              tempArray[i].fullTextOfNews = result.fullText;
            }

          } catch (err){
            tempArray[i].news_content = "Only partial content... " + tempArray[i].news_content
            tempArray[i].fullTextOfNews = "[PARTIAL]: " + tempArray[i].news_content
            tempArray[i].classification = "Failed to load classification"
            
          }


            if (newsType === "covidNews") covidNews =  [...tempArray]
            else if (newsType === "breakingNews") breakingNews = [...tempArray]
            else if (newsType === "queryNews") queryNews = [...tempArray]
            if (intendedState === "covidNews"){
              that.setState(prevState => ({
                users: [...covidNews]
              })
              );
            } else if (intendedState === "breakingNews"){
              that.setState(prevState => ({
                users: [...breakingNews]
              }))
            } else if (intendedState === "queryNews"){
              that.setState(prevState => ({
                users: [...queryNews]
              }))
            }


          }

      })
  
  });

}

  render() {

    var that = this;

    function handleSelect(key) {
      if (key === "covidNews"){
          intendedState="covidNews"
          if (covidNews.length < 1) {that.getUser("covidNews")}
          else {
            that.setState({ users: covidNews})
            setTimeout(()=> {that.setState({ users: covidNews})})
          }
        }
      else if (key === "breakingNews"){
          intendedState="breakingNews"
          if (breakingNews.length < 1) that.getUser("breakingNews")
          else { 
            that.setState({ users: [...breakingNews]})
            setTimeout(()=> {that.setState({ users: [...breakingNews]})})
          } 
        }
      else if (key === "redditNews"){
        intendedState = "redditNews"
        if (redditNews.length <1) that.getRedditNews();
        else {
          that.setState({users: [...redditNews]})
          setTimeout(()=> {that.setState({users: [...redditNews]})})
        }
      }
      else if (key === "twitterNews"){
        intendedState = "twitterNews"
        if (twitterNews.length <1) that.getTwitterNews();
        else {
          that.setState({users: [...twitterNews]})
          setTimeout(()=> {that.setState({users: [...twitterNews]})})
       }
      }
    }

    

    function changeHandler(event) {
      theSearchValue = event.target.value
    }

    

    function handleSubmit(event){
      event.preventDefault()
      intendedState="queryNews"
      intendedQuery = theSearchValue;
      that.getUser("queryNews", theSearchValue);
    }

    return (
      
    <div>

    <Navbar bg="light" variant="light">
              <Navbar.Brand href="#home">CoVerifi</Navbar.Brand>
              <Nav className="mr-auto">
                  <Nav.Link href="#about">About</Nav.Link>
              </Nav>
              <Form inline onSubmit={handleSubmit}>
                  <FormControl type="text" placeholder="Search here!" className="mr-sm-2" ref="search" type="search" onChange={changeHandler}/>
                  <Button variant="outline-primary" type="submit" onSubmit={handleSubmit}>Search</Button>
              </Form>
    </Navbar>
        
        <Nav variant="nav  d-md-none "   defaultActiveKey={"covidNews"} onSelect={handleSelect}>
          <Nav.Item>
            <Nav.Link eventKey={"covidNews"} style={{color:'white'}}>COVID-19 News</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={"breakingNews"} style={{color:'white'}}>Breaking News</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={"redditNews"} style={{color:'white'}}>Reddit News</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={"twitterNews"} style={{color:'white'}}>Twitter News</Nav.Link>
          </Nav.Item>
          
      </Nav> 
      
      

      <div id="rowLayout">  
        <Nav variant="nav flex-column collapse d-md-block" id="navSidebar" defaultActiveKey={"covidNews"} onSelect={handleSelect}>
            <Nav.Item>
              <Nav.Link eventKey={"covidNews"} style={{color:'white'}}>COVID-19 News</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"breakingNews"} style={{color:'white'}}>Breaking News</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"redditNews"} style={{color:'white'}}>Reddit News</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"twitterNews"} style={{color:'white'}}>Twitter News</Nav.Link>
            </Nav.Item>
          
          </Nav>  
        <div className="main-body">
          {[...this.state.users].map((user, index) => {
            let name = `${user.name}`
            let handle = `@${user.name}`
            let image = user.image
            let news_content = user.news_content
            let classification= user.classification
            let news_title = user.news_title
            let websiteURL = user.websiteURL
            let showContent = user.showContent
            let fullTextOfNews = user.fullTextOfNews
            let userVotes = user.userVotes
            return(
              <TweetBody 
                key={index}
                name={name}
                handle={handle}
                news_content={news_content}
                image={image}
                classification={classification}
                news_title = {news_title}
                websiteURL = {websiteURL}
                showContent = {showContent} 
                fullTextOfNews = {fullTextOfNews}
                userVotes = {userVotes}
                />
            )
          })}      
        </div>
      </div>
      </div>
    );
  }
}

export default App;
