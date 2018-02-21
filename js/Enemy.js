class Enemy {
  // maybe take a dict with hp, damage, name or whatever
  // maybe just a name to refrence from a json?
  constructor() {
    this.y = BLOCK_SIZE * 1.5 ;
    this.x = BLOCK_SIZE * 3.5;
    this.index = 0;
    this.dX = 0;
    this.dY = 3;
    this.color = 'red';
    // haha
    this.flying = false;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginStroke("black").beginFill(this.color);
    this.shape.graphics.drawCircle(this.x, this.y, BLOCK_SIZE/3);
    // refresh this on each wave
    this.checkpointTodo = CHECKPOINT_LIST;
    this.checkpointTodo.shift();
    this.pathTaken = []
  }

  getNeighbors() {
    const neighbors = []
    let col = Math.floor(this.x / 28);
    let row = Math.floor(this.y / 28);
    this.index = row * BOARD_SIZE + col;

    neighbors.push(TILE_ARRAY[this.index - 1]);
    neighbors.push(TILE_ARRAY[this.index + 1]);
    neighbors.push(TILE_ARRAY[this.index - BOARD_SIZE]);
    neighbors.push(TILE_ARRAY[this.index + BOARD_SIZE]);
    neighbors.push(TILE_ARRAY[this.index - BOARD_SIZE - 1]);
    neighbors.push(TILE_ARRAY[this.index - BOARD_SIZE + 1]);
    neighbors.push(TILE_ARRAY[this.index + BOARD_SIZE - 1]);
    neighbors.push(TILE_ARRAY[this.index + BOARD_SIZE + 1]);
    return neighbors
  }

  //finds path to the element left in the array
  findBest(neighbors) {
    let chkX = this.checkpointTodo[0] % BOARD_SIZE;
    let chkY = Math.floor(this.checkpointTodo[0] / BOARD_SIZE);
    let lowestTile;
    let lowestDist = Number.MAX_VALUE;
    //console.log(lowestDist);
    for (let i = 0; i < neighbors.length; i++) {
      if (!neighbors[i]) {continue;}
      // check if occupied
      if (neighbors[i].selected) {continue;}
      if (this.pathTaken.includes(neighbors[i])) {continue;}
        let col = Math.floor(neighbors[i].x / 28);
        let row = Math.floor(neighbors[i].y / 28);
        if (this.findDistance(col, row, chkX, chkY) < lowestDist) {
          lowestDist = Math.min(lowestDist, this.findDistance(col, row, chkX, chkY))
          lowestTile = neighbors[i];
        }
        // console.log(lowestTile);
    }
    // console.log("lowest", lowestTile);
    lowestTile.changeColor('pink');
    this.pathTaken.push(lowestTile);
    return lowestTile
  }

  findDistance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  }

  changeVel(bestTile) {
    // console.log(this, bestTile);
    this.dX = bestTile.x - this.x;
    this.dY = bestTile.y - this.y;

    // console.log(this.dX, this.dY);

  }

  move() {
    if (this.index == this.checkpointTodo[0]) {
      this.checkpointTodo.shift();
      this.pathTaken = [];
    }
    let neighbors = this.getNeighbors()
    let bestTile = this.findBest(neighbors);
    this.changeVel(bestTile);

    this.x += this.dX;
    this.y += this.dY;
    this.shape.x += this.dX;
    this.shape.y += this.dY;
  }

}
