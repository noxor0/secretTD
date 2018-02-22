const BOARD_SIZE = 35,
      BLOCK_SIZE = 28,
      PLAY_SIZE = 980,
      SELECTION_SET = new Set([]);
      TILE_ARRAY = [],
      PATH_COLOR = '#b0b0b0',
      CHECKPOINT_LIST = [38, 598, 626, 136, 122, 1102, 1118];

var canvas = document.getElementById("gameCanvas");
var stage = new createjs.Stage(canvas);

function getNeighbors(tile) {
  // if (tile.index == this.checkpointTodo[0]) {
  //   this.checkpointTodo.shift();
  //   this.pathTaken.length = 0;
  // }
  const neighbors = []
  const nIndexes = [-1, +1, (-1*BOARD_SIZE), BOARD_SIZE];
  for (let i = 0; i < nIndexes.length; i++) {
    let possTile = TILE_ARRAY[tile.index + nIndexes[i]];
    //TODO: Change this to unpathable later
    if (possTile && !possTile.selected) {
      neighbors.push(possTile);
    }
  }
  return neighbors
}

function findDistance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function getTileAt(col, row) {
  let index = row * BOARD_SIZE + col;
  return TILE_ARRAY[index]
}

function createBoard() {
  for (let index = 0; index < BOARD_SIZE**2; index++) {
    let tileX = (index % BOARD_SIZE) * BLOCK_SIZE;
    let tileY = Math.floor(index / BOARD_SIZE) * BLOCK_SIZE;
    let currTile;

    if (CHECKPOINT_LIST.includes(index)) {
      currTile = new Tile(tileX, tileY, index, true);
    } else {
      currTile = new Tile(tileX, tileY, index);
    }
    TILE_ARRAY.push(currTile);
    stage.addChild(currTile.shape);
  }
  // uh oh, this doesnt look good
  // feel like this should be handled in tile, but it only needs to be done once
  let vertFill = true;
  for (let chkPoint = 0; chkPoint < CHECKPOINT_LIST.length - 1; chkPoint++) {
    chkStartX = CHECKPOINT_LIST[chkPoint] % BOARD_SIZE;
    chkStartY = Math.floor(CHECKPOINT_LIST[chkPoint] / BOARD_SIZE);
    chkEndX = CHECKPOINT_LIST[chkPoint + 1] % BOARD_SIZE;
    chkEndY = Math.floor(CHECKPOINT_LIST[chkPoint + 1] / BOARD_SIZE);
    // console.log("sX: %d, sY: %d, eX: %d, eY: %d", chkStartX, chkStartY, chkEndX, chkEndY);
    if (vertFill) {
      if (chkStartY > chkEndY) {
        chkEndY = [chkStartY, chkStartY = chkEndY][0];
      }
      for (let i = chkStartY + 1; i < chkEndY; i++) {
        TILE_ARRAY[i * BOARD_SIZE + chkStartX].changePermColor(PATH_COLOR);
      }
    } else {
      if (chkStartX > chkEndX) {
        chkEndX = [chkStartX, chkStartX = chkEndX][0];
      }
      for (let i = chkStartX + 1; i < chkEndX; i++) {
        TILE_ARRAY[chkStartY * BOARD_SIZE + i].changePermColor(PATH_COLOR);
      }
    }

    vertFill = !vertFill;
  }
}

createBoard();
createjs.Ticker.addEventListener("tick", handleTick);

addEventListener('click', (event) => {
  if (event.clientX > 0 && event.clientX < PLAY_SIZE
    && event.clientY > 0 && event.clientY < PLAY_SIZE ) {
    let clickCol = Math.floor(event.clientX / 28);
    let clickRow = Math.floor(event.clientY / 28);
    let tileClicked = getTileAt(clickCol, clickRow);
    tileClicked.clicked(SELECTION_SET);
  }
});

addEventListener('keypress', (event) => {
  // console.log(event);
  testEnemy = new Enemy();
  stage.addChild(testEnemy.shape)
});


// TILE_ARRAY[200].changeColor('purple')
// for (let i = 0; i < getNeighbors(TILE_ARRAY[200]).length; i++) {
//   getNeighbors(TILE_ARRAY[200])[i].changeColor('pink');
// }
// console.log(TILE_ARRAY);

function handleTick(event) {
  // testEnemy.move();
  // stage.addChild(tile);
  stage.update();
}
