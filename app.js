var config = require('./config/config'),
    mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    db = mongoose(),
    app = express();

app.listen(config.port);

module.exports = app;

console.log('Server running at http://localhost:' + config.port);
