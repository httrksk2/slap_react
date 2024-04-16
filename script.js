const letters = ['S', 'L', 'A', 'P'];
let currentLetter = '';
let scorePlayer1Session = 0;
let scorePlayer2Session = 0;
let mistypesPlayer1Session = 0;
let mistypesPlayer2Session = 0;
let nextLetterTimer = null;
const sessionDuration = 20; // セッション時間（秒）
const strategyTimeDuration = 10; // 作戦タイム（秒）
let sessionCount = 1; // 現在のセッション番号
let isGameActive = false; // ゲームがアクティブかどうかのフラグ
let isInputAccepted = false; // 現在の文字に対して入力を受け付けるかどうかのフラグ
const waitTimeAfterInput = 500; // キー入力から次の文字提示までの待ち時間（ミリ秒）

document.getElementById('startButton').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    if (!isGameActive || !isInputAccepted) return;
    const pressedKey = event.key.toUpperCase();
    if (pressedKey === currentLetter) {
        updateScores();
    } else {
        mistypesPlayer1Session++;
    }
    isInputAccepted = false;
    resetNextLetterTimer();
});

function startGame() {
    document.getElementById('startButton').style.display = 'none';
    countdown(3, beginSession);
}

function countdown(duration, callback) {
    let counter = duration;
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = duration; // 最初の値として duration を表示

    const countdownTimer = setInterval(() => {
        counter--;
        if (counter <= 0) {
            clearInterval(countdownTimer);
            countdownElement.textContent = ''; // カウントが0になったら表示を消去
            callback(); // コールバック関数を呼び出し
        } else {
            countdownElement.textContent = counter; // 残り時間を更新
        }
    }, 1000);
}

function showRandomLetter() {
    if (!isGameActive) return; // ゲームが非アクティブなら何もしない
    currentLetter = letters[Math.floor(Math.random() * letters.length)];
    document.getElementById('displayLetter').textContent = currentLetter;
    isInputAccepted = true; // 新しい文字が表示されたので入力を受け付ける
}

function resetNextLetterTimer() {
    clearTimeout(nextLetterTimer);
    document.getElementById('displayLetter').textContent = '';
    if (isGameActive) {
        nextLetterTimer = setTimeout(showRandomLetter, waitTimeAfterInput);
    }
}

function updateScores() {
    if (['S', 'A'].includes(currentLetter)) {
        scorePlayer1Session++;
    } else if (['L', 'P'].includes(currentLetter)) {
        scorePlayer2Session++;
    }
}

function beginSession() {
    isGameActive = true;
    document.getElementById('strategyMessage').style.display = 'none';
    document.getElementById('taskComplete').style.display = 'none';
    scorePlayer1Session = 0;
    scorePlayer2Session = 0;
    mistypesPlayer1Session = 0;
    mistypesPlayer2Session = 0;
    updateSessionDisplay();
    document.getElementById('countdown').textContent = sessionDuration;
    countdown(sessionDuration, endSession);
    showRandomLetter();
}

function endSession() {
    isGameActive = false;
    clearTimeout(nextLetterTimer);
    document.getElementById('displayLetter').textContent = '';
    recordSessionResults();
    sessionCount++;
    if (sessionCount < 4) {
        document.getElementById('strategyMessage').innerHTML = `${strategyTimeDuration} 秒間の作戦タイムです。<br>次のセッションはカウントダウンが 0 になると同時に開始されます。`;
        document.getElementById('strategyMessage').style.display = 'block';
        countdown(strategyTimeDuration, beginSession);
    } else {
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('strategyMessage').style.display = 'none';
        document.getElementById('taskComplete').innerHTML = 'タスクはこれで終了です。画面をそのままにお待ちください。<br>ありがとうございました。';
        document.getElementById('taskComplete').style.display = 'block';
    }
}

function recordSessionResults() {
    const totalScoreSession = scorePlayer1Session + scorePlayer2Session;
    const totalMistypesSession = mistypesPlayer1Session + mistypesPlayer2Session;
    const sessionRecord = `セッション ${sessionCount}: スコア ${totalScoreSession}; ミスタイプ ${totalMistypesSession};`;
    const sessionRecordsElement = document.getElementById('sessionRecords');

    if (sessionCount === 1) {
        const sessionRecordsTitleElement = document.createElement('div');
        sessionRecordsTitleElement.id = 'sessionRecordsTitle';
        sessionRecordsTitleElement.textContent = '各セッションの記録';
        document.getElementById('container').insertBefore(sessionRecordsTitleElement, sessionRecordsElement);
    }
    sessionRecordsElement.style.display = 'block';
    sessionRecordsElement.innerHTML += `<div>${sessionRecord}</div>`;

    updateSessionDisplay();
}

function updateSessionDisplay() {
    const sessionDisplayElement = document.getElementById('sessionDisplay');
    sessionDisplayElement.textContent = `セッション ${sessionCount}`;
}

function sendGameDataToGoogleSheet() {
    // ここでGoogle Sheets APIを使用してデータを送信
}