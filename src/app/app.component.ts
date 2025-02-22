import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Chair } from './chair/interfaces/chair';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title: string = 'Barber System';
  usuarios:any;

  constructor(
    private http: HttpClient){

  }
  // ngOnInit(): void {
  //   this.http.get('https://barberapi.softallweb.co/api/Usuario').subscribe({
  //     next: response => this.usuarios = response,
  //     error: error => console.log(error),
  //     complete:() =>  console.log('La solicitud esta completa')
  //   })
  //  }

  ngOnInit(): void {
    this.http.get('http://localhost:26900/api/Usuario').subscribe({
      next: response => this.usuarios = response,
      error: error => console.log(error),
      complete:() =>  console.log('La solicitud esta completa')
    })
   }

  }
