import { HttpClient  ,HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { HttpModule } from '@angular/http';
/*
  Generated class for the Neo4jServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class Neo4jService {
  constructor(public httpClient: HttpClient) {
    console.log('Hello Neo4jService Provider');
  }

  getAllDiseases(){

    //MATCH (n:disease) RETURN n LIMIT 25
    var basestatement =  '[{"statement":"MATCH (n:disease) RETURN n"}]';
      return this.get(basestatement);
  }
    get(basestatement){
       var query =  '{	"statements": '+ basestatement+'}';
       var myheaders = new HttpHeaders();
       myheaders = myheaders.append('Content-Type',  'application/json' );
       myheaders = myheaders.append('Authorization',  <basic auth goes here> );
       myheaders = myheaders.append('dataType',  'json' );
       console.log('get query',query);
       return this.httpClient.post('  http://localhost:7474/db/data/transaction',query,{headers:myheaders});
    }

    getYearsByCity(city){
      var basestatement =  '[{"statement":"MATCH ((w:week)-[e:EVENT_WEEK]-(i:Instance)-[r1:EVENT_YEAR]-(y:year)),(i)-[l:EVENTlOCATION]->(c:City{title:{city}}) RETURN DISTINCT y",	"parameters" : {  "city" :"'+ city.title +'" }}]';
      console.log('getYearsByCity basestatement',basestatement);
      return this.get(basestatement);
    }

    getCitiesDiseases(disease){
      var basestatement =  '[{"statement":"MATCH (d:disease{name:{disease}})-[r:EVENT]->(i:Instance)-[l:EVENTlOCATION]->(c:City) RETURN d,i,c",	"parameters" : {  "disease" :"'+ disease +'" }}]';
      return this.get(basestatement);
    }

    getDiseasesByCity(city){

      var basestatement =  '[{"statement":"MATCH (d:disease)-[r:EVENT]->(i:Instance)-[l:EVENTlOCATION]->(c:City{title:{city}}) RETURN collect(distinct(d)),collect(distinct(i)),collect(distinct(c))",	"parameters" : {  "city" :"'+ city.title +'" }}]';
        return this.get(basestatement);
    }
    getDiseasesByCityandYear(city,year){
//MATCH (d:disease)-[r:EVENT]->(i:Instance)-[r1:EVENT_YEAR]-(y:year{year:'1920'}),(i)-[l:EVENTlOCATION]->(c:City{title:'ANNISTON'}) RETURN DISTINCT d,collect(DISTINCT i),{count: count(i)}
      var basestatement =  '[{"statement":"MATCH (d:disease)-[r:EVENT]->(i:Instance)-[l:EVENTlOCATION]->(c:City{title:{city}}) RETURN d,i,c",	"parameters" : {  "city" :"'+ city.title +'" }}]';
        return this.get(basestatement);
    }
  getCities(selectedState){

      var basestatement =  '[{"statement":"MATCH (n:City)-[r:BELONGS_STATE]->(S:State{title:{theState}}) RETURN n",	"parameters" : {  "theState" :"'+ selectedState +'" }}]';
      return this.get(basestatement);
    }

  getStates(){
      var basestatement = '[{"statement":"MATCH (n:State) RETURN n"}]';
      return this.get(basestatement);
    }

   getByYearAndCity  (city,year){
    var basestatement =  '[{"statement":"MATCH (d:disease)-[r:EVENT]->(i:Instance)-[r1:EVENT_YEAR]-(y:year{year:{year}}),(i)-[l:EVENTlOCATION]->(c:City{title:{city}}),(i)-[EW:EVENT_WEEK]->(w:week) RETURN DISTINCT d,w,collect(DISTINCT i),{count: count(i)}",	"parameters" : {  "city" :"'+ city.title +'","year" :"'+ year +'" }}]';
   return this.get(basestatement);

   }
}
