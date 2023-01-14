#! /bin/bash

mkdir -p extension_build
pnpm build
cd build
zip -r -FS ../extension_build/journal-startpage.zip *
