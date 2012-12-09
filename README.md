# German for great good

Flashcards and progress in *German for Reading Knowledge*.

### Running

On any Unix-like system, you can `./run.sh` then go to
[http://localhost:8132](http://localhost:8132).  You'll need to have Python
installed.

On Mac, you can double-click `run.sh`.

On Windows, you should be able to run `./run.sh` on something like
[Cygwin](http://www.cygwin.com/) and go to the [link above](http://localhost:8132)
(provided you have Python installed).  I have not tested this.

If the page doesn't load initially, it means your browser loaded it before
your local server got started.  Reloading the page should solve the problem.

### Extending vocab

Any files in `./vocab/` will be loaded in as vocab.  Anything including the
word "Grundwortschatz" in the title will be checked off automatically to start.

The format of files is (tab delimited):

_Non-English_ *tab* _English_ *tab* _Optional lexical category_ *tab* _Optional other
info_

### Contributing

All JavaScript should pass [JS Lint](http://www.jslint.com/).

### License

[BSD](http://en.wikipedia.org/wiki/BSD_licenses#2-clause_license_.28.22Simplified_BSD_License.22_or_.22FreeBSD_License.22.29)
for everything except the vocab.
