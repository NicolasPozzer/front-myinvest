import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inversion } from '../model/inversion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SInversionService {

  //private URL = 'https://alertsn7-back.onrender.com/tickets';
  private URL = 'http://localhost:8080/inversiones';

  constructor(private httpClient: HttpClient) { }

  public getInversiones(): Observable<Inversion[]> {
    return this.httpClient.get<Inversion[]>(this.URL +'/traertodo');
  }

  public saveInversion(tic: Inversion): Observable<any>{
    return this.httpClient.post<any>(this.URL + '/crear', tic);
  }

  public deleteInversion(id: number): Observable<any>{
    return this.httpClient.delete<any>(this.URL + `/borrar/${id}`);
  }

  public findInversion(id: number): Observable<Inversion>{
    return this.httpClient.get<Inversion>(this.URL + `/traer/${id}`);
  } 

  public editInversion(id: number, tic: Inversion): Observable<any>{
    return this.httpClient.put<any>(this.URL + `/edit/${id}`, tic);
  }
}
