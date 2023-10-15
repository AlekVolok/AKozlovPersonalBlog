let selectedLeft = null;
let selectedRight = null;
let pairs = {};

function checkPair(leftWord, rightWord) {
    $('.selected').removeClass('selected'); // Remove the yellow highlight from any selected word
    
    if (pairs[leftWord] === rightWord) {
        $('#leftWords').find(`[data-word="${leftWord}"]`).addClass('correct').off();
        $('#rightWords').find(`[data-word="${rightWord}"]`).addClass('correct').off();

        if ($('.correct').length === Object.keys(pairs).length * 2) {
            alert("Congratulations! You matched all pairs!");
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

function loadWords() {
    const topic = $('#topicSelect').val();
    $.getJSON(`words_database/topics/${topic}.json`, function(data) {
        pairs = data;
        $('#leftWords, #rightWords').empty();

        // Get a random sample of up to 10 pairs
        const samplePairs = Object.entries(pairs).sort(() => 0.5 - Math.random()).slice(0, 10);
        const leftWords = samplePairs.map(pair => pair[0]);
        const rightWords = samplePairs.map(pair => pair[1]).sort(() => Math.random() - 0.5); // Shuffle

        leftWords.forEach(word => {
            const btn = $(`<button data-word="${word}">${word}</button>`);
            btn.click(function() {
                if (selectedRight) {
                    checkPair(word, selectedRight);
                } else {
                    selectedLeft = word;
                    $(this).addClass('selected'); // Highlight the selected word with yellow
                }
            });
            $('#leftWords').append(btn);
        });

        rightWords.forEach(word => {
            const btn = $(`<button data-word="${word}">${word}</button>`);
            btn.click(function() {
                if (selectedLeft) {
                    checkPair(selectedLeft, word);
                } else {
                    selectedRight = word;
                    $(this).addClass('selected'); // Highlight the selected word with yellow
                }
            });
            $('#rightWords').append(btn);
        });
    });
}

function checkPair(leftWord, rightWord) {
    $('.selected').removeClass('selected'); // Remove the yellow highlight from any selected word
    
    if (pairs[leftWord] === rightWord) {
        $('#leftWords').find(`[data-word="${leftWord}"]`).addClass('correct').off();
        $('#rightWords').find(`[data-word="${rightWord}"]`).addClass('correct').off();

        if ($('.correct').length === Object.keys(pairs).length * 2) {
            $('#congratulations').show();  // Display the congratulatory message
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
