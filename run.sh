#!/bin/bash

DIR="$( cd "$( dirname "$0" )" && pwd )"
PORT=8132
open http://localhost:${PORT}
cd "${DIR}" && python -m SimpleHTTPServer ${PORT}
