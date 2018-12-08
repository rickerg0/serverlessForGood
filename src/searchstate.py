import json
from py2neo import Graph, Path,Node,Relationship
import neo4j 


header = ['Instance','State','City','disease','year','week','caseNumber','lat','lon']       

def Search_State(state):
    #print(data)
    

    graph = Graph("bolt://18.214.188.133:7687", auth=("neo4j", "new12345"))
    
    query = "MATCH (p:State{title: '"+state+"' }) RETURN p "
   
    foo = graph.run(query).data()
    
    print (foo)
    
    query = "MATCH (p:City )-[r:BELONGS_STATE]-() RETURN p"
    foo = graph.run(query).data()
    
    print (foo)
    
    query = "MATCH (state:State )-[r:HAS_CITY]-(city:City) RETURN state,city"
    foo = graph.run(query).data()
    
    print(foo[0])
        
    print(foo[0]['state']['title'])
    print(foo[0]['city']['title'])
    print(foo[0]['city']['latitude'])
    print(foo[0]['city']['longitude'])
   
Search_State("AL")  


