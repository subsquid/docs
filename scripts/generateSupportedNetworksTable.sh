#!/bin/bash

# Run from the docs root folder

mkdir __tmp__
cd __tmp__
npm i --silent --prefix . @subsquid/archive-registry@latest
NODE_PATH=./node_modules node ../scripts/makeTable.js
cd ..
rm -r __tmp__
