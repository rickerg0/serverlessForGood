sam package  --template-file sam-app\template.yaml    --output-template-file serverless-output.yaml   --s3-bucket my-socialgood-package 

aws cloudformation deploy --template-file C:\Users\rickerg\git\serverlessForGood\serverless-output.yaml --stack-name serverlessForGood --capabilities CAPABILITY_IAM

aws cloudformation describe-stack-events --stack-name serverlessForGood


pip install pip-tools

pip-compile --output-file requirements-dev.txt  requirements.txt