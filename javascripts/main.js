function generateJSON() {
  var gameJSON = {};
  gameJSON["game_name"] = document.getElementById("game").value;
  gameJSON["move_types"] = {};
  gameJSON["characters"] = [];
  gameJSON["pages"] = Array.prototype.map.call(
    document.getElementsByClassName("movePageOption"),
    function(e){return e.value});

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
      moveObject.page = getPagesForMove(htmlMove);
      c.moves.push(moveObject);
    });
    gameJSON["characters"].push(c);
  });
  document.getElementById("json-textarea").value = JSON.stringify(gameJSON);
  return gameJSON;
}

function getPagesForMove(move){
  var pages = Array.prototype.map.call( move.getElementsByClassName("movePage"),
  function(e){
    return e.value +";";
  });
  return pages.join("");
}

function loadJSON() {
  var gameJSON = JSON.parse(document.getElementById("json-textarea").value);
  document.getElementById("game").value = gameJSON["game_name"];
  for (i in gameJSON["move_types"]){
    addMoveType({"moveTypeOption":i, "moveColor":gameJSON["move_types"][i]});
  }
  for (i in gameJSON["pages"]){
    addPage({"movePageOption":gameJSON["pages"][i]});
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
            "movePage":move.page
          });
        }
    }, cJSON);
  }
}

// adding more than one page per move
function addPageForMove(e) {
  var target = (e.target) ? e.target : e.srcElement;
  while (!target.classList.contains('loaded-element')){
    target = target.parentNode;
  }
  target = target.getElementsByClassName("move_info")[0];
  var pageSelect = target.getElementsByClassName("movePage")[0];
  var span = document.createElement("span");
  var page = pageSelect.cloneNode(true);
  var deletePage = document.createElement("button");
  deletePage.innerHTML = "-";
  deletePage.onclick = function() {this.parentNode.parentNode.removeChild(this.parentNode);}
  page.style.width = "90%";
  span.appendChild(page);
  span.appendChild(deletePage);
  target.appendChild(span);
}

// loadValues, loadFunc and loadParams are optional.
function addPage(loadValues, loadFunc, loadParams) {
  loadExternalHtml(
    "htmlTemplates/page.html",
    "page-div loaded-element",
    document.getElementById("pages"),
    loadValues,
    loadFunc,
    loadParams
  );
}

function addMoveType(loadValues, loadFunc, loadParams) {
  loadExternalHtml(
    "htmlTemplates/moveType.html",
    "moveTypeDiv loaded-element",
    document.getElementById("moveTypes"),
    loadValues,
    loadFunc,
    loadParams
  );
}

function addCharacter(loadValues, loadFunc, loadParams) {
  loadExternalHtml(
    "htmlTemplates/character.html",
    "character loaded-element",
    document.getElementById("characters"),
    loadValues,
    loadFunc,
    loadParams
  );
}

function addMove(parent, loadValues, loadFunc, loadParams) {
  loadExternalHtml(
    "htmlTemplates/move.html",
    "move loaded-element",
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
  while (!target.classList.contains('loaded-element')){
    target = target.parentNode;
  }
  target.parentNode.appendChild(target.cloneNode(true));
}

function removeElement(e){
  var target = (e.target) ? e.target : e.srcElement;
  while (!target.classList.contains('loaded-element')){
    target = target.parentNode;
  }
  target.parentNode.removeChild(target);
}

function updateMoveSelection(e, option){
  var target = (e.target) ? e.target : e.srcElement;
  var op = target.options;
  // clear out old options
  while (op[0] != undefined){
    op[0] = undefined;
  }
  var moveTypes = document.getElementsByClassName(option);
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
  while (!target.classList.contains('loaded-element')){
    target = target.parentNode;
  }
  var preview = target.getElementsByClassName("exec-preview")[0];
  var source = function(search){
    return target.getElementsByClassName(search)[0].value;
  }
  var oldClass = preview.getElementsByClassName("move-element")[0].className;
  // setting move name
  var pad = (source("moveName").match(/\\t/g) || []).length * 20 - 10 + "px";
  preview.getElementsByClassName("move-name")[0].innerHTML =
    source("moveName")
      .replace(/[\\t]*\\\-\>(.*)/,'<span><img class="after" style="margin-left:'+pad+'" src="images/96_after.png"/></span>$1');
  // setting prereqs
  preview.getElementsByClassName("move-prereqs")[0].innerHTML =
    source("prereq").replace(/([^&]+)&?/g, '<td class="move-prereq">$1</td>') || "";
  preview.getElementsByClassName("move-exec")[0].colSpan = (source("prereq").match(/([^&]+)&?/g) || []).length
  // setting move note
  preview.getElementsByClassName("move-note")[0].innerHTML = source("note") || "";
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

function selectMoveOptions(e, selector){
  var target = (e.target) ? e.target : e.srcElement;
  var c = target.classList.contains("movePageOption") ? "movePage" : "moveType";
  test = function(e){
    return e.getElementsByClassName(c)[0].value == target.value;
  }
  moves = Array.prototype.filter.call(document.getElementsByClassName("move"),test);
}

function updateMoveOptions(e, value){
  var target = (e.target) ? e.target : e.srcElement;
  //transforming spaces to dashs if moveType
  if (target.classList.contains("moveTypeOption")){
    target.value = target.value.replace(/\s/,"-").toLowerCase();
  }

  // updating the move graphics
  var c = target.classList.contains("movePageOption") ? "movePage" : "moveType";
  update = function(e){
    var index = e.getElementsByClassName(c)[0].selectedIndex;
    var option = e.getElementsByClassName(c)[0].options[index];
    if (option != undefined){
      option.value = value;
      option.innerHTML = value;
    }
  }
  Array.prototype.map.call(moves,update);
}

function loadExternalHtml(htmlPage, divClass, location, loadValues, loadFunc, loadParams){
  var xhr = new XMLHttpRequest();
  xhr.open("GET",htmlPage,true);
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
        if (target.tagName === "SELECT" && v === "movePage"){
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
      if (divClass == "move loaded-element"){ loadMove(e); updateMove(e); }
    }
  }
}
