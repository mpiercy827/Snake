(function() {
  if (typeof Snake === "undefined") {
    Snake = window.Snake = {};
  }

  Snake.Snake = function(pos){
    this.segments = [];
    this.turning = false;
    this.addSegment = false;
    this.segments.push(new Vector(pos));
  };

  Snake.Snake.prototype.includes = function (vector) {
    for (var i = 0; i < this.segments.length; i++) {
      if (this.segments[i].equals(vector)) { return true; }
    }
    return false;
  };

  Snake.Snake.prototype.allCoords = function () {
    var coords = [];
    for (var i = 0; i < this.segments.length; i++) {
      coords.push(this.segments[i].pos);
    }
    return coords;
  };

  Snake.Snake.prototype.move = function () {
    var currentSeg = this.segments[0];
    var directionVector = Snake.DIRECTIONS[this.currDir];

    //Move first piece
    this.segments[0] = this.segments[0].plus(directionVector);

    //Move every other piece to the spot of its predecessor
    for (var i = 1; i < this.segments.length; i++) {
      var nextSeg = this.segments[i];
      this.segments[i] = currentSeg;
      currentSeg = nextSeg;
    }

    //Add segment if apple has been consumed
    if (this.addSegment) {
      this.segments.push(currentSeg);
      this.addSegment = false;
    }

    this.turning = false;
  };

  Snake.Snake.prototype.turn = function (newDirection) {
    //Don't let snake turn more than once per movement.
    if (this.turning) { return; }
    this.turning = true;

    //Snake doesn't have a currDir at start, so set it.
    if (!this.currDir) { this.currDir = newDirection; return; }

    //Change direction as long as it is not opposite of the current direction.
    var currentVector = Snake.DIRECTIONS[this.currDir];
    var newVector = Snake.DIRECTIONS[newDirection];
    if (!currentVector.isOpposite(newVector)) { this.currDir = newDirection; }
  };

  Snake.Snake.prototype.selfCollision = function () {
    var snakeHead = this.segments[0];
    for (var i = 1; i < this.segments.length; i++) {
      if (snakeHead.equals(this.segments[i])) { return true; }
    }
    return false;
  };
})();
