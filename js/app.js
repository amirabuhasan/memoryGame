/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
//an array to store sequence of cards


var array = ["fa fa-diamond", "fa fa-paper-plane-o",
"fa fa-anchor", "fa fa-bolt", "fa fa-cube",
"fa fa-anchor", "fa fa-leaf", "fa fa-bicycle",
"fa fa-diamond", "fa fa-bomb", "fa fa-leaf",
"fa fa-bomb", "fa fa-bolt", "fa fa-bicycle",
"fa fa-paper-plane-o", "fa fa-cube"];

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };

    return array;
};

//reassigns shuffled class names to .deck list.
function shuffleCards(array){
  var target = $(".deck").find("li");

  target.each(function() {
    var index = $(this).index();
    if (index < array.length) {
      $(this).children().addClass(array[index]);
    };
  });
};

//toggles between unopened and opened card when clicked
function toggleCards(element) {
  $(element).toggleClass("open show");
};

//for making a copy of cards and appending to .open-cards to identify whether they match.
function checkMatch(element) {
  $(element).clone().appendTo(".open-cards");
};

//identifies if two cards match by checking if the name the two list elements match.
function checkAnswer(card1,card2){
  if(card1 === card2){
    return true;
  }else{
    return false;
  };
};

//if cards match, assigns class name "match", and emptys the .open-cards list. Also counts the number of times this function is called to identify number of correct answers.
var rightAnswers = 0;
function ifMatch() {
  $(".card.open").removeClass("show").addClass("match");
  $(".open-cards").empty();
  rightAnswers++;
  console.log( "I have been called " + rightAnswers + " times" );
  return rightAnswers;
};

//animation ifMatch()
function ifMatchAnimation(){
  $(".card.open").addClass("animated " + "rubberBand");
};

//if cards don't match, toggles class "open show", and emptys the open-cards list.
function ifNotMatch() {
  $(".card.open").toggleClass("open show");
  $(".open-cards").empty();
  $(".card").removeClass("wrong");
};

//animation for ifNotMatch()
function ifNotMatchAnimation(){
  $(".card.open.show").addClass("wrong");
  $(".card.open.show").addClass("animated " + "shake");
};

//upon end of game, loads the congratulations modal, and appends user's star rating, move counter, and timer.
function gameEnd(counter){
  $(".modal").addClass("is-active");
  $("ul.stars").clone().appendTo( $( ".modal span#rating" ))
  $(".modal p").append("You did it in " + counter + " moves. Your time : ");
  $(stopTimer());
  $("span.timer").clone().appendTo( $( ".modal p" ))
  $(".deck").css({ "pointer-events": "none" });
}

//animation for ending the game.
function gameEndAnimation(){
  $(".deck").addClass("animated " + "fadeOut");
  $(".deck").addClass("animated " + "rubberBand");
};

//counts number of clicks on cards and displays it.
function clickCounter(counter,target){
  counter++ ;
  $(target).val(counter);
};

//calculates user's star rating based on number of clicks.
function checkScore(counter){
  if (counter > 28){
    $(".fa-star#3").css("color", "black");
  };
  if (counter > 38){
    $(".fa-star#2").css("color", "black");
  };
};

//timer function by Alejandro Mesa from https://codepen.io/alemesa/pen/xgNjWL?page=10
const minutes = document.querySelector('.minutes');
const seconds = document.querySelector('.seconds');
let timerTime = 0;
let interval;
let isRunning = false;

function startTimer() {

	if (!isRunning) {
		isRunning = true;
		interval = setInterval(incrementTimer, 1000);
	};
};

function stopTimer() {
	isRunning = false;
	clearInterval(interval);
};

function resetTimer() {
	stopTimer();
	timerTime = 0;
	seconds.innerText = '00'
	minutes.innerText = '00'
};

function incrementTimer() {
	timerTime = timerTime + 1;
	const numOfMinutes = Math.floor(timerTime / 60);
	const numOfSeconds = timerTime % 60;
	seconds.innerText = numOfSeconds >= 10 ? numOfSeconds : "0" + numOfSeconds;
	minutes.innerText = numOfMinutes >= 10 ? numOfMinutes : "0" + numOfMinutes;
};

//function to start game
function playGame(){

  var modal = $(".modal");

  array = $(shuffle(array));
  $(shuffleCards(array));

  $(".deck").on("click", "li", function(){

    $(this).css({ "pointer-events": "none" });

    $(toggleCards(this));
    $(checkMatch(this));
    $(startTimer());
    $(".deck.card").addClass("animated " + "flipInY");

    var counter = $("#moveBox").val();
    var target = "#moveBox";
    $(clickCounter(counter, target));
    $(checkScore(counter));

    var checkList = $(".open-cards").find("li");

    //finds the class name of the li elements of open-cards
    var card1 = checkList.children().eq(0).attr("class");
    var card2 = checkList.children().eq(1).attr("class");
    $(".card.open.show").addClass("animated " + "flipInY");

    //checks if cards match. If they do, executes ifMatch(). Else, executes ifNotMatch()
    if (checkList.length === 2){
      $(".deck li").css({ "pointer-events": "auto" });
      $(".card.open.show").removeClass("animated " + "flipInY");
      if (checkAnswer(card1, card2) === true){
        $(ifMatchAnimation());
        $(ifMatch());
      }else{
        $(ifNotMatchAnimation());
        $(".deck").css({ "pointer-events": "none" });
        setTimeout(function(){
          $(".card.open.show").removeClass("animated " + "shake");
          $(".deck").css({ "pointer-events": "auto" });
          $(ifNotMatch());
        }  , 1000 );
      };
    };

    //checks to see if user has matched all the cards. If they have, launches congratulations modal and appends user's star rating and number of moves to it.
    if (rightAnswers === 8){
      counter = Number(counter) + 1;
      $(gameEnd(counter));
      $(gameEndAnimation());
    };
  });
  //restarts page
  $(".restart").on("click", ".fa-repeat", function(){
    location.reload();
  });
  $(".js-close").on("click", function(){
    location.reload();
  });

}

$(playGame())



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
