const express = require("express");
const AppRouter = require("./Router/AppRouter");
const bodyParser = require('body-parser');
const index = express();
const port = 3000;
const cors = require('cors');

index.use(cors());
index.use(bodyParser.urlencoded({ extended: false }));
index.use(bodyParser.json());

new AppRouter(index).initRoutes();

index.listen(port, () => {
    console.log(`Server Listening on port`, port);
});
