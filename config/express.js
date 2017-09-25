var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser');

module.exports = function() {
    var expressApp = express();

    expressApp.use(bodyParser.urlencoded({
        extended: true
    }));
    expressApp.use(bodyParser.json());

    expressApp.set('views', './app/views');
    expressApp.set('view engine', 'ejs');

    require('../app/routes/index.server.routes.js')(expressApp);
    require('../app/routes/users.server.routes.js')(expressApp);

    expressApp.use(express.static('./public'));

    return expressApp;
};
