const SELECTED_COLOR = 'green',
      CHECKPOINT_COLOR = 'blue',
      TILE_COLOR = 'grey';

class Tile {
  constructor(x, y, index, checkpoint) {
    this.x = x;
    this.y = y;
    this.color = TILE_COLOR;
    this.selected = false;
    this.tower = null;
    this.checkpoint = checkpoint;
    this.index = index;

    if (checkpoint) {
      this.color = CHECKPOINT_COLOR;
    }

    this.shape = new createjs.Shape();
    this.shape.graphics.beginStroke("black").beginFill(this.color);
    this.shape.graphics.drawRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
  }

  changeColor(color) {
    this.color = color
    this.shape.graphics.beginStroke("black").beginFill(this.color);
    this.shape.graphics.drawRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
    return true
  }

  clicked(SELECTION_SET) {
    this.selected = !this.selected;
    let newColor;
    if (this.selected) {
      newColor = SELECTED_COLOR;
      SELECTION_SET.add(this);
    } else {
      newColor = this.color;
      SELECTION_SET.delete(this);
    }
    this.shape.graphics.beginStroke("black").beginFill(newColor);
    this.shape.graphics.drawRect(this.x, this.y, BLOCK_SIZE, BLOCK_SIZE);
    return true
  }

};
