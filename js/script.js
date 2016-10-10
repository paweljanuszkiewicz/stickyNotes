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
    this.querySelector('.bar').addEventListener('mousedown', mouseDownBox);
    //events for li are in addLi
}

//EVENTS functions (menu)
function addBox () {
  if (howManyBoxes > maxBoxes) return;
  var htmlString = '<div class="bar">'
    + '<div class="stick-icon"><img src="images/pin-icon.png"></div>'
    + '<div class="close"><img src="images/close-icon.png"></div>'
    + '<div class="clear"></div>'
    + '</div>'
    + '<h1>Title</h1><input type="text" value="Title">'
    + '<ul><li class="add"><span>.</span><input type="text"></li></ul>';

  //add new 'add button'
  var divBox = document.createElement('div');
  divBox.classList.add('box');
  divBox.innerHTML = htmlString;

  //add all events
  addEventsNewBox.call(divBox);

  divBox.style.left = (base + howManyBoxes * 10) + "px";
  divBox.style.top = (base + howManyBoxes * 10) + "px";

  board.appendChild(divBox);
  howManyBoxes++;

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
  document.addEventListener('mousemove', positionLine);
  document.addEventListener('mouseup', mouseUpLine);
}
function mouseUpLine () {
  this.removeEventListener('mousemove', positionLine);
  this.removeEventListener('mouseup', mouseUpLine);
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
    if (actualBox.classList.contains('pinned-one')) actualBox.classList.remove('pinned-one');
    if (actualBox.classList.contains('pinned-two')) actualBox.classList.remove('pinned-two');
  }
}
function mouseDownBox (e) {
  actualBox = this.parentNode;

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
  actualBox.querySelector('.bar').addEventListener('mousedown', mouseDownBox);
}
