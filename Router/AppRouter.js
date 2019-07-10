const firebase = require('../firebase');
const config = require('../config');
const payumoney = require('payumoney-node');
const nodemailer = require('nodemailer');
global.XMLHttpRequest = require("xhr2");

payumoney.setKeys(config.Config.payu.merchantKey, config.Config.payu.merchantSalt, config.Config.payu.authHeader);
payumoney.isProdMode(true);


class AppRouter {

    constructor(app) {
        this.app = app;
    }

    initRoutes() {
        let uid = "";
        this.app.get('/', (req, res) => {
            const datetime = Date();
            res.send(datetime);
        });

        this.app.post("/v1/saveUserData", async (req, res) => {
            const userId = req.body.data.userId;
            const savePath = req.body.savePath;
            const ref = firebase.database().ref('users/' + userId + savePath);
            const user = req.body.data;
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
            console.log("request ", req.body);
            uid = req.body.userData.userId;
            payumoney.makePayment(req.body.payment, async (error, response) => {
                if (error) {
                    console.error("Payment failed ", error);
                    res.send(500);
                } else {
                    console.log("Payment success ", response);
                    res.send(response);
                }
            });
        });

        this.app.post("/payu/success", async (req, res) => {
            const payment = {
                "payment": {
                    "txnid": req.body.txnid,
                    "amount": req.body.amount,
                    "productinfo": req.body.productinfo
                }
            };
            const ref = firebase.database().ref(`users/${uid}`);
            console.log("payment ", payment);
            try {
                await ref.update(payment);
                res.redirect("http://localhost:8080/job-guru-final/#/payment");
            } catch (e) {
                console.error("Exception ", e);
                res.sendStatus(500);
            }
        });

        this.app.post("/payu/fail", async (req, res) => {
            res.redirect("http://localhost:8080/job-guru-final/#/payment");
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

        this.app.get("/v1/resume-form", (req, res) => {
            const professionalSkills = [
                'Adaptable',
                'Attentive to detail',
                'Collaborative',
                'Communication',
                'Creative',
                'Curious',
                'Customer service',
                'Daring',
                'Decision making',
                'Empathy',
                'Leadership',
                'Multitasking',
                'Passion',
                'Positivity',
                'Presentation',
                'Problem solving',
                'Self-motivation',
                'Teamwork',
                'Time management',
                'Work ethic'
            ];

            const skills = [
                'C++',
                'Java',
                'JavaScript',
                'HTML',
                'CSS'
            ];
            res.json({professionalSkills, skills});
        });
    }
}

module.exports = AppRouter;