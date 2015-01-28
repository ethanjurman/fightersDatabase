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
  if (match.match(/\[([^\]]*)-([^\]]*)-([^\]]*)\]/g)){
    var matches = /\[([^\]]*)-([^\]]*)-([^\]]*)\]/g.exec(match);
    // svg for making custom button
    var svg = document.createElement("svg");
    svg.setAttribute("width", 48);
    svg.setAttribute("height", 48);
    customButtonSVG(svg, matches[1], matches[2], matches[3]);
    html.appendChild(svg);
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

function customButtonSVG(location, backgroundColor, fontColor, text){
  var cir = document.createElement("circle");
  // <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
  cir.setAttribute("cx",24);
  cir.setAttribute("cy",24);
  cir.setAttribute("r",21);
  cir.setAttribute("stroke","black");
  cir.setAttribute("stroke-width",4);
  cir.setAttribute("fill",backgroundColor);
  location.appendChild(cir);

  setTextAttr = function(e, fontColor, y, fontSize, text){
    if (text.length > 1){
      e.setAttribute("textLength", 32);
      e.setAttribute("lengthAdjust", "spacingAndGlyphs");
    }
    e.setAttribute("class","button-text");
    e.setAttribute("y", 38);
    e.setAttribute("text-anchor","middle");
    e.setAttribute("x", 24);
    e.setAttribute("font-family", "impact");
    e.setAttribute("viewBox", "0 0 48 48");
    e.setAttribute("fill",fontColor);
    e.setAttribute("font-size",fontSize);
    e.setAttribute("y",y);
    e.innerHTML = text
  }

  if (text.length > 2){
    if (~text.indexOf(" ")) {
      // two lines, space to split words
      t = text.split(" ");
      for (var i=0; i < t.length; i++){
        var textNode = document.createElement("text");
        setTextAttr(textNode, fontColor, 22 + (i*14), 14, t[i]);
        location.appendChild(textNode);
      }
    } else {
      // one line
      var textNode = document.createElement("text");
      setTextAttr(textNode, fontColor, 34, 24, text);
      location.appendChild(textNode);
    }
  } else {
    // one line, 2 or less characters
    var textNode = document.createElement("text");
    setTextAttr(textNode, fontColor, 38, 36, text);
    location.appendChild(textNode);
  }
}
