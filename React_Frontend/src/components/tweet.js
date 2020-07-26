import React from 'react';
import { Button } from 'react-bootstrap'
import firebase from './../Firebase.js'

const TweetBox = (props) => {
  return(
    <div className="tweet-body">
      {props.children}
    </div>
  )
}

const Image = (props) => {
  return(
    <img src={props.image} alt="Logo" className="picture">
    </img>
  )
}

const Handle = (props) => {
  return(
    <div className="handle">
      {props.handle}
    </div>
  )
}

const Classification = (props) => {
  var colorOfIt = 'green';
  if (props.classification.includes('Sad')|| props.classification.includes('Fake')) colorOfIt = 'red';

  return (
    <div className="classification" >
      <p style={{color: colorOfIt}}>{props.classification}</p>
    </div>
  )
}


class UserVotes extends React.Component {
  constructor(props){
    super(props);
    this.state = {theUserVotesString: 'No user votes found...'}
  }

  componentWillReceiveProps(){
    var docKey = this.props.news_content.replace(/[’]/g, '').replace(/\W/g, ' ').replace( /\s\s+/g, ' ' ); //replaces apostrophes, non-alphanum chars
      const db = firebase.firestore()
      var docRef = db.collection("userClassifications").doc(docKey);
      const that = this;
      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              var thePosVotes = doc.data().posVotes;
              var theNegVotes = doc.data().negVotes;
              if (thePosVotes > theNegVotes){
                var percentPos = 100*(thePosVotes)/(thePosVotes+theNegVotes);
                percentPos = Math.floor(percentPos*1000)/1000;
                that.setState(prevState => ({
                  theUserVotesString: "User Votes: " + percentPos + "% Real"
                }));
                 
              } else {
                var percentNeg = 100*(theNegVotes)/(thePosVotes+theNegVotes);
                percentNeg = Math.floor(percentNeg*1000)/1000;
                that.setState(prevState => ({
                theUserVotesString:  "User Votes: " + percentNeg + "% Fake"
                }))
              }
              
          } else {
            that.setState(prevState => ({
              theUserVotesString:  "No users have voted yet"
            }))
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
          that.setState(prevState => ({
            theUserVotesString:  "No users have voted yet"
          }))
      });
  
    }


  render(){
    var colorOfIt = 'green'
    if ((this.state.theUserVotesString.includes('Sad')|| this.state.theUserVotesString.includes('Fake'))) colorOfIt = 'red';
    return (
      <div className="classificationUserVotes" >
        <p style={{color: colorOfIt}}>{this.state.theUserVotesString}</p>
      </div>
    )
  }
}





const News_Title = (props) => {
  return (
    <div className="news_title">
      {props.news_title}
    </div>
  )
}

const Name = (props) => {
  return(
    <div className="name">
      {props.name}
    </div>
  )
}

const News_Content = (props) => {
  return (
    <div className="news_content">
      {props.news_content}
    </div>
  )
}



class TweetBody extends React.Component {
  constructor(props){
    super(props)
    this.state = {key: 0}
  }

  render(){
    var props = this.props;
    var theURL = props.websiteURL;
    var contentToShow = props.news_content;
    const that=this;

    function getUserVotesVal(){
      
      var docKey = props.news_content.replace(/[’]/g, '').replace(/\W/g, ' ').replace( /\s\s+/g, ' ' ); //replaces apostrophes, non-alphanum chars
            const db = firebase.firestore()
            var docRef = db.collection("userClassifications").doc(docKey);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    var thePosVotes = doc.data().posVotes;
                    var theNegVotes = doc.data().negVotes;
                    if (thePosVotes > theNegVotes){
                      var percentPos = 100*(thePosVotes)/(thePosVotes+theNegVotes);
                      percentPos = Math.floor(percentPos*1000)/1000;
                      return "User Votes: " + percentPos + "% Real"
                    } else {
                      var percentNeg = 100*(theNegVotes)/(thePosVotes+theNegVotes);
                      percentNeg = Math.floor(percentNeg*1000)/1000;
                      return "User Votes: " + percentNeg + "% Fake"
                    }
                    
                } else {
                    return "No users have voted yet"
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
                return "No users have voted yet"
            });
            return "No users have voted yet"
    }

    function reportCredible(){
      
      var docKey = contentToShow.replace(/[’]/g, '').replace(/\W/g, ' ').replace( /\s\s+/g, ' ' ); //replaces apostrophes, non-alphanum chars
      var theFullText = contentToShow;
      if (props.fullTextOfNews !=null ){
         theFullText = props.fullTextOfNews.replace(/[’]/g, '').replace(/\W/g, ' ').replace( /\s\s+/g, ' ' );
      }
      
      const db = firebase.firestore()
      var docRef = db.collection("userClassifications").doc(docKey);
      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              var thePosVotes = doc.data().posVotes;
              docRef.update({
                posVotes: thePosVotes+1
              })
          } else {
              console.log("No such document!");
              docRef.set({
                "fullText": theFullText,
                "posVotes": 1,
                "negVotes": 0
              })
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      
      setTimeout(()=> {
        that.setState(prevState => ({
          key:  (Math.random()*100)
        }))
      }, 500)

    }

    function reportFake(){
      if (contentToShow == null ) {
        console.log("Error reporting :(");
        return;
      }
      var docKey = contentToShow.replace(/[’]/g, '').replace(/\W/g, ' ').replace( /\s\s+/g, ' ' ); //replaces apostrophes, non-alphanum chars
      var theFullText = contentToShow;
      if (props.fullTextOfNews !=null ){
         theFullText = props.fullTextOfNews.replace(/[’]/g, '').replace(/\W/g, ' ').replace( /\s\s+/g, ' ' );
      }
      const db = firebase.firestore()
      var docRef = db.collection("userClassifications").doc(docKey);
      docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data:", doc.data());
              var theNegVotes = doc.data().negVotes;
              docRef.update({
                negVotes: theNegVotes+1
              })
          } else {
              console.log("No such document!");
              docRef.set({
                "fullText": theFullText,
                "posVotes": 0,
                "negVotes": 1
              })
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

      setTimeout(()=> {
        that.setState(prevState => ({
          key:  (Math.random()*100)
        }))
      }, 500) //wait so that the newer state is accessible
      

    }




    



    

    return(
      <TweetBox>
        <div className="inner-body" >
          
          <div className="body">
            <div className="inner-body"  >
              <Image image={props.image}/>
              <div className="aColumn">
                
                <div class="anotherRow">
                  <Name name={props.name}/>
                  <Button variant="success" className="credibleBtn" size="sm" onClick={() => reportCredible()}>Credible</Button><Button variant="danger" className="fakeBtn" size="sm" onClick={() => reportFake()}>Fake</Button>
                  <UserVotes news_content= {props.news_content} ></UserVotes>
                  </div>
                <Classification classification = {props.classification}/>
              </div>
            </div>
            
            <div className="aColumn" onClick={() => window.open(theURL)}>
              <News_Title news_title = {props.news_title}/>
              <News_Content news_content={contentToShow}/>
            </div>
            
          </div>
        </div>
      </TweetBox>
    )
  

  }

}



export { TweetBody }