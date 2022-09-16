const ListDashboardRouter = require('express').Router();




ListDashboardRouter.route("/create")
    .get(require('./editor'))
    .post(require('./create'))

    
ListDashboardRouter.route("/:slug")
    .get(require('./view'))


module.exports = ListDashboardRouter;