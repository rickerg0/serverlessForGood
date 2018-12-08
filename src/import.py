import json
from py2neo import Graph, Path,Node,Relationship
import neo4j 


header = ['Instance','State','City','disease','year','week','caseNumber','lat','lon']       

def import_content(data):
    #print(data)
    theData = json.loads(data)
    #print(theData)
    if "Case"  in theData['Instance'] :
        print(theData['City'])

    graph = Graph("bolt://localhost:7687", auth=("neo4j", "new12345"))
   
    
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
  
    yearNode = Node(header[4], year=theData[header[4]])
    graph.merge(yearNode, 'year','year')
  
    weekNode = Node(header[5], week=theData[header[5]])
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
    
  
    
numberofRows=0   
for numberofRows  in range(0,9997):
    fp = open("../data1/entry_"+str(numberofRows)+".dat","r")
    line = fp.readline() 
    print(line)
    import_content(line)  


