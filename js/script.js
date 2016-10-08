//DOM variables
var body = document.querySelector('body');
var menu = body.querySelector('.menu');
var board = body.querySelector('.board');
//COUNTERS variables
var howManyBoxes;

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
//"MAIN"
var base = 100;
howManyBoxes = 0;
var difFS = 2;
var maxFont = 40;
var minFont = 8;

//GLOBAL functions (max font, min font)
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
    this.querySelector('.bar').addEventListener('mousedown', mouseDownBox);
    //events for li are in addLi
}

//EVENTS functions (menu)
function addBox () {
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
function editText () {
  if (!this.classList.contains('edit')) {
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
var actualLine;
function positionLine (e) {
  actualLine.style.top = e.clientY + 'px';
}
function mouseDownLine () {
  actualLine = this;
  this.removeEventListener('mousedown', mouseDownLine);
  this.classList.add('drag');
  console.log('mouseDown');
  document.addEventListener('mousemove', positionLine);
  document.addEventListener('mouseup', mouseUpLine);
}
function mouseUpLine () {
  this.removeEventListener('mousemove', positionLine);
  this.removeEventListener('mouseup', mouseUpLine);
  actualLine.classList.remove('drag');
  actualLine.addEventListener('mousedown', mouseDownLine);
}
var actualBox;
var offsetX, offsetY;
function positionBox (e) {
  actualBox.style.left = e.clientX - offsetX + 'px';
  actualBox.style.top = e.clientY - offsetY + 'px';
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
