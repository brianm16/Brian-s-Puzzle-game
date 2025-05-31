const puzzleContainer = document.getElementById('puzzle-container');
const shuffleButton = document.getElementById('shuffle-button');
const movesDisplay = document.getElementById('moves');
let tiles = [];
let emptyTileIndex;
let gridSize = 3; // Adjust for puzzle size (e.g., 3 for 3x3)
let moves = 0;

function createPuzzle() {
    puzzleContainer.innerHTML = '';
    tiles = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
    tiles.push(null); // Represent the empty tile
    emptyTileIndex = tiles.length - 1;

    tiles.forEach((number, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.textContent = number;
        tile.dataset.index = index;

        if (number === null) {
            tile.classList.add('empty-tile');
        } else {
            tile.addEventListener('click', () => moveTile(index));
        }

        puzzleContainer.appendChild(tile);
    });

    puzzleContainer.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
    puzzleContainer.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;
}

function shufflePuzzle() {
    let currentIndex = tiles.length;
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [tiles[currentIndex], tiles[randomIndex]] = [tiles[randomIndex], tiles[currentIndex]];
    }
    emptyTileIndex = tiles.indexOf(null);
    updatePuzzleDisplay();
    resetMoves();
}

function updatePuzzleDisplay() {
    const tileElements = puzzleContainer.children;
    for (let i = 0; i < tileElements.length; i++) {
        tileElements[i].textContent = tiles[i];
        tileElements[i].dataset.index = i;
        tileElements[i].className = 'tile';
        if (tiles[i] === null) {
            tileElements[i].classList.add('empty-tile');
            tileElements[i].removeEventListener('click', moveTile);
        } else {
            tileElements[i].addEventListener('click', () => moveTile(i));
        }
    }
}

function moveTile(clickedIndex) {
    const clickedRow = Math.floor(clickedIndex / gridSize);
    const clickedCol = clickedIndex % gridSize;
    const emptyRow = Math.floor(emptyTileIndex / gridSize);
    const emptyCol = emptyTileIndex % gridSize;

    const isAdjacent =
        (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
        (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

    if (isAdjacent) {
        [tiles[clickedIndex], tiles[emptyTileIndex]] = [tiles[emptyTileIndex], tiles[clickedIndex]];
        emptyTileIndex = clickedIndex;
        updatePuzzleDisplay();
        incrementMoves();
        if (checkWin()) {
            setTimeout(() => alert('Congratulations! You solved the puzzle in ' + moves + ' moves!'), 300);
        }
    }
}

function incrementMoves() {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
}

function resetMoves() {
    moves = 0;
    movesDisplay.textContent = `Moves: ${moves}`;
}

function checkWin() {
    const solvedState = Array.from({ length: gridSize * gridSize - 1 }, (_, i) => i + 1);
    solvedState.push(null);
    return JSON.stringify(tiles) === JSON.stringify(solvedState);
}

// Initialize the puzzle
createPuzzle();
shufflePuzzle();

// Event listener for the shuffle button
shuffleButton.addEventListener('click', shufflePuzzle);