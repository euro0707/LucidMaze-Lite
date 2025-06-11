document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('puzzle-grid');
    const scoreDisplay = document.getElementById('score');
    const completeButton = document.getElementById('complete-button');
    const logButton = document.getElementById('log-button');

    // 難易度ごとの設定
    const difficultySettings = {
        easy: {
            gridSize: 9,
            gridColumns: 3,
            allPossibleRoutes: [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // 縦
                [0, 4, 8], [2, 4, 6]             // 斜め
            ]
        },
        normal: {
            gridSize: 16,
            gridColumns: 4,
            allPossibleRoutes: [
                [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // 横
                [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // 縦
                [0, 5, 10, 15], [3, 6, 9, 12] // 斜め
            ]
        },
        hard: {
            gridSize: 25,
            gridColumns: 5,
            allPossibleRoutes: [
                [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], // 横
                [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], // 縦
                [0, 6, 12, 18, 24], [4, 8, 12, 16, 20] // 斜め
            ]
        }
    };

    let score = 0;
    let scoreTimer;
    let correctRoute = [];

    // URLから難易度を取得する関数
    function getDifficultyFromURL() {
        const params = new URLSearchParams(window.location.search);
        const difficulty = params.get('difficulty');
        // URLの難易度が有効なものでなければ 'easy' を返す
        if (difficulty && difficultySettings[difficulty]) {
            return difficulty;
        }
        return 'easy'; // デフォルト難易度
    }

    // ゲームを初期化する関数
    function initializeGame() {
        const difficulty = getDifficultyFromURL();
        const settings = difficultySettings[difficulty];

        // 正解ルートをランダムに選択
        correctRoute = settings.allPossibleRoutes[Math.floor(Math.random() * settings.allPossibleRoutes.length)];
        console.log(`Difficulty: ${difficulty}, Correct route:`, correctRoute); // デバッグ用
        
        score = 0;
        updateScoreDisplay();
        createGrid(settings);
        startScoring();
        completeButton.style.display = 'none';
    }

    // グリッドを生成する関数
    function createGrid(settings) {
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${settings.gridColumns}, 1fr)`;

        for (let i = 0; i < settings.gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = i;
            cell.textContent = '未選択';

            cell.addEventListener('click', () => {
                if (completeButton.style.display === 'block') return;

                const index = parseInt(cell.dataset.index, 10);

                if (correctRoute.includes(index)) {
                    cell.classList.toggle('selected');
                    cell.textContent = cell.classList.contains('selected') ? '選択済' : '未選択';
                    checkSolution();
                } else {
                    score += 3;
                    updateScoreDisplay();
                    cell.classList.add('error-flash');
                    setTimeout(() => cell.classList.remove('error-flash'), 500);
                }
            });

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

    function checkSolution() {
        const selectedCells = document.querySelectorAll('.grid-cell.selected');
        const selectedIndexes = Array.from(selectedCells).map(cell => parseInt(cell.dataset.index));
        const isCorrect = correctRoute.length === selectedIndexes.length && correctRoute.every(index => selectedIndexes.includes(index));

        if (isCorrect) {
            completeButton.style.display = 'block';
            if (scoreTimer) clearInterval(scoreTimer);
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
