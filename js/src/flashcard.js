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
        $sad = $('#sad'),
        $sources = $('#sources'),
        $indexLoader = $('<div />').css('display', 'none').appendTo($('body')),
        vocabListPath = '../vocab/',
        allVocab = {},
        availableVocab = {},

        buildSource = function (href) {
            var pathToSource = vocabListPath + href,
                $checkbox = $('<input />').attr('type', 'checkbox'),
                $source = $('<div />')
                    .append($checkbox)
                    .append($('<a />').text(href).attr({
                        'href': pathToSource,
                        'target': '_blank'
                    })),
                data = {
                    xhr: $.get(pathToSource)
                };
            data.xhr.done(function (resp) {
                allVocab[href] = _.map(resp.split('\n'), function (line) {
                    var lineSplit = line.split('\t');
                    return {
                        german: lineSplit[0],
                        english: lineSplit[1],
                        lexCat: lineSplit[2],
                        extra: lineSplit[3]
                    };
                });
            });
            $checkbox.on('click.flashcard', function (evt) {
                if ($checkbox.is(':checked')) {
                    availableVocab[href] = $source;
                } else {
                    delete availableVocab[href];
                }
            });
            // Pre-select main vocab sections.
            if (href.search(/grundwortschatz/i) !== -1) {
                $checkbox.prop('checked', 'checked');
                $checkbox.trigger('click.flashcard');
                $checkbox.prop('checked', 'checked');
            }
            $source.data('flashcard', data);
            return $source;
        };

    $indexLoader.load(vocabListPath, function () {
        $.when.apply(this, _.map($('a', $indexLoader), function (el) {
            var href = $(el).attr('href');
            return buildSource(href).appendTo($sources).data('flashcard').xhr;
        })).done(function () {

            // Bind event handlers
            $next.click(function (evt) {
                $('div', $sources).each(function (i, div) {
                    $(div).removeClass('sourced');
                });
                if (_.size(availableVocab) === 0) {
                    $('#sad').fadeIn();
                } else {
                    $('#sad').fadeOut();

                    var chosenSource = _.keys(availableVocab)[Math.floor(Math.random() * _.size(availableVocab))],
                        vocabList = allVocab[chosenSource],
                        choice = vocabList[Math.floor(Math.random() * vocabList.length)];
                    availableVocab[chosenSource].addClass('sourced');
                    $english.text(choice.english);
                    $german.addClass('hidden').text(choice.german);
                    $lexCat.text(choice.lexCat || '');
                    $extra.text(choice.extra || '');
                }
            });

            $reveal.click(function (evt) {
                $german.removeClass('hidden');
            });

            // Bootstrap
            $next.click();
        });
    });
});
