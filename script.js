let sequence = [];
let playerSequence = [];
let colors = ['red', 'green', 'blue', 'yellow'];
let message = document.getElementById('message');
let gameBoard = document.getElementById('gameBoard');

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
    sequence = [];
    playerSequence = [];
    message.textContent = 'Simon says...';
    nextRound();
}

function nextRound() {
    playerSequence = [];
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(nextColor);
    displaySequence();
}

function displaySequence() {
    let i = 0;
    const interval = setInterval(() => {
        lightUp(sequence[i]);
        i++;
        if (i >= sequence.length) {
            clearInterval(interval);
            enablePlayerInput();
        }
    }, 1000);
}

function lightUp(color) {
    const element = document.getElementById(color);
    element.classList.add('active');
    setTimeout(() => {
        element.classList.remove('active');
    }, 500);
}

function enablePlayerInput() {
    gameBoard.addEventListener('click', handlePlayerInput);
}

function handlePlayerInput(event) {
    if (!event.target.classList.contains('color')) return;
    const color = event.target.id;
    playerSequence.push(color);
    lightUp(color);
    if (!checkPlayerSequence()) {
        message.textContent = 'Game Over! Click "Start Game" to try again.';
        gameBoard.removeEventListener('click', handlePlayerInput);
    } else if (playerSequence.length === sequence.length) {
        message.textContent = 'Good job! Simon says...';
        gameBoard.removeEventListener('click', handlePlayerInput);
        setTimeout(nextRound, 1000);
    }
}

function checkPlayerSequence() {
    for (let i = 0; i < playerSequence.length; i++) {
        if (playerSequence[i] !== sequence[i]) {
            return false;
        }
    }
    return true;
}
