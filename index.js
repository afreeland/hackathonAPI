const express = require('express')
const app = express()
var bodyParser = require('body-parser')

let mongodbConn = {
  host: 'ds113775.mlab.com',
  port: 13775,
  db: 'hackathon',
  user: 'hackathon',
  pass: 'Tableau2017'
}


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// ## CORS middleware
// 
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

app.get('/', function (req, res) {
  res.send('Hello World!')
})

require('./client.js')(app, mongodbConn);

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})