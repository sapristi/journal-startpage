#! /bin/bash
set -o allexport && source .env && set +o allexport
pnpm web-ext sign -s build --channel=listed
