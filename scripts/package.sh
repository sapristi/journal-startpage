#! /bin/bash

pnpm build
cd build
zip -r -FS ../journal-startpage.zip *
