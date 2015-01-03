function generateJSON() {
  var gameJSON = {};
  gameJSON["game_name"] = document.getElementById("game").value;
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
    moves = htmlCharacter.getElementsByClassName("move");
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
  document.getElementById("json-textarea").value = JSON.stringify(gameJSON);
  return gameJSON;
}
/*
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

  var removeMoveType = document.createElement("button");
  removeMoveType.innerHTML = "Delete";
  removeMoveType.setAttribute("onclick","removeElement(event)");
  mType.appendChild(removeMoveType);

  var parent = document.getElementById("moveTypes");
  parent.appendChild(mType);
}

function addCharacter() {
  var character = document.createElement("div");
  character.className = "character";
  var characterName = document.createElement("input");
  characterName.className = "nameInput"
  characterName.placeholder = "Name";

  var moveSection = document.createElement("div");
  moveSection.className = "moveArea";
  var moveAdder = document.createElement("button");
  moveAdder.innerHTML = "Add Move";
  moveAdder.setAttribute("onclick","moveAdder(event)");
  var characterDuplicate = document.createElement("button");
  characterDuplicate.innerHTML = "Duplicate Character";
  characterDuplicate.setAttribute("onclick","characterDuplicate(event)");
  var characterDelete = document.createElement("button");
  characterDelete.innerHTML = "Delete Character";
  characterDelete.setAttribute("onclick","removeElement(event)");

  var parent = document.getElementById("characters");

  character.appendChild(characterName);
  character.appendChild(moveAdder);
  character.appendChild(characterDuplicate);
  character.appendChild(characterDelete);
  character.appendChild(moveSection);
  character.appendChild(document.createElement("hr"));
  parent.appendChild(character);
}

function addMove(parent) {
  var move = document.createElement("div");
  move.className = "moveMain";
  var moveName = document.createElement("input");
  moveName.className = "moveName";
  moveName.placeholder = "Move Name";
  var moveTypeSelect = document.createElement("select");
  moveTypeSelect.className = "moveType";
  moveTypeSelect.setAttribute("onfocus", "updateMoveSelection(event)");
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
  removeMove.innerHTML = "Delete<br>Move";
  removeMove.className = "moveButton";
  removeMove.setAttribute("onclick","removeElement(event)");

  var duplicateMove = document.createElement("button");
  duplicateMove.innerHTML = "Duplicate<br>Move";
  duplicateMove.className = "moveButton";
  duplicateMove.setAttribute("onclick","moveDuplicate(event)");

  // wrap all the move elements in one div
  var moveWrapping = document.createElement("div");
  moveWrapping.className = "move";

  move.appendChild(moveName);
  move.appendChild(moveTypeSelect);
  move.appendChild(mExecInput);
  moveWrapping.appendChild(removeMove);
  moveWrapping.appendChild(duplicateMove);
  moveWrapping.appendChild(move);
  moveWrapping.appendChild(moveDescription);
  parent.appendChild(moveWrapping);
}
*/

function addMoveType() {
  loadExternalHtml(
    "htmlTemplates/moveType.html",
    "moveTypeDiv",
    document.getElementById("moveTypes")
  );
}

function addCharacter() {
  loadExternalHtml(
    "htmlTemplates/character.html",
    "character",
    document.getElementById("characters")
  );
}

function addMove(parent) {
  loadExternalHtml(
    "htmlTemplates/move.html",
    "move",
    parent
  );
}

function moveAdder(e){
  var target = (e.target) ? e.target : e.srcElement;
  addMove(target.parentNode.getElementsByClassName("moveArea")[0]);
}

function characterDuplicate(e){
  var target = (e.target) ? e.target : e.srcElement;
  document.getElementById("characters")
    .appendChild(target.parentNode.cloneNode(true));
}

function moveDuplicate(e){
  var target = (e.target) ? e.target : e.srcElement;
  target.parentNode.parentNode.appendChild(target.parentNode.cloneNode(true));
}

function removeElement(e){
  var target = (e.target) ? e.target : e.srcElement;
  target.parentNode.parentNode.removeChild(target.parentNode);
}

function updateMoveSelection(e){
  var target = (e.target) ? e.target : e.srcElement;
  var op = target.options;
  var moveTypes = document.getElementsByClassName("moveTypeOption");
  for(moveType in moveTypes){
    op[parseInt(moveType)] = new Option(moveTypes[moveType].value, moveTypes[moveType].value)
  }
}

function loadExternalHtml(page, divClass, location){
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET",page,true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function(){
    loaded = document.createElement("div");
    loaded.className = divClass;
    loaded.innerHTML = xmlhttp.responseText;
    location.appendChild(loaded);
  }
}
