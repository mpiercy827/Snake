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

  Board.prototype.outOfBounds = function (pos) {
    var row = pos[0];
    var col = pos[1];
    return (row < 0 || row >= this.rows || col < 0 || col >= this.cols);
  };

  Board.prototype.snakeOut = function () {
    var snakeHead = this.snake.segments[0];
    return this.outOfBounds(snakeHead.pos) ? true : false;
  };

  Board.prototype.addApple = function () {
    var randRow = Math.floor(Math.random() * this.rows);
    var randCol = Math.floor(Math.random() * this.cols);

    var applePos = [randRow, randCol];
    var occupied = false;
    this.snake.allCoords().forEach(function (pos) {
      if (pos[0] === applePos[0] && pos[1] === applePos[1]) { occupied = true; }
    });

    occupied ? this.addApple() : this.apples.push(new Apple(applePos));
  };

  Board.prototype.convertApple = function () {
    this.snake.addSegment = true;
    this.apples.pop();
    this.addApple();
  };
})();
