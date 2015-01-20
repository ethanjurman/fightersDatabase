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
      moveObject.page = htmlMove.getElementsByClassName("page")[0].value;
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
            "prereq":move.prereq,
            "page":move.page
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
  target.parentNode.parentNode.parentNode.appendChild(target.parentNode.parentNode.cloneNode(true));
}

function removeElement(e){
  var target = (e.target) ? e.target : e.srcElement;
  target.parentNode.parentNode.parentNode.removeChild(target.parentNode.parentNode);
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
  var preview = target.parentNode.parentNode.parentNode.getElementsByClassName("move-exec")[0];

  var inputField = document.getElementById("input");
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  preview.innerHTML = target.value
    .replace(/<([^>]*)>/g, '<span class="custom-button raised-button">$1</span>')
    .replace(/\[([^\]]*)\]/g, this.expandCommand);
}

function updateMove(e){
  var target = (e.target) ? e.target : e.srcElement;
  var preview = target.parentNode.parentNode.parentNode.getElementsByClassName("exec-preview")[0];
  var source = function(search){
    return target.parentNode.parentNode.parentNode.getElementsByClassName(search)[0].value;
  }
  oldClass = preview.getElementsByClassName("move-element")[0].className;
  // setting move name
  var pad = (source("moveName").match(/\|/g) || []).length * 20 - 10 + "px";
  preview.getElementsByClassName("move-name")[0].innerHTML =
    source("moveName")
      .replace(/[|]*\-\>(.*)/,'<span><img class="after" style="margin-left:'+pad+'" src="images/96_after.png"/></span>$1');
  // setting prereqs
  preview.getElementsByClassName("move-prereqs")[0].innerHTML = "" ||
    source("prereq").replace(/([^&]+)&?/g, '<td class="move-prereq">$1</td>');
  preview.getElementsByClassName("move-exec")[0].colSpan = ([] || source("prereq").match(/([^&]+)&?/g)).length
  // setting move note
  preview.getElementsByClassName("move-note")[0].innerHTML = "" || source("note");
  // setting move type
  var types = {"Move Type":"green"};
  Array.prototype.forEach.call(document.getElementsByClassName("moveTypeDiv"), function(e) {
    types[e.children[0].value] = e.children[1].value;
  });
  preview.getElementsByClassName("move-element")[0].className =
    "move-element " + types[source("moveType")];
  if (oldClass != preview.getElementsByClassName("move-element")[0].className){
    // refresh content if new css class
    updateMove(e);
  }
}

function loadExternalHtml(page, divClass, location, loadValues, loadFunc, loadParams){
  console.log(location)
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
      if (divClass == "move"){ loadMove(e); updateMove(e); }
    }
  }
}
