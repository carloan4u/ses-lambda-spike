npm i
cd ./lambda
npm i
cd ../
npm run build
npm run package
aws lambda update-function-code --function-name parseEmail --zip-file fileb://c:\\Users\\tim.borrowdale\\Code\\pbt-email\\package.zip