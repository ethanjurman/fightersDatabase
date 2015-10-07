/*
	Server file
	Created by: Ethan Jurman
*/

var express = require('express')
var app = require('express')();
var fs = require('fs');
var http = require('http').Server(app);

app.use(express.static(__dirname + '/games/'));

var games = fs.readFileSync('games.json');

app.get("/games", function(req, res){
  res.send(JSON.parse(games));
});
//
// app.get("/get/:position", function(req, res){
//   if (board[req.params.position] == undefined) {
//     board[req.params.position] = 0
//   }
//   res.send("" + board[req.params.position]);
// });
//
// app.get("/get", function(req, res){
//   res.send("" + JSON.stringify(board));
// });

http.listen(3000, function () {
  console.log('Example app listening');
});
