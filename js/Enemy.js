class Enemy {
  // maybe take a dict with hp, damage, name or whatever
  // maybe just a name to refrence from a json?
  constructor() {
    this.y = BLOCK_SIZE * 1.5 ;
    this.x = BLOCK_SIZE * 3.5;
    this.tile = getTileAt(Math.floor(this.x / 28), Math.floor(this.y / 28));
    this.dX = 0;
    this.dY = 0;
    this.color = 'red';
    // haha
    this.flying = false;
    this.shape = new createjs.Shape();
    this.shape.graphics.beginStroke("black").beginFill(this.color);
    // shapes x, y relative to start point
    this.shape.graphics.drawCircle(0, 0, BLOCK_SIZE/3);
    this.shape.x += this.x;
    this.shape.y += this.y;
    // refresh this on each wave
    this.checkpointTodo = CHECKPOINT_LIST;
    this.checkpointTodo.shift();
    this.pathTaken = [];

    this.moveSpeed = 1;
    this.currSpeed = this.moveSpeed;
    this.doMove()
  }

  getNeighbors() {
    if (this.tile.index == this.checkpointTodo[0]) {
      this.checkpointTodo.shift();
      this.pathTaken.length = 0;
    }
    const neighbors = []
    let col = Math.floor(this.x / 28);
    let row = Math.floor(this.y / 28);
    this.tile.index = row * BOARD_SIZE + col;

    neighbors.push(TILE_ARRAY[this.tile.index - 1]);
    neighbors.push(TILE_ARRAY[this.tile.index + 1]);
    neighbors.push(TILE_ARRAY[this.tile.index - BOARD_SIZE]);
    neighbors.push(TILE_ARRAY[this.tile.index + BOARD_SIZE]);
    // neighbors.push(TILE_ARRAY[this.tile.index - BOARD_SIZE - 1]);
    // neighbors.push(TILE_ARRAY[this.tile.index - BOARD_SIZE + 1]);
    // neighbors.push(TILE_ARRAY[this.tile.index + BOARD_SIZE - 1]);
    // neighbors.push(TILE_ARRAY[this.tile.index + BOARD_SIZE + 1]);
    return neighbors
  }

  //finds path to the element left in the array
  findBest(neighbors) {
    let chkX = this.checkpointTodo[0] % BOARD_SIZE;
    let chkY = Math.floor(this.checkpointTodo[0] / BOARD_SIZE);
    let lowestTile;
    let lowestDist = Number.MAX_VALUE;
    for (let i = 0; i < neighbors.length; i++) {
      if (!neighbors[i]) {continue;}
      if (neighbors[i].selected) {continue;}
      if (this.pathTaken.includes(neighbors[i])) {continue;}
        let col = Math.floor(neighbors[i].x / 28);
        let row = Math.floor(neighbors[i].y / 28);
        if (this.findDistance(col, row, chkX, chkY) < lowestDist) {
          lowestDist = Math.min(lowestDist, this.findDistance(col, row, chkX, chkY))
          lowestTile = neighbors[i];
        }
    }
    // lowestTile.changeColor('pink');
    return lowestTile
  }

  findDistance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
  }

  changeVelTowards(bestTile) {
    if (!bestTile) {return};
    this.dX = Math.sign(bestTile.x - this.tile.x);
    this.dY = Math.sign(bestTile.y - this.tile.y);
  }

  checkTileChange() {
    let midBlock = 14;
    if (this.x % BLOCK_SIZE == midBlock && this.y % BLOCK_SIZE == midBlock){
      let potNewTile = getTileAt(Math.floor(this.x / BLOCK_SIZE), Math.floor(this.y / BLOCK_SIZE));
      if (potNewTile != this.tile) {
        this.tile = potNewTile
        return true
      }
    }
    return false

  }

  doMove() {
      let neighbors = this.getNeighbors()
      let bestTile = this.findBest(neighbors);
      this.changeVelTowards(bestTile);
  }

  move() {
    this.currSpeed--;

    if (this.checkpointTodo.length == 0) {return;}
    if (this.checkTileChange()) {
      this.doMove();
      this.pathTaken.push(this.tile);
      console.log(this.tile);
      console.log(this.pathTaken);
    }
    this.x += this.dX;
    this.y += this.dY;
    this.shape.x += this.dX;
    this.shape.y += this.dY;
    // console.log("this.(%d, %d) this.shape.(%d, %d)",this.x, this.y, this.shape.x, this.shape.y);

    if (this.currSpeed > 0) {
      this.move(this.currSpeed)
    }
    if (this.currSpeed <= 0) {
      this.currSpeed = this.moveSpeed;
    }
  }

}
