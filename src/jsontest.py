import json


    
with open('results.dat') as f:
    data = json.load(f)

results = data['results']
print(results)

rows = data['results'][0]['data']   
    

for row in rows:   
    print(row)
    title = row['row'][0]['title']
    print(title)
print(f)
    
