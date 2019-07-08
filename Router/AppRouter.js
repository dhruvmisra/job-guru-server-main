

class AppRouter {

    constructor(app) {
        this.app = app;
    }

    initRoutes() {
        console.log("init routes executed");
        this.app.get('/v1/checkServerStatus', (req, res) => {
           const datetime = Date();
           console.log("datetime ", datetime);
           res.send(datetime);
        });
    }
}

module.exports = AppRouter;