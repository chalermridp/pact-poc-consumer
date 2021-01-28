#!/bin/sh
rm -rf node_modules/
rm -rf pacts/
npm install
npm run build
npm run test:pact