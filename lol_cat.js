(function() {

// Generate list of URLs
var generateUrls = function() {
	var url_list = [];
	var i;
	for(i = 0; i <= 7; i++) {
		var url = 'http://lolcat.com/images/lolcats/';
		var rand_n = 900 + Math.floor(Math.random() * 300);
		url = url + rand_n + ".jpg";

		var rand_pos_1 = Math.floor(Math.random() * url_list.length);
		url_list.splice(rand_pos_1, 0, url);
		var rand_pos_2 = Math.floor(Math.random() * url_list.length);
		url_list.splice(rand_pos_2, 0, url);
	}
	return url_list;
};

// Preload lolcat images
var preloadImages = function(url_list)  {
	for (var i = 0; i < url_list.length; i++) {
		var img = new Image();
		img.src = url_list[i];
		var container = document.getElementById("imagePreloader");
		container.appendChild(img);
	}
};

var createTiles = function(url_list) {
	var gridEl = document.getElementById("grid");
	// We need this function for making sure we keep the index from inside the loop.
	// See: http://goo.gl/IUGGs
	var bouncy = function (imgEl, index) {
		imgEl.onclick = function() {
			clickHandler(index, url_list);
		};
	};
	for (var i=0; i<=15; i++){
		var liEl = document.createElement('li');
		var imgEl = document.createElement('img');
		imgEl.src = "hedgehog.png";
		imgEl.id = "hedgehog_"+i;
		bouncy(imgEl, i);
		liEl.appendChild(imgEl);
		gridEl.appendChild(liEl);
	}
};

var gameState = {
	flippedIds : [],
	pairsFound : 0,
	isWaiting : false
};

var clickHandler = function(theUrlIndex, url_list) {
	if (gameState.isWaiting){
		return;
	}
	if (gameState.flippedIds.length == 1 && gameState.flippedIds[0] == theUrlIndex) {
		return;
	}
	console.log('a click happened');
	console.log('the url: ' + url_list[theUrlIndex]);

	var hedgehogEl = window.document.getElementById("hedgehog_"+theUrlIndex);

	hedgehogEl.src=url_list[theUrlIndex];

	gameState.flippedIds.push(theUrlIndex);
	if (gameState.flippedIds.length == 2) {
		if (url_list[gameState.flippedIds[0]] == url_list[gameState.flippedIds[1]]){
			gameState.pairsFound ++;
			matchingCards();
		}
		else {
			notMatchingCards();
		}
		gameState.flippedIds = [];
		console.log('empty the gameState.flippedIds list');
	}
	console.log('lolcat');
};

var matchingCards = function() {
	if (gameState.pairsFound == 8) {
		youWin();
	}
	var firstCard = window.document.getElementById("hedgehog_"+gameState.flippedIds[0]);
	firstCard.onclick = null;
	console.log('first card unclickable');
	var secondCard = window.document.getElementById("hedgehog_"+gameState.flippedIds[1]);
	secondCard.onclick = null;
	console.log('second card unclickable');
};

var notMatchingCards = function() {
	var firstCard = window.document.getElementById("hedgehog_"+gameState.flippedIds[0]);

	var secondCard = window.document.getElementById("hedgehog_"+gameState.flippedIds[1]);
	gameState.isWaiting = true;
	setTimeout(function(){
		firstCard.src='hedgehog.png';
		secondCard.src='hedgehog.png';
		gameState.isWaiting = false;
	},
	1500);
	console.log('not matching');
};

var youWin = function(){
	// Put the confirm event on the event queue so it doesn't
	// block the rendering of swapping images.
	setTimeout(function() {
		if (confirm('Congratulations, you win! Click OK to play again.')) {
			window.location.reload();
		}
	}, 0);
};

window.onload = function() {
	var url_list = generateUrls();
	preloadImages(url_list);
	createTiles(url_list);
};
}());
