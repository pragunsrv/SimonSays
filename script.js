// script.js
const colors = ['red', 'green', 'blue', 'yellow'];
let sequence = [];
let playerSequence = [];
let score = 0;
let level = 1;
let timer;
let timeLeft = 30;
let currentStreak = 0;
let longestStreak = 0;
let totalGames = 0;
let totalWins = 0;
let totalLosses = 0;
let highScore = 0;
let totalScore = 0;
let averageScore = 0;
let autoStart = false;
let colorBlindMode = false;
let showHints = false;
let hintInterval = 5;
let speed = 'normal';
let difficulty = 'easy';
let theme = 'light';
let colorScheme = 'default';
let playerNames = {}; // For multiplayer mode
let gameHistory = [];
let achievements = {
    firstWin: false,
    score10: false,
    score20: false,
    score30: false,
    win5Games: false,
    consecutiveWins: false,
    complete10Rounds: false
};

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('difficulty').addEventListener('change', updateDifficulty);
document.getElementById('theme').addEventListener('change', updateTheme);
document.getElementById('colorScheme').addEventListener('change', updateColorScheme);
document.getElementById('speed').addEventListener('change', updateSpeed);
document.getElementById('showHints').addEventListener('change', updateHints);
document.getElementById('autoStart').addEventListener('change', () => {
    autoStart = document.getElementById('autoStart').checked;
});
document.getElementById('colorBlindMode').addEventListener('change', () => {
    colorBlindMode = document.getElementById('colorBlindMode').checked;
    updateColorScheme();
});
document.getElementById('hintInterval').addEventListener('change', () => {
    hintInterval = parseInt(document.getElementById('hintInterval').value, 10);
});
document.getElementById('feedbackForm').addEventListener('submit', submitFeedback);
document.getElementById('multiplayerMode').addEventListener('change', toggleMultiplayerMode);
document.getElementById('colorPicker').addEventListener('change', updateColorPicker);

function startGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    level = 1;
    timeLeft = 30;
    currentStreak = 0;
    totalGames++;
    updateScore();
    updateLevel();
    updateTimeLeft();
    startTimer();
    nextRound();
}

function nextRound() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    playerSequence = [];
    flashSequence();
    enablePlayerInput();
    if (showHints) {
        setTimeout(() => showHintsToPlayer(), hintInterval * 1000);
    }
}

function showHintsToPlayer() {
    if (sequence.length > 0) {
        message.textContent = `Hint: The next color is ${sequence[sequence.length - 1].toUpperCase()}`;
        setTimeout(() => message.textContent = '', 2000);
    }
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
            currentStreak++;
            updateScore();
            level++;
            updateLevel();
            if (autoStart) {
                nextRound();
            } else {
                message.textContent = 'Correct! Click "Start Game" to continue.';
            }
        } else {
            gameBoard.removeEventListener('click', handlePlayerInput);
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
    if (colorBlindMode) {
        document.body.classList.add('color-blind');
    } else {
        document.body.classList.remove('color-blind');
    }
}

function updateHints() {
    showHints = document.getElementById('showHints').checked;
    if (showHints) {
        message.textContent = 'Hints are now enabled!';
    } else {
        message.textContent = '';
    }
}

function updateColorPicker() {
    const colorInputs = document.querySelectorAll('.colorPicker');
    colorInputs.forEach(input => {
        colors[input.id] = input.value;
    });
    updateColorScheme();
}

function toggleMultiplayerMode() {
    const multiplayer = document.getElementById('multiplayerMode').checked;
    if (multiplayer) {
        document.getElementById('playerNameInput').style.display = 'block';
        document.getElementById('submitPlayerName').style.display = 'block';
    } else {
        document.getElementById('playerNameInput').style.display = 'none';
        document.getElementById('submitPlayerName').style.display = 'none';
    }
}

function submitPlayerName(event) {
    event.preventDefault();
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        playerNames[playerName] = { score: 0, games: 0 };
        document.getElementById('playerName').value = '';
    }
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
    if (!achievements.consecutiveWins && currentStreak >= 3) {
        achievements.consecutiveWins = true;
        document.getElementById('consecutiveWins').textContent = 'Achieved';
    }
    if (!achievements.complete10Rounds && totalGames >= 10) {
        achievements.complete10Rounds = true;
        document.getElementById('complete10Rounds').textContent = 'Achieved';
    }
}

function checkLongestStreak() {
    if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
    }
}

function addToHistory(event) {
    gameHistory.push({ event, score, timestamp: new Date().toLocaleString() });
    updateGameHistory();
}

function updateGameHistory() {
    const historyContainer = document.getElementById('gameHistory');
    historyContainer.innerHTML = '';
    gameHistory.forEach(entry => {
        const p = document.createElement('p');
        p.textContent = `${entry.timestamp}: ${entry.event} - Score: ${entry.score}`;
        historyContainer.appendChild(p);
    });
}

function submitFeedback(event) {
    event.preventDefault();
    const feedback = document.getElementById('feedback').value;
    if (feedback) {
        addToHistory(`Feedback Submitted: ${feedback}`);
        document.getElementById('feedback').value = '';
        alert('Feedback submitted. Thank you!');
    }
}
