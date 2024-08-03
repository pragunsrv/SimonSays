// script.js
const colors = ['red', 'green', 'blue', 'yellow'];
let sequence = [];
let userSequence = [];
let score = 0;
let highScore = 0;
let level = 1;
let timeLeft = 30;
let showHints = false;
let hintInterval = 5;
let autoStart = false;
let playerName = '';
let playerScores = {};
let userProfiles = {};
let achievements = {
    firstWin: false,
    score10: false,
    score20: false,
    score30: false,
    win5Games: false,
    consecutiveWins: 0,
    complete10Rounds: false,
};

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('difficulty').addEventListener('change', setDifficulty);
document.getElementById('theme').addEventListener('change', setTheme);
document.getElementById('speed').addEventListener('change', setSpeed);
document.getElementById('showHints').addEventListener('change', setHints);
document.getElementById('hintInterval').addEventListener('change', setHintInterval);
document.getElementById('multiplayerMode').addEventListener('change', toggleMultiplayer);
document.getElementById('submitPlayerName').addEventListener('click', submitPlayerName);
document.getElementById('saveProfile').addEventListener('click', saveProfile);

document.querySelectorAll('.color').forEach(color => {
    color.addEventListener('click', () => handleUserInput(color.id));
});

document.querySelectorAll('.colorPicker').forEach(picker => {
    picker.addEventListener('change', updateColor);
});

function startGame() {
    resetGame();
    if (autoStart) {
        nextSequence();
    }
}

function setDifficulty() {
    const difficulty = document.getElementById('difficulty').value;
    // Adjust game settings based on difficulty
}

function setTheme() {
    const theme = document.getElementById('theme').value;
    document.body.className = `${theme}-theme`;
}

function setSpeed() {
    const speed = document.getElementById('speed').value;
    // Adjust game speed based on selected option
}

function setHints() {
    showHints = document.getElementById('showHints').checked;
}

function setHintInterval() {
    hintInterval = parseInt(document.getElementById('hintInterval').value, 10);
}

function toggleMultiplayer() {
    const multiplayer = document.getElementById('multiplayerMode').checked;
    if (multiplayer) {
        document.getElementById('playerNameInput').style.display = 'block';
        document.getElementById('leaderboard').style.display = 'block';
    } else {
        document.getElementById('playerNameInput').style.display = 'none';
        document.getElementById('leaderboard').style.display = 'none';
    }
}

function submitPlayerName() {
    playerName = document.getElementById('playerName').value;
    if (playerName) {
        playerScores[playerName] = 0;
        updateLeaderboard();
    }
}

function saveProfile() {
    const username = document.getElementById('username').value;
    userProfiles[username] = {
        score: score,
        highScore: highScore,
        settings: {
            theme: document.getElementById('theme').value,
            difficulty: document.getElementById('difficulty').value
        }
    };
    document.getElementById('profileInfo').innerText = `Profile Saved: ${username}`;
}

function updateLeaderboard() {
    const leaderboard = document.getElementById('leaderboardList');
    leaderboard.innerHTML = '';
    Object.keys(playerScores).forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player}: ${playerScores[player]}`;
        leaderboard.appendChild(li);
    });
}

function updateColor(event) {
    const color = event.target.id;
    document.getElementById(color).style.backgroundColor = event.target.value;
}

function resetGame() {
    sequence = [];
    userSequence = [];
    score = 0;
    level = 1;
    timeLeft = 30;
    updateDisplay();
}

function nextSequence() {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    // Logic to animate sequence
}

function updateDisplay() {
    document.getElementById('score').innerText = score;
    document.getElementById('highScore').innerText = highScore;
    document.getElementById('level').innerText = level;
    document.getElementById('timeLeft').innerText = timeLeft;
    document.getElementById('totalGames').innerText = 0; // Update with actual data
    document.getElementById('totalWins').innerText = 0; // Update with actual data
    document.getElementById('totalLosses').innerText = 0; // Update with actual data
    document.getElementById('averageScore').innerText = 0; // Update with actual data
    document.getElementById('longestStreak').innerText = 0; // Update with actual data
    document.getElementById('highestScore').innerText = 0; // Update with actual data
    document.getElementById('avgReactionTime').innerText = 0; // Update with actual data

    document.getElementById('firstWin').innerText = achievements.firstWin ? 'Achieved' : 'Not Achieved';
    document.getElementById('score10').innerText = achievements.score10 ? 'Achieved' : 'Not Achieved';
    document.getElementById('score20').innerText = achievements.score20 ? 'Achieved' : 'Not Achieved';
    document.getElementById('score30').innerText = achievements.score30 ? 'Achieved' : 'Not Achieved';
    document.getElementById('win5Games').innerText = achievements.win5Games ? 'Achieved' : 'Not Achieved';
    document.getElementById('consecutiveWins').innerText = achievements.consecutiveWins ? 'Achieved' : 'Not Achieved';
    document.getElementById('complete10Rounds').innerText = achievements.complete10Rounds ? 'Achieved' : 'Not Achieved';
}

function handleUserInput(color) {
    userSequence.push(color);
    // Logic to check user input against sequence
}
