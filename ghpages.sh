#!/usr/bin/env sh

REMOTE=`git remote -v | grep origin | grep push | awk '{split($0,a," "); print a[2]}'`

rm -rf ghpages-dist
mkdir -p ghpages-dist
npm run build
cp dist/markdown-editor.js    ./ghpages-dist
cp dist/markdown-editor.css   ./ghpages-dist
cp index.html                 ./ghpages-dist

# cd ./ghpages-dist
# git init
# git add .
# git commit -a -m 'update gh-pages'
# git branch 'gh-pages'
# git checkout 'gh-pages'
# git push $REMOTE 'gh-pages' --force
