var timer = -1;
var KEY_UP = 38, KEY_DOWN = 40, KEY_LEFT = 37, KEY_RIGHT = 39, KEY_SPACE = 32;
var INTERVAL = 600;
var shapes = [];

var isRunning = false;
// I
shapes.push({
	points: [{x: -1, y: 0}, {x: 0, y: 0}, {x: 1, y: 0},  {x: 2, y: 0}],
	adjust:  {x: 5, y: -2},
	color: 'orange'
});

// O
shapes.push({
	points: [{x: 0.5, y: 0.5}, {x: 0.5, y: -0.5}, {x: -0.5, y: 0.5}, {x: -0.5, y: -0.5},],
	adjust:  {x: 5.5, y: -1.5},
	color: 'blue'
});

// T
shapes.push({
	points: [{x:0, y: 0}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1},],
	adjust:  {x: 5, y: -1},
	color: 'green'
});

// L
shapes.push({
	points: [{x:0, y: 0}, {x: -1, y: 0}, {x: 1, y: 0}, {x: 1, y: -1},],
	adjust:  {x: 5, y: -1},
	color: 'red'
});

// J
shapes.push({
	points: [{x:0, y: 0}, {x: -1, y: 0}, {x: 1, y: 0}, {x: -1, y: -1},],
	adjust:  {x: 5, y: -1},
	color: 'purple'
});

// Z
shapes.push({
	points: [{x:0, y: 0}, {x: -1, y: 0}, {x: 0, y: 1}, {x: 1, y: 1},],
	adjust:  {x: 5, y: -2},
	color: 'maroon'
});

// S
shapes.push({
	points: [{x:0, y: 0}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 1},],
	adjust:  {x: 5, y: -2},
	color: 'aqua'
});

var	width = 10, height = 15, length = 35;
var board = {
	cube: null,
	points: [],
	init: function(){
		$('#score').val(0);
		this.cube=null;
		this.points = [];
		
		for(var i = 0; i < width; i++) {
			this.points[i] = [];
			for(var j = 0; j < height; j++) {
				this.points[i][j] = 0;
			}
		}
		
		$('.board').remove();
		var container = $('<div/>').addClass('board').appendTo($('#stage'));
		container.css({
					width: width * length,
					height: height * length,
					border: '1px solid black',
					position: 'relative',
					left: 100,
					top: 20
				}).show();

		for(var i = 0; i < height; i++) {
			for(var j = 0; j < width; j++) {
				container.append($('<div/>').css({
					width: length - 2,
					height: length -2,
					border: '1px solid black',
					'background-color': 'white',
					float: 'left'
				}).attr('id', 'span_' +j + '_' + i).attr('x', j).attr('y', i).show());
			}
		}
		
	},
	addCube: function(cube){
		this.cube = cube;
		if(this.isCrash() || !board.canDrop()) {
			gameOver();
		}
	},
	delCube: function(){
		this.cube = null;
	},
	hide: function(){
		for (var i = 0; i < this.cube.getPoints().length; i++){
			var point = this.cube.getPoints()[i];
			var adjust = this.cube.getAdjust();
			var x = point.x + adjust.x;
			var y = point.y + adjust.y;		
			if (this.points[x][y] == 0) {
				$('#span_' + (point.x + adjust.x) + '_' + (point.y + adjust.y)).css('background-color', 'white');
			}
		}
	},
	show: function(){
		for (var i = 0; i < this.cube.getPoints().length; i++){
			var point = this.cube.getPoints()[i];
			var adjust = this.cube.getAdjust();
			$('#span_' + (point.x + adjust.x) + '_' + (point.y + adjust.y)).css('background-color', this.cube.getColor());
		}
	},
	move: function(x, y){
		this.hide();
		this.cube.move(x, y);
		if (this.isCrash()){
			this.cube.move(-x, -y);
		}
		this.show();
	},
	antiClockWise: function(){
		this.hide();
		this.cube.clockWise();
		if (this.isCrash()) {
			this.cube.antiClockWise();
		}
		this.show();
	},
	drop: function(){
		this.hide();
		this.cube.move(0, 1);
		this.show();
	},
	canDrop: function (){
		var can = true;
		this.cube.move(0, 1);
		if (this.isCrash()) {
			can = false;
		}
		this.cube.move(0, -1);
		return can;
	},
	score: function(lines) {
		var oldScore = parseInt($('#score').val());
		var score = 0;
		switch(lines){
			case 1:
				score = 10;
				break;
			case 2:
				score = 30;
				break;
			case 3:
				score = 50;
				break;
			case 4:
				score = 80;
				break;
		}
		$('#score').val(oldScore + score);
	},
	merge: function(){
		var lines = 0;
		for (var i = 0; i < this.cube.getPoints().length; i++){
			var point = this.cube.getPoints()[i];
			var adjust = this.cube.getAdjust();
			var x = point.x + adjust.x;
			var y = point.y + adjust.y;
			this.points[x][y] = 1;
			
			//if () {
				
			//}
			//$('#span_' + x + '_' +y).text('A');
		}
		
		for (var j = 0; j < height; j ++) {
			var sum = 0;
			for(var i = 0; i < width; i++) {	
				sum += this.points[i][j];
			}
			if (sum == width) {
				this.clearLine(j);
				lines++;
			}
		}
		
		this.score(lines);
	},
	clearLine: function(n){
		for(var i = 0; i < width; i++) {
			for (var j = n; j >= 1; j--){
				this.points[i][j] = this.points[i][j - 1];
				$('#span_' +i + '_' + j).css('background-color', $('#span_' +i + '_' + (j-1)).css('background-color'));
			}
			this.points[i][0] = 0; 
			$('#span_' +i + '_' + j).css('background-color', 'white');
		}
	},
	isCrash: function () {
		var crashed = false;
		for (var i = 0; i < this.cube.getPoints().length; i++){
			var point = this.cube.getPoints()[i];
			var adjust = this.cube.getAdjust();
			var x = point.x + adjust.x;
			var y = point.y + adjust.y;
			if (y >= 0) {
				if (x < 0 || x >=width || y >= height || this.points[x][y] == 1){
					crashed = true;
					break;
				}
			}
		}
		return crashed;
	},
	canResponse: function(){
		var can = false;
		for (var i = 0; i < this.cube.getPoints().length; i++){
			var point = this.cube.getPoints()[i];
			var adjust = this.cube.getAdjust();
			var y = point.y + adjust.y;
			if (y >= 0) {
				can = true;
				break;
			}
		}
		return can;
	}
}

function antiClockWisePoint(point) {
	return {x: point.y, y: -1 * point.x};
}

function clockWisePoint(point) {
	return {x: -1 * point.y, y: point.x};
}

function movePoint(adjust, x, y) {
	return {x: adjust.x + x, y: adjust.y + y};
}

function Cube(shape){
	this.shape = $.extend({}, shape);
	Cube.prototype.antiClockWise = function(){
		for (var i = 0; i < this.shape.points.length; i++){
			this.shape.points[i] = antiClockWisePoint(this.shape.points[i]);
		}
	};
	Cube.prototype.clockWise = function(){
		for (var i = 0; i < this.shape.points.length; i++){
			this.shape.points[i] = clockWisePoint(this.shape.points[i]);
		}
	};
	Cube.prototype.move = function(x, y){
			this.shape.adjust = movePoint(this.shape.adjust, x, y);
	};
	Cube.prototype.getPoints = function(){
		return this.shape.points;
	};
	Cube.prototype.getAdjust= function(){
		return this.shape.adjust;
	};
	Cube.prototype.getColor= function(){
		return this.shape.color;
	}
}

function random(n){
	return Math.floor(Math.random() * n);
}

function log(msg) {
	//var d = new Date();
	//console.log("Log|" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + '.' + d.getMilliseconds() + "|" + msg); 
}

function newCube() {
	return new Cube(shapes[random(shapes.length)]);
}

function continueGame() {
	registerKeydownEvent();
	timer = setInterval(function(){
		var canDrop = board.canDrop();

		if (canDrop){
			board.drop();
		}
		else{
			board.merge();
			board.addCube(newCube());
		}
	}, INTERVAL); 
}

function pauseGame() {
	$('body').unbind('keydown');
	clearInterval(timer);
}

function startGame() {
	board.init();
	board.addCube(newCube());
	board.show();
	continueGame();
}

function stopGame() {
	pauseGame();
	board.init();
}

function gameOver(){
	pauseGame();
	$("#start").text("Start");
	$('#score').val("Game Over!");
	$('#pause').attr('disabled', 'disabled');
	log("Game Over!");
}

function registerKeydownEvent(){
	$('body').attr('tabindex', 0).keydown(function(e){
        e.preventDefault();
		if (board.canResponse()) {
			switch(e.which) {
				case KEY_UP: 
					board.antiClockWise();
					break;
				case KEY_DOWN:
					board.move(0, 1);
					break;
				case KEY_LEFT:
					board.move(-1, 0);
					break;
				case KEY_RIGHT:
					board.move(1, 0);
					break;
				case KEY_SPACE:
				{
					while (board.canDrop())
					board.drop();
					break;
				}
				default:
					//console.log(e.which);
			}
		}
	});
	
    $('.board div').bind('click', function(e){
        var target = $(e.target);
        var x = target.attr('x');
        var y = target.attr('y');

        if (y >= 0 && y <= 4) {
            if (x >= 2 && x <= 7) {
               board.antiClockWise();
            }
        }
        else if (y >= 5 && y <= 9) {
            if (x >= 0 && x <= 2) {
                board.move(-1, 0);
            }
            else if (x >= 3 && x <= 6) {
                while (board.canDrop())board.drop();
            }
            else if (x >= 7 && x <= 9) {
                board.move(1, 0);
            }
        }
        else if (y >= 10 && y <= 14) {
            if (x >= 2 && x <= 7) {
               board.move(0, 1);
            }
        }
    });
    
    $('.board').bind('dblclick', function(e){
        e.preventDefault();
    });
}

$(function(){
	$('#pause').click(function(){
		if ($(this).text() == "Pause") {
			pauseGame();
			$(this).text("Resume");
		}
		else {
			continueGame();
			$(this).text("Pause");
		}
	});
	
	$('#start').click(function(){
		if ($(this).text() == "Start") {
			$(this).text("Stop");
			$('#pause').attr('disabled', null);
			startGame();
		}
		else {
			$(this).text("Start");
			$('#pause').attr('disabled', 'disabled');
			stopGame();
		}
	});
	
	
	
	board.init();
});

