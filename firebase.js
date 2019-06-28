var auth = require("firebaseauth");
var firebase = new auth(process.env.AIzaSyBoLcgbWMf1hnTpvVYcVBcCCzZt5qiVERQ);

const fbLog = firebase.loginWithFacebook(token, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});

const googleLog = firebase.loginWithGoogle(token, (err, result) => {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
});

module.exports = {
  emailReg: emailReg,
  fbLog: fbLog,
  googleLog: googleLog
};
