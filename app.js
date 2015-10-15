/*
	Server file
	Created by: Ethan Jurman
*/

var express = require('express');
var router = express.Router();

// Load the games json (has all the game names and groups)
router.get("/games", function(req, res){
  res.sendFile(__dirname + '/games.json');
});

// Load specific game from games folder
router.get("/games/:game", function(req, res) {
  res.sendFile(__dirname + '/games/' + req.params.game + '.json');
});

module.exports = router;
