/*
	Server file
	Created by: Ethan Jurman
*/

var express = require('express')
var app = require('express')();
var http = require('http').Server(app);
var cors = require('cors');

app.use(cors()); // I hate cors

// Load the games json (has all the game names and groups)
app.get("/games", function(req, res){
  res.sendFile(__dirname + '/games.json');
});

// Load specific game from games folder
app.get("/games/:game", function(req, res) {
  res.sendFile(__dirname + '/games/' + req.params.game + '.json');
});

// Serve up them files!
http.listen(9000, function () {
  console.log('Up and running');
});

module.export = app;
