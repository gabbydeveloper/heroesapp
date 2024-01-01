import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({providedIn: 'root'})
export class HeroesService {

  private baseUrl:string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  getHeroes():Observable<Hero[]> {

    // Tus credenciales
    const username = 'usertest';
    const password = '123456';

    // Codificar las credenciales en base64
    const base64Credentials = btoa(`${username}:${password}`);

    // Crear el encabezado de autorización
    const headers = new HttpHeaders({
      'Authorization': `Basic ${base64Credentials}`
    });

    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes`, {headers: headers});
  }

  getHeroById(id: string): Observable<Hero | undefined>{

    return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
            .pipe(
              catchError(error => of(undefined))
            );
  }

  getSuggestions(query: string): Observable<Hero[]>{
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${query}&_limit=6`);
  }

}
