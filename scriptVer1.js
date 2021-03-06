"use strict";

const board = document.querySelector(".board");
const bombsMarked = document.querySelector("#bombs-marked");
const refreshBtn = document.querySelector("#refresh");
const width = 10;
const bombs = 15;
const tiles = [];
let isGameOver = false;
let markers = 0;

//reloads the page
refreshBtn.addEventListener("click", (e) => {
  if (confirm("restart the game?") == true) {
    location.reload();
  } else {
    return;
  }
});

function createBoard() {
  bombsMarked.innerHTML = `💣 ${bombs} left 💣`;

  //create bombs and safe tiles
  const bombsArray = Array(bombs).fill("bomb");
  const safeArray = Array(width * width - bombs).fill("safe");
  const combinedArray = safeArray.concat(bombsArray);
  const shuffledArray = combinedArray.sort(() => Math.random() - 0.5);

  //create tiles inside the board
  for (let i = 0; i < width * width; i++) {
    const tile = document.createElement("div");
    tile.setAttribute("id", i);
    tile.classList = shuffledArray[i];
    tile.classList.add("hidden");
    board.appendChild(tile);
    tiles.push(tile);

    tile.addEventListener("click", (e) => {
      click(tile);
    });

    //right click listener
    tile.oncontextmenu = function (e) {
      e.preventDefault();
      addMarked(tile);
    };
  }

  //add adj numbers
  for (let i = 0; i < tiles.length; i++) {
    //variable to identify the left and right edge in a 10x10 grid
    const leftEdge = i % width === 0;
    const rightEdge = i === width - 1;
    let bombNearby = 0;

    if (tiles[i].classList.contains("safe")) {
      //checking if west tile contains bomb, if true number to appear on selected tile ++.
      if (i > 0 && !leftEdge && tiles[i - 1].classList.contains("bomb")) {
        bombNearby++;
      }

      //check north-east tile
      if (
        i > 9 &&
        !rightEdge &&
        tiles[i + 1 - width].classList.contains("bomb")
      ) {
        bombNearby++;
      }

      // check north tile
      if (i > 10 && tiles[i - width].classList.contains("bomb")) {
        bombNearby++;
      }

      // check northwest tile
      if (
        i > 11 &&
        !leftEdge &&
        tiles[i - 1 - width].classList.contains("bomb")
      ) {
        bombNearby++;
      }

      //check east tile
      if (i < 98 && !rightEdge && tiles[i + 1].classList.contains("bomb")) {
        bombNearby++;
      }

      //check southwest tile
      if (
        i < 90 &&
        !leftEdge &&
        tiles[i - 1 + width].classList.contains("bomb")
      ) {
        bombNearby++;
      }

      //check southeast tile
      if (
        i < 88 &&
        !rightEdge &&
        tiles[i + 1 + width].classList.contains("bomb")
      ) {
        bombNearby++;
      }

      //check south tile
      if (i < 89 && tiles[i + width].classList.contains("bomb")) {
        bombNearby++;
      }
      //
      tiles[i].setAttribute("data", bombNearby);
    }
  }
}

createBoard();

//when left click on a tile
function click(tile) {
  let tileId = tile.id;

  if (isGameOver) {
    return;
  } else if (
    tile.classList.contains("checked") ||
    tile.classList.contains("markers")
  ) {
    return;
  } else if (tile.classList.contains("bomb")) {
    gameOver(tile);
  } else {
    let number = tile.getAttribute("data");
    if (number != 0) {
      tile.classList.add("checked"); // add another class to the tile
      tile.classList.remove("hidden");
      tile.innerHTML = number;
      if (number == 1) {
        tile.classList.add("one");
      }
      if (number == 2) {
        tile.classList.add("two");
      }
      if (number == 3) {
        tile.classList.add("three");
      }
      if (number == 4) {
        tile.classList.add("four");
      }
      return;
    }
  }

  //if none of the conditions are met this check tile will run.
  //meaning the tile that has data number 0 will fan out after goin thru a recursion
  //this will break when it fans out to a tile with a data number > 0
  checkTile(tile, tileId);
  tile.classList.add("checked"); // if the number === 0 it is only given a class, innerHTML given.
  tile.classList.remove("hidden");
}

//when rightclick on the tile

function addMarked(tile) {
  if (isGameOver) {
    return;
  } else if (!tile.classList.contains("checked") && markers < bombs) {
    if (!tile.classList.contains("markers")) {
      tile.classList.add("markers");
      tile.innerHTML = "❓";
      markers++;
      bombsMarked.innerHTML = `💣 ${bombs - markers} left 💣`;
      checkForWin();
    } else {
      tile.classList.remove("markers");
      tile.innerHTML = "";
      markers--;
      bombsMarked.innerHTML = `💣 ${bombs - markers} left 💣`;
    }
  }
}

function gameOver(tile) {
  alert("You have triggered the bomb! Game over.");
  isGameOver = true;

  tiles.forEach((tile) => {
    if (tile.classList.contains("bomb")) {
      tile.innerHTML = "💥";
      tile.classList.remove("hidden");
    }
  });
}

//similar method to the above for checkign adj tiles
function checkTile(tile, tileId) {
  const leftEdge = tileId % width === 0;
  const rightEdge = tileId % width === width - 1;

  setTimeout(() => {
    if (tileId > 0 && !leftEdge) {
      const newId = parseInt(tileId) - 1;
      const newTile = document.getElementById(newId);
      click(newTile);
    }

    if (tileId > 9 && !rightEdge) {
      const newId = parseInt(tileId) + 1 - width;
      const newTile = document.getElementById(newId);
      click(newTile);
    }

    if (tileId > 10) {
      const newId = parseInt(tileId) - width;
      const newTile = document.getElementById(newId);
      click(newTile);
    }

    if (tileId > 11 && !leftEdge) {
      const newId = parseInt(tileId) - 1 - width;
      const newTile = document.getElementById(newId);
      click(newTile);
    }

    if (tileId < 98 && !rightEdge) {
      const newId = parseInt(tileId) + 1;
      const newTile = document.getElementById(newId);
      click(newTile);
    }

    if (tileId < 90 && !leftEdge) {
      const newId = parseInt(tileId) - 1 + width;
      const newTile = document.getElementById(newId);
      click(newTile);
    }

    if (tileId < 88 && !rightEdge) {
      const newId = parseInt(tileId) + 1 + width;
      const newTile = document.getElementById(newId);
      click(newTile);
    }

    if (tileId < 89) {
      const newId = parseInt(tileId) + width;
      const newTile = document.getElementById(newId);
      click(newTile);
    }
  }, 10);
}

function checkForWin() {
  let match = 0;

  for (let i = 0; i < tiles.length; i++) {
    if (
      tiles[i].classList.contains("markers") &&
      tiles[i].classList.contains("bomb")
    ) {
      match++;
    }
  }
  if (match === bombs) {
    alert("You have won! You found all the bombs!");
    isGameOver = true;

    tiles.forEach((tile) => {
      if (tile.classList.contains("bomb")) {
        tile.innerHTML = "💣";
        tile.classList.remove("hidden");
        tile.classList.remove("markers");
      }
    });
  }
}
