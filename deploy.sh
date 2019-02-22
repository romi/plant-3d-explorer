#!/bin/bash
echo 'Starting.'
echo 'Building Front.'
npm run build
ssh -i ~/.ssh/sony dataveyes@188.165.230.125 <<'ENDSSH'
  cd /home/dataveyes/html
  rm -rf *
  exit
ENDSSH
scp -i ~/.ssh/sony -rp build/. dataveyes@188.165.230.125:/home/dataveyes/html
echo 'Cleaning'
rm -rf archive.zip
