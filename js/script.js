//GLOBAL VARIABLES and SETTINGS
//boxes
var howManyBoxes = 0;
var maxBoxes = 20;
var base = 100; //new box position
//font-size
var difFS = 2;  //number added/subtracted to base font-size
var maxFont = 40;
var minFont = 8;
//drag&drops
var actualLine;
var actualBox;
var offsetX, offsetY;
var lineAccuracy = 20;  //pulling accuracy (pixels)
var line1Y, line2Y;
baseLinesPosition();
var actualMaxZIndex = 1;

//DOM variables (frequently used)
var body = document.querySelector('body');
var menu = body.querySelector('.menu');
var board = body.querySelector('.board');

//EVENTS adding
//static elements
menu.querySelector('.add-box').addEventListener('click', addBox);
menu.querySelector('.remove-all').addEventListener('click', removeAll);
menu.querySelector('.font-size span:first-child').addEventListener('click', incFont);
menu.querySelector('.font-size span:last-child').addEventListener('click', decFont);
menu.querySelector('.stick-icon-menu').addEventListener('click', pinAll);
menu.querySelector('.help-menu').addEventListener('click', showHelp);
// document.querySelector('.help-close').addEventListener('click', showHelp);

function showHelp () {
  console.log('pomoc');
}

function hideHelp () {
  console.log('close pomoc');
}

var lines = board.querySelectorAll('.line');
for (var i = 0; i < lines.length; i++) {
  lines[i].addEventListener('mousedown', mouseDownLine, false);
}

//GLOBAL functions (max font, min font)
function baseLinesPosition() {
  var line1 = document.querySelector('.line.one');
  var line2 = document.querySelector('.line.two');
  line1Y = parseInt(window.getComputedStyle(line1, null).getPropertyValue('top'));
  line2Y = parseInt(window.getComputedStyle(line2, null).getPropertyValue('top'));
}
function incFont () {
  var html = document.querySelector('html');
  var cs = window.getComputedStyle(html, null).getPropertyValue('font-size');
  if (parseInt(cs) + difFS < maxFont)
    document.querySelector('html').style.fontSize = parseInt(cs) + difFS + 'px';
}
function decFont () {
  var html = document.querySelector('html');
  var cs = window.getComputedStyle(html, null).getPropertyValue('font-size');
  if (parseInt(cs) - difFS > minFont)
    document.querySelector('html').style.fontSize = parseInt(cs) - difFS + 'px';
}
function removeText () {
  this.parentNode.parentNode.removeChild(this.parentNode);
}
function addHigherZIndex () {
  var boxes;
  this.style.zIndex = ++actualMaxZIndex;
  if (actualMaxZIndex > 2147483647) console.log('z-index css value is exceeded');
  if (this.classList.contains('one')) {
    boxes = board.querySelectorAll('.pinned-one');
    for (var i = 0; i < boxes.length; i++)
      boxes[i].style.zIndex = actualMaxZIndex;
  }
  else if (this.classList.contains('two')) {
    boxes = board.querySelectorAll('.pinned-two');
    for (var i = 0; i < boxes.length; i++)
      boxes[i].style.zIndex = actualMaxZIndex;
  }
}
function addEventsNewBox () {
    this.querySelector('.close').addEventListener('click', removeBox);
    this.querySelector('.stick-icon').addEventListener('mouseover', closeHoverOn);
    this.querySelector('.close').addEventListener('mouseover', closeHoverOn);
    this.querySelector('.stick-icon').addEventListener('mouseout', closeHoverOff);
    this.querySelector('.close').addEventListener('mouseout', closeHoverOff);
    this.querySelector('.add').addEventListener('click', addLi);
    this.querySelector('h1').addEventListener('click', editText);
    this.querySelector('h1 + input').addEventListener('blur', updateText);
    this.querySelector('h1 + input').addEventListener('keypress', function(e) {
      if (e.which == 13)
        updateText.call(this);
    });
    this.querySelector('h1 + input').addEventListener('keypress', setInputWidth);
    this.querySelector('.drag-bar').addEventListener('mousedown', mouseDownBox);
    this.querySelector('.stick-icon').addEventListener('click', stickToLine);
    this.addEventListener('mousedown', addHigherZIndex);
    //events for li are in addLi
}

//EVENTS functions (menu)
function addBox () {
  if (howManyBoxes > maxBoxes) return;
  var htmlString = '<div class="bar">'
    + '<div class="stick-icon"><img src="images/pin-icon.png"></div>'
    + '<div class="drag-bar"></div>'
    + '<div class="close"><img src="images/close-icon.png"></div>'
    + '</div>'
    + '<h1>Title</h1><input type="text" value="Title">'
    + '<ul><li class="add"><span>.</span><input type="text"></li></ul>';

  //add new 'add button'
  var divBox = document.createElement('div');
  divBox.classList.add('box');
  divBox.innerHTML = htmlString;
  divBox.style.zIndex = actualMaxZIndex;

  //add all events
  addEventsNewBox.call(divBox);

  divBox.style.left = (base + howManyBoxes * 10) + "px";
  divBox.style.top = (base + howManyBoxes * 10) + "px";

  board.appendChild(divBox);
  howManyBoxes++;

  if (menu.querySelector('.stick-icon-menu').classList.contains('pinned'))
    menu.querySelector('.stick-icon-menu').classList.remove('pinned');

}
function removeAll () { //delete all except .line
  while (board.lastChild) {
    if (board.lastChild.classList.contains('line')) break;
    board.removeChild(board.lastChild);
  }
  howManyBoxes = 0;
}

//EVENTS functions (board)
function closeHoverOn () {
  this.parentNode.parentNode.classList.add('close-hover');
}
function closeHoverOff () {
  this.parentNode.parentNode.classList.remove('close-hover');
}
function removeBox () {
  this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
  howManyBoxes--;
}
function updateText() {
  //update text
  this.previousElementSibling.innerHTML = this.value;
  //remove edit class
  if (this.previousElementSibling.nodeName == "H1") {
    this.previousElementSibling.classList.remove('edit');
    return;
  }
  //if empty remove (not h1)
  if (this.value.length === 0) {
    removeText.call(this);
    return;
  }
  this.parentNode.classList.remove('edit');
}
function setInputWidth () {
  var input;
  if (this.nodeName == "H1")
    input = this.nextSibling;
  else if (this.nodeName == "INPUT")
    input = this;
  else
    input = this.querySelector('input');
  var font = window.getComputedStyle(input, null).getPropertyValue('font-size');
  input.style.width = input.value.length * (Math.ceil(parseInt(font)/3))+ parseInt(font) + 'px';
}
function editText () {
  if (!this.classList.contains('edit')) {
    setInputWidth.call(this);
    this.classList.add('edit');
    var input = this.querySelector('input');
    if (!input) input = this.parentNode.querySelector('input'); //h1 edit
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}
function addLi () {
  //make actual li from li.add
  this.classList.remove('add');
  this.removeEventListener('click', addLi);
  this.addEventListener('click', editText);
  var out = new Event('out');
  this.querySelector('input').addEventListener('keypress', function(e) {
    if (e.which == 13)
      updateText.call(this);
  });
  this.querySelector('input').addEventListener('blur', updateText);
  this.querySelector('input').addEventListener('keypress', setInputWidth);
  //add new 'add button'
  var li = document.createElement('li');
  var span = document.createElement('span');
  var input = document.createElement('input');
  span.innerHTML = '.';
  li.classList.add('add');
  li.appendChild(span);
  input.type = 'text';
  li.appendChild(input);
  this.parentNode.appendChild(li);
  li.addEventListener('click', addLi);
  //go to edition
  editText.call(this);
}
function positionLine (e) {
  actualLine.style.top = e.clientY + 'px';
  var pinned;
  if (actualLine.classList.contains('one')) {
    line1Y = e.clientY;
    pinned = board.querySelectorAll('.pinned-one');
  }
  else {
    line2Y = e.clientY;
    pinned = board.querySelectorAll('.pinned-two');
  }
  if (pinned.length > 0) {
    for (var i = 0; i < pinned.length; i++)
      pinned[i].style.top = e.clientY + 'px';
  }
}
function mouseDownLine () {
  actualLine = this;
  this.removeEventListener('mousedown', mouseDownLine);
  this.classList.add('drag');
  addHigherZIndex.call(this);
  document.addEventListener('mousemove', positionLine);
  document.addEventListener('mouseup', mouseUpLine);
}
function mouseUpLine () {
  this.removeEventListener('mousemove', positionLine);
  this.removeEventListener('mouseup', mouseUpLine);
  actualLine.style.zIndex = 0;
  actualLine.classList.remove('drag');
  actualLine.addEventListener('mousedown', mouseDownLine);
}
function positionBox (e) {
  //lines pulling
  if ((e.clientY - offsetY) <= (line1Y + lineAccuracy) && (e.clientY - offsetY) >= (line1Y - lineAccuracy)) {
    actualBox.style.top = line1Y + 'px';
    actualBox.classList.add('pinned-one');
  }
  else if ((e.clientY - offsetY) <= (line2Y + lineAccuracy) && (e.clientY - offsetY) >= (line2Y - lineAccuracy)) {
    actualBox.style.top = line2Y + 'px';
    actualBox.classList.add('pinned-two');
  }
  else {  //normal dragging
    actualBox.style.left = e.clientX - offsetX + 'px';
    actualBox.style.top = e.clientY - offsetY + 'px';
    if (actualBox.classList.contains('pinned-one')) {
      actualBox.classList.remove('pinned-one');
      actualBox.classList.remove('animate-top');
      menu.querySelector('.stick-icon-menu').classList.remove('pinned');
    }
    if (actualBox.classList.contains('pinned-two')) {
      actualBox.classList.remove('pinned-two');
      actualBox.classList.remove('animate-top');
      menu.querySelector('.stick-icon-menu').classList.remove('pinned');
    }
  }
}
function mouseDownBox (e) {
  actualBox = this.parentNode.parentNode;

  var left = window.getComputedStyle(actualBox, null).getPropertyValue('left');
  var top = window.getComputedStyle(actualBox, null).getPropertyValue('top');
  offsetX = e.clientX - parseInt(left);
  offsetY = e.clientY - parseInt(top);

  this.removeEventListener('mousedown', mouseDownBox);
  actualBox.classList.add('drag');
  document.addEventListener('mousemove', positionBox);
  document.addEventListener('mouseup', mouseUpBox);
}
function mouseUpBox () {
  this.removeEventListener('mousemove', positionBox);
  this.removeEventListener('mouseup', mouseUpBox);
  actualBox.classList.remove('drag');
  actualBox.querySelector('.drag-bar').addEventListener('mousedown', mouseDownBox);
}
function stickToLine () {
  var box = (this.classList.contains('box')) ? this : this.parentNode.parentNode;
  var boxY = parseInt(window.getComputedStyle(box, null).getPropertyValue('top'));
  if (box.classList.contains('pinned-one') || box.classList.contains('pinned-two')) { //unpin
    box.style.top = boxY + lineAccuracy + 1 + 'px';
    if (box.classList.contains('pinned-one')) box.classList.remove('pinned-one');
    else box.classList.remove('pinned-two');
    box.classList.remove('animate-top');
    menu.querySelector('.stick-icon-menu').classList.remove('pinned');
    return;
  };
  //pin
  var target, addClass;
  //box up, box down or box between lines
  if (boxY < line1Y && boxY < line2Y) {
    target = (line1Y <= line2Y) ? line1Y : line2Y;
    addClass = (line1Y <= line2Y) ? 'pinned-one' : 'pinned-two';
  }
  else if (boxY > line1Y && boxY > line2Y) {
    target = (line1Y >= line2Y) ? line1Y : line2Y;
    addClass = (line1Y >= line2Y) ? 'pinned-one' : 'pinned-two';
  }
  else {
    target = (line1Y <= line2Y) ? line1Y : line2Y;
    addClass = (line1Y <= line2Y) ? 'pinned-one' : 'pinned-two';
  }
  box.classList.add('animate-top');
  setTimeout(function () {
    box.classList.remove('animate-top');
  }, 1000);
  box.classList.add(addClass);
  box.style.top = target + 'px';
}
function pinAll () {
  var boxes = board.querySelectorAll('.box');
  if (this.classList.contains('pinned')) {  //unpinned all
    for (var i = 0; i < boxes.length; i++)
      stickToLine.call(boxes[i]);
    this.classList.remove('pinned');
  }
  else {  //pin unpinned
    for (var i = 0; i < boxes.length; i++) {
      if (!(boxes[i].classList.contains('pinned-one') || boxes[i].classList.contains('pinned-two')))
        stickToLine.call(boxes[i]);
    }
    this.classList.add('pinned');
  }
}
