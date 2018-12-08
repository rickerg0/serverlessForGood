import sys
import json
import boto3
import botocore
from py2neo import Graph, Path,Node,Relationship
import neo4j 


header = ['Instance','State','City','disease','year','week','caseNumber','lat','lon']       
try:
    graph  = Graph("bolt://18.214.188.133:7687", auth=("neo4j", "new12345"))
except Exception as e:
    print("error "+str(e) ) 
    sys.exit()
       
def import_content(event, context):
   
    print(event['Records'])
  
    s3Client= boto3.client('s3')
  
    bucket_name =  event['Records'][0]['s3']['bucket']['name']
    filename = event['Records'][0]['s3']['object']['key']
    print("bucket_name "+bucket_name)
    print("filename "+filename)
    
    obj = s3Client.get_object(Bucket=bucket_name, Key=filename)
     # get lines inside the csv
    data = obj['Body'].read()
    print (data)
    theData = json.loads(data)
    #print(theData)
    if "Case"  in theData['Instance'] :
        print(theData['City'])

    instanceNode = Node(header[0], title=theData[header[0]])
    graph.create(instanceNode )
  
    stateNode = Node(header[1], title=theData[header[1]])
    graph.merge(stateNode, 'State','title')
  

    cityNode = Node(header[2], title=theData[header[2]] )
    cityNode['latitude'] = theData['lat']
    cityNode['longitude'] = theData['lon']
    graph.merge(cityNode, 'City','title')
  
    diseaseNode = Node(header[3], name=theData[header[3]])
    graph.merge(diseaseNode, 'disease','name')
  
    yearNode = Node(header[4], year="year: "+theData[header[4]])
    graph.merge(yearNode, 'year','year')
  
    weekNode = Node(header[5], week="week: "+theData[header[5]])
    graph.merge(weekNode, 'week','week')
  
   
    rs = Relationship(diseaseNode,"EVENT",instanceNode)
    graph.create(rs)
    
    
    try:
        rs = Relationship(instanceNode,"EVENTlOCATION",cityNode)
        graph.create(rs)
    except:
        print("EVENTlOCATION")
        pass
    
    try:
        rs = Relationship(stateNode,"HAS_CITY",cityNode)
        graph.create(rs)
    except:
        print("HAS_CITY")
        pass
    
    try:
        rs = Relationship(cityNode,"BELONGS_STATE",stateNode)
        graph.create(rs)
    except:
        print("BELONGS_STATE")
        pass
    
    try:
        rs = Relationship(instanceNode,"EVENT_YEAR",yearNode)
        graph.create(rs)
    except:
        print("EVENT_YEAR")
        pass
    
    try:
        rs = Relationship(instanceNode,"EVENT_WEEK",weekNode)
        graph.create(rs)
    except:
        print("EVENT_WEEK")
        pass
  
        
            
    return { "statusCode": 200}
    
