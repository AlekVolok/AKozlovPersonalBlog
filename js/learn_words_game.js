let selectedLeft = null;
let selectedRight = null;
let pairs = {};
let displayedPairs = {}; // Keep track of displayed pairs
let correctlyGuessedPairs = 0; // Counter for correctly guessed pairs
let score = 0;
let mistakes = 0;
let comboMultiplier = 1;
let comboCount = 0;
let numberRows = 8;

function loadNewSetOfPairs() {
    correctlyGuessedPairs = 0;
    $('#leftWords, #rightWords, #audioButtons').empty();

    const remainingPairsList = Object.entries(pairs).filter(pair => !displayedPairs[pair[0]]);
    const samplePairs = remainingPairsList.sort(() => 0.5 - Math.random()).slice(0, numberRows);
    const leftWords = samplePairs.map(pair => pair[0]);
    const rightWords = samplePairs.map(pair => pair[1]).sort(() => Math.random() - 0.5); // Shuffle

    const $leftWords = $('#leftWords');
    const $audioButtons = $('#audioButtons');
    leftWords.forEach(word => {
        const btn = $(`<button data-word="${word}">${word}</button>`);
        btn.click(() => onLeftClick(word));
        $leftWords.append(btn);
        displayedPairs[word] = true;
    
        const audioBtn = $(`<button onclick="document.getElementById('${word}').play()"><img src="volume_icon.png" alt="Play ${word}"></button>`);
        $audioButtons.append(audioBtn);
        const audio = $(`<audio id="${word}" src="audio/${word}.mp3"></audio>`);
        $audioButtons.append(audio);
    });

    const $rightWords = $('#rightWords');
    rightWords.forEach(word => {
        const btn = $(`<button data-word="${word}">${word}</button>`);
        btn.click(() => onRightClick(word));
        $rightWords.append(btn);
    });

    updateUI(); // Ensure UI is updated when new pairs are loaded
}

function checkPair(leftWord, rightWord) {
    $('.selected').removeClass('selected');
    if (pairs[leftWord] === rightWord) {
        correctlyGuessedPairs += 1;
        updateCorrect(leftWord, rightWord);
        score += numberRows * comboMultiplier;
        if (correctlyGuessedPairs === numberRows) {
            loadNewSetOfPairs(); // Load new set and update UI after loading
        }
    } else {
        mistakes += 1;
        score -= 5;
        comboCount = 0;
        comboMultiplier = 1;
        updateIncorrect(leftWord, rightWord);
    }
    updateUI(); // Update UI after each attempt to check a pair
}

function updateCorrect(leftWord, rightWord) {
    $('#leftWords').find(`[data-word="${leftWord}"]`).addClass('correct').off();
    $('#rightWords').find(`[data-word="${rightWord}"]`).addClass('correct').off();
    comboCount += 1;
    if (comboCount % 3 === 0) {
        comboMultiplier += 1;
    }
}

function updateIncorrect(leftWord, rightWord) {
    $('#leftWords').find(`[data-word="${leftWord}"]`).addClass('incorrect');
    $('#rightWords').find(`[data-word="${rightWord}"]`).addClass('incorrect');
    setTimeout(() => {
        $('.incorrect').removeClass('incorrect');
    }, 1000);
}

function onLeftClick(word) {
    $('.selected').removeClass('selected');
    if (selectedRight) {
        checkPair(word, selectedRight);
    } else {
        selectedLeft = word;
        $(`#leftWords [data-word="${word}"]`).addClass('selected');
    }
}

function onRightClick(word) {
    $('.selected').removeClass('selected');
    if (selectedLeft) {
        checkPair(selectedLeft, word);
    } else {
        selectedRight = word;
        $(`#rightWords [data-word="${word}"]`).addClass('selected');
    }
}

function loadWords() {
    const topic = $('#topicSelect').val();
    $.getJSON(`words_database/topics/${topic}.json`, function(data) {
        pairs = data;
        displayedPairs = {};
        loadNewSetOfPairs();
    }).fail(function() {
        console.error('Error fetching data');
    });
}

function updateUI() {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('mistakes').innerText = `Mistakes: ${mistakes}`;
    document.getElementById('multiplier').innerText = `Multiplier: x${comboMultiplier}`;
}

$(document).ready(function() {
    $.getJSON("words_database/topics.json", function(data) {
        data.forEach(topic => {
            $('#topicSelect').append(`<option value="${topic}">${topic}</option>`);
        });
        loadWords();
    });

    $('#topicSelect').change(loadWords);
});
