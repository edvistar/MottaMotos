import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs"
import { ApiResponse } from "src/app/Interfaces/api-response"
import { environment } from "src/environments/environment.prod"
import { Product } from "../interfaces/product";


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  baseUrl: string = environment.apiUrl + 'product/'
  constructor(private http: HttpClient) { }

  lista() : Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${this.baseUrl}`)
  }
  getProductById(id: number): Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${this.baseUrl}${id}`);
    }

    editar(request: Product): Observable<ApiResponse>;
    editar(request: FormData): Observable<ApiResponse>;
    editar(request: Product | FormData): Observable<ApiResponse> {
      return this.http.post<ApiResponse>(`${this.baseUrl}`, request);
    }
    crear(request: Product): Observable<ApiResponse>;
    crear(request: FormData): Observable<ApiResponse>;
    crear(request: Product | FormData): Observable<ApiResponse> {
      return this.http.post<ApiResponse>(`${this.baseUrl}`, request);
    }



  eliminar(id: number): Observable<ApiResponse>{
      return this.http.delete<ApiResponse>(`${this.baseUrl}${id}`)
    }
}
