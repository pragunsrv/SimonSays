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
let difficulty = 'easy';
let theme = 'default';
let colorScheme = 'classic';
let speed = 'normal';
let totalGames = 0;
let totalWins = 0;
let totalLosses = 0;
let totalScore = 0;
let averageScore = 0;
let longestStreak = 0;
let currentStreak = 0;
let achievements = {
    firstWin: false,
    score10: false,
    score20: false,
    score30: false,
    win5Games: false,
    longestStreak: false,
};
let gameHistory = [];

// Event listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('difficulty').addEventListener('change', updateDifficulty);
document.getElementById('theme').addEventListener('change', updateTheme);
document.getElementById('colorScheme').addEventListener('change', updateColorScheme);
document.getElementById('speed').addEventListener('change', updateSpeed);
document.getElementById('feedbackForm').addEventListener('submit', submitFeedback);

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
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    playerSequence = [];
    flashSequence();
    enablePlayerInput();
}

function flashSequence() {
    let index = 0;
    const interval = setInterval(() => {
        if (index < sequence.length) {
            lightUp(sequence[index]);
            index++;
        } else {
            clearInterval(interval);
        }
    }, getSpeed());
}

function lightUp(color) {
    const element = document.getElementById(color);
    element.classList.add('active');
    setTimeout(() => element.classList.remove('active'), getSpeed() / 2);
}

function enablePlayerInput() {
    gameBoard.addEventListener('click', handlePlayerInput);
}

function handlePlayerInput(event) {
    if (event.target.classList.contains('color')) {
        const color = event.target.id;
        playerSequence.push(color);
        lightUp(color);
        checkSequence();
    }
}

function checkSequence() {
    const isCorrect = sequence.every((color, index) => color === playerSequence[index]);
    if (!isCorrect || playerSequence.length === sequence.length) {
        gameBoard.removeEventListener('click', handlePlayerInput);
        if (isCorrect) {
            score++;
            updateScore();
            level++;
            updateLevel();
            nextRound();
        } else {
            message.textContent = 'Game Over! Click "Start Game" to try again.';
            clearInterval(timer);
            updateHighScore();
            totalLosses++;
            updateStatistics();
            addToHistory('Game Over');
            currentStreak = 0;
            updateAchievements();
        }
    }
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
            totalLosses++;
            updateStatistics();
            addToHistory('Time Up');
            currentStreak = 0;
            updateAchievements();
        }
    }, 1000);
}

function updateDifficulty() {
    difficulty = document.getElementById('difficulty').value;
}

function updateSpeed() {
    speed = document.getElementById('speed').value;
}

function getSpeed() {
    switch (speed) {
        case 'normal':
            return 1000;
        case 'fast':
            return 750;
        case 'veryFast':
            return 500;
        default:
            return 1000;
    }
}

function updateTheme() {
    theme = document.getElementById('theme').value;
    document.body.className = `${theme}-theme`;
}

function updateColorScheme() {
    colorScheme = document.getElementById('colorScheme').value;
    document.body.className = `${colorScheme}-theme`;
}

function updateStatistics() {
    document.getElementById('totalGames').textContent = totalGames;
    document.getElementById('totalWins').textContent = totalWins;
    document.getElementById('totalLosses').textContent = totalLosses;
    totalScore += score;
    averageScore = (totalGames > 0) ? (totalScore / totalGames).toFixed(2) : 0;
    document.getElementById('averageScore').textContent = averageScore;
    document.getElementById('longestStreak').textContent = longestStreak;
}

function updateAchievements() {
    checkAchievements();
    checkLongestStreak();
}

function checkAchievements() {
    if (!achievements.firstWin && totalWins === 1) {
        achievements.firstWin = true;
        document.getElementById('firstWin').textContent = 'Achieved';
    }
    if (!achievements.score10 && score >= 10) {
        achievements.score10 = true;
        document.getElementById('score10').textContent = 'Achieved';
    }
    if (!achievements.score20 && score >= 20) {
        achievements.score20 = true;
        document.getElementById('score20').textContent = 'Achieved';
    }
    if (!achievements.score30 && score >= 30) {
        achievements.score30 = true;
        document.getElementById('score30').textContent = 'Achieved';
    }
    if (!achievements.win5Games && totalWins >= 5) {
        achievements.win5Games = true;
        document.getElementById('win5Games').textContent = 'Achieved';
    }
}

function checkLongestStreak() {
    if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        document.getElementById('longestStreakAchieved').textContent = 'Achieved';
    }
}

function addToHistory(event) {
    const historyList = document.getElementById('historyList');
    const listItem = document.createElement('li');
    listItem.textContent = event;
    historyList.appendChild(listItem);
}

function submitFeedback(event) {
    event.preventDefault();
    const feedback = document.getElementById('feedbackInput').value;
    document.getElementById('feedbackMessage').textContent = 'Thank you for your feedback!';
    addToHistory(`Feedback Submitted: ${feedback}`);
    document.getElementById('feedbackInput').value = '';
}
