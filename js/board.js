(function () {
  if (typeof Snake === "undefined") {
    Snake = window.Snake = {};
  }

  Board = Snake.Board = function () {
    this.cols = 30;
    this.rows = 30;
    this.resetBoard();
  };

  Board.prototype.resetBoard = function () {
    this.grid = [];
    this.apples = [];
    this.goldenApples = [];
    this.poisonApples = [];
    this.startPos = [Math.floor(this.rows/2), Math.floor(this.cols/2)];
    this.snake = new Snake.Snake(this.startPos);
    this.addApple();
    this.setupGrid();
  };

  Board.prototype.setupGrid = function () {
    for (var row = 0; row < this.rows; row++) {
      var currRow = [];
      for (var col = 0; col < this.cols; col++) {
        currRow.push(new Vector([row, col]));
      }
      this.grid.push(currRow);
    }
  };

  //To check if position is out of bounds
  Board.prototype.outOfBounds = function (pos) {
    var row = pos[0];
    var col = pos[1];
    return (row < 0 || row >= this.rows || col < 0 || col >= this.cols);
  };

  //To check if snake is out of bounds
  Board.prototype.snakeOut = function () {
    var snakeHead = this.snake.segments[0];
    return this.outOfBounds(snakeHead.pos) ? true : false;
  };


  Board.prototype.addApple = function (type) {
    var pos, apple;
    do {
      pos = Vector.randomPos(this.cols, this.rows);
    } while (this.occupied(pos));

    if (!type) {
      apple = new Apple(pos);
    } else if (type === "poison") {
      apple = new PoisonApple(pos);
    } else if (type === "golden") {
      apple = new GoldenApple(pos);
    }


    this.apples.push(apple);
  };

  Board.prototype.occupied = function (position) {
    var occupied = false;
    this.snake.allCoords().forEach(function (pos) {
      if (pos[0] === position[0] && pos[1] === position[1]) {
        occupied = true;
      }
    });

    return occupied;
  };

  Board.prototype.convertApple = function () {
    this.snake.addSegment = true;
    this.apples.pop();
    this.addApple();
  };

})();
