document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('puzzle-grid');
    const scoreDisplay = document.getElementById('score');
    const completeButton = document.getElementById('complete-button');
    const logButton = document.getElementById('log-button');

    let score = 0;
    let scoreInterval;
    let correctRoute = []; // 今回のゲームの正解ルート
    const allPossibleRoutes = [
        // 横のライン
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        // 縦のライン
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        // 斜めのライン
        [0, 4, 8], [2, 4, 6]
    ];
    let selectedIndices = [];

    function initializeGame() {
        score = 0;
        updateScoreDisplay();
        createGrid();
        startScoring();
        completeButton.style.display = 'none'; // 最初は完了ボタンを隠す
        // 正解ルートをランダムに選択
        correctRoute = allPossibleRoutes[Math.floor(Math.random() * allPossibleRoutes.length)];
    }

    function createGrid() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = i; // クリックされたセルを特定するためのインデックス
            cell.textContent = '未選択';
            gridContainer.appendChild(cell);
        }
    }

    function startScoring() {
        if (scoreTimer) clearInterval(scoreTimer);
        scoreTimer = setInterval(() => {
            score++;
            updateScoreDisplay();
        }, 5000);
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = score;
    }

    gridContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('grid-cell')) {
            e.target.classList.toggle('selected');
            e.target.textContent = e.target.classList.contains('selected') ? '選択済' : '未選択';
            checkSolution();
        }
    });

    function checkSolution() {
        const selectedCells = document.querySelectorAll('.grid-cell.selected');
        const selectedIndexes = Array.from(selectedCells).map(cell => parseInt(cell.dataset.index));

        // 選択されたインデックスをソートして、正解ルートと比較
        const isCorrect = JSON.stringify(selectedIndexes.sort((a, b) => a - b)) === JSON.stringify(correctRoute.sort((a, b) => a - b));

        if (isCorrect) {
            completeButton.style.display = 'block';
            if (scoreTimer) clearInterval(scoreTimer); // 正解したらスコア加算を停止
        } else {
            completeButton.style.display = 'none';
        }
    }

    completeButton.addEventListener('click', () => {
        localStorage.setItem('finalScore', score);
        window.location.href = 'result.html';
    });

    logButton.addEventListener('click', () => {
        alert('この機能は現在開発中です。');
    });

    initializeGame();
});
