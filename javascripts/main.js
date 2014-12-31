function generateJSON() {
  var gameJSON = {};
  gameJSON["move_types"] = {};
  gameJSON["characters"] = [];

  var moveTypes = document.querySelectorAll(".moveTypeDiv")
  Array.prototype.forEach.call(moveTypes, function(e) {
    gameJSON["move_types"][e.children[0].value] = e.children[1].value;
  });

  var characters = document.getElementsByClassName("character");
  Array.prototype.forEach.call(characters, function(htmlCharacter){
    var c = {};
    c.name = htmlCharacter.getElementsByClassName("nameInput")[0].value;
    c.moves = [];
    moves = htmlCharacter.getElementsByClassName("moveWrapping");
    Array.prototype.forEach.call(moves, function(htmlMove){
      var moveObject = {};
      moveObject.name = htmlMove.getElementsByClassName("moveName")[0].value;
      moveObject.exec = htmlMove.getElementsByClassName("exec")[0].value;
      moveObject.note = htmlMove.getElementsByClassName("note")[0].value;
      moveObject.prereq = htmlMove.getElementsByClassName("prereq")[0].value;
      c.moves.push(moveObject);
    });
    gameJSON["characters"].push(c);
  });
  return gameJSON;
}

function addCharacter() {
  var character = document.createElement("div");
  character.className = "character";
  var characterName = document.createElement("input");
  characterName.className = "nameInput"
  characterName.placeholder = "Name";
  character.appendChild(characterName);
  var moveAdder = document.createElement("button");
  moveAdder.className = "addMoveButton";
  moveAdder.onclick = function(){
    addMove(character);
  }
  moveAdder.appendChild(document.createTextNode("add move"));
  var parent = document.getElementById("characters");
  parent.appendChild(moveAdder);
  parent.appendChild(character);
  parent.appendChild(document.createElement("hr"));
}

function addMoveType() {
  var mType = document.createElement("div");
  mType.className = "moveTypeDiv"

  var mTypeInput = document.createElement("input");
  mTypeInput.className = "moveTypeOption";
  mTypeInput.placeholder = "Move Type";
  mType.appendChild(mTypeInput);

  var mTypeColor = document.createElement("select");
  mTypeColor.className = "moveColor";
  var colorOptions = mTypeColor.options;
  colorOptions[0] = new Option("green", "green");
  colorOptions[1] = new Option("blue", "blue");
  colorOptions[2] = new Option("red", "red");
  mType.appendChild(mTypeColor)

  var parent = document.getElementById("moveTypes");
  parent.appendChild(mType);
}

function addMove(parent) {
  var move = document.createElement("div");
  move.className = "move";
  var moveName = document.createElement("input");
  moveName.className = "moveName";
  moveName.placeholder = "Move Name";
  var moveTypeSelect = document.createElement("select");
  moveTypeSelect.className = "moveType";
  moveTypeSelect.onfocus = function(){
    var op = moveTypeSelect.options;
    var moveTypes = document.getElementsByClassName("moveTypeOption");
    for(moveType in moveTypes){
      op[parseInt(moveType)] = new Option(moveTypes[moveType].value, moveTypes[moveType].value)
    }
  }
  var mExecInput = document.createElement("input");
  mExecInput.className = "exec";
  mExecInput.placeholder = "Move Execution";
  var moveDescription = document.createElement("div");
  moveDescription.className = "moveDescription";
  var moveNote = document.createElement("input");
  moveNote.className = "note";
  moveNote.placeholder = "move notes (e.g. \"AIR OKAY\")";
  var movePrereq = document.createElement("input");
  movePrereq.className = "prereq";
  movePrereq.placeholder = "prerequisites (seperated by \"&\")";
  moveDescription.appendChild(moveNote);
  moveDescription.appendChild(movePrereq);

  var removeMove = document.createElement("button");
  removeMove.appendChild(document.createTextNode("Delete Move"));
  removeMove.className = "deleteMove";
  removeMove.onclick = function(){
    moveWrapping.remove();
  }

  // wrap all the move elements in one div
  var moveWrapping = document.createElement("div");
  moveWrapping.className = "moveWrapping";

  move.appendChild(moveName);
  move.appendChild(moveTypeSelect);
  move.appendChild(mExecInput);
  moveWrapping.appendChild(removeMove);
  moveWrapping.appendChild(move);
  moveWrapping.appendChild(moveDescription);
  parent.appendChild(moveWrapping);
}
