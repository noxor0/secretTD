class Node {
  constructor(startCost, finishCost, tile, parent) {
    this.tile = tile;
    // Parent node
    this.parent = parent;
    // G cost
    this.startCost = startCost;
    // H cost
    this.finishCost = finishCost;
    // F cost
    this.cost = startCost + finishCost;
  }
  equals(otherNode){
    let retValue = false;
    if (this === otherNode) retValue = true;
    if (this.tile === otherNode.tile) retValue = true;
    if (this.tile.index == otherNode.tile.index) retValue = true;
    // console.log(retValue, this.tile, otherNode.tile)
    return retValue;
  }
}
