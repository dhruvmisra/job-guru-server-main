const express = require("express");
const AppRouter = require("./Router/AppRouter");

const app = express();
const port = 3000;

function modifyResponseBody(req, res, next) {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
    req.headers[`content-type`] = req.headers[`content-type`] || `application/json`;
    next();
}

app.use(modifyResponseBody);
new AppRouter(app).initRoutes();

app.listen(port, () => {
    console.log(`Server Listening on port`, port);
});
