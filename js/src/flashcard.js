/*jslint browser: true, nomen: true*/
/*global $, _, levenshteinenator*/

$(document).ready(function () {
    "use strict";

    var $card = $('#card'),
        $english = $('#english', $card),
        $german = $('#german', $card),
        $lexCat = $('#lexCat', $card),
        $extra = $('#extra', $card),
        $next = $('#next', $card),
        $answer = $('#answer', $card),
        $answerInput = $('input[type="text"]', $answer),
        $answerSubmit = $('input[type="submit"]', $answer),
        $sad = $('#sad'),
        $sources = $('#sources'),
        $proximity = $('#proximity'),
        $indexLoader = $('<div />').css('display', 'none').appendTo($('body')),
        failureClass = 'failure',
        vocabListPath = 'vocab/',
        allSources = {},
        availableSources = {},
        allVocab = {},
        curSource,
        curIndex,

        buildSource = function (href) {
            var pathToSource = vocabListPath + href,
                $checkbox = $('<input />').attr('type', 'checkbox'),
                $total = $('<div />').addClass('total'),
                $correct = $('<div />').addClass('correct'),
                $wrong = $('<div />').addClass('wrong'),
                $source = $('<div />')
                    .append($checkbox)
                    .append($('<a />').text(href).attr({
                        'href': pathToSource,
                        'target': '_blank'
                    }))
                    .append($total).append($correct).append($wrong),
                data = {
                    xhr: $.get(pathToSource)
                };
            $wrong.text('0');
            $correct.text('0');
            data.xhr.done(function (resp) {
                var hrefVocab = _.map(_.filter(resp.split('\n'), function (line) {
                    return line !== '' && line[0] !== '#';
                }), function (line) {
                    var lineSplit = line.split('\t');
                    return {
                        german: lineSplit[0],
                        english: lineSplit[1],
                        lexCat: lineSplit[2],
                        extra: lineSplit[3]
                    };
                });
                allVocab[href] = {
                    unused: hrefVocab,
                    correct: [],
                    wrong: []
                };
                $total.text(String(hrefVocab.length));
            });
            $checkbox.on('click.flashcard', function (evt) {
                if ($checkbox.is(':checked')) {
                    availableSources[href] = $source;
                } else {
                    delete availableSources[href];
                }
            });
            // Pre-select main vocab sections.
            if (href.search(/grundwortschatz/i) !== -1) {
                $checkbox.prop('checked', 'checked');
                $checkbox.trigger('click.flashcard');
                $checkbox.prop('checked', 'checked');
            }
            $source.data('flashcard', data);
            allSources[href] = $source;
            return $source;
        },

        advance = function () {
            $('div', $sources).each(function (i, div) {
                $(div).removeClass('sourced');
            });

            $card.removeClass(failureClass);
            $proximity.hide();
            $answerInput.val('');

            curSource = _.keys(availableSources)[Math.floor(Math.random() * _.size(availableSources))];
            var vocabList = allVocab[curSource].unused,
                $sourceDiv = availableSources[curSource],
                choice;

            // Move wrong vocab back to unused
            if (vocabList.length === 0) {
                allVocab[curSource].unused = allVocab[curSource].wrong;
                allVocab[curSource].wrong = [];
                vocabList = allVocab[curSource].unused;
            }

            if (vocabList.length === 0) {
                $('input[type="checkbox"]', $sourceDiv).prop('checked', false);
                delete availableSources[curSource];
                advance();
            } else {

                curIndex = Math.floor(Math.random() * vocabList.length);

                choice = vocabList[curIndex];
                $sourceDiv.addClass('sourced');
                $english.text(choice.english);
                $german.addClass('hidden').text(choice.german);
                $lexCat.text(choice.lexCat || '');
                $extra.text(choice.extra || '');
            }
        };

    $answer.on('submit', function (evt) {
        // Prevent default form submission
        evt.preventDefault();
    });

    $sad.on('click', function (evt) {
        $answer.trigger('submit');
    });

    $answerInput.on('keyup', function (evt) {
        // Change button input in case of empty input
        var answerValue = $answerInput.val(),
            failedAlready = $card.hasClass(failureClass);
        if (answerValue !== '' && !failedAlready) {
            $answerSubmit.val('answer');
        } else {
            $answerSubmit.val('i give up');
        }
    });

    $(window).on('keyup', function (evt) {
        // Ignore arrow keys explicitly inside the text.
        if ($(evt.target).attr('type') === 'text') {
            return true;
        }
        switch (evt.keyCode) {
        case 39:
            $answer.submit();
            break;
        }
    });

    $indexLoader.load(vocabListPath, function () {
        $.when.apply(this, _.map($('a', $indexLoader), function (el) {
            var href = $(el).attr('href');
            return buildSource(href).appendTo($sources).data('flashcard').xhr;
        })).done(function () {

            $answer.on('submit', function (evt) {
                if (_.size(availableSources) === 0) {
                    $sad.fadeIn();
                    $card.hide();
                } else {
                    $sad.fadeOut();
                    $card.show();
                    var answerValue = $answerInput.val(),
                        realAnswer = $german.text(),
                        hasFailedAlready = $card.hasClass(failureClass),
                        distance = levenshteinenator(answerValue, realAnswer),
                        $sourceDiv = allSources[curSource],
                        $total = $('.total', $sourceDiv),
                        $correct = $('.correct', $sourceDiv),
                        $wrong = $('.wrong', $sourceDiv),
                        vocabForSource = allVocab[curSource],
                        card = vocabForSource.unused[curIndex];

                    if (hasFailedAlready) {
                        $card.removeClass('failure');
                        advance();
                    } else if (distance === 0) {
                        vocabForSource.unused.splice(curIndex, 1);
                        vocabForSource.correct.push(card);
                        advance();
                    } else {
                        vocabForSource.unused.splice(curIndex, 1);
                        vocabForSource.wrong.push(card);
                        $german.removeClass('hidden');
                        $proximity.show()
                            .text(Math.floor(100 - (100.0 * distance / Math.max(realAnswer.length, answerValue.length))) + '%');
                        $card.addClass('failure');
                    }
                    $total.text(vocabForSource.unused.length);
                    $wrong.text(vocabForSource.wrong.length);
                    $correct.text(vocabForSource.correct.length);
                }
            });

            // Bootstrap
            advance();
        });
    });
});
