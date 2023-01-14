#! /bin/bash

mkdir -p extension_build
zip -r -FS ./extension_build/source.zip . --exclude '*.git*' --exclude 'node_modules*' --exclude 'build*' --exclude 'assets*'
