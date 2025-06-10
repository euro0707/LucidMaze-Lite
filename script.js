document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('puzzle-grid');
    const scoreDisplay = document.getElementById('score');
    const completeButton = document.getElementById('complete-button');
    const logButton = document.getElementById('log-button');

    let score = 0;
    let scoreTimer;
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
        // 正解ルートをランダムに選択
        correctRoute = allPossibleRoutes[Math.floor(Math.random() * allPossibleRoutes.length)];
        console.log("Correct route for this game:", correctRoute); // デバッグ用に正解ルートをコンソールに表示
        
        score = 0;
        updateScoreDisplay();
        createGrid();
        startScoring();
        completeButton.style.display = 'none'; // 最初は完了ボタンを隠す
    }

    function createGrid() {
        gridContainer.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = i; // クリックされたセルを特定するためのインデックス
            cell.textContent = '未選択';

            cell.addEventListener('click', () => {
                // 既にクリア済みの場合は何もしない
                if (completeButton.style.display === 'block') {
                    return;
                }

                const index = parseInt(cell.dataset.index, 10);

                // クリックしたタイルが正解ルートに含まれているかチェック
                if (correctRoute.includes(index)) {
                    // 正解タイルの場合、選択状態をトグル
                    cell.classList.toggle('selected');
                    cell.textContent = cell.classList.contains('selected') ? '選択済' : '未選択';
                    checkSolution(); // 正解が揃ったかチェック
                } else {
                    // 不正解タイルの場合
                    // 1. スコアにペナルティを加算
                    score += 3;
                    updateScoreDisplay();

                    // 2. 赤く点滅させる
                    cell.classList.add('error-flash');
                    setTimeout(() => {
                        cell.classList.remove('error-flash');
                    }, 500); // 0.5秒後にアニメーションクラスを削除
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

        // 配列の順序に依存しない、より堅牢な比較方法に変更
        const isCorrect = correctRoute.length === selectedIndexes.length && correctRoute.every(index => selectedIndexes.includes(index));

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
