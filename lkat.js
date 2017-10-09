const axios = require('axios');
var MongoClient = require('mongodb').MongoClient;
const async = require('async');

function getSummoner(name, callback) {
    axios.get('https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/Siltharious?api_key=RGAPI-7ae92fa3-165e-4a9a-96fa-1f7a657c3e0d')
        .then(response => {
            callback(null, response.data);
    })
    .catch(err => {
        callback(err);
    })
}

function getMatches(accountId, callback) {
    //return new Promise((resolve, reject) => {
        axios.get(`https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}?api_key=RGAPI-7ae92fa3-165e-4a9a-96fa-1f7a657c3e0d`)
            .then(response => {
            //resolve(response.data);
                callback(null, response.data.matches);
            })
    .catch(err => {
            callback(err);
    })
}


module.exports = function(app, mongodbConn){

    // Connection url
    var url = 'mongodb://' + mongodbConn.user + ':' + mongodbConn.pass + '@' + mongodbConn.host + ':' + mongodbConn.port + '/' + mongodbConn.db;


    app.get('/get_and_populate_matches', (req, res) => {
        getSummoner(req.query.name, (err, summoner) => {
            if (err) throw err;

            getMatches(summoner.accountId, (err, matches) => {
                if (err) throw err;

                // Write matches to database
                //res.send(matches);
                MongoClient.connect(url, function(err, db) {

                    var matchesCollection = db.collection('matches');
                    var destCollection = db.collection('match-detail');
                    matchesCollection.insert(matches, (err, result) => {
                        if (err) throw err;

                        console.log('Done inserting matches');

                        // Insert match details
                        var i = 0;
                        var total = 20;
                        var workArray = [];
                        var matchDetails = [];
                        matches.forEach(match => {
                            if (i < total) {
                                workArray.push(function (callback) {
                                    axios.get(`https://na1.api.riotgames.com/lol/match/v3/matches/${match.gameId}?api_key=RGAPI-7ae92fa3-165e-4a9a-96fa-1f7a657c3e0d`)
                                        .then(response => {
                                            matchDetails.push(response.data);
                                            callback(null);
                                        })
                                        .catch(err => {
                                            callback(err);
                                        })
                                });
                                i++;
                            }
                        });

                        console.log('pushed everything into work array', workArray.length);

                        async.parallelLimit(workArray, 5, function (err, results) {
                            // Gotten all of match details
                            if (err) throw err;
                            console.log('got match details', matchDetails.length);
                            // console.log('results ha', results);
                            destCollection.insert(matchDetails, (err, results) => {
                                if (err) throw err;
                                console.log('inserted match details!');
                                db.close();
                                res.send({done: true});
                            })

                        })




                    })

                })

            })

        })
       //res.send(true);
    });

};