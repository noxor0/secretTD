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
    let open = new Set([new Node(0, 0, startTile)]);
    let openTiles = new Set([startTile])
    let closed = new Set([]);
    let closedTiles = new Set([]);
    // Loop till return
    while(open.size) {
    // for(let i = 0; i < 1; i++) {
      // Find the lowest cost in the open array, and set to current
      let current = new Node(Number.MAX_VALUE, Number.MAX_VALUE);
      open.forEach(function(openVal) {
        if (openVal.cost < current.cost) {
          current = openVal
        }
      });
      // current.tile.changeTempColor('orange')
      stage.update()

      // Remove it from the set
      open.delete(current);
      openTiles.delete(current.tile);
      // let current = open.sort(function(a, b){return a.cost - b.cost;}).shift();
      // current is now closed
      closed.add(current);
      // additional data structure for easier includes checking
      closedTiles.add(current.tile);
      // End node?
      if (current.tile === endTile) return this.getPath(current);
      // Get neighbors of our current node
      let neighbors = getNeighbors(current.tile);
      // for all 4, at the most, neighbors
      for (let nIndex in neighbors) {
        let neighborTile = neighbors[nIndex];
        // check if theyre in the close tiles list
        if (closedTiles.has(neighborTile)) continue;
        //create a node for the neighbor with its costs
        let startCost = current.startCost + 1
        let endCost = findDistance(neighborTile.x, neighborTile.y, endTile.x, endTile.y)
        let neighborNode = new Node(startCost, endCost, neighborTile, current);
        neighborNode.tile.changeTempColor('pink');
        //check if in OPEN or if its shorter path to a neighbor

        if (openTiles.has(neighborNode.tile)) {
          open.forEach(function (openVal) {
            if (openVal.equals(neighborNode) && openVal.cost > neighborNode.cost) openVal = neighborNode; return;
          });
        } else {
          open.add(neighborNode);
          openTiles.add(neighborNode.tile);
        }

        // for (let oNode of open) {
        //   // if the neighbor node is in the open list, skip it
        //   if(oNode.equals(neighborNode)) {
        //     console.log("aoeu");
        //     // UNLESS its cost is smaller than another node, that points to the same tile, in the open list
        //     if(oNode.cost > neighborNode.cost) {
        //       // update it then, and skip
        //       oNode = neighborNode;
        //       break;
        //     }
        //   } else {
        //     // its not in the open list, so lets add it
        //     open.add(neighborNode);
        //     openTiles.add(neighborNode.tile)
        //     break;
        //   }
        // }

        // if the list is empty, just add the node
        if (!open.size) open.add(neighborNode); openTiles.add(neighborNode.tile)
        // current.tile.changeTempColor('brown');
        // stage.update()
      }
    }
    return ['no path'];
  }

  getPath(endNode) {
    let runner = endNode;
    let retPath = [];
    while(runner.parent) {
      retPath.push(runner.tile);
      runner.tile.changeTempColor('purple')
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
