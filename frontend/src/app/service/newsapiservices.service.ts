import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsapiservicesService {

  constructor(private _http: HttpClient) { }

  //Top hedline new api url
  newsApiUrl = "https://newsapi.org/v2/top-headlines?country=us&apiKey=6df12388cef149d3b793ad229d7e5ecd"

  //tech news api
  techApiUrl = "https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=6df12388cef149d3b793ad229d7e5ecd"

  //business news api
  businessApiUrl = "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=6df12388cef149d3b793ad229d7e5ecd"

  //Uyghur news aoi
  uyghurApiUrl ="https://newsapi.org/v2/everything?q=uyghur&sortBy=publishedAt&apiKey=6df12388cef149d3b793ad229d7e5ecd"
  
  //topheading()
  topHeading(): Observable<any> {
    return this._http.get(this.newsApiUrl);
  }

  //technews()
  techNews(): Observable<any> {
    return this._http.get(this.techApiUrl);
  }

  //Business news()
  businessNews(): Observable<any> {
    return this._http.get(this.businessApiUrl);
  }

  //Uyghur News()
  uyghurNews(): Observable<any>{
    return this._http.get(this.uyghurApiUrl);
  }


}
