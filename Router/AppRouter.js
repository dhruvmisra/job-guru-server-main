const admin = require("firebase-admin");
const config = require('../config');
const payumoney = require('payumoney-node');
admin.initializeApp(config.Config.firebaseConfig);
const db = admin.firestore();

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
            console.log("request body ", req.body);
            const ref = db.collection("users").doc(req.body.email);
            const user = req.body;
            try {
                await ref.set(user);
                res.send(200);
            } catch (e) {
                console.log("Exception ", e);
                res.sendStatus(500);
            }
        });
        this.app.get("/v1/getUserData/:email", async (req, res) => {
            const userEmail = req.params.email;
            const ref = db.collection("users").doc(userEmail);
            let userData = {};
            try {
                await ref.get().then((result) => {
                    console.log("result ", result["_fieldsProto"]);
                    userData = result["_fieldsProto"];
                });
                res.json(userData);
            } catch (e) {
                console.log("Exception ", e);
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