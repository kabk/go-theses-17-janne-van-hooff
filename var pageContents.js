var pageContents;

var currPage = 0;
var numPages = 105;
var numSpots = numPages + 2;

var dividerIds = new Array();

var targetPage = 0;
var stepTimer;

var spotCoords = new Array(numSpots);

var h = 0;
var w = 0;

//scale factors
var s1 = 0.5;
var s2 = 0.10;
var s3 = 0.02;

//number of spots for pages per level
var num2 = 34;
var num3 = 72;

var numCols2 = 0;
var numRows2 = 0;
var numCols3 = 0;
var numRows2 = 0;

//absolute page dimension of levels 1 to 3
var w1 = 0;
var h1 = 0;
var w2 = 0;
var h2 = 0;
var w3 = 0;
var h3 = 0;

//margins between pages of level 2 and 3
var idealMargin2 = 0.01;
var idealMargin3 = 0.01;
var mW2 = 0;
var mH2 = 0;
var mW3 = 0;
var mH3 = 0;

var padding = 0.01; //padding to body in percent

//absolute margin/padding values based on document size
var padWPx = 0;
var padHPx = 0;

var posX1 = 0;
var posY1 = 0;

var posX2 = 0;
var posY2 = 0;
	
var boundsW2 = 0;
var boundsH2 = 0;

$(document).ready(function(e) {
	
	//initialize page elements
	initPages();
	
	//prevent mobile scrolling
	document.body.addEventListener('touchmove', function(event) {
		event.preventDefault();
	}, false);
	
	$("body").on('swipeleft', function(e) {
		currPage++;
		if(currPage >= numPages) { currPage = 0; }
		arrangePages();
	});
	
	$("body").on('swiperight', function(e) {
		currPage--;
		if(currPage < 0) { currPage = numPages - 1; }
		arrangePages();
	});
	
	$("body").on('swipeup', function(e) {
		currPage++;
		if(currPage >= numPages) { currPage = 0; }
		arrangePages();
	});
	
	$("body").on('swipedown', function(e) {
		currPage--;
		if(currPage < 0) { currPage = numPages - 1; }
		arrangePages();
	});

});

//window resize with delay
var resizeTimer;

function resizeEnd()	{
	//recalculate grid layout
	calculateGrid();
	
	//save new positions for every spot in the grid
	saveSpotCoords();
	
	//rearrange pages
	arrangePages();
}

$(window).resize(function()	{
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(resizeEnd, 500);
});

//scroll event
$(window).bind('mousewheel DOMMouseScroll', function(event){
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
		currPage--;
		if(currPage < 0) { currPage = numPages - 1; }
    }
    else {
        currPage++;
		if(currPage >= numPages) { currPage = 0; }
    }
	arrangePages();
	
	//$(".page").removeClass("sel");
	//$(".page").eq(currPage).addClass("sel");
});

function stepToPage(_target) {
	clearTimeout(stepTimer);
	targetPage = _target;
	stepTimer = setTimeout(oneStep, 25);
}

function oneStep() {
	console.log(currPage + " –> " + targetPage);
	if(currPage != targetPage) {
		//get shortest direction
		if(targetPage < currPage) {
			if(numPages - currPage + targetPage < currPage - targetPage) {
				currPage++;
				if(currPage >= numPages) { currPage = 0; }
			}
			else {
				currPage--;
				if(currPage < 0) { currPage = numPages - 1; }
			}
			
		}
		else {
			if(numPages - targetPage + currPage < targetPage - currPage) {
				currPage--;
				if(currPage < 0) { currPage = numPages - 1; }
			}
			else {
				currPage++;
				if(currPage >= numPages) { currPage = 0; }
			}
		}
		//currPage++;
		//if(currPage >= numPages) { currPage = 0; }
		arrangePages();
		stepTimer = setTimeout(oneStep, 25);
	}
}


////////////////////////////////////
// MAIN FUNCTIONS
////////////////////////////////////

//load page data, create elements and initialize
function initPages() {
	//console.log("Loading ...");
	
	//read page contents from json file
    $.getJSON("content.json", function(data) 
    {
        /*$.each(data, function(key, val) 
        {
            pageContents.push(key + '-' + val);
        });*/
		
		pageContents = data.pages;
		//console.log(pageContents.length);
		
		numPages = pageContents.length;
		numSpots = numPages + 2;
		
		//calculate spots per level here
		//...
		
		//create page elements and fill with content
		for(var i = 0; i < numPages; i++) {
			var newPage = document.createElement("div");
			$(newPage).addClass("page");
			//save id with element to identify later
			$(newPage).data("id", i);
			$(newPage).data("type", pageContents[i].type);
			
			//Normal response
			if(pageContents[i].type == "response") {
				$(newPage).addClass("response");
				$(newPage).append("<div class='text'>" + pageContents[i].response + "<div class='author'>" + pageContents[i].author + "</div><div class='numbering'>" + pageContents[i].number + "</div>");
				//$(newPage).append("<div class='text'>" + "Jede Menge Text" + "<div class='author'>" + "Nicky Nick" + "</div><div class='numbering'>" + "03" + "</div>");
			}
			else
			//Cover page
			if(pageContents[i].type == "cover") {
				$(newPage).attr("id","cover");
				$(newPage).append("<div id='title'><div class='titleLetter'>A</div><div class='titleText'>Three</div><div class='titleLetter'>B</div><div class='titleText'>Questions</div><div class='titleLetter'>C</div><div class='titleText'>On Media</div><div class='titleLetter'>&nbsp;</div><div class='titleText'>Criticality</div></div>");
			}
			else
			//Questions dividers
			if(pageContents[i].type == "divider") {
				$(newPage).addClass("divider");
				$(newPage).append("<div class='letter'>" + pageContents[i].letter + "</div><div class='question'>" + pageContents[i].question + "</div>");
				//add id to dividerIds for later page ordering
				dividerIds.push(i);
			}
			else
			//Author index and imprint
			if(pageContents[i].type == "index") {
				$(newPage).attr("id", "index");
				var indexCol = document.createElement("div");
				$(indexCol).addClass("col");
				$(newPage).append(indexCol);
				$(indexCol).append("<div id='title'>" + "Index" + "</div>");
				
				//list authors
				for(var j = 0; j < pageContents[i].numbers.length; j++) {
					//create second column
					if(j == Math.ceil((pageContents[i].numbers.length - 2) / 2)) {
						indexCol = document.createElement("div");
						$(indexCol).addClass("col");
						$(newPage).append(indexCol);
					}
					
					$(indexCol).append("<div class='item'><div class='number'>" + pageContents[i].numbers[j] + "</div><div class='author'>" + pageContents[i].authors[j] + "</div><div>")
				}
				
				var imprint = document.createElement("div");
				$(imprint).attr("id","imprint");
				$(imprint).html(pageContents[i].imprint);
				$(newPage).append(imprint);
			}
			else
			//Questions page (following the cover)
			if(pageContents[i].type == "questions") {
				$(newPage).attr("id", "questions");
				$(newPage).append("<div id='questionsBox'><div class='questionsLetter'>A</div><div class='questionsText'>What are promising modes of critique today?</div><div class='questionsLetter'>B</div><div class='questionsText'>What is critical about media technologies?</div><div class='questionsLetter'>C</div><div class='questionsText'>What comes after critique?</div></div>");
				$(newPage).append("<div id='intro'>" + pageContents[i].text + "</div>");
			}
			else
			{
				$(newPage).addClass("response");
				$(newPage).append("<div class='text'>Special Page</div>");
			}
			
			$("body").append($(newPage));
		}
		
		//init page elements
		$(".page").each(function(index) {
						
			//page clicking
			$(this).click(function() {
				//currPage = parseInt($(this).data("id"));
				$(this).removeClass("hover");
				stepToPage(parseInt($(this).data("id")));
				//arrangePages();
			});
			
			//page hover
			$(this).hover(
				function() {
					if($(this).data("id") != currPage) {
						$(this).addClass("hover");
						//$(this).css({transform: 'scale(' + $(this).data("s")*2 + ')'});
					}
				}, function() {
					if($(this).data("id") != currPage) {
						$(this).removeClass("hover");
						//$(this).css({transform: 'scale(' + $(this).data("s") + ')'});
					}
				}
			);
		});
				
		//numbering hover effect
		$(".numbering").each(function(index) {
			$(this).hover(
				function() {
					$(this).animate({"opacity": 0.0},150);
					$(this).parent().children(".author").animate({"opacity": 1.0}, 150);
					//$(this).css("cursor","help");
				}, function() {
					$(this).animate({"opacity": 1.0},150);
					$(this).parent().children(".author").animate({"opacity": 0.0}, 150);
				}
			);
		});
		
		$(".c").each(function(index) {
			$(this).hover(
				function() {
					$(".comment").css("left",$(this).offset().left + "px");
					$(".comment").css("top",($(this).offset().top + Math.round($(this).outerHeight()) * parseFloat($(this).parent().parent().data("s")) + 10) + "px");
					$(".comment").fadeIn(150);
				}, function() {
					$(".comment").fadeOut(150);
				}
			);
		});
		
		//create direction fields
		var newDirection = document.createElement("div");
		$(newDirection).addClass("direction");
		$(newDirection).attr("id", "direction2");
		$(newDirection).html("");
		$("body").append($(newDirection));
		
		var newDirection = document.createElement("div");
		$(newDirection).addClass("direction");
		$(newDirection).attr("id", "direction3");
		$(newDirection).html("…"); //&#8627; //&#8635;
		$("body").append($(newDirection));
		
		//calculate grid layout
		calculateGrid();
		
		//save positions for every spot in the grid
		saveSpotCoords();
		
		//arrange pages
		arrangePages();	
		
	//in case of an error while loading	
    }).fail(function(jqXHR, textStatus, errorThrown) {
    	console.log( errorThrown );
  	});
}

//calculate layout grid based on page dimensions
function calculateGrid() {
	w = $("body").innerWidth();
	h = $("body").innerHeight();
	
	padWPx = padding * w;
	padHPx = padding * h;
	
	padWPx = Math.max(padWPx, padHPx);
	padHPx = padWPx;
	
	//get page format ratio
	//var ratio = h/w;
	//var ratio = w / (w + h);
	var ratio = 0.5;
	
	//calculate number of cols/rows for level 3 (corner pages excluded)
	numCols3 = (num3-4) * ratio / 2;
	numCols3 = Math.round(numCols3);
	if(numCols3 % 2 == 0) {
		numCols3 -= 1;	
	}
	numRows3 = (num3-4) - 2 * numCols3;
	numRows3 = numRows3 / 2;
	
	console.log("Cols / Rows: " + numCols3 + " / " + numRows3);
	
	//calculate number of cols/rows for level 2 (corner pages excluded)
	numCols2 = (num2-4) * ratio / 2;
	numCols2 = Math.round(numCols2);
	if(numCols2 % 2 == 0) {
		numCols2 -= 1;	
	}
	numRows2 = (num2-4) - 2 * numCols2;
	numRows2 = numRows2 / 2;
	
	console.log("Cols / Rows: " + numCols2 + " / " + numRows2);
	
	//calculate ideal page dimensions for level 3
	w3 = (w - (2 * padWPx) - ((idealMargin3 * w) * (numCols3 + 1))) / (numCols3 + 2);
	h3 = (h - (2 * padHPx) - ((idealMargin3 * h) * (numRows3 + 1))) / (numRows3 + 2);
	
	//calculate smallest scale factor from dimensions
	s3 = Math.min(w3 / w, h3 / h);
	
	//recalculate real page dimensions for level 3
	w3 = s3 * w;
	h3 = s3 * h;
	
	//recalculate real margins
	mW3 = (w - (2 * padWPx) - (numCols3 + 2) * w3) / (numCols3 + 1);
	mH3 = (h - (2 * padHPx) - (numRows3 + 2) * h3) / (numRows3 + 1);
	
	//get reference dimensions for level 2 based on level 3
	posX2 = padWPx + w3 + mW3;
	posY2 = padHPx + h3 + mH3;
	
	boundsW2 = w - 2 * (w3 + mW3) - 2 * padWPx;
	boundsH2 = h - 2 * (h3 + mH3) - 2 * padHPx;
	
	//calculate ideal page dimensions for level 2
	w2 = (boundsW2 - ((idealMargin2 * w) * (numCols2 + 1))) / (numCols2 + 2);
	h2 = (boundsH2 - ((idealMargin2 * h) * (numRows2 + 1))) / (numRows2 + 2);
	
	//calculate smallest scale factor from dimensions
	s2 = Math.min(w2 / w, h2 / h);
	
	//recalculate real page dimensions for level 2
	w2 = s2 * w;
	h2 = s2 * h;
	
	//recalculate real margins
	mW2 = (boundsW2 - (numCols2 + 2) * w2) / (numCols2 + 1);
	mH2 = (boundsH2 - (numRows2 + 2) * h2) / (numRows2 + 1);
	
	//get reference dimensions for level 1 based on level 2
	posX1 = posX2 + w2 + mW2;
	posY1 = posY2 + h2 + mH2;
	
	w1 = boundsW2 - 2 * (w2 + mW2);
	h1 = boundsH2 - 2 * (h2 + mH2);
	
	//get scale for correct ratio
	s1 = Math.min(w1 / w, h1 / h);
	
	//recalculate real dimensions
	w1 = s1 * w;
	h1 = s1 * h;
	posX1 = (w - w1) / 2;
	posY1 = (h - h1) / 2;
	
	//scale letters on dividers to match numbering on pages
	//absolute values (compare css)
	//$(".divider .letter").css("font-size", (s1 * 7.5 / s2) + "vmin");
	//relative to .numbering style
	$(".divider .letter").css("font-size", (s1 * parseFloat($(".numbering").eq(0).css("font-size")) / s2) + "px");
}

//save positions of each possible spot for pages into array / spot order is from inside to outside
function saveSpotCoords() {
	//counter for current spot
	var currSpot = 0;
	var currX = posX1;
	var currY = posY1;
	
	spotCoords[currSpot] = {x: currX, y: currY};
	makeMarker(currX, currY, currSpot);
			
	//////////
	//level 2, bottom row, single spot left from center spot
	currSpot++;
	currX = posX2 + Math.floor(numCols2 / 2) * (w2 + mW2);
	currY = posY2 + (numRows2 + 1) * (h2 + mH2);
	spotCoords[currSpot] = {x: currX, y: currY};
	makeMarker(currX, currY, currSpot);
	
	//level 2, bottom row, remaining spots left from center spot
	for(var i = 0; i < Math.floor(numCols2 / 2); i++) {
		currSpot++;
		currX -= w2 + mW2;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//level 2, left column
	for(var i = 0; i < numRows2 + 1; i++) {
		currSpot++;
		currY -= h2 + mH2;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//level 2, top row
	for(var i = 0; i < numCols2 + 1; i++) {
		currSpot++;
		currX += w2 + mW2;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//level 2, right column
	for(var i = 0; i < numRows2 + 1; i++) {
		currSpot++;
		currY += h2 + mH2;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//level 2, bottom row, right from center spot
	for(var i = 0; i < Math.ceil(numCols2 / 2); i++) {
		currSpot++;
		currX -= w2 + mW2;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//////////
	//level 3, bottom row, single spot left from center spot
	currSpot++;
	currX = padWPx + Math.floor(numCols3 / 2) * (w3 + mW3);
	currY = padHPx + (numRows3 + 1) * (h3 + mH3);
	spotCoords[currSpot] = {x: currX, y: currY};
	makeMarker(currX, currY, currSpot);
	
	
	//level 3, bottom row, remaining spots left from center spot
	for(var i = 0; i < Math.floor(numCols3 / 2); i++) {
		currSpot++;
		currX -= w3 + mW3;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//level 3, left column
	for(var i = 0; i < numRows3 + 1; i++) {
		currSpot++;
		currY -= h3 + mH3;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//level 3, top row
	for(var i = 0; i < numCols3 + 1; i++) {
		currSpot++;
		currX += w3 + mW3;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//level 3, right column
	for(var i = 0; i < numRows3 + 1; i++) {
		currSpot++;
		currY += h3 + mH3;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//level 3, bottom row, right from center spot
	for(var i = 0; i < Math.ceil(numCols3 / 2); i++) {
		currSpot++;
		currX -= w3 + mW3;
		spotCoords[currSpot] = {x: currX, y: currY};
		makeMarker(currX, currY, currSpot);
	}
	
	//position direction fields
	$("#direction2").each(function() {
		var thisS;
		var thisX;
		var thisY;
		var spotIndex = num2;
		thisS = s2;
		thisX = -w/2 + w2/2 + spotCoords[spotIndex].x;
		thisY = -h/2 + h2/2 + spotCoords[spotIndex].y;
		$(this).css({transform: 'scale(' + thisS + ')'});
		$(this).css("left", thisX + "px"); //as scale works to the center move everything
		$(this).css("top", thisY + "px");
		$(this).data("s", thisS);
	});
	
	$("#direction3").each(function() {
		var thisS;
		var thisX;
		var thisY;
		var spotIndex = numSpots-1;
		thisS = s3;
		thisX = -w/2 + w3/2 + spotCoords[spotIndex].x;
		thisY = -h/2 + h3/2 + spotCoords[spotIndex].y;
		$(this).css({transform: 'scale(' + thisS + ')'});
		$(this).css("left", thisX + "px"); //as scale works to the center move everything
		$(this).css("top", thisY + "px");
		$(this).data("s", thisS);
	});
}

//helper
function makeMarker(_x, _y, _index) {
	/*var marker = document.createElement("div");
	$(marker).addClass("marker");
	$(marker).css("left", _x + "px");
	$(marker).css("top", _y + "px");
	$(marker).html(_index);
	$("body").append($(marker));*/
}

//arrange pages based on calculated grid, current page and page order
function arrangePages() {
	
	//$(".page").hide();
	
	var spotIndex = 0;
	
		for(var i = 0; i < numPages; i++) {
			var pageIndex = currPage + i;
			if(pageIndex >= numPages) {
				pageIndex -= numPages;	
			}
			
			$(".page").eq(pageIndex).each(function() {
				var thisS;
				var thisX;
				var thisY;
				
				//skip bottom center spots
				if(spotIndex == num2 || spotIndex == numSpots-1) {
					spotIndex++;	
				}
				
				if(spotIndex == 0) {
					thisS = s1;
					thisX = 0;
					thisY = 0;
				}
				else
				if(spotIndex <= num2) {
					thisS = s2;
					thisX = -w/2 + w2/2 + spotCoords[spotIndex].x;
					thisY = -h/2 + h2/2 + spotCoords[spotIndex].y;
				}
				else {
					thisS = s3;
					thisX = -w/2 + w3/2 + spotCoords[spotIndex].x;
					thisY = -h/2 + h3/2 + spotCoords[spotIndex].y;
				}
				
				$(this).css({transform: 'scale(' + thisS + ')'});
				$(this).css("left", thisX + "px"); //as scale works to the center move everything
				$(this).css("top", thisY + "px");
				$(this).data("s", thisS);
				
				spotIndex++;
				
				//$(this).fadeIn(200);
			});
	}
}