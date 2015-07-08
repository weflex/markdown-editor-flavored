#!/usr/bin/env sh

REMOTE=`git remote -v | grep origin | grep push | awk '{split($0,a," "); print a[2]}'`

mkdir -p ghpages-dist
cp markdown-editor.js   ./ghpages-dist
cp markdown-editor.css  ./ghpages-dist
cp index.html ./ghpages-dist
cp node_modules/markdown-it/dist/markdown-it.min.js ./ghpages-dist
cd ./ghpages-dist

git init
git add .
git commit -a -m 'update gh-pages'
git branch 'gh-pages'
git checkout 'gh-pages'
git push $REMOTE 'gh-pages' --force
