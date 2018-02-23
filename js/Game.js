const BOARD_SIZE = 35,
      BLOCK_SIZE = 28,
      PLAY_SIZE = 980,
      SELECTION_SET = new Set([]);
      TILE_ARRAY = [],
      PATH_COLOR = '#b0b0b0',
      CHECKPOINT_LIST = [38, 598, 626, 136, 122, 1102, 1118];

const LAZY = [563, 597, 669, 705, 741, 777, 632, 668, 813, 849, 885, 921, 957, 993, 1029, 1065, 1101, 1137, 1103, 1069, 1035, 967, 1001, 933, 899, 865, 831, 797, 763, 660, 695, 729, 591, 627, 628, 629, 599, 601, 600, 602, 605, 603, 604, 607, 608, 610, 611, 612, 609, 606, 577, 647, 613, 578, 576, 646, 648, 507, 508, 509, 580, 545, 615, 685, 650, 719, 718, 717, 716, 715, 679, 505, 506, 539, 472, 297, 437, 402, 367, 332, 192, 157, 227, 262, 123, 87, 52, 17, 625, 410]

var canvas = document.getElementById("gameCanvas");
var stage = new createjs.Stage(canvas);

function getNeighbors(tile) {
  const neighbors = []
  const nIndexes = [-1, +1, (-1*BOARD_SIZE), BOARD_SIZE];
  for (let i = 0; i < nIndexes.length; i++) {
    let newIndex = tile.index + nIndexes[i];
    if (newIndex < 0 || newIndex > TILE_ARRAY.length - 1) continue;
    let possTile = TILE_ARRAY[newIndex];
    //TODO: Change this to unpathable later
    if (possTile.x != tile.x && possTile.y != tile.y) continue;
    if (possTile.selected) continue;
    neighbors.push(possTile);
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

function deleteMe(object) {
    stage.removeChild(object.shape)
    object = null;
    console.log("poof");
}

createBoard();
for (let shit of LAZY) {
  TILE_ARRAY[shit].clicked()
}

createjs.Ticker.addEventListener("tick", handleTick);

addEventListener('click', (event) => {
  if (event.clientX > 0 && event.clientX < PLAY_SIZE
    && event.clientY > 0 && event.clientY < PLAY_SIZE ) {
    let clickCol = Math.floor(event.clientX / 28);
    let clickRow = Math.floor(event.clientY / 28);
    let tileClicked = getTileAt(clickCol, clickRow);
    tileClicked.clicked();
  }
});

let testEnemy;
let testEnemy2;

addEventListener('keypress', (event) => {
  if (!testEnemy) {
    testEnemy = new Enemy();
    stage.addChild(testEnemy.shape);
  } else {
    testEnemy2 = new Enemy();
    stage.addChild(testEnemy2.shape)
  }
});


function handleTick(event) {
  if (testEnemy) testEnemy.move();
  if (testEnemy2) testEnemy2.move();
  stage.update();
}
