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
      moveObject.type = htmlMove.getElementsByClassName("moveType")[0].value
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

function loadJSON() {
  var gameJSON = JSON.parse(document.getElementById("json-textarea").value);
  document.getElementById("game").value = gameJSON["game_name"];
  for (i in gameJSON["move_types"]){
    addMoveType({"moveTypeOption":i, "moveColor":gameJSON["move_types"][i]});
  }
  for (i in gameJSON["characters"]){
    var cJSON = gameJSON["characters"][i];
    addCharacter(
      {"nameInput":cJSON.name},
      function(cJSON){
        for (m in cJSON.moves){
          var move = cJSON.moves[m];
          // parentHTML provided by method that calls this function
          addMove(cJSON.parentHTML.getElementsByClassName("moveArea")[0], {
            "moveName":move.name,
            "moveType":move.type,
            "exec":move.exec,
            "note":move.note,
            "prereq":move.prereq
          });
        }
    }, cJSON);
  }
}

function addMoveType(loadValues, loadFunc, loadParams) {
  loadExternalHtml(
    "htmlTemplates/moveType.html",
    "moveTypeDiv",
    document.getElementById("moveTypes"),
    loadValues,
    loadFunc,
    loadParams
  );
}

function addCharacter(loadValues, loadFunc, loadParams) {
  loadExternalHtml(
    "htmlTemplates/character.html",
    "character",
    document.getElementById("characters"),
    loadValues,
    loadFunc,
    loadParams
  );
}

function addMove(parent, loadValues, loadFunc, loadParams) {
  loadExternalHtml(
    "htmlTemplates/move.html",
    "move",
    parent,
    loadValues,
    loadFunc,
    loadParams
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

function loadMove(e){
  var target = (e.target) ? e.target : e.srcElement;
  var preview = target.parentNode.parentNode.getElementsByClassName("exec-preview")[0];

  var inputField = document.getElementById("input");
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  preview.innerHTML = target.value
    .replace(/<([^>]*)>/g, '<span class="custom-button raised-button">$1</span>')
    .replace(/\[([^\]]*)\]/g, this.expandCommand);
}

function loadExternalHtml(page, divClass, location, loadValues, loadFunc, loadParams){
  var xhr = new XMLHttpRequest();
  xhr.open("GET",page,true);
  xhr.send();
  xhr.onreadystatechange = function(){
    if (xhr.readyState==4){
      loaded = document.createElement("div");
      loaded.className = divClass;
      loaded.innerHTML = xhr.responseText;
      for (v in loadValues){
        var target = loaded.getElementsByClassName(v)[0];
        target.setAttribute("value",loadValues[v]);
        Array.prototype.forEach.call(loaded.getElementsByTagName("option"),
          function(option){
            if (option.value == loadValues[v]){
              option.setAttribute("selected","selected");
            }
          });
        if (target.tagName === "SELECT" && v === "moveType"){
          op = target.getElementsByTagName("option")[0];
          op.setAttribute("value",loadValues[v]);
          op.innerHTML = loadValues[v];
        }
        // this is for characters, since moves need to be loaded with characters
        if (loadFunc !== undefined){
          loadParams.parentHTML = loaded; // +parent information to parameters
          loadFunc(loadParams)
        }
      }
      location.appendChild(loaded);
      var e = {};
      e.target = location.children[location.children.length - 1].getElementsByClassName("exec")[0];
      if (divClass == "move"){ loadMove(e); }
    }
  }
}
