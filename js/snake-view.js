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
    this.snakePoisoned = false;
    this.reversedControls = false;
    this.reversedTime = 0;
    this.getHighScore();
    this.setupView();
    this.IntID = setInterval(this.step.bind(this), this.stepTime);
  };

  // Score Setup and Handling
  View.prototype.getHighScore = function () {
    if (document.cookie) {
      this.highScore = parseInt(this.getCookie("highScore"));
    } else {
      document.cookie = "highScore=0";
      this.highScore = 0;
    }
  };

  View.prototype.getCookie = function (name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  };

  View.prototype.updateHighScore = function () {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  };

  View.prototype.setNewHighScore = function () {
    if (this.highScore > parseInt(this.getCookie("highScore"))) {
      document.cookie = "highScore=" + this.highScore;
    }
  };

  //Apple Generation and Consumption
  View.prototype.specialApples = function () {
    var addGolden = Math.random() < 0.01;
    var addPoison = Math.random() < 0.01;

    this.checkGoldenAppleLife();
    this.checkPoisonTime();

    if (addGolden && this.board.goldenApples.length === 0) {
      this.board.addApple("golden");
      this.goldenAppleLifespan = 20;
    }

    if (addPoison) {
      this.board.addApple("poison");
    }
  };

  View.prototype.checkGoldenAppleLife = function () {
    if (this.goldenAppleLifespan > 0) {
      this.goldenAppleLifespan -= 1;
    } else if (this.goldenAppleLifespan === 0 && this.board.goldenApples[0]) {
      this.board.removeApple(this.board.goldenApples[0]);
    }
  };

  View.prototype.checkPoisonTime = function () {
    if (this.reversedTime > 0) {
      this.reversedTime -= 1;
    } else if (this.reversedTime === 0) {
      this.reversedControls = false;
      this.snakePoisoned = false;
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
      this.board.removeApple(apple);
      this.reversedControls = true;
      this.snakePoisoned = true;
      this.reversedTime += 20;
    }

    this.updateHighScore();
  };

  //View setup and updating
  View.prototype.setupView = function () {
    this.$el.empty();
    for (var i = 0; i < this.board.rows; i++) {
      this.$el.append($("<div>").addClass("row"));
    }

    var $rows = $(".row");
    var view = this;

    $rows.each(function (rowIndex, row) {
      for (var colIndex = 0; colIndex < view.board.cols; colIndex++) {
        var $cell = $("<div>").addClass("cell");
        $cell.attr("data-row", rowIndex).attr("data-col", colIndex);
        $(row).append($cell);
      }
    });

    this.updateView();
    this.displayOverlay();
  };

  View.prototype.updateView = function () {
    var snake = this.board.snake;
    var view = this;
    this.removeClasses();
    this.displaySnake();
    this.displayApples();
    $(".score").text(this.score);
    $(".high-score").text(this.highScore);
  };

  View.prototype.displaySnake = function () {
    var view = this;
    var snake = this.board.snake;
    snake.allCoords().forEach(function (pos) {
      var $cell = $(".cell[data-row=" + pos[0] + "][data-col=" + pos[1] + "]");
      view.snakePoisoned ? $cell.addClass("snake-poisoned") : $cell.addClass("snake");
    });
  };

  View.prototype.displayApples = function () {
    var view = this;

    view.board.allApples().forEach(function (apple) {
      var pos = apple.pos;
      var $cell = $(".cell[data-row=" + pos[0] + "][data-col=" + pos[1] + "]");
      if (!apple.type) {
        $cell.addClass("apple");
      } else if (apple.type === "golden") {
        $cell.addClass("golden-apple");
      } else if (apple.type === "poison") {
        $cell.addClass("poison-apple");
      }
    });
  };

  View.prototype.removeClasses = function () {
    $(".apple").removeClass("apple");
    $(".golden-apple").removeClass("golden-apple");
    $(".poison-apple").removeClass("poison-apple");
    $(".snake-poisoned").removeClass("snake-poisoned");
    $(".cell.snake").removeClass("snake");
  };

  View.prototype.displayOverlay = function (loss) {
    var text = loss ? "Try Again!" : "Press W, A, S, D or the arrow keys to begin.";
    var $overlay = $("<div>").addClass("overlay").text(text);
    $(".game-container").append($overlay);
  };

  //Handle game logic at each step.
  View.prototype.step = function () {
    if (this.moving) {
      this.move()
    } else {
      return;
    }
    if ($(".overlay").length > 0) { $(".overlay").remove(); }
    this.board.gameOver() ? this.handleLoss() : this.updateView();
  };

  View.prototype.move = function () {
    this.board.snake.move();
    this.specialApples();
    this.checkForApples();
  };

  View.prototype.handleLoss = function () {
    clearInterval(this.IntID);
    this.setNewHighScore();
    this.displayOverlay(true);
    setTimeout(this.start.bind(this), 1000);
  };

  //Keybinding and Input handling
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

  View.REVERSE_DIRS = {
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
    var keyMap = this.reversedControls ? View.REVERSE_DIRS : View.DIRECTIONS
    var direction = keyMap[event.keyCode];
    if (direction) {
      event.preventDefault();
      if (!this.moving) {
        this.moving = true;
      }
      this.board.snake.turn(direction);
    }
  };
})();
