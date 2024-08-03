let sequence = [];
let playerSequence = [];
let colors = ['red', 'green', 'blue', 'yellow'];
let message = document.getElementById('message');
let gameBoard = document.getElementById('gameBoard');
let score = 0;
let highScore = 0;
let level = 1;
let timeLeft = 30;
let timer;

document.getElementById('startButton').addEventListener('click', startGame);

function startGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    level = 1;
    timeLeft = 30;
    updateScore();
    updateLevel();
    updateTimeLeft();
    message.textContent = 'Simon says...';
    nextRound();
    startTimer();
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
    }, 1000 - (level * 50));  // Speed up sequence display with each level
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
        updateHighScore();
        clearInterval(timer);
    } else if (playerSequence.length === sequence.length) {
        message.textContent = 'Good job! Simon says...';
        gameBoard.removeEventListener('click', handlePlayerInput);
        score++;
        updateScore();
        level++;
        updateLevel();
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

function updateScore() {
    document.getElementById('score').textContent = score;
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        document.getElementById('highScore').textContent = highScore;
    }
}

function updateLevel() {
    document.getElementById('level').textContent = level;
}

function updateTimeLeft() {
    document.getElementById('timeLeft').textContent = timeLeft;
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimeLeft();
        if (timeLeft <= 0) {
            clearInterval(timer);
            message.textContent = 'Time\'s up! Click "Start Game" to try again.';
            gameBoard.removeEventListener('click', handlePlayerInput);
            updateHighScore();
        }
    }, 1000);
}
