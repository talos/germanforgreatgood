# German for great good

Flashcards and progress in *German for Reading Knowledge*.

### Running

On any Unix-like system,  you can `./run.sh` then go to
[http://localhost:8132](http://localhost:8132).  You'll need to have Python
installed.

On Mac, you can double-click `run.sh`.

On Windows, you should be able to run `./run.sh` on something like Cygwin and
go to the link above (provided you have Python installed).  I have not tested
this.

If the page doesn't load initially, it means your browser loaded it before
your local server got started.  Reloading the page should solve the problem.

### Extending vocab

Any files in `./vocab/` will be loaded in as vocab.  Anything including the
word "Grundwortschatz" in the title will be checked off automatically to start.

The format of files is (tab delimited):

_Non-English_*tab*_English_*tab*_Optional lexical category_*tab*_Optional other
info_

### Contributing

All JavaScript should pass JS Lint.

### License

BSD for everything except the vocab.
