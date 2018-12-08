
call aws s3api delete-bucket --bucket my-socialgood-dropzone --region us-east-1

call aws cloudformation delete-stack --stack-name  serverlessForGood

echo delete zip file.
del Importerpackage.zip
del SearchStatepackage.zip
del SearchCitypackage.zip

7z  a -tzip Searchdiseasecitypackage.zip  .\codeForGood\searchdiseasecityfunction\searchdiseasecityfunction.py .\codeForGood\pyneo4j\*
7z  a -tzip SearchStatepackage.zip  .\codeForGood\searchstatefunction\searchstatefunction.py .\codeForGood\pyneo4j\*
7z  a -tzip SearchCitypackage.zip  .\codeForGood\searchCityfunction\searchCityfunction.py .\codeForGood\pyneo4j\*
7z  a -tzip Importerpackage.zip  .\codeForGood\importer\importer.py .\codeForGood\pyneo4j\*

echo copy.
call aws s3 cp Searchdiseasecitypackage.zip s3://my-socialgood-package/Searchdiseasecitypackage.zip
call aws s3 cp SearchStatepackage.zip s3://my-socialgood-package/SearchStatepackage.zip
call aws s3 cp SearchCitypackage.zip s3://my-socialgood-package/SearchCitypackage.zip
call aws s3 cp Importerpackage.zip s3://my-socialgood-package/Importerpackage.zip


echo package.
call sam package  --template-file template.yaml    --output-template-file serverless-output.yaml   --s3-bucket my-socialgood-package


echo deploy.
call aws cloudformation deploy --template-file C:\Users\rickerg\git\serverlessForGood\sam-app\serverless-output.yaml --stack-name serverlessForGood --capabilities CAPABILITY_IAM

