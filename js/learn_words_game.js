let selectedLeft = null;
let selectedRight = null;
let pairs = {};
let displayedPairs = {}; // Keep track of displayed pairs
let correctlyGuessedPairs = 0; // Counter for correctly guessed pairs

function loadNewSetOfPairs() {
    correctlyGuessedPairs = 0;
    $('#leftWords, #rightWords').empty();

    const remainingPairsList = Object.entries(pairs).filter(pair => !displayedPairs[pair[0]]);
    const samplePairs = remainingPairsList.sort(() => 0.5 - Math.random()).slice(0, 10);
    const leftWords = samplePairs.map(pair => pair[0]);
    const rightWords = samplePairs.map(pair => pair[1]).sort(() => Math.random() - 0.5); // Shuffle

    leftWords.forEach(word => {
        const btn = $(`<button data-word="${word}">${word}</button>`);
        btn.click(function() {
            onLeftClick(word);
        });
        $('#leftWords').append(btn);
        displayedPairs[word] = true;
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

        if (correctlyGuessedPairs === 10) {
            loadNewSetOfPairs();
        }
    } else {
        $('#leftWords').find(`[data-word="${leftWord}"]`).addClass('incorrect');
        $('#rightWords').find(`[data-word="${rightWord}"]`).addClass('incorrect');
        setTimeout(() => {
            $('.incorrect').removeClass('incorrect');
        }, 1000);
    }
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
