let selectedLeft = null;
let selectedRight = null;
let pairs = {};
let displayedPairs = {}; // Keep track of displayed pairs
let correctlyGuessedPairs = 0; // Counter for correctly guessed pairs
let score = 0;
let mistakes = 0;

let startGame;
let comboMultiplier = 1;
let comboCount = 0;
numberRows = 8;

function loadNewSetOfPairs() {
    correctlyGuessedPairs = 0;
    $('#leftWords, #rightWords, #audioButtons').empty();

    const remainingPairsList = Object.entries(pairs).filter(pair => !displayedPairs[pair[0]]);
    const samplePairs = remainingPairsList.sort(() => 0.5 - Math.random()).slice(0, numberRows);
    const leftWords = samplePairs.map(pair => pair[0]);
    const rightWords = samplePairs.map(pair => pair[1]).sort(() => Math.random() - 0.5); // Shuffle

    leftWords.forEach(word => {
        const btn = $(`<button data-word="${word}">${word}</button>`);
        btn.click(function() {
            onLeftClick(word);
        });
        $('#leftWords').append(btn);
        displayedPairs[word] = true;
    
        // Add audio button for pronunciation
        const audioBtn = $(`<button onclick="document.getElementById('${word}').play()" style="width: 30px; height: 30px; padding: 0; border: none; background: none;"><img src="volume_icon.png" alt="Play ${word}" style="width: 100%; height: 100%;"></button>`);
        $('#audioButtons').append(audioBtn);
        const audio = $(`<audio id="${word}" src="audio/${word}.mp3" style="display: none;"></audio>`);
        $('#audioButtons').append(audio);
    });
    
    rightWords.forEach(word => {
        const btn = $(`<button data-word="${word}">${word}</button>`);
        btn.click(function() {
            onRightClick(word);
        });
        $('#rightWords').append(btn);
    });
}

function checkPair(leftWord, rightWord) {
    $('.selected').removeClass('selected'); // Remove the yellow highlight from any selected word

    if (pairs[leftWord] === rightWord) {
        correctlyGuessedPairs += 1;
        $('#leftWords').find(`[data-word="${leftWord}"]`).addClass('correct').off();
        $('#rightWords').find(`[data-word="${rightWord}"]`).addClass('correct').off();

        // Update combo count and multiplier
        comboCount += 1;
        if (comboCount % 3 === 0) { // every 3 correct answers in a row increases the multiplier
            comboMultiplier += 1;
        }
        score += numberRows * comboMultiplier; // Update score using multiplier

        if (correctlyGuessedPairs === numberRows) {
            loadNewSetOfPairs();
        }
    } else {
        mistakes += 1;
        score -= 5;

        // Reset combo count and multiplier on mistake
        comboCount = 0;
        comboMultiplier = 1;

        $('#leftWords').find(`[data-word="${leftWord}"]`).addClass('incorrect');
        $('#rightWords').find(`[data-word="${rightWord}"]`).addClass('incorrect');
        setTimeout(() => {
            $('.incorrect').removeClass('incorrect');
        }, 1000);
    }
    updateUI(); // Update the UI with the latest score, mistakes, and multiplier
    selectedLeft = null;
    selectedRight = null;
}


function onLeftClick(word) {
    $('.selected').removeClass('selected'); // Ensure only one word is highlighted
    if (selectedRight) {
        checkPair(word, selectedRight);
        selectedRight = null;
    } else {
        selectedLeft = word;
        $(`#leftWords [data-word="${word}"]`).addClass('selected');
    }
}

function onRightClick(word) {
    $('.selected').removeClass('selected'); // Ensure only one word is highlighted
    if (selectedLeft) {
        checkPair(selectedLeft, word);
        selectedLeft = null;
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
    });

}function updateUI() {
    document.getElementById('score').innerText = `Score: ${score}`;
    document.getElementById('mistakes').innerText = `Mistakes: ${mistakes}`;
    document.getElementById('multiplier').innerText = `Multiplier: x${comboMultiplier}`;
    updateUI();
}

// Load topics and initialize game
$(document).ready(function() {
    $.getJSON("words_database/topics.json", function(data) {
        data.forEach(topic => {
            $('#topicSelect').append(`<option value="${topic}">${topic}</option>`);
        });
        loadWords();
    });

    // Bind the change event to the dropdown to load words when the topic changes
    $('#topicSelect').change(loadWords);
});
