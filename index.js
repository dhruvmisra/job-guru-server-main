const express = require("express");
const AppRouter = require("./Router/AppRouter");
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

new AppRouter(app).initRoutes();
const port = app.listen(process.env.PORT || 3000);
app.listen(port, () => {
    console.log(`Server Listening on port 3000`);
});
