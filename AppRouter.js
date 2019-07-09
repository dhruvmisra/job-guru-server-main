// const admin = require("firebase-admin");
const firebase = require('../firebase');
const config = require('../config');
const payumoney = require('payumoney-node');
// admin.initializeApp(config.Config.firebaseConfig);
// const db = admin.firestore();

payumoney.setKeys(config.Config.payu.merchantKey, config.Config.payu.merchantSalt, config.Config.payu.authHeader);
payumoney.isProdMode(false);


class AppRouter {

    constructor(app) {
        this.app = app;
    }

    initRoutes() {
        this.app.get('/v1/checkServerStatus', (req, res) => {
            const datetime = Date();
            res.send(datetime);
        });
        this.app.post("/v1/saveUserData", async (req, res) => {
            //console.log("request body: ", req.body);
            const userId = Date.now();
            console.log(userId);
            const ref = firebase.database().ref('users/' + userId);
            const user = req.body;
            user.userId = userId;
            try {
                await ref.set(user);
                res.sendStatus(200);
            } catch (e) {
                console.log("Exception: ", e);
                res.sendStatus(500);
            }
        });
        this.app.get("/v1/getUserData/:id", async (req, res) => {
            const userId = req.params.id;
            // await firebase.database().ref('users').orderByChild('email').equalTo(userEmail).once('value', snap => {
            //   console.log(snap.val());
            //   res.sendStatus(200);
            // })  
            const ref = firebase.database().ref('users/' + userId);



            let userData = {};
            try {
                await ref.once('value', snap => {
                    userData = snap.val();
                    console.log(userData);
                    res.sendStatus(200);
                });
                res.json(userData);
            } catch (e) {
                console.log("Exception: ", e);
                res.sendStatus(500);
            }
        });
        this.app.post("/v1/makePayment", async (req, res) => {
           const request = req.body;
           payumoney.makePayment(request, (error, response) => {
              if (error) {
                  console.error("Payment failed");
                  res.send(500);
              } else {
                  console.log("Payment success ", response);
                  res.send(200);
              }
           });
        });
        this.app.post("/payu/success", async (req, res) => {
           console.log("request ", req.body);
        });
        this.app.post("/payu/fail", async (req, res) => {
            console.log("request ", req.body);
        });
    }
}

module.exports = AppRouter;