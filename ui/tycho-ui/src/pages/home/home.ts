import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {Neo4jService} from '../../providers/neo4j-service/neo4j-service';
import {City} from '../../classes/City';
import {CityDisease} from '../../classes/CityDisease';
import { ModalController } from 'ionic-angular';
import { InfoPage } from '../modal/info_page';
import {DiseaseByCityYear} from '../../classes/DiseaseByCityYear';

declare var google;

@Component({
  selector: 'home-page',
  templateUrl: 'home.html',

})

export class HomePage {
    public states: any=[];
    public cities: any=[];
    public diseases: any=[];
    public markers: any=[];
    public yearsByCity: any=[];
    public listofCityDiseases: any[];
    localYearsByCity: any=[];
    public diseasesByCityYear: any=[];

  @ViewChild('map') mapElement: ElementRef;
    map: any;
    constructor(public navCtrl: NavController,public geolocation: Geolocation,public neo4jService: Neo4jService,public modalCtrl: ModalController) {

    }

    openModal() {
      let theResults: any=[];
      this.neo4jService.getByYearAndCity(this.theCity,this.theYearByCity)
                       .subscribe(result => {
                         theResults = result;
                         console.log('openModal ',theResults);
                         this.parseYearAndCity(theResults,this.theYearByCity);
                        var myModal = this.modalCtrl.create(InfoPage,{inData:this.diseasesByCityYear});
                         myModal.present();
                       });

      }

   closeModal() {
          myModal.closeModal();
        }

    onYearChange() {
      console.log('selected city',this.theCity.title );
      console.log('selected year',this.theYearByCity );

    }
    onStateChange(seletedState) {
        let cityData: any=[];
        // console.log('selected state',seletedState);
         this.neo4jService.getCities(this.theState)
                          .subscribe(result => {
                            cityData = result;
                            console.log('cityData ',cityData);
                            this.extractCities(cityData);
                          });
    }
    onCityChange() {
         let  thecityDiseases: any=[];
         console.log('selected title',this.theCity.title );
         console.log('selected latitude',this.theCity.latitude );
         console.log('selected latitude',this.theCity.longitude );
         this.getMap(this.theCity.latitude,this.theCity.longitude);
         this.neo4jService.getDiseasesByCity(this.theCity)
                          .subscribe(result => {
                           thecityDiseases = result;
                           console.log('onCityChange  ',thecityDiseases);
                             this.extractCityDiseases(thecityDiseases);
                             });
         console.log('getDiseasesByCity - extractCityDiseases',this.listofCityDisease );
         console.log('thecityDiseases - length',thecityDiseases.length );

         if(thecityDiseases.length >0 ) {
            this.addMarkers(this.listofCityDisease);
        }



         this.neo4jService.getYearsByCity(this.theCity)
                         .subscribe(result => {
                           this.localYearsByCity = result;
                           console.log('onCityChange - getYearsByCity  ',this.localYearsByCity);
                            this.extractYears(this.localYearsByCity);
                            });


    }
    onDiseaseChange() {
         let  thecityDiseases: any=[];
        // console.log('selected title',this.theDisease );
         this.neo4jService.getCitiesDiseases(this.theDisease)
                          .subscribe(result => {
                           thecityDiseases = result;
                        //   console.log('thecityDiseases  ',thecityDiseases);
                             this.extractCityDiseases(thecityDiseases)
                             });
        this.addMarker(this.theDisease,1);
    }
    ionViewDidLoad(){
       let states: any=[];
       let diseases: any=[];
       this.getMapUS();

        this.neo4jService.getStates()
                         .subscribe(result => {
                           states = result;
                           //console.log('ionViewDidLoad states ',states);
                           this.extractStates(states);
                         });

        this.neo4jService.getAllDiseases()
                         .subscribe(result => {
                          diseases = result;
                          this.extractDiseases(diseases);
                          });

    }

    parseYearAndCity(theResults,year){
       let rows=[];
       rows = theResults['results'][0]['data'];
       this.diseasesByCityYear = [];
       for (let i = 0; i < rows.length; i++) {
         //console.log('parseYearAndCity rows ',rows[i]['row']);
         let data = rows[i];
         let diseaseByCityYear = new DiseaseByCityYear();
         diseaseByCityYear.disease = data['row'][0].name;
         diseaseByCityYear.week =    data['row'][1].week;
         diseaseByCityYear.year = year;
         diseaseByCityYear.instance = data['row'][2][0].title;
         diseaseByCityYear.count = data['row'][3].count;
         console.log('parseYearAndCity diseaseByCityYear ',diseaseByCityYear);
         this.diseasesByCityYear.push(diseaseByCityYear);
      }
     console.log('parseYearAndCity ',this.diseasesByCityYear);
     }

    extractCities(cityData){
       let rows=[];
       rows = cityData['results'][0]['data'];
       this.cities = [];
       for (let i = 0; i < rows.length; i++) {
         let data = rows[i];
         console.log('extractCities rows ',data['row'][0].title);
         let city = new City();
         city.title = data['row'][0].title;
         city.latitude = data['row'][0].latitude;
         city.longitude = data['row'][0].longitude;
         this.cities.push(city);

      }
     console.log('cities ',this.cities);
     }

     extractYears(data){
       console.log('extractYears -data = ',data);

        let rows=[];
        rows = data['results'][0]['data'];
        this.yearsByCity = [];
        for (let i = 0; i < rows.length; i++) {
          console.log('extractYears ',rows[i]['row'][0]['year']);
          this.yearsByCity.push(rows[i]['row'][0]['year']);
       }

      }
    extractStates(data){
       let rows=[];
       rows = data['results'][0]['data'];
       this.states = [];
       for (let i = 0; i < rows.length; i++) {
         //console.log('loop-row ',rows[i]['row'][0]['title']);
         this.states.push(rows[i]['row'][0]['title']);
      }
    // console.log('states ',this.states);
     }

     extractDiseases(data){
        let rows=[];
        rows = data['results'][0]['data'];
        this.diseases = [];
        for (let i = 0; i < rows.length; i++) {
          //console.log('loop-row ',rows[i]['row'][0]['title']);
          this.diseases.push(rows[i]['row'][0]['name']);
       }
    //  console.log('Diseases ',this.diseases);
      }

      deleteMarkers(){
        for (let i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(null);
        }
        this.markers = [];
      }
      addMarker(theDisease,zindex){
      //  console.log('addMarker Diseases ',theDisease,' index '+zindex);
        let iconPath =     '../../assets/imgs/red.png';
        if (theDisease.title == "Case"){
            iconPath =     '../../assets/imgs/green.png';
         }
           let marker = new google.maps.Marker({
                                            position: new google.maps.LatLng(   theDisease.city.latitude,  theDisease.city.longitude),
                                            map: this.map,
                                            icon:iconPath,
                                            Index: zindex,
                                            animation: google.maps.Animation.DROP,
                                            title: theDisease.instance
                                        });
         let content = "<h4>"+theDisease.city.title+" : "+theDisease.instance+"</h4>";
         this.markers.push(marker);
         this.addInfoWindow(marker, content);

      }
      addMarkers(listofCityDisease){
       this.deleteMarkers();
       console.log('addMarkers    ',listofCityDisease );

       for(let i=0; i < listofCityDisease.length; i++){
             let cityDisease: CityDisease;
             cityDisease = listofCityDisease[i]
             this.addMarker(cityDisease,i+1000)

           }
      }

      extractCityDiseases(data){

        this.listofCityDiseases =[];
        let rows = data['results'][0]['data'][0];
        console.log('extractCityDiseases  rows[row][2] ',rows['row'][2][0]);
        console.log('extractCityDiseases  rows[row][2]  ',rows['row'][2].length );
          var city = new City();
          city.title = rows['row'][2][0].title;
          city.latitude = rows['row'][2][0].latitude;
          city.longitude = rows['row'][2][0].longitude;
          console.log('extractCityDiseases city ',city);
        for (let i = 0; i < rows['row'].length; i++) {

          let mydata = rows['row'][0];
          console.log('extractCityDiseases  rows[0]  ',mydata.length );
          for (let j = 0; j < mydata.length; j++) {
              let cityDisease = new CityDisease();
              cityDisease.instance = mydata[j].name;
              cityDisease.city =city;
          //    console.log('extractCityDiseases  name  ',mydata[j].name );
              this.listofCityDiseases.push(cityDisease);
            }
       }
     }

    addInfoWindow(marker, content){
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
    }

    loadMapLocal( ){
        this.geolocation.getCurrentPosition().then((position) => {
        this.getMap(position.coords.latitude,position.coords.longitude);

      }, (err) => {
        console.log(err);
      });
    }

    getMapUS() {
      let latlng = new google.maps.LatLng(39.5, -98.35);
          let mapOptions = {
              zoom: 5,
              center: latlng,
              mapTypeId: google.maps.MapTypeId.ROADMAP
          };

      	  this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    }

    getMap(latitude,longitude){

        let latLng = new google.maps.LatLng( latitude,  longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }




}
