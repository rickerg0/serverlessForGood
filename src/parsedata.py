

import os
import sys
import googlemaps
import json

# allTycho.write("Case,"+case.state.getName()+","+city.name+","+ d+","+case.year+","+case.week+","+case.number+","+city.lat+","+city.lon+"\n") 
  
header = ['Instance','State','City','disease','year','week','caseNumber','lat','lon']       

stateInstance = {}
numberOfInstances = 250
numberofRows=0
filepath = "../data/alltycho0.data"  
with open(filepath,"r") as fp: 
  
   line = fp.readline().strip('\n').split(",")
   f = open("../data1/entry_"+str(numberofRows)+".dat","w")
   jsonData={} 
   row =0
   
   while line:
       
        if len(line) == 9:
            #if 'Death' in line[0]:
            if line[1] in stateInstance:
                if line[0] in stateInstance[line[1]]:
                    if stateInstance[line[1]][line[0]] < numberOfInstances:
                        stateInstance[line[1]][line[0]] += 1
                else:
                 stateInstance[line[1]][line[0]] = 1
            else:
                stateInstance[line[1]] = {}
                stateInstance[line[1]][line[0]] = 1
                print(stateInstance)  
           
            if  stateInstance[line[1]][line[0]]  < numberOfInstances: 
                print(str(stateInstance[line[1]][line[0]]))
  
                f = open("../data1/entry_"+str(row)+".dat","w")
                jsonData={} 
               # print(row)
                print(stateInstance)               
                for i in range(0,9):
        #           print("header: "+header[i] + "  data: "+line[i])
                    jsonData[header[i]] = line[i]
            
                f.write(json.dumps(jsonData))  
                f.close() 
                numberofRows += 1
                row += 1
                

            else:  
                numberofRows += 1 
               
        #else:
         #   print("line length error" + str(len(line)))  
        #print("new line")          
        line = fp.readline().strip('\n').split(",")
       


        
        
        
    