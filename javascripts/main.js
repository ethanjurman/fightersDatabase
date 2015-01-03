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
  if (xmlhttp.readyState==4 && xmlhttp.status==200){
    xmlhttp.onreadystatechange = function(){
      loaded = document.createElement("div");
      loaded.className = divClass;
      loaded.innerHTML = xmlhttp.responseText;
      location.appendChild(loaded);
    }
  }
}
