/*
Copyright (c) 2024 Keisuke Hattori

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


//ゲームの設定に関するパラメータ


const mistypePenalty = 1; // ミスタイプX個につき1点減点
const sessionDuration = 30; // セッション時間（秒）
const strategyTimeDuration = 30; // 作戦タイム（秒）
const waitTimeAfterInput = 300; // キー入力から次の文字提示までの待ち時間（ミリ秒）

// Google Apps ScriptのウェブアプリケーションURL（ユーザー自身で設定してください）
const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxwyP\_NetrPjbwGZSYc1JozU4R4UV94FaTgsiWNf3GjgNq-XZpQICxD80y6VLPt2WRP5w/exec';



//ここまでがゲームの設定

const letters = ['S', 'L', 'A', 'P'];
let userId1, userId2;
let currentLetter = '';
let correctResponsesPlayer1Session = 0;
let correctResponsesPlayer2Session = 0;
let mistypesPlayer1Session = 0;
let mistypesPlayer2Session = 0;
let mistypesUnknownSession = 0;
let correctResponsesPlayer1Session1 = 0;
let correctResponsesPlayer2Session1 = 0;
let mistypesPlayer1Session1 = 0;
let mistypesPlayer2Session1 = 0;
let correctResponsesPlayer1Session2 = 0;
let correctResponsesPlayer2Session2 = 0;
let mistypesPlayer1Session2 = 0;
let mistypesPlayer2Session2 = 0;
let correctResponsesPlayer1Session3 = 0;
let correctResponsesPlayer2Session3 = 0;
let mistypesPlayer1Session3 = 0;
let mistypesPlayer2Session3 = 0;
let mistypesUnknownSession1 = 0;
let mistypesUnknownSession2 = 0;
let mistypesUnknownSession3 = 0;
let nextLetterTimer = null;
let sessionCount = 1;
let isGameActive = false;
let isInputAccepted = false;





document.getElementById('confirmIdButton').addEventListener('click', function() {
    userId1 = document.getElementById('userId1').value;
    userId2 = document.getElementById('userId2').value;
    const fullWidthPattern = /[^\x00-\x7F]+/;

    if (userId1.trim() === '' || userId2.trim() === '') {
        alert('IDを入力してください。');
    } else if (fullWidthPattern.test(userId1) || fullWidthPattern.test(userId2)) {
        alert('IDは半角英数字で入力してください。');
    } else {
        document.getElementById('userId1').style.display = 'none';
        document.getElementById('userId2').style.display = 'none';
        this.style.display = 'none';
        document.getElementById('startButton').style.display = 'block';
    }
});









document.getElementById('startButton').addEventListener('click', startGame);





function handleKeyPress(key) {
    if (!isGameActive || !isInputAccepted) return;
    const pressedKey = key.toUpperCase();
    if (pressedKey === currentLetter) {
        updateScores();
    } else {
        if (currentLetter === 'S') {
            if (['L', 'P'].includes(pressedKey)) {
                mistypesPlayer2Session++;
            } else if (pressedKey === 'A') {
                mistypesPlayer1Session++;
            } else {
                mistypesUnknownSession++;
            }
        } else if (currentLetter === 'A') {
            if (['L', 'P'].includes(pressedKey)) {
                mistypesPlayer2Session++;
            } else if (pressedKey === 'S') {
                mistypesPlayer1Session++;
            } else {
                mistypesUnknownSession++;
            }
        } else if (currentLetter === 'L') {
            if (['S', 'A'].includes(pressedKey)) {
                mistypesPlayer1Session++;
            } else if (pressedKey === 'P') {
                mistypesPlayer2Session++;
            } else {
                mistypesUnknownSession++;
            }
        } else if (currentLetter === 'P') {
            if (['S', 'A'].includes(pressedKey)) {
                mistypesPlayer1Session++;
            } else if (pressedKey === 'L') {
                mistypesPlayer2Session++;
            } else {
                mistypesUnknownSession++;
            }
        }
    }
    isInputAccepted = false;
    resetNextLetterTimer();
}

document.addEventListener('keydown', (event) => {
    handleKeyPress(event.key);
});

document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        handleKeyPress(key.dataset.key);
    });
});




function startGame() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('countdown').style.display = 'block';
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
        correctResponsesPlayer1Session++;
    } else if (['L', 'P'].includes(currentLetter)) {
        correctResponsesPlayer2Session++;
    }
}

function beginSession() {
    isGameActive = true;
    document.getElementById('strategyMessage').style.display = 'none';
    document.getElementById('taskComplete').style.display = 'none';
    
    // リセットスコアとミスタイプカウンター
    correctResponsesPlayer1Session = 0;
    correctResponsesPlayer2Session = 0;
    mistypesPlayer1Session = 0;
    mistypesPlayer2Session = 0;
    mistypesUnknownSession = 0;

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
		sendGameDataToGoogleSheet();
    }
}




function recordSessionResults() {
    const totalCorrectResponsesSession = correctResponsesPlayer1Session + correctResponsesPlayer2Session;
    const totalMistypesSession = mistypesPlayer1Session + mistypesPlayer2Session + mistypesUnknownSession;
    const totalScoreSession = totalCorrectResponsesSession - Math.floor(totalMistypesSession / mistypePenalty);

    const sessionRecordsElement = document.getElementById('sessionRecords');
    const sessionRecord = `セッション ${sessionCount}: 正答数 ${totalCorrectResponsesSession}; ミスタイプ ${totalMistypesSession}; スコア ${totalScoreSession};`;

    if (sessionCount === 1) {
        const sessionRecordsTitleElement = document.createElement('div');
        sessionRecordsTitleElement.id = 'sessionRecordsTitle';
        sessionRecordsTitleElement.innerHTML = `各セッションの記録 (ID: ${userId1} and ${userId2})`;
        document.getElementById('container').insertBefore(sessionRecordsTitleElement, sessionRecordsElement);

        correctResponsesPlayer1Session1 = correctResponsesPlayer1Session;
        correctResponsesPlayer2Session1 = correctResponsesPlayer2Session;
        mistypesPlayer1Session1 = mistypesPlayer1Session;
		mistypesPlayer2Session1 = mistypesPlayer2Session;
		mistypesUnknownSession1 = mistypesUnknownSession;
    } else if (sessionCount === 2) {
        correctResponsesPlayer1Session2 = correctResponsesPlayer1Session;
        correctResponsesPlayer2Session2 = correctResponsesPlayer2Session;
        mistypesPlayer1Session2 = mistypesPlayer1Session;
		mistypesPlayer2Session2 = mistypesPlayer2Session;
		mistypesUnknownSession2 = mistypesUnknownSession;
    } else if (sessionCount === 3) {
        correctResponsesPlayer1Session3 = correctResponsesPlayer1Session;
        correctResponsesPlayer2Session3 = correctResponsesPlayer2Session;
        mistypesPlayer1Session3 = mistypesPlayer1Session;
		mistypesPlayer2Session3 = mistypesPlayer2Session;
		mistypesUnknownSession3 = mistypesUnknownSession;
    }

    sessionRecordsElement.innerHTML += `<div>${sessionRecord}</div>`;
    sessionRecordsElement.style.display = 'block';

    updateSessionDisplay();
}



function updateGameRules() {
    let penaltyText = mistypePenalty > 0 ? `しかしミスタイプは、${mistypePenalty}文字ごとにスコアを1点減点します。` : '';
    let rulesText = `ゲームルール詳細:<br>
    1. 2人でキー入力を分担し、協力して各セッション${sessionDuration}秒で、画面に現れる "S" "L" "A" "P" の文字をできるだけ速く・正確にタイプしてください。<br>
    2. 正しく入力できた回数があなたのペアのスコア（点）になります。${penaltyText}<br>
    3. セッションは3回行われ、セッション間には${strategyTimeDuration}秒の作戦タイムがあります。`;

    document.getElementById('rulesTooltip').innerHTML = rulesText;
}

document.getElementById('gameRules').addEventListener('mouseover', function() {
    document.getElementById('rulesTooltip').style.visibility = 'visible';
});

document.getElementById('gameRules').addEventListener('mouseout', function() {
    document.getElementById('rulesTooltip').style.visibility = 'hidden';
});






function updateSessionDisplay() {
    const sessionDisplayElement = document.getElementById('sessionDisplay');
    sessionDisplayElement.textContent = `セッション ${sessionCount}`;
}


function sendGameDataToGoogleSheet() {
    const totalCorrectResponsesSession1 = correctResponsesPlayer1Session1 + correctResponsesPlayer2Session1;
    const totalMistypesSession1 = mistypesPlayer1Session1 + mistypesPlayer2Session1 + mistypesUnknownSession1;
    const totalScoreSession1 = totalCorrectResponsesSession1 - Math.floor(totalMistypesSession1 / mistypePenalty);

    const totalCorrectResponsesSession2 = correctResponsesPlayer1Session2 + correctResponsesPlayer2Session2;
    const totalMistypesSession2 = mistypesPlayer1Session2 + mistypesPlayer2Session2 + mistypesUnknownSession2;
    const totalScoreSession2 = totalCorrectResponsesSession2 - Math.floor(totalMistypesSession2 / mistypePenalty);

    const totalCorrectResponsesSession3 = correctResponsesPlayer1Session3 + correctResponsesPlayer2Session3;
    const totalMistypesSession3 = mistypesPlayer1Session3 + mistypesPlayer2Session3 + mistypesUnknownSession3;
    const totalScoreSession3 = totalCorrectResponsesSession3 - Math.floor(totalMistypesSession3 / mistypePenalty);

    var data = {
        id1: userId1,
        id2: userId2,
        totalCorrectResponsesSession1: correctResponsesPlayer1Session1 + correctResponsesPlayer2Session1,
        totalMistypesSession1: totalMistypesSession1,
        totalScoreSession1: totalScoreSession1,
        correctResponsesPlayer1Session1: correctResponsesPlayer1Session1,
        correctResponsesPlayer2Session1: correctResponsesPlayer2Session1,
        mistypesPlayer1Session1: mistypesPlayer1Session1,
        mistypesPlayer2Session1: mistypesPlayer2Session1,

        totalCorrectResponsesSession2: correctResponsesPlayer1Session2 + correctResponsesPlayer2Session2,
        totalMistypesSession2: totalMistypesSession2,
        totalScoreSession2: totalScoreSession2,
        correctResponsesPlayer1Session2: correctResponsesPlayer1Session2,
        correctResponsesPlayer2Session2: correctResponsesPlayer2Session2,
        mistypesPlayer1Session2: mistypesPlayer1Session2,
        mistypesPlayer2Session2: mistypesPlayer2Session2,

        totalCorrectResponsesSession3: correctResponsesPlayer1Session3 + correctResponsesPlayer2Session3,
        totalMistypesSession3: totalMistypesSession3,
        totalScoreSession3: totalScoreSession3,
        correctResponsesPlayer1Session3: correctResponsesPlayer1Session3,
        correctResponsesPlayer2Session3: correctResponsesPlayer2Session3,
        mistypesPlayer1Session3: mistypesPlayer1Session3,
        mistypesPlayer2Session3: mistypesPlayer2Session3,
		
		timeStamp: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

    };

	
	
	fetch(googleAppsScriptUrl, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
}).then(response => {
    console.log('Success:', response);
}).catch(error => {
    console.error('Error:', error);
});
		
}

window.onload = function() {
    updateGameRules();
};

