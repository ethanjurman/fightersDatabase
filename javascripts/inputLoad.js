function makeImage(path, classes, location){
  var img = document.createElement("img");
  img.setAttribute("src",path);
  img.setAttribute("class",classes || "");

  if (location !== undefined){
    location.appendChild(img);
  } else {
    return img;
  }
}

function makeButton(button, classes, location){
  return mergeButtons([button],classes,"",location);
}

function mergeButtons(buttons, classes, command, location){
  // if classes isn't an array, make it one
  classes = classes || "";
  if (!Array.isArray(classes)){
    classes = Array.apply(null, new Array(buttons.length))
      .map(String.prototype.valueOf,classes);
  }

  var span = document.createElement("span");
  var first = makeImage("images/96_blank.png");
  first.className = classes[0];
  var double = false; // because there are sometimes images 2x the width
  for(b in buttons){
    var i = makeImage(buttons[b]);
    double = double || (i.width > first.width);
    i.className = classes[b];
    i.setAttribute("command", command || "");
    i.setAttribute("style","position:absolute;z-index:1;")
    span.appendChild(i);
  }
  span.appendChild(first);
  if (double) {span.appendChild(first.cloneNode())}
  if (location !== undefined){
    location.appendChild(span);
  } else {
    return span;
  }
}

function holdHover(hold){
  var holds = document.getElementsByClassName("hold");
  Array.prototype.forEach.call(holds, function(h){
    h.style.display = hold ? "initial" : "none";
  });
}

function holdHoverToggle(e){
  holdHover(
    document.getElementsByClassName("hold")[0].style.display == "none"
  );

  // this is just to toggle the class
  var target = (e.target) ? e.target : e.srcElement;
  var clicked = target.className == "clicked";
  target.setAttribute("class", clicked ? "clickable" : "clicked");
}

function filterButtons(e, filter){
  var target = (e.target) ? e.target : e.srcElement;
  var clicked = false;
  Array.prototype.forEach.call(target.classList,
    function(c){
      clicked = c === "clicked" || clicked;
    });
  Array.prototype.forEach.call(document.getElementsByClassName(filter),
    function(node){
      node.style.display = clicked ? "none" : "";
    });
  target.setAttribute("class", "h48 " + (clicked ? "clickable" : "clicked"));
}

function getButton(e){
  var target = (e.target) ? e.target : e.srcElement;
  command = document.getElementById("input");
  command.value = command.value + "[" + getCommand(target) +"]";
  onChange();
}

function getCommand(e){
  // if this element doesn't have a command, it's child should
  return e.getAttribute("command") || getCommand(e.children[0]);
}

function generateButtons(){
  area = document.getElementById("buttons");
  text =
    ["A","B","C","D","E","F","G","H","I","J","K","L",
    "M","N","O","P","Q","R","S","T","U","V","W","X",
    "Y","Z","RT","RB","LT","LB","START","SELECT","COIN",
    "RUN","JUMP","FIRE","R1","R2","L1","L2","HOME","PLUS",
    "MINUS","HS","HP","MP","LP","HK","MK","LK","BACK",
    "R-STICK","L-STICK"];
  colors =
    ["white","gray","black","red","yellow",
    "orange","green","teal","teal","purple","blue"];
  fonts = ["black","white"];
  buttons = {"white":[],"black":[]}
  for (c in colors){
    for (f in fonts){
      for (t in text){
        button = mergeButtons([
          "images/96_button_" + colors[c] + ".png",
          "images/96_" + fonts[f] + "_" + text[t] + ".png"],
          "h48",
          colors[c]+"-"+fonts[f][0]+"-"+text[t]);
        button.className = colors[c];
        buttons[fonts[f]].push(button);
      }
    }
  }
  for (f in fonts){
    var count = 0;
    var row = document.createElement("tr");
    row.className = "text_" + fonts[f];
    for (button in buttons[fonts[f]]){
      if (button % 11 == 0 && button != 0){
        area.appendChild(row);
        row = document.createElement("tr");
        row.className = "text_" + fonts[f];
      }
      row.appendChild(buttons[fonts[f]][button]);
    }
  }
}

function onScroll(){
  var colorSel = document.getElementById("colors");
  var scrollValue = document.body.scrollTop;
  if (scrollValue > colorSel.offsetTop){
    colorSel.style.position = "fixed";
  } else {
    colorSel.style.position = "initial";
  }
}

function onChange(){
  var inputField = document.getElementById("input");
  var preview = document.getElementById("preview");
  // empty out content
  while (preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }
  preview.innerHTML = inputField.value
    .replace(/<([^>]*)>/g, '<span class="custom-button raised-button">$1</span>')
    .replace(/\[([^\]]*)\]/g, this.expandCommand);
}

function expandCommand(match){
  var html = document.createElement("div");
  // returns a string of a img tag holding the correct image from the input command
  if (match.match(/(\[[012346789]\])/g)){
    html.appendChild(makeButton("images/96_input_yellow_arrow.png","h48 rotate" + match[1]));
  }
  if (match.match(/(\[h[012346789]\])/g)){
    html.appendChild(mergeButtons(["images/96_input_yellow_arrow.png","images/96_hold.png"],["h48 rotate" + match[2],"h48"]));
  }
  if (match.match(/\[(white|gray|black|red|yellow|orange|green|teal|purple|blue)-(w|b)-([^\]]*)\]/g)){
    var matches = /\[(white|gray|black|red|yellow|orange|green|teal|purple|blue)-(w|b)-([^\]]*)\]/g.exec(match);
    html.appendChild(mergeButtons([
      "images/96_button_" + matches[1] + ".png",
      "images/96_" + (matches[2] == "w" ? "white" : "black") + "_" + matches[3] + ".png"],"h48"));
  }
  switch(match){
    case "[lk]":
      html.appendChild(mergeButtons(["images/96_kick_light.png"],"h48"));
      break;
    case "[mk]":
      html.appendChild(mergeButtons(["images/96_kick_medium.png"],"h48"));
      break;
    case "[hk]":
      html.appendChild(mergeButtons(["images/96_kick_heavy.png"],"h48"));
      break;
    case "[lp]":
      html.appendChild(mergeButtons(["images/96_punch_light.png"],"h48"));
      break;
    case "[mp]":
      html.appendChild(mergeButtons(["images/96_punch_medium.png"],"h48"));
      break;
    case "[hp]":
      html.appendChild(mergeButtons(["images/96_punch_heavy.png"],"h48"));
      break;
    case "[k]":
      html.appendChild(makeButton("images/96_Kick.png","h48"));
      break;
    case "[p]":
      html.appendChild(makeButton("images/96_Punch.png","h48"));
      break;
    case "[2k]":
      html.appendChild(makeButton("images/96_2xKick.png","h48"));
      break;
    case "[2p]":
      html.appendChild(makeButton("images/96_2xPunch.png","h48"));
      break;
    case "[3k]":
      html.appendChild(makeButton("images/96_3xKick.png","h48"));
      break;
    case "[3p]":
      html.appendChild(makeButton("images/96_3xPunch.png","h48"));
      break;
    case "[214]":
      html.appendChild(makeButton("images/96_input_yellow_qcb.png","h48"));
      break;
    case "[63214]":
      html.appendChild(makeButton("images/96_input_yellow_hcb.png","h48"));
      break;
    case "[421]":
      html.appendChild(makeButton("images/96_input_yellow_rdp.png","h48"));
      break;
    case "[236]":
      html.appendChild(makeButton("images/96_input_yellow_qcf.png","h48"));
      break;
    case "[41236]":
      html.appendChild(makeButton("images/96_input_yellow_hcf.png","h48"));
      break;
    case "[623]":
      html.appendChild(makeButton("images/96_input_yellow_dp.png","h48"));
      break;
    case "[63214789]":
      html.appendChild(makeButton("images/96_input_yellow_fcf.png","h48"));
      break;
    case "[41236987]":
      html.appendChild(makeButton("images/96_input_yellow_fcb.png","h48"));
      break;
  }
  return html.innerHTML;
}
