module.exports = function(app, mongodbConn){

    var MongoClient = require('mongodb').MongoClient;
    // Connection url
    var url = 'mongodb://' + mongodbConn.user + ':' + mongodbConn.pass + '@' + mongodbConn.host + ':' + mongodbConn.port + '/' + mongodbConn.db;
    

    app.post('/register', (req, res) => {
        // Connect using MongoClient
        MongoClient.connect(url, function(err, db) {
            
            var users = db.collection('users');
            let _body = req.body;
            // Check for summoner, insert if not present or update if it is
            users.update({summoner: _body.summoner}, _body, { upsert: true})

            res.send(_body);
        });
    })

    app.get('/summoner/:name', (req, res) => {
        // Connect using MongoClient
        MongoClient.connect(url, function(err, db) {
            
            var users = db.collection('users');
            let _body = req.body;
            // Check for summoner, insert if not present or update if it is
            users.findOne({summoner: req.params.name }, (err, doc) => {
                if(err)
                    return res.send('Failed: ', + err);

                res.send(doc);
            })
        });
    })

    app.get('/register', (req, res) => {
        console.log('you hit');
    })
}