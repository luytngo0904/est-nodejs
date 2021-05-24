#!bin/bash

#Starting build folder
npm run build

#minify bin/www
mkdir dist/bin
./node_modules/.bin/babel bin/www --presets minify > dist/bin/www

#copy package.json
cp -rf package.json dist/package.json

#remove node_modules and files not using
rm -rf dist/node_modules dist/build.sh dist/package-lock.json dist/README.md dist/nodemon.json

#creating 
rm -rf est-nodejs.tar.gz && touch est-nodejs.tar.gz
tar -czvf est-nodejs.tar.gz dist/

#extracting
#tar -xzvf est-nodejs.tar.gz

