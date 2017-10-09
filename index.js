const express = require('express')
const app = express()

let mongodbConn = {
  host: 'ds113775.mlab.com',
  port: 13775,
  db: 'hackathon',
  user: 'hackathon',
  pass: 'Tableau2017'
}


app.get('/', function (req, res) {
  res.send('Hello World!')
})

require('./client.js')(app);

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})