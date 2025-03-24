const game = {
    board: Array(9).fill(''),
    currentPlayer: 'X',
    gameMode: '2player',
    scores: { X: 0, O: 0, draw: 0 },
    isGameActive: true,
    winningCombos: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
};

// DOM Elements
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');
const modeToggle = document.getElementById('mode-toggle');
const themeToggle = document.getElementById('theme-toggle');

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
modeToggle.addEventListener('click', toggleGameMode);
themeToggle.addEventListener('click', toggleTheme);

function handleCellClick(e) {
    const index = e.target.dataset.index;
    
    if (!game.isGameActive || game.board[index]) return;

    game.board[index] = game.currentPlayer;
    e.target.textContent = game.currentPlayer;
    e.target.classList.add(game.currentPlayer.toLowerCase());
    
    if (checkWin()) {
        updateScores(game.currentPlayer);
        highlightWinningCombo();
        game.isGameActive = false;
    } else if (game.board.every(cell => cell)) {
        updateScores('draw');
        game.isGameActive = false;
    } else {
        game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
        if (game.gameMode === 'ai' && game.currentPlayer === 'O') {
            setTimeout(makeAIMove, 500);
        }
    }
}

function checkWin() {
    return game.winningCombos.some(combo => {
        if (combo.every(index => game.board[index] === game.currentPlayer)) {
            game.winningCombo = combo;
            return true;
        }
    });
}

function makeAIMove() {
    const emptyCells = game.board
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);
    
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    cells[randomIndex].click();
}

function highlightWinningCombo() {
    game.winningCombo.forEach(index => {
        cells[index].classList.add('winning-cell');
    });
}

function updateScores(result) {
    if (result === 'draw') {
        game.scores.draw++;
        document.getElementById('score-draw').textContent = game.scores.draw;
    } else {
        game.scores[result]++;
        document.getElementById(`score-${result.toLowerCase()}`).textContent = game.scores[result];
    }
}

function restartGame() {
    game.board = Array(9).fill('');
    game.isGameActive = true;
    game.currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
}

function toggleGameMode() {
    game.gameMode = game.gameMode === '2player' ? 'ai' : '2player';
    modeToggle.textContent = game.gameMode === 'ai' ? 'Switch to 2 Player' : 'Switch to AI';
    restartGame();
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}