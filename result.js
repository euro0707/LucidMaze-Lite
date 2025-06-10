document.addEventListener('DOMContentLoaded', () => {
    const finalScoreDisplay = document.getElementById('final-score');
    const thinkingTypeDisplay = document.getElementById('thinking-type');

    function getThinkingType(score) {
      // スコアが低いほど高評価になるように変更
      if (score <= 10) { // 例: 10秒以内
        return "迷宮のマスター";
      } else if (score <= 20) { // 例: 20秒以内
        return "熟練の戦略家";
      } else if (score <= 30) { // 例: 30秒以内
        return "見習い分析官";
      } else {
        return "駆け出しの探求者";
      }
    }

    // ローカルストレージからスコアを取得
    const finalScore = localStorage.getItem('finalScore');

    if (finalScore !== null) {
        const score = parseInt(finalScore, 10);
        finalScoreDisplay.textContent = score;
        thinkingTypeDisplay.textContent = getThinkingType(score);
        // 一度表示したら不要なので削除する
        localStorage.removeItem('finalScore');
    } else {
        // スコアが取得できなかった場合の表示
        finalScoreDisplay.textContent = "データなし";
        thinkingTypeDisplay.textContent = "不明";
    }
});
