cd lambda/
npm i
cd ..
npm run build
npm run package
aws lambda update-function-code --function-name processEmail --zip-file fileb://c:\\Users\\tim.borrowdale\\Code\\pbt-email\\package.zip --region eu-west-1