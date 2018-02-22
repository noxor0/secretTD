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
    if (this === otherNode) return true;
    if (this.tile === otherNode.tile) return true;
    if (this.tile.x == otherNode.tile.x && this.tile.y == otherNode.tile.y) return true;
    return false;
  }
}
