const scorePanel = document.getElementById("score");

const gridSize = 5; // mude aqui o tamanho da grid (3 = 3x3, 5 = 5x5, etc.)
const board = document.getElementById("board");
const totalCells = gridSize * gridSize;
const cells = [];

for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("figures-btn");
    board.appendChild(cell);
    cells.push(cell);
}


// Dados do jogo
const figures = ["🌐", "💻", "🎈", "📎", "👓", "🐺", "👁️", "💎", "🚓"];
let usedPositions = [];
let lastSpawn = null;
let correctClicks = 0;
let score = 0;
const basePoints = 10;

function startGame() {
    resetBoard();
    spawnFigure();
    updateScore();
    startTimer();
}

// Adiciona eventos a todas as células
cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleClick(index));
});

function handleClick(index) {
    // Esconde figuras rapidamente (efeito “piscar”)
    hideAllFigures();

    setTimeout(() => {
        // Verifica se clicou na última figura adicionada
        if (lastSpawn === index) {
            correctClicks++;
            score += correctClicks * basePoints;

            // Se o tabuleiro ainda tiver espaço, adiciona mais uma figura
            if (usedPositions.length < totalCells) {
                spawnFigure();
            } else {
                // Se encheu, reseta mas mantém o multiplicador
                usedPositions = [];
                clearBoard();
                spawnFigure();
            }
        } else {
            // Errou: zera tudo
            correctClicks = 0;
            usedPositions = [];
            clearBoard();
            spawnFigure();
        }

        updateScore();
        showAllFigures(); // reaparece depois do piscar
    }, 200); // 0.2 segundos
}

function spawnFigure() {
    // Escolhe posição aleatória livre
    const freePositions = cells
        .map((_, i) => i)
        .filter(i => !usedPositions.includes(i));

    if (freePositions.length === 0) return;

    const randomPosition = freePositions[Math.floor(Math.random() * freePositions.length)];
    const randomFigure = figures[Math.floor(Math.random() * figures.length)];

    cells[randomPosition].textContent = randomFigure;
    usedPositions.push(randomPosition);
    lastSpawn = randomPosition;
}

function resetBoard() {
    correctClicks = 0;
    score = 0;
    usedPositions = [];
    clearBoard();
}

function clearBoard() {
    cells.forEach(cell => (cell.textContent = ""));
}

function hideAllFigures() {
    cells.forEach(cell => (cell.style.visibility = "hidden"));
}

function showAllFigures() {
    cells.forEach(cell => (cell.style.visibility = "visible"));
}

function updateScore() {
    scorePanel.textContent = `Score: ${score}`;
}

// Temporizador
const timerDisplay = document.getElementById("timer");
let timeLeft = 30;
let timerInterval = null;

function startTimer() {
    timeLeft = 30;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

function endGame() {
    alert("TIME IS UP!");
    saveScore();
    resetBoard();
    showLeaderboard();
}

// SALVAR PONTUAÇÃO DO JOGADOR LOCAL
function saveScore() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    let playerName = prompt(`Score Register: ${score}`, "Player_1");
    if (!playerName) playerName = "Player_1";
    playerName = playerName.substring(0, 12).toUpperCase();

    leaderboard.push({ name: playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10); // mantém só os 10 melhores

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    showLeaderboard();
}

function showLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    console.clear();
    console.log("🏆 LEADERBOARD:");
    leaderboard.forEach((entry, i) => {
        console.log(`${i + 1}. ${entry.name} - ${entry.score}`);
    });
    startGame()
}

startGame()
