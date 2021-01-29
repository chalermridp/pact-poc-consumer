#!/bin/sh
# rm -rf node_modules/
rm -rf pact/
# npm install
npm run build
npm run test:pact2