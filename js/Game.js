const BOARD_SIZE = 35,
      BLOCK_SIZE = 28,
      PLAY_SIZE = 980,
      SELECTION_SET = new Set([]);
      TILE_ARRAY = [],
      PATH_COLOR = '#b0b0b0',
      CHECKPOINT_LIST = [38, 598, 626, 136, 122, 1102, 1118];

var canvas = document.getElementById("gameCanvas");
var stage = new createjs.Stage(canvas);

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
      currTile = new Tile(tileX, tileY, true);
    } else {
      currTile = new Tile(tileX, tileY);
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
        TILE_ARRAY[i * BOARD_SIZE + chkStartX].changeColor(PATH_COLOR);
      }
    } else {
      if (chkStartX > chkEndX) {
        chkEndX = [chkStartX, chkStartX = chkEndX][0];
      }
      for (let i = chkStartX + 1; i < chkEndX; i++) {
        TILE_ARRAY[chkStartY * BOARD_SIZE + i].changeColor(PATH_COLOR);
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

testEnemy = new Enemy();
stage.addChild(testEnemy.shape)

function handleTick(event) {
  testEnemy.move()

   // stage.addChild(tile);
   stage.update();
}
