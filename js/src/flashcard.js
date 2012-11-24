/*jslint browser: true, nomen: true*/
/*global $, _*/

$(document).ready(function () {
    "use strict";

    var $card = $('#card'),
        $english = $('#english', $card),
        $german = $('#german', $card),
        $lexCat = $('#lexCat', $card),
        $extra = $('#extra', $card),
        $next = $('#next', $card),
        $reveal = $('#reveal', $card),
        vocabFolder = '../vocab',
        vocabFiles = [
            '1.2.txt',
            '1.3.txt',
            '1.4.txt',
            '1.5.txt',
            '1.Grundwortschatz.txt',
            '1.exercise.txt'
        ];

    $.when.apply(this, _.map(vocabFiles, function (fileName) {
        return $.get(vocabFolder + '/' + fileName);
    })).done(function () {
        var vocab = [],
            contents = _.pluck(arguments, 0);

        // Build vocab
        _.each(contents, function (content) {
            _.each(content.split('\n'), function (line) {
                var lineSplit = line.split('\t');
                vocab.push({
                    german: lineSplit[0],
                    english: lineSplit[1],
                    lexCat: lineSplit[2],
                    extra: lineSplit[3]
                });
            });
        });

        // Bind event handlers
        $next.click(function (evt) {
            var choice = vocab[Math.floor(Math.random() * vocab.length)];
            $english.text(choice.english);
            $german.hide().text(choice.german);
            $lexCat.text(choice.lexCat);
            $extra.text(choice.extra);
        });

        $reveal.click(function (evt) {
            $german.show();
        });

        // Bootstrap
        $next.click();
    });
});
