(function() {

// Generate list of URLs
var generateUrls = function(count) {
	var i, n, urls = [];
	for (i = 0; i < count; i++) {
		n = 900 + Math.floor((Math.random() * 1000));
		urls.push('http://lolcat.com/images/lolcats/'+n+'.jpg');
	}
	return urls;
};


var duplicateAndShuffle = function(array) {
	// Append array to itself and then shuffle by popping off
	// random elements and pushing them to a new array
	var duplicateArray = array.concat(array);
	var shuffled = [];
	var count = duplicateArray.length;
	var index;
	for (var i = 0; i < count; i++) {
		index = Math.floor(Math.random()*duplicateArray.length);
		shuffled.push(duplicateArray.splice(index,1)[0]);
	}
	return shuffled;
};

// Preload lolcat images. If one of the images fails to load, the onFail callback
// will be called. Otherwise, when all images are preloaded - onSuccess will be called.
var preloadImages = function(urlList, onSuccess, onFail)  {
	var printer = function(e) { console.log(e); };
	var count = urlList.length;
	var fail = function() {
		if (count > 0) {
			count = 0;
			setTimeout(onFail, 0);
		}
	};
	var success = function() {
		if ((--count) === 0) {
			setTimeout(onSuccess, 0);
		}
	};
	for (var i = 0; i < urlList.length; i++) {
		var img = new Image();
		img.src = urlList[i];
		img.onload = success;
		img.onerror = fail;
		var container = document.getElementById("imagePreloader");
		container.appendChild(img);
	}
};

// Layout the cards
var createTiles = function(urlList) {
	var loader = document.getElementById("loader");
	loader.parentElement.removeChild(loader);
	var i, gridEl = document.getElementById("grid");
	// We need this function for making sure we keep the index from inside the loop.
	// See: http://goo.gl/IUGGs
	var setOnClickHandler = function (imgEl, index) {
		imgEl.onclick = function() {
			clickHandler(index, urlList);
		};
	};
	for (i = 0; i < urlList.length; i++){
		var liEl = document.createElement('li');
		var imgEl = document.createElement('img');
		imgEl.src = "hedgehog.png";
		imgEl.id = "hedgehog_"+i;
		setOnClickHandler(imgEl, i);
		liEl.appendChild(imgEl);
		gridEl.appendChild(liEl);
	}
};

// We keep a shared game state
var gameState = {
	flippedIds : [],   // Id's of the cards that are currently flipped
	pairsFound : [],    // Number of pairs that have been found
	isWaiting : false,  // Indication that we are showing bad cards
	totalPairs : 0
};

var clickHandler = function(cardIndex, urlList) {
	var clickedSameCard = gameState.flippedIds.length == 1 && gameState.flippedIds[0] == cardIndex;
	if (gameState.isWaiting || clickedSameCard){
		return;
	}

	// Swap the image of the clicked card
	getCardElement(cardIndex).src = urlList[cardIndex];

	gameState.flippedIds.push(cardIndex);
	if (gameState.flippedIds.length == 2) {
		if (urlList[gameState.flippedIds[0]] == urlList[gameState.flippedIds[1]]){
			gameState.pairsFound.push(gameState.flippedIds);
			matchingCards();
		}
		else {
			notMatchingCards();
		}
		gameState.flippedIds = [];
	}
};

var matchingCards = function() {
	if (gameState.pairsFound.length == gameState.totalPairs) {
		youWin();
	}
	getCardElement(gameState.flippedIds[0]).onclick = null;
	getCardElement(gameState.flippedIds[1]).onclick = null;
};

var notMatchingCards = function() {
	var card1 = getCardElement(gameState.flippedIds[0]);
	var card2 = getCardElement(gameState.flippedIds[1]);
	var resetFlippedTiles = function(indexA, indexB) {
		card1.src = 'hedgehog.png';
		card2.src = 'hedgehog.png';
		gameState.isWaiting = false;
	};
	gameState.isWaiting = true;
	setTimeout(resetFlippedTiles, 1500);
};

var getCardElement = function(index) {
	return window.document.getElementById("hedgehog_"+index);
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

// Bootstrap the application
window.onload = function() {
	gameState.totalPairs = 8;
	var retries = 10;
	var urlList = duplicateAndShuffle(generateUrls(gameState.totalPairs));
	var success = function() {
		console.log("Image preloading success!");
		createTiles(urlList);
	};
	var fail = function() {
		console.log("Image preloading failed, retrying");
		urlList = duplicateAndShuffle(generateUrls(gameState.totalPairs));
		preloader(retries--);
	};
	var preloader = function() {
		if (retries > 0) {
			preloadImages(urlList, success, fail);
		} else {
			alert("Could not load images :(");
		}
	};
	preloader();
};

}());
