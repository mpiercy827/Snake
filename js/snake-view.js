(function() {
  if (typeof Snake === "undefined") {
    Snake = window.Snake = {};
  }

  var View = Snake.View = function($el) {
    this.$el = $el;
    this.stepTime = 80;
    this.board = new Snake.Board();
    this.setupView();
    this.bindEvents();
    this.start();
  };

  View.prototype.start = function () {
    this.board.resetBoard();
    this.score = 0;
    this.moving = false;
    this.setupView();
    this.IntID = setInterval(this.step.bind(this), this.stepTime);
  };

  View.prototype.step = function () {
    if (this.moving) {
      this.board.snake.move();
      this.specialApples();
      this.checkForApples();
    }

    if (this.board.gameOver()) {
      clearInterval(this.IntID);
      alert("You lost! Press OK to play again!");
      this.start();
    } else {
      this.updateView();
    }
  };

  View.prototype.specialApples = function () {
    var addGolden = Math.random() < 0.01;
    var addPoison = Math.random() < 0.005;

    if (addGolden && this.board.goldenApples.length === 0) {
      this.board.addApple("golden");
    }

    if (addPoison) {
      this.board.addApple("poison");
    }
  };

  View.prototype.checkForApples = function () {
    var apples = this.board.allApples();
    var snakeHead = this.board.snake.segments[0];
    var view = this;

    apples.forEach(function (apple) {
      if (apple.vector.equals(snakeHead)) { view.eatApple(apple); }
    });
  };

  View.prototype.eatApple = function (apple) {
    if (!apple.type) {
      this.board.digestApple(apple);
      this.score += 1;
    } else if (apple.type === "golden") {
      this.board.removeApple(apple);
      this.score += 5;
    } else {

    }
  };

  View.prototype.setupView = function () {
    this.$el.empty();
    for (var i = 0; i < this.board.rows; i++) {
      this.$el.append($("<div>").addClass("row"));
    }

    var $rows = $(".row");
    var view = this;

    $rows.each(function (rowIndex, row) {
      for (var colIndex = 0; colIndex < view.board.cols; colIndex++) {
        var $cell = $("<div>")
                    .addClass("cell")
                    .attr("data-row", rowIndex)
                    .attr("data-col", colIndex);
        $(row).append($cell);
      }
    });

    $(".score").text(this.score);
  };

  View.prototype.updateView = function () {
    var snake = this.board.snake;
    var view = this;
    $(".apple").removeClass("apple");
    $(".golden-apple").removeClass(".golden-apple");
    $(".poison-apple").removeClass(".poison-apple");
    $(".cell.snake").removeClass("snake");

    snake.allCoords().forEach(function (pos) {
      var $cell = $(".cell[data-row=" + pos[0] + "][data-col=" + pos[1] + "]");
      $cell.addClass("snake");
    });

    view.board.apples.forEach(function (apple) {
      var pos = apple.pos;
      var $cell = $(".cell[data-row=" + pos[0] + "][data-col=" + pos[1] + "]");
      $cell.addClass("apple");
    });

    view.board.goldenApples.forEach(function (gApple) {
      var pos = gApple.pos;
      var $cell = $(".cell[data-row=" + pos[0] + "][data-col=" + pos[1] + "]");
      $cell.addClass("golden-apple");
    });

    view.board.poisonApples.forEach(function (pApple) {
      var pos = pApple.pos;
      var $cell = $(".cell[data-row=" + pos[0] + "][data-col=" + pos[1] + "]");
      $cell.addClass("poison-apple");
    });

    $(".score").text(this.score);
  };

  View.prototype.bindEvents = function () {
    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };

  View.DIRECTIONS = {
    87: "N",  // W
    68: "E",  // D
    83: "S",  // S
    65: "W",   // A
    38: "N",
    39: "E",
    40: "S",
    37: "W"
  };

  View.REVERSE_DIRECTIONS = {
    83: "N",  // W
    65: "E",  // D
    87: "S",  // S
    68: "W",   // A
    40: "N",
    37: "E",
    38: "S",
    39: "W"
  };

  View.prototype.handleKeyEvent = function (event) {
    if (View.DIRECTIONS[event.keyCode]) {
      if (!this.moving) { this.moving = true; }
      this.board.snake.turn(View.DIRECTIONS[event.keyCode]);
    }
  };
})();
