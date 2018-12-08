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

def Search_State(event, context):
    
    print(event)
    query = "MATCH (n:State) RETURN n "
 
    if event['queryStringParameters'] is not None:
        state = event['queryStringParameters']['searchstate']
        if state is not None:
            query = "MATCH (p:State{title: "+state.rstrip()+" }) RETURN p "
                 
    
    foo = graph.run(query).data()
    
    return {
        "statusCode": 200,
        "body": json.dumps(foo),
    }
