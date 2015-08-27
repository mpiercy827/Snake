(function () {
  if (typeof Snake === "undefined") {
    Snake = window.Snake = {};
  }

  Vector = Snake.Vector = function(pos) {
    this.pos = pos;
  };

  Vector.prototype.plus = function (otherVec) {
    var newVec = [this.pos[0] + otherVec.pos[0], this.pos[1] + otherVec.pos[1]];
    return new Vector(newVec);
  };

  Snake.DIRECTIONS = {
    'N': new Vector([-1,0]),
    'E': new Vector([0,1]),
    'S': new Vector([1,0]),
    'W': new Vector([0,-1])
  };

  Vector.prototype.equals = function (otherVec) {
    return (this.pos[0] === otherVec.pos[0] && this.pos[1] === otherVec.pos[1]);
  };

  Vector.prototype.isOpposite = function (otherVector) {
    return (this.plus(otherVector).equals(new Vector([0,0])));
  };

  Vector.randomPos = function (numCols, numRows) {
    var randRow = Math.floor(Math.random() * numRows);
    var randCol = Math.floor(Math.random() * numCols);

    return [randRow, randCol];
  };
})();
