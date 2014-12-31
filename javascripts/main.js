function generateJSON() {
  var gameJSON = {};
  gameJSON["move_types"] = {};
  gameJSON["characters"] = [];

  var moveTypes = document.querySelectorAll(".moveTypeDiv")
  Array.prototype.forEach.call(moveTypes, function(e) {
    gameJSON["move_types"][e.children[0].value] = e.children[1].value;
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
  parent.appendChild(character);
  parent.appendChild(moveAdder);
  parent.appendChild(document.createElement("hr"));
}

function addMoveType() {
  var mType = document.createElement("div");
  mType.className = "moveTypeDiv"

  var mTypeInput = document.createElement("input");
  mTypeInput.className = "moveType";
  mTypeInput.placeholder = "Move Type";
  mType.appendChild(mTypeInput);

  var mTypeColor = document.createElement("select");
  mTypeColor.className = "moveColor";
  var colorOptions = mTypeColor.options;
  colorOptions[0] = new Option("Placeholder 1", "Placeholder 1");
  colorOptions[1] = new Option("Placeholder 2", "Placeholder 2");
  colorOptions[2] = new Option("Placeholder 3", "Placeholder 3");
  mType.appendChild(mTypeColor)

  var parent = document.getElementById("moveTypes");
  parent.appendChild(mType);
}

function addMove(parent) {
  var move = document.createElement("div");
  move.className = "move";
  var moveName = document.createElement("input");
  moveName.placeholder = "Move Name"
  var moveTypeSelect = document.createElement("select");
  moveTypeSelect.onfocus = function(){
    var op = moveTypeSelect.options;
    var moveTypes = document.getElementsByClassName("moveType");
    for(moveType in moveTypes){
      op[parseInt(moveType)] = new Option(moveTypes[moveType].value, moveTypes[moveType].value)
    }
  }
  var moveExec = document.createElement("div");
  moveExec.className = "moveExec";
  var mExecInput = document.createElement("input");
  mExecInput.className = "exec";
  mExecInput.placeholder = "Move Execution";
  var moveDescription = document.createElement("div");
  moveDescription.className = "moveDescription";
  var moveNote = document.createElement("input");
  moveNote.placeholder = "move notes (e.g. \"AIR OKAY\")";
  var movePrereq = document.createElement("input");
  movePrereq.placeholder = "prerequisites (seperated by \"&\")";
  moveDescription.appendChild(moveNote);
  moveDescription.appendChild(movePrereq);

  move.appendChild(moveName);
  move.appendChild(moveTypeSelect);
  move.appendChild(mExecInput);
  parent.appendChild(move);
  parent.appendChild(moveDescription);
}
