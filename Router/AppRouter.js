const firebase = require('../firebase');
const config = require('../config');
const payumoney = require('payumoney-node');
const nodemailer = require('nodemailer');
global.XMLHttpRequest = require("xhr2");

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
            const userId = req.body.userId;
            const ref = firebase.database().ref('users/' + userId);
            const user = req.body;
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
            const ref = firebase.database().ref('users/' + userId);
            let userData = {};
            try {
                await ref.once('value', snap => {
                    userData = snap.val();
                    res.json(userData);
                });
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

        this.app.post("/v1/sendEmail", async (req, res) => {
            let pdfUrl = "";
          await firebase.storage().ref().child('users/' + req.body.userId).getDownloadURL().then((downloadUrl) => {
                console.log("download url ", downloadUrl);
                pdfUrl = downloadUrl;
            });
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'flemingsteven49',
                    pass: 'fleming007'
                }
            });
            const mailOptions = {
                from: 'flemingsteven49@gmail.com',
                to: 'dhruvistheone@gmail.com',
                subject: 'Sending email using node js',
                text: `Resume Download link: ${pdfUrl}`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    res.sendStatus(500);
                } else {
                    console.log('Email sent: ' + info.response);
                    res.sendStatus(200);
                }
            });
        });
    }
}

module.exports = AppRouter;