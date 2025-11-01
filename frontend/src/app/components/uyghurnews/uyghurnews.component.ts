import { Component, OnInit } from '@angular/core';
import { NewsapiservicesService} from '../../service/newsapiservices.service';

@Component({
  selector: 'app-uyghurnews',
  templateUrl: './uyghurnews.component.html',
  styleUrls: ['./uyghurnews.component.css']
})
export class UyghurnewsComponent implements OnInit {

  constructor(private _services:NewsapiservicesService) { }
   // display data
   uyghurnewsDisplay: any = [];

  ngOnInit(): void {
    this._services.uyghurNews().subscribe((result)=>{
      console.log(result);
      this.uyghurnewsDisplay = result.articles;
    })
  }

}
