import * as firebase from 'firebase/app';
import 'firebase/firestore'

let config = {
    apiKey: "PLACEHOLDER",
    authDomain: "PLACEHOLDER",
    databaseURL: "PLACEHOLDER",
    projectId: "PLACEHOLDER",
    storageBucket: "PLACEHOLDER",
    messagingSenderId: "PLACEHOLDER",
    appId: "PLACEHOLDER",
    measurementId: "PLACEHOLDER"
};

var firebaseApp = null

if (firebase.apps.length>0){
    firebaseApp =  firebase.app();
} else {
    firebaseApp =  firebase.initializeApp(config)
}
export default firebaseApp 
