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

    var apple = new Snake.Apple({pos: pos, type: type});

    if (!type) {
      this.apples.push(apple);
    } else if (type === "poison") {
      this.poisonApples.push(apple);
    } else if (type === "golden") {
      this.goldenApples.push(apple);
    }
  };

  Board.prototype.allApples = function () {
    return this.apples.concat(this.goldenApples.concat(this.poisonApples));
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

  Board.prototype.removeApple = function (apple) {
    var collection;

    if (!apple.type) {
      collection = this.apples;
    } else if (apple.type === "golden") {
      collection = this.goldenApples;
    } else if (apple.type === "poison") {
      collection = this.poisonApples;
    }

    var index = collection.indexOf(apple);
    collection.splice(index, 1);
  };

  Board.prototype.digestApple = function (apple) {
    this.snake.addSegment = true;
    this.removeApple(apple);
    this.addApple();
  };

  Board.prototype.gameOver = function () {
    return this.snakeOut() || this.snake.selfCollision();
  };
})();
