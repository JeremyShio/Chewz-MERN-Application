module.exports = function(app) {
    app.use('/auth', require('./auth'))
    app.use('/', require('./dashboard'))
    // app.use('/list', require('./list'))
};