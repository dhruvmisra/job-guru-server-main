const firebase = require('firebase/app');
require('firebase/database');
require('firebase/storage');

const config = {
    apiKey: "AIzaSyBoLcgbWMf1hnTpvVYcVBcCCzZt5qiVERQ",
    authDomain: "jobguru-dd1f3.firebaseapp.com",
    databaseURL: "https://jobguru-dd1f3.firebaseio.com",
    projectId: "jobguru-dd1f3",
    storageBucket: "jobguru-dd1f3.appspot.com",
    messagingSenderId: "150645643079",
    appId: "1:150645643079:web:6dd4c2b7b4105f0f"
};
firebase.initializeApp(config);

module.exports = firebase;