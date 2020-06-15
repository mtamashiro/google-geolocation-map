import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  styles: ['agm-map { height: 500px; /* height is required */ }'],

})
export class MapComponent implements OnInit {

  public origin_street = '';
  public destination_street = '';


  public lat = -23.6844243; //Local definido para iniciar o mapa
  public lng = -46.4537972; // Local definido para iniciar o mapa
  private GoogleAPIKey = 'YOUR API KEY';
  public origin: { lng: () => number; lat: () => number };
  public destination: { lng: () => number; lat: () => number };
  public geoloc_origin = '';
  public geoloc_destination = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

  }

  getDirection() {
    this.getGeolocation('origin');
    this.getGeolocation('destination');
  }

  getGeolocation(item){

    var address = '';
    if(item == 'origin'){
      address = this.prepareAddressString(this.origin_street);
    }else if(item == 'destination'){
      address = this.prepareAddressString(this.destination_street);
    }

    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + this.GoogleAPIKey).subscribe(data => {
      if ((data as any).status == 'OK') {
        var address_lat = (data as any).results[0].geometry.location.lat;
        var address_lng = (data as any).results[0].geometry.location.lng;

        if(item == 'origin'){
          this.geoloc_origin = address_lat + ', ' + address_lng;
          this.origin = { lat:  address_lat, lng: address_lng };
        }else if(item == 'destination'){
          this.geoloc_destination = address_lat + ', ' + address_lng;
          this.destination = { lat:  address_lat, lng: address_lng };
        }
      } else {
        alert((data as any).status);
      }
    }, error => {
      alert(error);
    });

  }


  private prepareAddressString(address) {
    address = address.replace(/ /g, '+');
    return address;
  }

}
