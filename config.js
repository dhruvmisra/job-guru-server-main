const firebase = require('firebase-admin');

class Config {}

Config.firebaseConfig = {
    databaseURL: "https://jobguru-dd1f3.firebaseio.com",
    credential: firebase.credential.cert("service-account.json")
};

Config.payu = {
    merchantKey: "mXf99vP3",
    merchantSalt: "mR5rQKWkkW",
    authHeader: "XXymvY6zitRHD8DgMXyzQVBhFhVF8+evpi6n/UCdJ70="
};

exports.Config = Config;