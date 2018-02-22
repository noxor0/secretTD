class Enemy {
  // maybe take a dict with hp, damage, name or whatever
  // maybe just a name to refrence from a json?
  constructor() {
    this.tile = TILE_ARRAY[38];
    this.x = this.tile.x + BLOCK_SIZE/2;
    this.y = this.tile.y + BLOCK_SIZE/2;
    this.size = BLOCK_SIZE/3;
    this.dX = 0;
    this.dY = 0;

    // gameplay stuff
    this.color = 'red';
    this.flying = false;
    this.moveSpeed = 1;
    this.currSpeed = this.moveSpeed;

    this.shape = new createjs.Shape();
    this.shape.graphics.beginStroke("black").beginFill(this.color);
    // shapes x, y relative to start point
    this.shape.graphics.drawCircle(0, 0, this.size);
    this.shape.x += this.x;
    this.shape.y += this.y;

    this.checkpointTodo = CHECKPOINT_LIST;
    this.checkpointTodo.shift();


    this.pathToCheckpoint = this.aStar(this.tile, TILE_ARRAY[CHECKPOINT_LIST[0]]);
    console.log(this.pathToCheckpoint);

  }

  aStar(startTile, endTile) {
    let open = [new Node(0, 0, startTile)];
    let closed = [];
    let closedTiles = []
    // Loop till return
    while(true) {
      // Find the lowest cost in the open array, and set to current
      let current = open.sort(function(a, b){return a.cost - b.cost;}).shift();
      // Dont let open array get bigger than 100, trim values that are too high
      // This really doesnt help
      if (open.length > 100) {
        open.length = 100
      }
      // current is now closed
      closed.push(current);
      // additional data structure for easier includes checking
      closedTiles.push(current.tile);
      // End node?
      if (current.tile === endTile) return this.getPath(current);
      // Get neighbors of our current node
      let neighbors = getNeighbors(current.tile);
      // for all 4, at the most, neighbors
      for (let nIndex in neighbors) {
        let neighborTile = neighbors[nIndex];
        // check if theyre in the close tiles list
        if (closedTiles.includes(neighborTile)) continue;
        //create a node for the neighbor with its costs
        let startCost = findDistance(neighborTile.x, neighborTile.y, startTile.x, startTile.y)
        let endCost = findDistance(neighborTile.x, neighborTile.y, endTile.x, endTile.y)
        let neighborNode = new Node(startCost, endCost, neighborTile, current);
        //check if in OPEN or if its shorter path to a neighbor
        for (let oIndex in open) {
          // if the neighbor node is in the open list, skip it
          if(open[oIndex].equals(neighborNode)) {
            // UNLESS its cost is smaller than another node, that points to the same tile, in the open list
            if(open[oIndex].cost > neighborNode.cost) {
              // update it then, and skip
              open[oIndex] = neighborNode;
              break;
            }
          } else {
            // its not in the open list, so lets add it
            open.push(neighborNode);
            neighborNode.tile.changeColor('pink');
            stage.update()
            break;
          }
        }
        // if the list is empty, just add the node
        if (!open.length) open.push(neighborNode);
      }
    }
  }

  getPath(endNode) {
    let runner = endNode;
    let retPath = [];
    while(runner.parent) {
      retPath.push(runner.tile);
      runner.tile.changeColor('purple')
      runner = runner.parent;
    }
    return retPath
  }

  changeVelTowards(nextTile) {
    if (!nextTile) {return};
    this.dX = Math.sign(nextTile.x - this.tile.x);
    this.dY = Math.sign(nextTile.y - this.tile.y);
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

    if (this.checkpointTodo.length == 0) return;
    if (this.checkTileChange()) {
      // this.doMove();
      // this.pathTaken.push(this.tile);
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
