/*
Copyright (c) 2024 Keisuke Hattori

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


//Game settings parameters


const mistypePenalty = 1; // 1 point deduction for every X mistyped characters
const sessionDuration = 45; // Session duration (seconds)
const strategyTimeDuration = 30; // Strategy time (seconds)
const waitTimeAfterInput = 300; // Waiting time from key input to next character display (milliseconds)

// Google Apps Script Web Application URL
const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxwyP\_NetrPjbwGZSYc1JozU4R4UV94FaTgsiWNf3GjgNq-XZpQICxD80y6VLPt2WRP5w/exec';


//End of game settings


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
let isKeyPressed = false;





document.getElementById('confirmIdButton').addEventListener('click', function() {
    userId1 = document.getElementById('userId1').value;
    userId2 = document.getElementById('userId2').value;
    const fullWidthPattern = /[^\x00-\x7F]+/;

    if (userId1.trim() === '' || userId2.trim() === '') {
        alert('Please enter IDs');
    } else if (fullWidthPattern.test(userId1) || fullWidthPattern.test(userId2)) {
        alert('Please enter IDs using alphanumeric characters.');
    } else {
        document.getElementById('userId1').style.display = 'none';
        document.getElementById('userId2').style.display = 'none';
        this.style.display = 'none';
        document.getElementById('startButton').style.display = 'block';
    }
});









document.getElementById('startButton').addEventListener('click', startGame);




document.addEventListener('keydown', (event) => {
    if (!isGameActive || !isInputAccepted || isKeyPressed) return;
    isKeyPressed = true;
    const pressedKey = event.key.toUpperCase();
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
});

document.addEventListener('keyup', (event) => {
    isKeyPressed = false;
});




function startGame() {
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('countdown').style.display = 'block';
    countdown(3, beginSession);
}






function countdown(duration, callback) {
    let counter = duration;
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = duration;
    const countdownTimer = setInterval(() => {
        counter--;
        if (counter <= 0) {
            clearInterval(countdownTimer);
            countdownElement.textContent = '';
            callback();
        } else {
            countdownElement.textContent = counter;
        }
    }, 1000);
}

function showRandomLetter() {
    if (!isGameActive) return;
    currentLetter = letters[Math.floor(Math.random() * letters.length)];
    document.getElementById('displayLetter').textContent = currentLetter;
    isInputAccepted = true;
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
        document.getElementById('strategyMessage').innerHTML = `${strategyTimeDuration} sec strategy time for the team.<br>The next session will start as soon as the countdown reaches zero.`;
        document.getElementById('strategyMessage').style.display = 'block';
        countdown(strategyTimeDuration, beginSession);
    } else {
        document.getElementById('countdown').style.display = 'none';
        document.getElementById('strategyMessage').style.display = 'none';
        document.getElementById('taskComplete').innerHTML = 'The task is now complete. Please keep the screen as it is.<br>Thank you.';
		document.getElementById('taskComplete').style.display = 'block';
		sendGameDataToGoogleSheet();
    }
}




function recordSessionResults() {
    const totalCorrectResponsesSession = correctResponsesPlayer1Session + correctResponsesPlayer2Session;
    const totalMistypesSession = mistypesPlayer1Session + mistypesPlayer2Session + mistypesUnknownSession;
    const totalScoreSession = totalCorrectResponsesSession - Math.floor(totalMistypesSession / mistypePenalty);

    const sessionRecordsElement = document.getElementById('sessionRecords');
    const sessionRecord = `Session ${sessionCount}: Correct Responses ${totalCorrectResponsesSession}; Mistypes ${totalMistypesSession}; Score ${totalScoreSession};`;

    if (sessionCount === 1) {
        const sessionRecordsTitleElement = document.createElement('div');
        sessionRecordsTitleElement.id = 'sessionRecordsTitle';
        sessionRecordsTitleElement.innerHTML = `Session Records (ID: ${userId1} and ${userId2})`;
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
	let penaltyText = mistypePenalty > 0 ? `However, for every ${mistypePenalty} mistypes, your score will be deducted by 1 point.` : '';
    let rulesText = `Detailed Game Rules:<br>
    1. Players will work in pairs, with the player seated on the left (id1) responsible for typing the keys A and S, while the player on the right (id2) will type the keys L and P. Your task is to type the letters S, L, A, and P that appear on the screen as quickly and accurately as possible.<br>
	2. Your score will be based on the number of times you correctly react to the displayed letters. ${penaltyText}<br>     3. Each session lasts for ${sessionDuration} seconds, and there will be a total of 3 sessions. Between each session, there will be a ${strategyTimeDuration}-second strategy time for you and your partner to discuss and plan your approach.`;

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
    sessionDisplayElement.textContent = `Session ${sessionCount}`;
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

