//DOM variables
var body = document.querySelector('body');
var menu = body.querySelector('.menu');
var board = body.querySelector('.board');
//COUNTERS variables
var howManyBoxes;

//EVENTS adding
//menu
menu.querySelector('.add-box').addEventListener('click', addBox);
menu.querySelector('.remove-all').addEventListener('click', removeAll);
//boxes


//"MAIN"
var base = 100;
howManyBoxes = 0;

//GLOBAL functions
function addEventsBoxes () {
  var boxes = board.querySelectorAll('.box');
  //add events listeners
  for (var i = 0; i < howManyBoxes; i++) {
    boxes[i].querySelector('.stick-icon').addEventListener('mouseover', closeHoverOn);
    boxes[i].querySelector('.close').addEventListener('mouseover', closeHoverOn);
    boxes[i].querySelector('.stick-icon').addEventListener('mouseout', closeHoverOff);
    boxes[i].querySelector('.close').addEventListener('mouseout', closeHoverOff);
    boxes[i].querySelector('.close').addEventListener('click', removeBox);
    boxes[i].querySelector('.add').addEventListener('click', addLi);
  }
}

//EVENTS functions (menu)
function addBox () {
  board.innerHTML += '<div class="box">'
    + '<div class="bar">'
      + '<div class="stick-icon"><img src="images/pin-icon.png"></div>'
      + '<div class="close">x</div>'
    + '</div>'
    + '<h1>Title</h1><input type="text" value="Title">'
    + '<ul><li class="add"><span>.</span><input type="text"></li></ul></div>';
  var box = board.lastChild;
  box.style.left = (base + howManyBoxes * 10) + "px";
  box.style.top = (base + howManyBoxes * 10) + "px";
  howManyBoxes++;
  addEventsBoxes();
}
function removeAll () {
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
  addEventsBoxes();
}
function updateLi() {
  this.previousElementSibling.innerHTML = this.value;
  this.parentNode.classList.remove('edit');
}
function editLi () {
  if (!this.classList.contains('edit')) {
    this.classList.add('edit');
    var input = this.querySelector('input');
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}
function addLi () {
  this.querySelector('input').addEventListener('blur', updateLi);
  this.querySelector('input').addEventListener('keypress', function(e) {
    if (e.which == 13)
      updateLi.call(this);
  });
  this.addEventListener('click', editLi);
  this.classList.remove('add');
  this.removeEventListener('click', addLi);
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
  editLi.call(this);
}
